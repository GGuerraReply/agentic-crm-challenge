import { Deal } from '@/crm/types/deal';
import { getDatabase, saveDatabase } from './db';

/**
 * Helper function to serialize array fields
 */
function serializeArray(arr?: string[]): string {
  return arr ? JSON.stringify(arr) : '[]';
}

/**
 * Helper function to deserialize array fields
 */
function deserializeArray(json: string): string[] | undefined {
  try {
    const parsed = JSON.parse(json);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : undefined;
  } catch {
    return undefined;
  }
}

/**
 * Get all deals
 */
export function getAllDeals(): Deal[] {
  const db = getDatabase();
  const result = db.exec('SELECT * FROM deals ORDER BY created_at DESC');

  if (result.length === 0) return [];

  const [{ columns, values }] = result;
  return values.map((row) => {
    const deal: Record<string, unknown> = {};
    columns.forEach((col, index) => {
      deal[col] = row[index];
    });

    return {
      id: deal.id as string,
      title: deal.title as string,
      content: deal.content as string,
      companyIds: deserializeArray(deal.company_ids as string),
      contactIds: deserializeArray(deal.contact_ids as string),
      dealIds: deserializeArray(deal.deal_ids as string),
      userName: deal.user_name as string,
      dueAt: new Date(deal.due_at as string),
      completedAt: deal.completed_at ? new Date(deal.completed_at as string) : undefined,
      completedBy: deal.completed_by as string | undefined,
      assignedContactIds: deserializeArray(deal.assigned_contact_ids as string),
      status: deal.status as Deal['status'] | undefined,
      priority: deal.priority as Deal['priority'] | undefined,
      comments: deal.comments as number | undefined,
      amount: deal.amount as number | undefined,
      currency: deal.currency as Deal['currency'] | undefined,
      paymentDate: deal.payment_date ? new Date(deal.payment_date as string) : undefined,
      paymentType: deal.payment_type as Deal['paymentType'] | undefined,
      contractNumber: deal.contract_number as string | undefined,
      discount: deal.discount as number | undefined,
      avatar: deal.avatar as string | undefined,
      createdAt: new Date(deal.created_at as string),
      updatedAt: new Date(deal.updated_at as string),
    };
  });
}

/**
 * Get deal by ID
 */
export function getDealById(id: string): Deal | null {
  const db = getDatabase();
  const result = db.exec('SELECT * FROM deals WHERE id = ?', [id]);

  if (result.length === 0) return null;

  const [{ columns, values }] = result;
  if (values.length === 0) return null;

  const row = values[0];
  const deal: Record<string, unknown> = {};
  columns.forEach((col, index) => {
    deal[col] = row[index];
  });

  return {
    id: deal.id as string,
    title: deal.title as string,
    content: deal.content as string,
    companyIds: deserializeArray(deal.company_ids as string),
    contactIds: deserializeArray(deal.contact_ids as string),
    dealIds: deserializeArray(deal.deal_ids as string),
    userName: deal.user_name as string,
    dueAt: new Date(deal.due_at as string),
    completedAt: deal.completed_at ? new Date(deal.completed_at as string) : undefined,
    completedBy: deal.completed_by as string | undefined,
    assignedContactIds: deserializeArray(deal.assigned_contact_ids as string),
    status: deal.status as Deal['status'] | undefined,
    priority: deal.priority as Deal['priority'] | undefined,
    comments: deal.comments as number | undefined,
    amount: deal.amount as number | undefined,
    currency: deal.currency as Deal['currency'] | undefined,
    paymentDate: deal.payment_date ? new Date(deal.payment_date as string) : undefined,
    paymentType: deal.payment_type as Deal['paymentType'] | undefined,
    contractNumber: deal.contract_number as string | undefined,
    discount: deal.discount as number | undefined,
    avatar: deal.avatar as string | undefined,
    createdAt: new Date(deal.created_at as string),
    updatedAt: new Date(deal.updated_at as string),
  };
}

/**
 * Create a new deal
 */
export function createDeal(deal: Deal): void {
  const db = getDatabase();

  db.run(
    `INSERT INTO deals (
      id, title, content, company_ids, contact_ids, deal_ids, user_name,
      due_at, completed_at, completed_by, assigned_contact_ids, status,
      priority, comments, amount, currency, payment_date, payment_type,
      contract_number, discount, avatar, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      deal.id,
      deal.title,
      deal.content,
      serializeArray(deal.companyIds),
      serializeArray(deal.contactIds),
      serializeArray(deal.dealIds),
      deal.userName,
      deal.dueAt.toISOString(),
      deal.completedAt ? deal.completedAt.toISOString() : null,
      deal.completedBy || null,
      serializeArray(deal.assignedContactIds),
      deal.status || null,
      deal.priority || null,
      deal.comments || null,
      deal.amount || null,
      deal.currency || null,
      deal.paymentDate ? deal.paymentDate.toISOString() : null,
      deal.paymentType || null,
      deal.contractNumber || null,
      deal.discount || null,
      deal.avatar || null,
      deal.createdAt.toISOString(),
      deal.updatedAt.toISOString(),
    ],
  );

  saveDatabase();
}

/**
 * Update an existing deal
 */
export function updateDeal(id: string, deal: Partial<Deal>): void {
  const db = getDatabase();
  const existing = getDealById(id);

  if (!existing) {
    throw new Error(`Deal with id ${id} not found`);
  }

  const updated = {
    ...existing,
    ...deal,
    updatedAt: new Date(),
  };

  db.run(
    `UPDATE deals SET
      title = ?, content = ?, company_ids = ?, contact_ids = ?, deal_ids = ?,
      user_name = ?, due_at = ?, completed_at = ?, completed_by = ?,
      assigned_contact_ids = ?, status = ?, priority = ?, comments = ?,
      amount = ?, currency = ?, payment_date = ?, payment_type = ?,
      contract_number = ?, discount = ?, avatar = ?, updated_at = ?
    WHERE id = ?`,
    [
      updated.title,
      updated.content,
      serializeArray(updated.companyIds),
      serializeArray(updated.contactIds),
      serializeArray(updated.dealIds),
      updated.userName,
      updated.dueAt.toISOString(),
      updated.completedAt ? updated.completedAt.toISOString() : null,
      updated.completedBy || null,
      serializeArray(updated.assignedContactIds),
      updated.status || null,
      updated.priority || null,
      updated.comments || null,
      updated.amount || null,
      updated.currency || null,
      updated.paymentDate ? updated.paymentDate.toISOString() : null,
      updated.paymentType || null,
      updated.contractNumber || null,
      updated.discount || null,
      updated.avatar || null,
      updated.updatedAt.toISOString(),
      id,
    ],
  );

  saveDatabase();
}

/**
 * Delete a deal
 */
export function deleteDeal(id: string): void {
  const db = getDatabase();
  db.run('DELETE FROM deals WHERE id = ?', [id]);
  saveDatabase();
}
