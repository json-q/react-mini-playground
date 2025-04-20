import { useContext, useEffect, useState } from 'react';
import { PlaygroundContext } from '@/core/context';
import { compile } from './compiler';
import iframeSource from './iframe.html?raw';
import { IMPORT_MAP_FILE_NAME } from '@/core/files';

function genIframeUrl(importMap: string, compilerCode: string) {
  const htmlStr = iframeSource
    .replace(
      `<script type="importmap"></script>`,
      `<script type="importmap">
      ${importMap}
     </script>`,
    )
    .replace(
      `<script type="module" id="appSrc"></script>`,
      `<script type="module" id="appSrc">${compilerCode}</script>`,
    );

  return URL.createObjectURL(
    new Blob([htmlStr], {
      type: 'text/html',
    }),
  );
}

export default function RootPreview() {
  const { files = {} } = useContext(PlaygroundContext);
  const importMapContent = files[IMPORT_MAP_FILE_NAME].value;

  const [compiledCode, setCompiledCode] = useState('');
  const [iframeUrl, setIframeUrl] = useState(() => genIframeUrl(importMapContent, compiledCode));

  useEffect(() => {
    const res = compile(files);
    setCompiledCode(res);
  }, [files]);

  useEffect(() => {
    const newFrameUrl = genIframeUrl(importMapContent, compiledCode);
    setIframeUrl(newFrameUrl);
  }, [importMapContent, compiledCode]);

  console.log(iframeUrl);

  return (
    <div className="h-full">
      <iframe title="preview" src={iframeUrl} className="m-0 h-full w-full border-none p-0" />
    </div>
  );
}
