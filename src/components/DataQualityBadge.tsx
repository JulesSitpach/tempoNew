import React from "react";
import { DataPoint, DataSourceType } from "../types/data";

export interface DataQualityBadgeProps {
  dataPoint: DataPoint;
  showDetails?: boolean;
}

const DataQualityBadge: React.FC<DataQualityBadgeProps> = ({
  dataPoint,
  showDetails = false,
}) => {
  const getBadgeColor = (source: DataSourceType) => {
    switch (source) {
      case DataSourceType.USER_INPUT:
      case DataSourceType.USER_UPLOAD:
        return "bg-green-500";
      case DataSourceType.TEMPLATE:
        return "bg-red-500";
      case DataSourceType.CALCULATED:
        return "bg-blue-500";
      default:
        return "bg-gray-400";
    }
  };

  const color = getBadgeColor(dataPoint.source);
  const label =
    dataPoint.source === DataSourceType.USER_INPUT
      ? "User Input"
      : dataPoint.source === DataSourceType.USER_UPLOAD
        ? "User Upload"
        : dataPoint.source === DataSourceType.TEMPLATE
          ? "Template"
          : dataPoint.source === DataSourceType.CALCULATED
            ? "Calculated"
            : dataPoint.source === DataSourceType.EXTERNAL_API
              ? "External"
              : "System";

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium text-white ${color}`}
      title={
        showDetails
          ? `Source: ${label}\nValidated: ${dataPoint.validated ? "Yes" : "No"}\nTimestamp: ${dataPoint.timestamp}`
          : label
      }
    >
      {label}
      {showDetails && (
        <span className="ml-2 text-[10px]">
          {dataPoint.validated ? "✔️" : "⚠️"}
        </span>
      )}
    </span>
  );
};

export default DataQualityBadge;
