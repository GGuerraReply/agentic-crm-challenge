import { Company } from '@/crm/types/company';
import { getDatabase, saveDatabase } from './db';

/**
 * Helper function to serialize array fields
 */
function serializeArray(arr?: string[]): string {
  return arr ? JSON.stringify(arr) : '[]';
}

/**
 * Helper function to deserialize array fields
 */
function deserializeArray(json: string): string[] | undefined {
  try {
    const parsed = JSON.parse(json);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : undefined;
  } catch {
    return undefined;
  }
}

/**
 * Get all companies
 */
export function getAllCompanies(): Company[] {
  const db = getDatabase();
  const result = db.exec('SELECT * FROM companies ORDER BY created_at DESC');

  if (result.length === 0) return [];

  const [{ columns, values }] = result;
  return values.map((row) => {
    const company: Record<string, unknown> = {};
    columns.forEach((col, index) => {
      company[col] = row[index];
    });

    return {
      id: company.id as string,
      logo: company.logo as string | undefined,
      name: company.name as string,
      domain: company.domain as string | undefined,
      email: company.email as string | undefined,
      phone: company.phone as string | undefined,
      description: company.description as string | undefined,
      categoryIds: deserializeArray(company.category_ids as string),
      contactIds: deserializeArray(company.contact_ids as string),
      address: company.address as string | undefined,
      state: company.state as string | undefined,
      city: company.city as string | undefined,
      zip: company.zip as string | undefined,
      country: company.country as string | undefined,
      angelList: company.angel_list as string | undefined,
      linkedin: company.linkedin as string | undefined,
      connectionStrengthId: company.connection_strength_id as string | undefined,
      x: company.x as string | undefined,
      instagram: company.instagram as string | undefined,
      facebook: company.facebook as string | undefined,
      telegram: company.telegram as string | undefined,
      foundedAt: company.founded_at ? new Date(company.founded_at as string) : undefined,
      estimatedArrId: company.estimated_arr_id as string | undefined,
      employeeRangeId: company.employee_range_id as string | undefined,
      lastInteractionAt: company.last_interaction_at
        ? new Date(company.last_interaction_at as string)
        : undefined,
      lastContacted: company.last_contacted as string | undefined,
      teamId: company.team_id as string | undefined,
      badge:
        company.badge_name && company.badge_state
          ? {
              name: company.badge_name as string,
              state: company.badge_state as string,
            }
          : undefined,
      createdAt: new Date(company.created_at as string),
      updatedAt: new Date(company.updated_at as string),
    };
  });
}

/**
 * Get company by ID
 */
export function getCompanyById(id: string): Company | null {
  const db = getDatabase();
  const result = db.exec('SELECT * FROM companies WHERE id = ?', [id]);

  if (result.length === 0) return null;

  const [{ columns, values }] = result;
  if (values.length === 0) return null;

  const row = values[0];
  const company: Record<string, unknown> = {};
  columns.forEach((col, index) => {
    company[col] = row[index];
  });

  return {
    id: company.id as string,
    logo: company.logo as string | undefined,
    name: company.name as string,
    domain: company.domain as string | undefined,
    email: company.email as string | undefined,
    phone: company.phone as string | undefined,
    description: company.description as string | undefined,
    categoryIds: deserializeArray(company.category_ids as string),
    contactIds: deserializeArray(company.contact_ids as string),
    address: company.address as string | undefined,
    state: company.state as string | undefined,
    city: company.city as string | undefined,
    zip: company.zip as string | undefined,
    country: company.country as string | undefined,
    angelList: company.angel_list as string | undefined,
    linkedin: company.linkedin as string | undefined,
    connectionStrengthId: company.connection_strength_id as string | undefined,
    x: company.x as string | undefined,
    instagram: company.instagram as string | undefined,
    facebook: company.facebook as string | undefined,
    telegram: company.telegram as string | undefined,
    foundedAt: company.founded_at ? new Date(company.founded_at as string) : undefined,
    estimatedArrId: company.estimated_arr_id as string | undefined,
    employeeRangeId: company.employee_range_id as string | undefined,
    lastInteractionAt: company.last_interaction_at
      ? new Date(company.last_interaction_at as string)
      : undefined,
    lastContacted: company.last_contacted as string | undefined,
    teamId: company.team_id as string | undefined,
    badge:
      company.badge_name && company.badge_state
        ? {
            name: company.badge_name as string,
            state: company.badge_state as string,
          }
        : undefined,
    createdAt: new Date(company.created_at as string),
    updatedAt: new Date(company.updated_at as string),
  };
}

