import { ThemeProvider } from 'next-themes';
import { BrowserRouter } from 'react-router-dom';
import { LoadingBarContainer } from 'react-top-loading-bar';
import { Toaster } from '@/components/ui/sonner';
import { ModulesProvider } from './providers/modules-provider';
import { useDatabaseInit } from './hooks/use-database-init';

const { BASE_URL } = import.meta.env;

export function App() {
  // Initialize the SQLite database on app load
  const { isInitialized, error } = useDatabaseInit();

  if (error) {
    return (
      <div style={{ padding: '20px', color: 'red' }}>
        <h1>Database Initialization Error</h1>
        <p>{error.message}</p>
      </div>
    );
  }

  if (!isInitialized) {
    return (
      <div style={{ padding: '20px' }}>
        <h1>Initializing database...</h1>
      </div>
    );
  }

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      storageKey="vite-theme"
      enableSystem
      disableTransitionOnChange
      enableColorScheme
    >
      <LoadingBarContainer>
        <BrowserRouter basename={BASE_URL}>
          <Toaster />
          <ModulesProvider />
        </BrowserRouter>
      </LoadingBarContainer>
    </ThemeProvider>
  );
}
