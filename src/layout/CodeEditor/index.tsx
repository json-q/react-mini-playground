import { lazy, Suspense, useContext } from 'react';
import FileNameList from '@/components/FileNameList';
import { PlaygroundContext } from '@/Playground/context';

const EditorContent = lazy(() => import('@/components/EditorContent'));

export default function CodeEditor() {
  const { files = {}, selectedFileName } = useContext(PlaygroundContext);

  return (
    <div className="flex h-full flex-col">
      <FileNameList />
      <Suspense fallback={<div>EditorContent Load</div>}>
        <EditorContent file={files[selectedFileName]} />
      </Suspense>
    </div>
  );
}
