/**
 * Task Repository
 * Handles CRUD operations and queries for tasks
 */

import { Database } from 'sql.js';
import { Task } from '@/crm/types/task';
import { DbTask } from '../types';
import { toDbTask, fromDbTask } from '../mappers';
import { BaseRepository } from './base-repository';
import { executeQuery } from '../utils';
import { saveDatabase } from '../database';

export class TaskRepository extends BaseRepository<Task, DbTask> {
  constructor(db?: Database) {
    super('tasks', db);
  }

  protected toDb(entity: Task): DbTask {
    return toDbTask(entity);
  }

  protected fromDb(dbEntity: DbTask): Task {
    return fromDbTask(dbEntity);
  }

  /**
   * Find tasks by status
   */
  async findByStatus(status: Task['status']): Promise<Task[]> {
    return this.findBy('status', status, 'due_at ASC');
  }

  /**
   * Find tasks by priority
   */
  async findByPriority(priority: Task['priority']): Promise<Task[]> {
    return this.findBy('priority', priority, 'due_at ASC');
  }

  /**
   * Find tasks by creator
   */
  async findByCreator(createdBy: string): Promise<Task[]> {
    return this.findBy('created_by', createdBy, 'created_at DESC');
  }

  /**
   * Find overdue tasks
   */
  async findOverdue(): Promise<Task[]> {
    try {
      const now = Date.now();
      const query = `
        SELECT * FROM ${this.tableName}
        WHERE due_at < ? AND status != 'completed'
        ORDER BY due_at ASC
      `;
      const dbEntities = executeQuery<DbTask>(query, [now], this.db);
      return dbEntities.map((dbEntity) => this.fromDb(dbEntity));
    } catch (error) {
      console.error('Failed to find overdue tasks:', error);
      throw error;
    }
  }

  /**
   * Find tasks due within a date range
   */
  async findByDueDateRange(startDate: Date, endDate: Date): Promise<Task[]> {
    try {
      const query = `
        SELECT * FROM ${this.tableName}
        WHERE due_at >= ? AND due_at <= ?
        ORDER BY due_at ASC
      `;
      const dbEntities = executeQuery<DbTask>(
        query,
        [startDate.getTime(), endDate.getTime()],
        this.db
      );
      return dbEntities.map((dbEntity) => this.fromDb(dbEntity));
    } catch (error) {
      console.error('Failed to find tasks by due date range:', error);
      throw error;
    }
  }

  /**
   * Add a company to a task
   */
  async addCompany(taskId: string, companyId: string): Promise<void> {
    try {
      const query = `
        INSERT OR IGNORE INTO task_companies (task_id, company_id)
        VALUES (?, ?)
      `;
      this.db.run(query, [taskId, companyId]);
      saveDatabase(this.db);
    } catch (error) {
      console.error('Failed to add company to task:', error);
      throw error;
    }
  }

  /**
   * Get company IDs for a task
   */
  async getCompanyIds(taskId: string): Promise<string[]> {
    try {
      const query = `SELECT company_id FROM task_companies WHERE task_id = ?`;
      const results = executeQuery<{ company_id: string }>(query, [taskId], this.db);
      return results.map((r) => r.company_id);
    } catch (error) {
      console.error('Failed to get company IDs for task:', error);
      throw error;
    }
  }

  /**
   * Add a contact to a task
   */
  async addContact(taskId: string, contactId: string): Promise<void> {
    try {
      const query = `
        INSERT OR IGNORE INTO task_contacts (task_id, contact_id)
        VALUES (?, ?)
      `;
      this.db.run(query, [taskId, contactId]);
      saveDatabase(this.db);
    } catch (error) {
      console.error('Failed to add contact to task:', error);
      throw error;
    }
  }

  /**
   * Get contact IDs for a task
   */
  async getContactIds(taskId: string): Promise<string[]> {
    try {
      const query = `SELECT contact_id FROM task_contacts WHERE task_id = ?`;
      const results = executeQuery<{ contact_id: string }>(query, [taskId], this.db);
      return results.map((r) => r.contact_id);
    } catch (error) {
      console.error('Failed to get contact IDs for task:', error);
      throw error;
    }
  }

  /**
   * Add a deal to a task
   */
  async addDeal(taskId: string, dealId: string): Promise<void> {
    try {
      const query = `
        INSERT OR IGNORE INTO task_deals (task_id, deal_id)
        VALUES (?, ?)
      `;
      this.db.run(query, [taskId, dealId]);
      saveDatabase(this.db);
    } catch (error) {
      console.error('Failed to add deal to task:', error);
      throw error;
    }
  }

  /**
   * Get deal IDs for a task
   */
  async getDealIds(taskId: string): Promise<string[]> {
    try {
      const query = `SELECT deal_id FROM task_deals WHERE task_id = ?`;
      const results = executeQuery<{ deal_id: string }>(query, [taskId], this.db);
      return results.map((r) => r.deal_id);
    } catch (error) {
      console.error('Failed to get deal IDs for task:', error);
      throw error;
    }
  }

  /**
   * Assign a contact to a task
   */
  async assignContact(taskId: string, contactId: string): Promise<void> {
    try {
      const query = `
        INSERT OR IGNORE INTO task_assigned_contacts (task_id, contact_id)
        VALUES (?, ?)
      `;
      this.db.run(query, [taskId, contactId]);
      saveDatabase(this.db);
    } catch (error) {
      console.error('Failed to assign contact to task:', error);
      throw error;
    }
  }

  /**
   * Get assigned contact IDs for a task
   */
  async getAssignedContactIds(taskId: string): Promise<string[]> {
    try {
      const query = `SELECT contact_id FROM task_assigned_contacts WHERE task_id = ?`;
      const results = executeQuery<{ contact_id: string }>(query, [taskId], this.db);
      return results.map((r) => r.contact_id);
    } catch (error) {
      console.error('Failed to get assigned contact IDs for task:', error);
      throw error;
    }
  }

  /**
   * Get task statistics
   */
  async getStatistics(): Promise<{
    total: number;
    pending: number;
    inProgress: number;
    completed: number;
    overdue: number;
  }> {
    try {
      const total = await this.count();
      const pending = await this.count('status = ?', ['pending']);
      const inProgress = await this.count('status = ?', ['in_progress']);
      const completed = await this.count('status = ?', ['completed']);

      const now = Date.now();
      const overdue = await this.count('due_at < ? AND status != ?', [now, 'completed']);

      return {
        total,
        pending,
        inProgress,
        completed,
        overdue,
      };
    } catch (error) {
      console.error('Failed to get task statistics:', error);
      throw error;
    }
  }
}
