// Data source classification types and business data profile interfaces

// World Bank Data Types
export interface WorldBankCountry {
  id: string;
  iso2Code: string;
  name: string;
  region: {
    id: string;
    iso2code: string;
    value: string;
  };
  adminregion: {
    id: string;
    iso2code: string;
    value: string;
  };
  incomeLevel: {
    id: string;
    iso2code: string;
    value: string;
  };
  lendingType: {
    id: string;
    iso2code: string;
    value: string;
  };
  capitalCity: string;
  longitude: string;
  latitude: string;
}

export interface WorldBankIncomeLevel {
  id: string;
  iso2code: string;
  value: string;
}

export interface WorldBankLendingType {
  id: string;
  iso2code: string;
  value: string;
}

export interface WorldBankRegion {
  id: string;
  iso2code: string;
  value: string;
}

export interface WorldBankIndicator {
  id: string;
  name: string;
  unit: string;
  source: {
    id: string;
    value: string;
  };
  sourceNote: string;
  sourceOrganization: string;
  topics: {
    id: string;
    value: string;
  }[];
}

export interface WorldBankIndicatorData {
  indicator: WorldBankIndicator;
  country: {
    id: string;
    value: string;
  };
  countryiso3code: string;
  date: string;
  value: number | null;
  unit: string;
  obs_status: string;
  decimal: number;
}

export interface CountryRiskProfile {
  countryCode: string;
  countryName: string;
  region: string;
  incomeLevel: string;
  lendingType: string;
  riskScore: number;
  economicStability: number;
  politicalStability: number;
  tradeComplexity: number;
  logisticsPerformance: number;
  businessEnvironment: number;
  lastUpdated: string;
  dataSource: string;
}

export interface SupplierRiskAssessment {
  supplierId: string;
  supplierName: string;
  country: string;
  countryRisk: CountryRiskProfile;
  overallRiskScore: number;
  riskFactors: {
    geographic: number;
    economic: number;
    political: number;
    operational: number;
  };
  recommendations: string[];
  lastAssessed: string;
}

// SAM.gov API Types
export interface SAMEntity {
  entityRegistration: {
    samRegistered: string;
    ueiSAM: string;
    entityEFTIndicator: string;
    cageCode: string;
    dodaac: string;
    legalBusinessName: string;
    dbaName?: string;
    purposeOfRegistrationCode: string;
    purposeOfRegistrationDesc: string;
    registrationStatus: string;
    registrationDate: string;
    lastUpdateDate: string;
    registrationExpirationDate: string;
    activationDate: string;
    ueiStatus: string;
    ueiExpirationDate: string;
    ueiCreationDate: string;
    publicDisplayFlag: string;
    exclusionStatusFlag: string;
    exclusionURL?: string;
    dnbOpenData?: string;
  };
  coreData: {
    entityInformation: {
      entityURL?: string;
      entityDivisionName?: string;
      entityDivisionNumber?: string;
      entityStartDate?: string;
      fiscalYearEndCloseDate?: string;
      submissionDate?: string;
    };
    physicalAddress: {
      addressLine1: string;
      addressLine2?: string;
      city: string;
      stateOrProvinceCode: string;
      zipCode: string;
      zipCodePlus4?: string;
      countryCode: string;
    };
    mailingAddress?: {
      addressLine1: string;
      addressLine2?: string;
      city: string;
      stateOrProvinceCode: string;
      zipCode: string;
      zipCodePlus4?: string;
      countryCode: string;
    };
    congressionalDistrict?: string;
    generalInformation: {
      agencyBusinessPurposeCode?: string;
      agencyBusinessPurposeDesc?: string;
      entityStructureCode?: string;
      entityStructureDesc?: string;
      entityTypeCode?: string;
      entityTypeDesc?: string;
      profitStructureCode?: string;
      profitStructureDesc?: string;
      organizationStructureCode?: string;
      organizationStructureDesc?: string;
      stateOfIncorporationCode?: string;
      stateOfIncorporationDesc?: string;
      countryOfIncorporationCode?: string;
      countryOfIncorporationDesc?: string;
    };
    businessTypes?: {
      businessTypeList: {
        businessTypeCode: string;
        businessTypeDesc: string;
      }[];
      sbaBusinessTypeList?: {
        sbaBusinessTypeCode?: string;
        sbaBusinessTypeDesc?: string;
        certificationEntryDate?: string;
        certificationExitDate?: string;
      }[];
    };
  };
  assertions?: {
    goodsAndServices: {
      naicsCode: string;
      naicsDesc: string;
      isPrimary: string;
      isSmallBusiness: string;
      exceptionCounter?: string;
    }[];
  };
  repsAndCerts?: {
    certifications: {
      fARResponseCode?: string;
      fARResponseDesc?: string;
      dfarsResponseCode?: string;
      dfarsResponseDesc?: string;
    };
  };
  pointsOfContact?: {
    governmentBusinessPOC?: {
      firstName?: string;
      lastName?: string;
      title?: string;
      telephoneNumber?: string;
      extension?: string;
      faxNumber?: string;
      email?: string;
    };
    electronicBusinessPOC?: {
      firstName?: string;
      lastName?: string;
      title?: string;
      telephoneNumber?: string;
      extension?: string;
      faxNumber?: string;
      email?: string;
    };
  };
}

