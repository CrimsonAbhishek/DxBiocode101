import fs from 'fs';
import path from 'path';
import pool from './connection';
import dotenv from 'dotenv';

dotenv.config();

async function migrate(): Promise<void> {
  console.log('🔄 Running database migration...');
  const sql = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf-8');

  // Split on semicolons, filter empty statements
  const statements = sql
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0 && !s.startsWith('--'));

  for (const stmt of statements) {
    try {
      await pool.execute(stmt);
      const preview = stmt.substring(0, 60).replace(/\n/g, ' ');
      console.log(`  ✅ ${preview}...`);
    } catch (err: any) {
      // Ignore "already exists" errors
      if (err.code !== 'ER_TABLE_EXISTS_ERROR' && err.code !== 'ER_DB_CREATE_EXISTS') {
        throw err;
      }
    }
  }

  console.log('✅ Migration complete!');
  process.exit(0);
}

migrate().catch(err => {
  console.error('❌ Migration failed:', err);
  process.exit(1);
});
