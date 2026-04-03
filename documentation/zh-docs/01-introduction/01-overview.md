---
title: 概述
---

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
