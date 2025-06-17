import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  AlertCircle,
  AlertTriangle,
  Bell,
  CheckCircle,
  DollarSign,
  Info,
  Package,
  Shield,
  Target,
  TrendingUp,
} from "lucide-react";
import React, { useState } from "react";

interface RiskAlertsTabProps {
  data: any[];
  totalImpact: number;
  highImpactItems: any[];
  criticalItems: any[];
  potentialSavings: {
    totalPotential: number;
    affectedProducts: number;
    savingsPercentage: number;
  };
  language: string;
}

interface RiskAlert {
  id: string;
  type: "critical" | "high" | "medium" | "low";
  category: "price" | "supply" | "compliance" | "market";
  title: string;
  description: string;
  impact: number;
  products: string[];
  recommendation: string;
  priority: number;
  createdAt: string;
  status: "active" | "acknowledged" | "resolved";
}

export const RiskAlertsTab: React.FC<RiskAlertsTabProps> = ({
  data,
  totalImpact,
  highImpactItems,
  criticalItems,
  potentialSavings,
  language,
}) => {
  const [activeFilter, setActiveFilter] = useState<
    "all" | "critical" | "high" | "medium" | "low"
  >("all");
  const [alertStatus, setAlertStatus] = useState<
    "all" | "active" | "acknowledged" | "resolved"
  >("active");

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  // Generate risk alerts based on the data
  const generateRiskAlerts = (): RiskAlert[] => {
    const alerts: RiskAlert[] = [];

    // Critical impact alerts
    criticalItems.forEach((item, index) => {
      const impact =
        ((item.newCost - item.originalCost) / item.originalCost) * 100;
      alerts.push({
        id: `critical-${index}`,
        type: "critical",
        category: "price",
        title: `Critical Price Impact: ${item.sku}`,
        description: `Tariff impact of ${impact.toFixed(
          1
        )}% significantly affects this product's cost structure.`,
        impact: Math.abs(item.totalImpact || item.newCost - item.originalCost),
        products: [item.sku],
        recommendation:
          "Consider alternative suppliers or renegotiate pricing terms immediately.",
        priority: 1,
        createdAt: new Date().toISOString(),
        status: "active",
      });
    });

    // High impact supply chain alerts
    if (highImpactItems.length > 5) {
      alerts.push({
        id: "supply-chain-risk",
        type: "high",
        category: "supply",
        title: "Supply Chain Vulnerability",
        description: `${highImpactItems.length} products show high tariff sensitivity, indicating supply chain concentration risk.`,
        impact: highImpactItems.reduce(
          (sum, item) => sum + Math.abs(item.totalImpact || 0),
          0
        ),
        products: highImpactItems.slice(0, 5).map(item => item.sku),
        recommendation:
          "Diversify supplier base and explore alternative sourcing regions.",
        priority: 2,
        createdAt: new Date().toISOString(),
        status: "active",
      });
    }

    // Market volatility alert
    const avgTariffRate =
      data.reduce((sum, item) => sum + (item.tariffRate || 0), 0) / data.length;
    if (avgTariffRate > 10) {
      alerts.push({
        id: "market-volatility",
        type: "medium",
        category: "market",
        title: "High Tariff Environment",
        description: `Average tariff rate of ${avgTariffRate.toFixed(
          1
        )}% indicates elevated trade policy risk.`,
        impact: totalImpact * 12, // Annual impact
        products: data
          .filter(item => (item.tariffRate || 0) > avgTariffRate)
          .map(item => item.sku)
          .slice(0, 10),
        recommendation:
          "Monitor trade policy developments and prepare contingency sourcing plans.",
        priority: 3,
        createdAt: new Date().toISOString(),
        status: "active",
      });
    }

    // Compliance alert for high-value items
    const highValueItems = data.filter(item => item.originalCost > 1000);
    if (highValueItems.length > 0) {
      alerts.push({
        id: "compliance-review",
        type: "medium",
        category: "compliance",
        title: "High-Value Product Review Required",
        description: `${highValueItems.length} high-value products require enhanced tariff classification review.`,
        impact: highValueItems.reduce(
          (sum, item) => sum + (item.totalImpact || 0),
          0
        ),
        products: highValueItems.map(item => item.sku).slice(0, 5),
        recommendation:
          "Conduct detailed HS code analysis and consider duty optimization strategies.",
        priority: 4,
        createdAt: new Date().toISOString(),
        status: "active",
      });
    }

    // Positive alert for savings opportunities
    if (potentialSavings.totalPotential > 1000) {
      alerts.push({
        id: "savings-opportunity",
        type: "low",
        category: "price",
        title: "Cost Optimization Opportunity",
        description: `Potential savings of ${formatCurrency(
          potentialSavings.totalPotential
        )} identified through strategic sourcing.`,
        impact: -potentialSavings.totalPotential, // Negative impact = savings
        products: highImpactItems.map(item => item.sku).slice(0, 3),
        recommendation:
          "Initiate supplier negotiations and explore free trade agreement benefits.",
        priority: 5,
        createdAt: new Date().toISOString(),
        status: "active",
      });
    }

    return alerts.sort((a, b) => a.priority - b.priority);
  };

  const riskAlerts = generateRiskAlerts();

  const filteredAlerts = riskAlerts.filter(alert => {
    if (activeFilter !== "all" && alert.type !== activeFilter) return false;
    if (alertStatus !== "all" && alert.status !== alertStatus) return false;
    return true;
  });

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "critical":
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case "high":
        return <AlertCircle className="h-5 w-5 text-orange-500" />;
      case "medium":
        return <Info className="h-5 w-5 text-yellow-500" />;
      case "low":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "price":
        return <DollarSign className="h-4 w-4" />;
      case "supply":
        return <Package className="h-4 w-4" />;
      case "compliance":
        return <Shield className="h-4 w-4" />;
      case "market":
        return <TrendingUp className="h-4 w-4" />;
      default:
        return <Target className="h-4 w-4" />;
    }
  };

  const getAlertColor = (type: string) => {
    switch (type) {
      case "critical":
        return "border-red-500 bg-red-50";
      case "high":
        return "border-orange-500 bg-orange-50";
      case "medium":
        return "border-yellow-500 bg-yellow-50";
      case "low":
        return "border-green-500 bg-green-50";
      default:
        return "border-gray-500 bg-gray-50";
    }
  };

  const alertTypeCounts = {
    critical: riskAlerts.filter(a => a.type === "critical").length,
    high: riskAlerts.filter(a => a.type === "high").length,
    medium: riskAlerts.filter(a => a.type === "medium").length,
    low: riskAlerts.filter(a => a.type === "low").length,
  };

  return (
    <div className="space-y-6">
      {/* Alert Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-red-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Critical Alerts
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {alertTypeCounts.critical}
            </div>
            <p className="text-xs text-muted-foreground">
              Immediate action required
            </p>
          </CardContent>
        </Card>

        <Card className="border-orange-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High Priority</CardTitle>
            <AlertCircle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {alertTypeCounts.high}
            </div>
            <p className="text-xs text-muted-foreground">Review within 24h</p>
          </CardContent>
        </Card>

        <Card className="border-yellow-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Medium Priority
            </CardTitle>
            <Info className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {alertTypeCounts.medium}
            </div>
            <p className="text-xs text-muted-foreground">Monitor closely</p>
          </CardContent>
        </Card>

        <Card className="border-green-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Opportunities</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {alertTypeCounts.low}
            </div>
            <p className="text-xs text-muted-foreground">
              Optimization potential
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Alert Type:</span>
              {(["all", "critical", "high", "medium", "low"] as const).map(
                type => (
                  <Button
                    key={type}
                    variant={activeFilter === type ? "default" : "outline"}
                    size="sm"
                    onClick={() => setActiveFilter(type)}
                    className="capitalize"
                  >
                    {type}
                    {type !== "all" && (
                      <Badge variant="secondary" className="ml-1">
                        {alertTypeCounts[type] || 0}
                      </Badge>
                    )}
                  </Button>
                )
              )}
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Status:</span>
              {(["all", "active", "acknowledged", "resolved"] as const).map(
                status => (
                  <Button
                    key={status}
                    variant={alertStatus === status ? "default" : "outline"}
                    size="sm"
                    onClick={() => setAlertStatus(status)}
                    className="capitalize"
                  >
                    {status}
                  </Button>
                )
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Risk Alerts List */}
      <div className="space-y-4">
        {filteredAlerts.map(alert => (
          <Card
            key={alert.id}
            className={`border-l-4 ${getAlertColor(alert.type)}`}
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  {getAlertIcon(alert.type)}
                  <div>
                    <CardTitle className="text-lg">{alert.title}</CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                      {getCategoryIcon(alert.category)}
                      <span className="text-sm text-muted-foreground capitalize">
                        {alert.category}
                      </span>
                      <Badge variant="outline" className="text-xs">
                        Priority {alert.priority}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div
                    className={`font-bold ${
                      alert.impact > 0 ? "text-red-600" : "text-green-600"
                    }`}
                  >
                    {alert.impact > 0 ? "+" : ""}
                    {formatCurrency(alert.impact)}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {alert.products.length} product
                    {alert.products.length !== 1 ? "s" : ""}
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">{alert.description}</p>

              <div className="bg-white/50 p-3 rounded-lg mb-4">
                <div className="font-medium text-sm mb-2">
                  Recommended Action:
                </div>
                <p className="text-sm">{alert.recommendation}</p>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex flex-wrap gap-1">
                  {alert.products.slice(0, 5).map((sku, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {sku}
                    </Badge>
                  ))}
                  {alert.products.length > 5 && (
                    <Badge variant="outline" className="text-xs">
                      +{alert.products.length - 5} more
                    </Badge>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                  <Button variant="default" size="sm">
                    Acknowledge
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredAlerts.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No Active Alerts</h3>
            <p className="text-muted-foreground">
              All alerts have been addressed or no alerts match your current
              filters.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Risk Score Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Overall Risk Assessment</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Supply Chain Risk</span>
                <span className="text-sm font-medium">
                  {criticalItems.length > 0 ? "High" : "Medium"}
                </span>
              </div>
              <Progress
                value={Math.min(
                  (criticalItems.length / data.length) * 100,
                  100
                )}
                className="h-2"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Cost Impact Risk</span>
                <span className="text-sm font-medium">
                  {Math.abs(totalImpact) > 50000 ? "High" : "Medium"}
                </span>
              </div>
              <Progress
                value={Math.min((Math.abs(totalImpact) / 100000) * 100, 100)}
                className="h-2"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Mitigation Readiness</span>
                <span className="text-sm font-medium">
                  {potentialSavings.totalPotential > 0 ? "Good" : "Needs Work"}
                </span>
              </div>
              <Progress
                value={potentialSavings.totalPotential > 0 ? 75 : 25}
                className="h-2"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
