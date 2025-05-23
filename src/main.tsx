import { lazy, Suspense } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

const App = lazy(() => import("./App.tsx"));

const lazyPlaceholder = (
  <div className='flex h-screen items-center justify-center font-bold'>App Loading...</div>
);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <Suspense fallback={lazyPlaceholder}>
    <App />
  </Suspense>,
);
