#!/bin/bash

echo "🔍 Finding files with unused imports from @/services/apiServices..."

# Find all TypeScript/TSX files that import from @/services/apiServices
echo "Files importing from @/services/apiServices:"
grep -r "from ['\"]@/services/apiServices['\"]" src/ --include="*.ts" --include="*.tsx" | cut -d: -f1 | sort | uniq

echo ""
echo "🧹 Running ESLint to find unused imports..."
npx eslint --config .eslintrc.cleanup.json src/ --ext .ts,.tsx --format compact | grep "unused-imports"

echo ""
echo "📊 TypeScript compilation errors:"
npx tsc --noEmit --skipLibCheck | head -20
