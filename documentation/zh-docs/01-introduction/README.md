---
title: 介绍（完整版）
---

本文件整合了 01-introduction 文件夹中的所有内容，方便完整阅读。

---

# 概述

Svelte 是一个用于在 Web 上构建用户界面的框架。它使用编译器将用 HTML、CSS 和 JavaScript 编写的声明式组件……

```svelte
<!--- file: App.svelte --->
<script>
	function greet() {
		alert('欢迎使用 Svelte！');
	}
</script>

<button onclick={greet}>点击我</button>

<style>
	button {
		font-size: 2em;
	}
</style>
```

……转换为精简、高度优化的 JavaScript。

你可以使用它在 Web 上构建任何东西，从独立组件到雄心勃勃的全栈应用（使用 Svelte 的配套应用框架 [SvelteKit](../kit)）以及介于两者之间的一切。

这些页面作为参考文档。如果你是 Svelte 新手，我们建议从[交互式教程](/tutorial)开始，在有疑问时再回到这里。

你也可以在[演练场](/playground)在线试用 Svelte，或者如果你需要一个功能更全面的环境，可以在 [StackBlitz](https://sveltekit.new) 上试用。

---

# 快速开始

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

---

# .svelte 文件

组件（Components）是 Svelte 应用的构建块。它们被写入 `.svelte` 文件中，使用 HTML 的超集。

所有三个部分——script、styles 和 markup——都是可选的。

<!-- prettier-ignore -->
```svelte
/// file: MyComponent.svelte
<script module>
	// 模块级逻辑放在这里
	// （你很少会用到这个）
</script>

<script>
	// 实例级逻辑放在这里
</script>

<!-- 标记（零个或多个项目）放在这里 -->

<style>
	/* 样式放在这里 */
</style>
```

## `<script>`

`<script>` 块包含在创建组件实例时运行的 JavaScript（或 TypeScript，添加 `lang="ts"` 属性时）。在顶层声明（或导入）的变量可以在组件的标记中引用。

除了普通的 JavaScript，你还可以使用**符文（runes）**来声明[组件属性]($props)并为组件添加响应式。符文将在下一节介绍。

<!-- TODO describe behaviour of `export` -->

## `<script module>`

带有 `module` 属性的 `<script>` 标签在模块首次评估时运行一次，而不是为每个组件实例运行。在此块中声明的变量可以在组件的其他地方引用，但反之则不行。

```svelte
<script module>
	let total = 0;
</script>

<script>
	total += 1;
	console.log(`实例化了 ${total} 次`);
</script>
```

你可以从此块中 `export` 绑定，它们将成为编译后模块的导出。你不能 `export default`，因为默认导出是组件本身。

> [!NOTE] 如果你使用 TypeScript 并将这些从 `module` 块导出的内容导入到 `.ts` 文件中，请确保设置好你的编辑器，以便 TypeScript 能够识别它们。我们的 VS Code 扩展和 IntelliJ 插件已经支持这一点，但在其他情况下，你可能需要设置我们的 [TypeScript 编辑器插件](https://www.npmjs.com/package/typescript-svelte-plugin)。

> [!LEGACY]
> 在 Svelte 4 中，这个 script 标签使用 `<script context="module">` 创建

## `<style>`

`<style>` 块内的 CSS 将作用域限定在该组件内。

```svelte
<style>
	p {
		/* 这只会影响此组件中的 <p> 元素 */
		color: burlywood;
	}
</style>
```

有关更多信息，请前往[样式](scoped-styles)部分。

---

# .svelte.js 和 .svelte.ts 文件

除了 `.svelte` 文件，Svelte 还可以处理 `.svelte.js` 和 `.svelte.ts` 文件。

这些文件的行为与任何其他 `.js` 或 `.ts` 模块一样，只是你可以使用符文（runes）。这对于创建可重用的响应式逻辑或在应用中共享响应式状态非常有用（但请注意，你[不能导出重新赋值的状态]($state#Passing-state-across-modules)）。

> [!LEGACY]
> 这是 Svelte 5 之前不存在的概念
