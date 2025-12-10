/**
 * Migration 001: Seed Lookup Tables
 * Seeds categories, connection strengths, employee ranges, and estimated ARRs
 */

import { Database } from 'sql.js';
import type { Migration } from '../migrations';

export const migration001: Migration = {
  version: 1,
  name: 'seed_lookup_tables',

  async up(db: Database): Promise<void> {
    // Seed categories
    const categories = [
      { id: '1', name: 'Technology', color: 'blue', bullet: '●', description: 'Technology companies' },
      { id: '2', name: 'Finance', color: 'green', bullet: '●', description: 'Financial services' },
      { id: '3', name: 'Healthcare', color: 'red', bullet: '●', description: 'Healthcare providers' },
      { id: '4', name: 'Retail', color: 'purple', bullet: '●', description: 'Retail businesses' },
      { id: '5', name: 'Manufacturing', color: 'orange', bullet: '●', description: 'Manufacturing companies' },
    ];

    categories.forEach((cat) => {
      db.run(
        'INSERT OR IGNORE INTO categories (id, name, color, bullet, description) VALUES (?, ?, ?, ?, ?)',
        [cat.id, cat.name, cat.color, cat.bullet, cat.description]
      );
    });

    // Seed connection strengths
    const strengths = [
      { id: '1', name: 'Weak', color: 'bg-red-500 text-red-900 dark:bg-red-500 dark:text-red-100' },
      { id: '2', name: 'Medium', color: 'bg-yellow-500 text-yellow-900 dark:bg-yellow-500 dark:text-yellow-100' },
      { id: '3', name: 'Strong', color: 'bg-green-500 text-green-900 dark:bg-green-500 dark:text-green-100' },
      { id: '4', name: 'Very Strong', color: 'bg-blue-500 text-blue-900 dark:bg-blue-500 dark:text-blue-100' },
      { id: '5', name: 'Extremely Strong', color: 'bg-purple-500 text-purple-900 dark:bg-purple-500 dark:text-purple-100' },
    ];

    strengths.forEach((strength) => {
      db.run(
        'INSERT OR IGNORE INTO connection_strengths (id, name, color) VALUES (?, ?, ?)',
        [strength.id, strength.name, strength.color]
      );
    });

    // Seed employee ranges
    const employeeRanges = [
      { id: '1', label: '1-10' },
      { id: '2', label: '11-50' },
      { id: '3', label: '51-200' },
      { id: '4', label: '201-500' },
      { id: '5', label: '501-1000' },
      { id: '6', label: '1000+' },
    ];

    employeeRanges.forEach((range) => {
      db.run(
        'INSERT OR IGNORE INTO employee_ranges (id, label) VALUES (?, ?)',
        [range.id, range.label]
      );
    });

    // Seed estimated ARRs
    const estimatedArrs = [
      { id: '1', label: '$0-$100K' },
      { id: '2', label: '$100K-$500K' },
      { id: '3', label: '$500K-$1M' },
      { id: '4', label: '$1M-$5M' },
      { id: '5', label: '$5M-$10M' },
      { id: '6', label: '$10M+' },
    ];

    estimatedArrs.forEach((arr) => {
      db.run(
        'INSERT OR IGNORE INTO estimated_arrs (id, label) VALUES (?, ?)',
        [arr.id, arr.label]
      );
    });

    console.log('✅ Lookup tables seeded');
  },

  async down(db: Database): Promise<void> {
    db.run('DELETE FROM categories');
    db.run('DELETE FROM connection_strengths');
    db.run('DELETE FROM employee_ranges');
    db.run('DELETE FROM estimated_arrs');
    console.log('✅ Lookup tables cleared');
  },
};
