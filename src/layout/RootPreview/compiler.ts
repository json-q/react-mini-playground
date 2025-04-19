import { transform } from '@babel/standalone';
import type { MultipleFiles } from '@/core/context';
import { ENTRY_FILE_NAME } from '@/core/files';

export const babelTransform = (filename: string, code: string, files: MultipleFiles) => {
  let result = '';
  try {
    result = transform(code, {
      presets: ['react', 'typescript'],
      filename,
      plugins: [],
      retainLines: true,
    }).code!;
  } catch (e) {
    console.error('compiler Error', e);
  }
  return result;
};

// 编译 main.tsx 的内容
export const compile = (files: MultipleFiles) => {
  const main = files[ENTRY_FILE_NAME];
  return babelTransform(ENTRY_FILE_NAME, main.value, files);
};
