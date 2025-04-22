import { useContext, useEffect, useState } from "react";
import { PlaygroundContext } from "@/core/context";
import { compile } from "./compiler";
import iframeSource from "./iframe.html?raw";
import { IMPORT_MAP_FILE_NAME } from "@/core/files";
import ErrorAlert from "@/components/error-alert";
import { cn } from "@/lib/utils";

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
      type: "text/html",
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
  const [compiledCode, setCompiledCode] = useState("");
  useEffect(() => {
    const res = compile(files);
    setCompiledCode(res);
  }, [files]);

  // ============== Iframe Url ==============
  const [iframeUrl, setIframeUrl] = useState(() => genIframeUrl(importMapContent, compiledCode));

  useEffect(() => {
    const newFrameUrl = genIframeUrl(importMapContent, compiledCode);
    setIframeUrl(newFrameUrl);
  }, [importMapContent, compiledCode]);

  // ============== Error Handler ==============
  const [errMsg, setErrMsg] = useState<string>();

  const handleMessage = (event: MessageEvent<MessageData>) => {
    console.log(event);

    if (event.data.type === "ERROR") {
      setErrMsg(event.data.message);
    }
  };

  useEffect(() => {
    window.addEventListener("message", handleMessage);
    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  console.log("iframe render-----", iframeUrl);

  return (
    <div className='box-border h-full w-full overflow-auto'>
      <iframe
        title='preview'
        src={iframeUrl}
        className={cn("m-0 h-full w-full border-none p-0", {
          hidden: !!errMsg,
        })}
      />

      <ErrorAlert className='mx-12 mt-12' errMsg={errMsg} />
    </div>
  );
}
