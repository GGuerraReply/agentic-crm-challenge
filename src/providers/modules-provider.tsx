import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import { ScreenLoader } from '@/components/screen-loader';
import { DbInitializer } from './db-initializer';

const LazyCrmModule = lazy(() => import('@/crm'));

export function ModulesProvider() {
  return (
    <Routes>
      <Route
        path="/*"
        element={
          <DbInitializer>
            <Suspense fallback={<ScreenLoader />}>
              <LazyCrmModule />
            </Suspense>
          </DbInitializer>
        }
      />
    </Routes>
  );
}
