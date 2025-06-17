import { API_KEYS } from "../utils/apiConfig";

interface FederalRegisterSearchParams {
  conditions?: {
    term?: string;
    publication_date?: {
      gte?: string; // Greater than or equal
      lte?: string; // Less than or equal
    };
    agencies?: string[];
    type?: string[];
    significant?: boolean;
    topics?: string[];
    docket_id?: string;
  };
  fields?: string[];
  per_page?: number;
  page?: number;
  order?: "relevance" | "newest" | "oldest" | "executive_order_number";
}

/**
 * Service for interacting with Federal Register API
 * Documentation: https://www.federalregister.gov/developers/documentation/api/v1
 */
export class FederalRegisterService {
  private static readonly API_BASE = import.meta.env.DEV
    ? "/federal-api/api/v1"
    : "https://www.federalregister.gov/api/v1";

  /**
   * Search for documents in the Federal Register
   */
  static async searchDocuments(params: any): Promise<any> {
    try {
      const headers: HeadersInit = {
        Accept: "application/json",
      };

      // Only add User-Agent for direct API calls (not proxy)
      if (!import.meta.env.DEV) {
        headers["User-Agent"] = "SMB-Tariff-Management-Suite";
      }

      // Convert search params to query string
      const queryParams = this.buildQueryString(params);

      const response = await fetch(
        `${this.API_BASE}/documents.json${queryParams}`,
        {
          method: "GET",
          headers,
          mode: import.meta.env.DEV ? "same-origin" : "cors",
        }
      );

      if (response.ok) {
        return await response.json();
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error("Federal Register API error:", {
          status: response.status,
          statusText: response.statusText,
          errorData,
        });
        return { results: [], count: 0, error: response.statusText };
      }
    } catch (error) {
      console.error("Federal Register search error:", error);
      return { results: [], count: 0, error: String(error) };
    }
  }

  /**
   * Get a specific document by document number
   */
  static async getDocument(documentNumber: string): Promise<any> {
    try {
      const headers: HeadersInit = {
        Accept: "application/json",
      };

      if (!import.meta.env.DEV) {
        headers["User-Agent"] = "SMB-Tariff-Management-Suite";
      }

      const response = await fetch(
        `${this.API_BASE}/documents/${documentNumber}.json`,
        {
          method: "GET",
          headers,
          mode: import.meta.env.DEV ? "same-origin" : "cors",
        }
      );

      if (response.ok) {
        return await response.json();
      } else {
        console.error(
          `Federal Register API error for document ${documentNumber}:`,
          response.statusText
        );
        return null;
      }
    } catch (error) {
      console.error(
        `Error fetching Federal Register document ${documentNumber}:`,
        error
      );
      return null;
    }
  }