export interface SAMValidationResult {
  isValid: boolean;
  isRegistered: boolean;
  isActive: boolean;
  registrationStatus: string;
  expirationDate?: string;
  exclusionStatus: boolean;
  businessTypes: string[];
  naicsCodes: string[];
  lastUpdated: string;
  validationScore: number;
  riskFactors: {
    registrationExpiring: boolean;
    exclusionListed: boolean;
    incompleteRegistration: boolean;
    foreignEntity: boolean;
  };
  recommendations: string[];
}

export interface SupplierValidation {
  supplierId: string;
  supplierName: string;
  samValidation?: SAMValidationResult;
  validationDate: string;
  validationStatus: "pending" | "validated" | "failed" | "not_found";
  errorMessage?: string;
}

export enum DataSourceType {
  USER_INPUT = "user_input",
  USER_UPLOAD = "user_upload",
  TEMPLATE = "template",
  CALCULATED = "calculated",
  EXTERNAL_API = "external_api",
  SYSTEM_DEFAULT = "system_default",
}

export interface DataPoint<T = any> {
  value: T;
  source: DataSourceType;
  timestamp: string;
  validated: boolean;
  requiresValidation?: boolean;
  dependsOn?: string[];
  impacts?: string[];
  confidence?: number; // 0-1 for API data confidence
  lastUpdated?: string;
}

// Business entity types
export interface Product {
  id: string;
  sku: string;
  name: string;
  description: string;
  originalCost: number;
  newCost: number;
  quantity: number;
  tariffRate: number;
  marginImpact: number;
  htsCode?: string;
  supplier?: string;
  category?: string;
}

export interface Supplier {
  id: string;
  name: string;
  country: string;
  region: string;
  riskLevel: "low" | "medium" | "high";
  reliability: number;
  costEfficiency: number;
  tariffExposure: number;
}

export interface SupplierConcentration {
  supplierCount: number;
  topSupplierShare: number;
  geographicDistribution: Record<string, number>;
  riskScore: number;
}

export interface DepartmentHeadCount {
  [department: string]: number;
}

export interface WorkforceMetrics {
  totalHeadCount: number;
  departmentBreakdown: DepartmentHeadCount;
  averageWage: number;
  skillsGapAreas: string[];
  trainingNeeds: string[];
}

export interface AlertConfiguration {
  tariffThreshold: number;
  supplierRiskThreshold: number;
  emailNotifications: boolean;
  smsNotifications: boolean;
  alertFrequency: "immediate" | "daily" | "weekly";
}

export type RiskLevel = "low" | "medium" | "high";

