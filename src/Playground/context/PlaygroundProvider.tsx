import { useCallback, useState } from 'react';
import { type MultipleFiles, PlaygroundContext } from '.';
import { fileName2Language } from '../util';

interface PlaygroundProviderProps {
  children: React.ReactNode;
}
export const PlaygroundProvider = (props: PlaygroundProviderProps) => {
  const { children } = props;
  const [files, setFiles] = useState<MultipleFiles>({});
  const [selectedFileName, setSelectedFileName] = useState('App.tsx');

  const addFile = useCallback(
    (name: string) => {
      files[name] = {
        name,
        language: fileName2Language(name),
        value: '',
      };
      setFiles({ ...files });
    },
    [files],
  );

  const removeFile = useCallback(
    (name: string) => {
      delete files[name];
      setFiles({ ...files });
    },
    [files],
  );

  const updateFileName = useCallback(
    (oldFieldName: string, newFieldName: string) => {
      if (!files[oldFieldName] || !newFieldName) return;

      const { [oldFieldName]: updatingFileValue, ...rest } = files;

      const newFile = {
        [newFieldName]: {
          ...updatingFileValue,
          language: fileName2Language(newFieldName),
          name: newFieldName,
        },
      };
      setFiles({ ...rest, ...newFile });
    },
    [files],
  );

  return (
    <PlaygroundContext
      value={{
        files,
        selectedFileName,
        setSelectedFileName,
        setFiles,
        addFile,
        removeFile,
        updateFileName,
      }}
    >
      {children}
    </PlaygroundContext>
  );
};
