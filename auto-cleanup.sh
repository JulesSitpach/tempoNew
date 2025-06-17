#!/bin/bash

echo "🛠️  Automated Service Import Cleanup"
echo "====================================="

# Services and types to remove
services_to_remove=(
  "TariffAnalysisService"
  "VesselTrackingService" 
  "ProductEnhancementService"
  "FileProcessingService"
  "ReportGenerationService"
  "SMBContextService"
  "EnhancedSupplierIntelligenceService"
  "SupplyChainIntelligenceService"
  "ScenarioModelingService"
  "ResilienceAssessmentService"
  "EnhancedProductData"
  "ScenarioInput"
  "ScenarioResult"
  "ResilienceMetrics"
  "SupplierMetrics"
)

files_to_fix=(
  "src/components/AIRecommendations.tsx"
  "src/components/AlertsMonitoring.tsx" 
  "src/components/SMBContextReceiver.tsx"
  "src/components/SupplierDiversification.tsx"
  "src/components/SupplyChainPlanner.tsx"
  "src/components/TariffImpactDashboard.tsx"
)

echo "🔧 Creating backup..."
mkdir -p backups
for file in "${files_to_fix[@]}"; do
  if [ -f "$file" ]; then
    cp "$file" "backups/$(basename $file).backup"
    echo "  ✅ Backed up $file"
  fi
done

echo ""
echo "🧹 Cleaning up imports..."

for file in "${files_to_fix[@]}"; do
  if [ -f "$file" ]; then
    echo "  📄 Processing $file..."
    
    # Remove individual services from imports
    for service in "${services_to_remove[@]}"; do
      # Remove the service from import statements
      sed -i "s/, *${service} *,/,/g" "$file"
      sed -i "s/, *${service} *}/}/g" "$file" 
      sed -i "s/{ *${service} *,/{/g" "$file"
      sed -i "s/{ *${service} *}/{ }/g" "$file"
      sed -i "/import.*${service}.*from.*apiServices/d" "$file"
    done
    
    # Clean up empty import statements
    sed -i '/import { *} from "@\/services\/apiServices";/d' "$file"
    sed -i '/import { *} from "@\/services\/apiServices";/d' "$file"
    
    echo "    ✅ Cleaned imports"
  fi
done

echo ""
echo "🔍 Checking results..."
echo "Files still importing from @/services/apiServices:"
grep -r "from ['\"]@/services/apiServices['\"]" src/ --include="*.ts" --include="*.tsx" | head -10

echo ""
echo "✅ Cleanup complete! Check the backups/ folder if you need to restore anything."
