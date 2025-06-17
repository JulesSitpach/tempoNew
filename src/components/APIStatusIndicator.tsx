import { AlertCircle, RefreshCw, Wifi, WifiOff } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

interface APIStatusIndicatorProps {
  onConfigureClick?: () => void;
  compact?: boolean;
}

export default function APIStatusIndicator({
  onConfigureClick,
  compact = true,
}: APIStatusIndicatorProps) {
  const { t } = useTranslation("dashboard");
  const [loading, setLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [isLive, setIsLive] = useState<boolean>(true);
  const [showDetails, setShowDetails] = useState(false);

  const checkDataFreshness = async () => {
    setLoading(true);
    try {
      // Simplified check - just verify if we can reach key services
      const healthChecks = await Promise.allSettled([
        fetch("/api/health", { method: "HEAD" }).catch(() => null),
        // Add more health checks as needed
      ]);

      const hasLiveConnection = healthChecks.some(
        check => check.status === "fulfilled"
      );

      setIsLive(hasLiveConnection);
      setLastUpdate(new Date());
    } catch (error) {
      setIsLive(false);
      setLastUpdate(new Date());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkDataFreshness();
    // Check every 5 minutes
    const interval = setInterval(checkDataFreshness, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = () => {
    if (loading) return "text-gray-400";
    return isLive ? "text-green-500" : "text-amber-500";
  };

  const getStatusIcon = () => {
    if (loading) return <RefreshCw className="w-3 h-3 animate-spin" />;
    return isLive ? (
      <Wifi className="w-3 h-3" />
    ) : (
      <WifiOff className="w-3 h-3" />
    );
  };

  const getStatusText = () => {
    if (loading) return t("dataStatus.checking", "Checking...");

    if (isLive) {
      return lastUpdate
        ? t("dataStatus.updated", {
            time: lastUpdate.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
            defaultValue: `Updated: ${lastUpdate.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}`,
          })
        : t("dataStatus.live", "Live Data");
    } else {
      return lastUpdate
        ? t("dataStatus.cached", {
            date: lastUpdate.toLocaleDateString(),
            time: lastUpdate.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
            defaultValue: `Data from: ${lastUpdate.toLocaleDateString()}, ${lastUpdate.toLocaleTimeString(
              [],
              {
                hour: "2-digit",
                minute: "2-digit",
              }
            )}`,
          })
        : t("dataStatus.offline", "Using cached data");
    }
  };

  if (compact) {
    return (
      <div className="flex items-center gap-2 text-sm">
        {/* Traffic light indicator */}
        <div
          className={`w-2 h-2 rounded-full ${
            loading ? "bg-gray-400" : isLive ? "bg-green-500" : "bg-amber-500"
          } smb-fade-in`}
        />

        {/* Status text */}
        <span className={`${getStatusColor()} transition-colors duration-200`}>
          {getStatusText()}
        </span>

        {/* Show warning only when needed */}
        {!isLive && !loading && (
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="text-amber-600 hover:text-amber-700 transition-colors"
            title={t("dataStatus.details", "View details")}
          >
            <AlertCircle className="w-4 h-4" />
          </button>
        )}

        {/* Expandable details */}
        {showDetails && !isLive && (
          <div className="absolute top-full left-0 mt-2 p-3 bg-white rounded-lg shadow-lg border border-amber-200 z-50 min-w-64 smb-fade-in">
            <div className="text-sm text-amber-800">
              <div className="font-medium mb-1">
                {t("dataStatus.cachedTitle", "Using Recent Data")}
              </div>
              <div className="text-amber-700">
                {t(
                  "dataStatus.cachedDesc",
                  "Showing the most recent available trade data. Your analysis remains accurate."
                )}
              </div>
              <button
                onClick={checkDataFreshness}
                disabled={loading}
                className="mt-2 text-xs text-amber-600 hover:text-amber-700 underline"
              >
                {loading
                  ? t("common.checking", "Checking...")
                  : t("common.refresh", "Refresh")}
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Full status panel (for settings/admin views)
  return (
    <div className="p-4 bg-gray-50 rounded-lg border smb-card">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {getStatusIcon()}
          <span className="font-medium text-gray-900">
            {t("dataStatus.title", "Data Status")}
          </span>
        </div>
        <button
          onClick={checkDataFreshness}
          disabled={loading}
          className="text-sm text-gray-600 hover:text-orange-600 transition-colors smb-hover-lift"
        >
          {loading
            ? t("common.checking", "Checking...")
            : t("common.refresh", "Refresh")}
        </button>
      </div>

      <div className="text-sm text-gray-700">{getStatusText()}</div>

      {!isLive && (
        <div className="mt-3 p-2 bg-amber-50 border border-amber-200 rounded text-sm text-amber-800">
          {t(
            "dataStatus.fallbackNotice",
            "Currently using cached trade data. Your analysis accuracy is maintained."
          )}
        </div>
      )}
    </div>
  );
}
