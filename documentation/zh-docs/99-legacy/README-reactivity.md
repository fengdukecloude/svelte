---
title: 遗留 API - 响应式和状态管理（完整版）
---

本文件整合了 99-legacy 文件夹中关于响应式和状态管理的内容，方便完整阅读。

---

# 概述

Svelte 5 引入了对 Svelte API 的一些重大更改，包括 [runes](what-are-runes)、[snippets](snippet) 和事件属性。因此，一些 Svelte 3/4 功能已被弃用（尽管目前仍受支持，除非另有说明），并最终将被移除。我们建议你逐步[迁移现有代码](v5-migration-guide)。

以下页面记录了这些功能，适用于：

- 仍在使用 Svelte 3/4 的人
- 使用 Svelte 5，但组件尚未迁移的人

由于 Svelte 3/4 语法在 Svelte 5 中仍然有效，我们将区分 _遗留模式_ 和 _runes 模式_。一旦组件处于 runes 模式（你可以通过使用 runes 或显式设置 `runes: true` 编译器选项来选择加入），遗留模式功能将不再可用。

如果你只对 Svelte 3/4 语法感兴趣，可以在 [v4.svelte.dev](https://v4.svelte.dev) 浏览其文档。

---

# 响应式 let/var 声明

在 runes 模式下，响应式状态使用 [`$state` rune]($state) 显式声明。

在遗留模式下，在组件顶层声明的变量会自动被视为 _响应式_。重新赋值或修改这些变量（`count += 1` 或 `object.x = y`）将导致 UI 更新。

```svelte
<script>
	let count = 0;
</script>

<button on:click={() => count += 1}>
	clicks: {count}
</button>
```

由于 Svelte 的遗留模式响应性基于 _赋值_，使用数组方法如 `.push()` 和 `.splice()` 不会自动触发更新。需要后续赋值来"告诉"编译器更新 UI：

```svelte
<script>
	let numbers = [1, 2, 3, 4];

	function addNumber() {
		// this method call does not trigger an update
		numbers.push(numbers.length + 1);

		// this assignment will update anything
		// that depends on `numbers`
		numbers = numbers;
	}
</script>
```

---

# 响应式 $: 语句

在 runes 模式下，对状态更新的反应使用 [`$derived`]($derived) 和 [`$effect`]($effect) runes 处理。

在遗留模式下，任何顶层语句（即不在块或函数内部）都可以通过在其前面加上 `$:` [标签](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/label)来变为响应式。这些语句在 `<script>` 中的其他代码之后、组件标记渲染之前运行，然后在它们依赖的值发生变化时运行。

```svelte
<script>
	let a = 1;
	let b = 2;

	// this is a 'reactive statement', and it will re-run
	// when `a`, `b` or `sum` change
	$: console.log(`${a} + ${b} = ${sum}`);

	// this is a 'reactive assignment' — `sum` will be
	// recalculated when `a` or `b` change. It is
	// not necessary to declare `sum` separately
	$: sum = a + b;
</script>
```

语句按其依赖关系和赋值进行 _拓扑_ 排序：由于 `console.log` 语句依赖于 `sum`，即使它在源代码中出现得更晚，`sum` 也会先被计算。

可以通过将多个语句放在一个块中来组合它们：

```js
// @noErrors
$: {
	// recalculate `total` when `items` changes
	total = 0;

	for (const item of items) {
		total += item.value;
	}
}
```

响应式赋值的左侧可以是标识符，也可以是解构赋值：

```js
// @noErrors
$: ({ larry, moe, curly } = stooges);
```

## 理解依赖关系

`$:` 语句的依赖关系在编译时确定——它们是语句内部引用（但未赋值）的任何变量。

换句话说，像这样的语句在 `count` 变化时 _不会_ 重新运行，因为编译器无法"看到"依赖关系：

```js
// @noErrors
let count = 0;
let double = () => count * 2;

$: doubled = double();
```

类似地，如果依赖关系被间接引用，拓扑排序将失败：`z` 永远不会更新，因为当更新发生时 `y` 不被认为是"脏的"。将 `$: z = y` 移到 `$: setY(x)` 下面可以解决这个问题：

```svelte
<script>
	let x = 0;
	let y = 0;

	$: z = y;
	$: setY(x);

	function setY(value) {
		y = value;
	}
</script>
```

## 仅浏览器代码

响应式语句在服务器端渲染和浏览器中都会运行。这意味着任何只应在浏览器中运行的代码都必须包装在 `if` 块中：

```js
// @noErrors
$: if (browser) {
	document.title = title;
}
```

---

# export let

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
export let foo = undefined;
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

---

# $$props 和 $$restProps

在 runes 模式下，使用 [`$props`]($props) rune 可以轻松获取包含所有传入 props 的对象。

在遗留模式下，我们使用 `$$props` 和 `$$restProps`：

- `$$props` 包含所有传入的 props，包括未使用 `export` 关键字单独声明的 props
- `$$restProps` 包含所有传入的 props，_除了_ 单独声明的 props

例如，`<Button>` 组件可能需要将其所有 props 传递给自己的 `<button>` 元素，除了 `variant` prop：

```svelte
<script>
	export let variant;
</script>

<button {...$$restProps} class="variant-{variant} {$$props.class ?? ''}">
	click me
</button>

<style>
	.variant-danger {
		background: red;
	}
</style>
```

在 Svelte 3/4 中使用 `$$props` 和 `$$restProps` 会造成适度的性能损失，因此应仅在需要时使用。
