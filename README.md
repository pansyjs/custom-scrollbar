<h1 align="center">
  @pansy/custom-scrollbar-react
</h1>

<div align="center">
  自定义您的滚动条样式。
</div>

<br />
<p align="center">
  <a href="https://github.com/pansyjs/custom-scrollbar/network">
    <img src="https://img.shields.io/github/forks/pansyjs/custom-scrollbar.svg" alt="Forks">
  </a>
  <a href="https://github.com/pansyjs/custom-scrollbar/stargazers">
    <img src="https://img.shields.io/github/stars/pansyjs/custom-scrollbar.svg" alt="Stars">
  </a>
  <a href="https://www.npmjs.com/package/@pansy/custom-scrollbar-react">
    <img src="https://img.shields.io/npm/v/@pansy/custom-scrollbar-react.svg" alt="npm version">
  </a>
  <a href="https://github.com/umijs/father">
    <img src="https://img.shields.io/badge/build%20with-father-028fe4.svg" alt="Build With father">
  </a>
  <a href="https://d.umijs.org/">
    <img src="https://img.shields.io/badge/docs%20by-dumi-blue" alt="docs by dumi">
  </a>
</p>

## 🏗 安装

```sh
# npm install
$ npm install @pansy/custom-scrollbar-react --save

# yarn install
$ yarn add @pansy/custom-scrollbar-react

# pnpm install
$ pnpm i @pansy/custom-scrollbar-react
```

## 🔨 使用

```tsx
import CustomScrollbar from '@pansy/custom-scrollbar-react';
import '@pansy/custom-scrollbar-react/scrollbar.less';

export default () => {
  return (
    <CustomScrollbar
      style={{
        maxHeight: 300,
      }}
    >
      <p>123</p>
      <p>124</p>
      <p>123</p>
      <p>124</p>
      <p>123</p>
      <p>124</p>
      <p>123</p>
      <p>124</p>
      <p>123</p>
      <p>124</p>
      <p>123</p>
      <p>124</p>
      <p>123</p>
      <p>124</p>
    </CustomScrollbar>
  )
}
```
