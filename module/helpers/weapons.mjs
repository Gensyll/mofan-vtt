/**
 * Weapon attack/damage helpers: chat cards and roll dialogs.
 */

/**
 * Attack ability from Weapon Quality: Agile → Dexterity, Sturdy → Fortitude.
 * @param {Item|object} item  Item document or TypeDataModel (`this` on a weapon).
 * @returns {'dex'|'for'}
 */
export function getWeaponAttackAbility(item) {
  const properties = item.system?.properties ?? item.properties;
  if (properties?.has('sturdy')) return 'for';
  return 'dex';
}

/**
 * @param {Item} item
 * @returns {number}
 */
export function getWeaponAttackAbilityMod(item) {
  const key = getWeaponAttackAbility(item);
  return Number(item.actor?.system?.abilities?.[key]?.mod) || 0;
}

/**
 * @param {number} value
 * @returns {string}
 */
function signedTerm(value) {
  const n = Number(value) || 0;
  return n < 0 ? `- ${Math.abs(n)}` : `+ ${n}`;
}

/**
 * Display formula for the attack dialog (resolved numbers + @bonus).
 * @param {Item} item
 * @returns {string}
 */
export function getWeaponAttackDisplayFormula(item) {
  const die = CONFIG.MOFAN.attackDie ?? '1d10';
  const mod = getWeaponAttackAbilityMod(item);
  const bonus = Number(item.system.attackBonus) || 0;
  return `${die} ${signedTerm(mod)} ${signedTerm(bonus)} + @bonus`;
}

/**
 * Executable attack formula without situational bonus.
 * @param {Item} item
 * @returns {string}
 */
export function getWeaponAttackBaseFormula(item) {
  const die = CONFIG.MOFAN.attackDie ?? '1d10';
  const mod = getWeaponAttackAbilityMod(item);
  const bonus = Number(item.system.attackBonus) || 0;
  return `${die} ${signedTerm(mod)} ${signedTerm(bonus)}`;
}

/**
 * @param {Item} item
 * @returns {string}
 */
export function getWeaponDamageDisplayFormula(item) {
  const die = item.system.damageDie || '0';
  return `${die} + @bonus`;
}

/**
 * @param {Item} item
 * @returns {string}
 */
export function getWeaponDamageBaseFormula(item) {
  return item.system.damageDie || '0';
}

/**
 * @param {string} baseFormula
 * @param {string} [situational]
 * @returns {string}
 */
export function combineRollFormula(baseFormula, situational) {
  const extra = String(situational ?? '').trim();
  if (!extra) return baseFormula;
  return `${baseFormula} + (${extra})`;
}

/**
 * @returns {Record<string, string>}
 */
function getRollModeOptions() {
  const modes = CONFIG.Dice.rollModes ?? {};
  const options = {};
  for (const [key, label] of Object.entries(modes)) {
    options[key] =
      typeof label === 'string' ? game.i18n.localize(label) : key;
  }
  return options;
}

/**
 * Selected weapon properties in config order, with localized label/description.
 * @param {Item} item
 * @returns {Array<{key: string, label: string, description: string}>}
 */
export function getSelectedWeaponProperties(item) {
  const selected = item.system.properties;
  const selectedSet =
    selected instanceof Set ? selected : new Set(selected ?? []);
  const properties = [];
  for (const [key, data] of Object.entries(CONFIG.MOFAN.weaponProperties ?? {})) {
    if (!selectedSet.has(key)) continue;
    properties.push({
      key,
      label: game.i18n.localize(data.label),
      description: game.i18n.localize(data.description),
    });
  }
  return properties;
}

/**
 * Post a weapon summary card with Attack and Damage buttons.
 * @param {Item} item
 * @returns {Promise<ChatMessage>}
 */
export async function postWeaponChatCard(item) {
  const enricher = foundry.applications?.ux?.TextEditor?.implementation ?? TextEditor;
  const description = await enricher.enrichHTML(item.system.description ?? '', {
    secrets: false,
    rollData: item.getRollData(),
    relativeTo: item,
  });

  const categoryKey = item.system.category;
  const categoryLabel = categoryKey
    ? game.i18n.localize(CONFIG.MOFAN.weaponCategories[categoryKey] ?? categoryKey)
    : '';

  const properties = getSelectedWeaponProperties(item);
  const hasDetails =
    Boolean(item.system.description?.trim()) || properties.length > 0;

  const content = await renderTemplate(
    'systems/mofan-vtt/templates/chat/weapon-card.hbs',
    {
      item,
      description,
      categoryLabel,
      range: item.system.range,
      rangeUnit: game.i18n.localize('MOFAN.Item.Weapon.RangeUnit'),
      damageDie: item.system.damageDie,
      properties,
      hasDetails,
    }
  );

  return ChatMessage.create({
    speaker: ChatMessage.getSpeaker({ actor: item.actor }),
    rollMode: game.settings.get('core', 'rollMode'),
    content,
    flags: {
      'mofan-vtt': {
        weaponUuid: item.uuid,
      },
    },
  });
}

