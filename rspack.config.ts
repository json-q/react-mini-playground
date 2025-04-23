import { defineConfig } from "@rspack/cli";
import { rspack } from "@rspack/core";
import * as RefreshPlugin from "@rspack/plugin-react-refresh";
import * as path from "node:path";
import * as CompressionPlugin from "compression-webpack-plugin";

const isDev = process.env.NODE_ENV === "development";

// Target browsers, see: https://github.com/browserslist/browserslist
const targets = ["chrome >= 87", "edge >= 88", "firefox >= 78", "safari >= 14"];

const splitChunkGroupConfig = {
  filename: "js/[name].js",
  priority: 100,
  enforce: true,
};

const jsxBabelLoaderOptions = {
  sourceMap: true,
  jsc: {
    parser: {
      syntax: "typescript",
      tsx: true,
    },
    externalHelpers: true,
    transform: {
      react: {
        runtime: "automatic",
      },
    },
  },
  env: { targets },
};

export default defineConfig({
  context: __dirname,
  entry: {
    main: "./src/main.tsx",
  },
  devtool: isDev ? "source-map" : false,
  output: {
    clean: true,
    filename: "js/[name].[contenthash:8].js",
    cssFilename: "css/[name].[contenthash:8].css",
    assetModuleFilename: "assets/[hash][ext][query]",
  },
  resolve: {
    extensions: ["...", ".ts", ".tsx", ".jsx"],
    alias: {
      "@": path.resolve(__dirname, "./src"),
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
        type: "asset",
      },
      {
        test: /\.css$/,
        use: ["postcss-loader"],
        type: "css",
      },
      // support raw resource: https://rspack.dev/zh/guide/features/asset-module
      {
        resourceQuery: /raw/,
        type: "asset/source",
      },
      {
        test: /\.(jsx?|tsx?)$/,
        // 携带 ?raw 后缀的 js/ts 文件不走 swc-loader 编译
        // react-refresh 在开发环境下会注入热更函数, 导致 ?raw 引入的源文件也会存在, 生产环境没有, 该问题可忽略
        resourceQuery: { not: /raw/ },
        use: [
          {
            loader: "builtin:swc-loader",
            options: {
              ...jsxBabelLoaderOptions,
              transform: {
                react: {
                  runtime: "automatic",
                  development: isDev,
                  refresh: isDev,
                },
              },
            },
          },
        ],
      },
      {
        test: /\.(jsx|tsx)$/,
        resourceQuery: { not: /raw/ },
        use: [
          {
            loader: "builtin:swc-loader",
            options: {
              ...jsxBabelLoaderOptions,
            },
          },
          {
            loader: "babel-loader",
          },
        ],
      },
    ],
  },
  plugins: [
    new rspack.HtmlRspackPlugin({
      template: "./index.html",
    }),
    new rspack.CopyRspackPlugin({
      patterns: [{ from: "./public", to: "." }],
    }),
    isDev
      ? null
      : new CompressionPlugin({
          test: /\.(js|css)(\?.*)?$/i,
          threshold: 10240,
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
    splitChunks: {
      chunks: "all",
      cacheGroups: {
        react: {
          test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
          name: "lib-react",
          ...splitChunkGroupConfig,
        },
        babelStandalone: {
          test: /[\\/]node_modules[\\/]@babel[\\/]standalone[\\/]/,
          name: "lib-babel",
          ...splitChunkGroupConfig,
        },
        typescript: {
          test: /[\\/]node_modules[\\/]typescript[\\/]/,
          name: "lib-ts",
          ...splitChunkGroupConfig,
        },
      },
    },
  },
  experiments: {
    css: true,
  },
});
