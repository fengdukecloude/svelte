---
title: svelte/reactivity/window
---

此模块导出各种 `window` 值的响应式版本，每个值都有一个响应式 `current` 属性，你可以在响应式上下文（模板、[deriveds]($derived) 和 [effects]($effect)）中引用它，而无需使用 [`<svelte:window>`](svelte-window) 绑定或手动创建自己的事件监听器。

```svelte
<script>
	import { innerWidth, innerHeight } from 'svelte/reactivity/window';
</script>

<p>{innerWidth.current}x{innerHeight.current}</p>
```

> MODULE: svelte/reactivity/window
