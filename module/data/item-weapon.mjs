import MofanItemLootable from './base-item-lootable.mjs';
import { getWeaponAttackAbility } from '../helpers/weapons.mjs';

export default class MofanWeapon extends MofanItemLootable {
  static LOCALIZATION_PREFIXES = ['MOFAN.Item.base', 'MOFAN.Item.Weapon'];

  /** @type {string[]} */
  static SHEET_PARTS = ['attributesWeapon'];

  static defineSchema() {
    const fields = foundry.data.fields;
    const requiredInteger = { required: true, nullable: false, integer: true };
    const schema = super.defineSchema();

    schema.category = new fields.StringField({
      required: true,
      blank: false,
      initial: 'melee',
      choices: () => Object.keys(CONFIG.MOFAN.weaponCategories),
    });

    schema.apCost = new fields.NumberField({
      ...requiredInteger,
      initial: 1,
      min: 0,
    });

    schema.attackBonus = new fields.NumberField({
      ...requiredInteger,
      initial: 0,
    });

    schema.damageDie = new fields.StringField({
      required: true,
      blank: false,
      initial: '1d6',
    });

    schema.reloadCost = new fields.NumberField({
      ...requiredInteger,
      initial: 0,
      min: 0,
    });

    schema.range = new fields.NumberField({
      ...requiredInteger,
      initial: 1,
      min: 0,
    });

    schema.properties = new fields.SetField(
      new fields.StringField({
        required: true,
        blank: false,
        choices: () => Object.keys(CONFIG.MOFAN.weaponProperties),
      }),
      { required: true, nullable: false }
    );

    schema.wieldingRequirements = new fields.ArrayField(
      new fields.SchemaField({
        uuid: new fields.StringField({ required: true, blank: false }),
        name: new fields.StringField({ required: true, blank: false }),
        type: new fields.StringField({ required: true, blank: false }),
        level: new fields.NumberField({
          ...requiredInteger,
          initial: 1,
          min: 1,
        }),
      }),
      { required: true, nullable: false, initial: [] }
    );

    schema.formula = new fields.StringField({ blank: true });

    return schema;
  }

  prepareDerivedData() {
    const die = CONFIG.MOFAN.attackDie ?? '1d10';
    const ability = getWeaponAttackAbility(this);
    const bonus = Number(this.attackBonus) || 0;
    const bonusTerm = bonus < 0 ? `- ${Math.abs(bonus)}` : `+ ${bonus}`;
    this.formula = `${die} + @${ability}.mod ${bonusTerm}`;
  }
}
