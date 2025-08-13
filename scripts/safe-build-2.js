#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { execSync } from "child_process";

const publicDir = path.join("public", "files");
const cacheDir = path.join("._cache", "files");
const distDir = path.join("dist", "files");

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

console.log("📦 Przenoszenie plików...");
ensureDir(cacheDir);
// execSync(`rsync -a ${publicDir}/ ${cacheDir}/`, { stdio: "inherit" });
execSync(`mv ${publicDir}/* ${cacheDir}/ 2>/dev/null || true`, { stdio: "inherit" });

try {

  // 1. Najpierw budujemy
  console.log("🏗  Budowanie projektu...\n");
  execSync("astro build", { stdio: "inherit" });

  // 2. Dopiero po buildzie przenosimy pliki
  console.log("\n🚚 Przywracanie plików...");
  ensureDir(distDir);

  // execSync(`rsync -a --exclude='.DS_Store' --exclude='*Icon*' ${publicDir}/ ${cacheDir}/`, ...)
  // console.log("\n🔍 Zmiany do synchronizacji:");
  // execSync(`rsync -avn --ignore-existing ${cacheDir}/ ${distDir}/`, {
  //   stdio: "inherit",
  //   env: { ...process.env, RSYNC_PROTECT_ARGS: '0' }
  // });

  // Synchronizacja z zachowaniem plików z builda
  execSync(`rsync -av --ignore-existing ${cacheDir}/ ${distDir}/`, {
    stdio: "inherit",
    env: { ...process.env, RSYNC_PROTECT_ARGS: '0' }
  });

  // Przywróć do public/files
  // execSync(`rsync -a --delete ${cacheDir}/ ${publicDir}/`, { stdio: "inherit" });
  execSync(`mv ${cacheDir}/* ${publicDir}/`, { stdio: "inherit" });
}
catch (err) {
  console.error("\n❌ Build zakończył się błędem!");
  console.log("♻️ Przywracanie oryginalnego stanu...");
  // execSync(`rsync -a --delete ${cacheDir}/ ${publicDir}/`, { stdio: "inherit" });
  execSync(`mv ${cacheDir}/* ${publicDir}/`, { stdio: "inherit" });
  process.exit(1);
}

// Sprzątanie
execSync(`rm -rf ${cacheDir}`, { stdio: "inherit" });
console.log("\n✅ Gotowe!");
