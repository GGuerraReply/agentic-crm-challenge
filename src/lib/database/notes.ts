import { Notes } from '@/crm/types/notes';
import { getDatabase, saveDatabase } from './db';
import {
  serializeArray,
  serializeOptionalArray,
  deserializeArray,
  deserializeOptionalArray,
} from './utils';

/**
 * Get all notes
 */
export function getAllNotes(): Notes[] {
  const db = getDatabase();
  const result = db.exec('SELECT * FROM notes ORDER BY created_at DESC');

  if (result.length === 0) return [];

  const [{ columns, values }] = result;
  return values.map((row) => {
    const note: Record<string, unknown> = {};
    columns.forEach((col, index) => {
      note[col] = row[index];
    });

    return {
      id: note.id as string,
      title: note.title as string,
      content: note.content as string,
      createdBy: note.created_by as string,
      dueAt: new Date(note.due_at as string),
      status: note.status as Notes['status'],
      assignedContactIds: deserializeArray(note.assigned_contact_ids as string),
      companyIds: deserializeArray(note.company_ids as string),
      dealIds: deserializeOptionalArray(note.deal_ids as string),
      completedAt: note.completed_at ? new Date(note.completed_at as string) : undefined,
      completedBy: note.completed_by as string | undefined,
      logo: note.logo as string | undefined,
      createdAt: new Date(note.created_at as string),
      updatedAt: new Date(note.updated_at as string),
    };
  });
}

/**
 * Get note by ID
 */
export function getNoteById(id: string): Notes | null {
  const db = getDatabase();
  const result = db.exec('SELECT * FROM notes WHERE id = ?', [id]);

  if (result.length === 0) return null;

  const [{ columns, values }] = result;
  if (values.length === 0) return null;

  const row = values[0];
  const note: Record<string, unknown> = {};
  columns.forEach((col, index) => {
    note[col] = row[index];
  });

  return {
    id: note.id as string,
    title: note.title as string,
    content: note.content as string,
    createdBy: note.created_by as string,
    dueAt: new Date(note.due_at as string),
    status: note.status as Notes['status'],
    assignedContactIds: deserializeArray(note.assigned_contact_ids as string),
    companyIds: deserializeArray(note.company_ids as string),
    dealIds: deserializeOptionalArray(note.deal_ids as string),
    completedAt: note.completed_at ? new Date(note.completed_at as string) : undefined,
    completedBy: note.completed_by as string | undefined,
    logo: note.logo as string | undefined,
    createdAt: new Date(note.created_at as string),
    updatedAt: new Date(note.updated_at as string),
  };
}

/**
 * Create a new note
 */
export function createNote(note: Notes): void {
  const db = getDatabase();

  db.run(
    `INSERT INTO notes (
      id, title, content, created_by, due_at, status,
      assigned_contact_ids, company_ids, deal_ids, completed_at,
      completed_by, logo, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      note.id,
      note.title,
      note.content,
      note.createdBy,
      note.dueAt.toISOString(),
      note.status,
      serializeArray(note.assignedContactIds),
      serializeArray(note.companyIds),
      serializeOptionalArray(note.dealIds),
      note.completedAt ? note.completedAt.toISOString() : null,
      note.completedBy || null,
      note.logo || null,
      note.createdAt.toISOString(),
      note.updatedAt.toISOString(),
    ],
  );

  saveDatabase();
}

/**
 * Update an existing note
 */
export function updateNote(id: string, note: Partial<Notes>): void {
  const db = getDatabase();
  const existing = getNoteById(id);

  if (!existing) {
    throw new Error(`Note with id ${id} not found`);
  }

  const updated = {
    ...existing,
    ...note,
    updatedAt: new Date(),
  };

  db.run(
    `UPDATE notes SET
      title = ?, content = ?, created_by = ?, due_at = ?, status = ?,
      assigned_contact_ids = ?, company_ids = ?, deal_ids = ?,
      completed_at = ?, completed_by = ?, logo = ?, updated_at = ?
    WHERE id = ?`,
    [
      updated.title,
      updated.content,
      updated.createdBy,
      updated.dueAt.toISOString(),
      updated.status,
      serializeArray(updated.assignedContactIds),
      serializeArray(updated.companyIds),
      serializeOptionalArray(updated.dealIds),
      updated.completedAt ? updated.completedAt.toISOString() : null,
      updated.completedBy || null,
      updated.logo || null,
      updated.updatedAt.toISOString(),
      id,
    ],
  );

  saveDatabase();
}

/**
 * Delete a note
 */
export function deleteNote(id: string): void {
  const db = getDatabase();
  db.run('DELETE FROM notes WHERE id = ?', [id]);
  saveDatabase();
}
