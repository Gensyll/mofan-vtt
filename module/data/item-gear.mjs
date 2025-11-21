import MofanItemBase from './base-item.mjs';

export default class MofanGear extends MofanItemBase {
  static LOCALIZATION_PREFIXES = [
    'MOFAN.Item.base',
    'MOFAN.Item.Gear',
  ];

  static defineSchema() {
    const fields = foundry.data.fields;
    const requiredInteger = { required: true, nullable: false, integer: true };
    const schema = super.defineSchema();

    schema.quantity = new fields.NumberField({
      ...requiredInteger,
      initial: 1,
      min: 1,
    });
    schema.weight = new fields.NumberField({
      required: true,
      nullable: false,
      initial: 0,
      min: 0,
    });
    schema.size = new fields.StringField({
      required: true,
      initial: "small",
      choices: ["tiny","small","medium","large","huge"]
    });

    //TODO: refactor D20 rules
    // Break down roll formula into three independent fields
    schema.roll = new fields.SchemaField({
      diceNum: new fields.NumberField({
        ...requiredInteger,
        initial: 1,
        min: 1,
      }),
      diceSize: new fields.StringField({ initial: 'd10' }),
      diceBonus: new fields.StringField({
        initial: '+@for.mod+ceil(@lvl / 2)',
      }),
    });

    schema.formula = new fields.StringField({ blank: true });

    return schema;
  }

  prepareDerivedData() {
    // Build the formula dynamically using string interpolation
    const roll = this.roll;

    this.formula = `${roll.diceNum}${roll.diceSize}${roll.diceBonus}`;
  }
}
