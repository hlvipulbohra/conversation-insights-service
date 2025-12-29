CREATE TABLE IF NOT EXISTS calls_insights (
  id UUID PRIMARY KEY,
  duration_seconds INT,
  call_id UUID REFERENCES calls(id),

  was_issue_resolved BOOLEAN,
  resolution_confidence NUMERIC(4,2),
  overall_experience TEXT,
  customer_complaint_summary TEXT,
  churn_risk TEXT,
  predicted_csat SMALLINT,
  nps_prediction SMALLINT,
  quality_score_agent SMALLINT,
  escalation_needed BOOLEAN,
  
  audio_transcript JSONB,  
  insights JSONB,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

