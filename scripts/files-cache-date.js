// scripts/files-cache.js
//: ----------------------------------------------------------------------------
import fs from "fs";
import path from "path";

//: --------------------------------------------------------

const publicFilesDir = path.resolve("public/files");
// const tempFilesDir = path.resolve(".temp/files");
const tempFilesDir = path.resolve(".cache/files");
const distFilesDir = path.resolve("dist/files");

//: --------------------------------------------------------

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function copyChangedFiles(srcDir, destDir) {
  const files = fs.readdirSync(srcDir, { withFileTypes: true });
  for (const file of files) {
    const srcPath = path.join(srcDir, file.name);
    const destPath = path.join(destDir, file.name);

    if (file.isDirectory()) {
      ensureDir(destPath);
      copyChangedFiles(srcPath, destPath);
    } else {
      let copy = false;
      if (!fs.existsSync(destPath)) {
        copy = true;
      } else {
        const srcMTime = fs.statSync(srcPath).mtimeMs;
        const destMTime = fs.statSync(destPath).mtimeMs;
        if (srcMTime > destMTime) copy = true;
      }
      if (copy) {
        fs.copyFileSync(srcPath, destPath);
        console.log(`📄 Copied: ${srcPath} → ${destPath}`);
      }
    }
  }
}

// Prebuild: cache files to .temp and clean public/files
//: ----------------------------------------------------------------------------
export function prebuild() {
  if (!fs.existsSync(publicFilesDir)) return;

  ensureDir(tempFilesDir);
  copyChangedFiles(publicFilesDir, tempFilesDir);

  // fs.rmSync(publicFilesDir, { recursive: true, force: true });
  ensureDir(publicFilesDir);
}

// Postbuild: restore files into dist
//: ----------------------------------------------------------------------------
export function postbuild() {
  if (!fs.existsSync(tempFilesDir)) return;

  ensureDir(distFilesDir);
  copyChangedFiles(tempFilesDir, distFilesDir);
}

//: --------------------------------------------------------
if (process.argv[2] === "pre") prebuild();
if (process.argv[2] === "post") postbuild();
