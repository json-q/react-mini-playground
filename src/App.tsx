import { lazy, Suspense } from 'react';
// import ReactPlayground from './Playground';

const ReactPlayground = lazy(() => import('./Playground'));

function App() {
  return (
    <Suspense fallback={<div />}>
      <ReactPlayground />
    </Suspense>
  );
}

export default App;
