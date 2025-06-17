import React from "react";

const DataCompletenessProgress: React.FC<{
  completeness: number;
  criticalMissing: string[];
}> = ({ completeness, criticalMissing }) => {
  const percent = Math.round(completeness * 100);
  return (
    <div className="w-full space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold">Data Completeness</span>
        <span className="text-xs">{percent}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded h-3 overflow-hidden">
        <div
          className="bg-green-500 h-3 transition-all"
          style={{ width: `${percent}%` }}
        />
      </div>
      {criticalMissing.length > 0 && (
        <div className="mt-2 text-xs text-red-600">
          <div>Missing critical data:</div>
          <ul className="list-disc ml-4">
            {criticalMissing.map(field => (
              <li key={field}>{field}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default DataCompletenessProgress;
