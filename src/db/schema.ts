/**
 * SQLite Schema Definition for Agentic CRM Challenge
 * 
 * This file contains all CREATE TABLE statements for the CRM database.
 * Schema designed to run in-browser using sql.js.
 */

export const SCHEMA_VERSION = 1;

// Schema version tracking table
export const SCHEMA_VERSION_TABLE_DDL = `
CREATE TABLE IF NOT EXISTS schema_version (
  version INTEGER PRIMARY KEY,
  applied_at INTEGER NOT NULL
);
`;

// Main Entity Tables

export const CONTACTS_TABLE_DDL = `
CREATE TABLE IF NOT EXISTS contacts (
  id TEXT PRIMARY KEY,
  avatar TEXT,
  initials TEXT,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  position TEXT,
  company_id TEXT,
  address TEXT,
  state TEXT,
  city TEXT,
  zip TEXT,
  country TEXT,
  social_links TEXT,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  FOREIGN KEY (company_id) REFERENCES companies(id)
);
`;

export const COMPANIES_TABLE_DDL = `
CREATE TABLE IF NOT EXISTS companies (
  id TEXT PRIMARY KEY,
  logo TEXT,
  name TEXT NOT NULL,
  domain TEXT,
  email TEXT,
  phone TEXT,
  description TEXT,
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
  founded_at INTEGER,
  estimated_arr_id TEXT,
  employee_range_id TEXT,
  last_interaction_at INTEGER,
  last_contacted TEXT,
  team_id TEXT,
  badge TEXT,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  FOREIGN KEY (connection_strength_id) REFERENCES connection_strengths(id),
  FOREIGN KEY (estimated_arr_id) REFERENCES estimated_arrs(id),
  FOREIGN KEY (employee_range_id) REFERENCES employee_ranges(id)
);
`;

export const DEALS_TABLE_DDL = `
CREATE TABLE IF NOT EXISTS deals (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  user_name TEXT NOT NULL,
  avatar TEXT,
  status TEXT,
  priority TEXT,
  due_at INTEGER NOT NULL,
  completed_at INTEGER,
  completed_by TEXT,
  comments INTEGER DEFAULT 0,
  amount REAL,
  currency TEXT,
  payment_date INTEGER,
  payment_type TEXT,
  contract_number TEXT,
  discount REAL,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);
`;

export const TASKS_TABLE_DDL = `
CREATE TABLE IF NOT EXISTS tasks (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  created_by TEXT NOT NULL,
  status TEXT,
  priority TEXT,
  due_at INTEGER NOT NULL,
  completed_at INTEGER,
  completed_by TEXT,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);
`;

export const NOTES_TABLE_DDL = `
CREATE TABLE IF NOT EXISTS notes (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  created_by TEXT NOT NULL,
  status TEXT NOT NULL,
  logo TEXT,
  due_at INTEGER NOT NULL,
  completed_at INTEGER,
  completed_by TEXT,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);
`;

// Lookup Tables

export const CATEGORIES_TABLE_DDL = `
CREATE TABLE IF NOT EXISTS categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  color TEXT,
  bullet TEXT,
  description TEXT
);
`;

export const CONNECTION_STRENGTHS_TABLE_DDL = `
CREATE TABLE IF NOT EXISTS connection_strengths (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  color TEXT
);
`;

export const EMPLOYEE_RANGES_TABLE_DDL = `
CREATE TABLE IF NOT EXISTS employee_ranges (
  id TEXT PRIMARY KEY,
  label TEXT NOT NULL
);
`;

export const ESTIMATED_ARRS_TABLE_DDL = `
CREATE TABLE IF NOT EXISTS estimated_arrs (
  id TEXT PRIMARY KEY,
  label TEXT NOT NULL
);
`;

// Junction Tables for Many-to-Many Relationships

