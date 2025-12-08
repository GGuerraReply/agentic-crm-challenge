// Database initialization
export { initDatabase, getDatabase, saveDatabase, clearDatabase } from './db';

// Contact operations
export {
  getAllContacts,
  getContactById,
  createContact,
  updateContact,
  deleteContact,
} from './contacts';

// Company operations
export {
  getAllCompanies,
  getCompanyById,
  createCompany,
  updateCompany,
  deleteCompany,
} from './companies';

// Deal operations
export { getAllDeals, getDealById, createDeal, updateDeal, deleteDeal } from './deals';

// Task operations
export { getAllTasks, getTaskById, createTask, updateTask, deleteTask } from './tasks';

// Note operations
export { getAllNotes, getNoteById, createNote, updateNote, deleteNote } from './notes';
