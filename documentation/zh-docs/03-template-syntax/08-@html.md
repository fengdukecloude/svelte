---
title: {@html ...}
tags: template-html
---

要将原始 HTML 注入到组件中，使用 `{@html ...}` 标签：

```svelte
<article>
	{@html content}
</article>
```

> [!NOTE] 确保你转义传递的字符串或仅使用你控制的值填充它，以防止 [XSS 攻击](https://owasp.org/www-community/attacks/xss/)。永远不要渲染未经清理的内容。

表达式应该是有效的独立 HTML——这不会起作用，因为 `</div>` 不是有效的 HTML：

```svelte
{@html '<div>'}内容{@html '</div>'}
```

它也不会编译 Svelte 代码。

## 样式

以这种方式渲染的内容对 Svelte 是"不可见的"，因此不会接收[作用域样式](scoped-styles)。换句话说，这不会起作用，`a` 和 `img` 样式将被视为未使用：

<!-- prettier-ignore -->
```svelte
<article>
	{@html content}
</article>

<style>
	article {
		a { color: hotpink }
		img { width: 100% }
	}
</style>
```

相反，使用 `:global` 修饰符来定位 `<article>` 内的所有内容：

<!-- prettier-ignore -->
```svelte
<style>
	article :global {
		a { color: hotpink }
		img { width: 100% }
	}
</style>
```
