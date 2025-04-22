import { setupTypeAcquisition } from "@typescript/ata";
import ts from "typescript";

export function createATA(onDownloadFile: (code: string, path: string) => void) {
  const ata = setupTypeAcquisition({
    projectName: "react-playground",
    typescript: ts,
    logger: console,
    fetcher(input, init) {
      const fetchUrl = new URL(input as string);
      // use cdn mirror, same split `cdn` to `fastly`
      fetchUrl.hostname = fetchUrl.hostname.replace(/^cdn\./, "fastly.");
      console.log("fetching....", fetchUrl.href, init);
      return fetch(fetchUrl.href, init);
    },
    delegate: {
      receivedFile: (code, path) => {
        onDownloadFile(code, path);
      },
    },
  });

  return ata;
}
