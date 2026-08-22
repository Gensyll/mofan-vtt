import MofanActorBase from './base-actor.mjs';
import {
  calculateDisciplinePointsSpent,
  calculateDisciplinePointsTotal,
} from '../helpers/disciplines.mjs';
import { defineSkillSchema, prepareSkills } from '../helpers/skills.mjs';
import { getSpeciesAbilityModifiers } from '../helpers/species.mjs';

export default class MofanCharacter extends MofanActorBase {
  static LOCALIZATION_PREFIXES = [
    ...super.LOCALIZATION_PREFIXES,
    'MOFAN.Actor.Character',
  ];

  static defineSchema() {
    const fields = foundry.data.fields;
    const requiredInteger = { required: true, nullable: false, integer: true };
    const schema = super.defineSchema();

    schema.attributes = new fields.SchemaField({
      level: new fields.SchemaField({
        value: new fields.NumberField({ ...requiredInteger, initial: 1 }),
      }),
    });

    // Iterate over ability names and create a new SchemaField for each.
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
    const speciesMods = getSpeciesAbilityModifiers(this.parent);

    // Loop through ability scores, and add their modifiers to our sheet output.
    for (const key in this.abilities) {
      const speciesBonus = speciesMods[key] ?? 0;
      this.abilities[key].speciesBonus = speciesBonus;
      // Calculate the modifier according to Mofan rules (score = modifier)
      this.abilities[key].mod = this.abilities[key].value + speciesBonus;
      // Handle ability label localization.
      this.abilities[key].label =
        game.i18n.localize(CONFIG.MOFAN.abilities[key].label.long) ?? key;
    }

    prepareSkills(this);

    const actor = this.parent;
    const total = calculateDisciplinePointsTotal(
      this.attributes.level.value ?? 1
    );
    const spent = actor ? calculateDisciplinePointsSpent(actor) : 0;
    this.disciplinePoints = {
      total,
      spent,
      available: total - spent,
    };
  }

  getRollData() {
    const data = {};

    // Copy the ability scores to the top level, so that rolls can use
    // formulas like `@dex.mod + 4`.
    if (this.abilities) {
      for (let [k, v] of Object.entries(this.abilities)) {
        data[k] = foundry.utils.deepClone(v);
      }
    }

    // Copy the skill scores to the top level, so that rolls can use
    // formulas like `@arc.mod + 4`.
    if (this.skills) {
      for (let [k, v] of Object.entries(this.skills)) {
        data[k] = foundry.utils.deepClone(v);
      }
    }

    data.lvl = this.attributes.level.value;

    return data;
  }
}
