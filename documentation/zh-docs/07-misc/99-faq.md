---
title: 常见问题
---

## 我是 Svelte 新手。我应该从哪里开始？

我们认为最好的入门方式是通过交互式[教程](/tutorial)。那里的每一步主要关注一个特定方面，易于跟随。你将在浏览器中直接编辑和运行真实的 Svelte 组件。

五到十分钟应该足以让你上手。一个半小时应该能让你完成整个教程。

## 我在哪里可以获得支持？

如果你的问题是关于某种语法，[参考文档](/docs/svelte)是一个很好的起点。

Stack Overflow 是一个流行的论坛，可以提出代码级问题或者当你遇到特定错误时。浏览标记为 [Svelte](https://stackoverflow.com/questions/tagged/svelte+or+svelte-3) 的现有问题或[提出你自己的问题](https://stackoverflow.com/questions/ask?tags=svelte)！

有在线论坛和聊天室，是讨论最佳实践、应用程序架构或只是结识其他 Svelte 用户的好地方。[我们的 Discord](/chat) 或 [Reddit 频道](https://www.reddit.com/r/sveltejs/)就是例子。如果你有一个可回答的代码级问题，Stack Overflow 通常更合适。

## 有第三方资源吗？

Svelte Society 维护了一个[书籍和视频列表](https://sveltesociety.dev/collection/a-list-of-books-and-courses-ac01dd10363184fa)。

## 如何让 VS Code 对我的 .svelte 文件进行语法高亮？

有一个[官方的 VS Code Svelte 扩展](https://marketplace.visualstudio.com/items?itemName=svelte.svelte-vscode)。

## 有自动格式化我的 .svelte 文件的工具吗？

你可以使用 prettier 和 [prettier-plugin-svelte](https://www.npmjs.com/package/prettier-plugin-svelte) 插件。

## 如何记录我的组件？

在使用 Svelte Language Server 的编辑器中，你可以使用特殊格式的注释来记录组件、函数和导出。

````svelte
<script>
	/** 我们应该如何称呼用户？ */
	export let name = 'world';
</script>

<!--
@component
这是此组件的一些文档。
它将在悬停时显示。

- 你可以在这里使用 markdown。
- 你也可以在这里使用代码块。
- 用法：
  ```svelte
  <main name="Arethra">
  ```
-->
<main>
	<h1>
		你好，{name}
	</h1>
</main>
````

注意：描述组件的 HTML 注释中必须有 `@component`。

## Svelte 可扩展吗？

最终会有一篇关于这个的博客文章，但与此同时，请查看[这个 issue](https://github.com/sveltejs/svelte/issues/2546)。

## 有 UI 组件库吗？

有几个 [UI 组件库](/packages#component-libraries)以及在[包页面](/packages)上列出的独立组件。

## 如何测试 Svelte 应用？

应用程序的结构以及逻辑的定义位置将决定确保其正确测试的最佳方法。重要的是要注意，并非所有逻辑都属于组件内部——这包括数据转换、跨组件状态管理和日志记录等问题。请记住，Svelte 库有自己的测试套件，因此你不需要编写测试来验证 Svelte 提供的实现细节。

Svelte 应用程序通常会有三种不同类型的测试：单元测试、组件测试和端到端（E2E）测试。

**单元测试**：专注于隔离测试业务逻辑。通常这是验证单个函数和边缘情况。通过最小化这些测试的表面积，它们可以保持精简和快速，并且通过从 Svelte 组件中提取尽可能多的逻辑，可以使用它们覆盖更多的应用程序。创建新的 SvelteKit 项目时，系统会询问你是否要设置 [Vitest](https://vitest.dev/) 进行单元测试。还有许多其他测试运行器也可以使用。

**组件测试**：验证 Svelte 组件在其整个生命周期中按预期挂载和交互需要一个提供文档对象模型（DOM）的工具。组件可以被编译（因为 Svelte 是编译器而不是普通库）并挂载，以允许对元素结构、监听器、状态和 Svelte 组件提供的所有其他功能进行断言。组件测试工具范围从像 jsdom 这样的内存实现与像 [Vitest](https://vitest.dev/) 这样的测试运行器配对，到利用实际浏览器提供可视化测试能力的解决方案，如 [Playwright](https://playwright.dev/docs/test-components) 或 [Cypress](https://www.cypress.io/)。

**端到端测试**：为了确保你的用户能够与你的应用程序交互，有必要以尽可能接近生产的方式将其作为一个整体进行测试。这是通过编写端到端（E2E）测试来完成的，这些测试加载并与应用程序的已部署版本交互，以模拟用户将如何与你的应用程序交互。创建新的 SvelteKit 项目时，系统会询问你是否要设置 [Playwright](https://playwright.dev/) 进行端到端测试。还有许多其他 E2E 测试库可供使用。

一些测试入门资源：

- [Svelte 测试文档](/docs/svelte/testing)
- [使用 Svelte CLI 设置 Vitest](/docs/cli/vitest)
- [Svelte Testing Library](https://testing-library.com/docs/svelte-testing-library/example/)
- [Cypress 中的 Svelte 组件测试](https://docs.cypress.io/guides/component-testing/svelte/overview)
- [使用 uvu 测试运行器和 JSDOM 的示例](https://github.com/lukeed/uvu/tree/master/examples/svelte)
- [使用 Vitest 和 Playwright 测试 Svelte 组件](https://davipon.hashnode.dev/test-svelte-component-using-vitest-playwright)
- [使用 WebdriverIO 进行组件测试](https://webdriver.io/docs/component-testing/svelte)

## 有路由器吗？

官方路由库是 [SvelteKit](/docs/kit)。SvelteKit 在一个易于使用的包中提供了文件系统路由器、服务端渲染（SSR）和热模块替换（HMR）。它与 React 的 Next.js 和 Vue 的 Nuxt.js 有相似之处。SvelteKit 还支持基于哈希的客户端应用程序路由。

但是，你可以使用任何路由器库。[包页面](/packages#routing)上突出显示了可用路由器的示例。

## 如何使用 Svelte 编写移动应用？

虽然大多数移动应用是在不使用 JavaScript 的情况下编写的，但如果你想在构建移动应用时利用现有的 Svelte 组件和 Svelte 知识，你可以使用 [Tauri](https://v2.tauri.app/start/frontend/sveltekit/) 或 [Capacitor](https://capacitorjs.com/solution/svelte) 将 [SvelteKit SPA](https://kit.svelte.dev/docs/single-page-apps) 转换为移动应用。相机、地理位置和推送通知等移动功能可通过两个平台的插件获得。

已经完成了一些关于 [Svelte 5 中自定义渲染器支持](https://github.com/sveltejs/svelte/issues/15470)的工作，但此功能尚不可用。自定义渲染 API 将支持其他移动框架，如 Lynx JS 和 Svelte Native。Svelte Native 是 Svelte 4 可用的选项，但 Svelte 5 目前不支持它。Svelte Native 允许你使用包含 [NativeScript UI 组件](https://docs.nativescript.org/ui/)而不是 DOM 元素的 Svelte 组件编写 NativeScript 应用，这对于来自 React Native 的用户可能很熟悉。

## 我可以告诉 Svelte 不要删除我未使用的样式吗？

不可以。Svelte 从组件中删除样式并警告你，以防止可能出现的问题。

Svelte 的组件样式作用域通过生成组件唯一的类，将其添加到 Svelte 控制下的组件中的相关元素，然后将其添加到该组件样式中的每个选择器来工作。当编译器看不到样式选择器应用于哪些元素时，保留它有两个糟糕的选择：

- 如果它保留选择器并向其添加作用域类，选择器可能不会匹配组件中的预期元素，如果它们是由子组件或 `{@html ...}` 创建的，它们肯定不会匹配。
- 如果它保留选择器而不向其添加作用域类，给定的样式将成为全局样式，影响整个页面。

如果你需要为 Svelte 在编译时无法识别的内容设置样式，你需要通过使用 `:global(...)` 明确选择全局样式。但也要记住，你可以只在选择器的一部分周围包装 `:global(...)`。`.foo :global(.bar) { ... }` 将为出现在组件的 `.foo` 元素内的任何 `.bar` 元素设置样式。只要当前组件中有一些父元素可以开始，像这样的部分全局选择器几乎总是能够让你得到你想要的。

## Svelte v2 还可用吗？

没有新功能被添加到它，并且错误可能只会在它们非常严重或存在某种安全漏洞时才会被修复。

文档仍然可以在[这里](https://v2.svelte.dev/guide)找到。

## 如何进行热模块替换？

我们建议使用 [SvelteKit](/docs/kit)，它开箱即用地支持 HMR，并且建立在 [Vite](https://vitejs.dev/) 和 [svelte-hmr](https://github.com/sveltejs/svelte-hmr) 之上。还有用于 [rollup](https://github.com/rixo/rollup-plugin-svelte-hot) 和 [webpack](https://github.com/sveltejs/svelte-loader) 的社区插件。
