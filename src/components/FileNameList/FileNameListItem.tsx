import { useContext, useRef, useState } from 'react';
import { PlaygroundContext } from '@/core/context';
import { cn } from '@/lib/utils';

interface FileNameListItemProps {
  name: string;
  onClick?: (name: string) => void;
}
export default function FileNameListItem(props: FileNameListItemProps) {
  const { name, onClick } = props;
  const { selectedFileName, updateFileName, setSelectedFileName } = useContext(PlaygroundContext);
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const onDoubleClick = () => {
    // flushSync(() => {
    //   setIsEditing(true);
    // });
    setIsEditing(true);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };

  const onConfirmEdit = () => {
    if (!inputRef.current?.value) {
      alert('文件名不能为空');
      setIsEditing(false);
      return;
    }

    if (inputRef.current?.value === name) {
      setIsEditing(false);
      return;
    }

    updateFileName(name, inputRef.current?.value);
    setSelectedFileName(inputRef.current?.value);
  };

  const onListenerKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onConfirmEdit();
    }
  };

  return (
    <div
      role="button"
      key={name}
      className={cn(
        'cursor-pointer whitespace-nowrap p-2 align-middle transition-colors hover:bg-accent',
        {
          'border-b-2 border-b-blue-500 bg-accent text-blue-500': selectedFileName === name,
        },
      )}
      onClick={() => onClick?.(name)}
      onDoubleClick={onDoubleClick}
    >
      {isEditing ? (
        <input
          className="w-24 bg-accent text-foreground text-sm outline-none"
          type="text"
          ref={inputRef}
          defaultValue={name}
          onBlur={onConfirmEdit}
          onKeyUp={onListenerKeyUp}
        />
      ) : (
        name
      )}
    </div>
  );
}
