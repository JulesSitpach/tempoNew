import React from "react";
import { RiskLevel } from "../types/data";

export interface RiskSelectorProps {
  currentValue: RiskLevel;
  onUpdate: (level: RiskLevel) => void;
}

const riskLevels: RiskLevel[] = ["low", "medium", "high"];

const RiskToleranceSelector: React.FC<RiskSelectorProps> = ({
  currentValue,
  onUpdate,
}) => {
  return (
    <div className="p-4 border rounded space-y-2">
      <div className="font-semibold">Risk Tolerance</div>
      <div className="flex space-x-4">
        {riskLevels.map(level => (
          <label key={level} className="flex items-center space-x-1">
            <input
              type="radio"
              name="risk-tolerance"
              value={level}
              checked={currentValue === level}
              onChange={() => onUpdate(level)}
            />
            <span
              className={
                level === "low"
                  ? "text-green-600"
                  : level === "medium"
                    ? "text-yellow-600"
                    : "text-red-600"
              }
            >
              {level.charAt(0).toUpperCase() + level.slice(1)}
            </span>
          </label>
        ))}
      </div>
      <div className="text-xs text-gray-600 mt-2">
        {currentValue === "low" &&
          "Low risk: Conservative recommendations, minimal exposure."}
        {currentValue === "medium" &&
          "Medium risk: Balanced recommendations, moderate exposure."}
        {currentValue === "high" &&
          "High risk: Aggressive recommendations, higher potential impact."}
      </div>
    </div>
  );
};

export default RiskToleranceSelector;
