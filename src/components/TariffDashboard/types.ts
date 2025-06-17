// Types and interfaces for the Tariff Impact Dashboard

export interface EnhancedProductData {
  id: string;
  sku: string;
  description: string;
  originalCost: number;
  newCost: number;
  tariffRate: number;
  marginImpact: number;
  quantity: number;
  totalOriginalCost: number;
  totalNewCost: number;
  totalImpact: number;
  htsCode?: string;
  htsConfidence?: number;
  lastUpdated: string;
  dataSource: string;
}

export interface TariffImpactDashboardProps {
  data?: any[];
  onExport?: (format: string) => void;
  language?: "en" | "es";
  enableRealTimeUpdates?: boolean;
  importedFileData?: any;
}

export interface DataValidation {
  isValid: boolean;
  completeness: number;
  criticalFieldsMissing: string[];
  templateDataCount: number;
  userDataCount: number;
  warnings: string[];
}

export interface DataSourceSummary {
  user: number;
  template: number;
  calculated: number;
  external: number;
}

export interface CashFlowProjection {
  period: string;
  originalCost: number;
  newCost: number;
  impact: number;
  cumulativeImpact: number;
}
