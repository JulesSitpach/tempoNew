#!/bin/bash

echo "🎯 Systematic Service Cleanup"
echo "============================="

# List of files that need cleanup
files=(
  "src/components/AIRecommendations.tsx"
  "src/components/AlertsMonitoring.tsx" 
  "src/components/SMBContextReceiver.tsx"
  "src/components/SupplierDiversification.tsx"
  "src/components/SupplyChainPlanner.tsx"
  "src/components/TariffImpactDashboard.tsx"
)

echo "📁 Files to clean up:"
for file in "${files[@]}"; do
  echo "  - $file"
done

echo ""
echo "🔍 Checking imports in each file:"
for file in "${files[@]}"; do
  echo ""
  echo "📄 $file:"
  if [ -f "$file" ]; then
    grep -n "from ['\"]@/services/apiServices['\"]" "$file" | head -3
  else
    echo "  ❌ File not found"
  fi
done

echo ""
echo "🚫 Services to remove from imports:"
echo "  - TariffAnalysisService"
echo "  - VesselTrackingService" 
echo "  - ProductEnhancementService"
echo "  - FileProcessingService"
echo "  - ReportGenerationService"
echo "  - SMBContextService"
echo "  - EnhancedSupplierIntelligenceService"
echo "  - SupplyChainIntelligenceService"
echo "  - ScenarioModelingService"
echo "  - ResilienceAssessmentService"
echo "  - EnhancedProductData (type)"
echo "  - ScenarioInput (type)"
echo "  - ScenarioResult (type)"
echo "  - ResilienceMetrics (type)"
echo "  - SupplierMetrics (type)"

echo ""
echo "✅ Services to keep:"
echo "  - SAMGovService"
echo "  - FederalRegisterService"
