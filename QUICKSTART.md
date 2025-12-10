# 🚀 Quick Start Guide - SQLite Database

Get up and running with the Agentic CRM SQLite database in 5 minutes.

## Step 1: Install Dependencies

```bash
npm install sql.js
```

## Step 2: Initialize Database

Add to your main app file (e.g., `src/App.tsx` or `src/main.tsx`):

```typescript
import { useEffect } from 'react';
import { initializeDatabase, seedDatabase } from '@/db';

function App() {
  useEffect(() => {
    async function setupDatabase() {
      try {
        console.log('Initializing database...');
        const db = await initializeDatabase();
        
        // Optional: Seed with mock data (only for first time)
        const shouldSeed = !localStorage.getItem('agentic_crm_database');
        if (shouldSeed) {
          console.log('Seeding database with mock data...');
          await seedDatabase(db);
        }
        
        console.log('✅ Database ready!');
      } catch (error) {
        console.error('Database initialization failed:', error);
      }
    }
    
    setupDatabase();
  }, []);
  
  return (
    // Your app components
  );
}
```

## Step 3: Use in Components

### Example: Contacts List

```typescript
import { useEffect, useState } from 'react';
import { ContactRepository } from '@/db';
import { Contact } from '@/crm/types/contact';

function ContactsList() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    async function loadContacts() {
      try {
        const repo = new ContactRepository();
        const data = await repo.getAll('name ASC');
        setContacts(data);
      } catch (error) {
        console.error('Failed to load contacts:', error);
      } finally {
        setLoading(false);
      }
    }
    
    loadContacts();
  }, []);
  
  if (loading) return <div>Loading...</div>;
  
  return (
    <div>
      {contacts.map(contact => (
        <div key={contact.id}>
          <h3>{contact.name}</h3>
          <p>{contact.email}</p>
        </div>
      ))}
    </div>
  );
}
```

### Example: Create Contact

```typescript
import { ContactRepository } from '@/db';
import { Contact } from '@/crm/types/contact';

async function handleCreateContact(formData: Partial<Contact>) {
  try {
    const repo = new ContactRepository();
    
    const newContact = await repo.create({
      id: crypto.randomUUID(),
      name: formData.name!,
      email: formData.email,
      phone: formData.phone,
      position: formData.position,
      avatar: formData.avatar || '',
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    
    console.log('✅ Contact created:', newContact);
    return newContact;
  } catch (error) {
    console.error('Failed to create contact:', error);
    throw error;
  }
}
```

### Example: Update Contact

```typescript
import { ContactRepository } from '@/db';

async function handleUpdateContact(id: string, updates: Partial<Contact>) {
  try {
    const repo = new ContactRepository();
    const updated = await repo.update(id, updates);
    
    if (updated) {
      console.log('✅ Contact updated:', updated);
    }
    return updated;
  } catch (error) {
    console.error('Failed to update contact:', error);
    throw error;
  }
}
```

### Example: Delete Contact

```typescript
import { ContactRepository } from '@/db';

async function handleDeleteContact(id: string) {
  try {
    const repo = new ContactRepository();
    const success = await repo.delete(id);
    
    if (success) {
      console.log('✅ Contact deleted');
    }
    return success;
  } catch (error) {
    console.error('Failed to delete contact:', error);
    throw error;
  }
}
```

## Step 4: Working with Relationships

### Add Company to Contact

```typescript
import { CompanyRepository } from '@/db';

async function linkContactToCompany(companyId: string, contactId: string) {
  const repo = new CompanyRepository();
  await repo.addContact(companyId, contactId);
  console.log('✅ Contact linked to company');
}
```

### Get Company with Relationships

```typescript
import { CompanyRepository } from '@/db';

async function getCompanyDetails(companyId: string) {
  const repo = new CompanyRepository();
  const company = await repo.getWithRelationships(companyId);
  
  console.log('Company:', company);
  console.log('Contact IDs:', company.contactIds);
  console.log('Category IDs:', company.categoryIds);
  
  return company;
}
```

## Step 5: Search and Filter

