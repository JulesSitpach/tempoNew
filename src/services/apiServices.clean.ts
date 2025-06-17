import { API_KEYS, validateAPIKeys } from "@/utils/apiConfig";
import { FederalRegisterService } from "./federalRegisterService";

// API Services for Cost Calculator

// Initialize validation on startup
const apiValidation = validateAPIKeys();
export { apiValidation };

// External API Status Service
export class ExternalAPIStatus {
  static async checkAllAPIs(): Promise<any[]> {
    const apis = [
      { name: "OpenRouter", key: API_KEYS.OPENROUTER, required: true },
      { name: "Shippo", key: API_KEYS.SHIPPO, required: true },
      {
        name: "UN Comtrade",
        key: API_KEYS.UN_COMTRADE_PRIMARY,
        required: true,
      },
      { name: "Federal Register", key: "public", required: false },
    ];

    const results = await Promise.all(
      apis.map(async api => {
        try {
          // Special handling for Federal Register since it's public
          if (api.name === "Federal Register") {
            return await this.checkFederalRegisterAPI();
          }

          if (api.name === "Shippo") {
            return await this.checkShippoAPI();
          }

          const status = api.key ? "configured" : "missing_key";
          return {
            name: api.name,
            status,
            lastChecked: new Date().toISOString(),
            responseTime:
              status === "configured"
                ? await this.checkAPIResponseTime(api)
                : null,
            errorMessage:
              status === "missing_key"
                ? `${api.name} API key not configured`
                : null,
            required: api.required,
          };
        } catch (error) {
          return {
            name: api.name,
            status: "error",
            lastChecked: new Date().toISOString(),
            errorMessage:
              error instanceof Error ? error.message : "Unknown error",
            required: api.required,
          };
        }
      })
    );

    return results;
  }

  static async checkShippoAPI(): Promise<any> {
    try {
      if (!API_KEYS.SHIPPO) {
        return {
          name: "Shippo",
          status: "missing_key",
          lastChecked: new Date().toISOString(),
          errorMessage: "Shippo API key not configured",
        };
      }

      const startTime = Date.now();
      // Test Shippo API connection
      const response = await fetch(
        `${import.meta.env.DEV ? "/shippo-api/v1" : "https://api.goshippo.com/v1"}/carriers`,
        {
          method: "GET",
          headers: {
            Authorization: `ShippoToken ${API_KEYS.SHIPPO}`,
            "Content-Type": "application/json",
          },
          mode: import.meta.env.DEV ? "same-origin" : "cors",
        }
      );
      const responseTime = Date.now() - startTime;

      if (response.ok) {
        const data = await response.json();
        return {
          name: "Shippo",
          status: "active",
          lastChecked: new Date().toISOString(),
          responseTime,
          additionalInfo: ` (${data.results?.length || 0} carriers available)`,
        };
      } else {
        return {
          name: "Shippo",
          status: "error",
          lastChecked: new Date().toISOString(),
          responseTime,
          errorMessage: `HTTP ${response.status}: ${response.statusText}`,
        };
      }
    } catch (error) {
      return {
        name: "Shippo",
        status: "error",
        lastChecked: new Date().toISOString(),
        errorMessage:
          error instanceof Error ? error.message : "Connection failed",
      };
    }
  }

  static async checkFederalRegisterAPI(): Promise<any> {
    try {
      const startTime = Date.now();
      const response = await fetch(
        `${import.meta.env.DEV ? "/federal-api" : "https://www.federalregister.gov"}/api/v1/documents?per_page=1`,
        {
          method: "HEAD",
          headers: {
            "User-Agent": "SMB-Tariff-Management-Suite",
            Accept: "application/json",
          },
        }
      );
      const responseTime = Date.now() - startTime;

      return {
        name: "Federal Register",
        status: response.ok ? "active" : "error",
        lastChecked: new Date().toISOString(),
        responseTime,
        errorMessage: response.ok
          ? null
          : `HTTP ${response.status}: ${response.statusText}`,
      };
    } catch (error) {
      return {
        name: "Federal Register",
        status: "error",
        lastChecked: new Date().toISOString(),
        errorMessage:
          error instanceof Error ? error.message : "Connection failed",
      };
    }
  }

  static async checkAPIResponseTime(api: {
    name: string;
    key: string;
  }): Promise<number> {
    const startTime = Date.now();
    try {
      // Mock response time for configured APIs
      await new Promise(resolve => setTimeout(resolve, Math.random() * 100));
      return Date.now() - startTime;
    } catch {
      return Date.now() - startTime;
    }
  }
}

