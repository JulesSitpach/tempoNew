import { WorkflowStep } from "@/contexts/WorkflowContext";
import { supabase } from "@/lib/supabase";

export interface WorkflowSession {
  id: string;
  user_id?: string;
  session_name: string;
  current_step: WorkflowStep;
  created_at: string;
  updated_at: string;
  last_accessed: string;
  is_demo: boolean;
}

export interface WorkflowStepData {
  id: string;
  session_id: string;
  step_name: string;
  data: any;
  data_sources: Record<string, any>;
  validation: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface BusinessProfile {
  id: string;
  user_id: string;
  company_name?: string;
  industry?: string;
  annual_revenue_range?: string;
  employee_count_range?: string;
  primary_countries: string[];
  business_model?: string;
  profile_data: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface AnalysisResult {
  id: string;
  session_id: string;
  analysis_type: "tariff" | "supplier" | "supply-chain" | "workforce";
  input_hash: string;
  results: any;
  computation_time_ms?: number;
  api_calls_made: any[];
  created_at: string;
  expires_at: string;
}

export interface SupplierCacheEntry {
  id: string;
  supplier_name: string;
  country: string;
  sam_data?: any;
  risk_assessment?: any;
  trade_data?: any;
  last_validated: string;
  cache_expires: string;
  created_at: string;
}

export class WorkflowDatabaseService {
  // ============================================================================
  // WORKFLOW SESSION MANAGEMENT
  // ============================================================================

  static async createSession(
    sessionName = "Untitled Analysis",
    isDemo = false
  ): Promise<WorkflowSession | null> {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      const { data, error } = await supabase
        .from("workflow_sessions")
        .insert({
          session_name: sessionName,
          user_id: user?.id,
          is_demo: isDemo || !user?.id,
          current_step: "welcome",
        })
        .select()
        .single();

      if (error) {
        console.error("Error creating workflow session:", error);
        return null;
      }

      return data;
    } catch (error) {
      console.error("Error creating workflow session:", error);
      return null;
    }
  }

  static async getCurrentSession(): Promise<WorkflowSession | null> {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      const { data, error } = await supabase
        .from("workflow_sessions")
        .select("*")
        .or(`user_id.eq.${user?.id},is_demo.eq.true`)
        .order("last_accessed", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error("Error getting current session:", error);
        return null;
      }

      // Update last_accessed
      if (data) {
        await supabase
          .from("workflow_sessions")
          .update({ last_accessed: new Date().toISOString() })
          .eq("id", data.id);
      }

      return data;
    } catch (error) {
      console.error("Error getting current session:", error);
      return null;
    }
  }

  static async updateCurrentStep(
    sessionId: string,
    step: WorkflowStep
  ): Promise<boolean> {
    try {
      const { error } = await supabase
        .from("workflow_sessions")
        .update({
          current_step: step,
          updated_at: new Date().toISOString(),
          last_accessed: new Date().toISOString(),
        })
        .eq("id", sessionId);

      if (error) {
        console.error("Error updating current step:", error);
        return false;
      }

      return true;
    } catch (error) {
      console.error("Error updating current step:", error);
      return false;
    }
  }

  // ============================================================================
  // WORKFLOW DATA MANAGEMENT
  // ============================================================================

  static async saveStepData(
    sessionId: string,
    stepName: string,
    data: any,
    dataSources: Record<string, any> = {},
    validation: Record<string, any> = {}
  ): Promise<boolean> {
    try {
      const { error } = await supabase.from("workflow_data").upsert({
        session_id: sessionId,
        step_name: stepName,
        data,
        data_sources: dataSources,
        validation,
        updated_at: new Date().toISOString(),
      });

      if (error) {
        console.error("Error saving step data:", error);
        return false;
      }

      return true;
    } catch (error) {
      console.error("Error saving step data:", error);
      return false;
    }
  }

  static async getStepData(
    sessionId: string,
    stepName: string
  ): Promise<WorkflowStepData | null> {
    try {
      const { data, error } = await supabase
        .from("workflow_data")
        .select("*")
        .eq("session_id", sessionId)
        .eq("step_name", stepName)
        .maybeSingle();

      if (error) {
        console.error("Error getting step data:", error);
        return null;
      }

      return data;
    } catch (error) {
      console.error("Error getting step data:", error);
      return null;
    }
  }

  static async getAllStepData(
    sessionId: string
  ): Promise<Record<string, WorkflowStepData>> {
    try {
      const { data, error } = await supabase
        .from("workflow_data")
        .select("*")
        .eq("session_id", sessionId);

      if (error) {
        console.error("Error getting all step data:", error);
        return {};
      }

      // Convert array to object keyed by step_name
      const stepDataMap: Record<string, WorkflowStepData> = {};
      data?.forEach(item => {
        stepDataMap[item.step_name] = item;
      });

      return stepDataMap;
    } catch (error) {
      console.error("Error getting all step data:", error);
      return {};
    }
  }

