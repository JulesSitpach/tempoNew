import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  WorkflowDatabaseService,
  WorkflowSession,
} from "../services/workflowDatabase";
import { DataSourceType } from "../types/data";
import { useDataContext } from "./DataContext";

export interface DataValidation {
  isValid: boolean;
  completeness: number; // 0-100
  criticalFieldsMissing: string[];
  templateDataCount: number;
  userDataCount: number;
  warnings: string[];
}

export type WorkflowStep =
  | "welcome"
  | "file-import"
  | "tariff-analysis"
  | "supplier-diversification"
  | "supply-chain-planning"
  | "workforce-planning"
  | "alerts-setup"
  | "ai-recommendations"
  | "complete";

export interface DataSource {
  type: "user" | "template" | "calculated" | "external" | "incomplete";
  confidence: number; // 0-100
  lastUpdated: string;
  source: string;
  isValidated: boolean;
}

interface WorkflowData {
  importedData?: any;
  analysisResults?: any;
  supplierData?: any;
  supplyChainData?: any;
  workforceData?: any;
  alertsConfig?: any;
  recommendations?: any;
  // Data source tracking
  dataSources?: { [key: string]: DataSource };
  validation?: { [step: string]: DataValidation };
}

interface WorkflowContextType {
  currentStep: WorkflowStep;
  workflowData: WorkflowData;
  canProceed: boolean;
  nextStep: () => void;
  previousStep: () => void;
  goToStep: (step: WorkflowStep) => void;
  canNavigateToStep: (step: WorkflowStep) => boolean;
  updateWorkflowData: (key: keyof WorkflowData, data: any) => Promise<void>;
  resetWorkflow: () => void;
  getStepProgress: () => { current: number; total: number };
  // Data validation methods
  validateStepData: (step: WorkflowStep) => DataValidation;
  getDataCompleteness: () => number;
  getDataSourceSummary: () => {
    user: number;
    template: number;
    calculated: number;
    external: number;
  };
  updateDataSource: (key: string, source: DataSource) => void;
}

const WorkflowContext = createContext<WorkflowContextType | undefined>(
  undefined
);

export const useWorkflow = () => {
  const context = useContext(WorkflowContext);
  if (context === undefined) {
    throw new Error("useWorkflow must be used within a WorkflowProvider");
  }
  return context;
};

export const WORKFLOW_STEPS: WorkflowStep[] = [
  "welcome",
  "file-import",
  "tariff-analysis",
  "supplier-diversification",
  "supply-chain-planning",
  "workforce-planning",
  "alerts-setup",
  "ai-recommendations",
  "complete",
];

interface WorkflowProviderProps {
  children: React.ReactNode;
}

