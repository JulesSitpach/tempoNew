import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TrendingDown, TrendingUp } from "lucide-react";
import React from "react";

interface ImpactAnalysisTabProps {
  data: any[];
  totalOriginalCost: number;
  totalNewCost: number;
  totalImpact: number;
  impactPercentage: number;
  averageTariffRate: number;
  highImpactItems: any[];
  criticalItems: any[];
  language: string;
}

export const ImpactAnalysisTab: React.FC<ImpactAnalysisTabProps> = ({
  data,
  totalOriginalCost,
  totalNewCost,
  totalImpact,
  impactPercentage,
  averageTariffRate,
  highImpactItems,
  criticalItems,
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

  const getImpactColor = (impact: number) => {
    if (Math.abs(impact) > 20) return "text-red-600";
    if (Math.abs(impact) > 10) return "text-yellow-600";
    return "text-green-600";
  };

  const getImpactIcon = (impact: number) => {
    return impact > 0 ? (
      <TrendingUp className="h-4 w-4 text-red-500" />
    ) : (
      <TrendingDown className="h-4 w-4 text-green-500" />
    );
  };

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Total Impact Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm">Original Portfolio</span>
                <span className="font-medium">
                  {formatCurrency(totalOriginalCost)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">New Portfolio Value</span>
                <span className="font-medium">
                  {formatCurrency(totalNewCost)}
                </span>
              </div>
              <div className="flex justify-between border-t pt-3">
                <span className="text-sm font-medium">Total Impact</span>
                <div className="flex items-center gap-2">
                  {getImpactIcon(totalImpact)}
                  <span
                    className={`font-bold ${getImpactColor(impactPercentage)}`}
                  >
                    {formatCurrency(totalImpact)}
                  </span>
                </div>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Impact Percentage</span>
                <span
                  className={`font-bold ${getImpactColor(impactPercentage)}`}
                >
                  {formatPercentage(impactPercentage)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Impact Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm">High Impact Items</span>
                <Badge variant="destructive">{highImpactItems.length}</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Critical Items</span>
                <Badge variant="destructive">{criticalItems.length}</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Average Tariff Rate</span>
                <span className="font-medium">
                  {averageTariffRate.toFixed(1)}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Products Analyzed</span>
                <span className="font-medium">{data.length}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Risk Assessment</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm">Critical Risk</span>
                <Badge variant="destructive">{criticalItems.length}</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">High Risk</span>
                <Badge variant="secondary">
                  {highImpactItems.length - criticalItems.length}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Medium Risk</span>
                <Badge variant="outline">
                  {data.length - highImpactItems.length}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Risk Level</span>
                <Badge
                  variant={criticalItems.length > 0 ? "destructive" : "outline"}
                >
                  {criticalItems.length > 0 ? "High" : "Moderate"}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Product Analysis Table */}
      <Card>
        <CardHeader>
          <CardTitle>Detailed Product Impact Analysis</CardTitle>
          <p className="text-sm text-muted-foreground">
            Comprehensive breakdown of tariff effects on each product
          </p>
        </CardHeader>
        <CardContent>
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
                  <TableHead className="text-center">Risk Level</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((item, index) => {
                  const impact =
                    ((item.newCost - item.originalCost) / item.originalCost) *
                    100;
                  const getRiskBadge = (impact: number) => {
                    if (Math.abs(impact) > 20)
                      return <Badge variant="destructive">Critical</Badge>;
                    if (Math.abs(impact) > 10)
                      return <Badge variant="secondary">High</Badge>;
                    if (Math.abs(impact) > 5)
                      return <Badge variant="outline">Medium</Badge>;
                    return <Badge variant="default">Low</Badge>;
                  };

                  return (
                    <TableRow key={item.id || index}>
                      <TableCell className="font-medium">{item.sku}</TableCell>
                      <TableCell className="max-w-xs truncate">
                        {item.description}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(item.originalCost)}
                      </TableCell>
                      <TableCell className="text-right">
                        {(item.tariffRate || 0).toFixed(1)}%
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(item.newCost)}
                      </TableCell>
                      <TableCell
                        className={`text-right ${getImpactColor(impact)}`}
                      >
                        <div className="flex items-center justify-end gap-1">
                          {getImpactIcon(impact)}
                          {formatPercentage(impact)}
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        {getRiskBadge(impact)}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Top Impacted Products */}
      {highImpactItems.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Top Impacted Products</CardTitle>
            <p className="text-sm text-muted-foreground">
              Products with the highest tariff impact requiring immediate
              attention
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {highImpactItems.slice(0, 6).map((item, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-medium">{item.sku}</h4>
                      <p className="text-sm text-muted-foreground truncate">
                        {item.description}
                      </p>
                    </div>
                    <Badge
                      variant={
                        item.riskLevel === "critical"
                          ? "destructive"
                          : "secondary"
                      }
                    >
                      {item.riskLevel === "critical" ? "Critical" : "High"}
                    </Badge>
                  </div>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>Original Cost:</span>
                      <span>{formatCurrency(item.originalCost)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>New Cost:</span>
                      <span>{formatCurrency(item.newCost)}</span>
                    </div>
                    <div className="flex justify-between font-medium">
                      <span>Impact:</span>
                      <span className={getImpactColor(item.marginImpact || 0)}>
                        {formatCurrency(item.totalImpact || 0)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
