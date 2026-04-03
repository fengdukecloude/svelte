---
title: {#key ...}
tags: template-key
---

```svelte
<!--- copy: false  --->
{#key expression}...{/key}
```

Key 块在表达式的值改变时销毁并重新创建其内容。当用于组件周围时，这将导致它们被重新实例化和重新初始化：

```svelte
{#key value}
	<Component />
{/key}
```

当你希望每当值改变时播放过渡效果时，它也很有用：

```svelte
{#key value}
	<div transition:fade>{value}</div>
{/key}
```
