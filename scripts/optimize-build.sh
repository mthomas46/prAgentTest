#!/bin/bash

# 🧹 Build Artifact Cleanup Script
# This script cleans up build artifacts and optimizes the build process

echo "🧹 Starting build optimization..."

# Clean up build directories
echo "Cleaning build directories..."
find . -type d -name "dist" -exec rm -rf {} +
find . -type d -name "build" -exec rm -rf {} +
find . -type d -name "coverage" -exec rm -rf {} +
find . -type d -name ".cache" -exec rm -rf {} +

# Clean up temporary files
echo "Cleaning temporary files..."
find . -type f -name "*.tsbuildinfo" -delete
find . -type f -name "*.map" -delete
find . -type f -name "*.d.ts" -delete
find . -type f -name "*.log" -delete
find . -type f -name "*.tmp" -delete
find . -type f -name "*.temp" -delete

# Clean up node_modules
echo "Cleaning node_modules..."
find . -type d -name "node_modules" -exec rm -rf {} +

# Clean up package manager caches
echo "Cleaning package manager caches..."
rm -rf .npm
rm -rf .yarn
rm -rf .pnpm-store

# Clean up IDE files
echo "Cleaning IDE files..."
find . -type f -name "*.sublime-workspace" -delete
find . -type f -name "*.sublime-project" -delete
find . -type d -name ".vscode" -exec rm -rf {} +
find . -type d -name ".idea" -exec rm -rf {} +
find . -type f -name "*.iml" -delete

# Clean up OS files
echo "Cleaning OS files..."
find . -type f -name "Thumbs.db" -delete
find . -type f -name ".DS_Store" -delete
find . -type f -name "*.swp" -delete
find . -type f -name "*.swo" -delete

# Clean up build tool caches
echo "Cleaning build tool caches..."
find . -type f -name ".eslintcache" -delete
find . -type f -name ".stylelintcache" -delete
find . -type f -name ".prettiercache" -delete

# Reinstall dependencies
echo "Reinstalling dependencies..."
npm ci

# Build the application
echo "Building the application..."
npm run build

echo "✅ Build optimization complete!" 