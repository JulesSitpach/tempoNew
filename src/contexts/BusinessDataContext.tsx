import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { supabase } from '@/lib/supabase';

export interface BusinessProfile {
  companyName: string;
  industry: string;
  annualRevenue: number;
  employeeCount: number;
  primaryMarkets: string[];
  currentSuppliers: number;
  averageOrderValue: number;
  importPercentage: number;
  primaryProducts: string[];
  mainSupplierCountries: string[];
  riskTolerance: 'low' | 'medium' | 'high';
  preferredCurrency: 'USD' | 'MXN' | 'EUR';
  businessGoals: string[];
}

export interface ImportData {
  hsCode: string;
  productDescription: string;
  supplierCountry: string;
  annualVolume: number;
  averageUnitCost: number;
  currentTariffRate: number;
  lastUpdated: Date;
}

export interface RiskAnalysis {
  supplierConcentration: number;
  countryRisk: { [country: string]: number };
  currencyExposure: number;
  policyRisk: number;
  overallRisk: 'low' | 'medium' | 'high';
  riskFactors: string[];
  mitigationSuggestions: string[];
}

export interface BusinessDataContextType {
  // Profile Management
  profile: BusinessProfile;
  updateProfile: (updates: Partial<BusinessProfile>) => Promise<void>;
  resetProfile: () => void;
  isProfileComplete: boolean;
  getCompletionPercentage: () => number;
  
  // Import Data Management
  importData: ImportData[];
  addImportData: (data: ImportData) => Promise<void>;
  updateImportData: (hsCode: string, updates: Partial<ImportData>) => Promise<void>;
  removeImportData: (hsCode: string) => Promise<void>;
  
  // Risk Analysis
  riskAnalysis: RiskAnalysis | null;
  updateRiskAnalysis: () => Promise<void>;
  
  // Data Persistence
  saveToCloud: () => Promise<void>;
  loadFromCloud: () => Promise<void>;
  lastSyncTime: Date | null;
  
  // Analytics
  getDataCompleteness: () => { percentage: number; missingFields: string[] };
  getTotalImportValue: () => number;
  getSupplierDiversityScore: () => number;
}

const defaultProfile: BusinessProfile = {
  companyName: "",
  industry: "",
  annualRevenue: 0,
  employeeCount: 0,
  primaryMarkets: [],
  currentSuppliers: 0,
  averageOrderValue: 0,
  importPercentage: 0,
  primaryProducts: [],
  mainSupplierCountries: [],
  riskTolerance: 'medium',
  preferredCurrency: 'USD',
  businessGoals: [],
};

const BusinessDataContext = createContext<BusinessDataContextType | undefined>(undefined);

export const useBusinessData = () => {
  const context = useContext(BusinessDataContext);
  if (context === undefined) {
    throw new Error("useBusinessData must be used within a BusinessDataProvider");
  }
  return context;
};

interface BusinessDataProviderProps {
  children: React.ReactNode;
}

