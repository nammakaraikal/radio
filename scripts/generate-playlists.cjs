#!/usr/bin/env node
/**
 * CommonJS version – no "type":"module" needed
 * Generates playlist.json in every sub‑folder of audio/tamil_songs/
 */
const fs   = require('fs').promises;
const path = require('path');
const glob = require('fast-glob');

const BASE_DIR = path.resolve('audio', 'tamil_songs');

(async () => {
  console.log('📂  Scanning:', BASE_DIR);                 // ← debug line

  let subDirs;
  try {
    subDirs = (await fs.readdir(BASE_DIR, { withFileTypes: true }))
      .filter(d => d.isDirectory())
      .map(d => path.join(BASE_DIR, d.name));
  } catch (err) {
    console.error('❌  Cannot read', BASE_DIR);
    console.error(err);
    process.exit(1);
  }

  if (subDirs.length === 0) {
    console.error('⚠️  No sub‑folders found under', BASE_DIR);
    process.exit(1);
  }

  for (const dir of subDirs) {
    const pattern = path.join(dir, '*.mp3').replace(/\\/g, '/');
    const files   = (await glob(pattern)).map(f => path.basename(f)).sort();
    const jsonPath = path.join(dir, 'playlist.json');

    await fs.writeFile(jsonPath, JSON.stringify(files, null, 2));
    console.log(`✓  ${jsonPath}  (${files.length} songs)`);
  }

  console.log('✅  All playlists generated');
})();
