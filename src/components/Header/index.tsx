import ReactLogo from '@/icons/ReactLogo';
export default function Header() {
  return (
    <div className="flex items-center border-b p-2">
      <ReactLogo className="h-8 w-8" style={{ color: '#61DAFB' }} />
      <span className="ml-2">React Mini Playground</span>
    </div>
  );
}
