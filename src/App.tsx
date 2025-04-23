import { lazy, Suspense } from "react";
import { Allotment } from "allotment";
import "allotment/dist/style.css";

import RootHeader from "@/layout/root-header";
import { PlaygroundProvider } from "@/core/context/PlaygroundProvider";
import LazyLoading from "@/components/lazy-loading";
import { Toaster } from "./components/ui/sonner";
import { ThemeProvider } from "./core/context/ThemeProvider";

const RootEditor = lazy(() => import("@/layout/root-editor"));
const RootPreview = lazy(() => import("@/layout/root-preview"));

function App() {
  return (
    <ThemeProvider defaultTheme='light'>
      <div className='flex h-screen flex-col'>
        <RootHeader />
        <Toaster richColors position='top-right' />

        <section className='flex-1'>
          <PlaygroundProvider>
            <Allotment defaultSizes={[100, 100]}>
              <Allotment.Pane minSize={250}>
                <Suspense fallback={<LazyLoading text='RootEditor Loading...' />}>
                  <RootEditor />
                </Suspense>
              </Allotment.Pane>
              <Allotment.Pane minSize={0}>
                <Suspense fallback={<LazyLoading text='RootPreview Loading...' />}>
                  <RootPreview />
                </Suspense>
              </Allotment.Pane>
            </Allotment>
          </PlaygroundProvider>
        </section>
      </div>
    </ThemeProvider>
  );
}

export default App;
