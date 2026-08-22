import { neon } from "@neondatabase/serverless";

export type MatrimonyProfile = {
  displayName: string;
  gender: "man" | "woman" | "undisclosed";
  birthYear: number;
  city: string;
  country: string;
  maritalStatus: "never_married" | "divorced" | "widowed" | "other";
  education: string;
  profession: string;
  religiousPractice: string;
  guardianInvolved: boolean;
  bio: string;
  profileVisibility: "private";
  moderationStatus: "draft" | "pending_review" | "approved" | "rejected";
  updatedAt: string;
};

type ProfileInput = Omit<MatrimonyProfile, "profileVisibility" | "moderationStatus" | "updatedAt">;

let sqlClient: ReturnType<typeof neon> | null = null;
let schemaReady: Promise<void> | null = null;

function getSql() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not configured.");
  }
  sqlClient ??= neon(process.env.DATABASE_URL);
  return sqlClient;
}

async function ensureSchema() {
  if (!schemaReady) {
    const sql = getSql();
    schemaReady = (async () => {
      await sql`
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
        )
      `;
      await sql`
        CREATE INDEX IF NOT EXISTS matrimony_profiles_moderation_idx
        ON matrimony_profiles (moderation_status, updated_at DESC)
      `;
    })().catch((error) => {
      schemaReady = null;
      throw error;
    });
  }
  await schemaReady;
}

function mapProfile(row: Record<string, unknown>): MatrimonyProfile {
  return {
    displayName: String(row.display_name ?? ""),
    gender: String(row.gender ?? "undisclosed") as MatrimonyProfile["gender"],
    birthYear: Number(row.birth_year ?? new Date().getFullYear() - 18),
    city: String(row.city ?? ""),
    country: String(row.country ?? ""),
    maritalStatus: String(row.marital_status ?? "never_married") as MatrimonyProfile["maritalStatus"],
    education: String(row.education ?? ""),
    profession: String(row.profession ?? ""),
    religiousPractice: String(row.religious_practice ?? ""),
    guardianInvolved: Boolean(row.guardian_involved),
    bio: String(row.bio ?? ""),
    profileVisibility: "private",
    moderationStatus: String(row.moderation_status ?? "draft") as MatrimonyProfile["moderationStatus"],
    updatedAt: new Date(String(row.updated_at)).toISOString(),
  };
}

export async function getMatrimonyProfile(clerkUserId: string) {
  await ensureSchema();
  const sql = getSql();
  const rows = (await sql`
    SELECT display_name, gender, birth_year, city, country, marital_status,
      education, profession, religious_practice, guardian_involved, bio,
      profile_visibility, moderation_status, updated_at
    FROM matrimony_profiles
    WHERE clerk_user_id = ${clerkUserId}
    LIMIT 1
  `) as unknown as Record<string, unknown>[];
  const row = rows[0];
  return row ? mapProfile(row) : null;
}

export async function saveMatrimonyProfile(clerkUserId: string, profile: ProfileInput) {
  await ensureSchema();
  const sql = getSql();
  const rows = (await sql`
    INSERT INTO matrimony_profiles (
      clerk_user_id, display_name, gender, birth_year, city, country,
      marital_status, education, profession, religious_practice,
      guardian_involved, bio, profile_visibility, moderation_status
    ) VALUES (
      ${clerkUserId}, ${profile.displayName}, ${profile.gender}, ${profile.birthYear},
      ${profile.city}, ${profile.country}, ${profile.maritalStatus}, ${profile.education},
      ${profile.profession}, ${profile.religiousPractice}, ${profile.guardianInvolved},
      ${profile.bio}, 'private', 'draft'
    )
    ON CONFLICT (clerk_user_id) DO UPDATE SET
      display_name = EXCLUDED.display_name,
      gender = EXCLUDED.gender,
      birth_year = EXCLUDED.birth_year,
      city = EXCLUDED.city,
      country = EXCLUDED.country,
      marital_status = EXCLUDED.marital_status,
      education = EXCLUDED.education,
      profession = EXCLUDED.profession,
      religious_practice = EXCLUDED.religious_practice,
      guardian_involved = EXCLUDED.guardian_involved,
      bio = EXCLUDED.bio,
      profile_visibility = 'private',
      moderation_status = 'draft',
      updated_at = NOW()
    RETURNING display_name, gender, birth_year, city, country, marital_status,
      education, profession, religious_practice, guardian_involved, bio,
      profile_visibility, moderation_status, updated_at
  `) as unknown as Record<string, unknown>[];
  return mapProfile(rows[0]);
}
