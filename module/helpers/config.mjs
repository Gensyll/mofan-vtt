export const MOFAN = {};

/**
 * The set of Ability Scores used within the system.
 * @type {Object}
 * @property {string} label             Localized label
 * @property {string} abbreviation      Localized abbreviation
 *
 */

MOFAN.abilities = {
  awr: {
    label: 'MOFAN.Ability.Awr.long',
    abbreviation: 'MOFAN.Ability.Awr.abbr',
  },
  cha: {
    label: 'MOFAN.Ability.Cha.long',
    abbreviation: 'MOFAN.Ability.Cha.abbr',
  },
  dex: {
    label: 'MOFAN.Ability.Dex.long',
    abbreviation: 'MOFAN.Ability.Dex.abbr',
  },
  for: {
    label: 'MOFAN.Ability.For.long',
    abbreviation: 'MOFAN.Ability.For.abbr',
  },
  kno: {
    label: 'MOFAN.Ability.Kno.long',
    abbreviation: 'MOFAN.Ability.Kno.abbr',
  },
};

/**
 * The set of Skill Scores used within the system.
 * @type {Object}
 * @property {string} label             Localized label
 * @property {string} abbreviation      Localized abbreviation
 * @property {string} parent_ability1   The primary ability score for the skill
 * @property {string} parent_ability2   The secondary ability score for the skill
 *
 */

MOFAN.skills = {
  arc: {
    label: 'MOFAN.Skill.Arcana.long',
    abbreviation: 'MOFAN.Skill.Arcana.abbr',
    parent_ability1: 'cha',
    parent_ability2: 'kno',
  },
  ath: {
    label: 'MOFAN.Skill.Athletics.long',
    abbreviation: 'MOFAN.Skill.Athletics.abbr',
    parent_ability1: 'dex',
    parent_ability2: 'for',
  },
  dec: {
    label: 'MOFAN.Skill.Deception.long',
    abbreviation: 'MOFAN.Skill.Deception.abbr',
    parent_ability1: 'cha',
    parent_ability2: 'dex',
  },
  drv: {
    label: 'MOFAN.Skill.Driving.long',
    abbreviation: 'MOFAN.Skill.Driving.abbr',
    parent_ability1: 'for',
    parent_ability2: 'awr',
  },
  emp: {
    label: 'MOFAN.Skill.Empathy.long',
    abbreviation: 'MOFAN.Skill.Empathy.abbr',
    parent_ability1: 'cha',
    parent_ability2: 'awr',
  },
  inv: {
    label: 'MOFAN.Skill.Investigation.long',
    abbreviation: 'MOFAN.Skill.Investigation.abbr',
    parent_ability1: 'kno',
    parent_ability2: 'awr',
  },
  per: {
    label: 'MOFAN.Skill.Persuation.long',
    abbreviation: 'MOFAN.Skill.Persuation.abbr',
    parent_ability1: 'cha',
    parent_ability2: 'for',
  },
  tac: {
    label: 'MOFAN.Skill.Tactics.long',
    abbreviation: 'MOFAN.Skill.Tactics.abbr',
    parent_ability1: 'for',
    parent_ability2: 'kno',
  },
  tec: {
    label: 'MOFAN.Skill.Technology.long',
    abbreviation: 'MOFAN.Skill.Technology.abbr',
    parent_ability1: 'dex',
    parent_ability2: 'kno',
  },
  thv: {
    label: 'MOFAN.Skill.Thievery.long',
    abbreviation: 'MOFAN.Skill.Thievery.abbr',
    parent_ability1: 'dex',
    parent_ability2: 'awr',
  },
};

/**
 * Skill training ranks. Index equals both the persisted training value and the bonus.
 * @type {Array<{label: string, bonus: number, icon: string}>}
 */
MOFAN.skillTraining = [
  { label: 'MOFAN.SkillTraining.untrained', bonus: 0, icon: 'far fa-circle' },
  { label: 'MOFAN.SkillTraining.basic', bonus: 1, icon: 'fas fa-circle-half-stroke' },
  { label: 'MOFAN.SkillTraining.advanced', bonus: 2, icon: 'far fa-circle-check' },
  { label: 'MOFAN.SkillTraining.expert', bonus: 3, icon: 'fas fa-check' },
  { label: 'MOFAN.SkillTraining.professional', bonus: 4, icon: 'fas fa-check-double' },
  { label: 'MOFAN.SkillTraining.legendary', bonus: 5, icon: 'fas fa-star' },
];

/**
 * Item types (document.type) that extend MofanItemLootable, in display order on the actor Inventory tab.
 * @type {string[]}
 */
MOFAN.lootableInventoryTypes = ['gear', 'loot'];

/**
 * Item types that spend AP when used from an actor.
 * @type {string[]}
 */
MOFAN.usableFeatureTypes = ['feature', 'innateFeature'];

/**
 * Constant term in actor max HP: 10 + species + Fortitude + disciplines.
 * @type {number}
 */
MOFAN.healthBase = 10;

