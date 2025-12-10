import { useEffect, useState } from 'react';
import {
  ContactRepository,
  getDatabase,
  initializeDatabase,
  seedDatabase,
} from '@/db';
import { ScreenLoader } from '@/components/screen-loader';

type DbInitializerProps = {
  children: React.ReactNode;
};

export function DbInitializer({ children }: DbInitializerProps) {
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        await initializeDatabase();
        // Seed on first run if empty
        const db = getDatabase();
        const contactRepo = new ContactRepository(db);
        const count = await contactRepo.count();
        if (count === 0) {
          console.log('No contacts found. Seeding initial data...');
          await seedDatabase(db);
        }
        if (mounted) setReady(true);
      } catch (e) {
        console.error('Database initialization failed:', e);
        if (mounted) setError('Failed to initialize local database');
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  if (error) {
    return <div className="p-6 text-red-600">{error}</div>;
  }

  if (!ready) {
    return <ScreenLoader />;
  }

  return <>{children}</>;
}
