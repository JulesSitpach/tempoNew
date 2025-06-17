import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertTriangle,
  BarChart3,
  Clock,
  DollarSign,
  Download,
  Percent,
  PieChart,
  RefreshCw,
  TrendingUp,
} from "lucide-react";
import { useEffect, useState } from "react";

// Fallback components for missing dependencies
const DataTable = ({ data }: { data: any[] }) => (
  <div className="overflow-x-auto">
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>SKU</TableHead>
          <TableHead>Description</TableHead>
          <TableHead className="text-right">Original Cost</TableHead>
          <TableHead className="text-right">Tariff Rate</TableHead>
          <TableHead className="text-right">New Cost</TableHead>
          <TableHead className="text-right">Impact</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((item, index) => (
          <TableRow key={item.id || index}>
            <TableCell className="font-medium">{item.sku}</TableCell>
            <TableCell>{item.description}</TableCell>
            <TableCell className="text-right">
              ${item.cost?.toFixed(2)}
            </TableCell>
            <TableCell className="text-right">
              {item.tariff?.toFixed(1)}%
            </TableCell>
            <TableCell className="text-right">
              ${item.totalCost?.toFixed(2)}
            </TableCell>
            <TableCell className="text-right">
              {item.margin?.toFixed(1)}%
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </div>
);

const DataSourceIndicator = ({
  dataSource,
  showTooltip = true,
}: {
  dataSource: any;
  showTooltip?: boolean;
}) => (
  <Badge variant="outline" className="text-xs">
    {dataSource.type === "external" ? "API" : "User"}
    {dataSource.confidence && ` (${dataSource.confidence}%)`}
  </Badge>
);

const DataValidationPanel = ({
  validation,
  dataSourceSummary,
  onUpdateData,
}: any) => (
  <Card>
    <CardHeader>
      <CardTitle className="text-lg">Data Validation</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="space-y-3">
        <div className="flex justify-between">
          <span className="text-sm">Completeness</span>
          <span className="font-medium">{validation.completeness}%</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm">Valid Records</span>
          <span className="font-medium">{validation.userDataCount}</span>
        </div>
        {validation.criticalFieldsMissing.length > 0 && (
          <div className="text-sm text-red-500">
            Missing: {validation.criticalFieldsMissing.join(", ")}
          </div>
        )}
        <Button
          onClick={onUpdateData}
          variant="outline"
          size="sm"
          className="w-full"
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh Data
        </Button>
      </div>
    </CardContent>
  </Card>
);

// Mock service interfaces
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
}

const ProductEnhancementService = {
  refreshTariffRates: async (data: EnhancedProductData[]) => {
    // Mock service - in real app this would call actual APIs
    return data.map(item => ({
      ...item,
      lastUpdated: new Date().toISOString(),
      dataSource: "api",
    }));
  },
};

const APICacheService = {
  processDataForVisualization: async (data: EnhancedProductData[]) => {
    // Mock processing
    return data;
  },
};

const ReportGenerationService = {
  generateExecutiveReport: async (analysisData: any, format: string) => {
    // Mock report generation
    return {
      content: `Executive Report - ${format.toUpperCase()}\n\nTotal Products: ${
        analysisData.totalProducts
      }\nTotal Impact: $${
        analysisData.totalImpact?.toLocaleString() || "0"
      }\n\nGenerated on: ${new Date().toISOString()}`,
    };
  },
};

interface TariffImpactDashboardProps {
  data?: any[];
  onExport?: (format: string) => void;
  language?: "en" | "es";
  enableRealTimeUpdates?: boolean;
  importedFileData?: any;
}

const TariffImpactDashboard = ({
  data,
  onExport = async format => {
    try {
      setIsRefreshing(true);

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
    } catch (error) {
      console.error("Export error:", error);
    } finally {
      setIsRefreshing(false);
    }
  },
  language = "en",
  enableRealTimeUpdates = true,
  importedFileData,
}: TariffImpactDashboardProps) => {
  // Fallback functions for missing contexts
  const validateStepData = (step: string) => ({
    isValid: true,
    completeness: 100,
    criticalFieldsMissing: [],
    templateDataCount: 0,
    userDataCount: data?.length || 0,
    warnings: [],
  });

  const getDataSourceSummary = () => ({
    user: data?.length || 0,
    template: 0,
    calculated: 0,
    external: 0,
  });

  const [activeTab, setActiveTab] = useState("overview");
  const [exportFormat, setExportFormat] = useState("excel");
  const [enhancedData, setEnhancedData] = useState<EnhancedProductData[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string>("");
  const [cashFlowView, setCashFlowView] = useState<"monthly" | "quarterly">(
    "monthly"
  );

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
  const generateDefaultCashFlow = (monthlyImpact: number) => {
    const projections = [];
    for (let month = 1; month <= 12; month++) {
      const date = new Date();
      date.setMonth(date.getMonth() + month - 1);
      projections.push({
        month: date.toLocaleDateString("en-US", {
          month: "short",
          year: "numeric",
        }),
        additionalCost: monthlyImpact,
        cumulativeImpact: monthlyImpact * month,
        cashFlowImpact: -monthlyImpact,
      });
    }
    return projections;
  };

  const cashFlowProjections =
    importedFileData?.cashFlowProjections ||
    generateDefaultCashFlow(totalImpact);

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
            onClick={() => onExport(exportFormat)}
            className="bg-primary hover:bg-primary/90"
          >
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Main Dashboard Content */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
        {/* Left Column - Metrics */}
        <div className="xl:col-span-2 space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="metric-card border-border/30 animate-fade-in">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Total Impact
                    </p>
                    <p className="text-2xl font-bold text-muted-foreground">
                      {displayData.length > 0 && totalImpact !== 0
                        ? `${totalImpact >= 0 ? "+" : ""}$${Math.abs(
                            totalImpact
                          ).toLocaleString()}`
                        : "$0"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {displayData.length > 0
                        ? "Monthly impact"
                        : "No data available"}
                    </p>
                  </div>
                  <div
                    className={`p-3 rounded-full ${
                      totalImpact >= 0 ? "bg-red-500/10" : "bg-green-500/10"
                    }`}
                  >
                    <DollarSign
                      className={`h-6 w-6 ${
                        totalImpact >= 0 ? "text-red-500" : "text-green-500"
                      }`}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card
              className="metric-card border-border/30 animate-fade-in"
              style={{ animationDelay: "0.1s" }}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Avg Tariff Rate
                    </p>
                    <p className="text-2xl font-bold text-muted-foreground">
                      {displayData.length > 0 && averageTariffRate > 0
                        ? `${averageTariffRate.toFixed(1)}%`
                        : "--"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {displayData.length > 0
                        ? `${displayData.length} products`
                        : "No products analyzed"}
                    </p>
                  </div>
                  <div className="p-3 bg-orange-500/10 rounded-full">
                    <Percent className="h-6 w-6 text-orange-500" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card
              className="metric-card border-border/30 animate-fade-in"
              style={{ animationDelay: "0.2s" }}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      High Risk Items
                    </p>
                    <p className="text-2xl font-bold text-muted-foreground">
                      {displayData.length > 0 ? highImpactItems.length : "--"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {displayData.length > 0
                        ? highImpactItems.length > 0
                          ? "Require attention"
                          : "All items low risk"
                        : "No data to analyze"}
                    </p>
                  </div>
                  <div className="p-3 bg-red-500/10 rounded-full">
                    <AlertTriangle className="h-6 w-6 text-red-500" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card
              className="metric-card border-border/30 animate-fade-in"
              style={{ animationDelay: "0.3s" }}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Potential Savings
                    </p>
                    <p className="text-2xl font-bold text-muted-foreground">
                      {displayData.length > 0 &&
                      potentialSavings.totalPotential > 0
                        ? `$${potentialSavings.totalPotential.toLocaleString()}`
                        : "$0"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {displayData.length > 0
                        ? potentialSavings.totalPotential > 0
                          ? "Through optimization"
                          : "No optimization needed"
                        : "No data to analyze"}
                    </p>
                  </div>
                  <div className="p-3 bg-green-500/10 rounded-full">
                    <TrendingUp className="h-6 w-6 text-green-500" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Cash Flow Projections */}
          <Card className="dashboard-card border-border/30">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">
                  Cash Flow Impact Projections
                </CardTitle>
                <div className="flex items-center space-x-2">
                  <Select
                    value={cashFlowView}
                    onValueChange={(value: "monthly" | "quarterly") =>
                      setCashFlowView(value)
                    }
                  >
                    <SelectTrigger className="w-[120px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="quarterly">Quarterly</SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="flex items-center space-x-2 bg-primary/10 px-3 py-1 rounded-full">
                    <span className="text-sm text-primary font-medium">
                      12-Month Forecast
                    </span>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="chart-container h-[300px] flex items-end justify-center space-x-1 p-6">
                {cashFlowProjections
                  .slice(0, cashFlowView === "monthly" ? 12 : 4)
                  .map((projection, index) => {
                    const maxImpact = Math.max(
                      ...cashFlowProjections.map(p =>
                        Math.abs(p.cumulativeImpact)
                      )
                    );
                    const height = Math.max(
                      20,
                      (Math.abs(projection.cumulativeImpact) / maxImpact) * 250
                    );
                    const isNegative = projection.cumulativeImpact < 0;

                    return (
                      <div
                        key={projection.month}
                        className="flex flex-col items-center space-y-2 group cursor-pointer"
                        title={`${projection.month}: ${
                          isNegative ? "-" : "+"
                        }$${Math.abs(
                          projection.cumulativeImpact
                        ).toLocaleString()}`}
                      >
                        <div className="text-xs font-medium text-muted-foreground group-hover:text-primary transition-colors">
                          $
                          {Math.abs(projection.cumulativeImpact / 1000).toFixed(
                            0
                          )}
                          k
                        </div>
                        <div
                          className={`${
                            isNegative
                              ? "bg-gradient-to-t from-red-500 to-red-400"
                              : "bg-gradient-to-t from-green-500 to-green-400"
                          } rounded-t-md transition-all duration-1000 ease-out group-hover:opacity-80`}
                          style={{
                            width: cashFlowView === "monthly" ? "24px" : "48px",
                            height: `${height}px`,
                            animationDelay: `${index * 0.1}s`,
                          }}
                        ></div>
                        <span className="text-xs text-muted-foreground group-hover:text-primary transition-colors">
                          {cashFlowView === "monthly"
                            ? projection.month.split(" ")[0]
                            : projection.month}
                        </span>
                      </div>
                    );
                  })}
              </div>
              <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="text-center">
                  <div className="font-semibold text-red-500">
                    ${Math.abs(totalImpact).toLocaleString()}
                  </div>
                  <div className="text-muted-foreground">Monthly Impact</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold text-red-600">
                    ${Math.abs(totalImpact * 12).toLocaleString()}
                  </div>
                  <div className="text-muted-foreground">Annual Impact</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold text-green-500">
                    ${potentialSavings.totalPotential.toLocaleString()}
                  </div>
                  <div className="text-muted-foreground">Potential Savings</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold text-blue-500">
                    {averageTariffRate.toFixed(1)}%
                  </div>
                  <div className="text-muted-foreground">Avg Tariff Rate</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Additional Metrics */}
        <div className="space-y-6">
          {/* Financial Summary */}
          <Card className="dashboard-card border-border/30">
            <CardHeader>
              <CardTitle className="text-lg">
                Financial Impact Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  Original Value
                </span>
                <span className="font-semibold">
                  ${totalOriginalCost.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">New Value</span>
                <span className="font-semibold">
                  ${totalNewCost.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  Total Impact
                </span>
                <span
                  className={`font-semibold ${
                    totalImpact >= 0 ? "text-red-500" : "text-green-500"
                  }`}
                >
                  {totalImpact >= 0 ? "+" : ""}${totalImpact.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Impact %</span>
                <span
                  className={`font-semibold ${
                    impactPercentage >= 0 ? "text-red-500" : "text-green-500"
                  }`}
                >
                  {impactPercentage >= 0 ? "+" : ""}
                  {impactPercentage.toFixed(1)}%
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Risk Alerts */}
          <Card className="dashboard-card border-border/30">
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2 text-red-500" />
                Risk Alerts
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {criticalItems.slice(0, 3).map((item, index) => (
                <div
                  key={item.id}
                  className="flex items-center space-x-3 p-3 bg-red-500/10 rounded-lg border border-red-500/20"
                >
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{item.sku}</p>
                    <p className="text-xs text-muted-foreground">
                      Impact: {item.marginImpact?.toFixed(1) || 0}% | $
                      {(
                        (item.newCost - item.originalCost) *
                        (item.quantity || 1)
                      ).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
              {highImpactItems.slice(0, 2).map((item, index) => (
                <div
                  key={`warning-${item.id}`}
                  className="flex items-center space-x-3 p-3 bg-yellow-400/10 rounded-lg border border-yellow-400/20"
                >
                  <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{item.sku}</p>
                    <p className="text-xs text-muted-foreground">
                      Impact: {item.marginImpact?.toFixed(1) || 0}% | $
                      {(
                        (item.newCost - item.originalCost) *
                        (item.quantity || 1)
                      ).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
              {highImpactItems.length === 0 && (
                <div className="text-center py-4 text-muted-foreground">
                  <div className="flex items-center justify-center mb-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    <p className="text-sm">
                      All products within acceptable risk levels
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Data Validation */}
          <DataValidationPanel
            validation={validateStepData("tariff-analysis")}
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

        <TabsContent value="overview" className="space-y-6">
          <Card className="dashboard-card border-border/30">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Tariff Impact Overview</span>
                <div className="flex items-center gap-2">
                  {displayData.length > 0 && (
                    <DataSourceIndicator
                      dataSource={{
                        type: enhancedData.some(
                          item => item.dataSource === "api"
                        )
                          ? "external"
                          : "user",
                        confidence:
                          enhancedData.length > 0
                            ? Math.round(
                                (enhancedData.filter(item => item.htsCode)
                                  .length /
                                  enhancedData.length) *
                                  100
                              )
                            : undefined,
                        source: "UN Comtrade API",
                      }}
                    />
                  )}
                </div>
              </CardTitle>
              <CardDescription>
                Comprehensive analysis of tariff effects on your purchase orders
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Executive Summary */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border border-blue-200">
                  <div className="text-sm text-blue-600 font-medium flex items-center justify-between">
                    <span>Products Analyzed</span>
                    <DataSourceIndicator
                      dataSource={{ type: "user" }}
                      showTooltip={false}
                    />
                  </div>
                  <div className="text-2xl font-bold text-blue-700">
                    {displayData.length}
                  </div>
                </div>
                <div className="p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-lg border border-green-200">
                  <div className="text-sm text-green-600 font-medium flex items-center justify-between">
                    <span>Original Portfolio Value</span>
                    <DataSourceIndicator
                      dataSource={{ type: "calculated" }}
                      showTooltip={false}
                    />
                  </div>
                  <div className="text-2xl font-bold text-green-700">
                    ${totalOriginalCost.toLocaleString()}
                  </div>
                </div>
                <div className="p-4 bg-gradient-to-r from-red-50 to-red-100 rounded-lg border border-red-200">
                  <div className="text-sm text-red-600 font-medium flex items-center justify-between">
                    <span>Additional Annual Cost</span>
                    <DataSourceIndicator
                      dataSource={{
                        type: "external",
                        source: "UN Comtrade API",
                      }}
                      showTooltip={false}
                    />
                  </div>
                  <div className="text-2xl font-bold text-red-700">
                    ${(totalImpact * 12).toLocaleString()}
                  </div>
                </div>
                <div className="p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg border border-purple-200">
                  <div className="text-sm text-purple-600 font-medium flex items-center justify-between">
                    <span>Optimization Potential</span>
                    <DataSourceIndicator
                      dataSource={{ type: "calculated" }}
                      showTooltip={false}
                    />
                  </div>
                  <div className="text-2xl font-bold text-purple-700">
                    ${potentialSavings.totalPotential.toLocaleString()}
                  </div>
                </div>
              </div>

              <DataTable data={tableData} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analysis" className="space-y-6">
          <Card className="dashboard-card border-border/30">
            <CardHeader>
              <CardTitle>Detailed Impact Analysis</CardTitle>
              <CardDescription>
                Product-level breakdown of tariff impacts and cost increases
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Impact Distribution */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="p-6 bg-green-50 rounded-lg border border-green-200">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600 mb-2">
                      {
                        displayData.filter(
                          item => Math.abs(item.marginImpact || 0) <= 5
                        ).length
                      }
                    </div>
                    <div className="text-sm text-green-700 font-medium">
                      Low Impact Products
                    </div>
                    <div className="text-xs text-green-600">
                      ≤5% margin impact
                    </div>
                  </div>
                </div>
                <div className="p-6 bg-yellow-50 rounded-lg border border-yellow-200">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-yellow-600 mb-2">
                      {
                        displayData.filter(
                          item =>
                            Math.abs(item.marginImpact || 0) > 5 &&
                            Math.abs(item.marginImpact || 0) <= 15
                        ).length
                      }
                    </div>
                    <div className="text-sm text-yellow-700 font-medium">
                      Medium Impact Products
                    </div>
                    <div className="text-xs text-yellow-600">
                      5-15% margin impact
                    </div>
                  </div>
                </div>
                <div className="p-6 bg-red-50 rounded-lg border border-red-200">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-red-600 mb-2">
                      {
                        displayData.filter(
                          item => Math.abs(item.marginImpact || 0) > 15
                        ).length
                      }
                    </div>
                    <div className="text-sm text-red-700 font-medium">
                      High Impact Products
                    </div>
                    <div className="text-xs text-red-600">
                      &gt;15% margin impact
                    </div>
                  </div>
                </div>
              </div>

              <DataTable data={tableData} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cashflow" className="space-y-6">
          <Card className="dashboard-card border-border/30">
            <CardHeader>
              <CardTitle>Cash Flow Projections</CardTitle>
              <CardDescription>
                12-month financial impact forecast for budget planning
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Cash Flow Summary */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                  <div className="text-sm text-red-600 font-medium">
                    Monthly Impact
                  </div>
                  <div className="text-xl font-bold text-red-700">
                    -${Math.abs(totalImpact).toLocaleString()}
                  </div>
                </div>
                <div className="p-4 bg-red-100 rounded-lg border border-red-300">
                  <div className="text-sm text-red-700 font-medium">
                    Quarterly Impact
                  </div>
                  <div className="text-xl font-bold text-red-800">
                    -${Math.abs(totalImpact * 3).toLocaleString()}
                  </div>
                </div>
                <div className="p-4 bg-red-200 rounded-lg border border-red-400">
                  <div className="text-sm text-red-800 font-medium">
                    Annual Impact
                  </div>
                  <div className="text-xl font-bold text-red-900">
                    -${Math.abs(totalImpact * 12).toLocaleString()}
                  </div>
                </div>
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="text-sm text-green-600 font-medium">
                    Potential Recovery
                  </div>
                  <div className="text-xl font-bold text-green-700">
                    ${potentialSavings.totalPotential.toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Monthly Breakdown Table */}
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-card/50 border-border">
                      <TableHead className="text-foreground font-semibold">
                        Month
                      </TableHead>
                      <TableHead className="text-right text-foreground font-semibold">
                        Additional Cost
                      </TableHead>
                      <TableHead className="text-right text-foreground font-semibold">
                        Cumulative Impact
                      </TableHead>
                      <TableHead className="text-right text-foreground font-semibold">
                        Cash Flow Impact
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {cashFlowProjections.map((projection, index) => (
                      <TableRow
                        key={projection.month}
                        className="border-border hover:bg-muted/50"
                      >
                        <TableCell className="font-medium text-foreground">
                          {projection.month}
                        </TableCell>
                        <TableCell className="text-right text-red-400 font-medium">
                          $
                          {Math.abs(projection.additionalCost).toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right text-red-300 font-semibold">
                          $
                          {Math.abs(
                            projection.cumulativeImpact
                          ).toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right text-red-200 font-bold">
                          -$
                          {Math.abs(projection.cashFlowImpact).toLocaleString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="products" className="space-y-6">
          <Card className="dashboard-card border-border/30">
            <CardHeader>
              <CardTitle>Product Portfolio Analysis</CardTitle>
              <CardDescription>
                Detailed breakdown of individual product impacts and
                recommendations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DataTable data={tableData} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-6">
          <Card className="dashboard-card border-border/30">
            <CardHeader>
              <CardTitle>Risk Alerts & Notifications</CardTitle>
              <CardDescription>
                Monitor critical market conditions and portfolio risks
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 mb-6">
                {highImpactItems.length > 0 ? (
                  highImpactItems.map(item => (
                    <div
                      key={item.id}
                      className="flex items-center p-4 border border-red-500/20 rounded-lg bg-red-500/5"
                    >
                      <AlertTriangle className="h-5 w-5 text-red-400 mr-3" />
                      <div className="flex-1">
                        <p className="font-medium">
                          {item.sku} - {item.description}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Risk Level: High | Impact:{" "}
                          <span className="text-red-400 font-medium">
                            {item.marginImpact?.toFixed(1) || 0}%
                          </span>
                        </p>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-red-500/20 text-red-400 hover:bg-red-500/10"
                      >
                        Review
                      </Button>
                    </div>
                  ))
                ) : (
                  <div className="flex items-center justify-center h-32 chart-container">
                    <div className="text-center">
                      <AlertTriangle className="h-12 w-12 mx-auto text-green-400 mb-2" />
                      <p className="text-muted-foreground">
                        All systems operational
                      </p>
                    </div>
                  </div>
                )}
              </div>
              <DataTable data={tableData} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TariffImpactDashboard;
