import React from "react";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  User,
  FileText,
  Calculator,
  Globe,
  AlertTriangle,
  CheckCircle,
  Clock,
} from "lucide-react";

export interface DataSourceInfo {
  type: "user" | "template" | "calculated" | "external" | "incomplete";
  confidence?: number;
  lastUpdated?: string;
  source?: string;
  description?: string;
}

interface DataSourceIndicatorProps {
  dataSource: DataSourceInfo;
  showTooltip?: boolean;
  size?: "sm" | "md" | "lg";
}

const DataSourceIndicator: React.FC<DataSourceIndicatorProps> = ({
  dataSource,
  showTooltip = true,
  size = "sm",
}) => {
  const getSourceConfig = (type: string) => {
    switch (type) {
      case "user":
        return {
          variant: "userdata" as const,
          icon: <User className="h-3 w-3" />,
          label: "User Data",
          description: "Data provided by user input or file upload",
        };
      case "template":
        return {
          variant: "template" as const,
          icon: <FileText className="h-3 w-3" />,
          label: "Template",
          description:
            "Default or example data - replace with your actual data",
        };
      case "calculated":
        return {
          variant: "calculated" as const,
          icon: <Calculator className="h-3 w-3" />,
          label: "Calculated",
          description: "Automatically calculated from your data",
        };
      case "external":
        return {
          variant: "external" as const,
          icon: <Globe className="h-3 w-3" />,
          label: "API Data",
          description: "Real-time data from external sources",
        };
      case "incomplete":
        return {
          variant: "incomplete" as const,
          icon: <AlertTriangle className="h-3 w-3" />,
          label: "Incomplete",
          description: "Missing required data - action needed",
        };
      default:
        return {
          variant: "outline" as const,
          icon: <CheckCircle className="h-3 w-3" />,
          label: "Unknown",
          description: "Data source unknown",
        };
    }
  };

  const config = getSourceConfig(dataSource.type);

  const badge = (
    <div
      className={`inline-flex items-center rounded-lg border px-3 py-1 text-xs font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 gap-1 ${size === "lg" ? "px-3 py-1 text-sm" : size === "md" ? "px-2 py-0.5 text-xs" : "px-1.5 py-0.5 text-xs"} ${config.variant === "userdata" ? "border-transparent bg-green-900/30 text-green-300 hover:bg-green-900/40" : config.variant === "template" ? "border-transparent bg-orange-900/30 text-orange-300 hover:bg-orange-900/40" : config.variant === "calculated" ? "border-transparent bg-blue-900/30 text-blue-300 hover:bg-blue-900/40" : config.variant === "external" ? "border-transparent bg-purple-900/30 text-purple-300 hover:bg-purple-900/40" : config.variant === "incomplete" ? "border-transparent bg-red-900/30 text-red-300 hover:bg-red-900/40" : "border-border text-foreground hover:bg-accent"}`}
    >
      {config.icon}
      <span>{config.label}</span>
      {dataSource.confidence && (
        <span className="ml-1 opacity-75">({dataSource.confidence}%)</span>
      )}
    </div>
  );

  if (!showTooltip) {
    return badge;
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>{badge}</TooltipTrigger>
        <TooltipContent className="max-w-xs">
          <div className="space-y-2">
            <div className="font-semibold">{config.label}</div>
            <div className="text-sm">
              {dataSource.description || config.description}
            </div>
            {dataSource.source && (
              <div className="text-xs opacity-75">
                Source: {dataSource.source}
              </div>
            )}
            {dataSource.lastUpdated && (
              <div className="text-xs opacity-75 flex items-center gap-1">
                <Clock className="h-3 w-3" />
                Updated: {new Date(dataSource.lastUpdated).toLocaleDateString()}
              </div>
            )}
            {dataSource.confidence && (
              <div className="text-xs opacity-75">
                Confidence: {dataSource.confidence}%
              </div>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default DataSourceIndicator;