export interface BusinessDataProfile {
  // Step 1: File Import Data
  importedProducts: DataPoint<Product[]>;
  fileMetadata: DataPoint<{
    fileName: string;
    fileSize: number;
    uploadDate: string;
    processingStatus: string;
  }>;

  // Step 2: Cost Calculator Results
  totalOriginalValue: DataPoint<number>;
  totalNewValue: DataPoint<number>;
  totalAnnualImpact: DataPoint<number>;
  averageTariffRate: DataPoint<number>;
  highImpactProducts: DataPoint<Product[]>;

  // Step 3: Supplier Diversification
  currentSuppliers: DataPoint<Supplier[]>;
  supplierConcentration: DataPoint<SupplierConcentration>;
  diversificationScore: DataPoint<number>;
  recommendedSuppliers: DataPoint<Supplier[]>;

  // Step 4: Supply Chain Planning
  inventoryOptimization: DataPoint<{
    recommendedStockLevels: Record<string, number>;
    leadTimeAdjustments: Record<string, number>;
    seasonalFactors: Record<string, number>;
  }>;
  scenarioResults: DataPoint<{
    bestCase: number;
    worstCase: number;
    mostLikely: number;
  }>;

  // Step 5: Workforce Planning (Critical Human Input Fields)
  currentHeadCount: DataPoint<number>;
  departmentBreakdown: DataPoint<DepartmentHeadCount>;
  averageWage: DataPoint<number>;
  workforceMetrics: DataPoint<WorkforceMetrics>;
  hiringPlans: DataPoint<{
    plannedHires: number;
    timeframe: string;
    departments: string[];
  }>;

  // Step 6: Alerts & Monitoring
  alertConfiguration: DataPoint<AlertConfiguration>;
  monitoringPreferences: DataPoint<{
    trackingFrequency: string;
    reportingSchedule: string;
    stakeholderNotifications: string[];
  }>;

  // Step 7: AI Recommendations
  riskTolerance: DataPoint<RiskLevel>;
  implementationTimeline: DataPoint<string>;
  budgetConstraints: DataPoint<{
    maxInvestment: number;
    paybackPeriod: number;
    priorityAreas: string[];
  }>;

  // Cross-cutting concerns
  businessProfile: DataPoint<{
    industry: string;
    companySize: string;
    annualRevenue: number;
    primaryMarkets: string[];
  }>;

  // SMB-specific data integration
  smbProfile: DataPoint<{
    businessClassification: "micro" | "small" | "medium" | "large";
    employeeCount: number;
    industryCode: string;
    geographicLocation: {
      country: string;
      state?: string;
      region: string;
    };
    procurementPatterns: {
      averageOrderValue: number;
      orderFrequency: "weekly" | "monthly" | "quarterly" | "annually";
      seasonalVariation: number;
      primarySupplierCountries: string[];
    };
    budgetConstraints: {
      cashFlowSensitivity: "high" | "medium" | "low";
      maxMonthlyImpact: number;
      emergencyReserves: number;
      creditAvailability: number;
    };
    riskProfile: {
      riskTolerance: "conservative" | "moderate" | "aggressive";
      diversificationLevel: number;
      complianceRequirements: string[];
    };
  }>;

  // SMB-specific risk factors
  smbRiskFactors: DataPoint<{
    cashFlowRisk: number;
    supplierConcentrationRisk: number;
    marketVolatilityRisk: number;
    complianceRisk: number;
    overallRiskScore: number;
    riskMitigationStrategies: string[];
  }>;

  // SMB-tailored recommendations
  smbRecommendations: DataPoint<{
    immediateActions: {
      priority: "critical" | "high" | "medium" | "low";
      action: string;
      estimatedCost: number;
      timeframe: string;
      expectedBenefit: string;
    }[];
    mediumTermStrategies: {
      strategy: string;
      investmentRequired: number;
      paybackPeriod: number;
      riskLevel: "low" | "medium" | "high";
    }[];
    longTermPlanning: {
      goal: string;
      milestones: string[];
      resourceRequirements: string[];
    }[];
  }>;

