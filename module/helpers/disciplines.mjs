/**
 * Helpers for discipline point math, prerequisites, and feature syncing.
 */

/**
 * Calculate total discipline points for a character level.
 * @param {number} level
 * @returns {number}
 */
export function calculateDisciplinePointsTotal(level) {
  const lvl = Math.max(1, Number(level) || 1);
  return 4 + 3 * (lvl - 1);
}

/**
 * Sum spent DP from owned discipline levels.
 * @param {Actor} actor
 * @returns {number}
 */
export function calculateDisciplinePointsSpent(actor) {
  return actor.items
    .filter((i) => i.type === 'discipline')
    .reduce((sum, item) => sum + (Number(item.system.level) || 0), 0);
}

/**
 * @param {Actor} actor
 * @returns {{total: number, spent: number, available: number}|null}
 */
export function getDisciplinePoints(actor) {
  if (actor.type !== 'character') return null;
  const total = calculateDisciplinePointsTotal(
    actor.system.attributes?.level?.value ?? 1
  );
  const spent = calculateDisciplinePointsSpent(actor);
  return { total, spent, available: total - spent };
}

/**
 * Bonus max HP contributed by owned disciplines.
 * @param {Actor} actor
 * @returns {number}
 */
export function calculateDisciplineHealthBonus(actor) {
  return actor.items
    .filter((i) => i.type === 'discipline')
    .reduce(
      (sum, item) =>
        sum +
        (Number(item.system.healthScaling) || 0) *
          (Number(item.system.level) || 0),
      0
    );
}

/**
 * Resolve identifiers that can match an owned discipline to a prerequisite/source.
 * @param {Item} item
 * @returns {Set<string>}
 */
export function getItemIdentityUuids(item) {
  const ids = new Set();
  if (item.uuid) ids.add(item.uuid);
  if (item.system?.sourceUuid) ids.add(item.system.sourceUuid);
  const sourceId =
    item.getFlag?.('core', 'sourceId') ?? item.flags?.core?.sourceId;
  if (sourceId) ids.add(sourceId);
  if (item._stats?.compendiumSource) ids.add(item._stats.compendiumSource);
  return ids;
}

/**
 * Whether an actor satisfies a single discipline prerequisite.
 * @param {Actor} actor
 * @param {{uuid: string, level: number}} prereq
 * @returns {boolean}
 */
export function actorMeetsPrerequisite(actor, prereq) {
  const requiredLevel = Number(prereq.level) || 1;
  return actor.items.some((item) => {
    if (item.type !== 'discipline') return false;
    if ((Number(item.system.level) || 0) < requiredLevel) return false;
    return getItemIdentityUuids(item).has(prereq.uuid);
  });
}

/**
 * @param {Actor} actor
 * @param {Item|object} discipline
 * @returns {{ok: boolean, missing: Array<{uuid: string, name: string, level: number}>}}
 */
export function checkDisciplinePrerequisites(actor, discipline) {
  const prereqs =
    discipline.system?.prerequisites ?? discipline.prerequisites ?? [];
  const missing = [];
  for (const prereq of prereqs) {
    if (!actorMeetsPrerequisite(actor, prereq)) missing.push(prereq);
  }
  return { ok: missing.length === 0, missing };
}

/**
 * Collect world/compendium feature templates linked to a discipline source UUID.
 * @param {string} sourceUuid
 * @returns {Promise<Item[]>}
 */
export async function findFeaturesForDiscipline(sourceUuid) {
  if (!sourceUuid) return [];

  const results = [];
  const seen = new Set();

  const consider = (item) => {
    if (!item || item.type !== 'feature') return;
    if (item.system?.parentDiscipline !== sourceUuid) return;
    if (seen.has(item.uuid)) return;
    seen.add(item.uuid);
    results.push(item);
  };

  for (const item of game.items) consider(item);

  for (const pack of game.packs) {
    if (pack.documentName !== 'Item') continue;
    try {
      const docs = await pack.getDocuments();
      for (const item of docs) consider(item);
    } catch (err) {
      console.warn(
        'mofan-vtt | Failed to load pack for feature sync',
        pack.collection,
        err
      );
    }
  }

  return results;
}

/**
 * Build creation data for an owned feature copied from a template.
 * @param {Item} template
 * @returns {object}
 */
export function featureDataFromTemplate(template) {
  const data = template.toObject();
  delete data._id;
  delete data.folder;
  delete data.sort;
  delete data.ownership;
  data.system = data.system ?? {};
  data.system.sourceUuid = template.uuid;
  data.system.parentDiscipline =
    template.system.parentDiscipline ?? data.system.parentDiscipline ?? '';
  return data;
}

/**
 * Sync owned features for one owned discipline based on its level and sourceUuid.
 * @param {Actor} actor
 * @param {Item} disciplineItem
 * @returns {Promise<void>}
 */
export async function syncActorDisciplineFeatures(actor, disciplineItem) {
  if (!disciplineItem || disciplineItem.type !== 'discipline') return;

  const sourceUuid = disciplineItem.system.sourceUuid || null;
  if (!sourceUuid) return;

  const level = Number(disciplineItem.system.level) || 0;
  const templates = await findFeaturesForDiscipline(sourceUuid);

  const shouldHave = new Map();
  for (const template of templates) {
    const unlock = Number(template.system.unlockLevel) || 1;
    if (level >= unlock) shouldHave.set(template.uuid, template);
  }

  const ownedFeatures = actor.items.filter(
    (item) =>
      item.type === 'feature' && item.system.parentDiscipline === sourceUuid
  );

  const toCreate = [];
  for (const [templateUuid, template] of shouldHave) {
    const exists = ownedFeatures.some((owned) =>
      getItemIdentityUuids(owned).has(templateUuid)
    );
    if (!exists) toCreate.push(featureDataFromTemplate(template));
  }

  const toDelete = ownedFeatures
    .filter((owned) => {
      if (!owned.system.sourceUuid) return false;
      return !shouldHave.has(owned.system.sourceUuid);
    })
    .map((i) => i.id);

  if (toCreate.length) {
    await actor.createEmbeddedDocuments('Item', toCreate);
  }
  if (toDelete.length) {
    await actor.deleteEmbeddedDocuments('Item', toDelete);
  }
}

/**
 * Remove all owned features linked to a discipline source UUID.
 * @param {Actor} actor
 * @param {string} sourceUuid
 * @returns {Promise<void>}
 */
export async function removeFeaturesForDiscipline(actor, sourceUuid) {
  if (!sourceUuid) return;
  const ids = actor.items
    .filter(
      (item) =>
        item.type === 'feature' && item.system.parentDiscipline === sourceUuid
    )
    .map((item) => item.id);
  if (ids.length) await actor.deleteEmbeddedDocuments('Item', ids);
}
