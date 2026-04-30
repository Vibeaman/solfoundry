-- SolFoundry Initial Schema

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY,
  wallet_address VARCHAR(64) UNIQUE NOT NULL,
  display_name VARCHAR(100) NOT NULL,
  bio TEXT,
  role VARCHAR(20) DEFAULT 'thinker', -- thinker, builder, both
  skills TEXT[], -- for builders
  portfolio_url TEXT,
  github_url TEXT,
  twitter_url TEXT,
  reputation_score INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Ideas table
CREATE TABLE IF NOT EXISTS ideas (
  id UUID PRIMARY KEY,
  thinker_id UUID REFERENCES users(id) NOT NULL,
  title VARCHAR(200) NOT NULL,
  problem TEXT NOT NULL,
  solution TEXT NOT NULL,
  category VARCHAR(50) NOT NULL, -- defi, nft, tooling, gaming, infra, social, other
  budget_min DECIMAL(18, 6), -- in SOL
  budget_max DECIMAL(18, 6),
  timeline_days INTEGER,
  assets_url TEXT, -- link to designs, docs, etc.
  status VARCHAR(20) DEFAULT 'draft', -- draft, posted, bidding, matched, building, completed, cancelled, disputed
  selected_builder_id UUID REFERENCES users(id),
  idea_hash VARCHAR(66), -- onchain timestamp proof
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Bids table
CREATE TABLE IF NOT EXISTS bids (
  id UUID PRIMARY KEY,
  idea_id UUID REFERENCES ideas(id) NOT NULL,
  builder_id UUID REFERENCES users(id) NOT NULL,
  proposed_cost DECIMAL(18, 6) NOT NULL, -- in SOL
  timeline_days INTEGER NOT NULL,
  approach TEXT NOT NULL,
  why_me TEXT,
  status VARCHAR(20) DEFAULT 'pending', -- pending, accepted, rejected, completed, disputed
  escrow_tx VARCHAR(100), -- escrow transaction signature
  release_tx VARCHAR(100), -- release transaction signature
  accepted_at TIMESTAMP,
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(idea_id, builder_id)
);

-- Reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY,
  idea_id UUID REFERENCES ideas(id) NOT NULL,
  reviewer_id UUID REFERENCES users(id) NOT NULL, -- thinker reviewing builder
  builder_id UUID REFERENCES users(id) NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_ideas_thinker ON ideas(thinker_id);
CREATE INDEX IF NOT EXISTS idx_ideas_status ON ideas(status);
CREATE INDEX IF NOT EXISTS idx_ideas_category ON ideas(category);
CREATE INDEX IF NOT EXISTS idx_bids_idea ON bids(idea_id);
CREATE INDEX IF NOT EXISTS idx_bids_builder ON bids(builder_id);
CREATE INDEX IF NOT EXISTS idx_users_wallet ON users(wallet_address);
