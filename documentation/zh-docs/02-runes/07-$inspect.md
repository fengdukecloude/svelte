---
title: $inspect
tags: rune-inspect
---

> [!NOTE] `$inspect` 仅在开发期间有效。在生产构建中，它变成一个空操作。

`$inspect` 符文大致等同于 `console.log`，但有一个例外，即每当其参数改变时它都会重新运行。`$inspect` 深度跟踪响应式状态，这意味着使用细粒度响应式更新对象或数组内部的某些内容将导致它重新触发：

<!-- codeblock:start {"title":"$inspect(...)"} -->
```svelte
<!--- file: App.svelte --->
<script>
	let count = $state(0);
	let message = $state('hello');

	$inspect(count, message); // 当 `count` 或 `message` 改变时将 console.log
</script>

<button onclick={() => count++}>增加</button>
<input bind:value={message} />
```
<!-- codeblock:end -->

在更新时，将打印堆栈跟踪，使得很容易找到状态更改的来源（除非你在演练场中，由于技术限制）。

## $inspect(...).with

`$inspect(...)` 返回一个带有 `with` 方法的对象，你可以使用回调调用它，然后该回调将被调用而不是 `console.log`。回调的第一个参数是 `"init"` 或 `"update"`；后续参数是传递给 `$inspect` 的值：

<!-- codeblock:start {"title":"$inspect(...).with(...)"} -->
```svelte
<!--- file: App.svelte --->
<script>
	let count = $state(0);

	$inspect(count).with((type, count) => {
		if (type === 'update') {
			debugger; // 或 `console.trace`，或任何你想要的
		}
	});
</script>

<button onclick={() => count++}>增加</button>
```
<!-- codeblock:end -->

## $inspect.trace(...)

此符文在 5.14 中添加，导致周围的函数在开发中被**跟踪**。每当函数作为[副作用]($effect)或[派生]($derived)的一部分重新运行时，有关哪些响应式状态片段导致副作用触发的信息将打印到控制台。

```svelte
<script>
	import { doSomeWork } from './elsewhere';

	$effect(() => {
		// $inspect.trace 必须是函数体的第一条语句
		$inspect.trace();
		doSomeWork();
	});
</script>
```

`$inspect.trace` 接受一个可选的第一个参数，该参数将用作标签。
