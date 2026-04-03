---
title: await
---

从 Svelte 5.36 开始，你可以在组件中的三个以前不可用的地方使用 `await` 关键字：

- 在组件的 `<script>` 顶层
- 在 `$derived(...)` 声明内
- 在你的标记内

此功能目前是实验性的，你必须通过在[配置](/docs/kit/configuration) Svelte 的地方（通常是 `svelte.config.js`）添加 `experimental.async` 选项来选择加入：

```js
/// file: svelte.config.js
export default {
	compilerOptions: {
		experimental: {
			async: true
		}
	}
};
```

实验性标志将在 Svelte 6 中移除。

## 同步更新

当 `await` 表达式依赖于特定的状态时，对该状态的更改将不会反映在 UI 中，直到异步工作完成，以便 UI 不会处于不一致的状态。换句话说，在这样的示例中……

<!-- codeblock:start {"title":"同步更新"} -->
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

<input type="number" bind:value={a}>
<input type="number" bind:value={b}>

<p>{a} + {b} = {await add(a, b)}</p>
```
<!-- codeblock:end -->

……如果你增加 `a`，`<p>` 的内容**不会**立即更新为这样——

```html
<p>2 + 2 = 3</p>
```

——相反，当 `add(a, b)` 解析时，文本将更新为 `2 + 2 = 4`。

更新可以重叠——快速更新将在较早的慢速更新仍在进行时反映在 UI 中。

## 并发

Svelte 将尽可能并行地执行异步工作。例如，如果你在标记中有两个 `await` 表达式……

```svelte
<p>{await one(x)}</p>
<p>{await two(y)}</p>
```

……两个函数将同时运行，因为它们是独立的表达式，即使它们**视觉上**是顺序的。

这不适用于 `<script>` 内或异步函数内的顺序 `await` 表达式——这些像任何其他异步 JavaScript 一样运行。一个例外是独立的 `$derived` 表达式将独立更新，即使它们在首次创建时将顺序运行：

```js
/** @param {number} x */
async function one(x) { return x; }
/** @param {number} y */
async function two(y) { return y; }
let x = $state(1);
let y = $state(2);
// ---cut---
// `b` 在 `a` 解析之前不会被创建，
// 但一旦创建，它们将独立更新
// 即使 `x` 和 `y` 同时更新
let a = $derived(await one(x));
let b = $derived(await two(y));
```

> [!NOTE] 如果你编写这样的代码，期待 Svelte 给你一个 [`await_waterfall`](runtime-warnings#Client-warnings-await_waterfall) 警告

## 指示加载状态

要渲染占位符 UI，你可以将内容包装在带有 [`pending`](svelte-boundary#Properties-pending) 代码片段的 `<svelte:boundary>` 中。这将在边界首次创建时显示，但不会在后续更新时显示，后续更新是全局协调的。

在边界的内容首次解析并替换 `pending` 代码片段后，你可以使用 [`$effect.pending()`]($effect#$effect.pending) 检测后续的异步工作。例如，这是你用来在表单字段旁边显示"我们正在异步验证你的输入"旋转器的方法。

你还可以使用 [`settled()`](svelte#settled) 获取一个在当前更新完成时解析的 promise：

```js
let color = 'red';
let answer = -1;
let updating = false;
// ---cut---
import { tick, settled } from 'svelte';

async function onclick() {
	updating = true;

	// 如果没有这个，对 `updating` 的更改将
	// 与其他更改分组，这意味着它
	// 不会反映在 UI 中
	await tick();

	color = 'octarine';
	answer = 42;

	await settled();

	// 任何受 `color` 或 `answer` 影响的更新
	// 现在已经应用
	updating = false;
}
```

## 错误处理

`await` 表达式中的错误将冒泡到最近的[错误边界](svelte-boundary)。

## 服务端渲染

Svelte 支持使用 `render(...)` API 的异步服务端渲染（SSR）。要使用它，只需 await 返回值：

```js
/// file: server.js
import { render } from 'svelte/server';
import App from './App.svelte';

const { head, body } = await render(App);
```

> [!NOTE] 如果你使用的是像 SvelteKit 这样的框架，这是代表你完成的。

如果在 SSR 期间遇到带有 `pending` 代码片段的 `<svelte:boundary>`，该代码片段将被渲染，而其余内容将被忽略。在没有 `pending` 代码片段的边界之外遇到的所有 `await` 表达式将在 `await render(...)` 返回之前解析并渲染其内容。

> [!NOTE] 将来，我们计划添加一个在后台渲染内容的流式实现。

## 分叉

在 5.42 中添加的 [`fork(...)`](svelte#fork) API 使得可以运行你**期望**在不久的将来发生的 `await` 表达式。这主要用于像 SvelteKit 这样的框架，以在用户（例如）表示导航意图时实现预加载。

```svelte
<script>
	import { fork } from 'svelte';
	import Menu from './Menu.svelte';

	let open = $state(false);

	/** @type {import('svelte').Fork | null} */
	let pending = null;

	function preload() {
		pending ??= fork(() => {
			open = true;
		});
	}

	function discard() {
		pending?.discard();
		pending = null;
	}
</script>

<button
	onfocusin={preload}
	onfocusout={discard}
	onpointerenter={preload}
	onpointerleave={discard}
	onclick={() => {
		pending?.commit();
		pending = null;

		// 以防 `pending` 不存在
		// （如果存在，这是一个无操作）
		open = true;
	}}
>打开菜单</button>

{#if open}
	<!-- 此组件内的任何异步工作将在
	     分叉创建后立即开始 -->
	<Menu onclose={() => open = false} />
{/if}
```

## 注意事项

作为实验性功能，`await` 的处理方式（以及相关 API，如 `$effect.pending()`）的细节可能会在 semver 主要版本之外发生破坏性更改，尽管我们打算将此类更改保持在最低限度。

## 破坏性更改

当 `experimental.async` 选项为 `true` 时，副作用以略有不同的顺序运行。具体来说，像 `{#if ...}` 和 `{#each ...}` 这样的**块**副作用现在在同一组件中的 `$effect.pre` 或 `beforeUpdate` 之前运行，这意味着在[极少数情况下](/playground/untitled#H4sIAAAAAAAAE22R3VLDIBCFX2WLvUhnTHsf0zre-Q7WmfwtFV2BgU1rJ5N3F0jaOuoVcPbw7VkYhK4_URTiGYkMnIyjDjLsFGO3EvdCKkIvipdB8NlGXxSCPt96snbtj0gctab2-J_eGs2oOWBE6VunLO_2es-EDKZ5x5ZhC0vPNWM2gHXGouNzAex6hHH1cPHil_Lsb95YT9VQX6KUAbS2DrNsBdsdDFHe8_XSYjH1SrhELTe3MLpsemajweiWVPuxHSbKNd-8eQTdE0EBf4OOaSg2hwNhhE_ABB_ulJzjj9FULvIcqgm5vnAqUB7wWFMfhuugQWkcAr8hVD-mq8D12kOep24J_IszToOXdveGDsuNnZwbJUNlXsKnhJdhUcTo42s41YpOSneikDV5HL8BktM6yRcCAAA=)，可能会更新一个不应再存在的块，但仅当你在副作用内更新状态时，[你应该避免这样做]($effect#When-not-to-use-$effect)。
