import MofanItemBase from './base-item.mjs';

export default class MofanDiscipline extends MofanItemBase {
  static LOCALIZATION_PREFIXES = [
    'MOFAN.Item.base',
    'MOFAN.Item.Discipline',
  ];

  /** @type {string[]} */
  static SHEET_PARTS = ['attributesDiscipline', 'effects'];

  static defineSchema() {
    const fields = foundry.data.fields;
    const schema = super.defineSchema();

    schema.traits = new fields.SetField(
      new fields.StringField({
        required: true,
        blank: false,
        choices: () => Object.keys(CONFIG.MOFAN.disciplineTraits),
      }),
      { required: true, nullable: false }
    );

    schema.healthScaling = new fields.NumberField({
      required: true,
      nullable: false,
      integer: true,
      initial: 0,
      min: 0,
    });

    schema.prerequisites = new fields.ArrayField(
      new fields.SchemaField({
        uuid: new fields.StringField({ required: true, blank: false }),
        name: new fields.StringField({ required: true, blank: false }),
        level: new fields.NumberField({
          required: true,
          nullable: false,
          integer: true,
          initial: 1,
          min: 1,
        }),
      }),
      { required: true, nullable: false, initial: [] }
    );

    schema.level = new fields.NumberField({
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
