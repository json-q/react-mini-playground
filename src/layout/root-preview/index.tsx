import { useContext, useEffect, useState } from 'react';
import ErrorAlert from '@/components/error-alert';
import { PlaygroundContext } from '@/core/context';
import { IMPORT_MAP_FILE_NAME } from '@/core/files';
import { cn } from '@/lib/utils';
import type { CompilerMessageEventData } from './compiler.worker';
import iframeSource from './iframe.html?raw';

const compilerWorker = new Worker(new URL('./compiler.worker.ts', import.meta.url), {
  type: 'module',
});

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

interface MessageData {
  type: string;
  message: string;
}
export default function RootPreview() {
  const { files = {} } = useContext(PlaygroundContext);
  const importMapContent = files[IMPORT_MAP_FILE_NAME].value;

  // ============== Compiler ==============
  const [compiledCode, setCompiledCode] = useState('');

  useEffect(() => {
    compilerWorker.postMessage(files);
  }, [files]);

  useEffect(() => {
    compilerWorker.addEventListener('message', (ev: MessageEvent<CompilerMessageEventData>) => {
      if (ev.data.type === 'CODE_COMPILED') {
        setCompiledCode(ev.data.data as string);
      } else if (ev.data.type === 'CODE_COMPILE_ERROR') {
        console.error(ev.data.data);
      }
    });
  }, []);

  // ============== Iframe Url ==============
  const [iframeUrl, setIframeUrl] = useState(() => genIframeUrl(importMapContent, compiledCode));

  useEffect(() => {
    const newFrameUrl = genIframeUrl(importMapContent, compiledCode);
    setIframeUrl(newFrameUrl);
  }, [importMapContent, compiledCode]);

  // ============== Error Handler ==============
  const [errMsg, setErrMsg] = useState<string>();

  const handleMessage = (ev: MessageEvent<MessageData>) => {
    if (ev.data.type === 'ERROR') {
      setErrMsg(ev.data.message);
    }
  };

  useEffect(() => {
    window.addEventListener('message', handleMessage);
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  useEffect(() => {
    console.log('iframe render-----', iframeUrl);
    /**
      执行顺序如下：
      生成 iframeUrl, 重置错误信息
      iframe 侧渲染
      渲染出错，触发 messageEvent, 重新渲染 ErrorAlert
     */
    setErrMsg(undefined);
  }, [iframeUrl]);

  return (
    <div className="box-border h-full w-full overflow-auto">
      <iframe
        title="preview"
        src={iframeUrl}
        className={cn('m-0 h-full w-full border-none p-0', {
          hidden: !!errMsg,
        })}
      />

      {errMsg && <ErrorAlert className="mx-12 mt-12" errMsg={errMsg} />}
    </div>
  );
}
