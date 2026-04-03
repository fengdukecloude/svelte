---
title: <svelte:boundary>
---

```svelte
<svelte:boundary onerror={handler}>...</svelte:boundary>
```

> [!NOTE]
> 此功能在 5.3.0 中添加

边界允许你"隔离"应用的部分，以便你可以：

- 提供在 [`await`](await-expressions) 表达式首次解析时应显示的 UI
- 处理在渲染期间或运行副作用时发生的错误，并提供在发生错误时应渲染的 UI

如果边界处理错误（使用 `failed` 代码片段或 `onerror` 处理器，或两者兼有），其现有内容将被移除。

> [!NOTE] 在渲染过程之外发生的错误（例如，在事件处理器中或在 `setTimeout` 或异步工作之后）**不会**被错误边界捕获。

## 属性

要使边界执行任何操作，必须提供以下一个或多个属性。

### `pending`

此代码片段将在边界首次创建时显示，并将保持可见，直到边界内的所有 [`await`](await-expressions) 表达式都已解析（[演示](/playground/untitled#H4sIAAAAAAAAE21QQW6DQAz8ytY9BKQVpFdKkPqDHnorPWzAaSwt3tWugUaIv1eE0KpKD5as8YxnNBOw6RAKKOOAVrA4up5bEy6VGknOyiO3xJ8qMnmPAhpOZDFC8T6BXPyiXADQ258X77P1FWg4moj_4Y1jQZZ49W0CealqruXUcyPkWLVozQXbZDC2R606spYiNo7bqA7qab_fp2paFLUElD6wYhzVa3AdRUySgNHZAVN1qDZaLRHljTp0vSTJ9XJjrSbpX5f0eZXN6zLXXOa_QfmurIVU-moyoyH5ib87o7XuYZfOZe6vnGWmx1uZW7lJOq9upa-sMwuUZdkmmfIbfQ1xZwwaBL8ECgk9zh8axJAdiVsoTsZGnL8Bg4tX_OMBAAA=)）：

```svelte
<svelte:boundary>
	<p>{await delayed('hello!')}</p>

	{#snippet pending()}
		<p>加载中...</p>
	{/snippet}
</svelte:boundary>
```

`pending` 代码片段**不会**在后续异步更新时显示——对于这些，你可以使用 [`$effect.pending()`]($effect#$effect.pending)。

> [!NOTE] 在 [playground](/playground) 中，你的应用在带有空 pending 代码片段的边界内渲染，以便你可以在不创建边界的情况下使用 `await`。


### `failed`

如果提供了 `failed` 代码片段，它将在边界内抛出错误时渲染，并带有 `error` 和一个重新创建内容的 `reset` 函数（[演示](/playground/hello-world#H4sIAAAAAAAAE3VRy26DMBD8lS2tFCIh6JkAUlWp39Cq9EBg06CAbdlLArL87zWGKk8ORnhmd3ZnrD1WtOjFXqKO2BDGW96xqpBD5gXerm5QefG39mgQY9EIWHxueRMinLosti0UPsJLzggZKTeilLWgLGc51a3gkuCjKQ7DO7cXZotgJ3kLqzC6hmex1SZnSXTWYHcrj8LJjWTk0PHoZ8VqIdCOKayPykcpuQxAokJaG1dGybYj4gw4K5u6PKTasSbjXKgnIDlA8VvUdo-pzonraBY2bsH7HAl78mKSHZpgIcuHjq9jXSpZSLixRlveKYQUXhQVhL6GPobXAAb7BbNeyvNUs4qfRg3OnELLj5hqH9eQZqCnoBwR9lYcQxuVXeBzc8kMF8yXY4yNJ5oGiUzP_aaf_waTRGJib5_Ad3P_vbCuaYxzeNpbU0eUMPAOKh7Yw1YErgtoXyuYlPLzc10_xo_5A91zkQL_AgAA)）：

```svelte
<svelte:boundary>
	<FlakyComponent />

	{#snippet failed(error, reset)}
		<button onclick={reset}>哎呀！再试一次</button>
	{/snippet}
</svelte:boundary>
```

> [!NOTE]
> 与[传递给组件的代码片段](snippet#Passing-snippets-to-components)一样，`failed` 代码片段可以显式作为属性传递……
>
> ```svelte
> <svelte:boundary {failed}>...</svelte:boundary>
> ```
>
> ……或通过直接在边界内声明它来隐式传递，如上面的示例所示。

### `onerror`

如果提供了 `onerror` 函数，它将使用相同的两个 `error` 和 `reset` 参数调用。这对于使用错误报告服务跟踪错误很有用……

```svelte
<svelte:boundary onerror={(e) => report(e)}>
	...
</svelte:boundary>
```

……或在边界本身之外使用 `error` 和 `reset`：

```svelte
<script>
	let error = $state(null);
	let reset = $state(() => {});

	function onerror(e, r) {
		error = e;
		reset = r;
	}
</script>

<svelte:boundary {onerror}>
	<FlakyComponent />
</svelte:boundary>

{#if error}
	<button onclick={() => {
		error = null;
		reset();
	}}>
		哎呀！再试一次
	</button>
{/if}
```

如果在 `onerror` 函数内发生错误（或者如果你重新抛出错误），它将由父边界处理（如果存在）。

## 使用 `transformError`

默认情况下，错误边界在服务器上无效——如果在渲染期间发生错误，整个渲染将失败。

从 5.51 开始，你可以通过使用 `transformError` 函数调用 [`render(...)`](imperative-component-api#render) 来控制具有 `failed` 代码片段的边界的此行为。

> [!NOTE] 如果你通过框架（如 SvelteKit）使用 Svelte，你很可能无法直接访问 `render(...)` 调用——框架必须代表你配置 `transformError`。SvelteKit 将在不久的将来通过 [`handleError`](../kit/hooks#Shared-hooks-handleError) 钩子添加对此的支持。

`transformError` 函数必须返回一个可 JSON 字符串化的对象，该对象将用于渲染 `failed` 代码片段。此对象将被序列化并用于在浏览器中水合代码片段：

```js
// @errors: 1005
import { render } from 'svelte/server';
import App from './App.svelte';

const { head, body } = await render(App, {
	transformError: (error) => {
		// 记录原始错误，包括堆栈跟踪...
		console.error(error);

		// ...并返回一个经过清理的用户友好错误
		// 以在 `failed` 代码片段中显示
		return {
			message: '发生了错误！'
		};
	};
});
```

如果 `transformError` 抛出（或重新抛出）错误，整个 `render(...)` 将因该错误而失败。

> [!NOTE] 在服务端渲染期间发生的错误可能在 `message` 和 `stack` 中包含敏感信息。建议对这些进行编辑，而不是将它们未经修改地发送到浏览器。

如果边界有 `onerror` 处理器，它将在水合时使用反序列化的错误对象调用。

[`mount`](imperative-component-api#mount) 和 [`hydrate`](imperative-component-api#hydrate) 函数也接受 `transformError` 选项，默认为恒等函数。与 `render` 一样，此函数在将渲染时错误传递给 `failed` 代码片段或 `onerror` 处理器之前对其进行转换。
