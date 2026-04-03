---
title: <svelte:body>
---

```svelte
<svelte:body onevent={handler} />
```

与 `<svelte:window>` 类似，此元素允许你向 `document.body` 上的事件添加监听器，例如 `mouseenter` 和 `mouseleave`，这些事件不会在 `window` 上触发。它还允许你在 `<body>` 元素上使用[动作](use)。

与 `<svelte:window>` 和 `<svelte:document>` 一样，此元素只能出现在组件的顶层，并且绝不能位于块或元素内部。

```svelte
<svelte:body onmouseenter={handleMouseenter} onmouseleave={handleMouseleave} use:someAction />
```
