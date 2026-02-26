import pg from 'pg';
const { Pool } = pg;

// Supabase connection via DATABASE_URL
// Uses Supabase's connection pooler (port 6543) or direct (port 5432)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  max: 5,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
});

export default pool;