/**
 * Default actor movement in grid squares. Features/Disciplines modify
 * `system.movement.value` via Active Effects.
 * @type {number}
 */
MOFAN.movementBase = 5;

/**
 * Size choices for Species items. Independent of lootable item sizes.
 * @type {Object<string, string>}
 */
MOFAN.speciesSizes = {
  tiny: 'MOFAN.Item.Species.Size.tiny',
  small: 'MOFAN.Item.Species.Size.small',
  medium: 'MOFAN.Item.Species.Size.medium',
  large: 'MOFAN.Item.Species.Size.large',
  huge: 'MOFAN.Item.Species.Size.huge',
};

/**
 * Discipline trait/property definitions.
 * @type {Object<string, {label: string, description: string}>}
 */
MOFAN.disciplineTraits = {
  basic: {
    label: 'MOFAN.DisciplineTrait.basic.label',
    description: 'MOFAN.DisciplineTrait.basic.description',
  },
  advanced: {
    label: 'MOFAN.DisciplineTrait.advanced.label',
    description: 'MOFAN.DisciplineTrait.advanced.description',
  },
  combat: {
    label: 'MOFAN.DisciplineTrait.combat.label',
    description: 'MOFAN.DisciplineTrait.combat.description',
  },
  defensive: {
    label: 'MOFAN.DisciplineTrait.defensive.label',
    description: 'MOFAN.DisciplineTrait.defensive.description',
  },
  divine: {
    label: 'MOFAN.DisciplineTrait.divine.label',
    description: 'MOFAN.DisciplineTrait.divine.description',
  },
  inherent: {
    label: 'MOFAN.DisciplineTrait.inherent.label',
    description: 'MOFAN.DisciplineTrait.inherent.description',
  },
  magic: {
    label: 'MOFAN.DisciplineTrait.magic.label',
    description: 'MOFAN.DisciplineTrait.magic.description',
  },
  marksmanship: {
    label: 'MOFAN.DisciplineTrait.marksmanship.label',
    description: 'MOFAN.DisciplineTrait.marksmanship.description',
  },
  martial: {
    label: 'MOFAN.DisciplineTrait.martial.label',
    description: 'MOFAN.DisciplineTrait.martial.description',
  },
  preparation: {
    label: 'MOFAN.DisciplineTrait.preparation.label',
    description: 'MOFAN.DisciplineTrait.preparation.description',
  },
  skilled: {
    label: 'MOFAN.DisciplineTrait.skilled.label',
    description: 'MOFAN.DisciplineTrait.skilled.description',
  },
};

/**
 * Feature trait/property definitions.
 * @type {Object<string, {label: string, description: string}>}
 */
MOFAN.featureTraits = {
  combat: {
    label: 'MOFAN.FeatureTrait.combat.label',
    description: 'MOFAN.FeatureTrait.combat.description',
  },
  cooperate: {
    label: 'MOFAN.FeatureTrait.cooperate.label',
    description: 'MOFAN.FeatureTrait.cooperate.description',
  },
  defensive: {
    label: 'MOFAN.FeatureTrait.defensive.label',
    description: 'MOFAN.FeatureTrait.defensive.description',
  },
  detect: {
    label: 'MOFAN.FeatureTrait.detect.label',
    description: 'MOFAN.FeatureTrait.detect.description',
  },
  healing: {
    label: 'MOFAN.FeatureTrait.healing.label',
    description: 'MOFAN.FeatureTrait.healing.description',
  },
  magic: {
    label: 'MOFAN.FeatureTrait.magic.label',
    description: 'MOFAN.FeatureTrait.magic.description',
  },
  manipulate: {
    label: 'MOFAN.FeatureTrait.manipulate.label',
    description: 'MOFAN.FeatureTrait.manipulate.description',
  },
  melee: {
    label: 'MOFAN.FeatureTrait.melee.label',
    description: 'MOFAN.FeatureTrait.melee.description',
  },
  movement: {
    label: 'MOFAN.FeatureTrait.movement.label',
    description: 'MOFAN.FeatureTrait.movement.description',
  },
  psionic: {
    label: 'MOFAN.FeatureTrait.psionic.label',
    description: 'MOFAN.FeatureTrait.psionic.description',
  },
  preparation: {
    label: 'MOFAN.FeatureTrait.preparation.label',
    description: 'MOFAN.FeatureTrait.preparation.description',
  },
  ranged: {
    label: 'MOFAN.FeatureTrait.ranged.label',
    description: 'MOFAN.FeatureTrait.ranged.description',
  },
  resist: {
    label: 'MOFAN.FeatureTrait.resist.label',
    description: 'MOFAN.FeatureTrait.resist.description',
  },
  tactical: {
    label: 'MOFAN.FeatureTrait.tactical.label',
    description: 'MOFAN.FeatureTrait.tactical.description',
  },
  technology: {
    label: 'MOFAN.FeatureTrait.technology.label',
    description: 'MOFAN.FeatureTrait.technology.description',
  },
};
