import MofanItemBase from './base-item.mjs';

/**
 * Shared schema for discipline Features and Innate Features.
 */
export default class MofanFeatureBase extends MofanItemBase {
  static LOCALIZATION_PREFIXES = [
    'MOFAN.Item.base',
    'MOFAN.Item.Feature',
  ];

  static defineSchema() {
    const fields = foundry.data.fields;
    const schema = super.defineSchema();

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

    schema.sourceUuid = new fields.StringField({
      required: true,
      blank: true,
      initial: '',
    });

    return schema;
  }
}
