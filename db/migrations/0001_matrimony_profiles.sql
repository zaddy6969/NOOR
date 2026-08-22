CREATE TABLE IF NOT EXISTS matrimony_profiles (
  clerk_user_id TEXT PRIMARY KEY,
  display_name VARCHAR(60) NOT NULL,
  gender VARCHAR(20) NOT NULL,
  birth_year INTEGER NOT NULL,
  city VARCHAR(80) NOT NULL,
  country VARCHAR(80) NOT NULL,
  marital_status VARCHAR(24) NOT NULL,
  education VARCHAR(120) NOT NULL DEFAULT '',
  profession VARCHAR(120) NOT NULL DEFAULT '',
  religious_practice VARCHAR(240) NOT NULL DEFAULT '',
  guardian_involved BOOLEAN NOT NULL DEFAULT FALSE,
  bio VARCHAR(600) NOT NULL DEFAULT '',
  profile_visibility VARCHAR(20) NOT NULL DEFAULT 'private',
  moderation_status VARCHAR(24) NOT NULL DEFAULT 'draft',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT matrimony_profiles_adult_year CHECK (birth_year BETWEEN 1900 AND 2100),
  CONSTRAINT matrimony_profiles_private CHECK (profile_visibility = 'private')
);

CREATE INDEX IF NOT EXISTS matrimony_profiles_moderation_idx
ON matrimony_profiles (moderation_status, updated_at DESC);
