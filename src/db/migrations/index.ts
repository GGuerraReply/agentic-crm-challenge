/**
 * Migration Index
 * Registers all migrations in order
 */

import { migration001 } from './001_seed_lookup_tables';
import { migration002 } from './002_seed_contacts';
import { migration003 } from './003_seed_companies';
import { migration004 } from './004_seed_deals';
import type { Migration } from '../migrations';

/**
 * All migrations in order
 * IMPORTANT: Migrations must be listed in sequential version order
 */
export const allMigrations: Migration[] = [
  migration001,
  migration002,
  migration003,
  migration004,
];
