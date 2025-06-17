import React, { useEffect } from "react";
import { validateStepData } from "../lib/useDataValidation";
import { BusinessDataProfile, ValidationResult } from "../types/data";

export interface StepGuardProps {
  currentStep: number;
  businessData: BusinessDataProfile;
  onProceed: () => void;
  onRequiresInput: (missingFields: string[]) => void;
}

// Map step numbers to step validation keys
const STEP_MAPPING: Record<number, string> = {
  1: "file-import",
  2: "tariff-analysis",
  3: "supplier-diversification",
  4: "supply-chain-planning",
  5: "workforce-planning",
  6: "alerts-monitoring",
};

const StepTransitionGuard: React.FC<StepGuardProps> = ({
  currentStep,
  businessData,
  onProceed,
  onRequiresInput,
}) => {
  useEffect(() => {
    const stepKey = STEP_MAPPING[currentStep] || `step-${currentStep}`;
    const result: ValidationResult = validateStepData(businessData, stepKey);
    if (result.isValid && result.errors.length === 0) {
      onProceed();
    } else {
      const missingFields = result.errors.map(e => e.field);
      onRequiresInput(missingFields);
    }
    // Optionally, handle warnings for template data here (e.g., show a toast or banner)
  }, [businessData, currentStep, onProceed, onRequiresInput]);

  return null; // This component only performs a guard action, no UI
};

export default StepTransitionGuard;
