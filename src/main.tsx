import ReactDOM from 'react-dom/client';
import { lazy, Suspense } from 'react';
import './index.css';

const App = lazy(() => import('./App.tsx'));

const laztPlacholder = (
  <div className="flex h-screen items-center justify-center">App Loading...</div>
);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <Suspense fallback={laztPlacholder}>
    <App />
  </Suspense>,
);
