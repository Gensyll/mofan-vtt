import MofanFeatureBase from './base-item-feature.mjs';

export default class MofanInnateFeature extends MofanFeatureBase {
  static LOCALIZATION_PREFIXES = [
    ...super.LOCALIZATION_PREFIXES,
    'MOFAN.Item.InnateFeature',
  ];

  /** @type {string[]} */
  static SHEET_PARTS = ['attributesInnateFeature', 'effects'];
}
