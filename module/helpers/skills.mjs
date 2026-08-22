/**
 * Shared skill schema and derived totals (parent abilities + training).
 */

/** Highest training rank (Legendary) and persisted max. */
export const SKILL_TRAINING_MAX = 5;

/**
 * @param {string} abilityKey
 * @returns {string}
 */
function abilityAbbreviation(abilityKey) {
  const raw =
    game.i18n.localize(CONFIG.MOFAN.abilities[abilityKey]?.abbreviation) ??
    abilityKey;
  return raw.charAt(0).toUpperCase() + raw.slice(1);
}

/**
 * @returns {foundry.data.fields.SchemaField}
 */
export function defineSkillSchema() {
  const fields = foundry.data.fields;
  const requiredInteger = { required: true, nullable: false, integer: true };
  return new fields.SchemaField(
    Object.keys(CONFIG.MOFAN.skills).reduce((obj, skill) => {
      obj[skill] = new fields.SchemaField({
        training: new fields.NumberField({
          ...requiredInteger,
          initial: 0,
          min: 0,
          max: SKILL_TRAINING_MAX,
        }),
      });
      return obj;
    }, {})
  );
}

/**
 * Derive skill totals after ability mods are prepared.
 * @param {object} model  Actor type data (character or NPC)
 */
export function prepareSkills(model) {
  if (!model.skills) return;

  for (const key in model.skills) {
    const skill = model.skills[key];
    const cfg = CONFIG.MOFAN.skills[key];
    const ab1 = model.abilities?.[cfg?.parent_ability1]?.mod ?? 0;
    const ab2 = model.abilities?.[cfg?.parent_ability2]?.mod ?? 0;
    const training = Math.min(
      SKILL_TRAINING_MAX,
      Math.max(0, Number(skill.training) || 0)
    );
    const rank = CONFIG.MOFAN.skillTraining[training];
    const bonus = rank?.bonus ?? training;

    skill.mod = ab1 + ab2 + bonus;
    skill.label = game.i18n.localize(cfg?.label) ?? key;
    skill.trainingLabel = rank ? game.i18n.localize(rank.label) : '';
    skill.trainingIcon = rank?.icon ?? 'far fa-circle';
    skill.parentAbbr =
      cfg?.parent_ability1 && cfg?.parent_ability2
        ? `${abilityAbbreviation(cfg.parent_ability1)}/${abilityAbbreviation(cfg.parent_ability2)}`
        : '';
  }
}

/**
 * @param {number} current
 * @param {number} delta
 * @returns {number}
 */
export function adjustSkillTraining(current, delta) {
  const ranks = CONFIG.MOFAN.skillTraining?.length ?? SKILL_TRAINING_MAX + 1;
  const max = ranks - 1;
  const value = (Number(current) || 0) + delta;
  return Math.min(max, Math.max(0, value));
}
