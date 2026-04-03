---
title: 遗留 API - 事件和插槽（完整版）
---

本文件整合了 99-legacy 文件夹中关于事件和插槽的内容，方便完整阅读。

---

# on: 指令

在 runes 模式下，事件处理器就像任何其他属性或 prop 一样。

在遗留模式下，我们使用 `on:` 指令：

```svelte
<!--- file: App.svelte --->
<script>
	let count = 0;

	/** @param {MouseEvent} event */
	function handleClick(event) {
		count += 1;
	}
</script>

<button on:click={handleClick}>
	count: {count}
</button>
```

处理器可以内联声明，没有性能损失：

```svelte
<button on:click={() => (count += 1)}>
	count: {count}
</button>
```

使用 `|` 字符向元素事件处理器添加 _修饰符_。

```svelte
<form on:submit|preventDefault={handleSubmit}>
	<!-- the `submit` event's default is prevented,
	     so the page won't reload -->
</form>
```

以下修饰符可用：

- `preventDefault` — 在运行处理器之前调用 `event.preventDefault()`
- `stopPropagation` — 调用 `event.stopPropagation()`，防止事件到达下一个元素
- `stopImmediatePropagation` — 调用 `event.stopImmediatePropagation()`，防止触发同一事件的其他监听器。
- `passive` — 提高触摸/滚轮事件的滚动性能（Svelte 会在安全的地方自动添加它）
- `nonpassive` — 显式设置 `passive: false`
- `capture` — 在 _捕获_ 阶段而不是 _冒泡_ 阶段触发处理器
- `once` — 在第一次运行后移除处理器
- `self` — 仅当 `event.target` 是元素本身时才触发处理器
- `trusted` — 仅当 `event.isTrusted` 为 `true` 时才触发处理器。即，如果事件是由用户操作触发的。

修饰符可以链接在一起，例如 `on:click|once|capture={...}`。

如果 `on:` 指令不带值使用，组件将 _转发_ 事件，这意味着组件的使用者可以监听它。

```svelte
<button on:click>
	The component itself will emit the click event
</button>
```

可以为同一事件设置多个事件监听器：

```svelte
<!--- file: App.svelte --->
<script>
	let count = 0;

	function increment() {
		count += 1;
	}

	/** @param {MouseEvent} event */
	function log(event) {
		console.log(event);
	}
</script>

<button on:click={increment} on:click={log}>
	clicks: {count}
</button>
```

## 组件事件

组件可以通过在初始化时创建 _调度器_ 来调度事件：

```svelte
<!--- file: Stepper.svelte -->
<script>
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();
</script>

<button on:click={() => dispatch('decrement')}>decrement</button>
<button on:click={() => dispatch('increment')}>increment</button>
```

`dispatch` 创建一个 [`CustomEvent`](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent)。如果提供了第二个参数，它将成为事件对象的 `detail` 属性。

此组件的使用者可以监听调度的事件：

```svelte
<script>
	import Stepper from './Stepper.svelte';

	let n = 0;
</script>

<Stepper
	on:decrement={() => n -= 1}
	on:increment={() => n += 1}
/>

<p>n: {n}</p>
```

组件事件不会冒泡——父组件只能监听其直接子组件上的事件。

除了 `once` 之外，修饰符在组件事件处理器上无效。

> [!NOTE]
> 如果你计划最终迁移到 Svelte 5，请使用回调 props。这将使升级更容易，因为 `createEventDispatcher` 已被弃用：
>
> ```svelte
> <!--- file: Stepper.svelte --->
> <script>
> 	export let decrement;
> 	export let increment;
> </script>
>
> <button on:click={decrement}>decrement</button>
> <button on:click={increment}>increment</button>
> ```

---

# <slot>

在 Svelte 5 中，内容可以以 [snippets](snippet) 的形式传递给组件，并使用 [render 标签](@render) 渲染。

在遗留模式下，组件标签内的内容被视为 _插槽内容_，可以由组件使用 `<slot>` 元素渲染：

```svelte
<!--- file: App.svelte --->
<script>
	import Modal from './Modal.svelte';
</script>

<Modal>This is some slotted content</Modal>
```

