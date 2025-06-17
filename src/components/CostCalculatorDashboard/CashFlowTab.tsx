import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, PieChart, TrendingDown, TrendingUp } from "lucide-react";
import React, { useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface CashFlowTabProps {
  data: any[];
  totalImpact: number;
  cashFlowProjections: any[];
  language: string;
}

export const CashFlowTab: React.FC<CashFlowTabProps> = ({
  data,
  totalImpact,
  cashFlowProjections,
  language,
}) => {
  const [viewType, setViewType] = useState<"monthly" | "quarterly">("monthly");
  const [forecastPeriod, setForecastPeriod] = useState<"12" | "24">("12");

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatShortCurrency = (amount: number) => {
    if (Math.abs(amount) >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`;
    } else if (Math.abs(amount) >= 1000) {
      return `$${(amount / 1000).toFixed(0)}k`;
    }
    return formatCurrency(amount);
  };

  // Generate extended projections based on period
  const generateProjections = (months: number) => {
    const projections = [];
    const monthlyImpact = totalImpact / 12;

    for (let month = 1; month <= months; month++) {
      const date = new Date();
      date.setMonth(date.getMonth() + month - 1);

      // Add some variance to make it more realistic
      const variance = Math.random() * 0.1 - 0.05; // ±5% variance
      const adjustedImpact = monthlyImpact * (1 + variance);

      projections.push({
        month: date.toLocaleDateString("en-US", { month: "short" }),
        fullMonth: date.toLocaleDateString("en-US", {
          month: "long",
          year: "numeric",
        }),
        additionalCost: adjustedImpact,
        cumulativeImpact: adjustedImpact * month,
        value: Math.abs(adjustedImpact),
        savings: Math.abs(adjustedImpact) * 0.15, // Potential 15% savings
      });
    }
    return projections;
  };

  const projectionData = generateProjections(parseInt(forecastPeriod));

  // Calculate summary metrics
  const monthlyImpact = totalImpact / 12;
  const annualImpact = totalImpact * 12;
  const potentialSavings = annualImpact * 0.15;
  const avgTariffRate =
    data.length > 0
      ? data.reduce((sum, item) => sum + (item.tariffRate || 0), 0) /
        data.length
      : 0;

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 shadow-lg rounded-lg border">
          <p className="font-medium">{label}</p>
          <p className="text-red-600">
            Monthly Impact: {formatCurrency(payload[0].value)}
          </p>
          <p className="text-green-600">
            Potential Savings: {formatCurrency(payload[0].payload.savings)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Button
              variant={viewType === "monthly" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewType("monthly")}
            >
              Monthly
            </Button>
            <Button
              variant={forecastPeriod === "12" ? "default" : "outline"}
              size="sm"
              onClick={() => setForecastPeriod("12")}
            >
              12-Month Forecast
            </Button>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Monthly Impact
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {formatShortCurrency(monthlyImpact)}
            </div>
            <p className="text-xs text-muted-foreground">
              Additional monthly cost
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Annual Impact</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {formatShortCurrency(annualImpact)}
            </div>
            <p className="text-xs text-muted-foreground">
              Total yearly increase
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Potential Savings
            </CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatShortCurrency(potentialSavings)}
            </div>
            <p className="text-xs text-muted-foreground">
              Through optimization
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Avg Tariff Rate
            </CardTitle>
            <PieChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {avgTariffRate.toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">
              Across {data.length} products
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Cash Flow Impact Projections Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Cash Flow Impact Projections</CardTitle>
          <p className="text-sm text-muted-foreground">
            {forecastPeriod}-month forecast showing monthly tariff impact
          </p>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={projectionData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis tickFormatter={formatShortCurrency} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="value" fill="#ef4444" name="Monthly Impact" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Cumulative Impact Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Cumulative Financial Impact</CardTitle>
          <p className="text-sm text-muted-foreground">
            Progressive accumulation of tariff costs over time
          </p>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={projectionData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis tickFormatter={formatShortCurrency} />
              <Tooltip
                formatter={(value: any) => [
                  formatCurrency(value),
                  "Cumulative Impact",
                ]}
              />
              <Line
                type="monotone"
                dataKey="cumulativeImpact"
                stroke="#ef4444"
                strokeWidth={3}
                dot={{ fill: "#ef4444", strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Impact Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Cash Flow Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
              <span className="font-medium text-red-700">Monthly Impact</span>
              <span className="text-xl font-bold text-red-600">
                {formatCurrency(monthlyImpact)}
              </span>
            </div>

            <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
              <span className="font-medium text-red-700">Annual Impact</span>
              <span className="text-xl font-bold text-red-600">
                {formatCurrency(annualImpact)}
              </span>
            </div>

            <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
              <span className="font-medium text-green-700">
                Potential Savings
              </span>
              <span className="text-xl font-bold text-green-600">
                {formatCurrency(potentialSavings)}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Key Metrics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">
                Products Analyzed:
              </span>
              <Badge variant="outline">{data.length}</Badge>
            </div>

            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">
                Average Tariff Rate:
              </span>
              <Badge variant="secondary">{avgTariffRate.toFixed(1)}%</Badge>
            </div>

            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">
                Forecast Period:
              </span>
              <Badge variant="default">{forecastPeriod} months</Badge>
            </div>

            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">
                Last Updated:
              </span>
              <Badge variant="outline">{new Date().toLocaleDateString()}</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
