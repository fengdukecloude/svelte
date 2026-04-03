---
title: 快速开始
---

我们推荐使用 [SvelteKit](../kit)，它可以让你[构建几乎任何东西](../kit/project-types)。它是 Svelte 团队的官方应用框架，由 [Vite](https://vite.dev/) 提供支持。创建一个新项目：

```sh
npx sv create myapp
cd myapp
npm install
npm run dev
```

如果你还不了解 Svelte，不用担心！你可以暂时忽略 SvelteKit 带来的所有优秀特性，稍后再深入了解。

## SvelteKit 的替代方案

你也可以通过 [vite-plugin-svelte](https://github.com/sveltejs/vite-plugin-svelte) 直接在 Vite 中使用 Svelte，运行 `npm create vite@latest` 并选择 `svelte` 选项（或者，如果是在现有项目中工作，将插件添加到你的 `vite.config.js` 文件中）。这样，`npm run build` 将在 `dist` 目录中生成 HTML、JS 和 CSS 文件。在大多数情况下，你可能还需要[选择一个路由库](/packages#routing)。

>[!NOTE] Vite 通常以独立模式用于构建[单页应用（SPA）](../kit/glossary#SPA)，你也可以[使用 SvelteKit 构建](../kit/single-page-apps)。

还有[其他打包工具的插件](/packages#bundler-plugins)，但我们推荐使用 Vite。

## 编辑器工具

Svelte 团队维护了一个 [VS Code 扩展](https://marketplace.visualstudio.com/items?itemName=svelte.svelte-vscode)，还有与各种其他[编辑器](https://sveltesociety.dev/collection/editor-support-c85c080efc292a34)和工具的集成。

你也可以使用 [`npx sv check`](https://svelte.dev/docs/cli/sv-check) 从命令行检查你的代码。


## 获取帮助

不要羞于在 [Discord 聊天室](/chat)寻求帮助！你也可以在 [Stack Overflow](https://stackoverflow.com/questions/tagged/svelte) 上找到答案。
