import MofanItemBase from './base-item.mjs';

export default class MofanSpecies extends MofanItemBase {
  static LOCALIZATION_PREFIXES = [
    'MOFAN.Item.base',
    'MOFAN.Item.Species',
  ];

  /** @type {string[]} */
  static SHEET_PARTS = ['attributesSpecies', 'effects'];

  static defineSchema() {
    const fields = foundry.data.fields;
    const schema = super.defineSchema();
    const abilityChoices = () => Object.keys(CONFIG.MOFAN.abilities);

    schema.statBonuses = new fields.ArrayField(
      new fields.StringField({
        required: true,
        blank: false,
        choices: abilityChoices,
      }),
      {
        required: true,
        nullable: false,
        initial: () => ['awr', 'cha'],
      }
    );

    schema.statFlaw = new fields.StringField({
      required: true,
      blank: false,
      initial: 'dex',
      choices: abilityChoices,
    });

    schema.size = new fields.StringField({
      required: true,
      blank: false,
      initial: 'medium',
      choices: () => Object.keys(CONFIG.MOFAN.speciesSizes),
    });

    schema.hpBonus = new fields.NumberField({
      required: true,
      nullable: false,
      integer: true,
      initial: 0,
    });

    schema.innateFeatures = new fields.ArrayField(
      new fields.SchemaField({
        uuid: new fields.StringField({ required: true, blank: false }),
        name: new fields.StringField({ required: true, blank: false }),
      }),
      { required: true, nullable: false, initial: [] }
    );

    schema.sourceUuid = new fields.StringField({
      required: true,
      blank: true,
      initial: '',
    });

    return schema;
  }
}
