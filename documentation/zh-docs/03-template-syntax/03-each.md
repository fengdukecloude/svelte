---
title: {#each ...}
tags: template-each
---

```svelte
<!--- copy: false  --->
{#each expression as name}...{/each}
```

```svelte
<!--- copy: false  --->
{#each expression as name, index}...{/each}
```

可以使用 each 块迭代值。所讨论的值可以是数组、类数组对象（即任何具有 `length` 属性的对象）或可迭代对象，如 `Map` 和 `Set`。（在内部，它们使用 [`Array.from`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/from) 转换为数组。）

如果值为 `null` 或 `undefined`，它将被视为空数组（这将导致渲染 [else 块](#Else-blocks)，如果适用）。

```svelte
<h1>购物清单</h1>
<ul>
	{#each items as item}
		<li>{item.name} x {item.qty}</li>
	{/each}
</ul>
```

each 块还可以指定一个**索引**，相当于 `array.map(...)` 回调中的第二个参数：

```svelte
{#each items as item, i}
	<li>{i + 1}：{item.name} x {item.qty}</li>
{/each}
```

## 带键的 each 块

```svelte
<!--- copy: false  --->
{#each expression as name (key)}...{/each}
```

```svelte
<!--- copy: false  --->
{#each expression as name, index (key)}...{/each}
```

如果提供了**键**表达式——它必须唯一标识每个列表项——Svelte 将使用它在数据更改时通过插入、移动和删除项目来智能更新列表，而不是在末尾添加或删除项目并更新中间的状态。

键可以是任何对象，但建议使用字符串和数字，因为它们允许在对象本身更改时保持身份。

```svelte
{#each items as item (item.id)}
	<li>{item.name} x {item.qty}</li>
{/each}

<!-- 或带有额外的索引值 -->
{#each items as item, i (item.id)}
	<li>{i + 1}：{item.name} x {item.qty}</li>
{/each}
```

你可以在 each 块中自由使用解构和剩余模式。

```svelte
{#each items as { id, name, qty }, i (id)}
	<li>{i + 1}：{name} x {qty}</li>
{/each}

{#each objects as { id, ...rest }}
	<li><span>{id}</span><MyComponent {...rest} /></li>
{/each}

{#each items as [id, ...rest]}
	<li><span>{id}</span><MyComponent values={rest} /></li>
{/each}
```

## 不带项的 Each 块

```svelte
<!--- copy: false  --->
{#each expression}...{/each}
```

```svelte
<!--- copy: false  --->
{#each expression, index}...{/each}
```

如果你只想渲染某些内容 `n` 次，可以省略 `as` 部分：

<!-- codeblock:start {"title":"棋盘"} -->
```svelte
<!--- file: App.svelte --->
<div class="chess-board">
	{#each { length: 8 }, rank}
		{#each { length: 8 }, file}
			<div class:black={(rank + file) % 2 === 1}></div>
		{/each}
	{/each}
</div>

<style>
	.chess-board {
		display: grid;
		grid-template-columns: repeat(8, 1fr);
		rows: repeat(8, 1fr);
		border: 1px solid black;
		aspect-ratio: 1;

		.black {
			background: black;
		}
	}
</style>
```
<!-- codeblock:end -->

## Else 块

```svelte
<!--- copy: false  --->
{#each expression as name}...{:else}...{/each}
```

each 块还可以有一个 `{:else}` 子句，当列表为空时渲染。

```svelte
{#each todos as todo}
	<p>{todo.text}</p>
{:else}
	<p>今天没有任务！</p>
{/each}
```
