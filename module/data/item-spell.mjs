import MofanItemBase from './base-item.mjs';

export default class MofanSpell extends MofanItemBase {
  static LOCALIZATION_PREFIXES = [
    'MOFAN.Item.base',
    'MOFAN.Item.Spell',
  ];

  static defineSchema() {
    const fields = foundry.data.fields;
    const schema = super.defineSchema();

    schema.spellLevel = new fields.NumberField({
      required: true,
      nullable: false,
      integer: true,
      initial: 1,
      min: 1,
      max: 9,
    });

    return schema;
  }
}
