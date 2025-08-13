#!/usr/bin/env node
import { execSync } from 'child_process';
import { platform } from 'os';
import path from 'path';
import fs from 'fs';

const isMac = platform() === 'darwin';
const publicFiles = path.join('public', 'files');
const distFiles = path.join('dist', 'files');

function optimizeForPlatform() {
  if (isMac) {
    // APFS: wykorzystaj clonefile (natywne kopiowanie bez danych)
    try {
      execSync(`fclonefile ${publicFiles} ${distFiles}`, { stdio: 'ignore' });
      console.log('🔹 macOS: wykorzystano optymalizację APFS\n');
      return true;
    } catch {
      console.log('🔹 macOS: fallback do rsync\n');
    }
  }
  // Linux/fallback: hard link files (jeśli system pozwala)
  try {
    execSync(`cp -al ${publicFiles} ${distFiles} 2>/dev/null || cp -a ${publicFiles} ${distFiles}`, {
      stdio: 'ignore'
    });
    return true;
  } catch {
    return false;
  }
}

function standardBuild() {
  console.log('🏗 Standardowy build...');
  execSync('astro build', { stdio: 'inherit' });
}

function optimizedBuild() {
  console.log('🚀 Optymalizowany build');

  // Etap 1: Przygotuj dist/files przed buildem
  fs.mkdirSync(distFiles, { recursive: true });

  if (!optimizeForPlatform()) {
    execSync(`rsync -a --delete ${publicFiles}/ ${distFiles}/`, {
      stdio: 'inherit'
    });
  }

  // Etap 2: Buduj tylko zmienione pliki
  execSync('ASTRO_DISABLE_FILE_WATCHER=1 astro build', {
    stdio: 'inherit',
    env: { ...process.env, ASTRO_DISABLE_FILE_WATCHER: '1' }
  });
}

// Główna logika
try {
  if (process.env.CI) {
    console.log('🔹 CI/CD: tryb optymalizacji Linux');
    optimizedBuild();
  } else if (isMac) {
    console.log('🔹 macOS: tryb optymalizacji APFS');
    optimizedBuild();
  } else {
    standardBuild();
  }

  console.log('\n✅ Build zakończony sukcesem!');
} catch (err) {
  console.error('\n❌ Błąd builda:', err);
  process.exit(1);
}
