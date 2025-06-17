-- Create workflow_sessions table for persisting user workflow data
CREATE TABLE IF NOT EXISTS workflow_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  session_name TEXT DEFAULT 'Untitled Analysis',
  current_step TEXT NOT NULL DEFAULT 'welcome',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  last_accessed TIMESTAMP DEFAULT NOW(),
  is_demo BOOLEAN DEFAULT FALSE,
  CONSTRAINT valid_workflow_step CHECK (
    current_step IN ('welcome', 'file-import', 'tariff-analysis', 'supplier-diversification', 
                     'supply-chain-planning', 'workforce-planning', 'alerts-setup', 
                     'ai-recommendations', 'complete')
  )
);

-- Create workflow_data table for storing step data
CREATE TABLE IF NOT EXISTS workflow_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES workflow_sessions(id) ON DELETE CASCADE,
  step_name TEXT NOT NULL,
  data JSONB NOT NULL DEFAULT '{}',
  data_sources JSONB DEFAULT '{}',
  validation JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(session_id, step_name)
);

-- Create business_profiles table for persistent business data
CREATE TABLE IF NOT EXISTS business_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  company_name TEXT,
  industry TEXT,
  annual_revenue_range TEXT,
  employee_count_range TEXT,
  primary_countries JSONB DEFAULT '[]',
  business_model TEXT,
  profile_data JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Create imported_files table for file tracking
CREATE TABLE IF NOT EXISTS imported_files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES workflow_sessions(id) ON DELETE CASCADE,
  filename TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size INTEGER,
  extracted_data JSONB DEFAULT '{}',
  processing_status TEXT DEFAULT 'pending',
  error_message TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create analysis_results table for caching expensive computations
CREATE TABLE IF NOT EXISTS analysis_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES workflow_sessions(id) ON DELETE CASCADE,
  analysis_type TEXT NOT NULL, -- 'tariff', 'supplier', 'supply-chain', 'workforce'
  input_hash TEXT NOT NULL, -- Hash of input data to detect changes
  results JSONB NOT NULL DEFAULT '{}',
  computation_time_ms INTEGER,
  api_calls_made JSONB DEFAULT '[]',
  created_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP DEFAULT (NOW() + INTERVAL '7 days'),
  UNIQUE(session_id, analysis_type, input_hash)
);

-- Create supplier_cache table for supplier intelligence
CREATE TABLE IF NOT EXISTS supplier_cache (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  supplier_name TEXT NOT NULL,
  country TEXT NOT NULL,
  sam_data JSONB,
  risk_assessment JSONB,
  trade_data JSONB,
  last_validated TIMESTAMP DEFAULT NOW(),
  cache_expires TIMESTAMP DEFAULT (NOW() + INTERVAL '30 days'),
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(supplier_name, country)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_workflow_sessions_user ON workflow_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_workflow_sessions_updated ON workflow_sessions(updated_at);
CREATE INDEX IF NOT EXISTS idx_workflow_data_session ON workflow_data(session_id);
CREATE INDEX IF NOT EXISTS idx_workflow_data_step ON workflow_data(step_name);
CREATE INDEX IF NOT EXISTS idx_business_profiles_user ON business_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_imported_files_session ON imported_files(session_id);
CREATE INDEX IF NOT EXISTS idx_analysis_results_session ON analysis_results(session_id);
CREATE INDEX IF NOT EXISTS idx_analysis_results_expires ON analysis_results(expires_at);
CREATE INDEX IF NOT EXISTS idx_supplier_cache_expires ON supplier_cache(cache_expires);
CREATE INDEX IF NOT EXISTS idx_supplier_cache_name_country ON supplier_cache(supplier_name, country);

-- Enable row level security
ALTER TABLE workflow_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflow_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE imported_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE analysis_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE supplier_cache ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can access their own workflow sessions" ON workflow_sessions
  FOR ALL USING (auth.uid() = user_id OR is_demo = true);

CREATE POLICY "Users can access their workflow data" ON workflow_data
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM workflow_sessions 
      WHERE id = workflow_data.session_id 
      AND (auth.uid() = user_id OR is_demo = true)
    )
  );

CREATE POLICY "Users can access their business profiles" ON business_profiles
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can access their imported files" ON imported_files
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM workflow_sessions 
      WHERE id = imported_files.session_id 
      AND (auth.uid() = user_id OR is_demo = true)
    )
  );

CREATE POLICY "Users can access their analysis results" ON analysis_results
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM workflow_sessions 
      WHERE id = analysis_results.session_id 
      AND (auth.uid() = user_id OR is_demo = true)
    )
  );

CREATE POLICY "Public read access to supplier cache" ON supplier_cache
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can update supplier cache" ON supplier_cache
  FOR ALL USING (auth.role() = 'authenticated');

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE workflow_sessions;
ALTER PUBLICATION supabase_realtime ADD TABLE workflow_data;
ALTER PUBLICATION supabase_realtime ADD TABLE analysis_results;
