import MofanActorBase from './base-actor.mjs';
import { defineSkillSchema, prepareSkills } from '../helpers/skills.mjs';
import { getSpeciesAbilityModifiers } from '../helpers/species.mjs';

export default class MofanNPC extends MofanActorBase {
  static LOCALIZATION_PREFIXES = [
    ...super.LOCALIZATION_PREFIXES,
    'MOFAN.Actor.NPC',
  ];

  static defineSchema() {
    const fields = foundry.data.fields;
    const requiredInteger = { required: true, nullable: false, integer: true };
    const schema = super.defineSchema();

    schema.cr = new fields.NumberField({
      ...requiredInteger,
      initial: 1,
      min: 0,
    });

    schema.abilities = new fields.SchemaField(
      Object.keys(CONFIG.MOFAN.abilities).reduce((obj, ability) => {
        obj[ability] = new fields.SchemaField({
          value: new fields.NumberField({
            ...requiredInteger,
            initial: 0,
            min: -5,
            max: 5,
          }),
        });
        return obj;
      }, {})
    );

    schema.skills = defineSkillSchema();

    return schema;
  }

  prepareDerivedData() {
    this.xp = this.cr * this.cr * 100;

    const speciesMods = getSpeciesAbilityModifiers(this.parent);
    for (const key in this.abilities) {
      const speciesBonus = speciesMods[key] ?? 0;
      this.abilities[key].speciesBonus = speciesBonus;
      this.abilities[key].mod = this.abilities[key].value + speciesBonus;
      this.abilities[key].label =
        game.i18n.localize(CONFIG.MOFAN.abilities[key].label.long) ?? key;
    }

    prepareSkills(this);
  }

  getRollData() {
    const data = {};

    if (this.abilities) {
      for (let [k, v] of Object.entries(this.abilities)) {
        data[k] = foundry.utils.deepClone(v);
      }
    }

    if (this.skills) {
      for (let [k, v] of Object.entries(this.skills)) {
        data[k] = foundry.utils.deepClone(v);
      }
    }

    data.cr = this.cr;
    data.xp = this.xp;

    return data;
  }
}
