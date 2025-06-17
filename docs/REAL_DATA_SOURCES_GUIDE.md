# REAL DATA SOURCES INTEGRATION GUIDE

## Required API Keys and Services

### 1. Vessel Tracking APIs

**Primary Options:**

- **MarineTraffic API** (Recommended)
  - Website: https://www.marinetraffic.com/en/ais-api-services
  - Features: Real-time vessel positions, port calls, voyage data
  - Cost: ~$100-500/month depending on usage
- **VesselFinder API**
  - Website: https://www.vesselfinder.com/api
  - Features: AIS data, vessel tracking, port information
  - Cost: ~$50-300/month

**Implementation Location:** `src/services/apiServices.ts` - VesselTrackingService

### 2. SAM.gov Supplier Validation

**Service:** U.S. Government SAM.gov API

- **Website:** https://sam.gov/content/api
- **Free API Key:** Available at https://api.data.gov/signup/
- **Features:** Supplier validation, CAGE codes, UEI verification
- **Rate Limits:** 1,000 requests/hour (free tier)

**Implementation Location:** `src/services/apiServices.ts` - SAMGovService

### 3. Market Intelligence & AI Analysis

**Service:** OpenRouter API (AI Models)

- **Website:** https://openrouter.ai/
- **Cost:** Pay-per-use (~$0.001-0.01 per request)
- **Models:** GPT-4, Claude, Llama for supplier research and analysis

**Alternative:** Custom web scraping with:

- Puppeteer for dynamic content
- Cheerio for static HTML parsing
- Rate limiting and proxy rotation

**Implementation Location:** `src/services/apiServices.ts` - EnhancedSupplierIntelligenceService

### 4. Trade Data APIs

**Primary:**

- **UN Comtrade API** (Free)
  - Website: https://comtrade.un.org/api/
  - Features: Global trade statistics, tariff data

**Secondary:**

- **Trade.gov API** (Free)
  - Website: https://api.trade.gov/
  - Features: U.S. trade data, market research

### 5. Shipping Rate APIs

**Service:** Shippo API

- **Website:** https://goshippo.com/api/
- **Features:** Real shipping rates, carrier integration
- **Cost:** Pay-per-use (~$0.05 per API call)

## Environment Variables Setup

Create a `.env.local` file in the project root:

```env
# Vessel Tracking
VITE_MARINETRAFFIC_API_KEY=your_marinetraffic_key
VITE_VESSELFINDER_API_KEY=your_vesselfinder_key

# Government APIs
VITE_SAM_GOV_API_KEY=your_sam_gov_key
VITE_DATA_GOV_API_KEY=your_data_gov_key

# AI & Market Intelligence
VITE_OPENROUTER_API_KEY=your_openrouter_key

# Trade Data
VITE_UN_COMTRADE_API_KEY=your_comtrade_key

# Shipping
VITE_SHIPPO_API_KEY=your_shippo_key
```

## Implementation Priority

### Phase 1 (Essential - Free APIs)

1. **SAM.gov API** - Government supplier validation
2. **UN Comtrade API** - Trade statistics
3. **Trade.gov API** - Market research data

### Phase 2 (Enhanced Intelligence)

1. **OpenRouter API** - AI-powered supplier research
2. **Basic web scraping** - Industry directories

### Phase 3 (Premium Features)

1. **Vessel tracking APIs** - Real-time shipment monitoring
2. **Shippo API** - Live shipping rates

## Code Implementation Examples

### SAM.gov Integration

```typescript
// In src/services/apiServices.ts
export class SAMGovService {
  static async validateSupplier(uei: string): Promise<SAMValidationResult> {
    const response = await fetch(
      `https://api.sam.gov/entity-information/v3/entities?ueiSAM=${uei}&api_key=${
        import.meta.env.VITE_SAM_GOV_API_KEY
      }`
    );
    return response.json();
  }
}
```

### OpenRouter Integration

```typescript
// AI-powered supplier research
export class EnhancedSupplierIntelligenceService {
  static async researchSupplier(supplierName: string, hsCode: string) {
    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "openai/gpt-4",
          messages: [
            {
              role: "user",
              content: `Research supplier: ${supplierName} for HS code: ${hsCode}. Provide risk assessment, alternative suppliers, and market intelligence.`,
            },
          ],
        }),
      }
    );
    return response.json();
  }
}
```

## Testing Strategy

1. **Start with free APIs** (SAM.gov, UN Comtrade)
2. **Use test data** from `test/sample_purchase_orders.csv`
3. **Implement error handling** for API failures
4. **Add rate limiting** to prevent API quota issues
5. **Cache responses** to minimize API calls

## Budget Estimation

**Minimal Setup (Free APIs only):** $0/month
**Basic Intelligence:** ~$50-100/month (OpenRouter + basic scraping)
**Full Featured:** ~$200-500/month (includes vessel tracking)

## Next Steps

1. Sign up for free API keys (SAM.gov, UN Comtrade, Data.gov)
2. Test with sample data to validate integration
3. Implement caching to minimize API costs
4. Add premium APIs as budget allows
