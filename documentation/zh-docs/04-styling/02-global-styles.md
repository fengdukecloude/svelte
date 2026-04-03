---
title: 全局样式
tags: styles-global
---

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
