# React Mini Playground

[中文](./README.md)

React simply implements features like [vue playground](https://play.vuejs.org)

## Features

Implement the core functionality of Vue Playground.

- [x] Support TypeScript
- [x] Real-time preview
- [x] Add, edit, and delete multiple files
- [x] Error handling for preview
- [x] Share link
- [x] File download
- [x] Long task Worker optimization for Babel compilation

> Using `vite` can provide a better development experience. Although both `rspack` and `rsbuild` support `?raw` resources, they still have some issues in dev mode (not due to the build tools themselves, but rather differences in the underlying development modes). Moreover, `rsbuild` behaves differently when referencing `?raw` resources compared to `rspack` (may be a bug)