  // Data completeness tracking
  dataCompleteness: {
    totalFields: number;
    userProvidedFields: number;
    templateFields: number;
    calculatedFields: number;
    externalApiFields: number;
    completenessScore: number;
    lastCalculated: string;
  };
}

export interface ValidationResult {
  isValid: boolean;
  completeness: number;
  warnings: ValidationWarning[];
  errors: ValidationError[];
  canProceed: boolean;
  recommendedActions: string[];
  criticalFieldsMissing: string[];
  templateDataCount: number;
  userDataCount: number;
  dataQualityScore: number;
}

export interface ValidationWarning {
  type:
    | "TEMPLATE_DATA"
    | "STALE_DATA"
    | "MISSING_CRITICAL"
    | "LOW_CONFIDENCE"
    | "INCOMPLETE_PROFILE"
    | "USER_INPUT_REQUIRED"
    | "MISSING_USER_INPUT"
    | "USER_INPUT_NEEDED"
    | "MISSING_USER_DATA";
  severity: "LOW" | "MEDIUM" | "HIGH";
  field: string;
  message: string;
  impact: string;
  actionRequired: boolean;
  suggestedAction?: string;
}

export interface ValidationError {
  field: string;
  message: string;
  impact: string;
  actionRequired: boolean;
  blocksProceed: boolean;
}

// API Cache Types
export interface CachedAPIResponse {
  id: number;
  source: string;
  endpoint: string;
  data: any;
  data_period?: string;
  cached_at: string;
  expires_at?: string;
  metadata: {
    original_request?: any;
    response_size?: number;
    api_version?: string;
    data_quality?: number;
    attribution?: string;
  };
}

export interface CacheMetadata {
  source: string;
  cached_at: string;
  expires_at?: string;
  data_period?: string;
  is_cached: boolean;
  cache_age_hours?: number;
  data_attribution: string;
}

export interface APIDataWithCache<T = any> {
  data: T;
  cache_metadata: CacheMetadata;
  is_fresh: boolean;
  fallback_used: boolean;
}

// Data source summary for UI display
export interface DataSourceSummary {
  user: number;
  template: number;
  calculated: number;
  external: number;
  total: number;
  completenessPercentage: number;
}

// Enhanced Supplier Intelligence Types
export interface EnhancedSupplierIntelligence {
  supplierId: string;
  supplierName: string;
  country: string;
  region: string;

  // Multi-source validation
  samValidation?: SAMValidationResult;
  worldBankRisk?: CountryRiskProfile;
  tradeIntelligence?: {
    exportVolume: number;
    importVolume: number;
    tradeBalance: number;
    primaryProducts: string[];
    tradingPartners: string[];
    lastUpdated: string;
  };
  logisticsProfile?: {
    shippingCosts: number;
    transitTime: number;
    reliability: number;
    portEfficiency: number;
    lastUpdated: string;
  };

  // AI-powered risk assessment
  aiRiskAssessment?: {
    overallScore: number;
    riskFactors: {
      regulatory: number;
      financial: number;
      operational: number;
      geopolitical: number;
    };
    recommendations: string[];
    confidence: number;
    lastUpdated: string;
  };

  // Government contracting profile
  governmentContracting?: {
    isGovernmentContractor: boolean;
    contractingCapabilities: string[];
    setAsideEligibility: string[];
    pastPerformance: {
      contractCount: number;
      totalValue: number;
      averageRating: number;
    };
    opportunities?: GovernmentContractingOpportunity[];
  };

  // Comprehensive risk matrix
  riskMatrix?: {
    overallRiskScore: number;
    riskLevel: "low" | "medium" | "high" | "critical";
    riskFactors: {
      samCompliance: number;
      countryStability: number;
      tradeReliability: number;
      logisticsRisk: number;
      regulatoryRisk: number;
    };
    mitigationStrategies: string[];
    monitoringRecommendations: string[];
  };

