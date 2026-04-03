---
title: <svelte:fragment>
---

`<svelte:fragment>` 元素允许你将内容放置在 [命名插槽](legacy-slots) 中，而无需将其包装在容器 DOM 元素中。这保持了文档的流式布局完整。

```svelte
<!--- file: Widget.svelte --->
<div>
	<slot name="header">No header was provided</slot>
	<p>Some content between header and footer</p>
	<slot name="footer" />
</div>
```

```svelte
<!--- file: App.svelte --->
<script>
	import Widget from './Widget.svelte';
</script>

<Widget>
	<h1 slot="header">Hello</h1>
	<svelte:fragment slot="footer">
		<p>All rights reserved.</p>
		<p>Copyright (c) 2019 Svelte Industries</p>
	</svelte:fragment>
</Widget>
```

> [!NOTE]
> 在 Svelte 5+ 中，这个概念已过时，因为 snippets 不会创建包装元素
