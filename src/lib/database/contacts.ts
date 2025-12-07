import { Contact } from '@/crm/types/contact';
import { getDatabase, saveDatabase } from './db';

/**
 * Helper function to serialize JSON fields
 */
function serializeSocialLinks(socialLinks?: Contact['socialLinks']): string {
  return socialLinks ? JSON.stringify(socialLinks) : '{}';
}

/**
 * Helper function to deserialize JSON fields
 */
function deserializeSocialLinks(json: string): Contact['socialLinks'] | undefined {
  try {
    const parsed = JSON.parse(json);
    return Object.keys(parsed).length > 0 ? parsed : undefined;
  } catch {
    return undefined;
  }
}

/**
 * Get all contacts
 */
export function getAllContacts(): Contact[] {
  const db = getDatabase();
  const result = db.exec('SELECT * FROM contacts ORDER BY created_at DESC');

  if (result.length === 0) return [];

  const [{ columns, values }] = result;
  return values.map((row) => {
    const contact: Record<string, unknown> = {};
    columns.forEach((col, index) => {
      contact[col] = row[index];
    });

    return {
      id: contact.id as string,
      avatar: contact.avatar as string,
      initials: contact.initials as string | undefined,
      name: contact.name as string,
      email: contact.email as string | undefined,
      phone: contact.phone as string | undefined,
      position: contact.position as string | undefined,
      company: contact.company as string | undefined,
      address: contact.address as string | undefined,
      state: contact.state as string | undefined,
      city: contact.city as string | undefined,
      zip: contact.zip as string | undefined,
      country: contact.country as string | undefined,
      socialLinks: deserializeSocialLinks(contact.social_links as string),
      logo: contact.logo as string | undefined,
      createdAt: new Date(contact.created_at as string),
      updatedAt: new Date(contact.updated_at as string),
    };
  });
}

/**
 * Get contact by ID
 */
export function getContactById(id: string): Contact | null {
  const db = getDatabase();
  const result = db.exec('SELECT * FROM contacts WHERE id = ?', [id]);

  if (result.length === 0) return null;

  const [{ columns, values }] = result;
  if (values.length === 0) return null;

  const row = values[0];
  const contact: Record<string, unknown> = {};
  columns.forEach((col, index) => {
    contact[col] = row[index];
  });

  return {
    id: contact.id as string,
    avatar: contact.avatar as string,
    initials: contact.initials as string | undefined,
    name: contact.name as string,
    email: contact.email as string | undefined,
    phone: contact.phone as string | undefined,
    position: contact.position as string | undefined,
    company: contact.company as string | undefined,
    address: contact.address as string | undefined,
    state: contact.state as string | undefined,
    city: contact.city as string | undefined,
    zip: contact.zip as string | undefined,
    country: contact.country as string | undefined,
    socialLinks: deserializeSocialLinks(contact.social_links as string),
    logo: contact.logo as string | undefined,
    createdAt: new Date(contact.created_at as string),
    updatedAt: new Date(contact.updated_at as string),
  };
}

/**
 * Create a new contact
 */
export function createContact(contact: Contact): void {
  const db = getDatabase();

  db.run(
    `INSERT INTO contacts (
      id, avatar, initials, name, email, phone, position, company,
      address, state, city, zip, country, social_links, logo,
      created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      contact.id,
      contact.avatar || '',
      contact.initials || null,
      contact.name,
      contact.email || null,
      contact.phone || null,
      contact.position || null,
      contact.company || null,
      contact.address || null,
      contact.state || null,
      contact.city || null,
      contact.zip || null,
      contact.country || null,
      serializeSocialLinks(contact.socialLinks),
      contact.logo || null,
      contact.createdAt.toISOString(),
      contact.updatedAt.toISOString(),
    ],
  );

  saveDatabase();
}

/**
 * Update an existing contact
 */
export function updateContact(id: string, contact: Partial<Contact>): void {
  const db = getDatabase();
  const existing = getContactById(id);

  if (!existing) {
    throw new Error(`Contact with id ${id} not found`);
  }

  const updated = {
    ...existing,
    ...contact,
    updatedAt: new Date(),
  };

  db.run(
    `UPDATE contacts SET
      avatar = ?, initials = ?, name = ?, email = ?, phone = ?,
      position = ?, company = ?, address = ?, state = ?, city = ?,
      zip = ?, country = ?, social_links = ?, logo = ?, updated_at = ?
    WHERE id = ?`,
    [
      updated.avatar || '',
      updated.initials || null,
      updated.name,
      updated.email || null,
      updated.phone || null,
      updated.position || null,
      updated.company || null,
      updated.address || null,
      updated.state || null,
      updated.city || null,
      updated.zip || null,
      updated.country || null,
      serializeSocialLinks(updated.socialLinks),
      updated.logo || null,
      updated.updatedAt.toISOString(),
      id,
    ],
  );

  saveDatabase();
}

/**
 * Delete a contact
 */
export function deleteContact(id: string): void {
  const db = getDatabase();
  db.run('DELETE FROM contacts WHERE id = ?', [id]);
  saveDatabase();
}
