---
title: $$slots
---

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
