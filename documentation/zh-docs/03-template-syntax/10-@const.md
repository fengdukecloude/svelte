---
title: {@const ...}
---

`{@const ...}` 标签定义一个局部常量。

```svelte
{#each boxes as box}
	{@const area = box.width * box.height}
	{box.width} * {box.height} = {area}
{/each}
```

`{@const}` 只允许作为块的直接子级——`{#if ...}`、`{#each ...}`、`{#snippet ...}` 等——或 `<Component />` 或 `<svelte:boundary>`。
