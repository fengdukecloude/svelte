---
title: Store
---

<!-- - how to use
- how to write
- TODO should the details for the store methods belong to the reference section? -->

**store** 是一个对象，它通过简单的 **store 契约**允许对值进行响应式访问。[`svelte/store` 模块](../svelte-store)包含满足此契约的最小 store 实现。

每当你在组件内引用 store 时，你可以通过在其前面加上 `$` 字符来访问其值。这会导致 Svelte 声明带前缀的变量，在组件初始化时订阅 store，并在适当时取消订阅。

对 `$` 前缀变量的赋值要求该变量是可写 store，并将导致调用 store 的 `.set` 方法。

请注意，store 必须在组件的顶层声明——例如，不能在 `if` 块或函数内部。

局部变量（不代表 store 值）**不得**具有 `$` 前缀。

```svelte
<script>
	import { writable } from 'svelte/store';

	const count = writable(0);
	console.log($count); // 记录 0

	count.set(1);
	console.log($count); // 记录 1

	$count = 2;
	console.log($count); // 记录 2
</script>
```

## 何时使用 store

在 Svelte 5 之前，store 是创建跨组件响应式状态或提取逻辑的首选解决方案。使用符文后，这些用例已大大减少。

- 在提取逻辑时，最好利用符文的通用响应性：你可以在组件顶层之外使用符文，甚至将它们放入 JavaScript 或 TypeScript 文件中（使用 `.svelte.js` 或 `.svelte.ts` 文件扩展名）
- 在创建共享状态时，你可以创建一个包含所需值的 `$state` 对象，然后操作该状态

```ts
/// file: state.svelte.js
export const userState = $state({
	name: 'name',
	/* ... */
});
```

```svelte
<!--- file: App.svelte --->
<script>
	import { userState } from './state.svelte.js';
</script>

<p>用户名：{userState.name}</p>
<button onclick={() => {
	userState.name = '新名称';
}}>
	更改名称
</button>
```

当你有复杂的异步数据流或需要更手动地控制更新值或监听更改时，store 仍然是一个很好的解决方案。如果你熟悉 RxJs 并想重用该知识，`$` 也会对你很有用。

## svelte/store

`svelte/store` 模块包含满足 store 契约的最小 store 实现。它提供了从外部更新 store、只能从内部更新 store 以及组合和派生 store 的方法。

### `writable`

创建一个 store 的函数，其值可以从"外部"组件设置。它被创建为一个带有额外 `set` 和 `update` 方法的对象。

`set` 是一个接受一个参数的方法，该参数是要设置的值。如果 store 值尚未等于该参数的值，则 store 值将设置为该参数的值。

`update` 是一个接受一个参数的方法，该参数是一个回调。回调将现有 store 值作为其参数，并返回要设置到 store 的新值。

```js
/// file: store.js
import { writable } from 'svelte/store';

const count = writable(0);

count.subscribe((value) => {
	console.log(value);
}); // 记录 '0'

count.set(1); // 记录 '1'

count.update((n) => n + 1); // 记录 '2'
```

如果将函数作为第二个参数传递，则当订阅者数量从零变为一时（但不是从一变为二等）将调用它。该函数将传递一个 `set` 函数（更改 store 的值）和一个 `update` 函数（其工作方式类似于 store 上的 `update` 方法，接受一个回调以从旧值计算 store 的新值）。它必须返回一个 `stop` 函数，该函数在订阅者计数从一变为零时调用。

```js
/// file: store.js
import { writable } from 'svelte/store';

const count = writable(0, () => {
	console.log('有订阅者了');
	return () => console.log('没有订阅者了');
});

count.set(1); // 什么也不做

const unsubscribe = count.subscribe((value) => {
	console.log(value);
}); // 记录 '有订阅者了'，然后 '1'

unsubscribe(); // 记录 '没有订阅者了'
```

请注意，当 `writable` 被销毁时（例如刷新页面时），其值会丢失。但是，你可以编写自己的逻辑将值同步到例如 `localStorage`。

### `readable`

创建一个值无法从"外部"设置的 store，第一个参数是 store 的初始值，`readable` 的第二个参数与 `writable` 的第二个参数相同。

```ts
import { readable } from 'svelte/store';

const time = readable(new Date(), (set) => {
	set(new Date());

	const interval = setInterval(() => {
		set(new Date());
	}, 1000);

	return () => clearInterval(interval);
});

const ticktock = readable('tick', (set, update) => {
	const interval = setInterval(() => {
		update((sound) => (sound === 'tick' ? 'tock' : 'tick'));
	}, 1000);

	return () => clearInterval(interval);
});
```

### `derived`

从一个或多个其他 store 派生 store。当第一个订阅者订阅时，回调最初运行，然后每当 store 依赖项更改时运行。