export const COMPANY_CONTACTS_TABLE_DDL = `
CREATE TABLE IF NOT EXISTS company_contacts (
  company_id TEXT NOT NULL,
  contact_id TEXT NOT NULL,
  PRIMARY KEY (company_id, contact_id),
  FOREIGN KEY (company_id) REFERENCES companies(id),
  FOREIGN KEY (contact_id) REFERENCES contacts(id)
);
`;

export const COMPANY_CATEGORIES_TABLE_DDL = `
CREATE TABLE IF NOT EXISTS company_categories (
  company_id TEXT NOT NULL,
  category_id TEXT NOT NULL,
  PRIMARY KEY (company_id, category_id),
  FOREIGN KEY (company_id) REFERENCES companies(id),
  FOREIGN KEY (category_id) REFERENCES categories(id)
);
`;

export const DEAL_COMPANIES_TABLE_DDL = `
CREATE TABLE IF NOT EXISTS deal_companies (
  deal_id TEXT NOT NULL,
  company_id TEXT NOT NULL,
  PRIMARY KEY (deal_id, company_id),
  FOREIGN KEY (deal_id) REFERENCES deals(id),
  FOREIGN KEY (company_id) REFERENCES companies(id)
);
`;

export const DEAL_CONTACTS_TABLE_DDL = `
CREATE TABLE IF NOT EXISTS deal_contacts (
  deal_id TEXT NOT NULL,
  contact_id TEXT NOT NULL,
  PRIMARY KEY (deal_id, contact_id),
  FOREIGN KEY (deal_id) REFERENCES deals(id),
  FOREIGN KEY (contact_id) REFERENCES contacts(id)
);
`;

export const DEAL_RELATED_DEALS_TABLE_DDL = `
CREATE TABLE IF NOT EXISTS deal_related_deals (
  deal_id TEXT NOT NULL,
  related_deal_id TEXT NOT NULL,
  PRIMARY KEY (deal_id, related_deal_id),
  FOREIGN KEY (deal_id) REFERENCES deals(id),
  FOREIGN KEY (related_deal_id) REFERENCES deals(id)
);
`;

export const TASK_COMPANIES_TABLE_DDL = `
CREATE TABLE IF NOT EXISTS task_companies (
  task_id TEXT NOT NULL,
  company_id TEXT NOT NULL,
  PRIMARY KEY (task_id, company_id),
  FOREIGN KEY (task_id) REFERENCES tasks(id),
  FOREIGN KEY (company_id) REFERENCES companies(id)
);
`;

export const TASK_CONTACTS_TABLE_DDL = `
CREATE TABLE IF NOT EXISTS task_contacts (
  task_id TEXT NOT NULL,
  contact_id TEXT NOT NULL,
  PRIMARY KEY (task_id, contact_id),
  FOREIGN KEY (task_id) REFERENCES tasks(id),
  FOREIGN KEY (contact_id) REFERENCES contacts(id)
);
`;

export const TASK_DEALS_TABLE_DDL = `
CREATE TABLE IF NOT EXISTS task_deals (
  task_id TEXT NOT NULL,
  deal_id TEXT NOT NULL,
  PRIMARY KEY (task_id, deal_id),
  FOREIGN KEY (task_id) REFERENCES tasks(id),
  FOREIGN KEY (deal_id) REFERENCES deals(id)
);
`;

export const TASK_ASSIGNED_CONTACTS_TABLE_DDL = `
CREATE TABLE IF NOT EXISTS task_assigned_contacts (
  task_id TEXT NOT NULL,
  contact_id TEXT NOT NULL,
  PRIMARY KEY (task_id, contact_id),
  FOREIGN KEY (task_id) REFERENCES tasks(id),
  FOREIGN KEY (contact_id) REFERENCES contacts(id)
);
`;

export const NOTE_COMPANIES_TABLE_DDL = `
CREATE TABLE IF NOT EXISTS note_companies (
  note_id TEXT NOT NULL,
  company_id TEXT NOT NULL,
  PRIMARY KEY (note_id, company_id),
  FOREIGN KEY (note_id) REFERENCES notes(id),
  FOREIGN KEY (company_id) REFERENCES companies(id)
);
`;

