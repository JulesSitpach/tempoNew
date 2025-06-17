import { Alert, AlertDescription } from "@/components/ui/alert";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertTriangle,
  Calculator,
  Clock,
  DollarSign,
  Download,
  FileText,
  Globe,
  Package,
  Percent,
  RefreshCw,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

interface TariffImpactDashboardProps {
  data?: any[];
  onExport?: (format: string) => void;
  language?: "en" | "es";
  enableRealTimeUpdates?: boolean;
  importedFileData?: any;
}

const TariffImpactDashboard = ({
  data,
  onExport,
  language = "en",
  enableRealTimeUpdates = true,
  importedFileData,
}: TariffImpactDashboardProps) => {
  const { t } = useTranslation("dashboard");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string>("");

  // Use data from importedFileData if available, otherwise use data prop
  const displayData = importedFileData?.extractedData || data || [];

  // Calculate comprehensive financial metrics
  const totalOriginalCost = displayData.reduce(
    (sum: number, item: any) =>
      sum +
      (item.totalOriginalCost || item.originalCost * (item.quantity || 1)),
    0
  );

  const totalNewCost = displayData.reduce(
    (sum: number, item: any) =>
      sum +
      (item.totalNewCost ||
        (item.newCost || item.originalCost) * (item.quantity || 1)),
    0
  );

  const totalImpact = totalNewCost - totalOriginalCost;
  const impactPercentage =
    totalOriginalCost > 0 ? (totalImpact / totalOriginalCost) * 100 : 0;

  const averageTariffRate =
    displayData.length > 0
      ? displayData.reduce(
          (sum: number, item: any) => sum + (item.tariffRate || 0),
          0
        ) / displayData.length
      : 0;

  const maxTariffRate =
    displayData.length > 0
      ? Math.max(...displayData.map((item: any) => item.tariffRate || 0))
      : 0;

  const productsWithHTS =
    importedFileData?.productsWithHTS ||
    displayData.filter((item: any) => item.htsCode).length;
  const productsWithTariffs =
    importedFileData?.productsWithTariffs ||
    displayData.filter((item: any) => item.tariffRate > 0).length;

  // Refresh tariff rates
  const refreshTariffRates = async () => {
    if (!enableRealTimeUpdates) return;
    setIsRefreshing(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      setLastUpdated(new Date().toISOString());
    } catch (error) {
      console.error("Error refreshing tariff rates:", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Export handler
  const handleExport =
    onExport ||
    ((format: string) => {
      console.log(`Exporting as ${format}...`);
      // Implementation would go here
    });

  useEffect(() => {
    if (displayData.length > 0) {
      setLastUpdated(new Date().toISOString());
    }
  }, [displayData]);

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      {/* Professional Header Section */}
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg shadow-lg">
                <Calculator className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                  {t("costCalculator.title")}
                </h1>
                <p className="text-muted-foreground text-sm md:text-base">
                  {t("costCalculator.subtitle")}
                </p>
              </div>
            </div>

            {importedFileData && (
              <div className="mt-3 p-3 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg">
                <div className="flex flex-wrap items-center gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-green-600" />
                    <span className="font-medium text-green-800">
                      {importedFileData.fileName}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-blue-600" />
                    <span className="text-gray-700">
                      {displayData.length}{" "}
                      {t("costCalculator.analysis.totalProducts").toLowerCase()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-orange-600" />
                    <span className="text-gray-700">
                      ${totalOriginalCost.toLocaleString()}
                    </span>
                  </div>
                  {productsWithHTS > 0 && (
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4 text-purple-600" />
                      <span className="text-gray-700">
                        {productsWithHTS} HTS codes found
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-3">
            {enableRealTimeUpdates && (
              <div className="flex items-center space-x-2 bg-gradient-to-r from-green-50 to-emerald-50 px-3 py-2 rounded-full border border-green-200">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-green-700">
                  Live Data
                </span>
              </div>
            )}
            {lastUpdated && (
              <div className="flex items-center space-x-1 text-xs text-muted-foreground bg-slate-50 px-2 py-1 rounded">
                <Clock className="h-3 w-3" />
                <span>
                  Updated: {new Date(lastUpdated).toLocaleTimeString()}
                </span>
              </div>
            )}
            {enableRealTimeUpdates && (
              <Button
                variant="outline"
                size="sm"
                onClick={refreshTariffRates}
                disabled={isRefreshing}
                className="flex items-center gap-2 hover:bg-orange-50 hover:border-orange-200 hover:text-orange-700 transition-all duration-200"
              >
                <RefreshCw
                  className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
                />
                Refresh
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Main Dashboard Content */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
        {/* Left Column - Main Analysis */}
        <div className="xl:col-span-2 space-y-6">
          {/* Professional Key Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Total Impact Card */}
            <Card className="border border-slate-200 bg-gradient-to-br from-red-50 to-pink-50 hover:shadow-md transition-all duration-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-slate-600">
                      {t("costCalculator.analysis.totalImpact")}
                    </p>
                    <p className="text-2xl font-bold text-slate-900">
                      {displayData.length > 0 && totalImpact !== 0
                        ? `$${Math.abs(totalImpact).toLocaleString()}`
                        : "$0"}
                    </p>
                    <p className="text-xs text-slate-500">
                      {displayData.length > 0 &&
                        totalImpact > 0 &&
                        "Additional costs"}
                      {displayData.length > 0 &&
                        totalImpact < 0 &&
                        "Cost savings"}
                      {(displayData.length === 0 || totalImpact === 0) &&
                        "No impact"}
                    </p>
                  </div>
                  <div className="p-3 bg-red-500 rounded-lg shadow-sm">
                    <DollarSign className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Total Products Card */}
            <Card className="border border-slate-200 bg-gradient-to-br from-blue-50 to-indigo-50 hover:shadow-md transition-all duration-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-slate-600">
                      {t("costCalculator.analysis.totalProducts")}
                    </p>
                    <p className="text-2xl font-bold text-slate-900">
                      {displayData.length.toLocaleString()}
                    </p>
                    <p className="text-xs text-slate-500">
                      {productsWithTariffs > 0
                        ? `${productsWithTariffs} with tariffs`
                        : "No tariff data"}
                    </p>
                  </div>
                  <div className="p-3 bg-blue-500 rounded-lg shadow-sm">
                    <Package className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Average Tariff Rate Card */}
            <Card className="border border-slate-200 bg-gradient-to-br from-orange-50 to-amber-50 hover:shadow-md transition-all duration-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-slate-600">
                      Average Tariff Rate
                    </p>
                    <p className="text-2xl font-bold text-slate-900">
                      {displayData.length > 0
                        ? `${averageTariffRate.toFixed(1)}%`
                        : "0%"}
                    </p>
                    <p className="text-xs text-slate-500">
                      {productsWithTariffs > 0
                        ? `Range: 0% - ${maxTariffRate.toFixed(1)}%`
                        : "No tariff rates"}
                    </p>
                  </div>
                  <div className="p-3 bg-orange-500 rounded-lg shadow-sm">
                    <Percent className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* HTS Codes Found Card */}
            <Card className="border border-slate-200 bg-gradient-to-br from-green-50 to-emerald-50 hover:shadow-md transition-all duration-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-slate-600">
                      HTS Codes Found
                    </p>
                    <p className="text-2xl font-bold text-slate-900">
                      {productsWithHTS || 0}
                    </p>
                    <p className="text-xs text-slate-500">
                      {displayData.length > 0
                        ? `${Math.round(
                            ((productsWithHTS || 0) / displayData.length) * 100
                          )}% coverage`
                        : "No data"}
                    </p>
                  </div>
                  <div className="p-3 bg-green-500 rounded-lg shadow-sm">
                    <Globe className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Enhanced Data Table */}
          {displayData.length > 0 ? (
            <Card className="border border-slate-200 bg-white shadow-sm">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg font-semibold text-slate-900">
                      Product Analysis Details
                    </CardTitle>
                    <CardDescription className="text-slate-600">
                      Detailed breakdown of tariff impact by product
                    </CardDescription>
                  </div>
                  <Badge
                    variant="outline"
                    className="bg-blue-50 text-blue-700 border-blue-200"
                  >
                    {displayData.length} products
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-slate-50">
                        <TableHead className="font-semibold text-slate-700">
                          {t("costCalculator.table.sku")}
                        </TableHead>
                        <TableHead className="font-semibold text-slate-700">
                          {t("costCalculator.table.description")}
                        </TableHead>
                        <TableHead className="font-semibold text-slate-700 text-right">
                          {t("costCalculator.table.quantity")}
                        </TableHead>
                        <TableHead className="font-semibold text-slate-700 text-right">
                          {t("costCalculator.table.unitCost")}
                        </TableHead>
                        <TableHead className="font-semibold text-slate-700 text-center">
                          {t("costCalculator.table.htsCode")}
                        </TableHead>
                        <TableHead className="font-semibold text-slate-700 text-right">
                          {t("costCalculator.table.tariffRate")}
                        </TableHead>
                        <TableHead className="font-semibold text-slate-700 text-right">
                          {t("costCalculator.table.tariffImpact")}
                        </TableHead>
                        <TableHead className="font-semibold text-slate-700 text-right">
                          {t("costCalculator.table.newCost")}
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {displayData.map((item: any, index: number) => (
                        <TableRow
                          key={item.id || index}
                          className="hover:bg-slate-50 transition-colors"
                        >
                          <TableCell className="font-medium text-slate-900">
                            {item.sku || `ITEM-${index + 1}`}
                          </TableCell>
                          <TableCell className="text-slate-700 max-w-xs truncate">
                            {item.description || "N/A"}
                          </TableCell>
                          <TableCell className="text-right text-slate-700">
                            {(item.quantity || 1).toLocaleString()}
                          </TableCell>
                          <TableCell className="text-right text-slate-700">
                            ${(item.originalCost || 0).toFixed(2)}
                          </TableCell>
                          <TableCell className="text-center">
                            {item.htsCode ? (
                              <Badge
                                variant="outline"
                                className="bg-blue-50 text-blue-700 border-blue-200 font-mono text-xs"
                              >
                                {item.htsCode}
                              </Badge>
                            ) : (
                              <span className="text-slate-400 text-xs">
                                No HTS
                              </span>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            {item.tariffRate > 0 ? (
                              <Badge
                                variant="outline"
                                className="bg-orange-50 text-orange-700 border-orange-200"
                              >
                                {item.tariffRate.toFixed(1)}%
                              </Badge>
                            ) : (
                              <span className="text-slate-400 text-xs">0%</span>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            {item.tariffImpactAmount > 0 ? (
                              <span className="text-red-600 font-medium">
                                +$
                                {(
                                  item.tariffImpactAmount * (item.quantity || 1)
                                ).toFixed(2)}
                              </span>
                            ) : (
                              <span className="text-slate-400">$0.00</span>
                            )}
                          </TableCell>
                          <TableCell className="text-right font-medium text-slate-900">
                            $
                            {(
                              (item.newCost || item.originalCost) *
                              (item.quantity || 1)
                            ).toFixed(2)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="border border-slate-200 bg-gradient-to-br from-slate-50 to-gray-50">
              <CardContent className="p-12 text-center">
                <div className="flex flex-col items-center space-y-4">
                  <div className="p-3 bg-slate-100 rounded-full">
                    <FileText className="h-8 w-8 text-slate-400" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-slate-700">
                      {t("costCalculator.summary.noData")}
                    </h3>
                    <p className="text-slate-500 max-w-md">
                      Upload a CSV, XLSX, or PDF file with your product data to
                      begin analyzing tariff impacts and costs.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column - Summary Sidebar */}
        <div className="space-y-6">
          <Card className="border border-slate-200 bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-slate-900">
                Financial Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                  <span className="text-sm text-slate-600">Original Value</span>
                  <span className="font-semibold text-slate-900">
                    ${totalOriginalCost.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                  <span className="text-sm text-slate-600">
                    Total Tariff Cost
                  </span>
                  <span className="font-semibold text-red-700">
                    ${totalImpact.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                  <span className="text-sm text-slate-600">
                    New Total Value
                  </span>
                  <span className="font-semibold text-blue-700">
                    ${totalNewCost.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                  <span className="text-sm text-slate-600">Impact %</span>
                  <span className="font-semibold text-orange-700">
                    {impactPercentage.toFixed(1)}%
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Alerts */}
          {displayData.length > 0 && totalImpact > 0 && (
            <Card className="border border-red-200 bg-red-50">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold text-red-800 flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Impact Alert
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Alert className="border-red-200 bg-red-50">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-800">
                    Your products will incur{" "}
                    <strong>${totalImpact.toLocaleString()}</strong> in
                    additional tariff costs ({impactPercentage.toFixed(1)}%
                    increase).
                    {totalImpact > totalOriginalCost * 0.1 &&
                      " Consider alternative sourcing strategies."}
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          )}

          {/* Export Actions */}
          <Card className="border border-slate-200 bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-slate-900">
                {t("costCalculator.export.title")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                onClick={() => handleExport("excel")}
                className="w-full justify-start bg-green-600 hover:bg-green-700 text-white"
                disabled={displayData.length === 0}
              >
                <Download className="mr-2 h-4 w-4" />
                {t("costCalculator.export.excel")}
              </Button>
              <Button
                onClick={() => handleExport("pdf")}
                variant="outline"
                className="w-full justify-start border-red-200 text-red-700 hover:bg-red-50"
                disabled={displayData.length === 0}
              >
                <FileText className="mr-2 h-4 w-4" />
                {t("costCalculator.export.pdf")}
              </Button>
              <Button
                onClick={() => handleExport("csv")}
                variant="outline"
                className="w-full justify-start border-blue-200 text-blue-700 hover:bg-blue-50"
                disabled={displayData.length === 0}
              >
                <Download className="mr-2 h-4 w-4" />
                {t("costCalculator.export.csv")}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TariffImpactDashboard;