在最简单的版本中，`derived` 接受单个 store，回调返回派生值。

```ts
// @filename: ambient.d.ts
import { type Writable } from 'svelte/store';

declare global {
	const a: Writable<number>;
}

export {};

// @filename: index.ts
// ---cut---
import { derived } from 'svelte/store';

const doubled = derived(a, ($a) => $a * 2);
```

回调可以通过接受第二个参数 `set` 和可选的第三个参数 `update` 来异步设置值，并在适当时调用其中一个或两个。

在这种情况下，你还可以向 `derived` 传递第三个参数——在首次调用 `set` 或 `update` 之前派生 store 的初始值。如果未指定初始值，则 store 的初始值将为 `undefined`。

```ts
// @filename: ambient.d.ts
import { type Writable } from 'svelte/store';

declare global {
	const a: Writable<number>;
}

export {};

// @filename: index.ts
// @errors: 18046 2769 7006
// ---cut---
import { derived } from 'svelte/store';

const delayed = derived(
	a,
	($a, set) => {
		setTimeout(() => set($a), 1000);
	},
	2000
);

const delayedIncrement = derived(a, ($a, set, update) => {
	set($a);
	setTimeout(() => update((x) => x + 1), 1000);
	// 每次 $a 产生一个值，这会产生两个值，
	// 立即是 $a，然后一秒后是 $a + 1
});
```

如果你从回调返回一个函数，它将在 a) 回调再次运行时，或 b) 最后一个订阅者取消订阅时调用。

```ts
// @filename: ambient.d.ts
import { type Writable } from 'svelte/store';

declare global {
	const frequency: Writable<number>;
}

export {};

// @filename: index.ts
// ---cut---
import { derived } from 'svelte/store';

const tick = derived(
	frequency,
	($frequency, set) => {
		const interval = setInterval(() => {
			set(Date.now());
		}, 1000 / $frequency);

		return () => {
			clearInterval(interval);
		};
	},
	2000
);
```

在这两种情况下，都可以将参数数组作为第一个参数传递，而不是单个 store。

```ts
// @filename: ambient.d.ts
import { type Writable } from 'svelte/store';

declare global {
	const a: Writable<number>;
	const b: Writable<number>;
}

export {};

// @filename: index.ts

// ---cut---
import { derived } from 'svelte/store';

const summed = derived([a, b], ([$a, $b]) => $a + $b);

const delayed = derived([a, b], ([$a, $b], set) => {
	setTimeout(() => set($a + $b), 1000);
});
```

### `readonly`

这个简单的辅助函数使 store 只读。你仍然可以使用这个新的只读 store 订阅原始 store 的更改。

```js
import { readonly, writable } from 'svelte/store';

const writableStore = writable(1);
const readableStore = readonly(writableStore);

readableStore.subscribe(console.log);

writableStore.set(2); // console: 2
// @errors: 2339
readableStore.set(2); // 错误
```

### `get`

通常，你应该通过订阅 store 并在其值随时间变化时使用该值来读取 store 的值。有时，你可能需要检索你未订阅的 store 的值。`get` 允许你这样做。

> [!NOTE] 这通过创建订阅、读取值然后取消订阅来工作。因此不建议在热代码路径中使用。

```ts
// @filename: ambient.d.ts
import { type Writable } from 'svelte/store';

declare global {
	const store: Writable<string>;
}

export {};

// @filename: index.ts
// ---cut---
import { get } from 'svelte/store';

const value = get(store);
```

## Store 契约

```ts
// @noErrors
store = { subscribe: (subscription: (value: any) => void) => (() => void), set?: (value: any) => void }
```

你可以通过实现 **store 契约**来创建自己的 store，而无需依赖 [`svelte/store`](../svelte-store)：

1. store 必须包含 `.subscribe` 方法，该方法必须接受订阅函数作为其参数。调用 `.subscribe` 时，必须立即同步调用此订阅函数，并使用 store 的当前值。store 的所有活动订阅函数必须在 store 的值更改时稍后同步调用。
2. `.subscribe` 方法必须返回取消订阅函数。调用取消订阅函数必须停止其订阅，并且 store 不得再次调用其相应的订阅函数。
3. store **可以**选择包含 `.set` 方法，该方法必须接受 store 的新值作为其参数，并同步调用 store 的所有活动订阅函数。这样的 store 称为**可写 store**。

为了与 RxJS Observables 互操作，`.subscribe` 方法也允许返回一个带有 `.unsubscribe` 方法的对象，而不是直接返回取消订阅函数。但是请注意，除非 `.subscribe` 同步调用订阅（这不是 Observable 规范所要求的），否则 Svelte 将把 store 的值视为 `undefined`，直到它这样做。
