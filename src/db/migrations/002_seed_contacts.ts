/**
 * Migration 002: Seed Contacts
 * Imports contacts from mock data
 */

import { Database } from 'sql.js';
import { mockContacts } from '@/crm/mock/contacts';
import { ContactRepository } from '../repositories/contact-repository';
import type { Migration } from '../migrations';

export const migration002: Migration = {
  version: 2,
  name: 'seed_contacts',

  async up(db: Database): Promise<void> {
    const repo = new ContactRepository(db);
    let imported = 0;

    for (const mockContact of mockContacts) {
      try {
        const contact = {
          ...mockContact,
          id: mockContact.id || crypto.randomUUID(),
        };

        await repo.create(contact);
        imported++;
      } catch (error) {
        console.warn(`Failed to import contact ${mockContact.name}:`, error);
      }
    }

    console.log(`✅ Imported ${imported} contacts`);
  },

  async down(db: Database): Promise<void> {
    db.run('DELETE FROM contacts');
    db.run('DELETE FROM company_contacts');
    console.log('✅ Contacts cleared');
  },
};
