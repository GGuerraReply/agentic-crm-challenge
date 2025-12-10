/**
 * Notes entity mapper
 * Converts between application Notes type and database DbNote type
 */

import { Notes } from '@/crm/types/notes';
import { DbNote } from '../types';

/**
 * Convert Notes (app) to DbNote (database)
 */
export function toDbNote(note: Notes): DbNote {
  return {
    id: note.id,
    title: note.title,
    content: note.content,
    created_by: note.createdBy,
    status: note.status,
    logo: note.logo || null,
    due_at: note.dueAt.getTime(),
    completed_at: note.completedAt ? note.completedAt.getTime() : null,
    completed_by: note.completedBy || null,
    created_at: note.createdAt.getTime(),
    updated_at: note.updatedAt.getTime(),
  };
}

/**
 * Convert DbNote (database) to Notes (app)
 */
export function fromDbNote(dbNote: DbNote): Notes {
  return {
    id: dbNote.id,
    title: dbNote.title,
    content: dbNote.content,
    createdBy: dbNote.created_by,
    status: dbNote.status as Notes['status'],
    logo: dbNote.logo || undefined,
    dueAt: new Date(dbNote.due_at),
    completedAt: dbNote.completed_at ? new Date(dbNote.completed_at) : undefined,
    completedBy: dbNote.completed_by || undefined,
    // Note: assignedContactIds, companyIds, dealIds are in junction tables
    assignedContactIds: [],
    companyIds: [],
    dealIds: undefined,
    createdAt: new Date(dbNote.created_at),
    updatedAt: new Date(dbNote.updated_at),
  };
}
