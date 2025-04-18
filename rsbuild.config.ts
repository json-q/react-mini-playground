import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';

const isProd = process.env.NODE_ENV === 'production';

export default defineConfig({
  plugins: [pluginReact()],
  tools: {
    rspack: {
      module: {
        parser: {
          javascript: {
            exprContextCritical: false,
          },
        },
      },
    },
  },
  output: {
    filename: {
      // css: (p, a) => {
      //   if (p.chunk?.name === "index") {
      //     return "[name].css";
      //   }
      //   return "[name].[contenthash:8].css";
      // },
      js: (p, a) => {
        console.log(p, a);

        // if (p.chunk?.name === "index") {
        //   return "[name].js";
        // }
        return '[name].[contenthash:8].js';
      },
    },
  },
});
