import { Editor, type OnMount } from '@monaco-editor/react';

export default function EditorContent() {
  const handleEditorDidMount: OnMount = (_, monaco) => {
    // 无法识别 jsx 的问题（设置 tsconfig）
    monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
      jsx: monaco.languages.typescript.JsxEmit.Preserve,
      esModuleInterop: true,
    });
  };

  const code = `function App() {
  return (
    <div>
      <h1 className="text-3xl font-bold underline">Hello world!</h1>
    </div>
  );
}
`;

  return (
    <Editor
      path="button.tsx"
      language="typescript"
      onMount={handleEditorDidMount}
      value={code}
      options={{
        scrollBeyondLastLine: false,
        minimap: {
          enabled: false,
        },
        scrollbar: {
          verticalScrollbarSize: 6,
          horizontalSliderSize: 6,
        },
      }}
    />
  );
}
