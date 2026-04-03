---
title: style:
tags: template-style
---

`style:` 指令提供了在元素上设置多个样式的简写方式。

```svelte
<!-- 这些是等价的 -->
<div style:color="red">...</div>
<div style="color: red;">...</div>
```

值可以包含任意表达式：

```svelte
<div style:color={myColor}>...</div>
```

允许使用简写形式：

```svelte
<div style:color>...</div>
```

可以在单个元素上设置多个样式：

```svelte
<div style:color style:width="12rem" style:background-color={darkMode ? 'black' : 'white'}>...</div>
```

要将样式标记为重要，使用 `|important` 修饰符：

```svelte
<div style:color|important="red">...</div>
```

当 `style:` 指令与 `style` 属性组合时，指令将优先，即使是 `!important` 属性：

```svelte
<div style:color="red" style="color: blue">这将是红色</div>
<div style:color="red" style="color: blue !important">这仍然是红色</div>
```
