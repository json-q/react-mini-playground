import { createContext } from "react";
import type { CodeContainerFileInfo } from "@/components/code-container";
import { ENTRY_FILE_NAME } from "../files";

// CodeFile Context
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
  selectedFileName: ENTRY_FILE_NAME,
} as PlaygroundContextProps);

// Theme Context
export type Theme = "dark" | "light" | "system";

export type ThemeContextProps = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

export const ThemeContext = createContext<ThemeContextProps>({
  theme: "system",
} as ThemeContextProps);
