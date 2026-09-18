#!/bin/bash
# Script de push Ironfield vers GitHub
set -e

echo "🔓 Suppression du verrou git..."
rm -f .git/index.lock

echo "📦 Ajout des fichiers..."
git add -A
git reset HEAD .claude/ 2>/dev/null || true

echo "💾 Commit..."
git commit -m "feat: add full Ironfield headless storefront

Next.js + Hydrogen React frontend connected to Shopify Storefront API.
Includes product pages, collections, cart, FAQ, about, contact and revalidation webhook."

echo "🚀 Push vers GitHub..."
git push -u origin main

echo "✅ Terminé ! Code poussé sur GitHub."
