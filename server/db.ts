import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "@shared/schema";

const { Pool } = pg;

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

// Hosted providers (Railway, Neon, Supabase, ...) require SSL in production.
// A self-hosted Postgres reached over a private Docker network doesn't have
// SSL configured, so DATABASE_SSL=false opts out of the production default.
const useSsl =
  process.env.DATABASE_SSL === "false"
    ? false
    : process.env.NODE_ENV === "production";

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: useSsl ? { rejectUnauthorized: false } : false,
});
export const db = drizzle(pool, { schema });
