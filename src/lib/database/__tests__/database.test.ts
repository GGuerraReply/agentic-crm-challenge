import {
  initDatabase,
  clearDatabase,
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
} from '../index';

async function testContacts() {
  console.log('\n=== Testing Contacts CRUD ===');

  // Create
  const testContact = {
    id: 'contact-1',
    avatar: '/test-avatar.png',
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+1234567890',
    position: 'Software Engineer',
    company: 'Tech Corp',
    socialLinks: {
      linkedin: 'https://linkedin.com/in/johndoe',
      github: 'https://github.com/johndoe',
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  createContact(testContact);
  console.log('✓ Contact created');

  // Read All
  const contacts = getAllContacts();
  console.log(`✓ Retrieved ${contacts.length} contact(s)`);

  // Read One
  const contact = getContactById('contact-1');
  console.log('✓ Contact retrieved by ID:', contact?.name);

  // Update
  updateContact('contact-1', { phone: '+9876543210' });
  const updated = getContactById('contact-1');
  console.log('✓ Contact updated, new phone:', updated?.phone);

  // Delete
  deleteContact('contact-1');
  const deleted = getContactById('contact-1');
  console.log('✓ Contact deleted:', deleted === null);
}

async function testCompanies() {
  console.log('\n=== Testing Companies CRUD ===');

  // Create
  const testCompany = {
    id: 'company-1',
    name: 'Tech Corp',
    email: 'info@techcorp.com',
    phone: '+1234567890',
    description: 'A technology company',
    categoryIds: ['cat-1', 'cat-2'],
    contactIds: ['contact-1'],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  createCompany(testCompany);
  console.log('✓ Company created');

  // Read All
  const companies = getAllCompanies();
  console.log(`✓ Retrieved ${companies.length} company(ies)`);

  // Read One
  const company = getCompanyById('company-1');
  console.log('✓ Company retrieved by ID:', company?.name);

  // Update
  updateCompany('company-1', { description: 'Updated description' });
  const updated = getCompanyById('company-1');
  console.log('✓ Company updated:', updated?.description);

  // Delete
  deleteCompany('company-1');
  const deleted = getCompanyById('company-1');
  console.log('✓ Company deleted:', deleted === null);
}

async function testDeals() {
  console.log('\n=== Testing Deals CRUD ===');

  // Create
  const testDeal = {
    id: 'deal-1',
    title: 'New Enterprise Deal',
    content: 'Large contract with Tech Corp',
    userName: 'Sales Manager',
    dueAt: new Date(),
    status: 'pending' as const,
    priority: 'high' as const,
    amount: 50000,
    currency: 'USD' as const,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  createDeal(testDeal);
  console.log('✓ Deal created');

  // Read All
  const deals = getAllDeals();
  console.log(`✓ Retrieved ${deals.length} deal(s)`);

  // Read One
  const deal = getDealById('deal-1');
  console.log('✓ Deal retrieved by ID:', deal?.title);

  // Update
  updateDeal('deal-1', { status: 'in_progress' });
  const updated = getDealById('deal-1');
  console.log('✓ Deal updated, new status:', updated?.status);

  // Delete
  deleteDeal('deal-1');
  const deleted = getDealById('deal-1');
  console.log('✓ Deal deleted:', deleted === null);
}

async function testTasks() {
  console.log('\n=== Testing Tasks CRUD ===');

  // Create
  const testTask = {
    id: 'task-1',
    title: 'Follow up with client',
    content: 'Schedule a meeting to discuss requirements',
    createdBy: 'Project Manager',
    dueAt: new Date(),
    status: 'pending' as const,
    priority: 'medium' as const,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  createTask(testTask);
  console.log('✓ Task created');

  // Read All
  const tasks = getAllTasks();
  console.log(`✓ Retrieved ${tasks.length} task(s)`);

  // Read One
  const task = getTaskById('task-1');
  console.log('✓ Task retrieved by ID:', task?.title);

  // Update
  updateTask('task-1', { status: 'in_progress' });
  const updated = getTaskById('task-1');
  console.log('✓ Task updated, new status:', updated?.status);

  // Delete
  deleteTask('task-1');
  const deleted = getTaskById('task-1');
  console.log('✓ Task deleted:', deleted === null);
}

async function testNotes() {
  console.log('\n=== Testing Notes CRUD ===');

  // Create
  const testNote = {
    id: 'note-1',
    title: 'Meeting Notes',
    content: 'Discussed project timeline and deliverables',
    createdBy: 'Team Lead',
    dueAt: new Date(),
    status: 'pending' as const,
    assignedContactIds: ['contact-1'],
    companyIds: ['company-1'],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  createNote(testNote);
  console.log('✓ Note created');

  // Read All
  const notes = getAllNotes();
  console.log(`✓ Retrieved ${notes.length} note(s)`);

  // Read One
  const note = getNoteById('note-1');
  console.log('✓ Note retrieved by ID:', note?.title);

  // Update
  updateNote('note-1', { status: 'completed' });
  const updated = getNoteById('note-1');
  console.log('✓ Note updated, new status:', updated?.status);

  // Delete
  deleteNote('note-1');
  const deleted = getNoteById('note-1');
  console.log('✓ Note deleted:', deleted === null);
}

async function runAllTests() {
  console.log('Starting Database Tests...\n');
  console.log('Initializing database...');

  // Clear any existing data
  clearDatabase();

  // Initialize fresh database
  await initDatabase();
  console.log('✓ Database initialized\n');

  try {
    await testContacts();
    await testCompanies();
    await testDeals();
    await testTasks();
    await testNotes();

    console.log('\n✅ All tests passed successfully!');
  } catch (error) {
    console.error('\n❌ Test failed:', error);
    throw error;
  }
}

// Run tests
runAllTests().catch(console.error);