```svelte
<!--- file: Modal.svelte --->
<div class="modal">
	<slot></slot>
</div>
```

> [!NOTE] 如果你想渲染常规的 `<slot>` 元素，可以使用 `<svelte:element this={'slot'} />`。

## 命名插槽

组件除了默认插槽外还可以有 _命名_ 插槽。在父组件侧，向直接位于组件标签内的元素、组件或 [`<svelte:fragment>`](legacy-svelte-fragment) 添加 `slot="..."` 属性。

```svelte
<!--- file: App.svelte --->
<script>
	import Modal from './Modal.svelte';

	let open = true;
</script>

{#if open}
	<Modal>
		This is some slotted content

		<div slot="buttons">
			<button on:click={() => open = false}>
				close
			</button>
		</div>
	</Modal>
{/if}
```

在子组件侧，添加相应的 `<slot name="...">` 元素：

```svelte
<!--- file: Modal.svelte --->
<div class="modal">
	<slot></slot>
	<hr>
	<slot name="buttons"></slot>
</div>
```

## 后备内容

如果没有提供插槽内容，组件可以通过将其放在 `<slot>` 元素内来定义后备内容：

```svelte
<slot>
	This will be rendered if no slotted content is provided
</slot>
```

## 向插槽内容传递数据

插槽可以渲染零次或多次，并且可以使用 props 将值 _传回_ 给父组件。父组件使用 `let:` 指令向插槽模板公开值。

```svelte
<!--- file: FancyList.svelte --->
<ul>
	{#each items as data}
		<li class="fancy">
			<!-- 'item' here... -->
			<slot item={process(data)} />
		</li>
	{/each}
</ul>
```

```svelte
<!--- file: App.svelte --->
<!-- ...corresponds to 'item' here: -->
<FancyList {items} let:item={processed}>
	<div>{processed.text}</div>
</FancyList>
```

通常的简写规则适用——`let:item` 等同于 `let:item={item}`，`<slot {item}>` 等同于 `<slot item={item}>`。

命名插槽也可以公开值。`let:` 指令放在具有 `slot` 属性的元素上。

```svelte
<!--- file: FancyList.svelte --->
<ul>
	{#each items as item}
		<li class="fancy">
			<slot name="item" item={process(data)} />
		</li>
	{/each}
</ul>

<slot name="footer" />
```

```svelte
<!--- file: App.svelte --->
<FancyList {items}>
	<div slot="item" let:item>{item.text}</div>
	<p slot="footer">Copyright (c) 2019 Svelte Industries</p>
</FancyList>
```

---

# $$slots

在 runes 模式下，我们知道哪些 [snippets](snippet) 被提供给了组件，因为它们只是普通的 props。

在遗留模式下，知道是否为给定插槽提供了内容的方法是使用 `$$slots` 对象，其键是父组件传递给组件的插槽名称。

```svelte
<!--- file: Card.svelte --->
<div>
	<slot name="title" />
	{#if $$slots.description}
		<!-- This <hr> and slot will render only if `slot="description"` is provided. -->
		<hr />
		<slot name="description" />
	{/if}
</div>
```

```svelte
<!--- file: App.svelte --->
<Card>
	<h1 slot="title">Blog Post Title</h1>
	<!-- No slot named "description" was provided so the optional slot will not be rendered. -->
</Card>
```

---

# <svelte:fragment>

`<svelte:fragment>` 元素允许你将内容放置在 [命名插槽](legacy-slots) 中，而无需将其包装在容器 DOM 元素中。这保持了文档的流式布局完整。

```svelte
<!--- file: Widget.svelte --->
<div>
	<slot name="header">No header was provided</slot>
	<p>Some content between header and footer</p>
	<slot name="footer" />
</div>
```

```svelte
<!--- file: App.svelte --->
<script>
	import Widget from './Widget.svelte';
</script>

<Widget>
	<h1 slot="header">Hello</h1>
	<svelte:fragment slot="footer">
		<p>All rights reserved.</p>
		<p>Copyright (c) 2019 Svelte Industries</p>
	</svelte:fragment>
</Widget>
```

> [!NOTE]
> 在 Svelte 5+ 中，这个概念已过时，因为 snippets 不会创建包装元素
