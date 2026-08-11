import MofanItemBase from './base-item.mjs';

export default class MofanFeature extends MofanItemBase {
  static LOCALIZATION_PREFIXES = [
    'MOFAN.Item.base',
    'MOFAN.Item.Feature',
  ];

  /** @type {string[]} */
  static SHEET_PARTS = ['attributesFeature', 'effects'];

  static defineSchema() {
    const fields = foundry.data.fields;
    const schema = super.defineSchema();

    schema.parentDiscipline = new fields.StringField({
      required: true,
      blank: true,
      initial: '',
    });

    schema.traits = new fields.SetField(
      new fields.StringField({
        required: true,
        blank: false,
        choices: () => Object.keys(CONFIG.MOFAN.featureTraits),
      }),
      { required: true, nullable: false }
    );

    schema.apCost = new fields.NumberField({
      required: true,
      nullable: false,
      integer: true,
      initial: 0,
      min: 0,
    });

    schema.unlockLevel = new fields.NumberField({
      required: true,
      nullable: false,
      integer: true,
      initial: 1,
      min: 1,
    });

    schema.sourceUuid = new fields.StringField({
      required: true,
      blank: true,
      initial: '',
    });

    return schema;
  }
}