  lastUpdated: string;
  dataQuality: {
    completeness: number;
    accuracy: number;
    freshness: number;
    sources: string[];
  };
}

// Government Contracting Opportunity
export interface GovernmentContractingOpportunity {
  opportunityId: string;
  title: string;
  agency: string;
  naicsCode: string;
  setAsideType?: string;
  estimatedValue: number;
  bidDeadline: string;
  description: string;
  requirements: string[];

  // SMB-specific analysis
  smbSuitability: {
    score: number;
    reasons: string[];
    recommendedActions: string[];
    competitiveAdvantages: string[];
  };

  // Tariff impact analysis
  tariffImpact?: {
    affectedProducts: string[];
    estimatedImpact: number;
    mitigationStrategies: string[];
    competitiveImplications: string[];
  };

  // Federal Register policy context
  policyContext?: {
    relatedDocuments: string[];
    policyChanges: string[];
    complianceRequirements: string[];
  };
}

// Federal Register Document
export interface FederalRegisterDocument {
  abstract: string;
  action: string;
  agencies: {
    id: number;
    name: string;
    raw_name: string;
  }[];
  body_html_url: string;
  citation: string;
  comment_url?: string;
  comments_close_on?: string;
  correction_of?: string;
  dates: string;
  document_number: string;
  effective_on?: string;
  end_page: number;
  excerpts: string;
  executive_order_notes?: string;
  executive_order_number?: string;
  html_url: string;
  json_url: string;
  mods_url: string;
  pdf_url: string;
  president?: {
    identifier: string;
    name: string;
  };
  proclamation_number?: string;
  public_inspection_pdf_url?: string;
  publication_date: string;
  raw_text_url: string;
  regulation_id_number_info: {
    regulation_id_number?: string;
  }[];
  regulations_dot_gov_info?: {
    docket_id?: string;
    regulation_id_number?: string;
  };
  significant: boolean;
  signing_date?: string;
  start_page: number;
  subtype: string;
  title: string;
  type: string;
  volume: number;

  // Analysis fields
  relevanceScore?: number;
  impactAssessment?: {
    affectedIndustries: string[];
    estimatedImpact: string;
    timeframe: string;
  };
  smbImplications?: {
    opportunities: string[];
    challenges: string[];
    actionItems: string[];
  };
}

// Multi-Source Risk Assessment
export interface MultiSourceRiskAssessment {
  supplierId: string;
  supplierName: string;
  assessmentDate: string;

  // Individual source scores
  sourceScores: {
    samGov: {
      score: number;
      status: "compliant" | "non-compliant" | "excluded" | "unknown";
      issues: string[];
    };
    worldBank: {
      countryRisk: number;
      economicStability: number;
      politicalStability: number;
      businessEnvironment: number;
    };
    tradeData: {
      tradeReliability: number;
      volumeStability: number;
      partnerDiversification: number;
    };
    logistics: {
      shippingReliability: number;
      costStability: number;
      transitTimeConsistency: number;
    };
    regulatory: {
      complianceHistory: number;
      policyStability: number;
      regulatoryBurden: number;
    };
  };

  // Composite risk score
  compositeRisk: {
    overallScore: number;
    riskLevel: "low" | "medium" | "high" | "critical";
    confidence: number;
    methodology: string;
  };

  // AI-generated insights
  aiInsights: {
    keyRiskFactors: string[];
    mitigationStrategies: string[];
    monitoringRecommendations: string[];
    alternativeSuppliers?: string[];
  };

  // SMB-specific considerations
  smbConsiderations: {
    cashFlowImpact: number;
    resourceRequirements: string[];
    scalabilityFactors: string[];
    competitiveImplications: string[];
  };
}

// SMB Government Market Intelligence
export interface SMBGovernmentMarketIntelligence {
  businessProfile: {
    businessSize: "micro" | "small" | "medium";
    naicsCodes: string[];
    certifications: string[];
    capabilities: string[];
  };

