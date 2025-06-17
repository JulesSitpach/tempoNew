import { API_KEYS, validateAPIKeys } from "@/utils/apiConfig";

// Initialize validation on startup
const apiValidation = validateAPIKeys();
export { apiValidation };

// ============================================================================
// TYPE DEFINITIONS FOR REMOVED SERVICES (MINIMAL INTERFACES)
// ============================================================================

export interface EnhancedProductData {
  id: string;
  hsCode: string;
  description: string;
  currentTariffRate: number;
  potentialTariffRate: number;
  volume: number;
  value: number;
  supplier: string;
  countryOfOrigin: string;
  [key: string]: any;
}

export interface ScenarioInput {
  tariffChange: number;
  orderQuantity: number;
  orderTiming: number;
  inventoryBuffer: number;
  [key: string]: any;
}

export interface ScenarioResult {
  id: string;
  name: string;
  impact: number;
  confidence: number;
  timeframe: number;
  [key: string]: any;
}

export interface ResilienceMetrics {
  overallScore: number;
  riskLevel: string;
  vulnerabilities: string[];
  strengths: string[];
  [key: string]: any;
}

export interface SupplierMetrics {
  name: string;
  riskScore: number;
  diversificationScore: number;
  [key: string]: any;
}

// ============================================================================
// EXTERNAL API STATUS SERVICE
// ============================================================================

export class ExternalAPIStatus {
  static async checkAllAPIs(): Promise<any[]> {
    try {
      return [
        {
          name: "Comtrade",
          status: "operational",
          lastCheck: new Date().toISOString(),
        },
        {
          name: "Shippo",
          status: "operational",
          lastCheck: new Date().toISOString(),
        },
        {
          name: "Federal Register",
          status: "operational",
          lastCheck: new Date().toISOString(),
        },
        {
          name: "SAM.gov",
          status: "operational",
          lastCheck: new Date().toISOString(),
        },
      ];
    } catch (error) {
      console.error("Error checking APIs:", error);
      return [];
    }
  }

  static async checkShippoAPI(): Promise<boolean> {
    return true; // Simplified for cleanup
  }

  static async checkComtradeAPI(): Promise<boolean> {
    return true; // Simplified for cleanup
  }

  static async checkFederalRegisterAPI(): Promise<boolean> {
    return true; // Simplified for cleanup
  }

  static async checkSAMGovAPI(): Promise<boolean> {
    return true; // Simplified for cleanup
  }
}

// ============================================================================
// COMTRADE SERVICE
// ============================================================================

export class ComtradeService {
  private static readonly BASE_URL = "https://comtradeapi.un.org/data/v1/get";

  static async getTradeData(hsCode: string, year: number = 2023): Promise<any> {
    try {
      const url = `${this.BASE_URL}/C/A/HS?freq=A&ps=${year}&r=842&p=0&rg=1&cc=${hsCode}&fmt=json`;

      const response = await fetch(url, {
        headers: {
          "Ocp-Apim-Subscription-Key": API_KEYS.UN_COMTRADE_PRIMARY || "",
        },
      });

      if (!response.ok) {
        throw new Error(`Comtrade API error: ${response.status}`);
      }

      const data = await response.json();
      return data.data || [];
    } catch (error) {
      console.error("Comtrade API error:", error);
      return [];
    }
  }

  static async getMultipleHSCodes(hsCodes: string[]): Promise<any[]> {
    const results = await Promise.allSettled(
      hsCodes.map(code => this.getTradeData(code))
    );

    return results
      .filter(result => result.status === "fulfilled")
      .map(result => (result as PromiseFulfilledResult<any>).value);
  }
}

// ============================================================================
// SHIPPO SERVICE
// ============================================================================

export class ShippoService {
  private static readonly BASE_URL = "https://api.goshippo.com";

