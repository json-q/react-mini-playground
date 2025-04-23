import { strFromU8, strToU8, unzlibSync, zlibSync } from "fflate";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import type { MultipleFiles } from "@/core/context";

export function fileName2Language(name: string) {
  const suffix = name.split(".").pop() || "";
  if (["js", "jsx"].includes(suffix)) return "javascript";
  if (["ts", "tsx"].includes(suffix)) return "typescript";
  if (["json", "jsonc"].includes(suffix)) return "json";
  if (["css"].includes(suffix)) return "css";
  return "javascript";
}

export function compress(data: string) {
  const buffer = strToU8(data);
  const zipped = zlibSync(buffer, { level: 9 });
  const str = strFromU8(zipped, true);
  return btoa(str);
}

export function decodeCompress(base64: string) {
  const binary = atob(base64);

  const buffer = strToU8(binary, true);
  const unzipped = unzlibSync(buffer);
  return strFromU8(unzipped);
}

export async function downloadFiles(files: MultipleFiles) {
  const zip = new JSZip();
  console.log(files);

  Object.keys(files).forEach((name) => {
    zip.file(name, files[name].value);
  });

  const blob = await zip.generateAsync({ type: "blob" });
  saveAs(blob, `playground-code.zip`);
}
