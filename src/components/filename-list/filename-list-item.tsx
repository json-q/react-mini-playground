import { useContext, useRef, useState } from "react";
import { X } from "lucide-react";
import { PlaygroundContext } from "@/core/context";
import { cn } from "@/lib/utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { buttonVariants } from "../ui/button";

interface FileNameListItemProps {
  name: string;
  onClick?: (name: string) => void;
  onCompleteEdit?: (name: string, prevName: string) => void;
  onRemove?: () => void;
  readonly?: boolean;
}

export default function FileNameListItem(props: FileNameListItemProps) {
  const { name, onClick, onCompleteEdit, onRemove, readonly } = props;
  const { selectedFileName } = useContext(PlaygroundContext);

  // =============== Modal ===============
  const [open, setOpen] = useState(false);
  const [delFileName, setDelFileName] = useState("");

  // =============== Editing ===============
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
      toast.error("重命名文件名不能为空");
      setIsEditing(false);
      return;
    }

    if (inputRef.current?.value === name) {
      setIsEditing(false);
      return;
    }

    onCompleteEdit?.(inputRef.current?.value, name);
  };

  const onListenerKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onConfirmEdit();
    }
  };

  const onInnerRemove = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation();

    setOpen(true);
    setDelFileName(name);
  };

  return (
    <div
      role='button'
      key={name}
      className={cn(
        "flex cursor-pointer flex-row items-center whitespace-nowrap p-2 align-middle transition-colors hover:bg-accent",
        {
          "border-primary border-b-2 bg-accent text-primary": selectedFileName === name,
        },
      )}
      onClick={() => onClick?.(name)}
      onDoubleClick={readonly ? undefined : onDoubleClick}
    >
      {isEditing ? (
        <input
          className='w-24 bg-accent text-foreground text-sm outline-none'
          type='text'
          ref={inputRef}
          defaultValue={name}
          onBlur={onConfirmEdit}
          onKeyUp={onListenerKeyUp}
        />
      ) : (
        <>
          {name}
          {!readonly && (
            <button type='button' className='cursor-pointer px-1' onClick={onInnerRemove}>
              <X className='h-3 w-3' />
            </button>
          )}
        </>
      )}

      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>操作提醒</AlertDialogTitle>
            <AlertDialogDescription>
              是否删除
              <code className='relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono font-sesemibosemibold'>
                {delFileName}
              </code>
              ?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction
              className={buttonVariants({ variant: "destructive" })}
              onClick={onRemove}
            >
              确定
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