  /**
   * Search for tariff-related documents
   */
  static async searchTariffRelatedDocuments(
    daysBack: number = 90,
    limit: number = 10
  ): Promise<any[]> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - daysBack);

    const params = {
      conditions: {
        term: "tariff trade customs",
        publication_date: {
          gte: startDate.toISOString().split("T")[0],
        },
      },
      fields: [
        "title",
        "abstract",
        "publication_date",
        "html_url",
        "document_number",
        "effective_on",
        "agencies",
      ],
      per_page: limit,
      order: "newest",
    };

    const response = await this.searchDocuments(params);

    if (response.results) {
      // Transform to standardized format with tariff impact assessment
      return response.results.map((doc: any) => ({
        id: doc.document_number,
        title: doc.title,
        summary: doc.abstract || "No abstract available",
        agency: doc.agencies?.[0]?.name || "Federal Agency",
        publicationDate: doc.publication_date,
        effectiveDate: doc.effective_on,
        url: doc.html_url,
        // Estimate tariff impact based on title/abstract keywords
        tariffImpact: this.estimateTariffImpact(doc.title, doc.abstract),
        // Estimate affected products based on content
        affectedProducts: this.estimateAffectedProducts(
          doc.title,
          doc.abstract
        ),
      }));
    }

    return [];
  }

  // Helper methods
  private static buildQueryString(params: any): string {
    if (!params || Object.keys(params).length === 0) {
      return "";
    }

    const queryParts: string[] = [];

    // Handle conditions
    if (params.conditions) {
      Object.entries(params.conditions).forEach(
        ([key, value]: [string, any]) => {
          if (value === undefined) return;

          if (key === "publication_date" && typeof value === "object") {
            Object.entries(value).forEach(
              ([dateOp, dateValue]: [string, any]) => {
                if (dateValue) {
                  queryParts.push(`conditions[${key}][${dateOp}]=${dateValue}`);
                }
              }
            );
          } else if (Array.isArray(value)) {
            value.forEach((item: any) => {
              queryParts.push(
                `conditions[${key}][]=${encodeURIComponent(item)}`
              );
            });
          } else if (typeof value === "boolean") {
            queryParts.push(`conditions[${key}]=${value ? "1" : "0"}`);
          } else if (typeof value === "string") {
            queryParts.push(`conditions[${key}]=${encodeURIComponent(value)}`);
          }
        }
      );
    }

    // Handle fields
    if (params.fields && params.fields.length > 0) {
      params.fields.forEach((field: string) => {
        queryParts.push(`fields[]=${field}`);
      });
    }

    // Handle pagination
    if (params.per_page) queryParts.push(`per_page=${params.per_page}`);
    if (params.page) queryParts.push(`page=${params.page}`);

    // Handle ordering
    if (params.order) queryParts.push(`order=${params.order}`);

    return queryParts.length > 0 ? `?${queryParts.join("&")}` : "";
  }

  private static estimateTariffImpact(
    title: string,
    abstract: string
  ): "high" | "medium" | "low" | "none" {
    const content = `${title} ${abstract || ""}`.toLowerCase();

    // Keywords that indicate high impact
    const highImpactTerms = [
      "tariff increase",
      "significant tariff",
      "trade war",
      "section 301",
      "section 232",
      "substantial duty",
      "major trade",
      "high tariff",
    ];

    // Keywords that indicate medium impact
    const mediumImpactTerms = [
      "tariff modification",
      "duty adjustment",
      "trade policy",
      "customs change",
      "tariff schedule",
      "tariff update",
    ];

    // Keywords that indicate low impact
    const lowImpactTerms = [
      "technical correction",
      "minor adjustment",
      "administrative change",
      "clarification",
      "procedural",
    ];

    // Check for high impact terms
    if (highImpactTerms.some(term => content.includes(term))) {
      return "high";
    }

    // Check for medium impact terms
    if (mediumImpactTerms.some(term => content.includes(term))) {
      return "medium";
    }

    // Check for low impact terms
    if (lowImpactTerms.some(term => content.includes(term))) {
      return "low";
    }

    // Default: if mentions tariff/duty at all, consider low impact
    return content.includes("tariff") || content.includes("duty")
      ? "low"
      : "none";
  }

  private static estimateAffectedProducts(
    title: string,
    abstract: string
  ): string[] {
    const content = `${title} ${abstract || ""}`.toLowerCase();
    const products: string[] = [];

    // Common product categories
    const productCategories = [
      { term: "steel", product: "Steel Products" },
      { term: "aluminum", product: "Aluminum Products" },
      { term: "textile", product: "Textiles" },
      { term: "semiconductor", product: "Semiconductors" },
      { term: "automobile", product: "Automobiles" },
      { term: "agri", product: "Agricultural Products" },
      { term: "pharmaceutical", product: "Pharmaceuticals" },
      { term: "solar", product: "Solar Products" },
      { term: "furniture", product: "Furniture" },
      { term: "electronics", product: "Electronics" },
    ];

    // Check for each product category
    productCategories.forEach(category => {
      if (content.includes(category.term)) {
        products.push(category.product);
      }
    });

    // If no specific products found but has tariff/duty language, add generic category
    if (
      products.length === 0 &&
      (content.includes("tariff") || content.includes("duty"))
    ) {
      products.push("Various Imported Goods");
    }

    return products;
  }
}
