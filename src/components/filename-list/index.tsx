import { debounce } from 'lodash-es';
import { Plus } from 'lucide-react';
import { useContext, useEffect, useMemo, useRef } from 'react';
import { PlaygroundContext } from '@/core/context';
import { ENTRY_FILE_NAME } from '@/core/files';
import FileNameListItem from './filename-list-item';

export default function FileNameList() {
  const {
    files = {},
    selectedFileName,
    setSelectedFileName,
    addFile,
    updateFileName,
    removeFile,
  } = useContext(PlaygroundContext);

  const fileContainerRef = useRef<HTMLDivElement>(null);
  const isHover = useRef(false);

  const fileTabs = useMemo(() => {
    return Object.keys(files);
  }, [files]);

  const selectedFile = (fileName: string) => {
    setSelectedFileName(fileName);
  };

  // ============= wheel event =============
  useEffect(() => {
    window.addEventListener('wheel', handleWheel);
    return () => {
      window.removeEventListener('wheel', handleWheel);
    };
  }, []);

  const handleWheel = (ev: WheelEvent) => {
    if (!isHover.current) return;
    fileContainerRef.current!.scrollLeft += ev.deltaY;
  };

  const handleMouseEnter = () => {
    isHover.current = true;
  };

  const handleMouseLeave = () => {
    isHover.current = false;
  };

  // ================= Add File =================
  const onAddTab = () => {
    const newFileName = genNewFileName();
    addFile(newFileName);
    setSelectedFileName(newFileName);
  };

  function genNewFileName() {
    const baseName = 'Comp';

    // 检查是否已经有 Comp.tsx 文件
    if (!fileTabs.includes(`${baseName}.tsx`)) {
      return `${baseName}.tsx`; // Comp.tsx
    }

    // 匹配类似 Comp1.tsx、Comp2.tsx 的文件名，并根据最大序号进行新建
    const numberFiles = fileTabs
      .map((fileName) => {
        const reg = new RegExp(`^${baseName}(\\d*)\\.tsx$`);

        const match = fileName.match(reg);
        return match ? (match[1] ? Number.parseInt(match[1], 10) : 0) : null;
      })
      .filter((num) => num !== null)
      .sort((a, b) => a - b);

    const newNumber = numberFiles.length > 0 ? numberFiles[numberFiles.length - 1] + 1 : 1;

    return `${baseName}${newNumber}.tsx`;
  }

  // ================= Edit File =================
  const onCompleteEdit = (name: string, prevName: string) => {
    updateFileName(prevName, name);
    setSelectedFileName(name);
  };

  // ================= Remove File =================
  const onRemove = (name: string) => {
    removeFile(name);
  };

  useEffect(() => {
    if (!files[selectedFileName]) {
      setSelectedFileName(ENTRY_FILE_NAME);
    }
  }, [files, selectedFileName]);

  return (
    <div
      role="navigation"
      onMouseLeave={debounce(handleMouseLeave, 300)}
      onMouseEnter={debounce(handleMouseEnter, 300)}
      ref={fileContainerRef}
      className="scrollbar scrollbar-thumb-blue-500 scrollbar-h-[1px] scrollbar-track-transparent flex w-full flex-none gap-2 overflow-x-auto overflow-y-hidden border-b"
    >
      {fileTabs.map((item) => {
        return (
          <FileNameListItem
            onCompleteEdit={onCompleteEdit}
            name={item}
            key={item}
            readonly={files[item].readonly}
            onClick={() => selectedFile(item)}
            onRemove={() => onRemove(item)}
          />
        );
      })}

      <button
        type="button"
        className="m-0 cursor-pointer border-none align-middle outline-none hover:text-primary/60"
        onClick={onAddTab}
      >
        <Plus className="h-4 w-4" />
      </button>
    </div>
  );
}