export const WorkflowProvider: React.FC<WorkflowProviderProps> = ({
  children,
}) => {
  const [currentStep, setCurrentStep] = useState<WorkflowStep>("welcome");
  const [workflowData, setWorkflowData] = useState<WorkflowData>({});
  const [currentSession, setCurrentSession] = useState<WorkflowSession | null>(
    null
  );
  const [isLoadingSession, setIsLoadingSession] = useState(true);

  // Try to use DataContext, but handle case where it's not available
  let dataContext;
  try {
    dataContext = useDataContext();
  } catch (error) {
    // DataContext not available, continue without it
    dataContext = null;
  }

  // Initialize session and load data on mount
  useEffect(() => {
    const initializeSession = async () => {
      console.log("🔄 Initializing workflow session...");
      setIsLoadingSession(true);

      try {
        // Try to get existing session
        let session = await WorkflowDatabaseService.getCurrentSession();

        if (!session) {
          // Create new session
          console.log("📝 Creating new workflow session...");
          session = await WorkflowDatabaseService.createSession(
            "Trade Analysis Session",
            true
          );
        }

        if (session) {
          console.log("✅ Session loaded:", session.id);
          setCurrentSession(session);
          setCurrentStep(session.current_step);

          // Load all step data
          const allStepData = await WorkflowDatabaseService.getAllStepData(
            session.id
          );
          console.log("📊 Loaded step data:", Object.keys(allStepData));

          // Convert database format to workflow format
          const workflowDataFromDB: WorkflowData = {};
          Object.entries(allStepData).forEach(([stepName, stepData]) => {
            if (stepData.data) {
              // Map step names to workflow data keys
              const keyMapping: Record<string, keyof WorkflowData> = {
                "file-import": "importedData",
                "tariff-analysis": "analysisResults",
                "supplier-diversification": "supplierData",
                "supply-chain-planning": "supplyChainData",
                "workforce-planning": "workforceData",
                "alerts-setup": "alertsConfig",
                "ai-recommendations": "recommendations",
              };

              const workflowKey = keyMapping[stepName];
              if (workflowKey) {
                workflowDataFromDB[workflowKey] = stepData.data;
              }
            }
          });

          if (Object.keys(workflowDataFromDB).length > 0) {
            console.log(
              "📦 Restored workflow data:",
              Object.keys(workflowDataFromDB)
            );
            setWorkflowData(workflowDataFromDB);
          }
        }
      } catch (error) {
        console.error("❌ Error initializing session:", error);
        // Continue with local state only
      } finally {
        setIsLoadingSession(false);
      }
    };

    initializeSession();
  }, []);

  // Save data to database when workflow data changes
  useEffect(() => {
    const saveDataToDatabase = async () => {
      if (!currentSession || isLoadingSession) return;

      try {
        // Save each piece of workflow data to the appropriate step
        const dataMapping: Array<[keyof WorkflowData, string]> = [
          ["importedData", "file-import"],
          ["analysisResults", "tariff-analysis"],
          ["supplierData", "supplier-diversification"],
          ["supplyChainData", "supply-chain-planning"],
          ["workforceData", "workforce-planning"],
          ["alertsConfig", "alerts-setup"],
          ["recommendations", "ai-recommendations"],
        ];

        for (const [workflowKey, stepName] of dataMapping) {
          const stepData = workflowData[workflowKey];
          if (stepData) {
            await WorkflowDatabaseService.saveStepData(
              currentSession.id,
              stepName,
              stepData,
              { source: "user", lastUpdated: new Date().toISOString() },
              { isValid: true, completeness: 100 }
            );
          }
        }
      } catch (error) {
        console.error("❌ Error saving workflow data:", error);
      }
    };

    // Debounce saves to avoid too frequent database writes
    const timeoutId = setTimeout(saveDataToDatabase, 1000);
    return () => clearTimeout(timeoutId);
  }, [workflowData, currentSession, isLoadingSession]);

  // Update current step in database when it changes
  useEffect(() => {
    const updateStepInDatabase = async () => {
      if (!currentSession || isLoadingSession) return;

      try {
        await WorkflowDatabaseService.updateCurrentStep(
          currentSession.id,
          currentStep
        );
      } catch (error) {
        console.error("❌ Error updating current step:", error);
      }
    };

    updateStepInDatabase();
  }, [currentStep, currentSession, isLoadingSession]);

  const validateStepData = useCallback(
    (step: WorkflowStep): DataValidation => {
      // Use DataContext validation when available
      if (dataContext) {
        try {
          const stepMapping: { [key in WorkflowStep]?: string } = {
            "file-import": "file-import",
            "tariff-analysis": "tariff-analysis",
            "supplier-diversification": "supplier-diversification",
            "supply-chain-planning": "supply-chain-planning",
            "workforce-planning": "workforce-planning",
            "alerts-setup": "alerts-setup",
            "ai-recommendations": "ai-recommendations",
          };

          const mappedStep = stepMapping[step];
          if (mappedStep) {
            const dataValidation = dataContext.validateStep(mappedStep);
            return {
              isValid: dataValidation.isValid,
              completeness: dataValidation.completeness,
              criticalFieldsMissing: dataValidation.criticalFieldsMissing,
              templateDataCount: dataValidation.templateDataCount,
              userDataCount: dataValidation.userDataCount,
              warnings: dataValidation.warnings.map(w => w.message),
            };
          }
        } catch (error) {
          console.warn("DataContext validation failed, using fallback:", error);
        }
      }

      // Fallback validation logic
      const validation: DataValidation = {
        isValid: false,
        completeness: 0,
        criticalFieldsMissing: [],
        templateDataCount: 0,
        userDataCount: 0,
        warnings: [],
      };

      switch (step) {
        case "file-import":
          console.log("🔍 Validating file-import step:", {
            hasImportedData: !!workflowData.importedData,
            extractedDataLength:
              workflowData.importedData?.extractedData?.length || 0,
            fileName: workflowData.importedData?.fileName,
          });

          if (workflowData.importedData) {
            const data = workflowData.importedData;
            validation.userDataCount = data.extractedData?.length || 0;
            validation.completeness = validation.userDataCount > 0 ? 100 : 0;
            validation.isValid = validation.userDataCount > 0;
            if (validation.userDataCount === 0) {
              validation.criticalFieldsMissing.push("importedProducts");
              console.warn("⚠️ No products found in imported data");
            } else {
              console.log(
                `✅ File import validation passed: ${validation.userDataCount} products`
              );
            }
          } else {
            validation.criticalFieldsMissing.push("importedProducts");
            console.warn("⚠️ No imported data found in workflow");
          }
          break;
        case "tariff-analysis":
          if (workflowData.analysisResults && workflowData.importedData) {
            const products = workflowData.importedData.extractedData || [];
            const realTariffData = products.filter(
              (p: any) => p.tariffRate > 0
            ).length;
            validation.userDataCount = realTariffData;
            validation.templateDataCount = products.length - realTariffData;
            validation.completeness =
              products.length > 0
                ? (realTariffData / products.length) * 100
                : 0;
            validation.isValid = validation.completeness >= 50; // At least 50% real data
            if (validation.completeness < 50) {
              validation.warnings.push(
                "Many products using template tariff rates"
              );
            }
          }
          break;
        case "supplier-diversification":
          if (workflowData.supplierData) {
            validation.userDataCount =
              workflowData.supplierData.suppliers?.length || 0;
            validation.completeness = validation.userDataCount > 0 ? 100 : 0;
            validation.isValid = validation.userDataCount >= 2; // Need at least 2 suppliers
            if (validation.userDataCount < 2) {
              validation.criticalFieldsMissing.push("Multiple suppliers");
            }
          }
          break;
        case "workforce-planning":
          // Phase 2: Critical step requiring human input - no template fallbacks
          const hasHeadCount = workflowData.workforceData?.currentHeadCount > 0;
          const hasDepartments =
            workflowData.workforceData?.departmentBreakdown &&
            Object.keys(workflowData.workforceData.departmentBreakdown).length >
              0;
          const hasWage = workflowData.workforceData?.averageWage > 0;

          validation.userDataCount = [
            hasHeadCount,
            hasDepartments,
            hasWage,
          ].filter(Boolean).length;
          validation.completeness = (validation.userDataCount / 3) * 100;
          validation.isValid = validation.completeness === 100; // Phase 2: Requires 100% real data

          if (!hasHeadCount) {
            validation.criticalFieldsMissing.push("Current headcount");
            validation.warnings.push(
              "Please enter your actual current headcount - no template fallback available"
            );
          }
          if (!hasDepartments) {
            validation.criticalFieldsMissing.push("Department breakdown");
            validation.warnings.push(
              "Please provide your actual department structure - required for accurate analysis"
            );
          }
          if (!hasWage) {
            validation.criticalFieldsMissing.push("Average wage");
            validation.warnings.push(
              "Please enter your actual average wage data - essential for workforce planning"
            );
          }
          break;
        case "alerts-setup":
          if (workflowData.alertsConfig) {
            validation.userDataCount = 1;
            validation.completeness = 100;
            validation.isValid = true;
          } else {
            validation.criticalFieldsMissing.push("Alert configuration");
          }
          break;
        case "ai-recommendations":
          // Phase 2: AI recommendations require real user preferences - no defaults
          const hasRiskTolerance = workflowData.recommendations?.riskTolerance;
          const hasTimeline =
            workflowData.recommendations?.implementationTimeline;
          const hasBudget = workflowData.recommendations?.budgetConstraints;

          validation.userDataCount = [
            hasRiskTolerance,
            hasTimeline,
            hasBudget,
          ].filter(Boolean).length;
          validation.completeness = (validation.userDataCount / 3) * 100;
          validation.isValid = validation.completeness >= 90; // Phase 2: Higher threshold for personalized AI

          if (!hasRiskTolerance) {
            validation.criticalFieldsMissing.push("Risk tolerance");
            validation.warnings.push(
              "Please specify your risk tolerance - required for personalized AI recommendations"
            );
          }
          if (!hasTimeline) {
            validation.criticalFieldsMissing.push("Implementation timeline");
            validation.warnings.push(
              "Please provide your implementation timeline - needed for realistic recommendations"
            );
          }
          if (!hasBudget) {
            validation.criticalFieldsMissing.push("Budget constraints");
            validation.warnings.push(
              "Please enter your budget constraints - essential for feasible AI recommendations"
            );
          }
          break;
        case "welcome":
          validation.isValid = true;
          validation.completeness = 100;
          break;
        case "complete":
          validation.isValid = true;
          validation.completeness = 100;
          break;
        default:
          validation.isValid = true;
          validation.completeness = 100;
      }

      return validation;
    },
    [workflowData, dataContext]
  );

  const canProceed = useCallback(() => {
    // Always allow navigation from welcome step
    if (currentStep === "welcome") {
      return true;
    }

    // For other steps, check validation
    const validation = validateStepData(currentStep);
    return validation.isValid;
  }, [currentStep, validateStepData]);

  const canNavigateToStep = useCallback(
    (targetStep: WorkflowStep) => {
      // Always allow navigation to welcome
      if (targetStep === "welcome") {
        return true;
      }

      // Allow navigation to any step if we're on welcome
      if (currentStep === "welcome") {
        return true;
      }

      // Allow backward navigation
      const currentIndex = WORKFLOW_STEPS.indexOf(currentStep);
      const targetIndex = WORKFLOW_STEPS.indexOf(targetStep);
      if (targetIndex <= currentIndex) {
        return true;
      }

      // For forward navigation, allow access to next few steps if user has data
      // This provides more flexible navigation while maintaining workflow guidance
      const hasImportedData =
        workflowData.importedData?.extractedData?.length > 0;
      const hasAnalysisData = workflowData.analysisResults || hasImportedData;
      const hasSupplierData = workflowData.supplierData || hasAnalysisData;

      switch (targetStep) {
        case "file-import":
          return true; // Always accessible
        case "tariff-analysis":
          return hasImportedData || currentIndex >= 1;
        case "supplier-diversification":
          return hasAnalysisData || currentIndex >= 2;
        case "supply-chain-planning":
          return hasSupplierData || currentIndex >= 3;
        case "workforce-planning":
          return workflowData.supplyChainData || currentIndex >= 4;
        case "alerts-setup":
          return workflowData.workforceData || currentIndex >= 5;
        case "ai-recommendations":
          return workflowData.alertsConfig || currentIndex >= 6;
        case "complete":
          return currentIndex >= 7;
        default:
          return canProceed();
      }
    },
    [currentStep, canProceed, workflowData]
  );

  const getDataCompleteness = useCallback(() => {
    if (dataContext) {
      try {
        // Use DataContext completeness when available
        return dataContext.getDataCompleteness();
      } catch (error) {
        console.warn("DataContext completeness failed, using fallback:", error);
      }
    }

    // Fallback calculation
    const steps: WorkflowStep[] = [
      "file-import",
      "tariff-analysis",
      "supplier-diversification",
      "workforce-planning",
      "alerts-setup",
      "ai-recommendations",
    ];
    const validations = steps.map(step => validateStepData(step));
    const totalCompleteness = validations.reduce(
      (sum, v) => sum + v.completeness,
      0
    );
    return totalCompleteness / steps.length;
  }, [validateStepData, dataContext]);

  const getDataSourceSummary = useCallback(() => {
    if (dataContext) {
      try {
        // Use DataContext summary when available
        return dataContext.getDataSourceSummary();
      } catch (error) {
        console.warn("DataContext summary failed, using fallback:", error);
      }
    }

    // Fallback calculation
    const summary = { user: 0, template: 0, calculated: 0, external: 0 };

    if (workflowData.importedData?.extractedData) {
      workflowData.importedData.extractedData.forEach((item: any) => {
        if (item.dataSource === "api" || item.htsCode) {
          summary.external++;
        } else if (item.tariffRate > 0) {
          summary.user++;
        } else {
          summary.template++;
        }
      });
    }

    // Add other workflow data sources
    if (workflowData.supplierData?.suppliers?.length > 0) summary.user++;
    if (workflowData.workforceData?.currentHeadCount > 0) summary.user++;
    if (workflowData.alertsConfig) summary.user++;
    if (workflowData.recommendations?.riskTolerance) summary.user++;

    return summary;
  }, [currentSession, workflowData, dataContext]);

  const updateDataSource = useCallback((key: string, source: DataSource) => {
    setWorkflowData(prev => ({
      ...prev,
      dataSources: {
        ...prev.dataSources,
        [key]: source,
      },
    }));
  }, []);

  const nextStep = useCallback(() => {
    const currentIndex = WORKFLOW_STEPS.indexOf(currentStep);
    if (currentIndex < WORKFLOW_STEPS.length - 1) {
      // Always allow progression from welcome step
      if (currentStep === "welcome" || canProceed()) {
        setCurrentStep(WORKFLOW_STEPS[currentIndex + 1]);
      }
    }
  }, [currentStep, canProceed]);

  const goToStep = useCallback(
    (targetStep: WorkflowStep) => {
      if (canNavigateToStep(targetStep)) {
        setCurrentStep(targetStep);
      }
    },
    [canNavigateToStep]
  );

  const previousStep = useCallback(() => {
    const currentIndex = WORKFLOW_STEPS.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(WORKFLOW_STEPS[currentIndex - 1]);
    }
  }, [currentStep]);

  const updateWorkflowData = useCallback(
    async (key: keyof WorkflowData, data: any) => {
      setWorkflowData(prev => ({ ...prev, [key]: data }));

      // Cache expensive analysis results in database
      if (currentSession && data) {
        try {
          const analysisTypeMapping: Record<
            keyof WorkflowData,
            "tariff" | "supplier" | "supply-chain" | "workforce" | null
          > = {
            importedData: null,
            analysisResults: "tariff",
            supplierData: "supplier",
            supplyChainData: "supply-chain",
            workforceData: "workforce",
            alertsConfig: null,
            recommendations: null,
            dataSources: null,
            validation: null,
          };

          const analysisType = analysisTypeMapping[key];
          if (analysisType) {
            // Generate hash of input data to detect changes
            const inputHash = WorkflowDatabaseService.generateDataHash({
              workflowData: workflowData,
              newData: data,
              timestamp: new Date().toISOString(),
            });

            // Save analysis result with caching
            await WorkflowDatabaseService.saveAnalysisResult(
              currentSession.id,
              analysisType,
              inputHash,
              data,
              data.apiCallsMade || [],
              data.computationTimeMs
            );

            console.log(`💾 Cached ${analysisType} analysis result`);
          }
        } catch (error) {
          console.warn("⚠️ Failed to cache analysis result:", error);
        }
      }

      // Sync with DataContext based on the workflow step and data type
      if (dataContext) {
        try {
          if (key === "importedData" && data) {
            // Update file import data in DataContext
            dataContext.updateData("importedProducts", {
              value: data.extractedData || [],
              source: DataSourceType.USER_UPLOAD,
              timestamp: new Date().toISOString(),
              validated: true,
              lastUpdated: new Date().toISOString(),
            });

            dataContext.updateData("fileMetadata", {
              value: {
                fileName: data.fileName || "",
                fileSize: data.fileSize || 0,
                uploadDate: new Date().toISOString(),
                processingStatus: "completed",
              },
              source: DataSourceType.USER_UPLOAD,
              timestamp: new Date().toISOString(),
              validated: true,
              lastUpdated: new Date().toISOString(),
            });

            // Update cost calculator results
            if (data.totalOriginalValue !== undefined) {
              dataContext.updateData("totalOriginalValue", {
                value: data.totalOriginalValue,
                source: DataSourceType.CALCULATED,
                timestamp: new Date().toISOString(),
                validated: true,
                lastUpdated: new Date().toISOString(),
              });
            }

            if (data.totalNewValue !== undefined) {
              dataContext.updateData("totalNewValue", {
                value: data.totalNewValue,
                source: DataSourceType.CALCULATED,
                timestamp: new Date().toISOString(),
                validated: true,
                lastUpdated: new Date().toISOString(),
              });
            }

            if (data.totalImpact !== undefined) {
              dataContext.updateData("totalAnnualImpact", {
                value: data.totalImpact * 12, // Convert monthly to annual
                source: DataSourceType.CALCULATED,
                timestamp: new Date().toISOString(),
                validated: true,
                lastUpdated: new Date().toISOString(),
              });
            }

            if (data.averageTariffRate !== undefined) {
              dataContext.updateData("averageTariffRate", {
                value: data.averageTariffRate,
                source: DataSourceType.CALCULATED,
                timestamp: new Date().toISOString(),
                validated: true,
                lastUpdated: new Date().toISOString(),
              });
            }

            if (data.highImpactProducts) {
              dataContext.updateData("highImpactProducts", {
                value: data.highImpactProducts,
                source: DataSourceType.CALCULATED,
                timestamp: new Date().toISOString(),
                validated: true,
                lastUpdated: new Date().toISOString(),
              });
            }
          }

          if (key === "supplierData" && data) {
            dataContext.updateData("currentSuppliers", {
              value: data.suppliers || [],
              source: DataSourceType.USER_INPUT,
              timestamp: new Date().toISOString(),
              validated: true,
              requiresValidation: false,
              lastUpdated: new Date().toISOString(),
            });

            if (data.concentration) {
              dataContext.updateData("supplierConcentration", {
                value: data.concentration,
                source: DataSourceType.CALCULATED,
                timestamp: new Date().toISOString(),
                validated: true,
                lastUpdated: new Date().toISOString(),
              });
            }
          }

          if (key === "workforceData" && data) {
            if (data.currentHeadCount !== undefined) {
              dataContext.updateData("currentHeadCount", {
                value: data.currentHeadCount,
                source: DataSourceType.USER_INPUT,
                timestamp: new Date().toISOString(),
                validated: true,
                requiresValidation: true,
                lastUpdated: new Date().toISOString(),
              });
            }

            if (data.departmentBreakdown) {
              dataContext.updateData("departmentBreakdown", {
                value: data.departmentBreakdown,
                source: DataSourceType.USER_INPUT,
                timestamp: new Date().toISOString(),
                validated: true,
                requiresValidation: true,
                lastUpdated: new Date().toISOString(),
              });
            }

            if (data.averageWage !== undefined) {
              dataContext.updateData("averageWage", {
                value: data.averageWage,
                source: DataSourceType.USER_INPUT,
                timestamp: new Date().toISOString(),
                validated: true,
                requiresValidation: true,
                lastUpdated: new Date().toISOString(),
              });
            }
          }

          if (key === "alertsConfig" && data) {
            dataContext.updateData("alertConfiguration", {
              value: data,
              source: DataSourceType.USER_INPUT,
              timestamp: new Date().toISOString(),
              validated: true,
              requiresValidation: true,
              lastUpdated: new Date().toISOString(),
            });
          }

          if (key === "recommendations" && data) {
            if (data.riskTolerance) {
              dataContext.updateData("riskTolerance", {
                value: data.riskTolerance,
                source: DataSourceType.USER_INPUT,
                timestamp: new Date().toISOString(),
                validated: true,
                requiresValidation: true,
                lastUpdated: new Date().toISOString(),
              });
            }

            if (data.implementationTimeline) {
              dataContext.updateData("implementationTimeline", {
                value: data.implementationTimeline,
                source: DataSourceType.USER_INPUT,
                timestamp: new Date().toISOString(),
                validated: true,
                requiresValidation: true,
                lastUpdated: new Date().toISOString(),
              });
            }

            if (data.budgetConstraints) {
              dataContext.updateData("budgetConstraints", {
                value: data.budgetConstraints,
                source: DataSourceType.USER_INPUT,
                timestamp: new Date().toISOString(),
                validated: true,
                requiresValidation: true,
                lastUpdated: new Date().toISOString(),
              });
            }
          }
        } catch (error) {
          console.warn("Failed to sync data with DataContext:", error);
        }
      }
    },
    [dataContext]
  );

  const resetWorkflow = useCallback(() => {
    setCurrentStep("welcome");
    setWorkflowData({});
    if (dataContext) {
      try {
        dataContext.resetData();
      } catch (error) {
        console.warn("Failed to reset DataContext:", error);
      }
    }
  }, [dataContext]);

  const getStepProgress = useCallback(() => {
    const currentIndex = WORKFLOW_STEPS.indexOf(currentStep);
    return {
      current: currentIndex + 1,
      total: WORKFLOW_STEPS.length,
    };
  }, [currentStep]);

  const value = {
    currentStep,
    workflowData,
    canProceed: canProceed(),
    nextStep,
    previousStep,
    goToStep,
    canNavigateToStep,
    updateWorkflowData,
    resetWorkflow,
    getStepProgress,
    validateStepData,
    getDataCompleteness,
    getDataSourceSummary,
    updateDataSource,
  };

  return (
    <WorkflowContext.Provider value={value}>
      {children}
    </WorkflowContext.Provider>
  );
};
