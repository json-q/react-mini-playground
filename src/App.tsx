import { transform } from '@babel/standalone';
import type { PluginObj } from '@babel/core';
import Preview from './components/Preview';

function App() {
  const code1 = `
    function add(a, b) {
        return a + b;
    }
    export { add };
    `;

  const url = URL.createObjectURL(new Blob([code1], { type: 'application/javascript' }));

  const transformImportSourcePlugin: PluginObj = {
    visitor: {
      // 根据 test.html 结合 https://astexplorer.net 可知 AST 结构
      // 将 transforme 的 ImportDeclaration 阶段的 AST 做处理，source 引用改为 url
      ImportDeclaration(path) {
        path.node.source.value = url;
      },
    },
  };

  const code = `import { add } from './add.ts'; console.log(add(2, 3));`;

  function onClick() {
    const res = transform(code, {
      presets: ['react', 'typescript'],
      filename: 'hello.ts',
      plugins: [transformImportSourcePlugin],
    });
    console.log(res.code);
  }

  const editorCode = `import { useEffect, useState } from "react";

  function App() {
      const [num, setNum] = useState(() => {
          const num1 = 1 + 2;
          const num2 = 2 + 3;
          return num1 + num2
      });

      return (
          <div onClick={() => setNum((prevNum) => prevNum + 1)}>{num}</div>
      );
  }

  export default App;
  `;

  return (
    <div>
      <Preview />
      {/* <Editor height="400px" defaultLanguage="javascript" defaultValue={editorCode} />
      <button type="button" onClick={onClick}>
        编译
      </button> */}
    </div>
  );
}

export default App;
