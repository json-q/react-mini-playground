import type { EditorContentFileInfo } from '@/components/EditorContent';
import { createContext } from 'react';

export interface MultipleFiles {
  [key: string]: EditorContentFileInfo;
}

export interface PlaygroundContextProps {
  files?: MultipleFiles;
  selectedFileName: string;
  setSelectedFileName: (fileName: string) => void;
  setFiles: (files: MultipleFiles) => void;
  addFile: (fileName: string) => void;
  removeFile: (fileName: string) => void;
  updateFileName: (oldFieldName: string, newFieldName: string) => void;
}

export const PlaygroundContext = createContext<PlaygroundContextProps>({
  selectedFileName: 'App.tsx',
} as PlaygroundContextProps);
