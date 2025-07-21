#!/usr/bin/env node
/**
 * Generates playlist.json in every sub-folder of audio/tamil_songs/
 * Make sure the BASE_DIR exists and adjust path as needed.
 */

const fs = require('fs').promises;
const path = require('path');
const glob = require('fast-glob');

// Use __dirname to always resolve relative to script location
const BASE_DIR = path.resolve(__dirname, '..', 'audio', 'tamil_songs');

(async () => {
  console.log('📂  Scanning:', BASE_DIR);

  try {
    // Check if BASE_DIR exists first
    await fs.access(BASE_DIR);
  } catch (err) {
    console.error('❌  Directory does not exist:', BASE_DIR);
    console.error('📌  Create it with: mkdir -p', BASE_DIR);
    process.exit(1);
  }

  let subDirs;
  try {
    subDirs = (await fs.readdir(BASE_DIR, { withFileTypes: true }))
      .filter(d => d.isDirectory())
      .map(d => path.join(BASE_DIR, d.name));
  } catch (err) {
    console.error('❌  Cannot read sub-directories in', BASE_DIR);
    console.error(err);
    process.exit(1);
  }

  if (subDirs.length === 0) {
    console.warn('⚠️  No sub-folders found under', BASE_DIR);
    return;
  }

  for (const dir of subDirs) {
    const pattern = path.join(dir, '*.mp3').replace(/\\/g, '/');
    const files = (await glob(pattern)).map(f => path.basename(f)).sort();
    const jsonPath = path.join(dir, 'playlist.json');

    await fs.writeFile(jsonPath, JSON.stringify(files, null, 2));
    console.log(`✅  ${jsonPath}  (${files.length} songs)`);
  }

  console.log('🎉  All playlists generated');
})();
