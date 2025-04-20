import { transform } from '@babel/standalone';
import type { MultipleFiles } from '@/core/context';
import { ENTRY_FILE_NAME } from '@/core/files';
import type { CodeContainerFileInfo } from '@/components/CodeContainer';

type TransformOptions = Parameters<typeof transform>['1'];
type PluginItem = TransformOptions['plugins'];
type PluginObj = NonNullable<PluginItem>[number];

// 编译 main.tsx 的内容
export const compile = (files: MultipleFiles) => {
  const main = files[ENTRY_FILE_NAME];
  return babelTransform(ENTRY_FILE_NAME, main.value, files);
};

export const babelTransform = (filename: string, code: string, files: MultipleFiles) => {
  let result = '';
  try {
    result = transform(code, {
      presets: ['react', 'typescript'],
      filename,
      plugins: [customResolver(files)],
      retainLines: true,
    }).code!;
  } catch (e) {
    console.error('compiler Error', e);
  }
  return result;
};

function customResolver(files: MultipleFiles): PluginObj {
  return {
    visitor: {
      ImportDeclaration(path) {
        // import 的路径 例如原本的 import React from 'react' 变成 import React from '23333'
        // 这里可以使用 import map 的方式替换引入路径进行编译
        // 类似于 path.node.source.value = '23333'; 而 value 就可以在引用本地路径时, 就可以替换成 blob 链接
        // see: https://astexplorer.net
        const modulePath = path.node.source.value;
        if (modulePath.startsWith('.')) {
          // 处理相对路径
          const file = getModuleFile(files, modulePath);
          if (!file) return;

          if (file.name.endsWith('.css')) {
            path.node.source.value = css2Js(file);
          } else if (file.name.endsWith('.json')) {
            path.node.source.value = json2Js(file);
          } else {
            // jsx/tsx 代码是 react+ts,需要经 babel 编译才能展示
            path.node.source.value = URL.createObjectURL(
              new Blob([babelTransform(file.name, file.value, files)], { type: 'text/javascript' }),
            );
          }
        }
      },
    },
  };
}

function getModuleFile(files: MultipleFiles, modulePath: string) {
  let mouduleName = modulePath.split('./').pop() || '';
  // 是相对路径: 导入的模块名称 eg: ./App.tsx --> App.tsx
  if (modulePath.includes('.')) {
    // 只识别以下几种文件类型: ts tsx js jsx
    // 拿到不带后缀的文件名称 App
    const realModuleName = Object.keys(files)
      .filter((key) => {
        return (
          key.endsWith('.ts') || key.endsWith('.tsx') || key.endsWith('.js') || key.endsWith('.jsx')
        );
      })
      .find((key) => {
        return key.split('.').includes(mouduleName);
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

  return URL.createObjectURL(new Blob([js], { type: 'text/javascript' }));
}

function json2Js(file: CodeContainerFileInfo) {
  const js = `export default ${file.value}`;
  return URL.createObjectURL(new Blob([js], { type: 'text/javascript' }));
}
