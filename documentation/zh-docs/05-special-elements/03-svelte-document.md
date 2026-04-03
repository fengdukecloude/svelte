---
title: <svelte:document>
---

```svelte
<svelte:document onevent={handler} />
```

```svelte
<svelte:document bind:prop={value} />
```

与 `<svelte:window>` 类似，此元素允许你向 `document` 上的事件添加监听器，例如 `visibilitychange`，这些事件不会在 `window` 上触发。它还允许你在 `document` 上使用[附件](@attach)。

与 `<svelte:window>` 一样，此元素只能出现在组件的顶层，并且绝不能位于块或元素内部。

```svelte
<svelte:document onvisibilitychange={handleVisibilityChange} {@attach someAttachment} />
```

你还可以绑定到以下属性：

- `activeElement`
- `fullscreenElement`
- `pointerLockElement`
- `visibilityState`

所有属性都是只读的。
