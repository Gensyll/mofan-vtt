/**
 * Pack / unpack system compendia via the Foundry CLI API.
 * Usage: node tools/packs.mjs pack|unpack
 */
import { compilePack, extractPack } from '@foundryvtt/foundryvtt-cli';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PACKS = ['disciplines', 'features', 'species'];

function packDirs(name) {
  return {
    source: path.join(ROOT, 'packs', name, '_source'),
    compiled: path.join(ROOT, 'packs', name),
  };
}

async function packAll() {
  for (const name of PACKS) {
    const { source, compiled } = packDirs(name);
    await mkdir(source, { recursive: true });
    console.log(`Packing ${name}…`);
    await compilePack(source, compiled, { log: true });
  }
}

async function unpackAll() {
  for (const name of PACKS) {
    const { source, compiled } = packDirs(name);
    await mkdir(source, { recursive: true });
    console.log(`Unpacking ${name}…`);
    await extractPack(compiled, source, { log: true, omitVolatile: true });
  }
}

const command = process.argv[2];
if (command === 'pack') await packAll();
else if (command === 'unpack') await unpackAll();
else {
  console.error('Usage: node tools/packs.mjs pack|unpack');
  process.exit(1);
}
