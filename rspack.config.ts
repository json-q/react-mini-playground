import { defineConfig } from '@rspack/cli';
import { rspack } from '@rspack/core';
import * as RefreshPlugin from '@rspack/plugin-react-refresh';
import * as path from 'node:path';

const isDev = process.env.NODE_ENV === 'development';

// Target browsers, see: https://github.com/browserslist/browserslist
const targets = ['chrome >= 87', 'edge >= 88', 'firefox >= 78', 'safari >= 14'];

export default defineConfig({
  context: __dirname,
  entry: {
    main: './src/main.tsx',
  },
  devtool: isDev ? 'source-map' : false,
  output: {
    clean: true,
  },
  resolve: {
    extensions: ['...', '.ts', '.tsx', '.jsx'],
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  module: {
    parser: {
      javascript: {
        exprContextCritical: false,
      },
    },
    rules: [
      {
        test: /\.svg$/,
        type: 'asset',
      },
      {
        test: /\.css$/,
        use: ['postcss-loader'],
        type: 'css',
      },
      // support raw resource: https://rspack.dev/zh/guide/features/asset-module
      {
        resourceQuery: /raw/,
        type: 'asset/source',
      },
      {
        test: /\.(jsx?|tsx?)$/,
        // 携带 ?raw 后缀的 js/ts 文件不走 swc-loader 编译
        // react-refresh 在开发环境下会注入热更函数, 导致 ?raw 引入的源文件也会存在, 生产环境没有, 该问题可忽略
        resourceQuery: { not: /raw/ },
        use: [
          {
            loader: 'builtin:swc-loader',
            options: {
              jsc: {
                parser: {
                  syntax: 'typescript',
                  tsx: true,
                },
                transform: {
                  react: {
                    runtime: 'automatic',
                    development: isDev,
                    refresh: isDev,
                  },
                },
              },
              env: { targets },
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new rspack.HtmlRspackPlugin({
      template: './index.html',
    }),
    new rspack.CopyRspackPlugin({
      patterns: [{ from: './public', to: '.' }],
    }),
    isDev ? new RefreshPlugin() : null,
  ].filter(Boolean),
  optimization: {
    minimizer: [
      new rspack.SwcJsMinimizerRspackPlugin(),
      new rspack.LightningCssMinimizerRspackPlugin({
        minimizerOptions: { targets },
      }),
    ],
  },
  // use cdn
  externals: {
    typescript: 'ts',
  },
  experiments: {
    css: true,
  },
});
