#!/bin/bash
set -euo pipefail

PUBLIC_FILES="public/files"
CACHE_DIR=".cache/files"
DIST_FILES="dist/files"

echo "📦 Tworzenie kopii zapasowej plików..."
mkdir -p "$CACHE_DIR"
rm -rf "$CACHE_DIR"/*
cp -R "$PUBLIC_FILES"/. "$CACHE_DIR"/

echo "🧹 Czyszczenie katalogu public/files..."
rm -rf "$PUBLIC_FILES"/*
mkdir -p "$PUBLIC_FILES"

echo "🏗️ Budowanie projektu Astro..."
if ! astro build; then
  echo "❌ Build nie powiódł się, przywracam oryginalne pliki..."
  rm -rf "$PUBLIC_FILES"/*
  cp -R "$CACHE_DIR"/. "$PUBLIC_FILES"/
  echo "♻️ Pliki przywrócone."
  exit 1
fi

echo "🚚 Kopiowanie plików do dist/files..."
mkdir -p "$DIST_FILES"
rm -rf "$DIST_FILES"/*
cp -R "$CACHE_DIR"/. "$DIST_FILES"/

echo "✅ Procedura build zakończona pomyślnie."
