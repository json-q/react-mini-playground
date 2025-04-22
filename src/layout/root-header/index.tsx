import ReactLogo from "@/icons/react-logo";
export default function RootHeader() {
  return (
    <header className='flex items-center border-b p-2'>
      <ReactLogo className='h-8 w-8' style={{ color: "#61DAFB" }} />
      <span className='ml-2'>React Mini Playground</span>
    </header>
  );
}
