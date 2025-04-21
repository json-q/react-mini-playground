import { PlaygroundContext } from '@/core/context';
import { useContext, useEffect, useMemo, useRef } from 'react';
import { debounce } from 'lodash-es';
import FileNameListItem from './FileNameListItem';

export default function FileNameList() {
  const { files = {}, setSelectedFileName } = useContext(PlaygroundContext);

  const fileContainerRef = useRef<HTMLDivElement>(null);
  const isHover = useRef(false);

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

  const fileTabs = useMemo(() => {
    return Object.keys(files);
  }, [files]);

  const selectedFile = (fileName: string) => {
    setSelectedFileName(fileName);
  };

  const handleMouseEnter = () => {
    isHover.current = true;
  };

  const handleMouseLeave = () => {
    isHover.current = false;
  };

  return (
    <div
      role="navigation"
      onMouseLeave={debounce(handleMouseLeave, 300)}
      onMouseEnter={debounce(handleMouseEnter, 300)}
      ref={fileContainerRef}
      className="scrollbar scrollbar-thumb-blue-500 scrollbar-h-[1px] scrollbar-track-transparent flex w-full flex-none gap-2 overflow-x-auto overflow-y-hidden border-b"
    >
      {fileTabs.map((item) => {
        return <FileNameListItem name={item} key={item} onClick={() => selectedFile(item)} />;
      })}
    </div>
  );
}
