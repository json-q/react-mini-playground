import { lazy, Suspense, useContext } from 'react';
import FileNameList from '@/components/FileNameList';
import { PlaygroundContext } from '@/core/context';
import LazyLoading from '@/components/LazyLoading';

const CodeContainer = lazy(() => import('@/components/CodeContainer'));

export default function RootEditor() {
  const { files = {}, selectedFileName } = useContext(PlaygroundContext);

  return (
    <div className="flex h-full flex-col">
      <FileNameList />
      <Suspense fallback={<LazyLoading text="CodeContainer Loading..." />}>
        <CodeContainer file={files[selectedFileName]} />
      </Suspense>
    </div>
  );
}
