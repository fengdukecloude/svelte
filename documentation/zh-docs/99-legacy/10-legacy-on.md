---
title: on:
---

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
