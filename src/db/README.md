# SQLite Database Module

Browser-based SQLite database for the Agentic CRM Challenge using sql.js.

## 📦 Installation

First, install the required dependency:

```bash
npm install sql.js
```

Optionally, install TypeScript types:

```bash
npm install --save-dev @types/sql.js
```

## 🚀 Quick Start

### Initialize Database

```typescript
import { initializeDatabase, seedDatabase } from '@/db';

// Initialize database (creates or loads from localStorage)
const db = await initializeDatabase();

// Optional: seed with mock data
await seedDatabase(db);
```

### Using Repositories

```typescript
import { ContactRepository, CompanyRepository, DealRepository } from '@/db';

// Create repository instances
const contactRepo = new ContactRepository();
const companyRepo = new CompanyRepository();
const dealRepo = new DealRepository();

// Create a contact
const newContact = await contactRepo.create({
  id: crypto.randomUUID(),
  name: 'John Doe',
  email: 'john@example.com',
  phone: '+1 555-0100',
  createdAt: new Date(),
  updatedAt: new Date(),
});

// Get all contacts
const contacts = await contactRepo.getAll();

// Search contacts
const results = await contactRepo.searchByName('John');

// Update a contact
await contactRepo.update(contactId, { phone: '+1 555-0200' });

// Delete a contact
await contactRepo.delete(contactId);
```

## 📊 Database Schema

### Main Entity Tables

- **contacts** - Contact information
- **companies** - Company/organization data
- **deals** - Sales opportunities
- **tasks** - Task management
- **notes** - Notes and annotations

### Lookup Tables

- **categories** - Industry categories
- **connection_strengths** - Relationship strength levels
- **employee_ranges** - Company size ranges
- **estimated_arrs** - Annual recurring revenue ranges

### Junction Tables

Many-to-many relationships:
- `company_contacts`
- `company_categories`
- `deal_companies`
- `deal_contacts`
- `task_companies`
- `task_contacts`
- `task_deals`
- `note_companies`
- `note_assigned_contacts`
- `note_deals`

## 🛠️ Advanced Usage

### Working with Relationships

```typescript
// Add a contact to a company
await companyRepo.addContact(companyId, contactId);

// Get all contact IDs for a company
const contactIds = await companyRepo.getContactIds(companyId);

// Add a category to a company
await companyRepo.addCategory(companyId, categoryId);
```

### Querying

```typescript
// Find by specific field
const contact = await contactRepo.findByEmail('john@example.com');

// Find with filters
const highPriorityDeals = await dealRepo.findByPriority('high');

// Find overdue items
const overdueTasks = await taskRepo.findOverdue();

// Date range queries
const recentContacts = await contactRepo.findByDateRange(
  new Date('2025-01-01'),
  new Date('2025-12-31')
);
```

### Statistics

```typescript
// Get deal statistics
const dealStats = await dealRepo.getStatistics();
console.log(dealStats);
// {
//   total: 45,
//   pending: 12,
//   inProgress: 18,
//   completed: 15,
//   totalValue: 1250000
// }

// Get task statistics
const taskStats = await taskRepo.getStatistics();
```

## 🔧 Database Management

### Reset Database

```typescript
import { resetDatabase } from '@/db';

// Clear all data and recreate schema
await resetDatabase();
```

### Export/Import

```typescript
import { exportDatabase, importDatabase } from '@/db';

// Export database to file
const data = exportDatabase();
// Save data to file system

// Import database from data
await importDatabase(data);
```

### Database Statistics

```typescript
import { getDatabaseStats } from '@/db';

const stats = getDatabaseStats();
console.log(`Database size: ${stats.size} bytes`);
console.log(`Schema version: ${stats.schemaVersion}`);
stats.tables.forEach(table => {
  console.log(`${table.name}: ${table.count} rows`);
});
```

## 🐛 Debugging

The module includes debugging utilities:

```typescript
import { dbDebug } from '@/db/debug';

// Print all table schemas
dbDebug.printTableSchemas();

// Print database statistics
dbDebug.printDatabaseStats();

// Sample data from a table
dbDebug.sampleTable('contacts', 10);

// Validate foreign key integrity
dbDebug.validateForeignKeys();

// Download database file
dbDebug.downloadDatabase('my-database.sqlite');

// Create debug report
const report = dbDebug.createDebugReport();

// Analyze query performance
dbDebug.explainQuery('SELECT * FROM contacts WHERE email = ?', ['test@example.com']);
```

## 📝 Type Safety

All repositories use TypeScript types that match your application models:

```typescript
import type { Contact } from '@/crm/types/contact';

// Repositories work with app types, not database types
const contact: Contact = await contactRepo.getById(id);
```

## 🔄 Data Flow

```
Application Types (Date, arrays, objects)
           ↓
    Mapper Functions
           ↓
Database Types (primitives: number, string, null)
           ↓
      SQL Queries
           ↓
    SQLite Database
```

## ⚠️ Important Notes

1. **Browser Storage**: Database is persisted to `localStorage`. Size limit is typically 5-10MB.

2. **Schema Versioning**: Schema version is tracked. For this workshop, schema changes may require database reset.

3. **Foreign Keys**: Foreign key relationships are defined but CASCADE operations are handled in application code for simplicity.

4. **Transactions**: Use `executeTransaction()` for atomic operations:

```typescript
import { executeTransaction } from '@/db';

executeTransaction([
  { query: 'INSERT INTO contacts ...', params: [...] },
  { query: 'INSERT INTO company_contacts ...', params: [...] },
]);
```

5. **WASM Loading**: sql.js requires loading a WASM file. The default configuration loads from CDN. Adjust `locateFile` in `database.ts` for custom paths.

## 🎯 Workshop Tips

- Start with one entity (e.g., contacts) and test thoroughly
- Use `seedDatabase()` to populate test data
- Use debug utilities to inspect database state
- Implement auto-save on data changes
- Add loading states for async operations
- Handle errors gracefully with user feedback

## 📚 Further Reading

- [sql.js Documentation](https://sql.js.org/)
- [SQLite Documentation](https://www.sqlite.org/docs.html)
- [Repository Pattern](https://martinfowler.com/eaaCatalog/repository.html)
