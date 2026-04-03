---
title: <svelte:component>
---

在 runes 模式下，如果 `MyComponent` 的值发生变化，`<MyComponent>` 将重新渲染。有关示例，请参阅 [Svelte 5 迁移指南](/docs/svelte/v5-migration-guide#svelte:component-is-no-longer-necessary)。

在遗留模式下，它不会——我们必须使用 `<svelte:component>`，当其 `this` 表达式的值发生变化时，它会销毁并重新创建组件实例：

```svelte
<svelte:component this={MyComponent} />
```

如果 `this` 为假值，则不会渲染任何组件。
