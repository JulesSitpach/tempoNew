# NO MOCK DATA POLICY

## Policy Statement

**The SMB Tariff Suite shall contain NO mock, fake, or simulated data that could mislead users about actual business conditions, supplier information, or market data.**

## Why This Policy Exists

1. **User Trust**: Mock data misleads users into making business decisions based on false information
2. **Professional Integrity**: Real businesses need real data for real decisions
3. **Liability Prevention**: Fake data could lead to poor business decisions and potential legal issues
4. **Market Accuracy**: Business intelligence must reflect actual market conditions

## Implementation Guidelines

### What to Use Instead of Mock Data

1. **Real External APIs**:

   - SAM.gov API for supplier validation
   - Federal Register API for policy updates
   - UN Comtrade API for trade statistics
   - Shippo API for shipping rates

2. **OpenRouter + AI Models**:

   - For data analysis we don't have direct APIs for
   - Web scraping when legally permissible
   - Real-time market intelligence gathering

3. **User-Provided Data**:

   - Actual purchase orders (like the test data provided)
   - Real supplier information entered by users
   - Actual business metrics and preferences

4. **Empty States with Clear Messaging**:
   - When no real data is available, show empty states
   - Explain what data sources are needed
   - Provide clear instructions for data input

### What Is Prohibited

1. **Fake Supplier Data**: No invented company names, addresses, or contact information
2. **Mock Financial Data**: No simulated costs, savings, or financial projections without real basis
3. **Artificial Market Intelligence**: No made-up market trends, risk assessments, or industry data
4. **Simulated Government Data**: No fake SAM.gov registrations, HTS codes, or tariff rates
5. **Placeholder External Intelligence**: No mock vessel tracking, shipment data, or logistics information

### Acceptable Temporary States

1. **Loading States**: Show loading indicators while fetching real data
2. **Error States**: Show clear error messages when real data cannot be retrieved
3. **Configuration Examples**: Show format examples for data input (clearly labeled as examples)
4. **Demo Screenshots**: In documentation only, clearly marked as examples

## Implementation Checklist

### For Components

- [ ] Remove all hardcoded supplier lists
- [ ] Remove mock financial calculations
- [ ] Remove fake external intelligence data
- [ ] Implement real API connections
- [ ] Add proper error handling for failed API calls
- [ ] Show empty states when no real data exists

### For Services

- [ ] Replace mock API responses with real API calls
- [ ] Implement proper error handling
- [ ] Add fallback to OpenRouter for missing data
- [ ] Remove all simulated delays and fake loading

### For Documentation

- [ ] Update all examples to use real data structures
- [ ] Remove references to mock data capabilities
- [ ] Document real data sources and requirements
- [ ] Provide clear data input guidelines

## Test Data

For development and testing purposes, use the real purchase order data located at:
`c:\Users\NATUR\Desktop\tempo\test\sample_purchase_orders.txt`

This contains actual PO data with real suppliers, countries, HS codes, and tariff rates.

## Data Sources Architecture

### Primary External APIs

1. **SAM.gov**: Government supplier validation
2. **Federal Register**: Policy and regulation updates
3. **UN Comtrade**: International trade statistics
4. **Shippo**: Real shipping rates and logistics

### Secondary Data Sources

1. **OpenRouter + AI**: For analysis and data enrichment
2. **Web Scraping**: For publicly available market data (when legally permissible)
3. **User Input**: Business-specific data and preferences

### Data Flow

```
Real User Data → Real External APIs → AI Analysis → Real Business Intelligence
```

## Enforcement

1. **Code Reviews**: All PRs must be checked for mock data removal
2. **Testing**: Use only real test data from provided sample files
3. **User Testing**: Validate that all displayed data is real or clearly marked as unavailable
4. **Documentation**: Keep this policy updated and referenced in all component documentation

## Consequences of Mock Data

Using mock data in production:

- Misleads users about market conditions
- Creates false confidence in business decisions
- Potentially violates user trust
- Could result in poor business outcomes
- Damages credibility of the platform

## Emergency Procedures

If real data cannot be obtained:

1. Show empty state with clear explanation
2. Provide instructions for obtaining real data
3. Offer to help user connect to real data sources
4. Document the limitation transparently
5. Never substitute with fake data

This policy ensures the SMB Tariff Suite maintains the highest standards of data integrity and user trust.
