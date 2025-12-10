/**
 * Task entity mapper
 * Converts between application Task type and database DbTask type
 */

import { Task } from '@/crm/types/task';
import { DbTask } from '../types';

/**
 * Convert Task (app) to DbTask (database)
 */
export function toDbTask(task: Task): DbTask {
  return {
    id: task.id,
    title: task.title,
    content: task.content,
    created_by: task.createdBy,
    status: task.status || null,
    priority: task.priority || null,
    due_at: task.dueAt.getTime(),
    completed_at: task.completedAt ? task.completedAt.getTime() : null,
    completed_by: task.completedBy || null,
    created_at: task.createdAt.getTime(),
    updated_at: task.updatedAt.getTime(),
  };
}

/**
 * Convert DbTask (database) to Task (app)
 */
export function fromDbTask(dbTask: DbTask): Task {
  return {
    id: dbTask.id,
    title: dbTask.title,
    content: dbTask.content,
    createdBy: dbTask.created_by,
    status: (dbTask.status as Task['status']) || undefined,
    priority: (dbTask.priority as Task['priority']) || undefined,
    dueAt: new Date(dbTask.due_at),
    completedAt: dbTask.completed_at ? new Date(dbTask.completed_at) : undefined,
    completedBy: dbTask.completed_by || undefined,
    // Note: companyIds, contactIds, dealIds, assignedContactIds are in junction tables
    companyIds: undefined,
    contactIds: undefined,
    dealIds: undefined,
    assignedContactIds: undefined,
    createdAt: new Date(dbTask.created_at),
    updatedAt: new Date(dbTask.updated_at),
  };
}
