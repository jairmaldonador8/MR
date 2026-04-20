CREATE TABLE IF NOT EXISTS leads (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  property_ids TEXT,  -- JSON array of property IDs
  budget_min INTEGER,
  budget_max INTEGER,
  contact_preference TEXT,  -- 'whatsapp' | 'email' | 'phone'
  source TEXT,  -- 'form' | 'comparison' | 'direct'
  status TEXT DEFAULT 'new',  -- 'new' | 'contacted' | 'scheduled' | 'closed'
  lead_score INTEGER DEFAULT 0,
  assigned_agent_id TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS conversations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  lead_id INTEGER NOT NULL,
  channel TEXT,  -- 'whatsapp' | 'email' | 'phone'
  message TEXT,
  sender TEXT,  -- 'lead' | 'agent' | 'system'
  sent_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(lead_id) REFERENCES leads(id)
);

CREATE TABLE IF NOT EXISTS automations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  lead_id INTEGER NOT NULL,
  automation_type TEXT,  -- 'instant_reply' | 'followup_24h' | 'followup_48h' | 'escalation'
  status TEXT DEFAULT 'pending',  -- 'pending' | 'sent' | 'failed'
  scheduled_for DATETIME,
  sent_at DATETIME,
  error_message TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(lead_id) REFERENCES leads(id)
);

CREATE TABLE IF NOT EXISTS agents (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  whatsapp_phone TEXT,
  active INTEGER DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_assigned_agent ON leads(assigned_agent_id);
CREATE INDEX IF NOT EXISTS idx_conversations_lead ON conversations(lead_id);
