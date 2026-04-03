---
title: transition:
tags: transitions
---

**过渡**由元素因状态更改而进入或离开 DOM 时触发。

当一个块（如 `{#if ...}` 块）正在过渡出去时，其中的所有元素，包括那些没有自己过渡的元素，都会保留在 DOM 中，直到块中的每个过渡都完成。

`transition:` 指令表示**双向**过渡，这意味着它可以在过渡进行时平滑地反转。

```svelte
<script>
	import { fade } from 'svelte/transition';

	let visible = $state(false);
</script>

<button onclick={() => visible = !visible}>切换</button>

{#if visible}
	<div transition:fade>淡入和淡出</div>
{/if}
```

## 局部 vs 全局

过渡默认是局部的。局部过渡仅在它们所属的块被创建或销毁时播放，**不会**在父块被创建或销毁时播放。

```svelte
{#if x}
	{#if y}
		<p transition:fade>仅在 y 改变时淡入和淡出</p>

		<p transition:fade|global>在 x 或 y 改变时淡入和淡出</p>
	{/if}
{/if}
```

## 内置过渡

可以从 [`svelte/transition`](svelte-transition) 模块导入一系列内置过渡。

## 过渡参数

过渡可以有参数。

（双 `{{花括号}}` 不是特殊语法；这是表达式标签内的对象字面量。）

```svelte
{#if visible}
	<div transition:fade={{ duration: 2000 }}>在两秒内淡入和淡出</div>
{/if}
```

## 自定义过渡函数

```js
/// copy: false
// @noErrors
transition = (node: HTMLElement, params: any, options: { direction: 'in' | 'out' | 'both' }) => {
	delay?: number,
	duration?: number,
	easing?: (t: number) => number,
	css?: (t: number, u: number) => string,
	tick?: (t: number, u: number) => void
}
```

过渡可以使用自定义函数。如果返回的对象有 `css` 函数，Svelte 将为 [Web 动画](https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API)生成关键帧。

传递给 `css` 的 `t` 参数是应用 `easing` 函数后介于 `0` 和 `1` 之间的值。**进入**过渡从 `0` 运行到 `1`，**退出**过渡从 `1` 运行到 `0`——换句话说，`1` 是元素的自然状态，就好像没有应用过渡一样。`u` 参数等于 `1 - t`。

该函数在过渡开始**之前**使用不同的 `t` 和 `u` 参数重复调用。

```svelte
<!--- file: App.svelte --->
<script>
	import { elasticOut } from 'svelte/easing';

	/** @type {boolean} */
	export let visible;

	/**
	 * @param {HTMLElement} node
	 * @param {{ delay?: number, duration?: number, easing?: (t: number) => number }} params
	 */
	function whoosh(node, params) {
		const existingTransform = getComputedStyle(node).transform.replace('none', '');

		return {
			delay: params.delay || 0,
			duration: params.duration || 400,
			easing: params.easing || elasticOut,
			css: (t, u) => `transform: ${existingTransform} scale(${t})`
		};
	}
</script>

{#if visible}
	<div in:whoosh>嗖地进入</div>
{/if}
```

自定义过渡函数也可以返回 `tick` 函数，该函数在过渡**期间**使用相同的 `t` 和 `u` 参数调用。

> [!NOTE] 如果可以使用 `css` 而不是 `tick`，请这样做——Web 动画可以在主线程之外运行，防止在较慢的设备上出现卡顿。

```svelte
<!--- file: App.svelte --->
<script>
	export let visible = false;

	/**
	 * @param {HTMLElement} node
	 * @param {{ speed?: number }} params
	 */
	function typewriter(node, { speed = 1 }) {
		const valid = node.childNodes.length === 1 && node.childNodes[0].nodeType === Node.TEXT_NODE;

		if (!valid) {
			throw new Error(`此过渡仅适用于具有单个文本节点子节点的元素`);
		}

		const text = node.textContent;
		const duration = text.length / (speed * 0.01);

		return {
			duration,
			tick: (t) => {
				const i = ~~(text.length * t);
				node.textContent = text.slice(0, i);
			}
		};
	}
</script>

{#if visible}
	<p in:typewriter={{ speed: 1 }}>The quick brown fox jumps over the lazy dog</p>
{/if}
```

如果过渡返回函数而不是过渡对象，该函数将在下一个微任务中调用。这允许多个过渡协调，使[交叉淡入淡出效果](/tutorial/deferred-transitions)成为可能。

过渡函数还接收第三个参数 `options`，其中包含有关过渡的信息。

`options` 对象中可用的值有：

- `direction` - 根据过渡类型为 `in`、`out` 或 `both` 之一

## 过渡事件

具有过渡的元素除了任何标准 DOM 事件外，还将分派以下事件：

- `introstart`
- `introend`
- `outrostart`
- `outroend`

```svelte
{#if visible}
	<p
		transition:fly={{ y: 200, duration: 2000 }}
		onintrostart={() => (status = 'intro 开始')}
		onoutrostart={() => (status = 'outro 开始')}
		onintroend={() => (status = 'intro 结束')}
		onoutroend={() => (status = 'outro 结束')}
	>
		飞入和飞出
	</p>
{/if}
```
