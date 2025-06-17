import { useCallback, useEffect, useState } from "react";
import {
  BusinessDataProfile,
  DataPoint,
  DataSourceType,
  STEP_VALIDATION_CONFIG,
  ValidationError,
  ValidationResult,
  ValidationWarning,
} from "../types/data";

// Phase 2: Pure Data Flow - No template fallbacks, prompt for missing data
export function validateStepData(
  businessData: BusinessDataProfile,
  currentStep: string
): ValidationResult {
  const warnings: ValidationWarning[] = [];
  const errors: ValidationError[] = [];
  const recommendedActions: string[] = [];
  const criticalFieldsMissing: string[] = [];

  let isValid = true;
  let templateDataCount = 0;
  let userDataCount = 0;
  let dataQualityScore = 100;

  // Phase 2: Check if file has been uploaded - after upload, NO template data allowed
  const hasImportedData = businessData.importedProducts?.value?.length > 0;
  const uploadComplete =
    hasImportedData ||
    businessData.fileMetadata?.value?.processingStatus === "completed";

  const stepConfig = STEP_VALIDATION_CONFIG[currentStep];
  if (!stepConfig) {
    return {
      isValid: true,
      completeness: 100,
      warnings: [],
      errors: [],
      canProceed: true,
      recommendedActions: [],
      criticalFieldsMissing: [],
      templateDataCount: 0,
      userDataCount: 0,
      dataQualityScore: 100,
    };
  }

  // Check required fields
  for (const fieldName of stepConfig.requiredFields) {
    const dataPoint = businessData[
      fieldName as keyof BusinessDataProfile
    ] as DataPoint<any>;

    if (!dataPoint) {
      errors.push({
        field: fieldName,
        message: "Required field is missing",
        impact: "Cannot proceed without this data",
        actionRequired: true,
        blocksProceed: true,
      });
      criticalFieldsMissing.push(fieldName);
      isValid = false;
      dataQualityScore -= 20;
      continue;
    }

    // Phase 3: Enhanced data source classification and validation
    const isTemplateData =
      dataPoint.source === DataSourceType.TEMPLATE ||
      dataPoint.source === DataSourceType.SYSTEM_DEFAULT;

    const isRealUserData =
      dataPoint.source === DataSourceType.USER_INPUT ||
      dataPoint.source === DataSourceType.USER_UPLOAD ||
      dataPoint.source === DataSourceType.CALCULATED ||
      dataPoint.source === DataSourceType.EXTERNAL_API;

    if (isTemplateData) {
      templateDataCount++;
      // Phase 3: After upload, ANY template data is a critical error
      if (uploadComplete) {
        errors.push({
          field: fieldName,
          message:
            "Pure Data Flow violation: Template data detected after file upload",
          impact:
            "Phase 3 requires 100% real user data - no template fallbacks allowed",
          actionRequired: true,
          blocksProceed: true,
        });
        isValid = false;
        dataQualityScore -= 50;
        criticalFieldsMissing.push(fieldName);
      } else {
        // Before upload, template data triggers user input prompt
        warnings.push({
          type: "MISSING_USER_INPUT",
          severity: "HIGH",
          field: fieldName,
          message: "Real user data required - no template fallbacks available",
          impact:
            "Phase 3 system requires actual user data for accurate analysis",
          actionRequired: true,
          suggestedAction: `Please provide your actual ${fieldName} data`,
        });
        dataQualityScore -= 25;
      }
    } else if (isRealUserData) {
      userDataCount++;
    } else {
      // Data source is unclear or improperly classified
      warnings.push({
        type: "USER_INPUT_REQUIRED",
        severity: "MEDIUM",
        field: fieldName,
        message: "Data source classification unclear",
        impact: "Please verify this data is from a reliable source",
        actionRequired: true,
        suggestedAction: `Verify and re-enter ${fieldName} data`,
      });
      dataQualityScore -= 15;
    }

    // Check for empty or null values in critical fields
    if (stepConfig.criticalFields.includes(fieldName)) {
      const isEmpty =
        dataPoint.value === null ||
        dataPoint.value === undefined ||
        dataPoint.value === "" ||
        (Array.isArray(dataPoint.value) && dataPoint.value.length === 0) ||
        (typeof dataPoint.value === "object" &&
          Object.keys(dataPoint.value).length === 0);

      if (isEmpty) {
        errors.push({
          field: fieldName,
          message: "Critical field cannot be empty",
          impact: "This field is essential for accurate analysis",
          actionRequired: true,
          blocksProceed: true,
        });
        criticalFieldsMissing.push(fieldName);
        isValid = false;
        dataQualityScore -= 15;
        continue;
      }
    }

    // Phase 2: Pure Data Flow - Count data sources and enforce no template fallbacks
    if (
      dataPoint.source === DataSourceType.USER_INPUT ||
      dataPoint.source === DataSourceType.USER_UPLOAD ||
      dataPoint.source === DataSourceType.EXTERNAL_API ||
      dataPoint.source === DataSourceType.CALCULATED
    ) {
      userDataCount++;
    }

    // Phase 2: Critical fields must NEVER use template data
    const isUsingTemplateData =
      dataPoint.source === DataSourceType.TEMPLATE ||
      dataPoint.source === DataSourceType.SYSTEM_DEFAULT;

    if (stepConfig.criticalFields.includes(fieldName) && isUsingTemplateData) {
      // Phase 2: No template data allowed in critical fields, ever
      errors.push({
        field: fieldName,
        message:
          "Critical field requires user input - template data not allowed",
        impact:
          "Pure Data Flow requires real user data for accurate business decisions",
        actionRequired: true,
        blocksProceed: true,
      });
      criticalFieldsMissing.push(fieldName);
      isValid = false;
      dataQualityScore -= 35;
      recommendedActions.push(`Provide your actual ${fieldName} data`);
    } else if (isUsingTemplateData) {
      // Phase 2: Even non-critical fields should prompt for user input
      warnings.push({
        type: "USER_INPUT_REQUIRED",
        severity: "MEDIUM",
        field: fieldName,
        message: "User input recommended for personalized results",
        impact: "Template data reduces accuracy of recommendations",
        actionRequired: true,
        suggestedAction: `Enter your actual ${fieldName} to improve analysis quality`,
      });
      dataQualityScore -= 15;
      recommendedActions.push(`Update ${fieldName} with your real data`);
    }

    // Warning: stale data (older than 30 days)
    if (dataPoint.timestamp) {
      const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
      if (new Date(dataPoint.timestamp).getTime() < thirtyDaysAgo) {
        warnings.push({
          type: "STALE_DATA",
          severity: "MEDIUM",
          field: fieldName,
          message: "Data may be outdated",
          impact: "Consider refreshing this data for current analysis",
          actionRequired: false,
          suggestedAction: `Update ${fieldName} with recent data`,
        });
        dataQualityScore -= 5;
        recommendedActions.push(`Refresh ${fieldName} data`);
      }
    }

    // Warning: requires validation but not validated
    if (dataPoint.requiresValidation && !dataPoint.validated) {
      if (stepConfig.requiresHumanInput.includes(fieldName)) {
        errors.push({
          field: fieldName,
          message: "Field requires human validation",
          impact: "This field needs to be reviewed and confirmed",
          actionRequired: true,
          blocksProceed: true,
        });
        isValid = false;
        dataQualityScore -= 20;
      } else {
        warnings.push({
          type: "MISSING_CRITICAL",
          severity: "HIGH",
          field: fieldName,
          message: "Field requires validation",
          impact: "Please review and confirm this data",
          actionRequired: true,
          suggestedAction: `Validate ${fieldName} data`,
        });
        dataQualityScore -= 10;
      }
      recommendedActions.push(`Validate ${fieldName}`);
    }

    // Warning: low confidence API data
    if (
      dataPoint.source === DataSourceType.EXTERNAL_API &&
      dataPoint.confidence !== undefined &&
      dataPoint.confidence < 0.7
    ) {
      warnings.push({
        type: "LOW_CONFIDENCE",
        severity: "MEDIUM",
        field: fieldName,
        message: "API data has low confidence score",
        impact: "Consider manual verification of this data",
        actionRequired: false,
        suggestedAction: `Verify ${fieldName} data manually`,
      });
      dataQualityScore -= 8;
      recommendedActions.push(`Verify ${fieldName} from external source`);
    }
  }

  // Phase 3: Enhanced completeness calculation - only count real user data
  const totalFields = stepConfig.requiredFields.length;
  const completedFields = stepConfig.requiredFields.filter(fieldName => {
    const dataPoint = businessData[
      fieldName as keyof BusinessDataProfile
    ] as DataPoint<any>;

    if (!dataPoint) return false;

    // Phase 3: Strict data classification - only count genuine user data
    const isRealUserData =
      (dataPoint.source === DataSourceType.USER_INPUT ||
        dataPoint.source === DataSourceType.USER_UPLOAD ||
        dataPoint.source === DataSourceType.CALCULATED ||
        dataPoint.source === DataSourceType.EXTERNAL_API) &&
      dataPoint.validated === true;

    return isRealUserData;
  }).length;

  const completeness =
    totalFields > 0 ? (completedFields / totalFields) * 100 : 100;

  // Phase 3: Post-upload validation - ZERO template data allowed
  if (uploadComplete && templateDataCount > 0) {
    errors.push({
      field: "data_classification",
      message: `Phase 3 Pure Data Flow violation: ${templateDataCount} template data points detected after upload`,
      impact:
        "System must operate with 100% real user data - no template fallbacks allowed in Phase 3",
      actionRequired: true,
      blocksProceed: true,
    });
    isValid = false;
    dataQualityScore -= 70;
    recommendedActions.push(
      "CRITICAL: Phase 3 requires elimination of all template data - system must use pure data flow"
    );
  }

  // Phase 3: Pre-upload validation - prompt for missing data instead of using templates
  if (!uploadComplete && templateDataCount > 0) {
    warnings.push({
      type: "MISSING_USER_DATA",
      severity: "HIGH",
      field: "user_input_required",
      message: `Phase 3 requirement: ${templateDataCount} fields need your actual data - no template fallbacks available`,
      impact:
        "Phase 3 system requires 100% real user data for accurate analysis and personalized recommendations",
      actionRequired: true,
      suggestedAction:
        "Please provide your actual business data for these fields - templates not allowed in Phase 3",
    });
    dataQualityScore -= 35;
    recommendedActions.push(
      "Phase 3: Provide real data for all fields - no template fallbacks available"
    );
  }

  // Phase 3: Enhanced completeness requirement - only real user data counts toward completion
  const realDataCompleteness =
    totalFields > 0 ? (userDataCount / totalFields) * 100 : 100;

  if (realDataCompleteness < stepConfig.minimumCompleteness) {
    const missingRealDataCount =
      Math.ceil((stepConfig.minimumCompleteness / 100) * totalFields) -
      userDataCount;

    if (uploadComplete) {
      // Phase 3: Post-upload - All data must be real, no exceptions
      errors.push({
        field: "data_completeness",
        message: `Phase 3 Pure Data Flow requires ${
          stepConfig.minimumCompleteness
        }% real data, currently at ${realDataCompleteness.toFixed(1)}%`,
        impact:
          "Phase 3 system cannot proceed with any template data after file upload",
        actionRequired: true,
        blocksProceed: true,
      });
      isValid = false;
      dataQualityScore -= 50;
    } else {
      // Phase 3: Pre-upload - Prompt for user input, no template fallbacks
      warnings.push({
        type: "USER_INPUT_NEEDED",
        severity: "HIGH",
        field: "data_input",
        message: `Phase 3 requirement: Need ${missingRealDataCount} more real data inputs to reach ${stepConfig.minimumCompleteness}% requirement`,
        impact:
          "Phase 3 system requires real user data - template fallbacks not available",
        actionRequired: true,
        suggestedAction:
          "Please provide your actual business data for the missing fields - Phase 3 does not use templates",
      });
      dataQualityScore -= 30;
    }

    recommendedActions.push(
      "Phase 3: Provide real business data - no template fallbacks available"
    );
  }

  // Ensure data quality score doesn't go below 0
  dataQualityScore = Math.max(0, dataQualityScore);

  // Phase 3: Can only proceed with 100% real user data, zero template fallbacks
  const canProceed =
    isValid &&
    errors.length === 0 &&
    realDataCompleteness >= stepConfig.minimumCompleteness &&
    (uploadComplete ? templateDataCount === 0 : true) &&
    userDataCount > 0; // Phase 3: Must have at least some real user data

  return {
    isValid,
    completeness: realDataCompleteness, // Phase 2: Only count real data toward completion
    warnings,
    errors,
    canProceed,
    recommendedActions: [...new Set(recommendedActions)], // Remove duplicates
    criticalFieldsMissing,
    templateDataCount,
    userDataCount,
    dataQualityScore,
  };
}

