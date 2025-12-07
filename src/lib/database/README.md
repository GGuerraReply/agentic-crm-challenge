# SQLite Database Setup

This project uses `sql.js` to provide a SQLite database that runs entirely in the browser with localStorage persistence.

## Features

- ✅ Full SQLite database running in the browser
- ✅ Automatic persistence to localStorage
- ✅ Complete CRUD operations for all entities
- ✅ Type-safe TypeScript interfaces
- ✅ Automatic database initialization on app load

## Database Schema

The database includes the following tables:

### 1. Contacts
Stores contact information including personal details, social links, and timestamps.

### 2. Companies
Stores company information including details, categories, contacts, and social links.

### 3. Deals
Stores deal information including status, priority, amount, and relationships to contacts and companies.

### 4. Tasks
Stores task information including status, priority, due dates, and relationships to contacts, companies, and deals.

### 5. Notes
Stores notes with status, assignments, and relationships to contacts, companies, and deals.

## Usage

### Initialization

The database is automatically initialized when the app loads through the `useDatabaseInit` hook in `App.tsx`.

```typescript
import { useDatabaseInit } from './hooks/use-database-init';

function App() {
  const { isInitialized, error } = useDatabaseInit();
  // ...
}
```

### CRUD Operations

Import the database functions from `@/lib/database`:

```typescript
import {
  // Contacts
  createContact,
  getAllContacts,
  getContactById,
  updateContact,
  deleteContact,
  
  // Companies
  createCompany,
  getAllCompanies,
  getCompanyById,
  updateCompany,
  deleteCompany,
  
  // Deals
  createDeal,
  getAllDeals,
  getDealById,
  updateDeal,
  deleteDeal,
  
  // Tasks
  createTask,
  getAllTasks,
  getTaskById,
  updateTask,
  deleteTask,
  
  // Notes
  createNote,
  getAllNotes,
  getNoteById,
  updateNote,
  deleteNote,
} from '@/lib/database';
```

### Example: Creating a Contact

```typescript
const newContact = {
  id: 'contact-123',
  name: 'John Doe',
  email: 'john@example.com',
  phone: '+1234567890',
  position: 'Software Engineer',
  company: 'Tech Corp',
  avatar: '/avatars/john.png',
  createdAt: new Date(),
  updatedAt: new Date(),
};

createContact(newContact);
```

### Example: Reading Contacts

```typescript
// Get all contacts
const contacts = getAllContacts();

// Get a specific contact
const contact = getContactById('contact-123');
```

### Example: Updating a Contact

```typescript
updateContact('contact-123', {
  phone: '+9876543210',
  position: 'Senior Software Engineer',
});
```

### Example: Deleting a Contact

```typescript
deleteContact('contact-123');
```

## Data Persistence

The database is automatically saved to localStorage after every write operation (create, update, delete). The data persists across browser sessions and page refreshes.

### Manual Save

```typescript
import { saveDatabase } from '@/lib/database';
saveDatabase();
```

### Clear Database

```typescript
import { clearDatabase } from '@/lib/database';
clearDatabase();
```

## Testing

A comprehensive test suite is available in `src/lib/database/__tests__/database.test.ts` that tests all CRUD operations for all entities.

## Architecture

```
src/lib/database/
├── db.ts              # Core database initialization and schema
├── contacts.ts        # Contact CRUD operations
├── companies.ts       # Company CRUD operations
├── deals.ts          # Deal CRUD operations
├── tasks.ts          # Task CRUD operations
├── notes.ts          # Note CRUD operations
├── index.ts          # Public API exports
└── __tests__/
    └── database.test.ts  # Comprehensive tests
```

## Notes

- The database uses `sql.js` which loads the WASM binary from a CDN
- All dates are stored as ISO 8601 strings in the database
- Array fields (like `categoryIds`, `contactIds`) are stored as JSON strings
- The database is lazily initialized on first access
- Data is stored in localStorage with the key `crm_database`
