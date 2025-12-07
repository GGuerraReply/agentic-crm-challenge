import { useEffect, useState } from 'react';
import { initDatabase } from '@/lib/database';

/**
 * Hook to initialize the SQLite database
 * This should be called once at the root of the application
 */
export function useDatabaseInit() {
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function init() {
      try {
        await initDatabase();
        setIsInitialized(true);
        console.log('Database initialized successfully');
      } catch (err) {
        console.error('Failed to initialize database:', err);
        setError(err as Error);
      }
    }

    init();
  }, []);

  return { isInitialized, error };
}
