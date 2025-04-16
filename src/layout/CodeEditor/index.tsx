import {} from '@monaco-editor/react';
import FileNameList from '@/components/FileNameList';
import EditorContent from '@/components/EditorContent';

export default function CodeEditor() {
  return (
    <div className="flex h-full flex-col">
      <FileNameList />
      <EditorContent />
    </div>
  );
}
