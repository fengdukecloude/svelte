---
title: $$props 和 $$restProps
---

在 runes 模式下，使用 [`$props`]($props) rune 可以轻松获取包含所有传入 props 的对象。

在遗留模式下，我们使用 `$$props` 和 `$$restProps`：

- `$$props` 包含所有传入的 props，包括未使用 `export` 关键字单独声明的 props
- `$$restProps` 包含所有传入的 props，_除了_ 单独声明的 props

例如，`<Button>` 组件可能需要将其所有 props 传递给自己的 `<button>` 元素，除了 `variant` prop：

```svelte
<script>
	export let variant;
</script>

<button {...$$restProps} class="variant-{variant} {$$props.class ?? ''}">
	click me
</button>

<style>
	.variant-danger {
		background: red;
	}
</style>
```

在 Svelte 3/4 中使用 `$$props` 和 `$$restProps` 会造成适度的性能损失，因此应仅在需要时使用。
