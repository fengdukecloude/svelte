---
title: 特殊元素（完整版）
---

本文件整合了 05-special-elements 文件夹中的所有内容，方便完整阅读。

---

# <svelte:boundary>

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

此代码片段将在边界首次创建时显示，并将保持可见，直到边界内的所有 [`await`](await-expressions) 表达式都已解析：

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

如果提供了 `failed` 代码片段，它将在边界内抛出错误时渲染，并带有 `error` 和一个重新创建内容的 `reset` 函数：

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

---

# <svelte:window>

```svelte
<svelte:window onevent={handler} />
```

```svelte
<svelte:window bind:prop={value} />
```

`<svelte:window>` 元素允许你向 `window` 对象添加事件监听器，而无需担心在组件销毁时移除它们，或在服务端渲染时检查 `window` 的存在。

此元素只能出现在组件的顶层——它不能位于块或元素内部。

```svelte
<script>
	function handleKeydown(event) {
		alert(`按下了 ${event.key} 键`);
	}
</script>

<svelte:window onkeydown={handleKeydown} />
```

你还可以绑定到以下属性：

- `innerWidth`
- `innerHeight`
- `outerWidth`
- `outerHeight`
- `scrollX`
- `scrollY`
- `online` — `window.navigator.onLine` 的别名
- `devicePixelRatio`

除 `scrollX` 和 `scrollY` 外，所有属性都是只读的。

```svelte
<svelte:window bind:scrollY={y} />
```

> [!NOTE] 请注意，页面不会滚动到初始值以避免可访问性问题。只有对 `scrollX` 和 `scrollY` 绑定变量的后续更改才会导致滚动。如果你有正当理由在组件渲染时滚动，请在 `$effect` 中调用 `scrollTo()`。

---

# <svelte:document>

```svelte
<svelte:document onevent={handler} />
```

```svelte
<svelte:document bind:prop={value} />
```

与 `<svelte:window>` 类似，此元素允许你向 `document` 上的事件添加监听器，例如 `visibilitychange`，这些事件不会在 `window` 上触发。它还允许你在 `document` 上使用[附件](@attach)。

与 `<svelte:window>` 一样，此元素只能出现在组件的顶层，并且绝不能位于块或元素内部。

```svelte
<svelte:document onvisibilitychange={handleVisibilityChange} {@attach someAttachment} />
```

你还可以绑定到以下属性：

- `activeElement`
- `fullscreenElement`
- `pointerLockElement`
- `visibilityState`

所有属性都是只读的。

---

# <svelte:body>

```svelte
<svelte:body onevent={handler} />
```

与 `<svelte:window>` 类似，此元素允许你向 `document.body` 上的事件添加监听器，例如 `mouseenter` 和 `mouseleave`，这些事件不会在 `window` 上触发。它还允许你在 `<body>` 元素上使用[动作](use)。

与 `<svelte:window>` 和 `<svelte:document>` 一样，此元素只能出现在组件的顶层，并且绝不能位于块或元素内部。

```svelte
<svelte:body onmouseenter={handleMouseenter} onmouseleave={handleMouseleave} use:someAction />
```

---

# <svelte:head>

```svelte
<svelte:head>...</svelte:head>
```

此元素使得可以将元素插入到 `document.head` 中。在服务端渲染期间，`head` 内容与主 `body` 内容分开公开。

与 `<svelte:window>`、`<svelte:document>` 和 `<svelte:body>` 一样，此元素只能出现在组件的顶层，并且绝不能位于块或元素内部。

```svelte
<svelte:head>
	<title>你好世界！</title>
	<meta name="description" content="这是 SEO 描述的位置" />
</svelte:head>
```

---

# <svelte:element>

```svelte
<svelte:element this={expression} />
```

`<svelte:element>` 元素允许你渲染在编写时未知的元素，例如因为它来自 CMS。任何存在的属性和事件监听器都将应用于该元素。

唯一支持的绑定是 `bind:this`，因为 Svelte 的内置绑定不适用于通用元素。

如果 `this` 具有空值，则元素及其子元素将不会被渲染。

如果 `this` 是[空元素](https://developer.mozilla.org/en-US/docs/Glossary/Void_element)的名称（例如 `br`）并且 `<svelte:element>` 有子元素，则在开发模式下将抛出运行时错误：

```svelte
<script>
	let tag = $state('hr');
</script>

<svelte:element this={tag}>
	此文本不能出现在 hr 元素内
</svelte:element>
```

Svelte 会尽力从元素的周围环境推断正确的命名空间，但这并不总是可能的。你可以使用 `xmlns` 属性使其显式：

```svelte
<svelte:element this={tag} xmlns="http://www.w3.org/2000/svg" />
```

`this` 需要是有效的 DOM 元素标签，像 `#text` 或 `svelte:head` 这样的东西将不起作用。

---

# <svelte:options>

```svelte
<svelte:options option={value} />
```

`<svelte:options>` 元素提供了一个指定每个组件编译器选项的地方，这些选项在[编译器部分](svelte-compiler#compile)中有详细说明。可能的选项有：

- `runes={true}` — 强制组件进入**符文模式**（参见[遗留 API](legacy-overview) 部分）
- `runes={false}` — 强制组件进入**遗留模式**
- `namespace="..."` — 此组件将使用的命名空间，可以是 "html"（默认）、"svg" 或 "mathml"
- `customElement={...}` — 将此组件编译为自定义元素时使用的[选项](custom-elements#Component-options)。如果传递字符串，则将其用作 `tag` 选项
- `css="injected"` — 组件将内联注入其样式：在服务端渲染期间，它作为 `<style>` 标签注入到 `head` 中，在客户端渲染期间，它通过 JavaScript 加载

> [!LEGACY] 已弃用的选项
> Svelte 4 还包括以下选项。它们在 Svelte 5 中已弃用，并在符文模式下无效。
>
> - `immutable={true}` — 你从不使用可变数据，因此编译器可以进行简单的引用相等性检查来确定值是否已更改
> - `immutable={false}` — 默认值。Svelte 将对可变对象是否已更改更加保守
> - `accessors={true}` — 为组件的 props 添加 getter 和 setter
> - `accessors={false}` — 默认值

```svelte
<svelte:options customElement="my-custom-element" />
```
