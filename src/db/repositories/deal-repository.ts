/**
 * Deal Repository
 * Handles CRUD operations and queries for deals
 */

import { Database } from 'sql.js';
import { Deal } from '@/crm/types/deal';
import { DbDeal } from '../types';
import { toDbDeal, fromDbDeal } from '../mappers';
import { BaseRepository } from './base-repository';
import { executeQuery, executeDelete } from '../utils';
import { saveDatabase } from '../database';

export class DealRepository extends BaseRepository<Deal, DbDeal> {
  constructor(db?: Database) {
    super('deals', db);
  }

  protected toDb(entity: Deal): DbDeal {
    return toDbDeal(entity);
  }

  protected fromDb(dbEntity: DbDeal): Deal {
    return fromDbDeal(dbEntity);
  }

  /**
   * Find deals by status
   */
  async findByStatus(status: Deal['status']): Promise<Deal[]> {
    return this.findBy('status', status, 'due_at ASC');
  }

  /**
   * Find deals by priority
   */
  async findByPriority(priority: Deal['priority']): Promise<Deal[]> {
    return this.findBy('priority', priority, 'due_at ASC');
  }

  /**
   * Find overdue deals
   */
  async findOverdue(): Promise<Deal[]> {
    try {
      const now = Date.now();
      const query = `
        SELECT * FROM ${this.tableName}
        WHERE due_at < ? AND status != 'completed'
        ORDER BY due_at ASC
      `;
      const dbEntities = executeQuery<DbDeal>(query, [now], this.db);
      return dbEntities.map((dbEntity) => this.fromDb(dbEntity));
    } catch (error) {
      console.error('Failed to find overdue deals:', error);
      throw error;
    }
  }

  /**
   * Find deals due within a date range
   */
  async findByDueDateRange(startDate: Date, endDate: Date): Promise<Deal[]> {
    try {
      const query = `
        SELECT * FROM ${this.tableName}
        WHERE due_at >= ? AND due_at <= ?
        ORDER BY due_at ASC
      `;
      const dbEntities = executeQuery<DbDeal>(
        query,
        [startDate.getTime(), endDate.getTime()],
        this.db
      );
      return dbEntities.map((dbEntity) => this.fromDb(dbEntity));
    } catch (error) {
      console.error('Failed to find deals by due date range:', error);
      throw error;
    }
  }

  /**
   * Add a company to a deal
   */
  async addCompany(dealId: string, companyId: string): Promise<void> {
    try {
      const query = `
        INSERT OR IGNORE INTO deal_companies (deal_id, company_id)
        VALUES (?, ?)
      `;
      this.db.run(query, [dealId, companyId]);
      saveDatabase(this.db);
    } catch (error) {
      console.error('Failed to add company to deal:', error);
      throw error;
    }
  }

  /**
   * Remove a company from a deal
   */
  async removeCompany(dealId: string, companyId: string): Promise<void> {
    try {
      const query = `DELETE FROM deal_companies WHERE deal_id = ? AND company_id = ?`;
      executeDelete(query, [dealId, companyId], this.db);
      saveDatabase(this.db);
    } catch (error) {
      console.error('Failed to remove company from deal:', error);
      throw error;
    }
  }

  /**
   * Get company IDs for a deal
   */
  async getCompanyIds(dealId: string): Promise<string[]> {
    try {
      const query = `SELECT company_id FROM deal_companies WHERE deal_id = ?`;
      const results = executeQuery<{ company_id: string }>(query, [dealId], this.db);
      return results.map((r) => r.company_id);
    } catch (error) {
      console.error('Failed to get company IDs for deal:', error);
      throw error;
    }
  }

  /**
   * Add a contact to a deal
   */
  async addContact(dealId: string, contactId: string): Promise<void> {
    try {
      const query = `
        INSERT OR IGNORE INTO deal_contacts (deal_id, contact_id)
        VALUES (?, ?)
      `;
      this.db.run(query, [dealId, contactId]);
      saveDatabase(this.db);
    } catch (error) {
      console.error('Failed to add contact to deal:', error);
      throw error;
    }
  }

  /**
   * Remove a contact from a deal
   */
  async removeContact(dealId: string, contactId: string): Promise<void> {
    try {
      const query = `DELETE FROM deal_contacts WHERE deal_id = ? AND contact_id = ?`;
      executeDelete(query, [dealId, contactId], this.db);
      saveDatabase(this.db);
    } catch (error) {
      console.error('Failed to remove contact from deal:', error);
      throw error;
    }
  }

  /**
   * Get contact IDs for a deal
   */
  async getContactIds(dealId: string): Promise<string[]> {
    try {
      const query = `SELECT contact_id FROM deal_contacts WHERE deal_id = ?`;
      const results = executeQuery<{ contact_id: string }>(query, [dealId], this.db);
      return results.map((r) => r.contact_id);
    } catch (error) {
      console.error('Failed to get contact IDs for deal:', error);
      throw error;
    }
  }

  /**
   * Calculate total deal value by status
   */
  async getTotalValueByStatus(status: Deal['status']): Promise<number> {
    try {
      const query = `
        SELECT COALESCE(SUM(amount), 0) as total
        FROM ${this.tableName}
        WHERE status = ?
      `;
      const results = executeQuery<{ total: number }>(query, [status], this.db);
      return results.length > 0 ? results[0].total : 0;
    } catch (error) {
      console.error('Failed to calculate total value by status:', error);
      throw error;
    }
  }

  /**
   * Get deal statistics
   */
  async getStatistics(): Promise<{
    total: number;
    pending: number;
    inProgress: number;
    completed: number;
    totalValue: number;
  }> {
    try {
      const total = await this.count();
      const pending = await this.count('status = ?', ['pending']);
      const inProgress = await this.count('status = ?', ['in_progress']);
      const completed = await this.count('status = ?', ['completed']);

      const valueQuery = `SELECT COALESCE(SUM(amount), 0) as total FROM ${this.tableName}`;
      const valueResults = executeQuery<{ total: number }>(valueQuery, [], this.db);
      const totalValue = valueResults.length > 0 ? valueResults[0].total : 0;

      return {
        total,
        pending,
        inProgress,
        completed,
        totalValue,
      };
    } catch (error) {
      console.error('Failed to get deal statistics:', error);
      throw error;
    }
  }
}