  // ============================================================================
  // ANALYSIS RESULTS CACHING
  // ============================================================================

  static async getCachedAnalysis(
    sessionId: string,
    analysisType: "tariff" | "supplier" | "supply-chain" | "workforce",
    inputHash: string
  ): Promise<AnalysisResult | null> {
    try {
      const { data, error } = await supabase
        .from("analysis_results")
        .select("*")
        .eq("session_id", sessionId)
        .eq("analysis_type", analysisType)
        .eq("input_hash", inputHash)
        .gt("expires_at", new Date().toISOString())
        .maybeSingle();

      if (error) {
        console.error("Error getting cached analysis:", error);
        return null;
      }

      return data;
    } catch (error) {
      console.error("Error getting cached analysis:", error);
      return null;
    }
  }

  static async saveAnalysisResult(
    sessionId: string,
    analysisType: "tariff" | "supplier" | "supply-chain" | "workforce",
    inputHash: string,
    results: any,
    apiCallsMade: any[] = [],
    computationTimeMs?: number
  ): Promise<boolean> {
    try {
      const { error } = await supabase.from("analysis_results").upsert({
        session_id: sessionId,
        analysis_type: analysisType,
        input_hash: inputHash,
        results,
        api_calls_made: apiCallsMade,
        computation_time_ms: computationTimeMs,
        expires_at: new Date(
          Date.now() + 7 * 24 * 60 * 60 * 1000
        ).toISOString(), // 7 days
      });

      if (error) {
        console.error("Error saving analysis result:", error);
        return false;
      }

      return true;
    } catch (error) {
      console.error("Error saving analysis result:", error);
      return false;
    }
  }

  // ============================================================================
  // SUPPLIER CACHING
  // ============================================================================

  static async getCachedSupplier(
    supplierName: string,
    country: string
  ): Promise<SupplierCacheEntry | null> {
    try {
      const { data, error } = await supabase
        .from("supplier_cache")
        .select("*")
        .eq("supplier_name", supplierName)
        .eq("country", country)
        .gt("cache_expires", new Date().toISOString())
        .maybeSingle();

      if (error) {
        console.error("Error getting cached supplier:", error);
        return null;
      }

      return data;
    } catch (error) {
      console.error("Error getting cached supplier:", error);
      return null;
    }
  }

  static async cacheSupplierData(
    supplierName: string,
    country: string,
    samData?: any,
    riskAssessment?: any,
    tradeData?: any
  ): Promise<boolean> {
    try {
      const { error } = await supabase.from("supplier_cache").upsert({
        supplier_name: supplierName,
        country: country,
        sam_data: samData,
        risk_assessment: riskAssessment,
        trade_data: tradeData,
        last_validated: new Date().toISOString(),
        cache_expires: new Date(
          Date.now() + 30 * 24 * 60 * 60 * 1000
        ).toISOString(), // 30 days
      });

      if (error) {
        console.error("Error caching supplier data:", error);
        return false;
      }

      return true;
    } catch (error) {
      console.error("Error caching supplier data:", error);
      return false;
    }
  }

  // ============================================================================
  // API RESPONSE CACHING
  // ============================================================================

  static async getCachedAPIResponse(
    source: string,
    endpoint: string
  ): Promise<any | null> {
    try {
      const { data, error } = await supabase
        .from("api_cache")
        .select("*")
        .eq("source", source)
        .eq("endpoint", endpoint)
        .gt("expires_at", new Date().toISOString())
        .maybeSingle();

      if (error) {
        console.error("Error getting cached API response:", error);
        return null;
      }

      return data?.data;
    } catch (error) {
      console.error("Error getting cached API response:", error);
      return null;
    }
  }

  static async cacheAPIResponse(
    source: string,
    endpoint: string,
    responseData: any,
    expiresInHours = 24,
    dataPeriod?: string,
    metadata: Record<string, any> = {}
  ): Promise<boolean> {
    try {
      const { error } = await supabase.from("api_cache").upsert({
        source,
        endpoint,
        data: responseData,
        data_period: dataPeriod,
        expires_at: new Date(
          Date.now() + expiresInHours * 60 * 60 * 1000
        ).toISOString(),
        metadata,
      });

      if (error) {
        console.error("Error caching API response:", error);
        return false;
      }

      return true;
    } catch (error) {
      console.error("Error caching API response:", error);
      return false;
    }
  }

