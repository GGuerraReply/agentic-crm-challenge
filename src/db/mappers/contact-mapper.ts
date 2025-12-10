/**
 * Contact entity mapper
 * Converts between application Contact type and database DbContact type
 */

import { Contact } from '@/crm/types/contact';
import { DbContact } from '../types';

/**
 * Convert Contact (app) to DbContact (database)
 */
export function toDbContact(contact: Contact): DbContact {
  return {
    id: contact.id,
    avatar: contact.avatar || null,
    initials: contact.initials || null,
    name: contact.name,
    email: contact.email || null,
    phone: contact.phone || null,
    position: contact.position || null,
    company_id: contact.company || null, // Note: Contact.company is string (company name), needs proper ID mapping
    address: contact.address || null,
    state: contact.state || null,
    city: contact.city || null,
    zip: contact.zip || null,
    country: contact.country || null,
    social_links: contact.socialLinks ? JSON.stringify(contact.socialLinks) : null,
    created_at: contact.createdAt.getTime(),
    updated_at: contact.updatedAt.getTime(),
  };
}

/**
 * Convert DbContact (database) to Contact (app)
 */
export function fromDbContact(dbContact: DbContact): Contact {
  let socialLinks: Contact['socialLinks'] = undefined;
  
  if (dbContact.social_links) {
    try {
      socialLinks = JSON.parse(dbContact.social_links);
    } catch (error) {
      console.warn('Failed to parse social_links JSON:', error);
    }
  }

  return {
    id: dbContact.id,
    avatar: dbContact.avatar || '',
    initials: dbContact.initials || undefined,
    name: dbContact.name,
    email: dbContact.email || undefined,
    phone: dbContact.phone || undefined,
    position: dbContact.position || undefined,
    company: dbContact.company_id || undefined, // Note: Should be resolved to company name
    address: dbContact.address || undefined,
    state: dbContact.state || undefined,
    city: dbContact.city || undefined,
    zip: dbContact.zip || undefined,
    country: dbContact.country || undefined,
    socialLinks,
    createdAt: new Date(dbContact.created_at),
    updatedAt: new Date(dbContact.updated_at),
  };
}