export const BusinessDataProvider: React.FC<BusinessDataProviderProps> = ({ children }) => {
  const [profile, setProfile] = useState<BusinessProfile>(defaultProfile);
  const [importData, setImportData] = useState<ImportData[]>([]);
  const [riskAnalysis, setRiskAnalysis] = useState<RiskAnalysis | null>(null);
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);

  // Profile Management
  const updateProfile = useCallback(async (updates: Partial<BusinessProfile>) => {
    setProfile(prev => ({ ...prev, ...updates }));
    
    // Auto-save to localStorage for immediate persistence
    const updatedProfile = { ...profile, ...updates };
    localStorage.setItem('smbTariff_businessProfile', JSON.stringify(updatedProfile));
  }, [profile]);

  const resetProfile = useCallback(() => {
    setProfile(defaultProfile);
    setImportData([]);
    setRiskAnalysis(null);
    localStorage.removeItem('smbTariff_businessProfile');
    localStorage.removeItem('smbTariff_importData');
  }, []);

  const isProfileComplete = React.useMemo(() => {
    return profile.companyName.length > 0 &&
           profile.industry.length > 0 &&
           profile.annualRevenue > 0 &&
           profile.employeeCount > 0 &&
           profile.primaryMarkets.length > 0 &&
           profile.primaryProducts.length > 0;
  }, [profile]);

  const getCompletionPercentage = useCallback(() => {
    const requiredFields = [
      'companyName',
      'industry', 
      'annualRevenue',
      'employeeCount',
      'primaryMarkets',
      'primaryProducts',
      'mainSupplierCountries'
    ];
    
    let completedFields = 0;
    if (profile.companyName.length > 0) completedFields++;
    if (profile.industry.length > 0) completedFields++;
    if (profile.annualRevenue > 0) completedFields++;
    if (profile.employeeCount > 0) completedFields++;
    if (profile.primaryMarkets.length > 0) completedFields++;
    if (profile.primaryProducts.length > 0) completedFields++;
    if (profile.mainSupplierCountries.length > 0) completedFields++;
    
    return Math.round((completedFields / requiredFields.length) * 100);
  }, [profile]);

  // Import Data Management
  const addImportData = useCallback(async (data: ImportData) => {
    setImportData(prev => {
      const existing = prev.find(item => item.hsCode === data.hsCode);
      if (existing) {
        return prev.map(item => item.hsCode === data.hsCode ? data : item);
      }
      return [...prev, data];
    });
    
    // Auto-save to localStorage
    const updatedData = [...importData, data];
    localStorage.setItem('smbTariff_importData', JSON.stringify(updatedData));
  }, [importData]);

  const updateImportData = useCallback(async (hsCode: string, updates: Partial<ImportData>) => {
    setImportData(prev => prev.map(item => 
      item.hsCode === hsCode ? { ...item, ...updates, lastUpdated: new Date() } : item
    ));
    
    // Auto-save to localStorage
    const updatedData = importData.map(item => 
      item.hsCode === hsCode ? { ...item, ...updates, lastUpdated: new Date() } : item
    );
    localStorage.setItem('smbTariff_importData', JSON.stringify(updatedData));
  }, [importData]);

  const removeImportData = useCallback(async (hsCode: string) => {
    setImportData(prev => prev.filter(item => item.hsCode !== hsCode));
    
    // Auto-save to localStorage
    const updatedData = importData.filter(item => item.hsCode !== hsCode);
    localStorage.setItem('smbTariff_importData', JSON.stringify(updatedData));
  }, [importData]);

  // Risk Analysis
  const updateRiskAnalysis = useCallback(async () => {
    if (importData.length === 0) return;

    // Calculate supplier concentration risk
    const supplierCountries = importData.reduce((acc, item) => {
      acc[item.supplierCountry] = (acc[item.supplierCountry] || 0) + item.annualVolume * item.averageUnitCost;
      return acc;
    }, {} as { [country: string]: number });

    const totalImportValue = Object.values(supplierCountries).reduce((sum, value) => sum + value, 0);
    const concentrationScores = Object.values(supplierCountries).map(value => value / totalImportValue);
    const supplierConcentration = Math.max(...concentrationScores) * 100;

    // Basic country risk scoring (simplified)
    const countryRisk: { [country: string]: number } = {};
    Object.keys(supplierCountries).forEach(country => {
      // Simplified risk scoring - in production this would use real risk data
      const baseRisk = country === 'China' ? 70 : country === 'Mexico' ? 30 : 50;
      countryRisk[country] = baseRisk;
    });

    // Calculate currency exposure
    const usdExposure = importData.filter(item => item.supplierCountry !== 'USA').length / importData.length * 100;

    // Overall risk assessment
    const overallRiskScore = (supplierConcentration + Math.max(...Object.values(countryRisk)) + usdExposure) / 3;
    const overallRisk = overallRiskScore > 60 ? 'high' : overallRiskScore > 40 ? 'medium' : 'low';

    const analysis: RiskAnalysis = {
      supplierConcentration,
      countryRisk,
      currencyExposure: usdExposure,
      policyRisk: Math.max(...Object.values(countryRisk)),
      overallRisk,
      riskFactors: [
        ...(supplierConcentration > 50 ? ['High supplier concentration'] : []),
        ...(usdExposure > 70 ? ['High currency exposure'] : []),
        ...(Object.values(countryRisk).some(risk => risk > 60) ? ['High country risk exposure'] : [])
      ],
      mitigationSuggestions: [
        ...(supplierConcentration > 50 ? ['Diversify supplier base across multiple countries'] : []),
        ...(usdExposure > 70 ? ['Consider currency hedging strategies'] : []),
        ...(Object.values(countryRisk).some(risk => risk > 60) ? ['Evaluate alternative sourcing countries'] : [])
      ]
    };

    setRiskAnalysis(analysis);
  }, [importData]);

  // Data Persistence
  const saveToCloud = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      await supabase.from('business_profiles').upsert({
        user_id: user.id,
        profile: profile,
        import_data: importData,
        risk_analysis: riskAnalysis,
        updated_at: new Date().toISOString()
      });

      setLastSyncTime(new Date());
    } catch (error) {
      console.error('Error saving to cloud:', error);
    }
  }, [profile, importData, riskAnalysis]);

  const loadFromCloud = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('business_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error || !data) return;

      setProfile(data.profile || defaultProfile);
      setImportData(data.import_data || []);
      setRiskAnalysis(data.risk_analysis);
      setLastSyncTime(new Date(data.updated_at));
    } catch (error) {
      console.error('Error loading from cloud:', error);
    }
  }, []);

  // Analytics
  const getDataCompleteness = useCallback(() => {
    const profileFields = Object.keys(defaultProfile);
    const completedProfileFields = profileFields.filter(field => {
      const value = profile[field as keyof BusinessProfile];
      return Array.isArray(value) ? value.length > 0 : Boolean(value);
    });

    const missingFields = profileFields.filter(field => {
      const value = profile[field as keyof BusinessProfile];
      return Array.isArray(value) ? value.length === 0 : !Boolean(value);
    });

    const profileCompleteness = (completedProfileFields.length / profileFields.length) * 100;
    const dataCompleteness = importData.length > 0 ? 100 : 0;
    
    const overallPercentage = (profileCompleteness * 0.7) + (dataCompleteness * 0.3);

    return {
      percentage: Math.round(overallPercentage),
      missingFields: missingFields.map(field => field.replace(/([A-Z])/g, ' $1').toLowerCase())
    };
  }, [profile, importData]);

  const getTotalImportValue = useCallback(() => {
    return importData.reduce((total, item) => total + (item.annualVolume * item.averageUnitCost), 0);
  }, [importData]);

  const getSupplierDiversityScore = useCallback(() => {
    if (importData.length === 0) return 0;
    
    const uniqueCountries = new Set(importData.map(item => item.supplierCountry));
    const uniqueSuppliers = profile.currentSuppliers || 1;
    
    // Score based on country diversity and supplier count
    const countryScore = Math.min(uniqueCountries.size * 20, 60);
    const supplierScore = Math.min(uniqueSuppliers * 5, 40);
    
    return Math.min(countryScore + supplierScore, 100);
  }, [importData, profile.currentSuppliers]);

  // Load data on mount
  useEffect(() => {
    // Load from localStorage immediately
    const savedProfile = localStorage.getItem('smbTariff_businessProfile');
    const savedImportData = localStorage.getItem('smbTariff_importData');
    
    if (savedProfile) {
      try {
        setProfile(JSON.parse(savedProfile));
      } catch (error) {
        console.error('Error parsing saved profile:', error);
      }
    }
    
    if (savedImportData) {
      try {
        setImportData(JSON.parse(savedImportData));
      } catch (error) {
        console.error('Error parsing saved import data:', error);
      }
    }

    // Then try to load from cloud
    loadFromCloud();
  }, [loadFromCloud]);

  // Auto-update risk analysis when import data changes
  useEffect(() => {
    if (importData.length > 0) {
      updateRiskAnalysis();
    }
  }, [importData, updateRiskAnalysis]);

  // Auto-save to cloud periodically
  useEffect(() => {
    const interval = setInterval(() => {
      if (isProfileComplete || importData.length > 0) {
        saveToCloud();
      }
    }, 5 * 60 * 1000); // Every 5 minutes

    return () => clearInterval(interval);
  }, [isProfileComplete, importData.length, saveToCloud]);

  const value: BusinessDataContextType = {
    profile,
    updateProfile,
    resetProfile,
    isProfileComplete,
    getCompletionPercentage,
    importData,
    addImportData,
    updateImportData,
    removeImportData,
    riskAnalysis,
    updateRiskAnalysis,
    saveToCloud,
    loadFromCloud,
    lastSyncTime,
    getDataCompleteness,
    getTotalImportValue,
    getSupplierDiversityScore,
  };

  return (
    <BusinessDataContext.Provider value={value}>
      {children}
    </BusinessDataContext.Provider>
  );
};
