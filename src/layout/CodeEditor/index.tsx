import FileNameList from '@/components/FileNameList';
import EditorContent, { type EditorContentFileInfo } from '@/components/EditorContent';

export default function CodeEditor() {
  const file: EditorContentFileInfo = {
    name: 'test.tsx',
    language: 'typescript',
    value: `
import React from "react";

export default function App() {
  const [count, setCount] = React.useState(0);

  return (
    <button onClick={() => setCount(count + 1)}>
      Primary Button
    </button>
  )
}
    `,
  };

  return (
    <div className="flex h-full flex-col">
      <FileNameList />
      <EditorContent file={file} />
    </div>
  );
}
