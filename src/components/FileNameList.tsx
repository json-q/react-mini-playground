import { cn } from '@/lib/utils';
import { PlaygroundContext } from '@/Playground/context';
import { useContext, useEffect, useMemo, useRef } from 'react';

export default function FileNameList() {
  const {
    files = {},
    removeFile,
    addFile,
    updateFileName,
    selectedFileName,
    setSelectedFileName,
  } = useContext(PlaygroundContext);
  const fileContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.addEventListener('wheel', handleWheel);
    return () => {
      window.removeEventListener('wheel', handleWheel);
    };
  }, []);

  const handleWheel = (ev: WheelEvent) => {
    fileContainerRef.current!.scrollLeft += ev.deltaY;
  };

  const fileTabs = useMemo(() => {
    return Object.keys(files);
  }, [files]);

  const selectedFile = (fileName: string) => {
    setSelectedFileName(fileName);
  };

  return (
    <div
      ref={fileContainerRef}
      className="scrollbar scrollbar-thumb-blue-500 scrollbar-h-[1px] scrollbar-track-transparent flex w-full flex-none gap-2 overflow-x-auto overflow-y-hidden border-b"
    >
      {fileTabs.map((item) => {
        return (
          <div
            role="button"
            key={item}
            className={cn(
              'cursor-pointer whitespace-nowrap p-2 align-middle transition-colors hover:bg-accent',
              {
                'border-b-2 border-b-blue-500 bg-accent text-blue-500': selectedFileName === item,
              },
            )}
            onClick={() => selectedFile(item)}
          >
            {item}
          </div>
        );
      })}
    </div>
  );
}
