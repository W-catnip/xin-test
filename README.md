# vite-xin-test

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur) + [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin).

## Customize configuration

See [Vite Configuration Reference](https://vitejs.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```

***


## 笔记

### svg的批量使用

1.安装vite-svg-loader，该插件可以将svg转成vue组件，导入后便可直接以组件形式使用。

2.将所有svg文件放入一个目录中，使用vite的import.meta.glob()方法可以批量导入文件。
>在webpack中，使用require.context完成批量引入:
>```
>query.context(directory,useSubdirectories,regExp,mode = 'sync')
>```
>directory:表示检索的目录 \
useSubdirectories：表示是否检索子文件夹 \
regExp:匹配文件的正则表达式,一般是文件名\
mode:加载模式，同步/异步


3.使用String的endswith方法找到与props的name一致的svg，利用computed赋值给currentComponent。

4.使用动态组件，渲染相应的svg。

### 可无缝滑动的答题组件
1.
