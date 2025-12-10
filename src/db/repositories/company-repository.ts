/**
 * Company Repository
 * Handles CRUD operations and queries for companies
 */

import { Database } from 'sql.js';
import { Company } from '@/crm/types/company';
import { DbCompany } from '../types';
import { toDbCompany, fromDbCompany } from '../mappers';
import { BaseRepository } from './base-repository';
import { executeQuery, executeDelete } from '../utils';
import { saveDatabase } from '../database';

export class CompanyRepository extends BaseRepository<Company, DbCompany> {
  constructor(db?: Database) {
    super('companies', db);
  }

  protected toDb(entity: Company): DbCompany {
    return toDbCompany(entity);
  }

  protected fromDb(dbEntity: DbCompany): Company {
    return fromDbCompany(dbEntity);
  }

  /**
   * Find company by domain
   */
  async findByDomain(domain: string): Promise<Company | null> {
    const results = await this.findBy('domain', domain);
    return results.length > 0 ? results[0] : null;
  }

  /**
   * Search companies by name (case-insensitive)
   */
  async searchByName(searchTerm: string): Promise<Company[]> {
    try {
      const query = `
        SELECT * FROM ${this.tableName}
        WHERE name LIKE ?
        ORDER BY name ASC
      `;
      const dbEntities = executeQuery<DbCompany>(
        query,
        [`%${searchTerm}%`],
        this.db
      );
      return dbEntities.map((dbEntity) => this.fromDb(dbEntity));
    } catch (error) {
      console.error('Failed to search companies by name:', error);
      throw error;
    }
  }

  /**
   * Find companies by country
   */
  async findByCountry(country: string): Promise<Company[]> {
    return this.findBy('country', country, 'name ASC');
  }

  /**
   * Find companies by connection strength
   */
  async findByConnectionStrength(connectionStrengthId: string): Promise<Company[]> {
    return this.findBy('connection_strength_id', connectionStrengthId, 'name ASC');
  }

  /**
   * Get recently created companies
   */
  async getRecent(limit: number = 10): Promise<Company[]> {
    try {
      const query = `
        SELECT * FROM ${this.tableName}
        ORDER BY created_at DESC
        LIMIT ?
      `;
      const dbEntities = executeQuery<DbCompany>(query, [limit], this.db);
      return dbEntities.map((dbEntity) => this.fromDb(dbEntity));
    } catch (error) {
      console.error('Failed to get recent companies:', error);
      throw error;
    }
  }

  /**
   * Add a contact to a company (many-to-many relationship)
   */
  async addContact(companyId: string, contactId: string): Promise<void> {
    try {
      const query = `
        INSERT OR IGNORE INTO company_contacts (company_id, contact_id)
        VALUES (?, ?)
      `;
      this.db.run(query, [companyId, contactId]);
      saveDatabase(this.db);
    } catch (error) {
      console.error('Failed to add contact to company:', error);
      throw error;
    }
  }

  /**
   * Remove a contact from a company
   */
  async removeContact(companyId: string, contactId: string): Promise<void> {
    try {
      const query = `DELETE FROM company_contacts WHERE company_id = ? AND contact_id = ?`;
      executeDelete(query, [companyId, contactId], this.db);
      saveDatabase(this.db);
    } catch (error) {
      console.error('Failed to remove contact from company:', error);
      throw error;
    }
  }

  /**
   * Get all contact IDs for a company
   */
  async getContactIds(companyId: string): Promise<string[]> {
    try {
      const query = `
        SELECT contact_id FROM company_contacts
        WHERE company_id = ?
      `;
      const results = executeQuery<{ contact_id: string }>(query, [companyId], this.db);
      return results.map((r) => r.contact_id);
    } catch (error) {
      console.error('Failed to get contact IDs for company:', error);
      throw error;
    }
  }

  /**
   * Add a category to a company
   */
  async addCategory(companyId: string, categoryId: string): Promise<void> {
    try {
      const query = `
        INSERT OR IGNORE INTO company_categories (company_id, category_id)
        VALUES (?, ?)
      `;
      this.db.run(query, [companyId, categoryId]);
      saveDatabase(this.db);
    } catch (error) {
      console.error('Failed to add category to company:', error);
      throw error;
    }
  }

  /**
   * Remove a category from a company
   */
  async removeCategory(companyId: string, categoryId: string): Promise<void> {
    try {
      const query = `DELETE FROM company_categories WHERE company_id = ? AND category_id = ?`;
      executeDelete(query, [companyId, categoryId], this.db);
      saveDatabase(this.db);
    } catch (error) {
      console.error('Failed to remove category from company:', error);
      throw error;
    }
  }

  /**
   * Get all category IDs for a company
   */
  async getCategoryIds(companyId: string): Promise<string[]> {
    try {
      const query = `
        SELECT category_id FROM company_categories
        WHERE company_id = ?
      `;
      const results = executeQuery<{ category_id: string }>(query, [companyId], this.db);
      return results.map((r) => r.category_id);
    } catch (error) {
      console.error('Failed to get category IDs for company:', error);
      throw error;
    }
  }

  /**
   * Get companies with full relationship data (contacts and categories)
   */
  async getWithRelationships(companyId: string): Promise<Company | null> {
    const company = await this.getById(companyId);
    if (!company) {
      return null;
    }

    // Fetch relationships
    const contactIds = await this.getContactIds(companyId);
    const categoryIds = await this.getCategoryIds(companyId);

    return {
      ...company,
      contactIds,
      categoryIds,
    };
  }
}
