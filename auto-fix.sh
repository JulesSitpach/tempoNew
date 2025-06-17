#!/bin/bash

echo "🧹 Running automated cleanup with new tools..."

# Run ESLint with auto-fix for unused imports
echo "📋 Fixing unused imports..."
npx eslint --config .eslintrc.enhanced.cjs --fix "src/**/*.{ts,tsx}" --rule "unused-imports/no-unused-imports: error"

# Format with Prettier
echo "✨ Formatting code..."
npx prettier --write "src/**/*.{ts,tsx,js,jsx,json}"

# Run TypeScript check
echo "🔍 Checking TypeScript..."
npx tsc --noEmit

# Final ESLint check
echo "🔍 Final ESLint check..."
npx eslint --config .eslintrc.enhanced.cjs "src/**/*.{ts,tsx}" --format=pretty

echo "✅ Cleanup complete!"
