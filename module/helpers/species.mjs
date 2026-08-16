/**
 * Helpers for owned Species items, derived modifiers, and innate Feature sync.
 */

/**
 * @param {Actor} actor
 * @returns {Item|null}
 */
export function getOwnedSpecies(actor) {
  if (!actor?.items) return null;
  return actor.items.find((item) => item.type === 'species') ?? null;
}

/**
 * Stacked ability modifiers from the owned Species (+1 per bonus, -1 for the flaw).
 * @param {Actor} actor
 * @returns {Record<string, number>}
 */
export function getSpeciesAbilityModifiers(actor) {
  const mods = Object.keys(CONFIG.MOFAN.abilities).reduce((obj, key) => {
    obj[key] = 0;
    return obj;
  }, {});

  const species = getOwnedSpecies(actor);
  if (!species) return mods;

  for (const key of species.system.statBonuses ?? []) {
    if (key in mods) mods[key] += 1;
  }

  const flaw = species.system.statFlaw;
  if (flaw && flaw in mods) mods[flaw] -= 1;

  return mods;
}

/**
 * @param {Actor} actor
 * @returns {number}
 */
export function getSpeciesHpBonus(actor) {
  const species = getOwnedSpecies(actor);
  return Number(species?.system?.hpBonus) || 0;
}

/**
 * Build creation data for an owned innate Feature copied from a template.
 * @param {Item} template
 * @returns {object}
 */
export function innateFeatureDataFromTemplate(template) {
  const data = template.toObject();
  delete data._id;
  delete data.folder;
  delete data.sort;
  delete data.ownership;
  data.type = 'innateFeature';
  data.system = data.system ?? {};
  data.system.sourceUuid = template.uuid;
  return data;
}

/**
 * Resolve world/compendium innate Feature templates listed on a Species.
 * @param {Array<{uuid: string, name: string}>} refs
 * @returns {Promise<Item[]>}
 */
export async function resolveInnateFeatureTemplates(refs) {
  const templates = [];
  const seen = new Set();
  for (const ref of refs ?? []) {
    if (!ref?.uuid || seen.has(ref.uuid)) continue;
    seen.add(ref.uuid);
    try {
      const doc = await fromUuid(ref.uuid);
      if (doc && doc.type === 'innateFeature') templates.push(doc);
    } catch (err) {
      console.warn('mofan-vtt | Failed to resolve innate Feature', ref.uuid, err);
    }
  }
  return templates;
}

/**
 * Sync owned innate Features to match the Species innateFeatures list.
 * @param {Actor} actor
 * @param {Item} [speciesItem]
 * @returns {Promise<void>}
 */
export async function syncActorSpeciesFeatures(actor, speciesItem) {
  const species = speciesItem ?? getOwnedSpecies(actor);
  if (!species || species.type !== 'species') return;

  const templates = await resolveInnateFeatureTemplates(
    species.system.innateFeatures
  );
  const shouldHave = new Map(templates.map((template) => [template.uuid, template]));

  const owned = actor.items.filter((item) => item.type === 'innateFeature');

  const toCreate = [];
  for (const [templateUuid, template] of shouldHave) {
    const exists = owned.some(
      (item) =>
        item.system.sourceUuid === templateUuid || item.uuid === templateUuid
    );
    if (!exists) toCreate.push(innateFeatureDataFromTemplate(template));
  }

  const toDelete = owned
    .filter((item) => {
      const source = item.system.sourceUuid;
      if (!source) return true;
      return !shouldHave.has(source);
    })
    .map((item) => item.id);

  if (toCreate.length) {
    await actor.createEmbeddedDocuments('Item', toCreate);
  }
  if (toDelete.length) {
    await actor.deleteEmbeddedDocuments('Item', toDelete);
  }
}

/**
 * Remove all owned innate Features from an actor.
 * @param {Actor} actor
 * @returns {Promise<void>}
 */
export async function removeFeaturesForSpecies(actor) {
  const ids = actor.items
    .filter((item) => item.type === 'innateFeature')
    .map((item) => item.id);
  if (ids.length) await actor.deleteEmbeddedDocuments('Item', ids);
}
