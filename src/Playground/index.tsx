import { lazy, Suspense } from 'react';
import { Allotment } from 'allotment';
import 'allotment/dist/style.css';

import Header from '@/layout/Header';

const CodeEditor = lazy(() => import('@/layout/CodeEditor'));

const Preview = lazy(() => import('@/layout/Preview'));

export default function ReactPlayground() {
  return (
    <div className="flex h-screen flex-col">
      <Header />

      <section className="flex-1">
        <Allotment defaultSizes={[100, 100]}>
          <Allotment.Pane minSize={250}>
            <Suspense>
              <CodeEditor />
            </Suspense>
          </Allotment.Pane>
          <Allotment.Pane minSize={0}>
            <Suspense>
              <Preview />
            </Suspense>
          </Allotment.Pane>
        </Allotment>
      </section>
    </div>
  );
}
