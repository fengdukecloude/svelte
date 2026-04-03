---
title: 嵌套的 <style> 元素
---

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
