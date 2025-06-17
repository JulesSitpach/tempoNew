import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertTriangle,
  BarChart3,
  Clock,
  DollarSign,
  Download,
  Package,
  RefreshCw,
  TrendingUp,
} from "lucide-react";
import React, { useEffect, useState } from "react";

// Tab Components
import { CashFlowTab } from "./CostCalculatorDashboard/CashFlowTab";
import { ImpactAnalysisTab } from "./CostCalculatorDashboard/ImpactAnalysisTab";
import { OverviewTab } from "./CostCalculatorDashboard/OverviewTab";
import { ProductsTab } from "./CostCalculatorDashboard/ProductsTab";
import { RiskAlertsTab } from "./CostCalculatorDashboard/RiskAlertsTab";

interface CostCalculatorDashboardProps {
  data?: any[];
  onExport?: (format: string) => void;
  language?: "en" | "es";
  enableRealTimeUpdates?: boolean;
  importedFileData?: any;
}

interface EnhancedProductData {
  id: string;
  sku: string;
  description: string;
  originalCost: number;
  newCost: number;
  tariffRate: number;
  marginImpact: number;
  quantity: number;
  totalOriginalCost: number;
  totalNewCost: number;
  totalImpact: number;
  htsCode?: string;
  htsConfidence?: number;
  lastUpdated: string;
  dataSource: string;
  riskLevel?: "low" | "medium" | "high" | "critical";
}

