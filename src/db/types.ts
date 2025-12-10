/**
 * Database-specific TypeScript types
 * 
 * These interfaces represent the database row structure (primitives only).
 * They differ from application types which use Date objects, arrays, etc.
 */

// Main Entity Database Types

export interface DbContact {
  id: string;
  avatar: string | null;
  initials: string | null;
  name: string;
  email: string | null;
  phone: string | null;
  position: string | null;
  company_id: string | null;
  address: string | null;
  state: string | null;
  city: string | null;
  zip: string | null;
  country: string | null;
  social_links: string | null; // JSON string
  created_at: number; // Unix timestamp ms
  updated_at: number; // Unix timestamp ms
}

export interface DbCompany {
  id: string;
  logo: string | null;
  name: string;
  domain: string | null;
  email: string | null;
  phone: string | null;
  description: string | null;
  address: string | null;
  state: string | null;
  city: string | null;
  zip: string | null;
  country: string | null;
  angel_list: string | null;
  linkedin: string | null;
  connection_strength_id: string | null;
  x: string | null;
  instagram: string | null;
  facebook: string | null;
  telegram: string | null;
  founded_at: number | null; // Unix timestamp ms
  estimated_arr_id: string | null;
  employee_range_id: string | null;
  last_interaction_at: number | null; // Unix timestamp ms
  last_contacted: string | null;
  team_id: string | null;
  badge: string | null; // JSON string {name, state}
  created_at: number; // Unix timestamp ms
  updated_at: number; // Unix timestamp ms
}

export interface DbDeal {
  id: string;
  title: string;
  content: string;
  user_name: string;
  avatar: string | null;
  status: string | null;
  priority: string | null;
  due_at: number; // Unix timestamp ms
  completed_at: number | null; // Unix timestamp ms
  completed_by: string | null;
  comments: number;
  amount: number | null;
  currency: string | null;
  payment_date: number | null; // Unix timestamp ms
  payment_type: string | null;
  contract_number: string | null;
  discount: number | null;
  created_at: number; // Unix timestamp ms
  updated_at: number; // Unix timestamp ms
}

export interface DbTask {
  id: string;
  title: string;
  content: string;
  created_by: string;
  status: string | null;
  priority: string | null;
  due_at: number; // Unix timestamp ms
  completed_at: number | null; // Unix timestamp ms
  completed_by: string | null;
  created_at: number; // Unix timestamp ms
  updated_at: number; // Unix timestamp ms
}

export interface DbNote {
  id: string;
  title: string;
  content: string;
  created_by: string;
  status: string;
  logo: string | null;
  due_at: number; // Unix timestamp ms
  completed_at: number | null; // Unix timestamp ms
  completed_by: string | null;
  created_at: number; // Unix timestamp ms
  updated_at: number; // Unix timestamp ms
}

// Lookup Table Database Types

export interface DbCategory {
  id: string;
  name: string;
  color: string | null;
  bullet: string | null;
  description: string | null;
}

export interface DbConnectionStrength {
  id: string;
  name: string;
  color: string | null;
}

export interface DbEmployeeRange {
  id: string;
  label: string;
}

export interface DbEstimatedArr {
  id: string;
  label: string;
}

// Junction Table Database Types

export interface DbCompanyContact {
  company_id: string;
  contact_id: string;
}

export interface DbCompanyCategory {
  company_id: string;
  category_id: string;
}

export interface DbDealCompany {
  deal_id: string;
  company_id: string;
}

export interface DbDealContact {
  deal_id: string;
  contact_id: string;
}

export interface DbDealRelatedDeal {
  deal_id: string;
  related_deal_id: string;
}

export interface DbTaskCompany {
  task_id: string;
  company_id: string;
}

export interface DbTaskContact {
  task_id: string;
  contact_id: string;
}

export interface DbTaskDeal {
  task_id: string;
  deal_id: string;
}

export interface DbTaskAssignedContact {
  task_id: string;
  contact_id: string;
}

export interface DbNoteCompany {
  note_id: string;
  company_id: string;
}

export interface DbNoteAssignedContact {
  note_id: string;
  contact_id: string;
}

export interface DbNoteDeal {
  note_id: string;
  deal_id: string;
}

// Schema Version Type

export interface DbSchemaVersion {
  version: number;
  applied_at: number; // Unix timestamp ms
}

// Query Result Types (for type-safe query returns)

export type QueryResult<T> = T[];

export interface QueryExecResult {
  columns: string[];
  values: unknown[][];
}
