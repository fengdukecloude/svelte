---
title: 样式（完整版）
---

本文件整合了 04-styling 文件夹中的所有内容，方便完整阅读。

---

# 作用域样式

Svelte 组件可以包含一个 `<style>` 元素，其中包含属于该组件的 CSS。默认情况下，此 CSS 是**作用域的**，这意味着样式不会应用于页面上组件之外的任何元素。

这通过向受影响的元素添加一个类来实现，该类基于组件样式的哈希值（例如 `svelte-123xyz`）。

```svelte
<style>
	p {
		/* 这只会影响此组件中的 <p> 元素 */
		color: burlywood;
	}
</style>
```

## 特异性

每个作用域选择器都会获得 0-1-0 的[特异性](https://developer.mozilla.org/en-US/docs/Web/CSS/Specificity)增加，这是由于作用域类（例如 `.svelte-123xyz`）被添加到选择器的结果。这意味着（例如）组件中定义的 `p` 选择器将优先于全局样式表中定义的 `p` 选择器，即使全局样式表是稍后加载的。

在某些情况下，作用域类必须多次添加到选择器中，但在第一次出现后，它会以 `:where(.svelte-xyz123)` 的形式添加，以避免进一步增加特异性。

## 作用域关键帧

如果组件定义了 `@keyframes`，则名称将使用相同的哈希方法作用域到组件。组件中的任何 `animation` 规则都将进行类似的调整：

```svelte
<style>
	.bouncy {
		animation: bounce 10s;
	}

	/* 这些关键帧只能在此组件内访问 */
	@keyframes bounce {
		/* ... */
	}
</style>
```

---

# 全局样式

## :global(...)

要将样式全局应用于单个选择器，使用 `:global(...)` 修饰符：

```svelte
<style>
	:global(body) {
		/* 应用于 <body> */
		margin: 0;
	}

	div :global(strong) {
		/* 应用于所有 <strong> 元素，在任何组件中，
		   只要它们位于属于此组件的 <div> 元素内 */
		color: goldenrod;
	}

	p:global(.big.red) {
		/* 应用于所有属于此组件的 <p> 元素
		   且具有 `class="big red"`，即使它是以编程方式应用的
		   （例如由库应用） */
	}
</style>
```

如果你想创建全局可访问的 @keyframes，你需要在关键帧名称前加上 `-global-`。

编译时，`-global-` 部分将被移除，然后在代码的其他地方使用 `my-animation-name` 引用关键帧。

```svelte
<style>
	@keyframes -global-my-animation-name {
		/* 代码放在这里 */
	}
</style>
```

## :global

要将样式全局应用于一组选择器，创建一个 `:global {...}` 块：

```svelte
<style>
	:global {
		/* 应用于应用程序中的每个 <div> */
		div { ... }

		/* 应用于应用程序中的每个 <p> */
		p { ... }
	}

	.a :global {
		/* 应用于每个 `.b .c .d` 元素，在任何组件中，
		   只要它位于此组件中的 `.a` 元素内 */
		.b .c .d {...}
	}
</style>
```

> [!NOTE] 上面的第二个示例也可以写成等效的 `.a :global .b .c .d` 选择器，其中 `:global` 之后的所有内容都是非作用域的，尽管嵌套形式是首选的。

---

# 自定义属性

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

---

# 嵌套的 <style> 元素

每个组件只能有一个顶层 `<style>` 标签。

但是，可以在其他元素或逻辑块内嵌套 `<style>` 标签。

在这种情况下，`<style>` 标签将按原样插入到 DOM 中；不会对 `<style>` 标签进行作用域处理或处理。

```svelte
<div>
	<style>
		/* 此样式标签将按原样插入 */
		div {
			/* 这将应用于 DOM 中的所有 `<div>` 元素 */
			color: red;
		}
	</style>
</div>
```
