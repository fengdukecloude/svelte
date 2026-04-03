---
title: 响应式 let/var 声明
---

在 runes 模式下，响应式状态使用 [`$state` rune]($state) 显式声明。

在遗留模式下，在组件顶层声明的变量会自动被视为 _响应式_。重新赋值或修改这些变量（`count += 1` 或 `object.x = y`）将导致 UI 更新。

```svelte
<script>
	let count = 0;
</script>

<button on:click={() => count += 1}>
	clicks: {count}
</button>
```

由于 Svelte 的遗留模式响应性基于 _赋值_，使用数组方法如 `.push()` 和 `.splice()` 不会自动触发更新。需要后续赋值来"告诉"编译器更新 UI：

```svelte
<script>
	let numbers = [1, 2, 3, 4];

	function addNumber() {
		// this method call does not trigger an update
		numbers.push(numbers.length + 1);

		// this assignment will update anything
		// that depends on `numbers`
		numbers = numbers;
	}
</script>
```