```typescript
import { ContactRepository, DealRepository } from '@/db';

// Search contacts by name
async function searchContacts(term: string) {
  const repo = new ContactRepository();
  return await repo.searchByName(term);
}

// Get overdue deals
async function getOverdueDeals() {
  const repo = new DealRepository();
  return await repo.findOverdue();
}

// Get deals by status
async function getDealsByStatus(status: 'pending' | 'in_progress' | 'completed') {
  const repo = new DealRepository();
  return await repo.findByStatus(status);
}
```

## Debugging Tips

### Open Browser Console and Run:

```javascript
// Import debug utilities (in browser console after app loads)
import { dbDebug } from '@/db/debug';

// View database statistics
dbDebug.printDatabaseStats();

// View sample data
dbDebug.sampleTable('contacts', 10);

// Download database
dbDebug.downloadDatabase();

// Validate integrity
dbDebug.validateForeignKeys();
```

### Reset Database (Development)

```typescript
import { resetDatabase } from '@/db';

// In your component or debug function
async function handleReset() {
  if (confirm('This will delete all data. Continue?')) {
    await resetDatabase();
    console.log('✅ Database reset complete');
    window.location.reload();
  }
}
```

## Common Patterns

### Custom Hook for Repository

```typescript
import { useState, useEffect } from 'react';
import { ContactRepository } from '@/db';
import { Contact } from '@/crm/types/contact';

export function useContacts() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  const repo = new ContactRepository();
  
  const loadContacts = async () => {
    try {
      setLoading(true);
      const data = await repo.getAll('name ASC');
      setContacts(data);
      setError(null);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };
  
  const createContact = async (contact: Contact) => {
    const created = await repo.create(contact);
    setContacts(prev => [...prev, created]);
    return created;
  };
  
  const updateContact = async (id: string, updates: Partial<Contact>) => {
    const updated = await repo.update(id, updates);
    if (updated) {
      setContacts(prev => prev.map(c => c.id === id ? updated : c));
    }
    return updated;
  };
  
  const deleteContact = async (id: string) => {
    const success = await repo.delete(id);
    if (success) {
      setContacts(prev => prev.filter(c => c.id !== id));
    }
    return success;
  };
  
  useEffect(() => {
    loadContacts();
  }, []);
  
  return {
    contacts,
    loading,
    error,
    refresh: loadContacts,
    create: createContact,
    update: updateContact,
    delete: deleteContact,
  };
}
```

### Use the Hook

```typescript
function ContactsPage() {
  const { contacts, loading, create, update, delete: deleteContact } = useContacts();
  
  if (loading) return <div>Loading...</div>;
  
  return (
    <div>
      {contacts.map(contact => (
        <ContactCard
          key={contact.id}
          contact={contact}
          onUpdate={(updates) => update(contact.id, updates)}
          onDelete={() => deleteContact(contact.id)}
        />
      ))}
    </div>
  );
}
```

## Troubleshooting

### Issue: Database not persisting

**Solution:** Check localStorage quota and ensure `saveDatabase()` is called after changes.

### Issue: sql.js not loading

**Solution:** Verify sql.js is installed and WASM file is accessible. Check browser console for errors.

### Issue: Type errors with Date fields

**Solution:** Mappers handle Date ↔ timestamp conversion. Always use repository methods, not direct DB access.

### Issue: Foreign key violations

**Solution:** Use `dbDebug.validateForeignKeys()` to identify issues. Ensure parent records exist before creating children.

## Next Steps

1. ✅ Database initialized
2. ✅ CRUD operations working
3. ⏭️ Replace mock data imports in all pages
4. ⏭️ Add loading states and error handling
5. ⏭️ Implement search and filtering
6. ⏭️ Add relationship management UI
7. ⏭️ Test with large datasets
8. ⏭️ Add data export/import features

## Resources

- 📖 Full Documentation: `src/db/README.md`
- 🔧 Implementation Details: `IMPLEMENTATION_SUMMARY.md`
- 🗺️ Schema Reference: `src/db/schema.ts`
- 🐛 Debug Tools: `src/db/debug.ts`

---

**Ready to code!** 🎉
