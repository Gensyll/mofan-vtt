import MofanFeatureBase from './base-item-feature.mjs';

export default class MofanFeature extends MofanFeatureBase {
  static LOCALIZATION_PREFIXES = [
    ...super.LOCALIZATION_PREFIXES,
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

    schema.unlockLevel = new fields.NumberField({
      required: true,
      nullable: false,
      integer: true,
      initial: 1,
      min: 1,
    });

    return schema;
  }
}
