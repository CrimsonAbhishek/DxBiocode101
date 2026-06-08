import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

let isFallbackMode = false;
const DB_JSON_PATH = path.resolve(__dirname, '../../db.json');

// Ensure db.json exists with correct empty arrays if we are in fallback mode
function initDbJson() {
  if (!fs.existsSync(DB_JSON_PATH)) {
    fs.writeFileSync(DB_JSON_PATH, JSON.stringify({
      quotes: [],
      contacts: [],
      career_applications: [],
      training_requests: []
    }, null, 2));
  }
}

function readDbJson(): any {
  initDbJson();
  try {
    const data = fs.readFileSync(DB_JSON_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    return { quotes: [], contacts: [], career_applications: [], training_requests: [] };
  }
}

function writeDbJson(data: any): void {
  fs.writeFileSync(DB_JSON_PATH, JSON.stringify(data, null, 2));
}

// Create real pool
const realPool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'dxbiocode',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Proxy handler for pool
const poolProxy = {
  async execute(sql: string, params?: any[]): Promise<any> {
    if (isFallbackMode) {
      return fallbackExecute(sql, params);
    }
    try {
      return await realPool.execute(sql, params);
    } catch (err: any) {
      if (isConnectionError(err)) {
        console.warn(`⚠️ MySQL connection error on query. Switching to local JSON fallback: ${err.message}`);
        isFallbackMode = true;
        return fallbackExecute(sql, params);
      }
      throw err;
    }
  },
  async query(sql: string, params?: any[]): Promise<any> {
    if (isFallbackMode) {
      return fallbackExecute(sql, params);
    }
    try {
      return await realPool.query(sql, params);
    } catch (err: any) {
      if (isConnectionError(err)) {
        console.warn(`⚠️ MySQL connection error on query. Switching to local JSON fallback: ${err.message}`);
        isFallbackMode = true;
        return fallbackExecute(sql, params);
      }
      throw err;
    }
  },
  async getConnection(): Promise<any> {
    if (isFallbackMode) {
      return {
        execute: (sql: string, params?: any[]) => fallbackExecute(sql, params),
        query: (sql: string, params?: any[]) => fallbackExecute(sql, params),
        release: () => {},
      };
    }
    try {
      return await realPool.getConnection();
    } catch (err: any) {
      if (isConnectionError(err)) {
        console.warn(`⚠️ MySQL connection error. Switching to local JSON fallback: ${err.message}`);
        isFallbackMode = true;
        return {
          execute: (sql: string, params?: any[]) => fallbackExecute(sql, params),
          query: (sql: string, params?: any[]) => fallbackExecute(sql, params),
          release: () => {},
        };
      }
      throw err;
    }
  }
};

function isConnectionError(err: any): boolean {
  return err.code === 'ECONNREFUSED' || err.code === 'ENOTFOUND' || err.code === 'ETIMEDOUT' || err.code === 'ER_ACCESS_DENIED_ERROR';
}

function fallbackExecute(sql: string, params?: any[]): any {
  const queryLower = sql.trim().toLowerCase();
  
  // Handle database creation and table structure queries in fallback mode gracefully
  if (
    queryLower.startsWith('create database') ||
    queryLower.startsWith('use ') ||
    queryLower.startsWith('create table') ||
    queryLower.startsWith('alter table')
  ) {
    return [{}, []];
  }

  const dbData = readDbJson();

  if (queryLower.startsWith('insert into')) {
    // Determine table
    let table = '';
    if (queryLower.includes('quotes')) table = 'quotes';
    else if (queryLower.includes('contacts')) table = 'contacts';
    else if (queryLower.includes('career_applications')) table = 'career_applications';
    else if (queryLower.includes('training_requests')) table = 'training_requests';

    if (!table) {
      throw new Error(`Fallback DB: Unsupported insert statement: ${sql}`);
    }

    const insertId = Date.now() + Math.floor(Math.random() * 1000);
    const newRecord: any = { id: insertId, created_at: new Date().toISOString() };

    // Fill in columns based on params and table
    if (table === 'quotes' && params) {
      // name, email, phone, organization, designation, facility_type, timeline, message, items_json
      newRecord.name = params[0];
      newRecord.email = params[1];
      newRecord.phone = params[2];
      newRecord.organization = params[3];
      newRecord.designation = params[4];
      newRecord.facility_type = params[5];
      newRecord.timeline = params[6];
      newRecord.message = params[7];
      newRecord.items_json = params[8];
    } else if (table === 'contacts' && params) {
      // name, email, phone, organization, enquiry_type, message
      newRecord.name = params[0];
      newRecord.email = params[1];
      newRecord.phone = params[2];
      newRecord.organization = params[3];
      newRecord.enquiry_type = params[4];
      newRecord.message = params[5];
    } else if (table === 'career_applications' && params) {
      // first_name, last_name, email, phone, position, experience, cover_letter, resume_url, resume_filename
      newRecord.first_name = params[0];
      newRecord.last_name = params[1];
      newRecord.email = params[2];
      newRecord.phone = params[3];
      newRecord.position = params[4];
      newRecord.experience = params[5];
      newRecord.cover_letter = params[6];
      newRecord.resume_url = params[7];
      newRecord.resume_filename = params[8];
    } else if (table === 'training_requests' && params) {
      // name, email, phone, location, organization, training_category, message
      newRecord.name = params[0];
      newRecord.email = params[1];
      newRecord.phone = params[2];
      newRecord.location = params[3];
      newRecord.organization = params[4];
      newRecord.training_category = params[5];
      newRecord.message = params[6];
    }

    dbData[table].push(newRecord);
    writeDbJson(dbData);

    return [{ insertId }, []];
  } else if (queryLower.startsWith('select')) {
    // Determine table
    let table = '';
    if (queryLower.includes('quotes')) table = 'quotes';
    else if (queryLower.includes('contacts')) table = 'contacts';
    else if (queryLower.includes('career_applications')) table = 'career_applications';
    else if (queryLower.includes('training_requests')) table = 'training_requests';

    if (!table) {
      throw new Error(`Fallback DB: Unsupported select statement: ${sql}`);
    }

    // Sort by created_at desc
    const rows = [...dbData[table]].sort((a: any, b: any) => {
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });

    return [rows, []];
  }

  throw new Error(`Fallback DB: Unsupported query: ${sql}`);
}

export async function testConnection(): Promise<void> {
  try {
    const conn = await realPool.getConnection();
    console.log('✅ MySQL connected successfully');
    conn.release();
  } catch (err: any) {
    console.warn(`⚠️ MySQL connection failed: ${err.message}. Running in fallback JSON-file database mode.`);
    isFallbackMode = true;
    initDbJson();
  }
}

export default poolProxy as unknown as mysql.Pool;
