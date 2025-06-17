import React, { useState } from "react";
import { DataPoint, DepartmentHeadCount, DataSourceType } from "../types/data";

export interface WorkforceInputProps {
  currentData: DataPoint<number>;
  onUpdate: (headCount: number, breakdown: DepartmentHeadCount) => void;
}

const WorkforceInputForm: React.FC<WorkforceInputProps> = ({
  currentData,
  onUpdate,
}) => {
  const [headCount, setHeadCount] = useState<number>(currentData.value);
  const [breakdown, setBreakdown] = useState<DepartmentHeadCount>({});
  const [dept, setDept] = useState("");
  const [count, setCount] = useState<number>(0);

  const handleAddDepartment = () => {
    if (dept && count > 0) {
      setBreakdown(prev => ({ ...prev, [dept]: count }));
      setDept("");
      setCount(0);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(headCount, breakdown);
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border rounded space-y-4">
      <div>
        <label className="block font-semibold">Total Headcount</label>
        <input
          type="number"
          value={headCount}
          min={0}
          onChange={e => setHeadCount(Number(e.target.value))}
          className="border px-2 py-1 rounded w-full"
        />
        <span className="text-xs text-gray-500 ml-2">
          {currentData.source === DataSourceType.USER_INPUT
            ? "User Input"
            : "Template/Other"}
        </span>
      </div>
      <div>
        <label className="block font-semibold">Department Breakdown</label>
        <div className="flex space-x-2 mb-2">
          <input
            type="text"
            placeholder="Department"
            value={dept}
            onChange={e => setDept(e.target.value)}
            className="border px-2 py-1 rounded"
          />
          <input
            type="number"
            placeholder="Count"
            value={count}
            min={0}
            onChange={e => setCount(Number(e.target.value))}
            className="border px-2 py-1 rounded"
          />
          <button
            type="button"
            onClick={handleAddDepartment}
            className="bg-blue-500 text-white px-2 py-1 rounded"
          >
            Add
          </button>
        </div>
        <ul className="text-sm">
          {Object.entries(breakdown).map(([d, c]) => (
            <li key={d}>
              {d}: {c}
            </li>
          ))}
        </ul>
      </div>
      <div className="text-xs text-gray-600">
        Accurate workforce data ensures precise cost and risk calculations.
        Department breakdowns help tailor recommendations.
      </div>
      <button
        type="submit"
        className="bg-green-600 text-white px-4 py-2 rounded"
      >
        Save Workforce Data
      </button>
    </form>
  );
};

export default WorkforceInputForm;