export const NOTE_ASSIGNED_CONTACTS_TABLE_DDL = `
CREATE TABLE IF NOT EXISTS note_assigned_contacts (
  note_id TEXT NOT NULL,
  contact_id TEXT NOT NULL,
  PRIMARY KEY (note_id, contact_id),
  FOREIGN KEY (note_id) REFERENCES notes(id),
  FOREIGN KEY (contact_id) REFERENCES contacts(id)
);
`;

export const NOTE_DEALS_TABLE_DDL = `
CREATE TABLE IF NOT EXISTS note_deals (
  note_id TEXT NOT NULL,
  deal_id TEXT NOT NULL,
  PRIMARY KEY (note_id, deal_id),
  FOREIGN KEY (note_id) REFERENCES notes(id),
  FOREIGN KEY (deal_id) REFERENCES deals(id)
);
`;

// Indexes for improved query performance

export const INDEXES_DDL = [
  'CREATE INDEX IF NOT EXISTS idx_contacts_email ON contacts(email);',
  'CREATE INDEX IF NOT EXISTS idx_contacts_company_id ON contacts(company_id);',
  'CREATE INDEX IF NOT EXISTS idx_contacts_created_at ON contacts(created_at);',
  'CREATE INDEX IF NOT EXISTS idx_companies_name ON companies(name);',
  'CREATE INDEX IF NOT EXISTS idx_companies_domain ON companies(domain);',
  'CREATE INDEX IF NOT EXISTS idx_companies_created_at ON companies(created_at);',
  'CREATE INDEX IF NOT EXISTS idx_companies_country ON companies(country);',
  'CREATE INDEX IF NOT EXISTS idx_deals_status ON deals(status);',
  'CREATE INDEX IF NOT EXISTS idx_deals_priority ON deals(priority);',
  'CREATE INDEX IF NOT EXISTS idx_deals_due_at ON deals(due_at);',
  'CREATE INDEX IF NOT EXISTS idx_deals_created_at ON deals(created_at);',
  'CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);',
  'CREATE INDEX IF NOT EXISTS idx_tasks_due_at ON tasks(due_at);',
  'CREATE INDEX IF NOT EXISTS idx_tasks_created_by ON tasks(created_by);',
  'CREATE INDEX IF NOT EXISTS idx_notes_status ON notes(status);',
  'CREATE INDEX IF NOT EXISTS idx_notes_created_by ON notes(created_by);',
];

// Complete schema DDL - ordered for proper foreign key dependencies
export const SCHEMA_DDL = [
  SCHEMA_VERSION_TABLE_DDL,
  // Lookup tables first (no dependencies)
  CATEGORIES_TABLE_DDL,
  CONNECTION_STRENGTHS_TABLE_DDL,
  EMPLOYEE_RANGES_TABLE_DDL,
  ESTIMATED_ARRS_TABLE_DDL,
  // Main tables (with foreign keys to lookup tables)
  COMPANIES_TABLE_DDL,
  CONTACTS_TABLE_DDL,
  DEALS_TABLE_DDL,
  TASKS_TABLE_DDL,
  NOTES_TABLE_DDL,
  // Junction tables (depend on main tables)
  COMPANY_CONTACTS_TABLE_DDL,
  COMPANY_CATEGORIES_TABLE_DDL,
  DEAL_COMPANIES_TABLE_DDL,
  DEAL_CONTACTS_TABLE_DDL,
  DEAL_RELATED_DEALS_TABLE_DDL,
  TASK_COMPANIES_TABLE_DDL,
  TASK_CONTACTS_TABLE_DDL,
  TASK_DEALS_TABLE_DDL,
  TASK_ASSIGNED_CONTACTS_TABLE_DDL,
  NOTE_COMPANIES_TABLE_DDL,
  NOTE_ASSIGNED_CONTACTS_TABLE_DDL,
  NOTE_DEALS_TABLE_DDL,
  // Indexes last
  ...INDEXES_DDL,
];
