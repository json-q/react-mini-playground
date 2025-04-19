import { Editor, type EditorProps, type OnMount } from '@monaco-editor/react';
import { createATA } from './ata';

export interface EditorContentFileInfo {
  name: string;
  value: string;
  language: string;
}

interface EditorContentProps {
  file: EditorContentFileInfo;
  onChange?: EditorProps['onChange'];
  options?: EditorProps['options'];
}

export default function EditorContent(props: EditorContentProps) {
  const { file = {} as EditorContentFileInfo, onChange, options } = props;

  const handleEditorDidMount: OnMount = (editor, monaco) => {
    // 无法识别 jsx 的问题（设置 tsconfig）
    monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
      jsx: monaco.languages.typescript.JsxEmit.Preserve,
      esModuleInterop: true,
    });

    const ata = createATA((code, path) => {
      monaco.languages.typescript.typescriptDefaults.addExtraLib(code, `file://${path}`);
    });

    editor.onDidChangeModelContent(() => {
      ata(editor.getValue());
    });

    ata(editor.getValue());
  };

  return (
    <Editor
      height="100%"
      className="flex-1"
      path={file.name}
      language={file.language}
      value={file.value}
      onMount={handleEditorDidMount}
      onChange={onChange}
      options={{
        scrollBeyondLastLine: false,
        minimap: {
          enabled: false,
        },
        scrollbar: {
          verticalScrollbarSize: 6,
          horizontalSliderSize: 6,
        },
        ...options,
      }}
    />
  );
}
