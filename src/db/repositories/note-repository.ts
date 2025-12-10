/**
 * Note Repository
 * Handles CRUD operations and queries for notes
 */

import { Database } from 'sql.js';
import { Notes } from '@/crm/types/notes';
import { DbNote } from '../types';
import { toDbNote, fromDbNote } from '../mappers';
import { BaseRepository } from './base-repository';
import { executeQuery } from '../utils';
import { saveDatabase } from '../database';

export class NoteRepository extends BaseRepository<Notes, DbNote> {
  constructor(db?: Database) {
    super('notes', db);
  }

  protected toDb(entity: Notes): DbNote {
    return toDbNote(entity);
  }

  protected fromDb(dbEntity: DbNote): Notes {
    return fromDbNote(dbEntity);
  }

  /**
   * Find notes by status
   */
  async findByStatus(status: Notes['status']): Promise<Notes[]> {
    return this.findBy('status', status, 'created_at DESC');
  }

  /**
   * Find notes by creator
   */
  async findByCreator(createdBy: string): Promise<Notes[]> {
    return this.findBy('created_by', createdBy, 'created_at DESC');
  }

  /**
   * Find notes created within a date range
   */
  async findByDateRange(startDate: Date, endDate: Date): Promise<Notes[]> {
    try {
      const query = `
        SELECT * FROM ${this.tableName}
        WHERE created_at >= ? AND created_at <= ?
        ORDER BY created_at DESC
      `;
      const dbEntities = executeQuery<DbNote>(
        query,
        [startDate.getTime(), endDate.getTime()],
        this.db
      );
      return dbEntities.map((dbEntity) => this.fromDb(dbEntity));
    } catch (error) {
      console.error('Failed to find notes by date range:', error);
      throw error;
    }
  }

  /**
   * Add a company to a note
   */
  async addCompany(noteId: string, companyId: string): Promise<void> {
    try {
      const query = `
        INSERT OR IGNORE INTO note_companies (note_id, company_id)
        VALUES (?, ?)
      `;
      this.db.run(query, [noteId, companyId]);
      saveDatabase(this.db);
    } catch (error) {
      console.error('Failed to add company to note:', error);
      throw error;
    }
  }

  /**
   * Get company IDs for a note
   */
  async getCompanyIds(noteId: string): Promise<string[]> {
    try {
      const query = `SELECT company_id FROM note_companies WHERE note_id = ?`;
      const results = executeQuery<{ company_id: string }>(query, [noteId], this.db);
      return results.map((r) => r.company_id);
    } catch (error) {
      console.error('Failed to get company IDs for note:', error);
      throw error;
    }
  }

  /**
   * Assign a contact to a note
   */
  async assignContact(noteId: string, contactId: string): Promise<void> {
    try {
      const query = `
        INSERT OR IGNORE INTO note_assigned_contacts (note_id, contact_id)
        VALUES (?, ?)
      `;
      this.db.run(query, [noteId, contactId]);
      saveDatabase(this.db);
    } catch (error) {
      console.error('Failed to assign contact to note:', error);
      throw error;
    }
  }

  /**
   * Get assigned contact IDs for a note
   */
  async getAssignedContactIds(noteId: string): Promise<string[]> {
    try {
      const query = `SELECT contact_id FROM note_assigned_contacts WHERE note_id = ?`;
      const results = executeQuery<{ contact_id: string }>(query, [noteId], this.db);
      return results.map((r) => r.contact_id);
    } catch (error) {
      console.error('Failed to get assigned contact IDs for note:', error);
      throw error;
    }
  }

  /**
   * Add a deal to a note
   */
  async addDeal(noteId: string, dealId: string): Promise<void> {
    try {
      const query = `
        INSERT OR IGNORE INTO note_deals (note_id, deal_id)
        VALUES (?, ?)
      `;
      this.db.run(query, [noteId, dealId]);
      saveDatabase(this.db);
    } catch (error) {
      console.error('Failed to add deal to note:', error);
      throw error;
    }
  }

  /**
   * Get deal IDs for a note
   */
  async getDealIds(noteId: string): Promise<string[]> {
    try {
      const query = `SELECT deal_id FROM note_deals WHERE note_id = ?`;
      const results = executeQuery<{ deal_id: string }>(query, [noteId], this.db);
      return results.map((r) => r.deal_id);
    } catch (error) {
      console.error('Failed to get deal IDs for note:', error);
      throw error;
    }
  }

  /**
   * Search notes by content (case-insensitive)
   */
  async searchByContent(searchTerm: string): Promise<Notes[]> {
    try {
      const query = `
        SELECT * FROM ${this.tableName}
        WHERE title LIKE ? OR content LIKE ?
        ORDER BY created_at DESC
      `;
      const term = `%${searchTerm}%`;
      const dbEntities = executeQuery<DbNote>(query, [term, term], this.db);
      return dbEntities.map((dbEntity) => this.fromDb(dbEntity));
    } catch (error) {
      console.error('Failed to search notes by content:', error);
      throw error;
    }
  }

  /**
   * Get recent notes
   */
  async getRecent(limit: number = 10): Promise<Notes[]> {
    try {
      const query = `
        SELECT * FROM ${this.tableName}
        ORDER BY created_at DESC
        LIMIT ?
      `;
      const dbEntities = executeQuery<DbNote>(query, [limit], this.db);
      return dbEntities.map((dbEntity) => this.fromDb(dbEntity));
    } catch (error) {
      console.error('Failed to get recent notes:', error);
      throw error;
    }
  }
}
