//: ----------------------------------------------------------------------------
import fs from "fs";
import path from "path";
// import crypto from "crypto";
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';

//: --------------------------------------------------------

const publicFilesDir = path.resolve("public/files");
const tempFilesDir = path.resolve(".temp/files");
const distFilesDir = path.resolve("dist/files");

// Przechowuj hashe w pliku JSON w .temp
const hashFilePath = path.resolve(".temp/files-hash.json");

//: --------------------------------------------------------

// Upewnij się, że katalog istnieje
function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

// Oblicz hash SHA256 pliku
// function fileHash(filePath) {
//   const data = fs.readFileSync(filePath);
//   return crypto.createHash("sha256").update(data).digest("hex");
// }
function fileHash(filePath) {
  const data = readFileSync(filePath);
  return createHash('sha256').update(data).digest('hex');
}
//: -----------------------------------------
//: async (faster) version
//: -----------------------------------------
// import { createHash } from 'node:crypto';
// import { createReadStream } from 'node:fs';
//
// async function fileHash(filePath) {
//   return new Promise((resolve, reject) => {
//     const hash = createHash('sha256');
//     const stream = createReadStream(filePath);
//
//     stream.on('data', (chunk) => hash.update(chunk));
//     stream.on('end', () => resolve(hash.digest('hex')));
//     stream.on('error', reject);
//   });
// }
//: -----------------------------------------

let previousHashes = {};
if (fs.existsSync(hashFilePath)) {
  previousHashes = JSON.parse(fs.readFileSync(hashFilePath, "utf-8"));
}
const newHashes = {};

// Kopiuj tylko pliki, które zmieniły hash
function copyChangedFiles(srcDir, destDir, baseDir = srcDir) {
  const entries = fs.readdirSync(srcDir, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(srcDir, entry.name);
    const relPath = path.relative(baseDir, srcPath).replace(/\\/g, "/");
    const destPath = path.join(destDir, entry.name);

    if (entry.isDirectory()) {
      ensureDir(destPath);
      copyChangedFiles(srcPath, destPath, baseDir);
    } else {
      const hash = fileHash(srcPath);
      newHashes[relPath] = hash;

      if (previousHashes[relPath] !== hash) {
        fs.copyFileSync(srcPath, destPath);
        console.log(`📄 Copied: ${relPath}`);
      }
    }
  }
}

// Prebuild: kopiuj zmienione pliki, czyść public/files
//: ----------------------------------------------------------------------------
export function prebuild() {
  if (!fs.existsSync(publicFilesDir)) return;

  ensureDir(tempFilesDir);
  copyChangedFiles(publicFilesDir, tempFilesDir);

  // Zapisz nowe hashe
  fs.writeFileSync(hashFilePath, JSON.stringify(newHashes, null, 2));

  // Usuń pliki z public/files żeby Astro ich nie kopiował
  // fs.rmSync(publicFilesDir, { recursive: true, force: true });
  ensureDir(publicFilesDir);
}

// Postbuild: kopiuj pliki do dist
//: ----------------------------------------------------------------------------
export function postbuild() {
  if (!fs.existsSync(tempFilesDir)) return;

  ensureDir(distFilesDir);
  copyChangedFiles(tempFilesDir, distFilesDir);
}

//: --------------------------------------------------------
if (process.argv[2] === "pre") prebuild();
if (process.argv[2] === "post") postbuild();
