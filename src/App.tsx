import { lazy, Suspense } from 'react';
import { Allotment } from 'allotment';
import 'allotment/dist/style.css';

import Header from '@/layout/Header';
import { PlaygroundProvider } from '@/core/context/PlaygroundProvider';
import LazyLoading from '@/components/LazyLoading';

const RootEditor = lazy(() => import('@/layout/RootEditor'));
const RootPreview = lazy(() => import('@/layout/RootPreview'));

function App() {
  return (
    <div className="flex h-screen flex-col">
      <Header />

      <section className="flex-1">
        <PlaygroundProvider>
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
        </PlaygroundProvider>
      </section>
    </div>
  );
}

export default App;
