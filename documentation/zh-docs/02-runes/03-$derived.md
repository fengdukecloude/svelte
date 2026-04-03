---
title: $derived
tags: rune-derived
---

派生状态使用 `$derived` 符文声明：

```svelte
<script>
	let count = $state(0);
	let doubled = $derived(count * 2);
</script>

<button onclick={() => count++}>
	{doubled}
</button>

<p>{count} 的两倍是 {doubled}</p>
```

`$derived(...)` 内的表达式应该没有副作用。Svelte 将禁止在派生表达式内进行状态更改（例如 `count++`）。

与 `$state` 一样，你可以将类字段标记为 `$derived`。

> [!NOTE] Svelte 组件中的代码在创建时只执行一次。如果没有 `$derived` 符文，即使 `count` 改变，`doubled` 也会保持其原始值。

## `$derived.by`

有时你需要创建不适合短表达式的复杂派生。在这些情况下，你可以使用 `$derived.by`，它接受一个函数作为参数。

```svelte
<script>
	let numbers = $state([1, 2, 3]);
	let total = $derived.by(() => {
		let total = 0;
		for (const n of numbers) {
			total += n;
		}
		return total;
	});
</script>

<button onclick={() => numbers.push(numbers.length + 1)}>
	{numbers.join(' + ')} = {total}
</button>
```

本质上，`$derived(expression)` 等同于 `$derived.by(() => expression)`。

## 理解依赖项

在 `$derived` 表达式（或 `$derived.by` 函数体）内同步读取的任何内容都被视为派生状态的**依赖项**。当状态改变时，派生将被标记为**脏**，并在下次读取时重新计算。

此外，如果表达式包含 [`await`](await-expressions)，Svelte 会转换它，使得 `await` **之后**的任何状态也会被跟踪——换句话说，在这种情况下……

```js
let a = Promise.resolve(1);
let b = 2;
// ---cut---
let total = $derived(await a + b);
```

……`a` 和 `b` 都会被跟踪，即使 `b` 只在 `a` 解析后才被读取，在初始执行之后。（这不适用于表达式调用的函数中的 `await`，仅适用于表达式本身。）

要将一段状态排除在被视为依赖项之外，请使用 [`untrack`](svelte#untrack)。

## 覆盖派生值

派生表达式在其依赖项改变时重新计算，但你可以通过重新赋值来临时覆盖它们的值（除非它们用 `const` 声明）。这对于**乐观 UI** 之类的事情很有用，其中值派生自"真实来源"（例如来自服务器的数据），但你希望向用户显示即时反馈：

```svelte
<script>
	let { post, like } = $props();

	let likes = $derived(post.likes);

	async function onclick() {
		// 立即增加 `likes` 计数...
		likes += 1;

		// 并告诉服务器，服务器最终会更新 `post`
		try {
			await like();
		} catch {
			// 失败了！回滚更改
			likes -= 1;
		}
	}
</script>

<button {onclick}>🧡 {likes}</button>
```

> [!NOTE] 在 Svelte 5.25 之前，派生是只读的。

## 派生和响应式

与 `$state`（将对象和数组转换为[深度响应式代理]($state#Deep-state)）不同，`$derived` 值保持原样。例如，[在这种情况下](/playground/untitled#H4sIAAAAAAAAE4VU22rjMBD9lUHd3aaQi9PdstS1A3t5XvpQ2Ic4D7I1iUUV2UjjNMX431eS7TRdSosxgjMzZ45mjt0yzffIYibvy0ojFJWqDKCQVBk2ZVup0LJ43TJ6rn2aBxw-FP2o67k9oCKP5dziW3hRaUJNjoYltjCyplWmM1JIIAn3FlL4ZIkTTtYez6jtj4w8WwyXv9GiIXiQxLVs9pfTMR7EuoSLIuLFbX7Z4930bZo_nBrD1bs834tlfvsBz9_SyX6PZXu9XaL4gOWn4sXjeyzftv4ZWfyxubpzxzg6LfD4MrooxELEosKCUPigQCMPKCZh0OtQE1iSxcsmdHuBvCiHZXALLXiN08EL3RRkaJ_kDVGle0HcSD5TPEeVtj67O4Nrg9aiSNtBY5oODJkrL5QsHtN2cgXp6nSJMWzpWWGasdlsGEMbzi5jPr5KFr0Ep7pdeM2-TCelCddIhDxAobi1jqF3cMaC1RKp64bAW9iFAmXGIHfd4wNXDabtOLN53w8W53VvJoZLh7xk4Rr3CoL-UNoLhWHrT1JQGcM17u96oES5K-kc2XOzkzqGCKL5De79OUTyyrg1zgwXsrEx3ESfx4Bz0M5UjVMHB24mw9SuXtXFoN13fYKOM1tyUT3FbvbWmSWCZX2Er-41u5xPoml45svRahl9Wb9aasbINJixDZwcPTbyTLZSUsAvrg_cPuCR7s782_WU8343Y72Qtlb8OYatwuOQvuN13M_hJKNfxann1v1U_B1KZ_D_mzhzhz24fw85CSz2irtN9w9HshBK7AQAAA==)……

```js
// @errors: 7005
let items = $state([ /*...*/ ]);

let index = $state(0);
let selected = $derived(items[index]);
```

……你可以更改（或 `bind:` 到）`selected` 的属性，它会影响底层的 `items` 数组。如果 `items` **不是**深度响应式的，修改 `selected` 将没有效果。

## 解构

如果你在 `$derived` 声明中使用解构，生成的变量都将是响应式的——这……

```js
function stuff() { return { a: 1, b: 2, c: 3 } }
// ---cut---
let { a, b, c } = $derived(stuff());
```

……大致等同于：

```js
function stuff() { return { a: 1, b: 2, c: 3 } }
// ---cut---
let _stuff = $derived(stuff());
let a = $derived(_stuff.a);
let b = $derived(_stuff.b);
let c = $derived(_stuff.c);
```

## 更新传播

Svelte 使用一种称为**推拉响应式**的机制——当状态更新时，依赖于该状态的所有内容（无论是直接还是间接）都会立即收到更改通知（"推"），但派生值直到实际读取时才会重新评估（"拉"）。

如果派生的新值与其先前值在引用上相同，则会跳过下游更新。换句话说，Svelte 只会在 `large` 改变时更新按钮内的文本，而不会在 `count` 改变时更新，即使 `large` 依赖于 `count`：

```svelte
<script>
	let count = $state(0);
	let large = $derived(count > 10);
</script>

<button onclick={() => count++}>
	{large}
</button>
```
