import { FederalRegisterService } from "./federalRegisterService";

export interface PolicyAlert {
  id: string;
  title: string;
  summary: string;
  impact: "high" | "medium" | "low";
  date: string;
  url: string;
  isRead: boolean;
  affectedProducts: string[];
}

export class PolicyAlertService {
  private static readonly STORAGE_KEY = "policy_alerts";
  private static readonly CHECK_INTERVAL = 24 * 60 * 60 * 1000; // 24 hours
  private static readonly MAX_ALERTS = 50;

  /**
   * Check for new policy alerts
   */
  static async checkForNewAlerts(
    keywords: string[] = [],
    affectsProducts: string[] = []
  ): Promise<PolicyAlert[]> {
    try {
      // Build enhanced search term with keywords
      const searchTerms = [
        "tariff",
        "duty",
        "customs",
        "trade",
        ...keywords,
      ].join(" ");

      // Get existing alerts to avoid duplicates
      const existingAlerts = this.getStoredAlerts();
      const existingIds = new Set(existingAlerts.map(alert => alert.id));

      // Search for recent policy updates using specific terms
      const params = {
        conditions: {
          term: searchTerms,
          publication_date: {
            gte: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000)
              .toISOString()
              .split("T")[0],
          },
        },
        fields: [
          "title",
          "abstract",
          "publication_date",
          "html_url",
          "document_number",
          "effective_on",
        ],
        per_page: 20,
        order: "newest",
      };

      const response = await FederalRegisterService.searchDocuments(params);

      if (!response.results) {
        return [];
      }

      // Convert to alerts and filter out existing ones
      const newAlerts: PolicyAlert[] = response.results
        .filter((doc: any) => !existingIds.has(doc.document_number))
        .map((doc: any) => {
          const impact = this.estimateImpact(doc.title, doc.abstract);
          const affectedProducts = this.identifyAffectedProducts(
            doc.title,
            doc.abstract,
            affectsProducts
          );

          return {
            id: doc.document_number,
            title: doc.title,
            summary: doc.abstract || "No abstract available",
            impact,
            date: doc.publication_date,
            url: doc.html_url,
            isRead: false,
            affectedProducts,
          };
        })
        // Only keep alerts that are medium/high impact or affect specified products
        .filter(
          (alert: PolicyAlert) =>
            alert.impact === "high" ||
            alert.impact === "medium" ||
            alert.affectedProducts.length > 0
        );

      // Store new alerts
      if (newAlerts.length > 0) {
        this.storeAlerts(
          [...newAlerts, ...existingAlerts].slice(0, this.MAX_ALERTS)
        );
      }

      return newAlerts;
    } catch (error) {
      console.error("Policy alert check failed:", error);
      return [];
    }
  }

  /**
   * Get all stored alerts
   */
  static getStoredAlerts(): PolicyAlert[] {
    try {
      const storedData = localStorage.getItem(this.STORAGE_KEY);
      if (storedData) {
        return JSON.parse(storedData);
      }
    } catch (error) {
      console.error("Error getting stored alerts:", error);
    }
    return [];
  }

  /**
   * Store alerts
   */
  static storeAlerts(alerts: PolicyAlert[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(alerts));
    } catch (error) {
      console.error("Error storing alerts:", error);
    }
  }

  /**
   * Mark alert as read
   */
  static markAsRead(id: string): void {
    const alerts = this.getStoredAlerts();
    const updatedAlerts = alerts.map(alert =>
      alert.id === id ? { ...alert, isRead: true } : alert
    );
    this.storeAlerts(updatedAlerts);
  }

  /**
   * Get unread alert count
   */
  static getUnreadCount(): number {
    return this.getStoredAlerts().filter(alert => !alert.isRead).length;
  }

  /**
   * Clear all alerts
   */
  static clearAlerts(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }

  /**
   * Set up regular checks for new alerts
   */
  static setupRegularChecks(
    keywords: string[] = [],
    products: string[] = [],
    callback?: (alerts: PolicyAlert[]) => void
  ): () => void {
    const checkForAlerts = async () => {
      const newAlerts = await this.checkForNewAlerts(keywords, products);
      if (newAlerts.length > 0 && callback) {
        callback(newAlerts);
      }
    };

    // Check immediately
    checkForAlerts();

    // Set up interval for future checks
    const intervalId = setInterval(checkForAlerts, this.CHECK_INTERVAL);

    // Return cleanup function
    return () => clearInterval(intervalId);
  }

  // Helper methods
  private static estimateImpact(
    title: string,
    abstract: string
  ): "high" | "medium" | "low" {
    const content = `${title} ${abstract || ""}`.toLowerCase();

    const highImpactTerms = [
      "significant increase",
      "major change",
      "substantial modification",
      "section 301",
      "section 232",
      "immediate effect",
      "executive order",
      "trade war",
    ];

    const mediumImpactTerms = [
      "modification",
      "adjustment",
      "update",
      "revision",
      "new requirement",
    ];

    if (highImpactTerms.some(term => content.includes(term))) {
      return "high";
    }

    if (mediumImpactTerms.some(term => content.includes(term))) {
      return "medium";
    }

    return "low";
  }

  private static identifyAffectedProducts(
    title: string,
    abstract: string,
    userProducts: string[] = []
  ): string[] {
    const content = `${title} ${abstract || ""}`.toLowerCase();
    const affectedProducts: string[] = [];

    // Check if any user products are mentioned
    userProducts.forEach(product => {
      if (content.toLowerCase().includes(product.toLowerCase())) {
        affectedProducts.push(product);
      }
    });

    // Check for common product categories
    const productCategories = [
      { term: "steel", product: "Steel Products" },
      { term: "aluminum", product: "Aluminum Products" },
      { term: "textile", product: "Textiles" },
      { term: "semiconductor", product: "Semiconductors" },
      { term: "automobile", product: "Automobiles" },
      { term: "agricultural", product: "Agricultural Products" },
      { term: "pharmaceutical", product: "Pharmaceuticals" },
      { term: "solar", product: "Solar Products" },
      { term: "furniture", product: "Furniture" },
      { term: "electronics", product: "Electronics" },
    ];

    productCategories.forEach(category => {
      if (
        content.includes(category.term) &&
        !affectedProducts.includes(category.product)
      ) {
        affectedProducts.push(category.product);
      }
    });

    return affectedProducts;
  }
}
