// Federal Register API Test & Enhancement
import { FederalRegisterService } from './federalRegisterService';

/**
 * Enhanced Federal Register API Integration
 * Based on official API documentation: https://www.federalregister.gov/developers/documentation/api/v1
 */

export interface FederalRegisterDocument {
  title: string;
  type: string;
  abstract: string;
  document_number: string;
  html_url: string;
  pdf_url: string;
  publication_date: string;
  agencies: Array<{
    name: string;
    slug: string;
  }>;
  excerpts?: string;
  significant?: boolean;
  topics?: string[];
}

export interface FederalRegisterResponse {
  count: number;
  description: string;
  total_pages: number;
  next_page_url?: string;
  results: FederalRegisterDocument[];
}

export interface TariffRelatedSearch {
  term: string;
  agencies: string[];
  types: string[];
  daysBack: number;
}

/**
 * Enhanced Federal Register Service for SMB Tariff Management
 */
export class EnhancedFederalRegisterService {
  private static readonly API_BASE = "https://www.federalregister.gov/api/v1";
  
  /**
   * Search for tariff-related documents
   */
  static async searchTariffDocuments(searchParams?: {
    products?: string[];
    countries?: string[];
    daysBack?: number;
  }): Promise<FederalRegisterResponse> {
    const { products = [], countries = [], daysBack = 30 } = searchParams || {};
    
    const date = new Date();
    date.setDate(date.getDate() - daysBack);
    const startDate = date.toISOString().split('T')[0];
    
    // Build search terms for tariffs
    const tariffTerms = [
      'tariff',
      'duty',
      'import',
      'customs',
      'harmonized tariff schedule',
      'HTS',
      'trade',
      ...products,
      ...countries
    ].join(' OR ');
    
    const params = {
      conditions: {
        term: tariffTerms,
        publication_date: {
          gte: startDate
        },
        agencies: [
          'commerce-department',
          'customs-and-border-protection',
          'trade-representative',
          'treasury-department'
        ],
        type: ['rule', 'proposed-rule', 'notice']
      },
      fields: [
        'title',
        'type',
        'abstract',
        'document_number',
        'html_url',
        'pdf_url',
        'publication_date',
        'agencies',
        'excerpts',
        'significant'
      ],
      per_page: 20,
      order: 'newest' as const
    };
    
    return await FederalRegisterService.searchDocuments(params);
  }
  
  /**
   * Get steel-related documents (based on your recent API response)
   */
  static async searchSteelDocuments(): Promise<FederalRegisterResponse> {
    const params = {
      conditions: {
        term: 'steel OR aluminum OR metal OR proclamation 10896',
        agencies: ['commerce-department'],
        type: ['notice', 'rule'],
        publication_date: {
          gte: '2025-01-01'
        }
      },
      per_page: 10,
      order: 'newest' as const
    };
    
    return await FederalRegisterService.searchDocuments(params);
  }
  
  /**
   * Monitor for new policy changes affecting specific products
   */
  static async monitorPolicyChanges(userProfile: {
    products: string[];
    supplierCountries: string[];
  }): Promise<FederalRegisterDocument[]> {
    const response = await this.searchTariffDocuments({
      products: userProfile.products,
      countries: userProfile.supplierCountries,
      daysBack: 7 // Last week only
    });
    
    // Filter for high-impact documents
    return response.results.filter(doc => 
      doc.significant || 
      doc.type === 'rule' ||
      doc.title.toLowerCase().includes('tariff') ||
      doc.title.toLowerCase().includes('duty') ||
      doc.abstract?.toLowerCase().includes('import')
    );
  }
  
  /**
   * Test API connectivity and return status
   */
  static async testConnection(): Promise<{
    status: 'operational' | 'degraded' | 'down';
    responseTime: number;
    lastChecked: string;
    error?: string;
  }> {
    const startTime = Date.now();
    
    try {
      const response = await fetch(`${this.API_BASE}/documents.json?per_page=1`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'SMB-Tariff-Management-Suite'
        }
      });
      
      const responseTime = Date.now() - startTime;
      
      if (response.ok) {
        const data = await response.json();
        return {
          status: 'operational',
          responseTime,
          lastChecked: new Date().toISOString()
        };
      } else {
        return {
          status: 'degraded',
          responseTime,
          lastChecked: new Date().toISOString(),
          error: `HTTP ${response.status}: ${response.statusText}`
        };
      }
    } catch (error) {
      return {
        status: 'down',
        responseTime: Date.now() - startTime,
        lastChecked: new Date().toISOString(),
        error: String(error)
      };
    }
  }
  
  /**
   * Get recent steel import duty documents (based on live API data)
   */
  static async getRecentSteelDuties(): Promise<FederalRegisterDocument[]> {
    try {
      const response = await this.searchDocuments({
        conditions: {
          term: 'steel OR "proclamation 10896" OR "duties on steel"',
          publication_date: {
            gte: '2025-02-01'
          },
          agencies: ['commerce-department']
        },
        per_page: 5,
        order: 'newest' as const
      });
      
      return response.results || [];
    } catch (error) {
      console.error('Error fetching steel duties:', error);
      return [];
    }
  }
  
  /**
   * Legacy method wrapper for compatibility
   */
  private static async searchDocuments(params: any): Promise<FederalRegisterResponse> {
    return await FederalRegisterService.searchDocuments(params);
  }
}

export default EnhancedFederalRegisterService;
