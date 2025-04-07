#!/bin/bash
set -e

echo "Running CI checks for draupnir_internal..."

# Check Node.js version
echo "Checking Node.js version..."
node scripts/check-node-version.js

# Install dependencies
echo "Installing dependencies..."
npm install

# Run TypeScript compilation check
echo "Checking TypeScript compilation..."
npm run build

# Run linting
echo "Running linter..."
npm run lint

echo "✅ All CI checks passed!" 