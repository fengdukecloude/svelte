---
title: $effect
tags: rune-effect
---

副作用（Effects）是在状态更新时运行的函数，可用于调用第三方库、在 `<canvas>` 元素上绘图或发出网络请求等。它们仅在浏览器中运行，不在服务端渲染期间运行。

一般来说，你**不应该**在副作用内更新状态，因为这会使代码更加复杂，并且经常导致永无止境的更新循环。如果你发现自己这样做，请参阅[何时不使用 `$effect`](#When-not-to-use-$effect) 以了解替代方法。

你可以使用 `$effect` 符文创建副作用（[演示](/playground/untitled#H4sIAAAAAAAAE31S246bMBD9lZF3pSRSAqTVvrCAVPUP2sdSKY4ZwJJjkD0hSVH-vbINuWxXfQH5zMyZc2ZmZLVUaFn6a2R06ZGlHmBrpvnBvb71fWQHVOSwPbf4GS46TajJspRlVhjZU1HqkhQSWPkHIYdXS5xw-Zas3ueI6FRn7qHFS11_xSRZhIxbFtcDtw7SJb1iXaOg5XIFeQGjzyPRaevYNOGZIJ8qogbpe8CWiy_VzEpTXiQUcvPDkSVrSNZz1UlW1N5eLcqmpdXUvaQ4BmqlhZNUCgxuzFHDqUWNAxrYeUM76AzsnOsdiJbrBp_71lKpn3RRbii-4P3f-IMsRxS-wcDV_bL4PmSdBa2wl7pKnbp8DMgVvJm8ZNskKRkEM_OzyOKQFkgqOYBQ3Nq89Ns0nbIl81vMFN-jKoLMTOr-SOBOJS-Z8f5Y6D1wdcR8dFqvEBdetK-PHwj-z-cH8oHPY54wRJ8Ys7iSQ3Bg3VA9azQbmC9k35kKzYa6PoVtfwbbKVnBixBiGn7Pq0rqJoUtHiCZwAM3jdTPWCVtr_glhVrhecIa3vuksJ_b7TqFs4DPyriSjd5IwoNNQaAmNI-ESfR2p8zimzvN1swdCkvJHPH6-_oX8o1SgcIDAAA=)):

```svelte
<script>
	let size = $state(50);
	let color = $state('#ff3e00');

	let canvas;

	$effect(() => {
		const context = canvas.getContext('2d');
		context.clearRect(0, 0, canvas.width, canvas.height);

		// 每当 `color` 或 `size` 改变时，这将重新运行
		context.fillStyle = color;
		context.fillRect(0, 0, size, size);
	});
</script>

<canvas bind:this={canvas} width="100" height="100"></canvas>
```

当 Svelte 运行副作用函数时，它会跟踪访问了哪些状态（和派生状态）（除非在 [`untrack`](svelte#untrack) 内访问），并在该状态稍后改变时重新运行该函数。

> [!NOTE] 如果你难以理解为什么你的 `$effect` 重新运行或没有运行，请参阅[理解依赖项](#Understanding-dependencies)。副作用的触发方式与你在 Svelte 4 中可能习惯的 `$:` 块不同。

### 理解生命周期

你的副作用在组件挂载到 DOM 后运行，并在状态改变后的[微任务](https://developer.mozilla.org/en-US/docs/Web/API/HTML_DOM_API/Microtask_guide)中运行。重新运行是批处理的（即在同一时刻改变 `color` 和 `size` 不会导致两次单独的运行），并且在应用任何 DOM 更新后发生。

你可以在任何地方使用 `$effect`，不仅仅是在组件的顶层，只要它在父副作用运行时被调用。

> [!NOTE] Svelte 内部使用副作用来表示模板中的逻辑和表达式——这就是 `<h1>hello {name}!</h1>` 在 `name` 改变时更新的方式。

副作用可以返回一个**清理函数**，它将在副作用重新运行之前立即运行：

<!-- codeblock:start {"title":"Effect teardown"} -->
```svelte
<!--- file: App.svelte --->
<script>
	let count = $state(0);
	let milliseconds = $state(1000);

	$effect(() => {
		// 每当 `milliseconds` 改变时，这将被重新创建
		const interval = setInterval(() => {
			count += 1;
		}, milliseconds);

		return () => {
			// 如果提供了清理函数，它将运行
			// a) 在副作用重新运行之前立即运行
			// b) 当组件被销毁时
			clearInterval(interval);
		};
	});
</script>

<h1>{count}</h1>

<button onclick={() => (milliseconds *= 2)}>变慢</button>
<button onclick={() => (milliseconds /= 2)}>变快</button>
```
<!-- codeblock:end -->

清理函数也会在副作用被销毁时运行，这发生在其父级被销毁时（例如，组件被卸载）或父副作用重新运行时。

### 理解依赖项

`$effect` 自动捕获在其函数体内**同步**读取的任何响应式值（`$state`、`$derived`、`$props`）（包括通过函数调用间接读取的）并将它们注册为依赖项。当这些依赖项改变时，`$effect` 会安排重新运行。

如果 `$state` 和 `$derived` 直接在 `$effect` 内使用（例如，在创建[响应式类](https://svelte.dev/docs/svelte/$state#Classes)期间），这些值将**不会**被视为依赖项。

**异步**读取的值——在 `await` 之后或在 `setTimeout` 内，例如——不会被跟踪。这里，当 `color` 改变时画布将被重新绘制，但当 `size` 改变时不会（[演示](/playground/untitled#H4sIAAAAAAAAE31T246bMBD9lZF3pWSlBEirfaEQqdo_2PatVIpjBrDkGGQPJGnEv1e2IZfVal-wfHzmzJyZ4cIqqdCy9M-F0blDlnqArZjmB3f72XWRHVCRw_bc4me4aDWhJstSlllhZEfbQhekkMDKfwg5PFvihMvX5OXH_CJa1Zrb0-Kpqr5jkiwC48rieuDWQbqgZ6wqFLRcvkC-hYvnkWi1dWqa8ESQTxFRjfQWsOXiWzmr0sSLhEJu3p1YsoJkNUcdZUnN9dagrBu6FVRQHAM10sJRKgUG16bXcGxQ44AGdt7SDkTDdY02iqLHnJVU6hedlWuIp94JW6Tf8oBt_8GdTxlF0b4n0C35ZLBzXb3mmYn3ae6cOW74zj0YVzDNYXRHFt9mprNgHfZSl6mzml8CMoLvTV6wTZIUDEJv5us2iwMtiJRyAKG4tXnhl8O0yhbML0Wm-B7VNlSSSd31BG7z8oIZZ6dgIffAVY_5xdU9Qrz1Bnx8fCfwtZ7v8Qc9j3nB8PqgmMWlHIID6-bkVaPZwDySfWtKNGtquxQ23Qlsq2QJT0KIqb8dL0up6xQ2eIBkAg_c1FI_YqW0neLnFCqFpwmreedJYT7XX8FVOBfwWRhXstZrSXiwKQjUhOZeMIleb5JZfHWn2Yq5pWEpmR7Hv-N_wEqT8hEEAAA=)):

```ts
// @filename: index.ts
declare let canvas: {
	width: number;
	height: number;
	getContext(type: '2d', options?: CanvasRenderingContext2DSettings): CanvasRenderingContext2D;
};
declare let color: string;
declare let size: number;

// ---cut---
$effect(() => {
	const context = canvas.getContext('2d');
	context.clearRect(0, 0, canvas.width, canvas.height);

	// 每当 `color` 改变时，这将重新运行...
	context.fillStyle = color;

	setTimeout(() => {
		// ...但当 `size` 改变时不会
		context.fillRect(0, 0, size, size);
	}, 0);
});
```

副作用仅在它读取的对象改变时重新运行，而不是在对象内部的属性改变时。（如果你想在开发时观察对象**内部**的更改，可以使用 [`$inspect`]($inspect)。）

```svelte
<script>
	let state = $state({ value: 0 });
	let derived = $derived({ value: state.value * 2 });

	// 这将运行一次，因为 `state` 从未被重新赋值（只是被修改）
	$effect(() => {
		state;
	});

	// 每当 `state.value` 改变时，这将运行...
	$effect(() => {
		state.value;
	});

	// ...这也会，因为 `derived` 每次都是一个新对象
	$effect(() => {
		derived;
	});
</script>

<button onclick={() => (state.value += 1)}>
	{state.value}
</button>

<p>{state.value} 的两倍是 {derived.value}</p>
```

副作用仅依赖于它上次运行时读取的值。这对具有条件代码的副作用有有趣的影响。

例如，如果下面代码片段中的 `condition` 为 `true`，`if` 块内的代码将运行，`color` 将被评估。这意味着 `condition` 或 `color` 的更改[都会导致副作用重新运行](/playground/untitled#H4sIAAAAAAAAE21RQW6DMBD8ytaNBJHaJFLViwNIVZ8RcnBgXVk1xsILTYT4e20TQg89IOPZ2fHM7siMaJBx9tmaWpFqjQNlAKXEihx7YVJpdIyfRkY3G4gB8Pi97cPanRtQU8AuwuF_eNUaQuPlOMtc1SlLRWlKUo1tOwJflUikQHZtA0klzCDc64Imx0ANn8bInV1CDhtHgjClrsftcSXotluLybOUb3g4JJHhOZs5WZpuIS9gjNqkJKQP5e2ClrR4SMdZ13E4xZ8zTPOTJU2A2uE_PQ9COCI926_hTVarIU4hu_REPlBrKq2q73ycrf1N-vS4TMUsulaVg3EtR8H9rFgsg8uUsT1B2F9eshigZHBRpuaD0D3mY8Qm2BfB5N2YyRzdNEYVDy0Ja-WsFjcOUuP1HvFLWA6H3XuHTUSmmDV2--0TXonxsKbp7G9C6R__NONS-MFNvxj_d6mBAgAA)。

相反，如果 `condition` 为 `false`，`color` 将不会被评估，副作用将**仅**在 `condition` 改变时再次运行。

```ts
// @filename: ambient.d.ts
declare module 'canvas-confetti' {
	interface ConfettiOptions {
		colors: string[];
	}

	function confetti(opts?: ConfettiOptions): void;
	export default confetti;
}

// @filename: index.js
// ---cut---
import confetti from 'canvas-confetti';

let condition = $state(true);
let color = $state('#ff3e00');

$effect(() => {
	if (condition) {
		confetti({ colors: [color] });
	} else {
		confetti();
	}
});
```

## `$effect.pre`

在极少数情况下，你可能需要在 DOM 更新**之前**运行代码。为此，我们可以使用 `$effect.pre` 符文：

```svelte
<script>
	import { tick } from 'svelte';

	let div = $state();
	let messages = $state([]);

	// ...

	$effect.pre(() => {
		if (!div) return; // 尚未挂载

		// 引用 `messages` 数组长度，以便每当它改变时此代码重新运行
		messages.length;

		// 添加新消息时自动滚动
		if (div.offsetHeight + div.scrollTop > div.scrollHeight - 20) {
			tick().then(() => {
				div.scrollTo(0, div.scrollHeight);
			});
		}
	});
</script>

<div bind:this={div}>
	{#each messages as message}
		<p>{message}</p>
	{/each}
</div>
```

除了时机之外，`$effect.pre` 的工作方式与 `$effect` 完全相同。

## `$effect.tracking`

`$effect.tracking` 符文是一个高级功能，它告诉你代码是否在跟踪上下文中运行，例如在副作用中或在模板内：

<!-- codeblock:start {"title":"$effect.tracking()"} -->
```svelte
<!--- file: App.svelte --->
<script>
	console.log('在组件设置中：', $effect.tracking()); // false

	$effect(() => {
		console.log('在副作用中：', $effect.tracking()); // true
	});
</script>

<p>在模板中：{$effect.tracking()}</p> <!-- true -->
```
<!-- codeblock:end -->

它用于实现像 [`createSubscriber`](/docs/svelte/svelte-reactivity#createSubscriber) 这样的抽象，它将创建监听器来更新响应式值，但**仅**当这些值被跟踪时（而不是例如在事件处理器内读取）。

## `$effect.pending`

在组件中使用 [`await`](await-expressions) 时，`$effect.pending()` 符文告诉你当前[边界](svelte-boundary)中有多少个 promise 处于待定状态，不包括子边界：

<!-- codeblock:start {"title":"$effect.pending"} -->
```svelte
<!--- file: App.svelte --->
<script>
	let a = $state(1);
	let b = $state(2);

	async function add(a, b) {
		await new Promise((f) => setTimeout(f, 500)); // 人为延迟
		return a + b;
	}
</script>

<button onclick={() => a++}>a++</button>
<button onclick={() => b++}>b++</button>

<p>{a} + {b} = {await add(a, b)}</p>

{#if $effect.pending()}
	<p>待定的 promise：{$effect.pending()}</p>
{/if}
```
<!-- codeblock:end -->

## `$effect.root`

`$effect.root` 符文是一个高级功能，它创建一个不自动清理的非跟踪作用域。这对于你想要手动控制的嵌套副作用很有用。此符文还允许在组件初始化阶段之外创建副作用。

```js
const destroy = $effect.root(() => {
	$effect(() => {
		// 设置
	});

	return () => {
		// 清理
	};
});

// 稍后...
destroy();
```

## 何时不使用 `$effect`

一般来说，`$effect` 最好被视为一种逃生舱——对于分析和直接 DOM 操作等事情很有用——而不是你应该经常使用的工具。特别是，避免使用它来同步状态。不要这样做……

```svelte
<script>
	let count = $state(0);
	let doubled = $state();

	// 不要这样做！
	$effect(() => {
		doubled = count * 2;
	});
</script>
```

……而是这样做：

```svelte
<script>
	let count = $state(0);
	let doubled = $derived(count * 2);
</script>
```

> [!NOTE] 对于比像 `count * 2` 这样的简单表达式更复杂的事情，你也可以使用 `$derived.by`。

如果你使用副作用是因为你想能够重新赋值派生值（例如构建乐观 UI），请注意从 Svelte 5.25 开始，[派生可以直接覆盖]($derived#Overriding-derived-values)。

你可能会想用副作用做一些复杂的事情来将一个值链接到另一个值。以下示例显示了两个相互连接的"花费的钱"和"剩余的钱"输入。如果你更新一个，另一个应该相应更新。不要为此使用副作用……

<!-- codeblock:start {"title":"在副作用中设置状态（不要这样做！）"} -->
```svelte
<!--- file: App.svelte --->
<script>
	const total = 100;
	let spent = $state(0);
	let left = $state(total);

	$effect(() => {
		left = total - spent;
	});

	$effect(() => {
		spent = total - left;
	});
</script>

<label>
	<input type="range" bind:value={spent} max={total} />
	{spent}/{total} 已花费
</label>

<label>
	<input type="range" bind:value={left} max={total} />
	{left}/{total} 剩余
</label>

<style>
	label {
		display: flex;
		gap: 0.5em;
	}
</style>
```
<!-- codeblock:end -->

……使用 `oninput` 回调或——更好的是——尽可能使用[函数绑定](bind#Function-bindings)：

<!-- codeblock:start {"title":"使用函数绑定设置状态"} -->
```svelte
<!--- file: App.svelte --->
<script>
	const total = 100;
	let spent = $state(0);
	let left = $derived(total - spent);

	function updateLeft(left) {
		spent = total - left;
	}
</script>

<label>
	<input type="range" bind:value={spent} max={total} />
	{spent}/{total} 已花费
</label>

<label>
	<input type="range" bind:value={() => left, updateLeft} max={total} />
	{left}/{total} 剩余
</label>

<style>
	label {
		display: flex;
		gap: 0.5em;
	}
</style>
```
<!-- codeblock:end -->

如果你绝对必须在副作用中更新 `$state` 并遇到无限循环，因为你读取和写入相同的 `$state`，请使用 [untrack](svelte#untrack)。