  // ============================================================================
  // BUSINESS PROFILE MANAGEMENT
  // ============================================================================

  static async getBusinessProfile(): Promise<BusinessProfile | null> {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user?.id) return null;

      const { data, error } = await supabase
        .from("business_profiles")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) {
        console.error("Error getting business profile:", error);
        return null;
      }

      return data;
    } catch (error) {
      console.error("Error getting business profile:", error);
      return null;
    }
  }

  static async saveBusinessProfile(
    profileData: Partial<BusinessProfile>
  ): Promise<boolean> {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user?.id) return false;

      const { error } = await supabase.from("business_profiles").upsert({
        user_id: user.id,
        ...profileData,
        updated_at: new Date().toISOString(),
      });

      if (error) {
        console.error("Error saving business profile:", error);
        return false;
      }

      return true;
    } catch (error) {
      console.error("Error saving business profile:", error);
      return false;
    }
  }
  // ============================================================================
  // SMART CACHING FUNCTIONS
  // ============================================================================

  static async getCachedAnalysisOrCompute<T>(
    sessionId: string,
    analysisType: "tariff" | "supplier" | "supply-chain" | "workforce",
    inputData: any,
    computeFn: () => Promise<T>
  ): Promise<{ result: T; fromCache: boolean; computationTime?: number }> {
    const startTime = Date.now();

    try {
      // Generate hash for input data
      const inputHash = this.generateDataHash(inputData);

      // Check for cached result
      const cached = await this.getCachedAnalysis(
        sessionId,
        analysisType,
        inputHash
      );

      if (cached) {
        console.log(`🎯 Using cached ${analysisType} analysis`);
        return {
          result: cached.results,
          fromCache: true,
        };
      }

      // Compute new result
      console.log(`🔄 Computing new ${analysisType} analysis...`);
      const result = await computeFn();
      const computationTime = Date.now() - startTime;

      // Cache the result
      await this.saveAnalysisResult(
        sessionId,
        analysisType,
        inputHash,
        result,
        [], // API calls would be tracked separately
        computationTime
      );

      console.log(
        `✅ Computed and cached ${analysisType} analysis in ${computationTime}ms`
      );

      return {
        result,
        fromCache: false,
        computationTime,
      };
    } catch (error) {
      console.error(`❌ Error in cached analysis for ${analysisType}:`, error);
      // Fallback to direct computation
      const result = await computeFn();
      return {
        result,
        fromCache: false,
        computationTime: Date.now() - startTime,
      };
    }
  }

  static async getCachedSupplierOrFetch(
    supplierName: string,
    country: string,
    fetchFn: () => Promise<any>
  ): Promise<{ data: any; fromCache: boolean }> {
    try {
      // Check cache first
      const cached = await this.getCachedSupplier(supplierName, country);

      if (cached) {
        console.log(
          `🎯 Using cached supplier data for ${supplierName} (${country})`
        );
        return {
          data: {
            sam_data: cached.sam_data,
            risk_assessment: cached.risk_assessment,
            trade_data: cached.trade_data,
          },
          fromCache: true,
        };
      }

      // Fetch new data
      console.log(
        `🔄 Fetching new supplier data for ${supplierName} (${country})...`
      );
      const freshData = await fetchFn();

      // Cache the result
      await this.cacheSupplierData(
        supplierName,
        country,
        freshData.sam_data,
        freshData.risk_assessment,
        freshData.trade_data
      );

      console.log(`✅ Fetched and cached supplier data for ${supplierName}`);

      return {
        data: freshData,
        fromCache: false,
      };
    } catch (error) {
      console.error(
        `❌ Error in cached supplier fetch for ${supplierName}:`,
        error
      );
      // Fallback to direct fetch
      const data = await fetchFn();
      return {
        data,
        fromCache: false,
      };
    }
  }

  // ============================================================================
  // UTILITY FUNCTIONS
  // ============================================================================

  static generateDataHash(data: any): string {
    // Simple hash function for data comparison
    return btoa(JSON.stringify(data))
      .replace(/[^a-zA-Z0-9]/g, "")
      .substring(0, 32);
  }

  static async cleanupExpiredData(): Promise<void> {
    try {
      const now = new Date().toISOString();

      // Clean up expired analysis results
      await supabase.from("analysis_results").delete().lt("expires_at", now);

      // Clean up expired supplier cache
      await supabase.from("supplier_cache").delete().lt("cache_expires", now);

      // Clean up expired API cache
      await supabase.from("api_cache").delete().lt("expires_at", now);
    } catch (error) {
      console.error("Error cleaning up expired data:", error);
    }
  }
}
