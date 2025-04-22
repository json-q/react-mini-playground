import { lazy, Suspense, useContext } from "react";
import FileNameList from "@/components/filename-list";
import { PlaygroundContext } from "@/core/context";
import { debounce } from "lodash-es";
import LazyLoading from "@/components/LazyLoading";

const CodeContainer = lazy(() => import("@/components/code-container"));

export default function RootEditor() {
  const { files = {}, setFiles, selectedFileName } = useContext(PlaygroundContext);

  const onCodeContainerChange = (value?: string) => {
    const newFiles = { ...files };
    newFiles[selectedFileName].value = value || "";
    setFiles(newFiles);
  };

  return (
    <div className='flex h-full flex-col'>
      <FileNameList />
      <Suspense fallback={<LazyLoading text='CodeContainer Loading...' />}>
        <CodeContainer
          file={files[selectedFileName]}
          onChange={debounce(onCodeContainerChange, 500)}
        />
      </Suspense>
    </div>
  );
}
