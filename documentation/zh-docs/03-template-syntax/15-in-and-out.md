---
title: in: 和 out:
tags: transitions
---

`in:` 和 `out:` 指令与 [`transition:`](transition) 相同，只是生成的过渡不是双向的——如果在过渡进行时块被移出，`in` 过渡将继续与 `out` 过渡一起"播放"，而不是反转。如果 out 过渡被中止，过渡将从头开始重新启动。

```svelte
<script>
  import { fade, fly } from 'svelte/transition';

  let visible = $state(false);
</script>

<label>
  <input type="checkbox" bind:checked={visible}>
  可见
</label>

{#if visible}
	<div in:fly={{ y: 200 }} out:fade>飞入，淡出</div>
{/if}
```
