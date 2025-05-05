import { transform } from "@babel/standalone";
import type { MultipleFiles } from "@/core/context";
import { ENTRY_FILE_NAME } from "@/core/files";
import type { CodeContainerFileInfo } from "@/components/code-container";

type TransformOptions = Parameters<typeof transform>["1"];
type PluginItem = TransformOptions["plugins"];
type PluginObj = NonNullable<PluginItem>[number];

export interface CompilerMessageEventData {
  type: "CODE_COMPILED" | "CODE_COMPILE_ERROR";
  data: string | Error;
}

// worker compiler
self.addEventListener("message", ({ data }) => {
  try {
    self.postMessage({
      type: "CODE_COMPILED",
      data: compile(data),
    } satisfies CompilerMessageEventData);
  } catch (e) {
    self.postMessage({
      type: "CODE_COMPILE_ERROR",
      data: e as Error,
    } satisfies CompilerMessageEventData);
  }
});

// 编译 main.tsx 的内容
const compile = (files: MultipleFiles) => {
  const main = files[ENTRY_FILE_NAME];
  return babelTransform(ENTRY_FILE_NAME, main.value, files);
};

export const babelTransform = (filename: string, code: string, files: MultipleFiles) => {
  let result = "";
  const _code = beforeBabelTransform(filename, code);
  try {
    result = transform(_code, {
      presets: ["react", "typescript"],
      filename,
      plugins: [customResolver(files)],
      retainLines: true, // 保留行号, 方便调试
    }).code!;
  } catch (e) {
    console.error("compiler Error", e);
  }
  return result;
};

// 兼容 jsx runtime 版本的 react, 自动注入 import React from 'react'
function beforeBabelTransform(filename: string, code: string) {
  let _code = code;
  const regexReact = /import\s+React/;
  if (filename.endsWith(".tsx") || (filename.endsWith(".jsx") && !regexReact.test(code))) {
    _code = `import React from 'react';\n${code}`;
  }
  return _code;
}

function customResolver(files: MultipleFiles): PluginObj {
  return {
    visitor: {
      ImportDeclaration(path) {
        // import 的路径 例如原本的 import React from 'react' 变成 import React from '23333'
        // 这里可以使用 import map 的方式替换引入路径进行编译
        // 类似于 path.node.source.value = '23333'; 而 value 就可以在引用本地路径时, 就可以替换成 blob 链接
        // see: https://astexplorer.net
        const modulePath = path.node.source.value;
        if (modulePath.startsWith(".")) {
          // 处理相对路径
          const file = getModuleFile(files, modulePath);
          if (!file) return;

          if (file.name.endsWith(".css")) {
            path.node.source.value = css2Js(file);
          } else if (file.name.endsWith(".json")) {
            path.node.source.value = json2Js(file);
          } else if (file.name.endsWith(".svg")) {
            path.node.source.value = file.value;
          } else {
            // jsx/tsx 代码是 react+ts,需要经 babel 编译才能展示
            // 再次调用 babelTransform, 进行深度递归
            const blob = new Blob([babelTransform(file.name, file.value, files)], {
              type: "text/javascript",
            });
            path.node.source.value = URL.createObjectURL(blob);
          }
        }
      },
    },
  };
}

function getModuleFile(files: MultipleFiles, modulePath: string) {
  let mouduleName = modulePath.split("./").pop() || "";
  // 是相对路径: 导入的模块名称 eg: ./App.tsx --> App.tsx
  if (modulePath.includes(".")) {
    // 只识别以下几种文件类型: ts tsx js jsx
    // 拿到不带后缀的文件名称 App
    const realModuleName = Object.keys(files)
      .filter((key) => {
        return (
          key.endsWith(".ts") || key.endsWith(".tsx") || key.endsWith(".js") || key.endsWith(".jsx")
        );
      })
      .find((key) => {
        return key.split(".").includes(mouduleName);
      });

    if (realModuleName) {
      mouduleName = realModuleName;
    }
  }
  return files[mouduleName];
}

function css2Js(file: CodeContainerFileInfo) {
  const randomId = new Date().getTime();

  const js = `
    (() => {
      const stylesheet = document.createElement('style');
      stylesheet.setAttribute('id', 'style_${randomId}_${file.name}');
      document.head.appendChild(stylesheet);

      const styles = document.createTextNode(\`${file.value}\`);
      stylesheet.innerHTML = '';
      stylesheet.appendChild(styles);
    })()
  `;

  return URL.createObjectURL(new Blob([js], { type: "text/javascript" }));
}

function json2Js(file: CodeContainerFileInfo) {
  const js = `export default ${file.value}`;
  return URL.createObjectURL(new Blob([js], { type: "text/javascript" }));
}
