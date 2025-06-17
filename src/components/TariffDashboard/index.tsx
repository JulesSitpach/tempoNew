// Main Tariff Impact Dashboard Component
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertTriangle,
  BarChart3,
  Clock,
  DollarSign,
  Download,
  PieChart,
  RefreshCw,
  TrendingUp,
} from "lucide-react";
import { useState } from "react";

// Import components
import { AlertsTab } from "./AlertsTab";
import { AnalysisTab } from "./AnalysisTab";
import { CashflowTab } from "./CashflowTab";
import { OverviewTab } from "./OverviewTab";
import { ProductsTab } from "./ProductsTab";
import { DataValidationPanel } from "./SharedComponents";

// Import types and hooks
import { ReportGenerationService } from "./services";
import { TariffImpactDashboardProps } from "./types";
import { useTariffDashboardData } from "./useTariffDashboardData";

const TariffImpactDashboard = ({
  data,
  onExport = async format => {
    // Default export implementation
    console.log(`Exporting in ${format} format`);
  },
  language = "en",
  enableRealTimeUpdates = true,
  importedFileData,
}: TariffImpactDashboardProps) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [exportFormat, setExportFormat] = useState("excel");

  const {
    displayData,
    enhancedData,
    tableData,
    isRefreshing,
    lastUpdated,
    totalOriginalCost,
    totalNewCost,
    totalImpact,
    impactPercentage,
    averageTariffRate,
    highImpactItems,
    criticalItems,
    potentialSavings,
    cashFlowProjections,
    refreshTariffRates,
    validateStepData,
    getDataSourceSummary,
  } = useTariffDashboardData(data, importedFileData, enableRealTimeUpdates);

  const handleExport = async (format: string) => {
    try {
      // Prepare analysis data for report generation
      const analysisData = {
        totalProducts: displayData.length,
        totalOriginalValue: totalOriginalCost,
        totalNewValue: totalNewCost,
        totalImpact: totalImpact,
        averageTariffRate: averageTariffRate,
        highImpactProducts: highImpactItems,
        criticalItems: criticalItems,
        potentialSavings: potentialSavings,
        cashFlowProjections: cashFlowProjections,
        fileName: importedFileData?.fileName || "analysis",
      };

      // Generate report using service
      const report = await ReportGenerationService.generateExecutiveReport(
        analysisData,
        format
      );

      // Create downloadable content
      const blob = new Blob([report.content], {
        type: format === "pdf" ? "application/pdf" : "text/plain",
      });

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `tariff-impact-report-${
        new Date().toISOString().split("T")[0]
      }.${format === "excel" ? "xlsx" : format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      console.log(`Report generated and downloaded in ${format} format`);

      // Call the provided onExport callback
      await onExport(format);
    } catch (error) {
      console.error("Export error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
        <div className="mb-4 lg:mb-0">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">
            Cost Calculator Dashboard
          </h1>
          <p className="text-muted-foreground mt-2">
            Real-time tariff impact analysis with cash flow projections
          </p>
          {importedFileData && (
            <div className="mt-2 flex items-center gap-4 text-sm text-muted-foreground">
              <span>File: {importedFileData.fileName}</span>
              <span>•</span>
              <span>{displayData.length} products analyzed</span>
              <span>•</span>
              <span>Total Value: ${totalOriginalCost.toLocaleString()}</span>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-3">
          {enableRealTimeUpdates && (
            <div className="flex items-center space-x-2 bg-primary/10 px-3 py-1 rounded-full">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-primary">
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
          {enableRealTimeUpdates && (
            <Button
              variant="outline"
              size="sm"
              onClick={refreshTariffRates}
              disabled={isRefreshing}
              className="flex items-center gap-1"
            >
              <RefreshCw
                className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>
          )}
          <Select value={exportFormat} onValueChange={setExportFormat}>
            <SelectTrigger className="w-[120px] bg-card border-border/50">
              <SelectValue placeholder="Format" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="excel">Excel</SelectItem>
              <SelectItem value="pdf">PDF</SelectItem>
              <SelectItem value="csv">CSV</SelectItem>
            </SelectContent>
          </Select>
          <Button
            onClick={() => handleExport(exportFormat)}
            className="bg-primary hover:bg-primary/90"
          >
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="p-6 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border border-blue-200">
          <div className="text-sm text-blue-600 font-medium">
            Total Products
          </div>
          <div className="text-2xl font-bold text-blue-700">
            {displayData.length}
          </div>
        </div>
        <div className="p-6 bg-gradient-to-r from-green-50 to-green-100 rounded-lg border border-green-200">
          <div className="text-sm text-green-600 font-medium">
            Portfolio Value
          </div>
          <div className="text-2xl font-bold text-green-700">
            ${totalOriginalCost.toLocaleString()}
          </div>
        </div>
        <div className="p-6 bg-gradient-to-r from-red-50 to-red-100 rounded-lg border border-red-200">
          <div className="text-sm text-red-600 font-medium">Total Impact</div>
          <div className="text-2xl font-bold text-red-700">
            ${Math.abs(totalImpact).toLocaleString()}
          </div>
        </div>
        <div className="p-6 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg border border-purple-200">
          <div className="text-sm text-purple-600 font-medium">Impact %</div>
          <div className="text-2xl font-bold text-purple-700">
            {impactPercentage.toFixed(1)}%
          </div>
        </div>
      </div>

      {/* Data Validation Section */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
        <div className="lg:col-span-3">
          {/* Content placeholder for additional controls */}
        </div>
        <div>
          <DataValidationPanel
            validation={validateStepData("products")}
            dataSourceSummary={getDataSourceSummary()}
            onUpdateData={refreshTariffRates}
          />
        </div>
      </div>

      {/* Tabs Section */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 md:grid-cols-5 mb-6 bg-card/50 border border-border/30">
          <TabsTrigger
            value="overview"
            className="flex items-center data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <BarChart3 className="mr-2 h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger
            value="analysis"
            className="flex items-center data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <TrendingUp className="mr-2 h-4 w-4" />
            Impact Analysis
          </TabsTrigger>
          <TabsTrigger
            value="cashflow"
            className="flex items-center data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <DollarSign className="mr-2 h-4 w-4" />
            Cash Flow
          </TabsTrigger>
          <TabsTrigger
            value="products"
            className="flex items-center data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <PieChart className="mr-2 h-4 w-4" />
            Products
          </TabsTrigger>
          <TabsTrigger
            value="alerts"
            className="flex items-center data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <AlertTriangle className="mr-2 h-4 w-4" />
            Risk Alerts
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <OverviewTab
            displayData={displayData}
            enhancedData={enhancedData}
            totalOriginalCost={totalOriginalCost}
            totalImpact={totalImpact}
            potentialSavings={potentialSavings}
            tableData={tableData}
          />
        </TabsContent>

        <TabsContent value="analysis">
          <AnalysisTab displayData={displayData} tableData={tableData} />
        </TabsContent>

        <TabsContent value="cashflow">
          <CashflowTab
            totalImpact={totalImpact}
            potentialSavings={potentialSavings}
            cashFlowProjections={cashFlowProjections}
          />
        </TabsContent>

        <TabsContent value="products">
          <ProductsTab tableData={tableData} />
        </TabsContent>

        <TabsContent value="alerts">
          <AlertsTab highImpactItems={highImpactItems} tableData={tableData} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TariffImpactDashboard;
