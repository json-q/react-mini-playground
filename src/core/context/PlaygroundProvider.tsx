import { useCallback, useEffect, useState } from 'react';
import { compress, decodeCompress } from '@/core/util';
import { defaultFiles, ENTRY_FILE_NAME } from '../files';
import { fileName2Language } from '../util';
import { type MultipleFiles, PlaygroundContext } from '.';

interface PlaygroundProviderProps {
  children: React.ReactNode;
}

function genFilesFromHash(): MultipleFiles {
  try {
    const hash = window.location.hash.slice(1);
    const strFiles = decodeCompress(hash);
    return JSON.parse(strFiles);
  } catch (error) {
    console.warn(error);
  }
  return defaultFiles;
}

export const PlaygroundProvider = (props: PlaygroundProviderProps) => {
  const { children } = props;

  const [files, setFiles] = useState<MultipleFiles>(genFilesFromHash);
  const [selectedFileName, setSelectedFileName] = useState(ENTRY_FILE_NAME);

  useEffect(() => {
    const hash = compress(JSON.stringify(files));
    window.location.hash = hash;
  }, [files]);

  const addFile = useCallback(
    (name: string) => {
      setFiles({
        ...files,
        [name]: {
          name,
          language: fileName2Language(name),
          value: '',
        },
      });
    },
    [files],
  );

  const removeFile = useCallback(
    (name: string) => {
      const { [name]: _, ...restFiles } = files;
      setFiles(restFiles);
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
