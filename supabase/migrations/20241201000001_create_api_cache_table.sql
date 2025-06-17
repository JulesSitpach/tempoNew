-- Create api_cache table for storing external API responses
CREATE TABLE IF NOT EXISTS api_cache (
  id SERIAL PRIMARY KEY,
  source TEXT NOT NULL, -- 'un_comtrade', 'federal_register', 'shippo', 'openrouter', 'sam_gov', 'world_bank', etc.
  endpoint TEXT NOT NULL,
  data JSONB NOT NULL,
  data_period TEXT, -- "Jan 2024 - Sep 2024"
  cached_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP,
  metadata JSONB DEFAULT '{}',
  UNIQUE(source, endpoint)
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_api_cache_source_endpoint ON api_cache(source, endpoint);
CREATE INDEX IF NOT EXISTS idx_api_cache_expires_at ON api_cache(expires_at);

-- Create enhanced_supplier_intelligence table for comprehensive supplier profiles
CREATE TABLE IF NOT EXISTS enhanced_supplier_intelligence (
  id SERIAL PRIMARY KEY,
  supplier_id TEXT NOT NULL,
  supplier_name TEXT NOT NULL,
  country TEXT NOT NULL,
  region TEXT NOT NULL,
  sam_validation JSONB,
  world_bank_risk JSONB,
  trade_intelligence JSONB,
  logistics_profile JSONB,
  ai_risk_assessment JSONB,
  government_contracting JSONB,
  risk_matrix JSONB,
  data_quality JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(supplier_id)
);

-- Create government_contracting_opportunities table
CREATE TABLE IF NOT EXISTS government_contracting_opportunities (
  id SERIAL PRIMARY KEY,
  opportunity_id TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  agency TEXT NOT NULL,
  naics_code TEXT NOT NULL,
  set_aside_type TEXT,
  estimated_value NUMERIC,
  bid_deadline TIMESTAMP,
  description TEXT,
  requirements JSONB DEFAULT '[]',
  smb_suitability JSONB,
  tariff_impact JSONB,
  policy_context JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create federal_register_documents table for policy tracking
CREATE TABLE IF NOT EXISTS federal_register_documents (
  id SERIAL PRIMARY KEY,
  document_number TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  abstract TEXT,
  publication_date DATE,
  effective_date DATE,
  agencies JSONB DEFAULT '[]',
  document_type TEXT,
  significance BOOLEAN DEFAULT FALSE,
  relevance_score NUMERIC,
  impact_assessment JSONB,
  smb_implications JSONB,
  html_url TEXT,
  pdf_url TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_enhanced_supplier_country ON enhanced_supplier_intelligence(country);
CREATE INDEX IF NOT EXISTS idx_enhanced_supplier_region ON enhanced_supplier_intelligence(region);
CREATE INDEX IF NOT EXISTS idx_enhanced_supplier_updated ON enhanced_supplier_intelligence(updated_at);

CREATE INDEX IF NOT EXISTS idx_gov_opportunities_naics ON government_contracting_opportunities(naics_code);
CREATE INDEX IF NOT EXISTS idx_gov_opportunities_deadline ON government_contracting_opportunities(bid_deadline);
CREATE INDEX IF NOT EXISTS idx_gov_opportunities_value ON government_contracting_opportunities(estimated_value);

CREATE INDEX IF NOT EXISTS idx_federal_docs_date ON federal_register_documents(publication_date);
CREATE INDEX IF NOT EXISTS idx_federal_docs_relevance ON federal_register_documents(relevance_score);
CREATE INDEX IF NOT EXISTS idx_federal_docs_type ON federal_register_documents(document_type);

-- Enable realtime for all tables
ALTER PUBLICATION supabase_realtime ADD TABLE api_cache;
ALTER PUBLICATION supabase_realtime ADD TABLE enhanced_supplier_intelligence;
ALTER PUBLICATION supabase_realtime ADD TABLE government_contracting_opportunities;
ALTER PUBLICATION supabase_realtime ADD TABLE federal_register_documents;
