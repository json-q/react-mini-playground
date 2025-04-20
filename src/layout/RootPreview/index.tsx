import { useContext, useEffect, useState } from 'react';
import { PlaygroundContext } from '@/core/context';
import { compile } from './compiler';

export default function RootPreview() {
  const { files = {} } = useContext(PlaygroundContext);
  const [compiledCode, setCompiledCode] = useState('');

  useEffect(() => {
    const res = compile(files);
    setCompiledCode(res);
  }, [files]);

  return <div className="h-full overflow-auto whitespace-pre-line break-all">{compiledCode}</div>;
}