/**
 * Open the shared roll dialog and post the result to chat.
 * @param {Item} item
 * @param {'attack'|'damage'} kind
 * @returns {Promise<Roll|void>}
 */
export async function promptWeaponRoll(item, kind) {
  if (!item?.actor) {
    ui.notifications.warn(game.i18n.localize('MOFAN.Weapon.NoActor'));
    return;
  }

  const isAttack = kind === 'attack';
  const title = game.i18n.format(
    isAttack ? 'MOFAN.Weapon.AttackRoll' : 'MOFAN.Weapon.DamageRoll',
    { name: item.name }
  );
  const displayFormula = isAttack
    ? getWeaponAttackDisplayFormula(item)
    : getWeaponDamageDisplayFormula(item);
  const baseFormula = isAttack
    ? getWeaponAttackBaseFormula(item)
    : getWeaponDamageBaseFormula(item);

  const content = await renderTemplate(
    'systems/mofan-vtt/templates/dialogs/weapon-roll.hbs',
    {
      displayFormula,
      rollMode: game.settings.get('core', 'rollMode'),
      rollModes: getRollModeOptions(),
    }
  );

  const DialogV2 = foundry.applications?.api?.DialogV2;
  let formData = null;

  if (DialogV2?.prompt) {
    formData = await DialogV2.prompt({
      window: { title },
      position: { width: 480 },
      classes: ['mofan-weapon-roll-app'],
      content,
      ok: {
        label: game.i18n.localize('MOFAN.Weapon.Roll'),
        callback: (_event, button) => {
          const FormDataExtendedClass =
            foundry.applications?.ux?.FormDataExtended ?? FormDataExtended;
          return new FormDataExtendedClass(button.form).object;
        },
      },
      rejectClose: false,
    });
  } else {
    formData = await new Promise((resolve) => {
      new Dialog({
        title,
        content,
        buttons: {
          roll: {
            label: game.i18n.localize('MOFAN.Weapon.Roll'),
            callback: (html) => {
              const form = html[0].querySelector('form') ?? html[0];
              resolve(new FormDataExtended(form).object);
            },
          },
        },
        close: () => resolve(null),
      }).render(true);
    });
  }

  if (!formData) return;

  const formula = combineRollFormula(baseFormula, formData.bonus);
  if (typeof Roll.validate === 'function' && !Roll.validate(formula)) {
    ui.notifications.warn(game.i18n.localize('MOFAN.Weapon.InvalidFormula'));
    return;
  }

  let roll;
  try {
    roll = new Roll(formula, item.actor.getRollData());
  } catch (err) {
    ui.notifications.warn(game.i18n.localize('MOFAN.Weapon.InvalidFormula'));
    return;
  }

  const flavor = isAttack
    ? game.i18n.format('MOFAN.Weapon.AttackRoll', { name: item.name })
    : game.i18n.format('MOFAN.Weapon.DamageRoll', { name: item.name });

  await roll.toMessage({
    speaker: ChatMessage.getSpeaker({ actor: item.actor }),
    flavor,
    rollMode: formData.rollMode || game.settings.get('core', 'rollMode'),
  });
  return roll;
}

/**
 * Handle Attack/Damage buttons on weapon chat cards.
 * @param {PointerEvent} event
 */
export async function onWeaponCardAction(event) {
  event.preventDefault();
  event.stopPropagation();
  const button = event.currentTarget;
  const action = button.dataset.mofanWeaponAction;
  const uuid = button.dataset.uuid;
  if (!uuid || !['weaponAttack', 'weaponDamage'].includes(action)) return;

  const item = await fromUuid(uuid);
  if (!item || item.type !== 'weapon') {
    ui.notifications.warn(game.i18n.localize('MOFAN.Weapon.MissingItem'));
    return;
  }

  return promptWeaponRoll(
    item,
    action === 'weaponAttack' ? 'attack' : 'damage'
  );
}

/**
 * Bind Attack/Damage buttons after a chat message renders.
 * @param {ChatMessage} _message
 * @param {HTMLElement|JQuery} html
 */
export function onRenderWeaponChatCard(_message, html) {
  const root = html instanceof HTMLElement ? html : html[0];
  if (!root) return;
  root.querySelectorAll('[data-mofan-weapon-action]').forEach((button) => {
    button.addEventListener('click', onWeaponCardAction);
  });
}
