---
title: {@render ...}
---

要渲染[代码片段](snippet)，使用 `{@render ...}` 标签。

```svelte
{#snippet sum(a, b)}
	<p>{a} + {b} = {a + b}</p>
{/snippet}

{@render sum(1, 2)}
{@render sum(3, 4)}
{@render sum(5, 6)}
```

表达式可以是像 `sum` 这样的标识符，或任意 JavaScript 表达式：

```svelte
{@render (cool ? coolSnippet : lameSnippet)()}
```

## 可选的代码片段

如果代码片段可能是 undefined——例如，因为它是传入的 prop——那么你可以使用可选链只在它**被**定义时渲染它：

```svelte
{@render children?.()}
```

或者，使用带有 `:else` 子句的 [`{#if ...}`](if) 块来渲染回退内容：

```svelte
{#if children}
	{@render children()}
{:else}
	<p>回退内容</p>
{/if}
```
