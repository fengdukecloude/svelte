---
title: 自定义属性
tags: styles-custom-properties
---

你可以将 CSS 自定义属性——静态和动态的——传递给组件：

```svelte
<Slider
	bind:value
	min={0}
	max={100}
	--track-color="black"
	--thumb-color="rgb({r} {g} {b})"
/>
```

上面的代码本质上会被脱糖为：

```svelte
<svelte-css-wrapper style="display: contents; --track-color: black; --thumb-color: rgb({r} {g} {b})">
	<Slider
		bind:value
		min={0}
		max={100}
	/>
</svelte-css-wrapper>
```

对于 SVG 元素，它会使用 `<g>` 代替：

```svelte
<g style="--track-color: black; --thumb-color: rgb({r} {g} {b})">
	<Slider
		bind:value
		min={0}
		max={100}
	/>
</g>
```

在组件内部，我们可以使用 [`var(...)`](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties) 读取这些自定义属性（并提供回退值）：

```svelte
<style>
	.track {
		background: var(--track-color, #aaa);
	}

	.thumb {
		background: var(--thumb-color, blue);
	}
</style>
```

你**不必**直接在组件上指定值；只要自定义属性在父元素上定义，组件就可以使用它们。通常在全局样式表中的 `:root` 元素上定义自定义属性，以便它们应用于整个应用程序。

> [!NOTE] 虽然额外的元素不会影响布局，但它**会**影响任何使用 `>` 组合器直接定位组件容器内元素的 CSS 选择器。
