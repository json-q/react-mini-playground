# React mini playground

[English](./README-en-US.md)

React 简单实现 [vue playground](https://play.vuejs.org) 的功能。

## 功能

实现 vue playground 的核心功能

- [x] 支持 TypeScript
- [x] 实时预览
- [x] 多文件的增删改
- [x] 预览的错误捕获
- [x] 链接分享
- [x] 文件下载
- [x] babel 编译时的长任务 worker 优化

> 使用 `vite` 可以带来更好的开发体验。`rspack` 和 `rsbuild` 虽然已支持 `?raw` 资源，但是在开发模式下仍有瑕疵（非构建工具问题，是两种不同的开发模式导致的），且 `rsbuild` 在引用 `?raw` 资源的行为上和 `rspack`表现不一致（可能是 bug）
