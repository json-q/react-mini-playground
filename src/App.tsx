import { Allotment } from 'allotment';
import { lazy, Suspense } from 'react';
import 'allotment/dist/style.css';

import LazyLoading from '@/components/lazy-loading';
import { PlaygroundProvider } from '@/core/context/PlaygroundProvider';
import { Toaster } from './components/ui/sonner';
import { ThemeProvider } from './core/context/ThemeProvider';

const RootHeader = lazy(() => import('@/layout/root-header'));
const RootEditor = lazy(() => import('@/layout/root-editor'));
const RootPreview = lazy(() => import('@/layout/root-preview'));

function App() {
  return (
    <ThemeProvider defaultTheme="light">
      <div className="flex h-screen flex-col">
        <PlaygroundProvider>
          <Suspense fallback={<header className="h-12 border-b" />}>
            <RootHeader />
          </Suspense>

          <Toaster richColors position="top-right" toastOptions={{ duration: 2000 }} />

          <section className="flex-1">
            <Allotment defaultSizes={[100, 100]}>
              <Allotment.Pane minSize={250}>
                <Suspense fallback={<LazyLoading text="RootEditor Loading..." />}>
                  <RootEditor />
                </Suspense>
              </Allotment.Pane>
              <Allotment.Pane minSize={0}>
                <Suspense fallback={<LazyLoading text="RootPreview Loading..." />}>
                  <RootPreview />
                </Suspense>
              </Allotment.Pane>
            </Allotment>
          </section>
        </PlaygroundProvider>
      </div>
    </ThemeProvider>
  );
}

export default App;
