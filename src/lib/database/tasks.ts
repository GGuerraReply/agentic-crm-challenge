import { Task } from '@/crm/types/task';
import { getDatabase, saveDatabase } from './db';
import { serializeOptionalArray, deserializeOptionalArray } from './utils';

/**
 * Get all tasks
 */
export function getAllTasks(): Task[] {
  const db = getDatabase();
  const result = db.exec('SELECT * FROM tasks ORDER BY created_at DESC');

  if (result.length === 0) return [];

  const [{ columns, values }] = result;
  return values.map((row) => {
    const task: Record<string, unknown> = {};
    columns.forEach((col, index) => {
      task[col] = row[index];
    });

    return {
      id: task.id as string,
      title: task.title as string,
      content: task.content as string,
      companyIds: deserializeOptionalArray(task.company_ids as string),
      contactIds: deserializeOptionalArray(task.contact_ids as string),
      dealIds: deserializeOptionalArray(task.deal_ids as string),
      createdBy: task.created_by as string,
      dueAt: new Date(task.due_at as string),
      completedAt: task.completed_at ? new Date(task.completed_at as string) : undefined,
      completedBy: task.completed_by as string | undefined,
      assignedContactIds: deserializeOptionalArray(task.assigned_contact_ids as string),
      status: task.status as Task['status'] | undefined,
      priority: task.priority as Task['priority'] | undefined,
      createdAt: new Date(task.created_at as string),
      updatedAt: new Date(task.updated_at as string),
    };
  });
}

/**
 * Get task by ID
 */
export function getTaskById(id: string): Task | null {
  const db = getDatabase();
  const result = db.exec('SELECT * FROM tasks WHERE id = ?', [id]);

  if (result.length === 0) return null;

  const [{ columns, values }] = result;
  if (values.length === 0) return null;

  const row = values[0];
  const task: Record<string, unknown> = {};
  columns.forEach((col, index) => {
    task[col] = row[index];
  });

  return {
    id: task.id as string,
    title: task.title as string,
    content: task.content as string,
    companyIds: deserializeOptionalArray(task.company_ids as string),
    contactIds: deserializeOptionalArray(task.contact_ids as string),
    dealIds: deserializeOptionalArray(task.deal_ids as string),
    createdBy: task.created_by as string,
    dueAt: new Date(task.due_at as string),
    completedAt: task.completed_at ? new Date(task.completed_at as string) : undefined,
    completedBy: task.completed_by as string | undefined,
    assignedContactIds: deserializeOptionalArray(task.assigned_contact_ids as string),
    status: task.status as Task['status'] | undefined,
    priority: task.priority as Task['priority'] | undefined,
    createdAt: new Date(task.created_at as string),
    updatedAt: new Date(task.updated_at as string),
  };
}

/**
 * Create a new task
 */
export function createTask(task: Task): void {
  const db = getDatabase();

  db.run(
    `INSERT INTO tasks (
      id, title, content, company_ids, contact_ids, deal_ids, created_by,
      due_at, completed_at, completed_by, assigned_contact_ids, status,
      priority, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      task.id,
      task.title,
      task.content,
      serializeOptionalArray(task.companyIds),
      serializeOptionalArray(task.contactIds),
      serializeOptionalArray(task.dealIds),
      task.createdBy,
      task.dueAt.toISOString(),
      task.completedAt ? task.completedAt.toISOString() : null,
      task.completedBy || null,
      serializeOptionalArray(task.assignedContactIds),
      task.status || null,
      task.priority || null,
      task.createdAt.toISOString(),
      task.updatedAt.toISOString(),
    ],
  );

  saveDatabase();
}

/**
 * Update an existing task
 */
export function updateTask(id: string, task: Partial<Task>): void {
  const db = getDatabase();
  const existing = getTaskById(id);

  if (!existing) {
    throw new Error(`Task with id ${id} not found`);
  }

  const updated = {
    ...existing,
    ...task,
    updatedAt: new Date(),
  };

  db.run(
    `UPDATE tasks SET
      title = ?, content = ?, company_ids = ?, contact_ids = ?, deal_ids = ?,
      created_by = ?, due_at = ?, completed_at = ?, completed_by = ?,
      assigned_contact_ids = ?, status = ?, priority = ?, updated_at = ?
    WHERE id = ?`,
    [
      updated.title,
      updated.content,
      serializeOptionalArray(updated.companyIds),
      serializeOptionalArray(updated.contactIds),
      serializeOptionalArray(updated.dealIds),
      updated.createdBy,
      updated.dueAt.toISOString(),
      updated.completedAt ? updated.completedAt.toISOString() : null,
      updated.completedBy || null,
      serializeOptionalArray(updated.assignedContactIds),
      updated.status || null,
      updated.priority || null,
      updated.updatedAt.toISOString(),
      id,
    ],
  );

  saveDatabase();
}

/**
 * Delete a task
 */
export function deleteTask(id: string): void {
  const db = getDatabase();
  db.run('DELETE FROM tasks WHERE id = ?', [id]);
  saveDatabase();
}
