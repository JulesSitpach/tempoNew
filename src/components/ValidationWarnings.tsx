import React from "react";
import { ValidationWarning, ValidationError } from "../types/data";

interface ValidationWarningsProps {
  warnings: ValidationWarning[];
  errors: ValidationError[];
}

const getColor = (severity: string) => {
  switch (severity) {
    case "HIGH":
      return "text-red-600";
    case "MEDIUM":
      return "text-yellow-600";
    default:
      return "text-gray-600";
  }
};

const ValidationWarnings: React.FC<ValidationWarningsProps> = ({
  warnings,
  errors,
}) => {
  return (
    <div className="space-y-2">
      {errors.length > 0 && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded">
          <div className="font-semibold mb-1">Critical Issues</div>
          <ul className="list-disc ml-5">
            {errors.map((err, i) => (
              <li key={i} className="mb-1">
                <span className="font-bold">{err.field}:</span> {err.message}{" "}
                <span className="italic">({err.impact})</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      {warnings.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-300 text-yellow-800 px-4 py-2 rounded">
          <div className="font-semibold mb-1">Warnings</div>
          <ul className="list-disc ml-5">
            {warnings.map((warn, i) => (
              <li key={i} className={getColor(warn.severity)}>
                <span className="font-bold">{warn.field}:</span> {warn.message}{" "}
                <span className="italic">({warn.impact})</span>
                {warn.actionRequired && (
                  <span className="ml-2 text-xs text-red-500">
                    Action Required
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ValidationWarnings;
