// Overview Tab Component
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DataSourceIndicator, DataTable } from "./SharedComponents";
import { EnhancedProductData } from "./types";

interface OverviewTabProps {
  displayData: any[];
  enhancedData: EnhancedProductData[];
  totalOriginalCost: number;
  totalImpact: number;
  potentialSavings: {
    totalPotential: number;
  };
  tableData: any[];
}

export const OverviewTab = ({
  displayData,
  enhancedData,
  totalOriginalCost,
  totalImpact,
  potentialSavings,
  tableData,
}: OverviewTabProps) => {
  return (
    <div className="space-y-6">
      <Card className="dashboard-card border-border/30">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Tariff Impact Overview</span>
            <div className="flex items-center gap-2">
              {displayData.length > 0 && (
                <DataSourceIndicator
                  dataSource={{
                    type: enhancedData.some(item => item.dataSource === "api")
                      ? "external"
                      : "user",
                    confidence:
                      enhancedData.length > 0
                        ? Math.round(
                            (enhancedData.filter(item => item.htsCode).length /
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
    </div>
  );
};
