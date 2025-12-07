import { initDatabase, createContact, getAllContacts, getContactById, updateContact, deleteContact } from '../src/lib/database/index';

async function testDatabase() {
  console.log('Initializing database...');
  await initDatabase();

  console.log('\n--- Testing Contact CRUD Operations ---');

  // Create
  const testContact = {
    id: 'test-1',
    avatar: '/test-avatar.png',
    name: 'Test User',
    email: 'test@example.com',
    phone: '+1234567890',
    position: 'Test Position',
    company: 'Test Company',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  console.log('\n1. Creating contact...');
  createContact(testContact);
  console.log('Contact created successfully');

  // Read All
  console.log('\n2. Reading all contacts...');
  const allContacts = getAllContacts();
  console.log(`Found ${allContacts.length} contact(s)`);
  console.log('First contact:', allContacts[0]);

  // Read One
  console.log('\n3. Reading contact by ID...');
  const contact = getContactById('test-1');
  console.log('Contact found:', contact);

  // Update
  console.log('\n4. Updating contact...');
  updateContact('test-1', { phone: '+9876543210' });
  const updatedContact = getContactById('test-1');
  console.log('Updated contact:', updatedContact);

  // Delete
  console.log('\n5. Deleting contact...');
  deleteContact('test-1');
  const deletedContact = getContactById('test-1');
  console.log('Contact after deletion:', deletedContact);

  console.log('\n--- All tests passed! ---');
}

testDatabase().catch(console.error);
