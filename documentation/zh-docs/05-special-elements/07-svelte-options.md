---
title: <svelte:options>
---

```svelte
<svelte:options option={value} />
```

`<svelte:options>` 元素提供了一个指定每个组件编译器选项的地方，这些选项在[编译器部分](svelte-compiler#compile)中有详细说明。可能的选项有：

- `runes={true}` — 强制组件进入**符文模式**（参见[遗留 API](legacy-overview) 部分）
- `runes={false}` — 强制组件进入**遗留模式**
- `namespace="..."` — 此组件将使用的命名空间，可以是 "html"（默认）、"svg" 或 "mathml"
- `customElement={...}` — 将此组件编译为自定义元素时使用的[选项](custom-elements#Component-options)。如果传递字符串，则将其用作 `tag` 选项
- `css="injected"` — 组件将内联注入其样式：在服务端渲染期间，它作为 `<style>` 标签注入到 `head` 中，在客户端渲染期间，它通过 JavaScript 加载

> [!LEGACY] 已弃用的选项
> Svelte 4 还包括以下选项。它们在 Svelte 5 中已弃用，并在符文模式下无效。
>
> - `immutable={true}` — 你从不使用可变数据，因此编译器可以进行简单的引用相等性检查来确定值是否已更改
> - `immutable={false}` — 默认值。Svelte 将对可变对象是否已更改更加保守
> - `accessors={true}` — 为组件的 props 添加 getter 和 setter
> - `accessors={false}` — 默认值

```svelte
<svelte:options customElement="my-custom-element" />
```
