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
}
