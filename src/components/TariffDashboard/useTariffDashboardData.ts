// Custom hook for Tariff Impact Dashboard data processing
import { useEffect, useState } from "react";
import { ProductEnhancementService } from "./services";
import {
  CashFlowProjection,
  DataSourceSummary,
  DataValidation,
  EnhancedProductData,
} from "./types";

export const useTariffDashboardData = (
  data?: any[],
  importedFileData?: any,
  enableRealTimeUpdates: boolean = true
) => {
  const [enhancedData, setEnhancedData] = useState<EnhancedProductData[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string>("");

  // Fallback functions for missing contexts
  const validateStepData = (step: string): DataValidation => ({
    isValid: true,
    completeness: 100,
    criticalFieldsMissing: [],
    templateDataCount: 0,
    userDataCount: data?.length || 0,
    warnings: [],
  });

  const getDataSourceSummary = (): DataSourceSummary => ({
    user: data?.length || 0,
    template: 0,
    calculated: 0,
    external: 0,
  });

  // Initialize enhanced data
  useEffect(() => {
    const initializeData = async () => {
      let sourceData: any[] = [];

      if (data && data.length > 0) {
        sourceData = data;
      } else if (importedFileData?.extractedData) {
        sourceData = importedFileData.extractedData;
      }

      if (sourceData.length > 0) {
        const enhanced = sourceData.map((item: any, index: number) => ({
          id: item.id || `item-${index}`,
          sku: item.sku || item.productName || `SKU-${index}`,
          description:
            item.description ||
            item.productDescription ||
            "Product Description",
          originalCost: parseFloat(
            item.originalCost || item.cost || item.baseCost || 0
          ),
          newCost: parseFloat(
            item.newCost || item.totalCost || item.cost * 1.1 || 0
          ),
          tariffRate: parseFloat(item.tariffRate || item.tariff || 0),
          marginImpact: parseFloat(item.marginImpact || item.margin || 0),
          quantity: parseInt(item.quantity || 1),
          totalOriginalCost:
            parseFloat(item.originalCost || item.cost || 0) *
            parseInt(item.quantity || 1),
          totalNewCost:
            parseFloat(item.newCost || item.cost * 1.1 || 0) *
            parseInt(item.quantity || 1),
          totalImpact:
            (parseFloat(item.newCost || item.cost * 1.1 || 0) -
              parseFloat(item.originalCost || item.cost || 0)) *
            parseInt(item.quantity || 1),
          lastUpdated: item.lastUpdated || new Date().toISOString(),
          dataSource: item.dataSource || "manual",
          htsCode: item.htsCode,
          htsConfidence: item.htsConfidence,
        })) as EnhancedProductData[];

        setEnhancedData(enhanced);

        // Set last updated time
        if (enhanced.some(item => item.lastUpdated)) {
          const latest = enhanced.reduce(
            (latest, item) =>
              new Date(item.lastUpdated) > new Date(latest)
                ? item.lastUpdated
                : latest,
            enhanced[0].lastUpdated
          );
          setLastUpdated(latest);
        }
      }
    };

    initializeData();
  }, [data, importedFileData]);

  // Refresh tariff rates
  const refreshTariffRates = async () => {
    if (!enableRealTimeUpdates || enhancedData.length === 0) return;

    setIsRefreshing(true);
    try {
      const refreshed = await ProductEnhancementService.refreshTariffRates(
        enhancedData
      );
      setEnhancedData(refreshed);
      setLastUpdated(new Date().toISOString());
    } catch (error) {
      console.error("Error refreshing tariff rates:", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Use enhanced data for calculations
  const displayData = enhancedData.length > 0 ? enhancedData : data || [];

  // Transform data for DataTable
  const tableData = displayData.map((item, index) => ({
    id: item.id || index + 1,
    sku: item.sku || item.productName || `ITEM-${index + 1}`,
    description:
      item.description || item.productDescription || "Product Description",
    cost: parseFloat(item.originalCost || item.cost || item.baseCost || 0),
    tariff: parseFloat(item.tariffRate || item.tariff || 0),
    totalCost: parseFloat(item.newCost || item.totalCost || item.cost || 0),
    margin: parseFloat(item.marginImpact || item.margin || 0),
  }));

  // Calculate comprehensive financial metrics
  const totalOriginalCost =
    displayData.length > 0
      ? displayData.reduce(
          (sum, item) =>
            sum +
            (item.totalOriginalCost ||
              item.originalCost * (item.quantity || 1)),
          0
        )
      : 0;

  const totalNewCost =
    displayData.length > 0
      ? displayData.reduce(
          (sum, item) =>
            sum + (item.totalNewCost || item.newCost * (item.quantity || 1)),
          0
        )
      : 0;

  const totalImpact = totalNewCost - totalOriginalCost;
  const impactPercentage =
    totalOriginalCost > 0 ? (totalImpact / totalOriginalCost) * 100 : 0;

  const averageTariffRate =
    displayData.length > 0
      ? displayData.reduce((sum, item) => sum + (item.tariffRate || 0), 0) /
        displayData.length
      : 0;

  // Identify high impact items
  const highImpactItems = displayData.filter(
    item => Math.abs(item.marginImpact || 0) > 10
  );
  const criticalItems = displayData.filter(
    item => Math.abs(item.marginImpact || 0) > 20
  );

  // Calculate potential savings
  const potentialSavings = {
    totalPotential: highImpactItems.reduce((sum, item) => {
      const itemImpact =
        item.totalImpact ||
        (item.newCost - item.originalCost) * (item.quantity || 1);
      return sum + Math.abs(itemImpact) * 0.2; // 20% potential savings
    }, 0),
    affectedProducts: highImpactItems.length,
    savingsPercentage: 0,
  };

  // Generate cash flow projections
  const generateDefaultCashFlow = (
    monthlyImpact: number
  ): CashFlowProjection[] => {
    const projections = [];
    for (let month = 1; month <= 12; month++) {
      const date = new Date();
      date.setMonth(date.getMonth() + month - 1);
      projections.push({
        period: date.toLocaleDateString("en-US", {
          month: "short",
          year: "numeric",
        }),
        originalCost: totalOriginalCost / 12,
        newCost: totalNewCost / 12,
        impact: monthlyImpact,
        cumulativeImpact: monthlyImpact * month,
      });
    }
    return projections;
  };

  const cashFlowProjections =
    importedFileData?.cashFlowProjections ||
    generateDefaultCashFlow(totalImpact);

  return {
    // Data
    displayData,
    enhancedData,
    tableData,

    // State
    isRefreshing,
    lastUpdated,

    // Metrics
    totalOriginalCost,
    totalNewCost,
    totalImpact,
    impactPercentage,
    averageTariffRate,

    // Analysis
    highImpactItems,
    criticalItems,
    potentialSavings,
    cashFlowProjections,

    // Functions
    refreshTariffRates,
    validateStepData,
    getDataSourceSummary,
  };
};
