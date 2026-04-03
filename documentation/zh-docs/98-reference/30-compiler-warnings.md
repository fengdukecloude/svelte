---
title: '编译器警告'
---

Svelte 会在编译时警告你，如果它捕获到潜在的错误，例如编写了无法访问的标记。

某些警告在你的具体用例中可能是不正确的。你可以通过在导致警告的行上方放置 `<!-- svelte-ignore <code> -->` 注释来禁用此类误报。例如：

```svelte
<!-- svelte-ignore a11y_autofocus -->
<input autofocus />
```

你可以在单个注释中列出多个规则（用逗号分隔），并在它们旁边添加解释性说明（在括号中）：

```svelte
<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions (because of reasons) -->
<div onclick>...</div>
```

@include .generated/compile-warnings.md
