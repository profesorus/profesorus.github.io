#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { execSync } from "child_process";

const publicDir = path.join("public", "files");
const cacheDir = path.join("._cache", "files");
const distDir = path.join("dist", "files");
const dist = path.join("dist");

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

console.log({ publicDir, cacheDir, distDir, dist });
console.log();

console.log("📦 Tymczasowe przeniesienie plikow...");
ensureDir(cacheDir);
execSync(`mv ${publicDir}/* ${cacheDir}/ 2>/dev/null || true`, { stdio: "inherit" });

// console.log("📦 Oczyszczenie katalogu dist...");
// execSync(`find ${dist} -mindepth 1 -name files -prune -o -exec rm -rf {} +`, { stdio: "inherit" });

let buildFailed = false;
try {
  console.log("🏗  Budowanie projektu...\n");
  execSync("astro build", { stdio: "inherit" });
} catch (err) {
  console.error("❌ Build zakończył się błędem!");
  buildFailed = true;
}

// process.exit(0);

if (buildFailed) {
  console.log("\n♻️ Przywracanie oryginalnych plików...");
  ensureDir(publicDir);
  execSync(`mv ${cacheDir}/* ${publicDir}/`, { stdio: "inherit" });
} else {
  console.log("\n🚚 Kopiowanie plików do dist...\n");
  ensureDir(publicDir);
  execSync(`mv ${cacheDir}/* ${publicDir}/`, { stdio: "inherit" });

  // Poprawiona komenda rsync:
  ensureDir(distDir);
  // execSync(`rsync -av --delete ${publicDir}/ ${distDir}/`, {
  execSync(`rsync -av ${publicDir}/ ${distDir}/`, {
    stdio: "inherit",
    env: { ...process.env, RSYNC_PROTECT_ARGS: '0' } // Fix dla macOS
  });
}


process.exit(0);









// const publicDir = path.join("public", "files");
// const cacheDir = path.join("._cache", "files");
// const distDir = path.join("dist", "files");
// const dist = path.join("dist");

// function ensureDir(dir) {
//   if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
// }

console.log({ publicDir });
console.log({ cacheDir });
console.log({ distDir });
console.log({ dist });
console.log();

// 1) Backup
// console.log("📦 Backup plików...");
// ensureDir(cacheDir);
// execSync(`cp -R ${publicDir}/* ${cacheDir}/`, { stdio: "inherit" });

// // 2) Usuń pliki z public/files
// console.log("🧹 Czyszczenie public/files...");
// execSync(`rm -rf ${publicDir}/*`, { stdio: "inherit" });

console.log("📦 Tymczasowe przeniesienie plikow...");
ensureDir(cacheDir);
// execSync(`mv ${publicDir}/* ${cacheDir}/`, { stdio: "inherit" });
execSync(`mv ${publicDir}/* ${cacheDir}/ 2>/dev/null || true`, { stdio: "inherit" });

// process.exit(0);

console.log("📦 Oczyszczenie katalogu dist...");
//: find ./dist ! -name files ! -name dist -exec rm -rf {} +
//: find ./dist -mindepth 1 -maxdepth 1 -not -name files -exec rm -rf {} +
// execSync(`find ${dist} ! -name files ! -name dist -exec rm -rf {} +`, { stdio: "inherit" });
execSync(`find ${dist} -mindepth 1 -name files -prune -o -exec rm -rf {} +`, { stdio: "inherit" });

// 3) Uruchom build
// let buildFailed = false;
try {
  console.log("🏗  Budowanie projektu...\n");
  execSync("astro build", { stdio: "inherit" });
} catch (err) {
  console.error("❌ Build zakończył się błędem!");
  buildFailed = true;
}

// process.exit(0);

// 4) Przywrócenie w zależności od wyniku
if (buildFailed) {
  console.log("\n♻️ Przywracanie oryginalnych plików...");
  ensureDir(publicDir);
  // execSync(`cp -R ${cacheDir}/* ${publicDir}/`, { stdio: "inherit" });
  execSync(`mv ${cacheDir}/* ${publicDir}/`, { stdio: "inherit" });
} else {
  console.log("\n🚚 Kopiowanie plików do dist...\n");
  ensureDir(publicDir);
  execSync(`mv ${cacheDir}/* ${publicDir}/`, { stdio: "inherit" });
  //: rsync -av --delete --exclude='.DS_Store' --exclude='*Icon*' ./public/files/ ./dist/files/",
  ensureDir(distDir);
  // execSync(`cp -R ${cacheDir}/* ${distDir}/`, { stdio: "inherit" });
  // Error: Command failed: rsync -av --delete --exclude='.DS_Store' --exclude='*Icon*'
  //   public/files/ dist/files/
  // execSync(`rsync -av --exclude='.DS_Store' --exclude='*Icon*' ${publicDir}/ ${distDir}/`, { stdio: "inherit" });
  // execSync(`rsync -av ${publicDir}/ ${distDir}/`, { stdio: "inherit" });

const diff = execSync(`rsync -avn --delete ${publicDir}/ ${distDir}/ | wc -l`).toString();
if (diff.trim() === '0') {
  console.log("🔄 Brak zmian do synchronizacji");
} else {
  //execSync(`rsync -av --delete ${publicDir}/ ${distDir}/`, { stdio: "inherit" });
}

  // execSync(`rsync -av --delete ${publicDir}/ ${distDir}/`, {
  execSync(`rsync -av ${publicDir}/ ${distDir}/`, {
    stdio: "inherit",
    env: { ...process.env, RSYNC_PROTECT_ARGS: '0' } // Fix dla macOS
  });

}

// process.exit(0);

// 4) Przywrócenie w zależności od wyniku
// if (buildFailed) {
//   console.log("♻️ Przywracanie oryginalnych plików...");
//   ensureDir(publicDir);
//   execSync(`cp -R ${cacheDir}/* ${publicDir}/`, { stdio: "inherit" });
// } else {
//   console.log("🚚 Kopiowanie plików do dist...");
//   ensureDir(distDir);
//   execSync(`cp -R ${cacheDir}/* ${distDir}/`, { stdio: "inherit" });
// }

console.log("\n✅ Zakończono procedurę safe-build.");
