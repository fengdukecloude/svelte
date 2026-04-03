---
title: <svelte:head>
---

```svelte
<svelte:head>...</svelte:head>
```

此元素使得可以将元素插入到 `document.head` 中。在服务端渲染期间，`head` 内容与主 `body` 内容分开公开。

与 `<svelte:window>`、`<svelte:document>` 和 `<svelte:body>` 一样，此元素只能出现在组件的顶层，并且绝不能位于块或元素内部。

```svelte
<svelte:head>
	<title>你好世界！</title>
	<meta name="description" content="这是 SEO 描述的位置" />
</svelte:head>
```
