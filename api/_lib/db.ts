import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from '../../drizzle/schema';

// Export db as optional or null if DATABASE_URL is not set to prevent startup crashes
export const db = process.env.DATABASE_URL
  ? drizzle(neon(process.env.DATABASE_URL), { schema })
  : null;

export type DB = typeof db;

