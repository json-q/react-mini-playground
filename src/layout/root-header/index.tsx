import { useCallback } from "react";
import { MoonIcon, SunIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import ReactLogo from "@/icons/react-logo";
import { useTheme } from "@/hooks/useTheme";

export default function RootHeader() {
  const { theme, setTheme } = useTheme();

  const toggleTheme = useCallback(() => {
    setTheme(theme === "dark" ? "light" : "dark");
  }, [theme, setTheme]);

  return (
    <header className='flex items-center justify-between border-b p-2'>
      <div className='flex items-center'>
        <ReactLogo className='h-8 w-8' style={{ color: "#61DAFB" }} />
        <span className='ml-2'>React Mini Playground</span>
      </div>
      <div className='flex items-center'>
        <Button variant='ghost' className='size-8 cursor-pointer px-0' onClick={toggleTheme}>
          <SunIcon className='hidden [html.dark_&]:block' />
          <MoonIcon className='hidden [html.light_&]:block' />
          <span className='sr-only'>Toggle theme</span>
        </Button>
      </div>
    </header>
  );
}
