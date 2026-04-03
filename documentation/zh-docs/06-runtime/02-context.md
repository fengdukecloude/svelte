---
title: Context
---

Context 允许组件访问父组件拥有的值，而无需将它们作为 props 传递（可能通过许多层中间组件，称为"prop drilling"）。

通过使用 `createContext` 创建一对 `[get, set]` 函数，你可以在父组件中设置 context，并在子组件中获取它：

<!-- codeblock:start {"title":"Context","selected":"context.ts"} -->
```svelte
<!--- file: App.svelte --->
<script>
	import Parent from './Parent.svelte';
	import Child from './Child.svelte';
</script>

<Parent>
	<Child />
</Parent>
```

```svelte
<!--- file: Parent.svelte --->
<script>
	import { setUserContext } from './context';

	let { children } = $props();

	setUserContext({ name: 'world' });
</script>

{@render children()}
```

```svelte
<!--- file: Child.svelte --->
<script>
	import { getUserContext } from './context';

	const user = getUserContext();
</script>

<h1>你好 {user.name}，在 Child.svelte 内</h1>
```

```ts
/// file: context.ts
import { createContext } from 'svelte';

interface User {
	name: string;
}

export const [getUserContext, setUserContext] = createContext<User>();
```
<!-- codeblock:end -->

> [!NOTE] `createContext` 在版本 5.40 中添加。如果你使用的是早期版本的 Svelte，则必须使用 `setContext` 和 `getContext`。

当 `Parent.svelte` 不直接知道 `Child.svelte`，而是将其作为 `children` [代码片段](snippet)的一部分渲染时（如上所示），这特别有用。

## `setContext` 和 `getContext`

作为 `createContext` 的替代方案，你可以直接使用 `setContext` 和 `getContext`。父组件使用 `setContext(key, value)` 设置 context……

```svelte
<!--- file: Parent.svelte --->
<script>
	import { setContext } from 'svelte';

	setContext('my-context', '来自 Parent.svelte 的问候');
</script>
```

……子组件使用 `getContext` 检索它：

```svelte
<!--- file: Child.svelte --->
<script>
	import { getContext } from 'svelte';

	const message = getContext('my-context');
</script>

<h1>{message}，在 Child.svelte 内</h1>
```

键（在上面的示例中为 `'my-context'`）和 context 本身可以是任何 JavaScript 值。

> [!NOTE] `createContext` 是首选的，因为它提供了更好的类型安全性，并且不需要使用键。

除了 [`setContext`](svelte#setContext) 和 [`getContext`](svelte#getContext)，Svelte 还公开了 [`hasContext`](svelte#hasContext) 和 [`getAllContexts`](svelte#getAllContexts) 函数。

## 将 context 与状态一起使用

你可以在 context 中存储响应式状态……

<!-- codeblock:start {"title":"Context with state"} -->
```svelte
<!--- file: App.svelte --->
<script>
	import { setCounter } from './context.ts';
	import Child from './Child.svelte';

	let counter = $state({
		count: 0
	});

	setCounter(counter);
</script>

<button onclick={() => counter.count += 1}>
	递增
</button>

<Child />
<Child />
<Child />

<button onclick={() => counter.count = 0}>
	重置
</button>
```

```svelte
<!--- file: Child.svelte --->
<script>
	import { getCounter } from './context.ts';

	const counter = getCounter();
</script>

<p>{counter.count}</p>
```

```ts
/// file: context.ts
import { createContext } from 'svelte';

interface Counter {
	count: number;
}

export const [getCounter, setCounter] = createContext<Counter>();
```
<!-- codeblock:end -->

……但请注意，如果你**重新赋值** `counter` 而不是更新它，你将"断开链接"——换句话说，不要这样做……

```svelte
<button onclick={() => counter = { count: 0 } }>
	重置
</button>
```

……你必须这样做：

```svelte
<button onclick={() => +++counter.count = 0+++}>
	重置
</button>
```

如果你做错了，Svelte 会警告你。

## 组件测试

在编写[组件测试](testing#Unit-and-component-tests-with-Vitest-Component-testing)时，创建一个设置 context 的包装组件以检查使用它的组件的行为可能很有用。从版本 5.49 开始，你可以执行以下操作：

```js
import { mount, unmount } from 'svelte';
import { expect, test } from 'vitest';
import { setUserContext } from './context';
import MyComponent from './MyComponent.svelte';

test('MyComponent', () => {
	function Wrapper(...args) {
		setUserContext({ name: 'Bob' });
		return MyComponent(...args);
	}

	const component = mount(Wrapper, {
		target: document.body
	});

	expect(document.body.innerHTML).toBe('<h1>Hello Bob!</h1>');

	unmount(component);
});
```

这种方法也适用于 [`hydrate`](imperative-component-api#hydrate) 和 [`render`](imperative-component-api#render)。

## 替代全局状态

当你有许多不同组件共享的状态时，你可能会想将其放入自己的模块中，并在需要的地方导入它：

```js
/// file: state.svelte.js
export const myGlobalState = $state({
	user: {
		// ...
	}
	// ...
});
```

在许多情况下这完全没问题，但存在风险：如果你在服务端渲染期间改变状态（这是不鼓励的，但完全可能！）……

```svelte
<!--- file: App.svelte --->
<script>
	import { myGlobalState } from './state.svelte.js';

	let { data } = $props();

	if (data.user) {
		myGlobalState.user = data.user;
	}
</script>
```

……那么数据可能会被**下一个**用户访问。Context 解决了这个问题，因为它不在请求之间共享。