const CostCalculatorDashboard: React.FC<CostCalculatorDashboardProps> = ({
  data,
  onExport,
  language = "en",
  enableRealTimeUpdates = true,
  importedFileData,
}) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [exportFormat, setExportFormat] = useState("excel");
  const [enhancedData, setEnhancedData] = useState<EnhancedProductData[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string>("");

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
          riskLevel:
            item.riskLevel ||
            (item.marginImpact > 20
              ? "critical"
              : item.marginImpact > 10
              ? "high"
              : "low"),
        })) as EnhancedProductData[];

        setEnhancedData(enhanced);
        setLastUpdated(new Date().toISOString());
      }
    };

    initializeData();
  }, [data, importedFileData]);

  // Calculate metrics
  const displayData = enhancedData.length > 0 ? enhancedData : data || [];

  const totalOriginalCost = displayData.reduce(
    (sum, item) =>
      sum +
      (item.totalOriginalCost || item.originalCost * (item.quantity || 1)),
    0
  );

  const totalNewCost = displayData.reduce(
    (sum, item) =>
      sum + (item.totalNewCost || item.newCost * (item.quantity || 1)),
    0
  );

  const totalImpact = totalNewCost - totalOriginalCost;
  const impactPercentage =
    totalOriginalCost > 0 ? (totalImpact / totalOriginalCost) * 100 : 0;
  const averageTariffRate =
    displayData.length > 0
      ? displayData.reduce((sum, item) => sum + (item.tariffRate || 0), 0) /
        displayData.length
      : 0;

  const highImpactItems = displayData.filter(
    item => Math.abs(item.marginImpact || 0) > 10
  );
  const criticalItems = displayData.filter(
    item =>
      item.riskLevel === "critical" || Math.abs(item.marginImpact || 0) > 20
  );

  const potentialSavings = {
    totalPotential: highImpactItems.reduce((sum, item) => {
      const itemImpact =
        item.totalImpact ||
        (item.newCost - item.originalCost) * (item.quantity || 1);
      return sum + Math.abs(itemImpact) * 0.2;
    }, 0),
    affectedProducts: highImpactItems.length,
    savingsPercentage: 20,
  };

  // Generate cash flow projections
  const generateCashFlowProjections = (monthlyImpact: number) => {
    const projections = [];
    for (let month = 1; month <= 12; month++) {
      const date = new Date();
      date.setMonth(date.getMonth() + month - 1);
      projections.push({
        month: date.toLocaleDateString("en-US", { month: "short" }),
        additionalCost: monthlyImpact,
        cumulativeImpact: monthlyImpact * month,
        cashFlowImpact: -monthlyImpact,
        value: Math.abs((monthlyImpact * month) / 1000), // For chart display
      });
    }
    return projections;
  };

  const cashFlowProjections = generateCashFlowProjections(totalImpact / 12);

  const refreshData = async () => {
    setIsRefreshing(true);
    try {
      // Simulate API refresh
      await new Promise(resolve => setTimeout(resolve, 1000));
      setLastUpdated(new Date().toISOString());
    } catch (error) {
      console.error("Error refreshing data:", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleExport = async (format: string) => {
    if (onExport) {
      await onExport(format);
    }
  };

  // Common props to pass to tab components
  const tabProps = {
    data: displayData,
    totalOriginalCost,
    totalNewCost,
    totalImpact,
    impactPercentage,
    averageTariffRate,
    highImpactItems,
    criticalItems,
    potentialSavings,
    cashFlowProjections,
    lastUpdated,
    isRefreshing,
    onRefresh: refreshData,
    language,
  };

  return (
    <div className="min-h-screen bg-background p-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
        <div className="mb-4 lg:mb-0">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
            Cost Calculator Dashboard
          </h1>
          <p className="text-muted-foreground mt-2">
            Real-time tariff impact analysis with cash flow projections
          </p>
          {importedFileData && (
            <div className="mt-2 flex items-center gap-4 text-sm text-muted-foreground">
              <span>
                File:{" "}
                {importedFileData.fileName || "sample_purchase_orders.csv"}
              </span>
              <span>•</span>
              <span>{displayData.length} products analyzed</span>
              <span>•</span>
              <span>Total Value: ${totalOriginalCost.toLocaleString()}</span>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-3">
          {enableRealTimeUpdates && (
            <div className="flex items-center space-x-2 bg-orange-500/10 px-3 py-1 rounded-full">
              <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-orange-600">
                Live Data
              </span>
            </div>
          )}
          {lastUpdated && (
            <div className="flex items-center space-x-1 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              <span>Updated: {new Date(lastUpdated).toLocaleTimeString()}</span>
            </div>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={refreshData}
            disabled={isRefreshing}
            className="flex items-center gap-1"
          >
            <RefreshCw
              className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>{" "}
          <div className="flex items-center gap-2">
            <select
              value={exportFormat}
              onChange={e => setExportFormat(e.target.value)}
              className="text-sm border rounded px-2 py-1"
              title="Export format selection"
              aria-label="Select export format"
            >
              <option value="excel">Excel</option>
              <option value="pdf">PDF</option>
              <option value="csv">CSV</option>
            </select>
            <Button
              onClick={() => handleExport(exportFormat)}
              className="bg-orange-500 hover:bg-orange-600 text-white"
              size="sm"
            >
              <Download className="h-4 w-4 mr-1" />
              Export
            </Button>
          </div>
        </div>
      </div>

      {/* Main Dashboard Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5 mb-6">
          <TabsTrigger
            value="overview"
            className="flex items-center gap-2 data-[state=active]:bg-orange-500 data-[state=active]:text-white"
          >
            <BarChart3 className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger
            value="impact"
            className="flex items-center gap-2 data-[state=active]:bg-orange-500 data-[state=active]:text-white"
          >
            <TrendingUp className="h-4 w-4" />
            Impact Analysis
          </TabsTrigger>
          <TabsTrigger
            value="cashflow"
            className="flex items-center gap-2 data-[state=active]:bg-orange-500 data-[state=active]:text-white"
          >
            <DollarSign className="h-4 w-4" />
            Cash Flow
          </TabsTrigger>
          <TabsTrigger
            value="products"
            className="flex items-center gap-2 data-[state=active]:bg-orange-500 data-[state=active]:text-white"
          >
            <Package className="h-4 w-4" />
            Products
          </TabsTrigger>
          <TabsTrigger
            value="risks"
            className="flex items-center gap-2 data-[state=active]:bg-orange-500 data-[state=active]:text-white"
          >
            <AlertTriangle className="h-4 w-4" />
            Risk Alerts
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <OverviewTab {...tabProps} />
        </TabsContent>

        <TabsContent value="impact" className="space-y-6">
          <ImpactAnalysisTab {...tabProps} />
        </TabsContent>

        <TabsContent value="cashflow" className="space-y-6">
          <CashFlowTab {...tabProps} />
        </TabsContent>

        <TabsContent value="products" className="space-y-6">
          <ProductsTab {...tabProps} />
        </TabsContent>

        <TabsContent value="risks" className="space-y-6">
          <RiskAlertsTab {...tabProps} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CostCalculatorDashboard;
