import type { CodeContainerFileInfo } from '@/components/CodeContainer';
import { createContext } from 'react';

export interface MultipleFiles {
  [key: string]: CodeContainerFileInfo;
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
