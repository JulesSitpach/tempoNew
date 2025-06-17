import { SMBContextService } from "@/services/apiServices";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useState,
} from "react";
import { validateStepData } from "../lib/useDataValidation";
import {
  BusinessDataProfile,
  DataPoint,
  DataSourceSummary,
  DataSourceType,
  STEP_VALIDATION_CONFIG,
  ValidationResult,
} from "../types/data";

export interface DataContextType {
  businessData: BusinessDataProfile;
  updateData: <K extends keyof BusinessDataProfile>(
    field: K,
    value: DataPoint<any>
  ) => void;
  updateMultipleFields: (updates: Partial<BusinessDataProfile>) => void;
  validateStep: (step: string) => ValidationResult;
  getDataCompleteness: () => number;
  getDataSourceSummary: () => DataSourceSummary;
  markAsValidated: <K extends keyof BusinessDataProfile>(field: K) => void;
  resetData: () => void;
  exportData: () => string;
  importData: (jsonData: string) => boolean;
  getFieldMetadata: <K extends keyof BusinessDataProfile>(
    field: K
  ) => DataPoint<any> | null;
  isFieldCritical: (step: string, field: string) => boolean;
  getStepProgress: (step: string) => {
    completed: number;
    total: number;
    percentage: number;
  };
  // Phase 3: Add method to clear template data after upload
  clearTemplateData: () => void;
  getUploadStatus: () => boolean;
  // SMB Context Integration
  updateSMBContext: (contextData: any) => void;
  getSMBProfile: () => any;
  applySMBAdjustments: (analysisData: any) => any;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

// Utility functions
const now = () => new Date().toISOString();

const createDataPoint = <T,>(
  value: T,
  source: DataSourceType,
  requiresValidation = false
): DataPoint<T> => ({
  value,
  source,
  timestamp: now(),
  validated: !requiresValidation,
  requiresValidation,
  lastUpdated: now(),
});

const calculateCompleteness = (profile: BusinessDataProfile): number => {
  const dataFields = Object.entries(profile).filter(
    ([key]) => key !== "dataCompleteness"
  );
  const totalFields = dataFields.length;

  if (totalFields === 0) return 0;

  const userProvidedFields = dataFields.filter(([, value]) => {
    const dataPoint = value as DataPoint<any>;
    return (
      dataPoint.source === DataSourceType.USER_INPUT ||
      dataPoint.source === DataSourceType.USER_UPLOAD
    );
  }).length;

  return (userProvidedFields / totalFields) * 100;
};

const getDataSourceSummary = (
  profile: BusinessDataProfile
): DataSourceSummary => {
  const dataFields = Object.entries(profile).filter(
    ([key]) => key !== "dataCompleteness"
  );
  const summary = {
    user: 0,
    template: 0,
    calculated: 0,
    external: 0,
    total: dataFields.length,
    completenessPercentage: 0,
  };

  dataFields.forEach(([, value]) => {
    const dataPoint = value as DataPoint<any>;
    switch (dataPoint.source) {
      case DataSourceType.USER_INPUT:
      case DataSourceType.USER_UPLOAD:
        summary.user++;
        break;
      case DataSourceType.TEMPLATE:
      case DataSourceType.SYSTEM_DEFAULT:
        summary.template++;
        break;
      case DataSourceType.CALCULATED:
        summary.calculated++;
        break;
      case DataSourceType.EXTERNAL_API:
        summary.external++;
        break;
    }
  });

  summary.completenessPercentage =
    summary.total > 0 ? (summary.user / summary.total) * 100 : 0;
  return summary;
};

// Initial data profile with completely empty/zero values for clean state
const createInitialProfile = (): BusinessDataProfile => ({
  // Step 1: File Import Data - Completely empty
  importedProducts: createDataPoint([], DataSourceType.SYSTEM_DEFAULT),
  fileMetadata: createDataPoint(
    {
      fileName: "",
      fileSize: 0,
      uploadDate: "",
      processingStatus: "pending",
    },
    DataSourceType.SYSTEM_DEFAULT
  ),

  // Step 2: Cost Calculator Results - All zeros for clean state
  totalOriginalValue: createDataPoint(0, DataSourceType.SYSTEM_DEFAULT),
  totalNewValue: createDataPoint(0, DataSourceType.SYSTEM_DEFAULT),
  totalAnnualImpact: createDataPoint(0, DataSourceType.SYSTEM_DEFAULT),
  averageTariffRate: createDataPoint(0, DataSourceType.SYSTEM_DEFAULT),
  highImpactProducts: createDataPoint([], DataSourceType.SYSTEM_DEFAULT),

  // Step 3: Supplier Diversification - Empty state
  currentSuppliers: createDataPoint([], DataSourceType.SYSTEM_DEFAULT),
  supplierConcentration: createDataPoint(
    {
      supplierCount: 0,
      topSupplierShare: 0,
      geographicDistribution: {},
      riskScore: 0,
    },
    DataSourceType.SYSTEM_DEFAULT
  ),
  diversificationScore: createDataPoint(0, DataSourceType.SYSTEM_DEFAULT),
  recommendedSuppliers: createDataPoint([], DataSourceType.SYSTEM_DEFAULT),

  // Step 4: Supply Chain Planning - Empty state
  inventoryOptimization: createDataPoint(
    {
      recommendedStockLevels: {},
      leadTimeAdjustments: {},
      seasonalFactors: {},
    },
    DataSourceType.SYSTEM_DEFAULT
  ),
  scenarioResults: createDataPoint(
    {
      bestCase: 0,
      worstCase: 0,
      mostLikely: 0,
    },
    DataSourceType.SYSTEM_DEFAULT
  ),

  // Step 5: Workforce Planning - Empty state
  currentHeadCount: createDataPoint(0, DataSourceType.SYSTEM_DEFAULT, true),
  departmentBreakdown: createDataPoint({}, DataSourceType.SYSTEM_DEFAULT, true),
  averageWage: createDataPoint(0, DataSourceType.SYSTEM_DEFAULT, true),
  workforceMetrics: createDataPoint(
    {
      totalHeadCount: 0,
      departmentBreakdown: {},
      averageWage: 0,
      skillsGapAreas: [],
      trainingNeeds: [],
    },
    DataSourceType.SYSTEM_DEFAULT
  ),
  hiringPlans: createDataPoint(
    {
      plannedHires: 0,
      timeframe: "",
      departments: [],
    },
    DataSourceType.SYSTEM_DEFAULT,
    true
  ),

  // Step 6: Alerts & Monitoring - Default empty configuration
  alertConfiguration: createDataPoint(
    {
      tariffThreshold: 0,
      supplierRiskThreshold: 0,
      emailNotifications: false,
      smsNotifications: false,
      alertFrequency: "daily" as "immediate" | "daily" | "weekly",
    },
    DataSourceType.SYSTEM_DEFAULT,
    true
  ),
  monitoringPreferences: createDataPoint(
    {
      trackingFrequency: "",
      reportingSchedule: "",
      stakeholderNotifications: [],
    },
    DataSourceType.SYSTEM_DEFAULT
  ),

  // Step 7: AI Recommendations - Empty state
  riskTolerance: createDataPoint(
    "medium" as const,
    DataSourceType.SYSTEM_DEFAULT,
    true
  ),
  implementationTimeline: createDataPoint(
    "",
    DataSourceType.SYSTEM_DEFAULT,
    true
  ),
  budgetConstraints: createDataPoint(
    {
      maxInvestment: 0,
      paybackPeriod: 0,
      priorityAreas: [],
    },
    DataSourceType.SYSTEM_DEFAULT,
    true
  ),

  // Cross-cutting concerns - Empty state
  businessProfile: createDataPoint(
    {
      industry: "",
      companySize: "",
      annualRevenue: 0,
      primaryMarkets: [],
    },
    DataSourceType.SYSTEM_DEFAULT,
    true
  ),

  // SMB-specific data integration - Empty state
  smbProfile: createDataPoint(
    {
      businessClassification: "small" as const,
      employeeCount: 0,
      industryCode: "",
      geographicLocation: {
        country: "",
        state: "",
        region: "",
      },
      procurementPatterns: {
        averageOrderValue: 0,
        orderFrequency: "monthly" as const,
        seasonalVariation: 0,
        primarySupplierCountries: [],
      },
      budgetConstraints: {
        cashFlowSensitivity: "medium" as const,
        maxMonthlyImpact: 0,
        emergencyReserves: 0,
        creditAvailability: 0,
      },
      riskProfile: {
        riskTolerance: "moderate" as const,
        diversificationLevel: 0,
        complianceRequirements: [],
      },
    },
    DataSourceType.SYSTEM_DEFAULT,
    true
  ),

  // SMB-specific risk factors - Empty state
  smbRiskFactors: createDataPoint(
    {
      cashFlowRisk: 0,
      supplierConcentrationRisk: 0,
      marketVolatilityRisk: 0,
      complianceRisk: 0,
      overallRiskScore: 0,
      riskMitigationStrategies: [],
    },
    DataSourceType.SYSTEM_DEFAULT
  ),

  // SMB-tailored recommendations - Empty state
  smbRecommendations: createDataPoint(
    {
      immediateActions: [],
      mediumTermStrategies: [],
      longTermPlanning: [],
    },
    DataSourceType.SYSTEM_DEFAULT
  ),

  // Data completeness tracking - All zeros for clean state
  dataCompleteness: {
    totalFields: 0,
    userProvidedFields: 0,
    templateFields: 0,
    calculatedFields: 0,
    externalApiFields: 0,
    completenessScore: 0,
    lastCalculated: now(),
  },
});

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [businessData, setBusinessData] = useState<BusinessDataProfile>(() => {
    // Try to load from localStorage on initialization
    const saved = localStorage.getItem("businessDataProfile");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (error) {
        console.warn(
          "Failed to parse saved business data, using initial profile"
        );
      }
    }
    return createInitialProfile();
  });

  // Save to localStorage whenever data changes
  const saveToStorage = useCallback((data: BusinessDataProfile) => {
    try {
      localStorage.setItem("businessDataProfile", JSON.stringify(data));
      // Also save a simplified version for debugging
      const summary = {
        lastUpdated: new Date().toISOString(),
        completeness: data.dataCompleteness.completenessScore,
        userFields: data.dataCompleteness.userProvidedFields,
        totalFields: data.dataCompleteness.totalFields,
      };
      localStorage.setItem("businessDataSummary", JSON.stringify(summary));
    } catch (error) {
      console.warn("Failed to save business data to localStorage");
    }
  }, []);

  const updateDataCompleteness = useCallback(
    (data: BusinessDataProfile): BusinessDataProfile => {
      const summary = getDataSourceSummary(data);
      const completenessScore = calculateCompleteness(data);

      return {
        ...data,
        dataCompleteness: {
          totalFields: summary.total,
          userProvidedFields: summary.user,
          templateFields: summary.template,
          calculatedFields: summary.calculated,
          externalApiFields: summary.external,
          completenessScore,
          lastCalculated: now(),
        },
      };
    },
    []
  );

  const updateData = useCallback(
    <K extends keyof BusinessDataProfile>(field: K, value: DataPoint<any>) => {
      console.log(`📊 DataContext updating field: ${String(field)}`, {
        source: value.source,
        hasValue: value.value !== null && value.value !== undefined,
        valueType: typeof value.value,
        isArray: Array.isArray(value.value),
        arrayLength: Array.isArray(value.value) ? value.value.length : "N/A",
      });

      setBusinessData(prev => {
        const updated = {
          ...prev,
          [field]: {
            ...value,
            timestamp: now(),
            lastUpdated: now(),
            // Phase 3: Ensure proper data classification
            templateData:
              value.source === DataSourceType.TEMPLATE ||
              value.source === DataSourceType.SYSTEM_DEFAULT,
            userProvided:
              value.source === DataSourceType.USER_INPUT ||
              value.source === DataSourceType.USER_UPLOAD,
            derivedFromUserData:
              value.source === DataSourceType.CALCULATED &&
              (value as any).derivedFromUserData === true,
          },
        };
        const withCompleteness = updateDataCompleteness(updated);
        saveToStorage(withCompleteness);

        console.log(
          `✅ DataContext field ${String(field)} updated successfully`
        );
        return withCompleteness;
      });
    },
    [updateDataCompleteness, saveToStorage]
  );

  const updateMultipleFields = useCallback(
    (updates: Partial<BusinessDataProfile>) => {
      setBusinessData(prev => {
        const updated = { ...prev };
        Object.entries(updates).forEach(([key, value]) => {
          if (key !== "dataCompleteness") {
            const dataPoint = value as DataPoint<any>;
            updated[key as keyof BusinessDataProfile] = {
              ...dataPoint,
              timestamp: now(),
              lastUpdated: now(),
              // Phase 3: Ensure proper data classification
              templateData:
                dataPoint.source === DataSourceType.TEMPLATE ||
                dataPoint.source === DataSourceType.SYSTEM_DEFAULT,
              userProvided:
                dataPoint.source === DataSourceType.USER_INPUT ||
                dataPoint.source === DataSourceType.USER_UPLOAD,
              derivedFromUserData:
                dataPoint.source === DataSourceType.CALCULATED &&
                (dataPoint as any).derivedFromUserData === true,
            } as any;
          }
        });
        const withCompleteness = updateDataCompleteness(updated);
        saveToStorage(withCompleteness);
        return withCompleteness;
      });
    },
    [updateDataCompleteness, saveToStorage]
  );

  const validateStep = useCallback(
    (step: string): ValidationResult => {
      return validateStepData(businessData, step);
    },
    [businessData]
  );

  const getDataCompleteness = useCallback((): number => {
    return businessData.dataCompleteness.completenessScore;
  }, [businessData]);

  const getDataSourceSummaryCallback = useCallback((): DataSourceSummary => {
    return getDataSourceSummary(businessData);
  }, [businessData]);

  const markAsValidated = useCallback(
    <K extends keyof BusinessDataProfile>(field: K) => {
      setBusinessData(prev => {
        const dataPoint = prev[field] as DataPoint<any>;
        const updated = {
          ...prev,
          [field]: {
            ...dataPoint,
            validated: true,
            lastUpdated: now(),
            // Phase 3: Maintain proper data classification when validating
            templateData:
              dataPoint.source === DataSourceType.TEMPLATE ||
              dataPoint.source === DataSourceType.SYSTEM_DEFAULT,
            userProvided:
              dataPoint.source === DataSourceType.USER_INPUT ||
              dataPoint.source === DataSourceType.USER_UPLOAD,
            derivedFromUserData:
              dataPoint.source === DataSourceType.CALCULATED &&
              (dataPoint as any).derivedFromUserData === true,
          },
        };
        const withCompleteness = updateDataCompleteness(updated);
        saveToStorage(withCompleteness);
        return withCompleteness;
      });
    },
    [updateDataCompleteness, saveToStorage]
  );

  const resetData = useCallback(() => {
    const fresh = createInitialProfile();
    setBusinessData(fresh);
    // Clear localStorage completely
    localStorage.removeItem("businessDataProfile");
    localStorage.removeItem("businessDataSummary");
    // Don't save the fresh data to storage - keep it truly empty
  }, []);

  const exportData = useCallback((): string => {
    return JSON.stringify(businessData, null, 2);
  }, [businessData]);

  const importData = useCallback(
    (jsonData: string): boolean => {
      try {
        const parsed = JSON.parse(jsonData);
        const withCompleteness = updateDataCompleteness(parsed);
        setBusinessData(withCompleteness);
        saveToStorage(withCompleteness);
        return true;
      } catch (error) {
        console.error("Failed to import data:", error);
        return false;
      }
    },
    [updateDataCompleteness, saveToStorage]
  );

  const getFieldMetadata = useCallback(
    <K extends keyof BusinessDataProfile>(field: K): DataPoint<any> | null => {
      return (businessData[field] as DataPoint<any>) || null;
    },
    [businessData]
  );

  const isFieldCritical = useCallback(
    (step: string, field: string): boolean => {
      const config = STEP_VALIDATION_CONFIG[step];
      return config ? config.criticalFields.includes(field) : false;
    },
    []
  );

  const getStepProgress = useCallback(
    (step: string) => {
      const config = STEP_VALIDATION_CONFIG[step];
      if (!config) {
        return { completed: 0, total: 0, percentage: 0 };
      }

      const requiredFields = config.requiredFields;
      const completed = requiredFields.filter(field => {
        const dataPoint = businessData[
          field as keyof BusinessDataProfile
        ] as DataPoint<any>;
        return (
          dataPoint &&
          dataPoint.source !== DataSourceType.TEMPLATE &&
          dataPoint.validated
        );
      }).length;

      return {
        completed,
        total: requiredFields.length,
        percentage:
          requiredFields.length > 0
            ? (completed / requiredFields.length) * 100
            : 0,
      };
    },
    [businessData]
  );

  // Phase 3: Add method to clear template data after upload
  const clearTemplateData = useCallback(() => {
    setBusinessData(prev => {
      const updated = { ...prev };

      // Only clear template data if upload is complete
      const uploadComplete =
        prev.fileMetadata?.value?.processingStatus === "completed" ||
        prev.importedProducts?.value?.length > 0;

      if (uploadComplete) {
        // Convert template data to prompts for user input instead of using fallbacks
        Object.keys(updated).forEach(key => {
          if (key !== "dataCompleteness") {
            const dataPoint = updated[
              key as keyof BusinessDataProfile
            ] as DataPoint<any>;
            if (
              dataPoint &&
              (dataPoint.source === DataSourceType.TEMPLATE ||
                dataPoint.source === DataSourceType.SYSTEM_DEFAULT)
            ) {
              // Mark as requiring user input instead of using template
              updated[key as keyof BusinessDataProfile] = {
                ...dataPoint,
                requiresValidation: true,
                validated: false,
                templateData: true,
                userProvided: false,
                lastUpdated: now(),
              } as any;
            }
          }
        });
      }

      const withCompleteness = updateDataCompleteness(updated);
      saveToStorage(withCompleteness);
      return withCompleteness;
    });
  }, [updateDataCompleteness, saveToStorage]);

  const getUploadStatus = useCallback((): boolean => {
    return (
      businessData.fileMetadata?.value?.processingStatus === "completed" ||
      businessData.importedProducts?.value?.length > 0 ||
      (businessData as any).uploadComplete?.value === true
    );
  }, [businessData]);

  // SMB Context Integration methods
  const updateSMBContext = useCallback(
    (contextData: any) => {
      // Update SMB profile with data from primary application
      updateData("smbProfile", {
        value: contextData.smbProfile,
        source: DataSourceType.USER_INPUT,
        timestamp: now(),
        validated: true,
        requiresValidation: false,
        lastUpdated: now(),
      });

      // Update risk factors based on SMB context
      if (contextData.riskFactors) {
        updateData("smbRiskFactors", {
          value: contextData.riskFactors,
          source: DataSourceType.CALCULATED,
          timestamp: now(),
          validated: true,
          lastUpdated: now(),
        });
      }

      // Update SMB-specific recommendations
      if (contextData.recommendations) {
        updateData("smbRecommendations", {
          value: contextData.recommendations,
          source: DataSourceType.CALCULATED,
          timestamp: now(),
          validated: true,
          lastUpdated: now(),
        });
      }

      // Update business profile with SMB data
      const smbProfile = contextData.smbProfile;
      if (smbProfile) {
        updateData("businessProfile", {
          value: {
            industry: smbProfile.industryCode || "",
            companySize: smbProfile.businessClassification || "",
            annualRevenue:
              smbProfile.procurementPatterns?.averageOrderValue * 12 || 0,
            primaryMarkets: [smbProfile.geographicLocation?.region || ""],
          },
          source: DataSourceType.USER_INPUT,
          timestamp: now(),
          validated: true,
          requiresValidation: true,
          lastUpdated: now(),
        });
      }
    },
    [updateData]
  );

  const getSMBProfile = useCallback(() => {
    return businessData.smbProfile?.value || null;
  }, [businessData]);

  const applySMBAdjustments = useCallback(
    async (analysisData: any) => {
      const smbProfile = getSMBProfile();
      if (!smbProfile) return analysisData;

      // Apply SMB-specific adjustments to the analysis
      const riskMultipliers =
        SMBContextService.calculateSMBRiskMultipliers(smbProfile);
      const thresholds = SMBContextService.generateSMBThresholds(smbProfile);

      // Apply SMB-specific adjustments to the analysis
      const adjustedAnalysis = {
        ...analysisData,
        smbAdjustedImpact:
          analysisData.totalImpact * riskMultipliers.cashFlowMultiplier,
        smbRiskLevel:
          analysisData.totalImpact >= thresholds.criticalImpactThreshold
            ? "critical"
            : analysisData.totalImpact >= thresholds.highImpactThreshold
            ? "high"
            : analysisData.totalImpact >= thresholds.mediumImpactThreshold
            ? "medium"
            : "low",
        smbSpecificThresholds: thresholds,
        businessClassification: smbProfile.businessClassification,
        cashFlowSensitivity:
          smbProfile.budgetConstraints?.cashFlowSensitivity || "medium",
      };

      return adjustedAnalysis;
    },
    [getSMBProfile]
  );

  const contextValue: DataContextType = {
    businessData,
    updateData,
    updateMultipleFields,
    validateStep,
    getDataCompleteness,
    getDataSourceSummary: getDataSourceSummaryCallback,
    markAsValidated,
    resetData,
    exportData,
    importData,
    getFieldMetadata,
    isFieldCritical,
    getStepProgress,
    clearTemplateData,
    getUploadStatus,
    updateSMBContext,
    getSMBProfile,
    applySMBAdjustments,
  };

  return (
    <DataContext.Provider value={contextValue}>{children}</DataContext.Provider>
  );
};

export const useDataContext = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useDataContext must be used within a DataProvider");
  }
  return context;
};
