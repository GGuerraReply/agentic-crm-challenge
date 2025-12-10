/**
 * Migration 003: Seed Companies
 * Imports companies from mock data with relationships
 */

import { Database } from 'sql.js';
import { COMPANIES } from '@/crm/mock/companies';
import { CompanyRepository } from '../repositories/company-repository';
import type { Migration } from '../migrations';

export const migration003: Migration = {
  version: 3,
  name: 'seed_companies',

  async up(db: Database): Promise<void> {
    const repo = new CompanyRepository(db);
    let imported = 0;

    for (const mockCompany of COMPANIES) {
      try {
        const company = {
          ...mockCompany,
          id: mockCompany.id || crypto.randomUUID(),
        };

        await repo.create(company);

        // Add category relationships
        if (mockCompany.categoryIds) {
          for (const categoryId of mockCompany.categoryIds) {
            try {
              await repo.addCategory(company.id, categoryId);
            } catch (error) {
              console.warn(`Failed to add category ${categoryId} to company ${company.id}:`, error);
            }
          }
        }

        // Add contact relationships
        if (mockCompany.contactIds) {
          for (const contactId of mockCompany.contactIds) {
            try {
              await repo.addContact(company.id, contactId);
            } catch (error) {
              console.warn(`Failed to add contact ${contactId} to company ${company.id}:`, error);
            }
          }
        }

        imported++;
      } catch (error) {
        console.warn(`Failed to import company ${mockCompany.name}:`, error);
      }
    }

    console.log(`✅ Imported ${imported} companies`);
  },

  async down(db: Database): Promise<void> {
    db.run('DELETE FROM companies');
    db.run('DELETE FROM company_contacts');
    db.run('DELETE FROM company_categories');
    console.log('✅ Companies cleared');
  },
};