// APICacheService for centralized data management
export class APICacheService {
  private static readonly CACHE_PREFIX = "api_cache_";
  private static readonly CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

  static async getCachedData(key: string): Promise<any> {
    try {
      const cacheKey = `${this.CACHE_PREFIX}${key}`;
      const cached = localStorage.getItem(cacheKey);

      if (cached) {
        const parsedCache = JSON.parse(cached);
        const isExpired =
          Date.now() - parsedCache.timestamp > this.CACHE_DURATION;

        if (!isExpired) {
          return parsedCache.data;
        } else {
          localStorage.removeItem(cacheKey);
        }
      }

      return null;
    } catch (error) {
      console.warn("Cache read error:", error);
      return null;
    }
  }

  static async setCachedData(key: string, data: any): Promise<void> {
    try {
      const cacheKey = `${this.CACHE_PREFIX}${key}`;
      const cacheData = {
        data,
        timestamp: Date.now(),
      };

      localStorage.setItem(cacheKey, JSON.stringify(cacheData));
    } catch (error) {
      console.warn("Cache write error:", error);
    }
  }

  static async processDataForVisualization(rawData: any[]): Promise<any> {
    if (!Array.isArray(rawData) || rawData.length === 0) {
      return {
        chartData: [],
        summary: {
          totalProducts: 0,
          totalOriginalValue: 0,
          totalNewValue: 0,
          averageTariffRate: 0,
        },
        lastProcessed: new Date().toISOString(),
      };
    }

    // Process data for chart generation - using actual calculations
    const processedData = {
      chartData: rawData.map((item, index) => ({
        name: item.sku || `Product ${index + 1}`,
        original: item.originalCost || 0,
        withTariff: item.newCost || item.originalCost || 0,
        impact:
          (item.newCost || item.originalCost || 0) - (item.originalCost || 0),
        tariffRate: item.tariffRate || 0,
      })),
      summary: {
        totalProducts: rawData.length,
        totalOriginalValue: rawData.reduce(
          (sum, item) => sum + (item.originalCost || 0) * (item.quantity || 1),
          0
        ),
        totalNewValue: rawData.reduce(
          (sum, item) =>
            sum +
            (item.newCost || item.originalCost || 0) * (item.quantity || 1),
          0
        ),
        averageTariffRate:
          rawData.length > 0
            ? rawData.reduce((sum, item) => sum + (item.tariffRate || 0), 0) /
              rawData.length
            : 0,
      },
      lastProcessed: new Date().toISOString(),
    };

    // Cache the processed data
    await this.setCachedData("visualization_data", processedData);
    return processedData;
  }
}

// Types for API responses
export interface HTSCodeResult {
  code: string;
  description: string;
  tariffRate: number;
  confidence: number;
}

export interface TariffRate {
  htsCode: string;
  rate: number;
  unit: string;
  additionalDuties?: string;
}

export interface ProductClassification {
  htsCode: string;
  description: string;
  tariffRate: number;
  confidence: number;
  alternativeCodes?: string[];
}

// Initialize API validation check
export const validateOpenRouterSetup = async (): Promise<boolean> => {
  if (!API_KEYS.OPENROUTER) {
    console.warn("⚠️ OpenRouter API key not configured");
    return false;
  }

  try {
    const headers: HeadersInit = {
      Authorization: `Bearer ${API_KEYS.OPENROUTER}`,
      "Content-Type": "application/json",
      "HTTP-Referer": window.location.origin,
      "X-Title": "SMB Tariff Management Suite",
    };

    // Make a simple models list request to verify API access
    const response = await fetch("https://openrouter.ai/api/v1/models", {
      method: "GET",
      headers,
    });

    if (response.ok) {
      const data = await response.json();
      const deepseekAvailable = data.data?.some((model: any) =>
        model.id.includes("deepseek")
      );

      console.log("✅ OpenRouter API connection successful");
      if (!deepseekAvailable) {
        console.warn(
          "⚠️ Deepseek model not found in available models. Using default model."
        );
      }
      return true;
    } else {
      const errorData = await response.json().catch(() => ({}));
      console.error("❌ OpenRouter API verification failed:", {
        status: response.status,
        statusText: response.statusText,
        errorData,
      });
      return false;
    }
  } catch (error) {
    console.error("❌ OpenRouter API verification error:", error);
    return false;
  }
};

// Export default
export default {
  ExternalAPIStatus,
  APICacheService,
  validateOpenRouterSetup,
};
