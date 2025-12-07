import initSqlJs, { Database, SqlJsStatic } from 'sql.js';

let SQL: SqlJsStatic | null = null;
let db: Database | null = null;

const DB_KEY = 'crm_database';

/**
 * Initialize the SQL.js library and database
 */
export async function initDatabase(): Promise<Database> {
  if (db) {
    return db;
  }

  if (!SQL) {
    SQL = await initSqlJs({
      locateFile: (file) => `https://sql.js.org/dist/${file}`,
    });
  }

  // Try to load existing database from localStorage
  const savedDb = localStorage.getItem(DB_KEY);
  if (savedDb) {
    try {
      const buffer = Uint8Array.from(atob(savedDb), (c) => c.charCodeAt(0));
      db = new SQL.Database(buffer);
      console.log('Database loaded from localStorage');
      return db;
    } catch (error) {
      console.error('Error loading database from localStorage:', error);
    }
  }

  // Create new database
  db = new SQL.Database();
  await createSchema();
  saveDatabase();
  console.log('New database created');

  return db;
}

/**
 * Create database schema
 */
async function createSchema(): Promise<void> {
  if (!db) throw new Error('Database not initialized');

  // Contacts table
  db.run(`
    CREATE TABLE IF NOT EXISTS contacts (
      id TEXT PRIMARY KEY,
      avatar TEXT,
      initials TEXT,
      name TEXT NOT NULL,
      email TEXT,
      phone TEXT,
      position TEXT,
      company TEXT,
      address TEXT,
      state TEXT,
      city TEXT,
      zip TEXT,
      country TEXT,
      social_links TEXT,
      logo TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    )
  `);

  // Companies table
  db.run(`
    CREATE TABLE IF NOT EXISTS companies (
      id TEXT PRIMARY KEY,
      logo TEXT,
      name TEXT NOT NULL,
      domain TEXT,
      email TEXT,
      phone TEXT,
      description TEXT,
      category_ids TEXT,
      contact_ids TEXT,
      address TEXT,
      state TEXT,
      city TEXT,
      zip TEXT,
      country TEXT,
      angel_list TEXT,
      linkedin TEXT,
      connection_strength_id TEXT,
      x TEXT,
      instagram TEXT,
      facebook TEXT,
      telegram TEXT,
      founded_at TEXT,
      estimated_arr_id TEXT,
      employee_range_id TEXT,
      last_interaction_at TEXT,
      last_contacted TEXT,
      team_id TEXT,
      badge_name TEXT,
      badge_state TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    )
  `);

  // Deals table
  db.run(`
    CREATE TABLE IF NOT EXISTS deals (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      company_ids TEXT,
      contact_ids TEXT,
      deal_ids TEXT,
      user_name TEXT NOT NULL,
      due_at TEXT NOT NULL,
      completed_at TEXT,
      completed_by TEXT,
      assigned_contact_ids TEXT,
      status TEXT,
      priority TEXT,
      comments INTEGER,
      amount REAL,
      currency TEXT,
      payment_date TEXT,
      payment_type TEXT,
      contract_number TEXT,
      discount REAL,
      avatar TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    )
  `);

  // Tasks table
  db.run(`
    CREATE TABLE IF NOT EXISTS tasks (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      company_ids TEXT,
      contact_ids TEXT,
      deal_ids TEXT,
      created_by TEXT NOT NULL,
      due_at TEXT NOT NULL,
      completed_at TEXT,
      completed_by TEXT,
      assigned_contact_ids TEXT,
      status TEXT,
      priority TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    )
  `);

  // Notes table
  db.run(`
    CREATE TABLE IF NOT EXISTS notes (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      created_by TEXT NOT NULL,
      due_at TEXT NOT NULL,
      status TEXT NOT NULL,
      assigned_contact_ids TEXT NOT NULL,
      company_ids TEXT NOT NULL,
      deal_ids TEXT,
      completed_at TEXT,
      completed_by TEXT,
      logo TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    )
  `);

  console.log('Database schema created');
}

/**
 * Save database to localStorage
 */
export function saveDatabase(): void {
  if (!db) return;

  try {
    const data = db.export();
    const buffer = btoa(String.fromCharCode(...data));
    localStorage.setItem(DB_KEY, buffer);
    console.log('Database saved to localStorage');
  } catch (error) {
    console.error('Error saving database:', error);
  }
}

/**
 * Get database instance
 */
export function getDatabase(): Database {
  if (!db) {
    throw new Error('Database not initialized. Call initDatabase() first.');
  }
  return db;
}

/**
 * Clear database
 */
export function clearDatabase(): void {
  localStorage.removeItem(DB_KEY);
  db = null;
  console.log('Database cleared');
}
