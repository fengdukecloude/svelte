---
title: animate:
---

当[键控 each 块](each#Keyed-each-blocks)的内容重新排序时，会触发动画。动画不会在添加或删除元素时运行，只会在 each 块中现有数据项的索引更改时运行。动画指令必须位于键控 each 块的**直接**子元素上。

动画可以与 Svelte 的[内置动画函数](svelte-animate)或[自定义动画函数](#Custom-animation-functions)一起使用。

```svelte
<!-- 当 `list` 重新排序时，动画将运行 -->
{#each list as item, index (item)}
	<li animate:flip>{item}</li>
{/each}
```

## 动画参数

与动作和过渡一样，动画可以有参数。

（双 `{{花括号}}` 不是特殊语法；这是表达式标签内的对象字面量。）

```svelte
{#each list as item, index (item)}
	<li animate:flip={{ delay: 500 }}>{item}</li>
{/each}
```

## 自定义动画函数

```js
/// copy: false
// @noErrors
animation = (node: HTMLElement, { from: DOMRect, to: DOMRect } , params: any) => {
	delay?: number,
	duration?: number,
	easing?: (t: number) => number,
	css?: (t: number, u: number) => string,
	tick?: (t: number, u: number) => void
}
```

动画可以使用自定义函数，这些函数提供 `node`、`animation` 对象和任何 `parameters` 作为参数。`animation` 参数是一个对象，包含 `from` 和 `to` 属性，每个属性都包含一个 [DOMRect](https://developer.mozilla.org/en-US/docs/Web/API/DOMRect#Properties)，描述元素在其 `start` 和 `end` 位置的几何形状。`from` 属性是元素在其起始位置的 DOMRect，`to` 属性是列表重新排序和 DOM 更新后元素在其最终位置的 DOMRect。

如果返回的对象有 `css` 方法，Svelte 将创建在元素上播放的 [Web 动画](https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API)。

传递给 `css` 的 `t` 参数是应用 `easing` 函数后从 `0` 到 `1` 的值。`u` 参数等于 `1 - t`。

该函数在动画开始**之前**使用不同的 `t` 和 `u` 参数重复调用。

<!-- TODO: Types -->

```svelte
<!--- file: App.svelte --->
<script>
	import { cubicOut } from 'svelte/easing';

	/**
	 * @param {HTMLElement} node
	 * @param {{ from: DOMRect; to: DOMRect }} states
	 * @param {any} params
	 */
	function whizz(node, { from, to }, params) {
		const dx = from.left - to.left;
		const dy = from.top - to.top;

		const d = Math.sqrt(dx * dx + dy * dy);

		return {
			delay: 0,
			duration: Math.sqrt(d) * 120,
			easing: cubicOut,
			css: (t, u) => `transform: translate(${u * dx}px, ${u * dy}px) rotate(${t * 360}deg);`
		};
	}
</script>

{#each list as item, index (item)}
	<div animate:whizz>{item}</div>
{/each}
```

自定义动画函数也可以返回 `tick` 函数，该函数在动画**期间**使用相同的 `t` 和 `u` 参数调用。

> [!NOTE] 如果可以使用 `css` 而不是 `tick`，请这样做——Web 动画可以在主线程之外运行，防止在较慢的设备上出现卡顿。

```svelte
<!--- file: App.svelte --->
<script>
	import { cubicOut } from 'svelte/easing';

	/**
	 * @param {HTMLElement} node
	 * @param {{ from: DOMRect; to: DOMRect }} states
	 * @param {any} params
	 */
	function whizz(node, { from, to }, params) {
		const dx = from.left - to.left;
		const dy = from.top - to.top;

		const d = Math.sqrt(dx * dx + dy * dy);

		return {
			delay: 0,
			duration: Math.sqrt(d) * 120,
			easing: cubicOut,
			tick: (t, u) => Object.assign(node.style, { color: t > 0.5 ? 'Pink' : 'Blue' })
		};
	}
</script>

{#each list as item, index (item)}
	<div animate:whizz>{item}</div>
{/each}
```
