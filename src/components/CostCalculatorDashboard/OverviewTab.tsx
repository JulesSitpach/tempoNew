import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { AlertTriangle, DollarSign, Target, TrendingUp } from "lucide-react";
import React from "react";

interface OverviewTabProps {
  data: any[];
  totalOriginalCost: number;
  totalNewCost: number;
  totalImpact: number;
  impactPercentage: number;
  averageTariffRate: number;
  highImpactItems: any[];
  criticalItems: any[];
  potentialSavings: {
    totalPotential: number;
    affectedProducts: number;
    savingsPercentage: number;
  };
  lastUpdated: string;
  language: string;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({
  data,
  totalOriginalCost,
  totalNewCost,
  totalImpact,
  impactPercentage,
  averageTariffRate,
  highImpactItems,
  criticalItems,
  potentialSavings,
  lastUpdated,
  language,
}) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const formatPercentage = (percentage: number) => {
    return `${percentage >= 0 ? "+" : ""}${percentage.toFixed(1)}%`;
  };

  return (
    <div className="space-y-6">
      {/* Top Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Impact</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {formatCurrency(totalImpact)}
            </div>
            <p className="text-xs text-muted-foreground">Monthly impact</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Avg Tariff Rate
            </CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {averageTariffRate.toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">
              {data.length} products
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              High Risk Items
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {criticalItems.length}
            </div>
            <p className="text-xs text-muted-foreground">Require attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Potential Savings
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(potentialSavings.totalPotential)}
            </div>
            <p className="text-xs text-muted-foreground">
              Through optimization
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tariff Impact Overview */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Tariff Impact Overview</CardTitle>
            <p className="text-sm text-muted-foreground">
              Comprehensive analysis of tariff effects on your purchase orders
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">
                      Products Analyzed
                    </span>
                    <Badge variant="outline">User</Badge>
                  </div>
                  <div className="text-2xl font-bold text-blue-600 mt-2">
                    {data.length}
                  </div>
                </div>

                <div className="bg-red-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">
                      Additional Annual Cost
                    </span>
                    <Badge variant="outline">API</Badge>
                  </div>
                  <div className="text-2xl font-bold text-red-600 mt-2">
                    {formatCurrency(totalImpact * 12)}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">
                      Original Portfolio Value
                    </span>
                    <Badge variant="outline">User</Badge>
                  </div>
                  <div className="text-2xl font-bold text-green-600 mt-2">
                    {formatCurrency(totalOriginalCost)}
                  </div>
                </div>

                <div className="bg-purple-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">
                      Optimization Potential
                    </span>
                    <Badge variant="outline">User</Badge>
                  </div>
                  <div className="text-2xl font-bold text-purple-600 mt-2">
                    {formatCurrency(potentialSavings.totalPotential)}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Financial Impact Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Financial Impact Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">
                Original Value
              </span>
              <span className="font-medium">
                {formatCurrency(totalOriginalCost)}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">New Value</span>
              <span className="font-medium">
                {formatCurrency(totalNewCost)}
              </span>
            </div>

            <div className="flex justify-between text-red-600">
              <span className="text-sm font-medium">Total Impact</span>
              <span className="font-bold">{formatCurrency(totalImpact)}</span>
            </div>

            <div className="flex justify-between text-red-600">
              <span className="text-sm font-medium">Impact %</span>
              <span className="font-bold">
                {formatPercentage(impactPercentage)}
              </span>
            </div>

            <div className="pt-4 border-t">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">API Coverage</span>
                <span className="text-xs text-muted-foreground">100%</span>
              </div>
              <Progress value={100} className="h-2" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Risk Alerts Summary */}
      {criticalItems.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              Risk Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {criticalItems.slice(0, 4).map((item, index) => (
                <div
                  key={index}
                  className="bg-red-50 p-3 rounded-lg border-l-4 border-red-500"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span className="font-medium text-sm">{item.sku}</span>
                  </div>
                  <div className="text-xs text-muted-foreground mb-1">
                    Impact: {formatPercentage(item.marginImpact || 0)} |{" "}
                    {formatCurrency(item.totalImpact || 0)}
                  </div>
                  <div className="text-xs text-red-600 font-medium">
                    {item.riskLevel === "critical" ? "Critical" : "High Risk"}
                  </div>
                </div>
              ))}
            </div>
            {criticalItems.length > 4 && (
              <div className="mt-4 text-center">
                <Badge variant="outline" className="text-red-600">
                  +{criticalItems.length - 4} more items require attention
                </Badge>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};
