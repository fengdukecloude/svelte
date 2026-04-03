---
title: .svelte 文件
---

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
