import { useCallback, useContext } from "react";
import { Download, MoonIcon, Share2, SunIcon } from "lucide-react";
import { toast } from "sonner";

import ReactLogo from "@/icons/react-logo";
import { downloadFiles } from "@/core/util";
import { PlaygroundContext } from "@/core/context";
import { useTheme } from "@/hooks/useTheme";

import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function RootHeader() {
  const { files } = useContext(PlaygroundContext);
  const { theme, setTheme } = useTheme();

  const toggleTheme = useCallback(() => {
    const _theme = ["system", "light"].includes(theme) ? "light" : "dark";
    setTheme(_theme === "dark" ? "light" : "dark");
  }, [theme]);

  const copyLink = () => {
    // chrome 66 support clipboard.writeText
    navigator.clipboard.writeText(window.location.href);
    toast.success("分享链接复制成功", { position: "top-center" });
  };

  return (
    <header className='flex items-center justify-between border-b p-2'>
      <div className='flex items-center'>
        <ReactLogo className='h-8 w-8' style={{ color: "#61DAFB" }} />
        <span className='ml-2'>React Mini Playground</span>
      </div>
      <div className='flex items-center gap-2'>
        {/* Share */}
        <Button title='Share link' variant='ghost' className='size-8' onClick={copyLink}>
          <Share2 />
          <span className='sr-only'>Share link</span>
        </Button>

        {/* Download */}
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button title='Download files' variant='ghost' className='size-8'>
              <Download />
              <span className='sr-only'>Download files</span>
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>下载提醒</AlertDialogTitle>
              <AlertDialogDescription>是否下载源代码文件 ?</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>取消</AlertDialogCancel>
              <AlertDialogAction onClick={() => downloadFiles(files || {})}>确定</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Theme */}
        <Button title='Toggle theme' variant='ghost' className='size-8' onClick={toggleTheme}>
          <SunIcon className='hidden [html.dark_&]:block' />
          <MoonIcon className='hidden [html.light_&]:block' />
          <span className='sr-only'>Toggle theme</span>
        </Button>
      </div>
    </header>
  );
}