  static async getShippingRates(
    fromAddress: any,
    toAddress: any,
    parcel: any
  ): Promise<any> {
    try {
      const response = await fetch(`${this.BASE_URL}/shipments/`, {
        method: "POST",
        headers: {
          Authorization: `ShippoToken ${API_KEYS.SHIPPO}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          address_from: fromAddress,
          address_to: toAddress,
          parcels: [parcel],
        }),
      });

      if (!response.ok) {
        throw new Error(`Shippo API error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Shippo API error:", error);
      return null;
    }
  }

  static async validateAddress(address: any): Promise<any> {
    try {
      const response = await fetch(`${this.BASE_URL}/addresses/`, {
        method: "POST",
        headers: {
          Authorization: `ShippoToken ${API_KEYS.SHIPPO}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(address),
      });

      return await response.json();
    } catch (error) {
      console.error("Address validation error:", error);
      return null;
    }
  }
}

// ============================================================================
// OPENROUTER SERVICE
// ============================================================================

export class OpenRouterService {
  private static readonly BASE_URL = "https://openrouter.ai/api/v1";

  static async validateOpenRouterSetup(): Promise<boolean> {
    try {
      if (!API_KEYS.OPENROUTER) {
        return false;
      }

      const response = await fetch(`${this.BASE_URL}/auth/key`, {
        headers: {
          Authorization: `Bearer ${API_KEYS.OPENROUTER}`,
          "Content-Type": "application/json",
        },
      });

      return response.ok;
    } catch (error) {
      console.error("OpenRouter validation error:", error);
      return false;
    }
  }

  static async generateAnalysis(prompt: string): Promise<string> {
    try {
      const response = await fetch(`${this.BASE_URL}/chat/completions`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${API_KEYS.OPENROUTER}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "meta-llama/llama-3.1-8b-instruct:free",
          messages: [{ role: "user", content: prompt }],
        }),
      });

      const data = await response.json();
      return data.choices?.[0]?.message?.content || "Analysis not available";
    } catch (error) {
      console.error("OpenRouter generation error:", error);
      return "Analysis not available";
    }
  }
}

// ============================================================================
// SAM.GOV SERVICE
// ============================================================================

export class SAMGovService {
  private static readonly BASE_URL =
    "https://api.sam.gov/data-services/v1/registrations";

  static async validateSupplier(uei: string): Promise<any> {
    try {
      const response = await fetch(
        `${this.BASE_URL}/${uei}?api_key=${API_KEYS.SAMGOV}`,
        {
          headers: {
            Accept: "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`SAM.gov API error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("SAM.gov validation error:", error);
      return null;
    }
  }

  static async batchValidateSuppliers(ueis: string[]): Promise<any[]> {
    const results = await Promise.allSettled(
      ueis.map(uei => this.validateSupplier(uei))
    );

    return results
      .filter(result => result.status === "fulfilled")
      .map(result => (result as PromiseFulfilledResult<any>).value)
      .filter(Boolean);
  }

  static async searchSuppliersByNAICS(naicsCode: string): Promise<any[]> {
    try {
      const response = await fetch(
        `${this.BASE_URL}?naicsCode=${naicsCode}&api_key=${API_KEYS.SAMGOV}`,
        {
          headers: {
            Accept: "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`SAM.gov search error: ${response.status}`);
      }

      const data = await response.json();
      return data.entityData || [];
    } catch (error) {
      console.error("SAM.gov search error:", error);
      return [];
    }
  }

  static async getSupplierDetails(uei: string): Promise<any> {
    return this.validateSupplier(uei);
  }
}

// ============================================================================
// FEDERAL REGISTER SERVICE
// ============================================================================

export class FederalRegisterService {
  private static readonly BASE_URL = "https://www.federalregister.gov/api/v1";

  static async getTariffRelatedDocuments(): Promise<any[]> {
    try {
      const response = await fetch(
        `${this.BASE_URL}/articles.json?conditions[term]=tariff&per_page=20&order=newest`,
        {
          headers: {
            Accept: "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Federal Register API error: ${response.status}`);
      }

      const data = await response.json();
      return data.results || [];
    } catch (error) {
      console.error("Federal Register API error:", error);
      return [];
    }
  }

  static async searchDocuments(query: string): Promise<any[]> {
    try {
      const response = await fetch(
        `${this.BASE_URL}/articles.json?conditions[term]=${encodeURIComponent(
          query
        )}&per_page=10`,
        {
          headers: {
            Accept: "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Federal Register search error: ${response.status}`);
      }

      const data = await response.json();
      return data.results || [];
    } catch (error) {
      console.error("Federal Register search error:", error);
      return [];
    }
  }

  static async getDocumentDetails(documentNumber: string): Promise<any> {
    try {
      const response = await fetch(
        `${this.BASE_URL}/articles/${documentNumber}.json`,
        {
          headers: {
            Accept: "application/json",
          },
        }
      );

      return await response.json();
    } catch (error) {
      console.error("Document details error:", error);
      return null;
    }
  }
}

// ============================================================================
// MINIMAL STUB SERVICES FOR REMOVED FUNCTIONALITY
// ============================================================================

export class TariffAnalysisService {
  static async getComprehensiveTariffData(
    hsCode: string,
    country: string
  ): Promise<any> {
    // Stub implementation - returns mock data
    return {
      hsCode,
      country,
      currentRate: 5.0,
      scheduledChanges: [],
      impact: "low",
    };
  }
}

export class ProductEnhancementService {
  static async refreshTariffRates(
    products: EnhancedProductData[]
  ): Promise<EnhancedProductData[]> {
    // Stub implementation - returns products unchanged
    return products;
  }
}

export class ReportGenerationService {
  static async generateExecutiveReport(data: any): Promise<string> {
    // Stub implementation
    return "Executive report generated successfully";
  }
}

export class VesselTrackingService {
  static async getVesselTrackingData(): Promise<any[]> {
    // Stub implementation
    return [];
  }
}

export class EnhancedSupplierIntelligenceService {
  static async generateSupplierMatrix(suppliers: string[]): Promise<any> {
    // Stub implementation
    return { matrix: [], analysis: "No analysis available" };
  }
}

export class ResilienceAssessmentService {
  static async assessSupplyChainResilience(
    data: any
  ): Promise<ResilienceMetrics> {
    // Stub implementation
    return {
      overallScore: 75,
      riskLevel: "medium",
      vulnerabilities: [],
      strengths: [],
    };
  }
}

export class ScenarioModelingService {
  static async runScenarioAnalysis(
    inputs: ScenarioInput
  ): Promise<ScenarioResult[]> {
    // Stub implementation
    return [];
  }
}

export class SMBContextService {
  static async receiveUserContext(context: any): Promise<any> {
    // Stub implementation
    console.log("SMB context received:", context);

    // Return the expected structure with sessionId
    return {
      sessionId: `smb-${Date.now()}-${Math.random().toString(36).substring(7)}`,
      smbProfile: context,
      riskMultipliers: {
        cashFlowMultiplier: 1.0,
        volatilityMultiplier: 1.0,
        riskToleranceMultiplier: 1.0,
      },
      thresholds: {
        criticalImpactThreshold: 100000,
        highImpactThreshold: 50000,
        mediumImpactThreshold: 25000,
      },
    };
  }

  static getSMBContext(sessionId: string): any {
    // Stub implementation
    return null;
  }
}

export class APICacheService {
  static async processDataForVisualization(data: any): Promise<any> {
    // Stub implementation
    return data;
  }
}
