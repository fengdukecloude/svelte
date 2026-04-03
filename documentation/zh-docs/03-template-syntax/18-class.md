---
title: class
tags: template-style
---

有两种方法在元素上设置类：`class` 属性和 `class:` 指令。

## 属性

原始值像任何其他属性一样处理：

```svelte
<div class={large ? 'large' : 'small'}>...</div>
```

> [!NOTE]
> 由于历史原因，假值（如 `false` 和 `NaN`）会被字符串化（`class="false"`），尽管 `class={undefined}`（或 `null`）会导致属性完全省略。在 Svelte 的未来版本中，所有假值都将导致 `class` 被省略。

### 对象和数组

从 Svelte 5.16 开始，`class` 可以是对象或数组，并使用 [clsx](https://github.com/lukeed/clsx) 转换为字符串。

如果值是对象，则添加真值键：

```svelte
<script>
	let { cool } = $props();
</script>

<!-- 如果 `cool` 为真值，结果为 `class="cool"`，
     否则为 `class="lame"` -->
<div class={{ cool, lame: !cool }}>...</div>
```

如果值是数组，则组合真值：

```svelte
<!-- 如果 `faded` 和 `large` 都为真值，结果为
     `class="saturate-0 opacity-50 scale-200"` -->
<div class={[faded && 'saturate-0 opacity-50', large && 'scale-200']}>...</div>
```

请注意，无论我们使用数组还是对象形式，我们都可以使用单个条件同时设置多个类，这在你使用 Tailwind 等工具时特别有用。

数组可以包含数组和对象，clsx 将展平它们。这对于将本地类与 props 组合很有用，例如：

```svelte
<!--- file: Button.svelte --->
<script>
	let props = $props();
</script>

<button {...props} class={['cool-button', props.class]}>
	{@render props.children?.()}
</button>
```

此组件的用户可以灵活地使用对象、数组和字符串的混合：

```svelte
<!--- file: App.svelte --->
<script>
	import Button from './Button.svelte';
	let useTailwind = $state(false);
</script>

<Button
	onclick={() => useTailwind = true}
	class={{ 'bg-blue-700 sm:w-1/2': useTailwind }}
>
	接受 Tailwind 的必然性
</Button>
```

从 Svelte 5.19 开始，Svelte 还公开了 `ClassValue` 类型，这是元素上 `class` 属性接受的值的类型。如果你想在组件 props 中使用类型安全的类名，这很有用：

```svelte
<script lang="ts">
	import type { ClassValue } from 'svelte/elements';

	const props: { class: ClassValue } = $props();
</script>

<div class={['original', props.class]}>...</div>
```

## `class:` 指令

在 Svelte 5.16 之前，`class:` 指令是有条件地在元素上设置类的最方便方式。

```svelte
<!-- 这些是等价的 -->
<div class={{ cool, lame: !cool }}>...</div>
<div class:cool={cool} class:lame={!cool}>...</div>
```

与其他指令一样，当类的名称与值一致时，我们可以使用简写：

```svelte
<div class:cool class:lame={!cool}>...</div>
```

> [!NOTE] 除非你使用的是旧版本的 Svelte，否则请考虑避免使用 `class:`，因为属性更强大且可组合。