  marketOpportunities: {
    setAsideOpportunities: GovernmentContractingOpportunity[];
    competitiveOpportunities: GovernmentContractingOpportunity[];
    partneringOpportunities: {
      primeContractors: string[];
      subcontractingOpportunities: string[];
      jointVentureOptions: string[];
    };
  };

  policyIntelligence: {
    relevantPolicies: FederalRegisterDocument[];
    upcomingChanges: {
      policyChange: string;
      effectiveDate: string;
      impact: string;
      actionRequired: string[];
    }[];
    complianceRequirements: {
      requirement: string;
      deadline?: string;
      priority: "high" | "medium" | "low";
      resources: string[];
    }[];
  };

  competitiveIntelligence: {
    marketSize: number;
    competitorCount: number;
    averageContractValue: number;
    successFactors: string[];
    barriers: string[];
  };

  recommendations: {
    immediateActions: {
      action: string;
      priority: "critical" | "high" | "medium" | "low";
      timeframe: string;
      resources: string[];
      expectedOutcome: string;
    }[];
    strategicInitiatives: {
      initiative: string;
      timeline: string;
      investment: number;
      expectedReturn: string;
      riskLevel: "low" | "medium" | "high";
    }[];
  };

  lastUpdated: string;
}

// Step-specific validation requirements
export interface StepValidationConfig {
  requiredFields: string[];
  criticalFields: string[];
  minimumCompleteness: number;
  allowTemplateData: boolean;
  requiresHumanInput: string[];
}

export const STEP_VALIDATION_CONFIG: Record<string, StepValidationConfig> = {
  "file-import": {
    requiredFields: ["importedProducts", "fileMetadata"],
    criticalFields: ["importedProducts"],
    minimumCompleteness: 80,
    allowTemplateData: false,
    requiresHumanInput: [],
  },
  "tariff-analysis": {
    requiredFields: [
      "totalOriginalValue",
      "totalNewValue",
      "totalAnnualImpact",
    ],
    criticalFields: ["totalAnnualImpact", "averageTariffRate"],
    minimumCompleteness: 70,
    allowTemplateData: true,
    requiresHumanInput: [],
  },
  "supplier-diversification": {
    requiredFields: ["currentSuppliers", "supplierConcentration"],
    criticalFields: ["diversificationScore"],
    minimumCompleteness: 60,
    allowTemplateData: true,
    requiresHumanInput: [],
  },
  "supply-chain-planning": {
    requiredFields: ["inventoryOptimization", "scenarioResults"],
    criticalFields: ["scenarioResults"],
    minimumCompleteness: 60,
    allowTemplateData: true,
    requiresHumanInput: [],
  },
  "workforce-planning": {
    requiredFields: ["currentHeadCount", "departmentBreakdown", "averageWage"],
    criticalFields: ["currentHeadCount", "departmentBreakdown", "averageWage"],
    minimumCompleteness: 100, // Phase 2: Requires 100% real data
    allowTemplateData: false,
    requiresHumanInput: [
      "currentHeadCount",
      "departmentBreakdown",
      "averageWage",
    ],
  },
  "alerts-setup": {
    requiredFields: ["alertConfiguration"],
    criticalFields: ["alertConfiguration"],
    minimumCompleteness: 70,
    allowTemplateData: true,
    requiresHumanInput: ["alertConfiguration"],
  },
  "ai-recommendations": {
    requiredFields: [
      "riskTolerance",
      "implementationTimeline",
      "budgetConstraints",
    ],
    criticalFields: [
      "riskTolerance",
      "implementationTimeline",
      "budgetConstraints",
    ],
    minimumCompleteness: 90, // Phase 2: Higher threshold for personalized AI
    allowTemplateData: false,
    requiresHumanInput: [
      "riskTolerance",
      "implementationTimeline",
      "budgetConstraints",
    ],
  },
};
