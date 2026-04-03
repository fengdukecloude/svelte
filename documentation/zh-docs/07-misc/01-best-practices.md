---
title: 最佳实践
skill: true
name: svelte-core-bestpractices
description: Guidance on writing fast, robust, modern Svelte code. Load this skill whenever in a Svelte project and asked to write/edit or analyze a Svelte component or module. Covers reactivity, event handling, styling, integration with libraries and more.
---

<!-- llm-ignore-start -->
本文档概述了一些最佳实践，这些实践将帮助你编写快速、健壮的 Svelte 应用。它也可作为 `svelte-core-bestpractices` 技能供你的代理使用。
<!-- llm-ignore-end -->

## `$state`

仅对应该**响应式**的变量使用 `$state` 符文——换句话说，会导致 `$effect`、`$derived` 或模板表达式更新的变量。其他所有内容都可以是普通变量。

对象和数组（`$state({...})` 或 `$state([...])`）被深度响应式化，这意味着变更将触发更新。这有一个权衡：为了换取细粒度的响应性，对象必须被代理，这会产生性能开销。在处理仅被重新赋值（而不是变更）的大型对象的情况下，请改用 `$state.raw`。例如，这通常是 API 响应的情况。

## `$derived`

要从状态计算某些内容，请使用 `$derived` 而不是 `$effect`：

```js
// @errors: 2451
let num = 0;
// ---cut---
// 这样做
let square = $derived(num * num);

// 不要这样做
let square;

$effect(() => {
	square = num * num;
});
```

> [!NOTE] `$derived` 接受一个表达式，**而不是**函数。如果你需要使用函数（例如因为表达式很复杂），请使用 `$derived.by`。

派生值是可写的——你可以像 `$state` 一样对它们赋值，只是当它们的表达式更改时它们会重新评估。

如果派生表达式是对象或数组，它将按原样返回——它**不会**被深度响应式化。但是，在极少数需要这样做的情况下，你可以在 `$derived.by` 内部使用 `$state`。

## `$effect`

副作用是一个逃生舱口，应该尽量避免使用。特别是，避免在副作用内部更新状态。

- 如果你需要将状态同步到外部库（如 D3），使用 [`{@attach ...}`](@attach) 通常更整洁
- 如果你需要运行一些代码以响应用户交互，请将代码直接放在事件处理器中或适当使用[函数绑定](bind#Function-bindings)
- 如果你需要记录值以进行调试，请使用 [`$inspect`]($inspect)
- 如果你需要观察 Svelte 外部的某些内容，请使用 [`createSubscriber`](svelte-reactivity#createSubscriber)

永远不要将副作用的内容包装在 `if (browser) {...}` 或类似的语句中——副作用不会在服务器上运行。

## `$props`

将 props 视为它们会更改。例如，依赖于 props 的值通常应该使用 `$derived`：

```js
// @errors: 2451
let { type } = $props();

// 这样做
let color = $derived(type === 'danger' ? 'red' : 'green');

// 不要这样做——如果 `type` 更改，`color` 不会更新
let color = type === 'danger' ? 'red' : 'green';
```

## `$inspect.trace`

`$inspect.trace` 是一个用于响应性的调试工具。如果某些内容没有正确更新或运行次数超过预期，你可以在 `$effect` 或 `$derived.by`（或它们调用的任何函数）的第一行添加 `$inspect.trace(label)` 来跟踪它们的依赖项并发现哪个触发了更新。

## 事件

任何以 `on` 开头的元素属性都被视为事件监听器：

```svelte
<button onclick={() => {...}}>点击我</button>

<!-- 属性简写也有效 -->
<button {onclick}>...</button>

<!-- 展开属性也是如此 -->
<button {...props}>...</button>
```

如果你需要向 `window` 或 `document` 附加监听器，你可以使用 `<svelte:window>` 和 `<svelte:document>`：

```svelte
<svelte:window onkeydown={...} />
<svelte:document onvisibilitychange={...} />
```

避免为此使用 `onMount` 或 `$effect`。

## 代码片段

[代码片段](snippet)是一种定义可重用标记块的方法，可以使用 [`{@render ...}`](@render) 标签实例化，或作为 props 传递给组件。它们必须在模板中声明。

```svelte
{#snippet greeting(name)}
  <p>你好 {name}！</p>
{/snippet}

{@render greeting('世界')}
```

> [!NOTE] 在组件顶层声明的代码片段（即不在元素或块内部）可以在 `<script>` 内部引用。不引用组件状态的代码片段也可以在 `<script module>` 中使用，在这种情况下，它可以导出供其他组件使用。

## Each 块

优先使用[带键的 each 块](each#Keyed-each-blocks)——这通过允许 Svelte 手术式地插入或移除项目而不是更新现有项目所属的 DOM 来提高性能。

> [!NOTE] 键**必须**唯一标识对象。不要使用索引作为键。

如果你需要变更项目（例如使用 `bind:value={item.count}`），请避免解构。

## 在 CSS 中使用 JavaScript 变量

如果你有一个想在 CSS 中使用的 JS 变量，你可以使用 `style:` 指令设置 CSS 自定义属性。

```svelte
<div style:--columns={columns}>...</div>
```

然后你可以在组件的 `<style>` 中引用 `var(--columns)`。

## 为子组件设置样式

组件的 `<style>` 中的 CSS 作用域限定于该组件。如果父组件需要控制子组件的样式，首选方法是使用 CSS 自定义属性：

```svelte
<!-- Parent.svelte -->
<Child --color="red" />

<!-- Child.svelte -->
<h1>你好</h1>

<style>
	h1 {
		color: var(--color);
	}
</style>
```

如果这不可能（例如，子组件来自库），你可以使用 `:global` 来覆盖样式：

```svelte
<div>
	<Child />
</div>

<style>
	div :global {
		h1 {
			color: red;
		}
	}
</style>
```

## Context

考虑使用 context 而不是在共享模块中声明状态。这将把状态限定在需要它的应用部分，并消除在服务端渲染时它在用户之间泄漏的可能性。

使用 `createContext` 而不是 `setContext` 和 `getContext`，因为它提供了类型安全性。

## 异步 Svelte

如果使用版本 5.36 或更高版本，你可以使用 [await 表达式](await-expressions)和 [hydratable](hydratable) 直接在组件内部使用 promise。请注意，这些需要在 `svelte.config.js` 中启用 `experimental.async` 选项，因为它们尚未被认为是完全稳定的。

## 避免遗留功能

对于新代码，始终使用符文模式，并避免使用具有更现代替代品的功能：

- 使用 `$state` 而不是隐式响应性（例如 `let count = 0; count += 1`）
- 使用 `$derived` 和 `$effect` 而不是 `$:` 赋值和语句（但仅在没有更好的解决方案时使用副作用）
- 使用 `$props` 而不是 `export let`、`$$props` 和 `$$restProps`
- 使用 `onclick={...}` 而不是 `on:click={...}`
- 使用 `{#snippet ...}` 和 `{@render ...}` 而不是 `<slot>` 和 `$$slots` 和 `<svelte:fragment>`
- 使用 `<DynamicComponent>` 而不是 `<svelte:component this={DynamicComponent}>`
- 使用 `import Self from './ThisComponent.svelte'` 和 `<Self>` 而不是 `<svelte:self>`
- 使用带有 `$state` 字段的类在组件之间共享响应性，而不是使用 store
- 使用 `{@attach ...}` 而不是 `use:action`
- 在 `class` 属性中使用 clsx 风格的数组和对象，而不是 `class:` 指令
