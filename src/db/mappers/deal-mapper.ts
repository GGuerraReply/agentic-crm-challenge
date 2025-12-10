/**
 * Deal entity mapper
 * Converts between application Deal type and database DbDeal type
 */

import { Deal } from '@/crm/types/deal';
import { DbDeal } from '../types';

/**
 * Convert Deal (app) to DbDeal (database)
 */
export function toDbDeal(deal: Deal): DbDeal {
  return {
    id: deal.id,
    title: deal.title,
    content: deal.content,
    user_name: deal.userName,
    avatar: deal.avatar || null,
    status: deal.status || null,
    priority: deal.priority || null,
    due_at: deal.dueAt.getTime(),
    completed_at: deal.completedAt ? deal.completedAt.getTime() : null,
    completed_by: deal.completedBy || null,
    comments: deal.comments || 0,
    amount: deal.amount || null,
    currency: deal.currency || null,
    payment_date: deal.paymentDate ? deal.paymentDate.getTime() : null,
    payment_type: deal.paymentType || null,
    contract_number: deal.contractNumber || null,
    discount: deal.discount || null,
    created_at: deal.createdAt.getTime(),
    updated_at: deal.updatedAt.getTime(),
  };
}

/**
 * Convert DbDeal (database) to Deal (app)
 */
export function fromDbDeal(dbDeal: DbDeal): Deal {
  return {
    id: dbDeal.id,
    title: dbDeal.title,
    content: dbDeal.content,
    userName: dbDeal.user_name,
    avatar: dbDeal.avatar || undefined,
    status: (dbDeal.status as Deal['status']) || undefined,
    priority: (dbDeal.priority as Deal['priority']) || undefined,
    dueAt: new Date(dbDeal.due_at),
    completedAt: dbDeal.completed_at ? new Date(dbDeal.completed_at) : undefined,
    completedBy: dbDeal.completed_by || undefined,
    // Note: companyIds, contactIds, dealIds, assignedContactIds are in junction tables
    companyIds: undefined,
    contactIds: undefined,
    dealIds: undefined,
    assignedContactIds: undefined,
    comments: dbDeal.comments,
    amount: dbDeal.amount || undefined,
    currency: (dbDeal.currency as Deal['currency']) || undefined,
    paymentDate: dbDeal.payment_date ? new Date(dbDeal.payment_date) : undefined,
    paymentType: (dbDeal.payment_type as Deal['paymentType']) || undefined,
    contractNumber: dbDeal.contract_number || undefined,
    discount: dbDeal.discount || undefined,
    createdAt: new Date(dbDeal.created_at),
    updatedAt: new Date(dbDeal.updated_at),
  };
}
