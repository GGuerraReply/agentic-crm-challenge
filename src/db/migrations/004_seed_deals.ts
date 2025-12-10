/**
 * Migration 004: Seed Deals
 * Imports deals from mock data with relationships
 */

import { Database } from 'sql.js';
import { mockDeals } from '@/crm/mock/deals';
import { DealRepository } from '../repositories/deal-repository';
import type { Migration } from '../migrations';

export const migration004: Migration = {
  version: 4,
  name: 'seed_deals',

  async up(db: Database): Promise<void> {
    const repo = new DealRepository(db);
    let imported = 0;

    for (const mockDeal of mockDeals) {
      try {
        const deal = {
          ...mockDeal,
          id: mockDeal.id || crypto.randomUUID(),
        };

        await repo.create(deal);

        // Add company relationships
        if (mockDeal.companyIds) {
          for (const companyId of mockDeal.companyIds) {
            try {
              await repo.addCompany(deal.id, companyId);
            } catch (error) {
              console.warn(`Failed to add company ${companyId} to deal ${deal.id}:`, error);
            }
          }
        }

        // Add contact relationships
        if (mockDeal.contactIds) {
          for (const contactId of mockDeal.contactIds) {
            try {
              await repo.addContact(deal.id, contactId);
            } catch (error) {
              console.warn(`Failed to add contact ${contactId} to deal ${deal.id}:`, error);
            }
          }
        }

        imported++;
      } catch (error) {
        console.warn(`Failed to import deal ${mockDeal.title}:`, error);
      }
    }

    console.log(`✅ Imported ${imported} deals`);
  },

  async down(db: Database): Promise<void> {
    db.run('DELETE FROM deals');
    db.run('DELETE FROM deal_companies');
    db.run('DELETE FROM deal_contacts');
    db.run('DELETE FROM deal_related_deals');
    console.log('✅ Deals cleared');
  },
};
