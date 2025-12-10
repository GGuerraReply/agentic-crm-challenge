/**
 * Database module public API
 * 
 * Main exports for the SQLite database layer
 */

// Database initialization and management
export {
  initializeDatabase,
  getDatabase,
  closeDatabase,
  resetDatabase,
  saveDatabase,
  exportDatabase,
  importDatabase,
  getDatabaseStats,
} from './database';

// Schema version
export { SCHEMA_VERSION } from './schema';

// Database types
export type {
  DbContact,
  DbCompany,
  DbDeal,
  DbTask,
  DbNote,
  DbCategory,
  DbConnectionStrength,
  DbEmployeeRange,
  DbEstimatedArr,
} from './types';

// Mappers
export {
  toDbContact,
  fromDbContact,
  toDbCompany,
  fromDbCompany,
  toDbDeal,
  fromDbDeal,
  toDbTask,
  fromDbTask,
  toDbNote,
  fromDbNote,
} from './mappers';

// Repositories
export {
  ContactRepository,
  CompanyRepository,
  DealRepository,
  TaskRepository,
  NoteRepository,
} from './repositories';

// Utilities
export {
  executeQuery,
  executeInsert,
  executeUpdate,
  executeDelete,
  getAll,
  getById,
  exists,
  count,
  buildInsertQuery,
  buildUpdateQuery,
  executeTransaction,
  getPaginated,
} from './utils';

// Seeding (legacy)
export { seedDatabase, clearDatabase } from './seed';

// Migrations
export {
  runMigrations,
  getMigrationStatus,
  rollbackMigration,
  type Migration,
} from './migrations';

export { allMigrations } from './migrations/index';
