import {
  removeFeaturesForSpecies,
  syncActorSpeciesFeatures,
} from '../helpers/species.mjs';
import { postWeaponChatCard } from '../helpers/weapons.mjs';

/**
 * Extend the basic Item with some very simple modifications.
 * @extends {Item}
 */
export class MofanItem extends Item {
  /**
   * Augment the basic Item data model with additional dynamic data.
   */
  prepareData() {
    // As with the actor class, items are documents that can have their data
    // preparation methods overridden (such as prepareBaseData()).
    super.prepareData();
  }

  /**
   * When an owned Species is deleted, drop its innate Features and clear the header field.
   * @override
   */
  async _onDelete(options, userId) {
    if (this.type === 'species' && this.actor && !this.actor._speciesCleanup) {
      this.actor._speciesCleanup = true;
      try {
        await removeFeaturesForSpecies(this.actor);
        if (this.actor.system.species) {
          await this.actor.update({ 'system.species': '' });
        }
      } finally {
        delete this.actor._speciesCleanup;
      }
    }
    return super._onDelete(options, userId);
  }

  /**
   * Re-sync innate Features when an owned Species list changes.
   * @override
   */
  async _onUpdate(changed, options, userId) {
    if (
      this.type === 'species' &&
      this.actor &&
      foundry.utils.hasProperty(changed, 'system.innateFeatures')
    ) {
      await syncActorSpeciesFeatures(this.actor, this);
    }
    return super._onUpdate(changed, options, userId);
  }

  /**
   * Prepare a data object which defines the data schema used by dice roll commands against this Item
   * @override
   */
  getRollData() {
    // Starts off by populating the roll data with a shallow copy of `this.system`
    const rollData = { ...this.system };

    // Quit early if there's no parent actor
    if (!this.actor) return rollData;

    // If present, add the actor's roll data
    rollData.actor = this.actor.getRollData();

    return rollData;
  }

  /**
   * Spend AP for feature use when owned by an actor.
   * @returns {Promise<boolean>} true if the roll/use may continue
   */
  async _spendFeatureActionPoints() {
    if (!CONFIG.MOFAN.usableFeatureTypes.includes(this.type) || !this.actor)
      return true;
    const cost = Number(this.system.apCost) || 0;
    if (cost <= 0) return true;

    const current = Number(this.actor.system.power?.value) || 0;
    if (current < cost) {
      ui.notifications.warn(
        game.i18n.format('MOFAN.Feature.InsufficientAP', {
          cost,
          current,
        })
      );
      return false;
    }

    let confirmed = true;
    const content = game.i18n.format('MOFAN.Feature.SpendAPContent', {
      cost,
      name: this.name,
    });
    const title = game.i18n.localize('MOFAN.Feature.SpendAPTitle');
    if (foundry.applications?.api?.DialogV2?.confirm) {
      confirmed = await foundry.applications.api.DialogV2.confirm({
        window: { title },
        content: `<p>${content}</p>`,
      });
    } else {
      confirmed = await Dialog.confirm({
        title,
        content: `<p>${content}</p>`,
      });
    }
    if (!confirmed) return false;

    await this.actor.update({
      'system.power.value': Math.max(0, current - cost),
    });
    return true;
  }

  /**
   * Handle clickable rolls.
   * @param {Event} event   The originating click event
   * @private
   */
  async roll(event) {
    if (this.type === 'weapon') {
      return postWeaponChatCard(this);
    }

    const item = this;

    if (!(await this._spendFeatureActionPoints())) return;

    // Initialize chat data.
    const speaker = ChatMessage.getSpeaker({ actor: this.actor });
    const rollMode = game.settings.get('core', 'rollMode');
    const label = `[${item.type}] ${item.name}`;

    // If there's no roll data, send a chat message.
    if (!this.system.formula) {
      ChatMessage.create({
        speaker: speaker,
        rollMode: rollMode,
        flavor: label,
        content: item.system.description ?? '',
      });
    }
    // Otherwise, create a roll and send a chat message from it.
    else {
      // Retrieve roll data.
      const rollData = this.getRollData();

      // Invoke the roll and submit it to chat.
      const roll = new Roll(rollData.formula, rollData.actor);
      // If you need to store the value first, uncomment the next line.
      // const result = await roll.evaluate();
      roll.toMessage({
        speaker: speaker,
        rollMode: rollMode,
        flavor: label,
      });
      return roll;
    }
  }
}
