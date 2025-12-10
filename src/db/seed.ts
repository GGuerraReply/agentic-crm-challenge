/**
 * Database seeding utilities
 * Populates database with mock data for testing and demonstration
 */

import { Database } from 'sql.js';
import { mockContacts } from '@/crm/mock/contacts';
import { COMPANIES } from '@/crm/mock/companies';
import { mockDeals } from '@/crm/mock/deals';
import { ContactRepository } from './repositories/contact-repository';
import { CompanyRepository } from './repositories/company-repository';
import { DealRepository } from './repositories/deal-repository';
import { saveDatabase } from './database';

/**
 * Seed lookup tables with reference data
 */
async function seedLookupTables(db: Database): Promise<void> {
  console.log('📊 Seeding lookup tables...');

  // Seed categories
  const categories = [
    { id: '1', name: 'Technology', color: 'blue', bullet: '●', description: 'Technology companies' },
    { id: '2', name: 'Finance', color: 'green', bullet: '●', description: 'Financial services' },
    { id: '3', name: 'Healthcare', color: 'red', bullet: '●', description: 'Healthcare providers' },
    { id: '4', name: 'Retail', color: 'purple', bullet: '●', description: 'Retail businesses' },
    { id: '5', name: 'Manufacturing', color: 'orange', bullet: '●', description: 'Manufacturing companies' },
  ];

  categories.forEach((category) => {
    db.run(
      'INSERT OR IGNORE INTO categories (id, name, color, bullet, description) VALUES (?, ?, ?, ?, ?)',
      [category.id, category.name, category.color, category.bullet, category.description]
    );
  });

  // Seed connection strengths
  const connectionStrengths = [
    { id: '1', name: 'Weak', color: 'bg-red-500' },
    { id: '2', name: 'Medium', color: 'bg-yellow-500' },
    { id: '3', name: 'Strong', color: 'bg-green-500' },
    { id: '4', name: 'Very Strong', color: 'bg-blue-500' },
    { id: '5', name: 'Extremely Strong', color: 'bg-purple-500' },
  ];

  connectionStrengths.forEach((strength) => {
    db.run(
      'INSERT OR IGNORE INTO connection_strengths (id, name, color) VALUES (?, ?, ?)',
      [strength.id, strength.name, strength.color]
    );
  });

  // Seed employee ranges
  const employeeRanges = [
    { id: '1', label: '1-10' },
    { id: '2', label: '11-50' },
    { id: '3', label: '51-200' },
    { id: '4', label: '201-500' },
    { id: '5', label: '501-1000' },
    { id: '6', label: '1000+' },
  ];

  employeeRanges.forEach((range) => {
    db.run(
      'INSERT OR IGNORE INTO employee_ranges (id, label) VALUES (?, ?)',
      [range.id, range.label]
    );
  });

  // Seed estimated ARRs
  const estimatedArrs = [
    { id: '1', label: '$0-$100K' },
    { id: '2', label: '$100K-$500K' },
    { id: '3', label: '$500K-$1M' },
    { id: '4', label: '$1M-$5M' },
    { id: '5', label: '$5M-$10M' },
    { id: '6', label: '$10M+' },
  ];

  estimatedArrs.forEach((arr) => {
    db.run(
      'INSERT OR IGNORE INTO estimated_arrs (id, label) VALUES (?, ?)',
      [arr.id, arr.label]
    );
  });

  console.log('✅ Lookup tables seeded');
}

/**
 * Seed contacts from mock data
 */
async function seedContacts(db: Database): Promise<void> {
  console.log('👥 Seeding contacts...');

  const contactRepo = new ContactRepository(db);

  for (const mockContact of mockContacts.slice(0, 20)) {
    // Limit to first 20 for demo
    try {
      // Ensure we have an ID
      const contact = {
        ...mockContact,
        id: mockContact.id || crypto.randomUUID(),
      };

      await contactRepo.create(contact);
    } catch (error) {
      console.warn(`Failed to seed contact ${mockContact.name}:`, error);
    }
  }

  console.log(`✅ Seeded ${Math.min(mockContacts.length, 20)} contacts`);
}

/**
 * Seed companies from mock data
 */
async function seedCompanies(db: Database): Promise<void> {
  console.log('🏢 Seeding companies...');

  const companyRepo = new CompanyRepository(db);

  for (const mockCompany of COMPANIES.slice(0, 20)) {
    // Limit to first 20 for demo
    try {
      // Ensure we have an ID
      const company = {
        ...mockCompany,
        id: mockCompany.id || crypto.randomUUID(),
      };

      await companyRepo.create(company);

      // Add categories if present
      if (mockCompany.categoryIds) {
        for (const categoryId of mockCompany.categoryIds) {
          await companyRepo.addCategory(company.id, categoryId);
        }
      }

      // Add contacts if present
      if (mockCompany.contactIds) {
        for (const contactId of mockCompany.contactIds) {
          await companyRepo.addContact(company.id, contactId);
        }
      }
    } catch (error) {
      console.warn(`Failed to seed company ${mockCompany.name}:`, error);
    }
  }

  console.log(`✅ Seeded ${Math.min(COMPANIES.length, 20)} companies`);
}

/**
 * Seed deals from mock data
 */
async function seedDeals(db: Database): Promise<void> {
  console.log('💼 Seeding deals...');

  const dealRepo = new DealRepository(db);

  for (const mockDeal of mockDeals.slice(0, 20)) {
    // Limit to first 20 for demo
    try {
      // Ensure we have an ID
      const deal = {
        ...mockDeal,
        id: mockDeal.id || crypto.randomUUID(),
      };

      await dealRepo.create(deal);

      // Add companies if present
      if (mockDeal.companyIds) {
        for (const companyId of mockDeal.companyIds) {
          await dealRepo.addCompany(deal.id, companyId);
        }
      }

      // Add contacts if present
      if (mockDeal.contactIds) {
        for (const contactId of mockDeal.contactIds) {
          await dealRepo.addContact(deal.id, contactId);
        }
      }
    } catch (error) {
      console.warn(`Failed to seed deal ${mockDeal.title}:`, error);
    }
  }

  console.log(`✅ Seeded ${Math.min(mockDeals.length, 20)} deals`);
}

/**
 * Seed all data into the database
 */
export async function seedDatabase(db: Database): Promise<void> {
  console.log('🌱 Starting database seeding...');

  try {
    await seedLookupTables(db);
    await seedContacts(db);
    await seedCompanies(db);
    await seedDeals(db);

    saveDatabase(db);
    console.log('🎉 Database seeding completed successfully!');
  } catch (error) {
    console.error('❌ Database seeding failed:', error);
    throw error;
  }
}

/**
 * Clear all data from the database (except schema)
 */
export async function clearDatabase(db: Database): Promise<void> {
  console.log('🗑️  Clearing database...');

  const tables = [
    // Junction tables first
    'company_contacts',
    'company_categories',
    'deal_companies',
    'deal_contacts',
    'deal_related_deals',
    'task_companies',
    'task_contacts',
    'task_deals',
    'task_assigned_contacts',
    'note_companies',
    'note_assigned_contacts',
    'note_deals',
    // Main tables
    'notes',
    'tasks',
    'deals',
    'contacts',
    'companies',
    // Lookup tables
    'categories',
    'connection_strengths',
    'employee_ranges',
    'estimated_arrs',
  ];

  tables.forEach((table) => {
    db.run(`DELETE FROM ${table}`);
  });

  saveDatabase(db);
  console.log('✅ Database cleared');
}
