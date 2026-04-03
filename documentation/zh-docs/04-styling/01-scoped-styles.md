---
title: 作用域样式
tags: styles-scoped
---

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
