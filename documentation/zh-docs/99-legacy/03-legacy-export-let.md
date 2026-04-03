---
title: export let
---

在 runes 模式下，[组件 props](basic-markup#Component-props) 使用 [`$props`]($props) rune 声明，允许父组件传入数据。

在遗留模式下，props 使用 `export` 关键字标记，并且可以有默认值：

```svelte
<script>
	export let foo;
	export let bar = 'default value';

	// Values that are passed in as props
	// are immediately available
	console.log({ foo });
</script>
```

默认值在组件创建时如果值为 `undefined` 时使用。

> [!NOTE] 与 runes 模式不同，如果父组件将 prop 从已定义的值更改为 `undefined`，它不会恢复为初始值。

没有默认值的 props 被视为 _必需的_，如果没有提供值，Svelte 会在开发期间打印警告，你可以通过将 `undefined` 指定为默认值来消除警告：

```js
export let foo +++= undefined;+++
```

## 组件导出

导出的 `const`、`class` 或 `function` 声明 _不_ 被视为 prop——相反，它成为组件 API 的一部分：

```svelte
<!--- file: Greeter.svelte--->
<script>
	export function greet(name) {
		alert(`hello ${name}!`);
	}
</script>
```

```svelte
<!--- file: App.svelte --->
<script>
	import Greeter from './Greeter.svelte';

	let greeter;
</script>

<Greeter bind:this={greeter} />

<button on:click={() => greeter.greet('world')}>
	greet
</button>
```

## 重命名 props

`export` 关键字可以与声明分开出现。这对于重命名 props 很有用，例如在保留字的情况下：

```svelte
<!--- file: App.svelte --->
<script>
	/** @type {string} */
	let className;

	// creates a `class` property, even
	// though it is a reserved word
	export { className as class };
</script>
```
