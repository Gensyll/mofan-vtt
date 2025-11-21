import MofanItemBase from './base-item.mjs';

export default class MofanItemLootable extends MofanItemBase {
        static LOCALIZATION_PREFIXES = [
        'MOFAN.Item.base',
        'MOFAN.Item.Lootable',
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
        schema.price = new fields.NumberField({
            required: true,
            initial: 0,
            nullable: false
        });

        return schema;
    }
}