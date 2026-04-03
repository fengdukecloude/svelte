---
title: <svelte:window>
---

```svelte
<svelte:window onevent={handler} />
```

```svelte
<svelte:window bind:prop={value} />
```

`<svelte:window>` 元素允许你向 `window` 对象添加事件监听器，而无需担心在组件销毁时移除它们，或在服务端渲染时检查 `window` 的存在。

此元素只能出现在组件的顶层——它不能位于块或元素内部。

```svelte
<script>
	function handleKeydown(event) {
		alert(`按下了 ${event.key} 键`);
	}
</script>

<svelte:window onkeydown={handleKeydown} />
```

你还可以绑定到以下属性：

- `innerWidth`
- `innerHeight`
- `outerWidth`
- `outerHeight`
- `scrollX`
- `scrollY`
- `online` — `window.navigator.onLine` 的别名
- `devicePixelRatio`

除 `scrollX` 和 `scrollY` 外，所有属性都是只读的。

```svelte
<svelte:window bind:scrollY={y} />
```

> [!NOTE] 请注意，页面不会滚动到初始值以避免可访问性问题。只有对 `scrollX` 和 `scrollY` 绑定变量的后续更改才会导致滚动。如果你有正当理由在组件渲染时滚动，请在 `$effect` 中调用 `scrollTo()`。
