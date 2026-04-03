---
title: <svelte:element>
---

```svelte
<svelte:element this={expression} />
```

`<svelte:element>` 元素允许你渲染在编写时未知的元素，例如因为它来自 CMS。任何存在的属性和事件监听器都将应用于该元素。

唯一支持的绑定是 `bind:this`，因为 Svelte 的内置绑定不适用于通用元素。

如果 `this` 具有空值，则元素及其子元素将不会被渲染。

如果 `this` 是[空元素](https://developer.mozilla.org/en-US/docs/Glossary/Void_element)的名称（例如 `br`）并且 `<svelte:element>` 有子元素，则在开发模式下将抛出运行时错误：

```svelte
<script>
	let tag = $state('hr');
</script>

<svelte:element this={tag}>
	此文本不能出现在 hr 元素内
</svelte:element>
```

Svelte 会尽力从元素的周围环境推断正确的命名空间，但这并不总是可能的。你可以使用 `xmlns` 属性使其显式：

```svelte
<svelte:element this={tag} xmlns="http://www.w3.org/2000/svg" />
```

`this` 需要是有效的 DOM 元素标签，像 `#text` 或 `svelte:head` 这样的东西将不起作用。
