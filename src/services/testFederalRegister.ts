// Test script for Federal Register API
import EnhancedFederalRegisterService from './enhancedFederalRegisterService';

export async function testFederalRegisterAPI() {
  console.log('🧪 Testing Federal Register API...');

  try {
    // Test 1: Basic connectivity
    console.log('📡 Testing API connectivity...');
    const connectionTest = await EnhancedFederalRegisterService.testConnection();
    console.log('Connection Status:', connectionTest);

    // Test 2: Search for recent steel documents (based on actual API data)
    console.log('🔍 Searching for recent steel import documents...');
    const steelDocs = await EnhancedFederalRegisterService.getRecentSteelDuties();
    console.log(`Found ${steelDocs.length} steel-related documents`);
    
    if (steelDocs.length > 0) {
      console.log('Latest steel document:', {
        title: steelDocs[0].title,
        date: steelDocs[0].publication_date,
        type: steelDocs[0].type,
        agency: steelDocs[0].agencies[0]?.name
      });
    }

    // Test 3: Search for tariff documents
    console.log('📋 Searching for general tariff documents...');
    const tariffDocs = await EnhancedFederalRegisterService.searchTariffDocuments({
      products: ['electronics', 'textiles'],
      countries: ['china', 'mexico'],
      daysBack: 30
    });
    
    console.log(`Found ${tariffDocs.count} tariff-related documents`);
    
    // Test 4: Monitor policy changes
    console.log('👀 Monitoring policy changes...');
    const policyChanges = await EnhancedFederalRegisterService.monitorPolicyChanges({
      products: ['steel', 'aluminum'],
      supplierCountries: ['china', 'canada']
    });
    
    console.log(`Found ${policyChanges.length} recent policy changes`);

    return {
      success: true,
      connectionStatus: connectionTest.status,
      steelDocuments: steelDocs.length,
      tariffDocuments: tariffDocs.count,
      policyChanges: policyChanges.length
    };

  } catch (error) {
    console.error('❌ Federal Register API test failed:', error);
    return {
      success: false,
      error: String(error)
    };
  }
}

// Export for console testing
if (typeof window !== 'undefined') {
  (window as any).testFederalRegisterAPI = testFederalRegisterAPI;
}