/**
 * Create a new company
 */
export function createCompany(company: Company): void {
  const db = getDatabase();

  db.run(
    `INSERT INTO companies (
      id, logo, name, domain, email, phone, description,
      category_ids, contact_ids, address, state, city, zip, country,
      angel_list, linkedin, connection_strength_id, x, instagram,
      facebook, telegram, founded_at, estimated_arr_id, employee_range_id,
      last_interaction_at, last_contacted, team_id, badge_name, badge_state,
      created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      company.id,
      company.logo || null,
      company.name,
      company.domain || null,
      company.email || null,
      company.phone || null,
      company.description || null,
      serializeArray(company.categoryIds),
      serializeArray(company.contactIds),
      company.address || null,
      company.state || null,
      company.city || null,
      company.zip || null,
      company.country || null,
      company.angelList || null,
      company.linkedin || null,
      company.connectionStrengthId || null,
      company.x || null,
      company.instagram || null,
      company.facebook || null,
      company.telegram || null,
      company.foundedAt ? company.foundedAt.toISOString() : null,
      company.estimatedArrId || null,
      company.employeeRangeId || null,
      company.lastInteractionAt ? company.lastInteractionAt.toISOString() : null,
      company.lastContacted || null,
      company.teamId || null,
      company.badge?.name || null,
      company.badge?.state || null,
      company.createdAt.toISOString(),
      company.updatedAt.toISOString(),
    ],
  );

  saveDatabase();
}

/**
 * Update an existing company
 */
export function updateCompany(id: string, company: Partial<Company>): void {
  const db = getDatabase();
  const existing = getCompanyById(id);

  if (!existing) {
    throw new Error(`Company with id ${id} not found`);
  }

  const updated = {
    ...existing,
    ...company,
    updatedAt: new Date(),
  };

  db.run(
    `UPDATE companies SET
      logo = ?, name = ?, domain = ?, email = ?, phone = ?, description = ?,
      category_ids = ?, contact_ids = ?, address = ?, state = ?, city = ?, zip = ?,
      country = ?, angel_list = ?, linkedin = ?, connection_strength_id = ?, x = ?,
      instagram = ?, facebook = ?, telegram = ?, founded_at = ?, estimated_arr_id = ?,
      employee_range_id = ?, last_interaction_at = ?, last_contacted = ?, team_id = ?,
      badge_name = ?, badge_state = ?, updated_at = ?
    WHERE id = ?`,
    [
      updated.logo || null,
      updated.name,
      updated.domain || null,
      updated.email || null,
      updated.phone || null,
      updated.description || null,
      serializeArray(updated.categoryIds),
      serializeArray(updated.contactIds),
      updated.address || null,
      updated.state || null,
      updated.city || null,
      updated.zip || null,
      updated.country || null,
      updated.angelList || null,
      updated.linkedin || null,
      updated.connectionStrengthId || null,
      updated.x || null,
      updated.instagram || null,
      updated.facebook || null,
      updated.telegram || null,
      updated.foundedAt ? updated.foundedAt.toISOString() : null,
      updated.estimatedArrId || null,
      updated.employeeRangeId || null,
      updated.lastInteractionAt ? updated.lastInteractionAt.toISOString() : null,
      updated.lastContacted || null,
      updated.teamId || null,
      updated.badge?.name || null,
      updated.badge?.state || null,
      updated.updatedAt.toISOString(),
      id,
    ],
  );

  saveDatabase();
}

/**
 * Delete a company
 */
export function deleteCompany(id: string): void {
  const db = getDatabase();
  db.run('DELETE FROM companies WHERE id = ?', [id]);
  saveDatabase();
}
