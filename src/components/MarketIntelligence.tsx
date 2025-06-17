import React, { useState, useEffect } from "react";
import { FederalRegisterService } from "../services/federalRegisterService";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { AlertTriangle, Calendar, Clock, Globe } from "lucide-react";

interface MarketIntelligenceProps {
  refreshInterval?: number; // Refresh interval in milliseconds
  maxItems?: number; // Maximum number of items to display
}

const MarketIntelligence: React.FC<MarketIntelligenceProps> = ({
  refreshInterval = 3600000, // 1 hour default
  maxItems = 5,
}) => {
  const [policyUpdates, setPolicyUpdates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string>("");

  const fetchUpdates = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch last 30 days of tariff-related updates
      const updates = await FederalRegisterService.searchTariffRelatedDocuments(
        30,
        maxItems
      );

      setPolicyUpdates(updates);
      setLastUpdated(new Date().toLocaleString());
    } catch (err) {
      setError("Failed to fetch Federal Register updates");
      console.error("Federal Register fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUpdates();

    // Set up refresh interval
    const intervalId = setInterval(fetchUpdates, refreshInterval);

    return () => clearInterval(intervalId);
  }, [refreshInterval, maxItems]);

  const getImpactColorClass = (impact: string) => {
    switch (impact) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-blue-600" />
              Federal Register Updates
            </CardTitle>
            <CardDescription>
              Recent policy changes affecting tariffs and trade
            </CardDescription>
          </div>
          <Badge className="bg-blue-100 text-blue-800">
            {lastUpdated ? `Updated: ${lastUpdated}` : "Loading..."}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading && (
          <p className="text-center py-4 text-gray-500">Loading updates...</p>
        )}

        {error && (
          <div className="p-4 border border-red-200 rounded-lg bg-red-50 text-red-800 flex items-start gap-2">
            <AlertTriangle className="h-5 w-5 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium">Error loading updates</p>
              <p className="text-sm mt-1">{error}</p>
            </div>
          </div>
        )}

        {!loading && !error && policyUpdates.length === 0 && (
          <p className="text-center py-4 text-gray-500">
            No recent policy updates found
          </p>
        )}

        {policyUpdates.map(policy => (
          <div
            key={policy.id}
            className="p-4 border rounded-lg hover:shadow-sm transition-shadow"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <h4 className="font-medium text-sm mb-1">{policy.title}</h4>
                <p className="text-xs text-gray-600 mb-2">
                  {policy.agency} •{" "}
                  {new Date(policy.publicationDate).toLocaleDateString()}
                </p>
              </div>
              <Badge className={getImpactColorClass(policy.tariffImpact)}>
                {policy.tariffImpact.toUpperCase()}
              </Badge>
            </div>

            <p className="text-sm text-gray-700 mb-2">
              {policy.summary.substring(0, 150)}...
            </p>

            {policy.affectedProducts.length > 0 && (
              <div className="text-xs text-blue-600 mb-2">
                Affects: {policy.affectedProducts.join(", ")}
              </div>
            )}

            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center text-orange-600 gap-1">
                <Calendar className="h-3 w-3" />
                Published:{" "}
                {new Date(policy.publicationDate).toLocaleDateString()}
              </div>

              {policy.effectiveDate && (
                <div className="flex items-center text-green-600 gap-1">
                  <Clock className="h-3 w-3" />
                  Effective:{" "}
                  {new Date(policy.effectiveDate).toLocaleDateString()}
                </div>
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default MarketIntelligence;
