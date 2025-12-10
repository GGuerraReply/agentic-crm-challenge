/**
 * Company entity mapper
 * Converts between application Company type and database DbCompany type
 */

import { Company } from '@/crm/types/company';
import { DbCompany } from '../types';

/**
 * Convert Company (app) to DbCompany (database)
 */
export function toDbCompany(company: Company): DbCompany {
  return {
    id: company.id,
    logo: company.logo || null,
    name: company.name,
    domain: company.domain || null,
    email: company.email || null,
    phone: company.phone || null,
    description: company.description || null,
    address: company.address || null,
    state: company.state || null,
    city: company.city || null,
    zip: company.zip || null,
    country: company.country || null,
    angel_list: company.angelList || null,
    linkedin: company.linkedin || null,
    connection_strength_id: company.connectionStrengthId || null,
    x: company.x || null,
    instagram: company.instagram || null,
    facebook: company.facebook || null,
    telegram: company.telegram || null,
    founded_at: company.foundedAt ? company.foundedAt.getTime() : null,
    estimated_arr_id: company.estimatedArrId || null,
    employee_range_id: company.employeeRangeId || null,
    last_interaction_at: company.lastInteractionAt ? company.lastInteractionAt.getTime() : null,
    last_contacted: company.lastContacted || null,
    team_id: company.teamId || null,
    badge: company.badge ? JSON.stringify(company.badge) : null,
    created_at: company.createdAt.getTime(),
    updated_at: company.updatedAt.getTime(),
  };
}

/**
 * Convert DbCompany (database) to Company (app)
 */
export function fromDbCompany(dbCompany: DbCompany): Company {
  let badge: Company['badge'] = undefined;
  
  if (dbCompany.badge) {
    try {
      badge = JSON.parse(dbCompany.badge);
    } catch (error) {
      console.warn('Failed to parse badge JSON:', error);
    }
  }

  return {
    id: dbCompany.id,
    logo: dbCompany.logo || undefined,
    name: dbCompany.name,
    domain: dbCompany.domain || undefined,
    email: dbCompany.email || undefined,
    phone: dbCompany.phone || undefined,
    description: dbCompany.description || undefined,
    // Note: categoryIds and contactIds are stored in junction tables, not here
    categoryIds: undefined,
    contactIds: undefined,
    address: dbCompany.address || undefined,
    state: dbCompany.state || undefined,
    city: dbCompany.city || undefined,
    zip: dbCompany.zip || undefined,
    country: dbCompany.country || undefined,
    angelList: dbCompany.angel_list || undefined,
    linkedin: dbCompany.linkedin || undefined,
    connectionStrengthId: dbCompany.connection_strength_id || undefined,
    x: dbCompany.x || undefined,
    instagram: dbCompany.instagram || undefined,
    facebook: dbCompany.facebook || undefined,
    telegram: dbCompany.telegram || undefined,
    foundedAt: dbCompany.founded_at ? new Date(dbCompany.founded_at) : undefined,
    estimatedArrId: dbCompany.estimated_arr_id || undefined,
    employeeRangeId: dbCompany.employee_range_id || undefined,
    lastInteractionAt: dbCompany.last_interaction_at ? new Date(dbCompany.last_interaction_at) : undefined,
    lastContacted: dbCompany.last_contacted || undefined,
    teamId: dbCompany.team_id || undefined,
    badge,
    createdAt: new Date(dbCompany.created_at),
    updatedAt: new Date(dbCompany.updated_at),
  };
}
