import { API_KEYS, validateAPIKeys } from "../utils/apiConfig";
import websocketService from "./websocketService";
import EnhancedFederalRegisterService from "./enhancedFederalRegisterService";

// External API Status Service
export class ExternalAPIStatus {
  static async checkAllAPIs(): Promise<any[]> {
    const apis = [
      { 
        name: "OPENROUTER", 
        key: API_KEYS.OPENROUTER,
        test: () => this.testOpenRouter()
      },
      { 
        name: "UN_COMTRADE_PRIMARY", 
        key: API_KEYS.UN_COMTRADE_PRIMARY,
        test: () => this.testComtrade()
      },
      { 
        name: "UN_COMTRADE_SECONDARY", 
        key: API_KEYS.UN_COMTRADE_SECONDARY,
        test: () => this.testComtrade()
      },
      { 
        name: "SAMGOV", 
        key: API_KEYS.SAMGOV,
        test: () => this.testSamGov()
      },
      { 
        name: "SHIPPO", 
        key: API_KEYS.SHIPPO,
        test: () => this.testShippo()
      },
      { 
        name: "FEDERAL_REGISTER", 
        key: "public",
        test: () => EnhancedFederalRegisterService.testConnection()
      },
    ];

    const results = await Promise.all(
      apis.map(async (api) => {
        try {
          const result = await api.test();
          return {
            name: api.name,
            status: result.status || (api.key ? "operational" : "disconnected"),
            responseTime: result.responseTime || 0,
            lastChecked: result.lastChecked || new Date().toISOString(),
            error: result.error
          };
        } catch (error) {
          return {
            name: api.name,
            status: "down",
            responseTime: 0,
            lastChecked: new Date().toISOString(),
            error: String(error)
          };
        }
      })
    );

    return results;
  }

  static async testOpenRouter(): Promise<any> {
    const startTime = Date.now();
    if (!API_KEYS.OPENROUTER) {
      return {
        status: "disconnected",
        responseTime: 0,
        lastChecked: new Date().toISOString(),
        error: "API key missing"
      };
    }
    
    try {
      const response = await fetch("https://openrouter.ai/api/v1/models", {
        headers: {
          "Authorization": `Bearer ${API_KEYS.OPENROUTER}`
        }
      });
      
      return {
        status: response.ok ? "operational" : "degraded",
        responseTime: Date.now() - startTime,
        lastChecked: new Date().toISOString(),
        error: response.ok ? undefined : `HTTP ${response.status}`
      };
    } catch (error) {
      return {
        status: "down",
        responseTime: Date.now() - startTime,
        lastChecked: new Date().toISOString(),
        error: String(error)
      };
    }
  }

  static async testComtrade(): Promise<any> {
    const startTime = Date.now();
    try {
      const response = await fetch("https://comtradeapi.un.org/");
      return {
        status: response.ok ? "operational" : "degraded",
        responseTime: Date.now() - startTime,
        lastChecked: new Date().toISOString()
      };
    } catch (error) {
      return {
        status: "down",
        responseTime: Date.now() - startTime,
        lastChecked: new Date().toISOString(),
        error: String(error)
      };
    }
  }

  static async testSamGov(): Promise<any> {
    const startTime = Date.now();
    try {
      const response = await fetch("https://api.sam.gov/entity-information/v3/entities?limit=1", {
        headers: API_KEYS.SAMGOV ? {
          "X-API-Key": API_KEYS.SAMGOV
        } : {}
      });
      return {
        status: response.ok ? "operational" : "degraded",
        responseTime: Date.now() - startTime,
        lastChecked: new Date().toISOString()
      };
    } catch (error) {
      return {
        status: "down",
        responseTime: Date.now() - startTime,
        lastChecked: new Date().toISOString(),
        error: String(error)
      };
    }
  }

  static async testShippo(): Promise<any> {
    const startTime = Date.now();
    if (!API_KEYS.SHIPPO) {
      return {
        status: "disconnected",
        responseTime: 0,
        lastChecked: new Date().toISOString(),
        error: "API key missing"
      };
    }
    
    try {
      const response = await fetch("https://api.goshippo.com/addresses/", {
        headers: {
          "Authorization": `ShippoToken ${API_KEYS.SHIPPO}`
        }
      });
      return {
        status: response.ok ? "operational" : "degraded",
        responseTime: Date.now() - startTime,
        lastChecked: new Date().toISOString()
      };
    } catch (error) {
      return {
        status: "down",
        responseTime: Date.now() - startTime,
        lastChecked: new Date().toISOString(),
        error: String(error)
      };
    }
  }

  static async checkShippoAPI(): Promise<any> {
    return await this.testShippo();
  }

  static validateAPIKeys() {
    return validateAPIKeys();
  }
}

// Initialize WebSocket when service is imported
if (import.meta.env.DEV) {
  // Only connect in development mode, or customize based on your needs
  websocketService.connect();
}