// React hook for validation
export const useDataValidation = (
  businessData: BusinessDataProfile,
  currentStep: string
) => {
  const [validationResult, setValidationResult] = useState<ValidationResult>();
  const [isValidating, setIsValidating] = useState(false);

  const validateData = useCallback(async () => {
    setIsValidating(true);
    try {
      // Add small delay to simulate validation processing
      await new Promise(resolve => setTimeout(resolve, 100));
      const result = validateStepData(businessData, currentStep);
      setValidationResult(result);
    } catch (error) {
      console.error("Validation error:", error);
      setValidationResult({
        isValid: false,
        completeness: 0,
        warnings: [],
        errors: [
          {
            field: "validation",
            message: "Validation failed due to system error",
            impact: "Please try again",
            actionRequired: true,
            blocksProceed: true,
          },
        ],
        canProceed: false,
        recommendedActions: ["Retry validation"],
        criticalFieldsMissing: [],
        templateDataCount: 0,
        userDataCount: 0,
        dataQualityScore: 0,
      });
    } finally {
      setIsValidating(false);
    }
  }, [businessData, currentStep]);

  useEffect(() => {
    validateData();
  }, [validateData]);

  return {
    validationResult,
    isValidating,
    revalidate: validateData,
  };
};

// Utility functions for validation
export const getValidationSummary = (validationResult: ValidationResult) => {
  const highSeverityWarnings = validationResult.warnings.filter(
    w => w.severity === "HIGH"
  ).length;
  const mediumSeverityWarnings = validationResult.warnings.filter(
    w => w.severity === "MEDIUM"
  ).length;
  const lowSeverityWarnings = validationResult.warnings.filter(
    w => w.severity === "LOW"
  ).length;

  return {
    totalIssues:
      validationResult.warnings.length + validationResult.errors.length,
    criticalErrors: validationResult.errors.length,
    highWarnings: highSeverityWarnings,
    mediumWarnings: mediumSeverityWarnings,
    lowWarnings: lowSeverityWarnings,
    canProceed: validationResult.canProceed,
    completeness: validationResult.completeness,
    dataQuality: validationResult.dataQualityScore,
  };
};

export const getPriorityActions = (
  validationResult: ValidationResult,
  limit = 5
) => {
  const actions = [];

  // Add critical errors first
  validationResult.errors.forEach(error => {
    if (error.actionRequired) {
      actions.push({
        priority: "critical",
        field: error.field,
        action: error.message,
        impact: error.impact,
      });
    }
  });

  // Add high severity warnings
  validationResult.warnings
    .filter(w => w.severity === "HIGH" && w.actionRequired)
    .forEach(warning => {
      actions.push({
        priority: "high",
        field: warning.field,
        action: warning.suggestedAction || warning.message,
        impact: warning.impact,
      });
    });

  // Add medium severity warnings
  validationResult.warnings
    .filter(w => w.severity === "MEDIUM" && w.actionRequired)
    .forEach(warning => {
      actions.push({
        priority: "medium",
        field: warning.field,
        action: warning.suggestedAction || warning.message,
        impact: warning.impact,
      });
    });

  return actions.slice(0, limit);
};
