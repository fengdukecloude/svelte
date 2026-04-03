---
title: $state
tags: rune-state
---

`$state` 符文允许你创建**响应式状态**，这意味着当状态改变时，你的 UI 会**响应**。

```svelte
<script>
	let count = $state(0);
</script>

<button onclick={() => count++}>
	点击次数：{count}
</button>
```

与你可能遇到的其他框架不同，没有用于与状态交互的 API——`count` 只是一个数字，而不是对象或函数，你可以像更新任何其他变量一样更新它。

### 深层状态

如果 `$state` 与数组或简单对象一起使用，结果是一个深度响应式的**状态代理**。[代理（Proxies）](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy)允许 Svelte 在你读取或写入属性时运行代码，包括通过 `array.push(...)` 等方法，从而触发细粒度的更新。

状态会递归地被代理，直到 Svelte 找到数组或简单对象以外的东西（如类或使用 `Object.create` 创建的对象）。在这种情况下……

```js
let todos = $state([
	{
		done: false,
		text: '添加更多待办事项'
	}
]);
```

……修改单个 todo 的属性将触发 UI 中依赖于该特定属性的任何内容的更新：

```js
let todos = [{ done: false, text: '添加更多待办事项' }];
// ---cut---
todos[0].done = !todos[0].done;
```

如果你向数组推送一个新对象，它也会被代理：

```js
let todos = [{ done: false, text: '添加更多待办事项' }];
// ---cut---
todos.push({
	done: false,
	text: '吃午饭'
});
```

> [!NOTE] 当你更新代理的属性时，原始对象**不会**被修改。如果你需要在状态代理中使用自己的代理处理器，[你应该在用 `$state` 包装对象**之后**再包装它](https://svelte.dev/playground/hello-world?version=latest#H4sIAAAAAAAACpWR3WoDIRCFX2UqhWyIJL3erAulL9C7XnQLMe5ksbUqOpsfln33YuyGFNJC8UKdc2bOhw7Myk9kJXsJ0nttO9jcR5KEG9AWJDwHdzwxznbaYGTl68Do5JM_FRifuh-9X8Y9Gkq1rYx4q66cJbQUWcmqqIL2VDe2IYMEbvuOikBADi-GJDSkXG-phId0G-frye2DO2psQYDFQ0Ys8gQO350dUkEydEg82T0GOs0nsSG9g2IqgxACZueo2ZUlpdvoDC6N64qsg1QKY8T2bpZp8gpIfbCQ85Zn50Ud82HkeY83uDjspenxv3jXcSDyjPWf9L1vJf0GH666J-jLu1ery4dV257IWXBWGa0-xFDMQdTTn2ScxWKsn86ROsLwQxqrVR5QM84Ij8TKFD2-cUZSm4O2LSt30kQcvwCgCmfZnAIAAA==)。

请注意，如果你解构一个响应式值，引用不是响应式的——就像在普通 JavaScript 中一样，它们在解构时被评估：

```js
let todos = [{ done: false, text: '添加更多待办事项' }];
// ---cut---
let { done, text } = todos[0];

// 这不会影响 `done` 的值
todos[0].done = !todos[0].done;
```

### 类

类实例不会被代理。相反，你可以在类字段（无论是公共的还是私有的）中使用 `$state`，或者在 `constructor` 内部作为属性的第一次赋值：

```js
// @errors: 7006 2554
class Todo {
	done = $state(false);

	constructor(text) {
		this.text = $state(text);
	}

	reset() {
		this.text = '';
		this.done = false;
	}
}
```

> [!NOTE] 编译器将 `done` 和 `text` 转换为类原型上引用私有字段的 `get`/`set` 方法。这意味着这些属性不可枚举。

在 JavaScript 中调用方法时，[`this`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this) 的值很重要。这不会起作用，因为 `reset` 方法内的 `this` 将是 `<button>` 而不是 `Todo`：

```svelte
<button onclick={todo.reset}>
	重置
</button>
```

你可以使用内联函数……

```svelte
<button onclick={() => todo.reset()}>
	重置
</button>
```

……或在类定义中使用箭头函数：

```js
// @errors: 7006 2554
class Todo {
	done = $state(false);

	constructor(text) {
		this.text = $state(text);
	}

	reset = () => {
		this.text = '';
		this.done = false;
	}
}
```

### 内置类

Svelte 提供了内置类（如 `Set`、`Map`、`Date` 和 `URL`）的响应式实现，可以从 [`svelte/reactivity`](svelte-reactivity) 导入。

## `$state.raw`

在你不希望对象和数组深度响应的情况下，可以使用 `$state.raw`。

使用 `$state.raw` 声明的状态不能被修改；它只能被**重新赋值**。换句话说，与其赋值给对象的属性或使用像 `push` 这样的数组方法，如果你想更新它，请完全替换对象或数组：

```js
let person = $state.raw({
	name: 'Heraclitus',
	age: 49
});

// 这不会有任何效果
person.age += 1;

// 这会起作用，因为我们创建了一个新的 person
person = {
	name: 'Heraclitus',
	age: 50
};
```

这可以提高你本来就不打算修改的大型数组和对象的性能，因为它避免了使它们响应式的成本。请注意，原始状态可以**包含**响应式状态（例如，响应式对象的原始数组）。

与 `$state` 一样，你可以使用 `$state.raw` 声明类字段。

## `$state.snapshot`

要获取深度响应式 `$state` 代理的静态快照，请使用 `$state.snapshot`：

```svelte
<script>
	let counter = $state({ count: 0 });

	function onclick() {
		// 将记录 `{ count: ... }` 而不是 `Proxy { ... }`
		console.log($state.snapshot(counter));
	}
</script>
```

这在你想将某些状态传递给不期望代理的外部库或 API（如 `structuredClone`）时很方便。

## `$state.eager`

当状态改变时，如果它被 `await` 表达式使用，可能不会立即反映在 UI 中，因为[更新是同步的](await-expressions#Synchronized-updates)。

在某些情况下，你可能希望在状态改变时立即更新 UI。例如，你可能希望在用户点击链接时更新导航栏，以便在等待新页面加载时获得视觉反馈。为此，请使用 `$state.eager(value)`：

```svelte
<nav>
	<a href="/" aria-current={$state.eager(pathname) === '/' ? 'page' : null}>首页</a>
	<a href="/about" aria-current={$state.eager(pathname) === '/about' ? 'page' : null}>关于</a>
</nav>
```

谨慎使用此功能，并且仅用于响应用户操作提供反馈——一般来说，允许 Svelte 协调更新将提供更好的用户体验。

## 将状态传递给函数

JavaScript 是一种**按值传递**的语言——当你调用函数时，参数是**值**而不是**变量**。换句话说：

```js
/// file: index.js
// @filename: index.js
// ---cut---
/**
 * @param {number} a
 * @param {number} b
 */
function add(a, b) {
	return a + b;
}

let a = 1;
let b = 2;
let total = add(a, b);
console.log(total); // 3

a = 3;
b = 4;
console.log(total); // 仍然是 3！
```

如果 `add` 想要访问 `a` 和 `b` 的**当前**值，并返回当前的 `total` 值，你需要使用函数：

```js
/// file: index.js
// @filename: index.js
// ---cut---
/**
 * @param {() => number} getA
 * @param {() => number} getB
 */
function add(getA, getB) {
	return () => getA() + getB();
}

let a = 1;
let b = 2;
let total = add(() => a, () => b);
console.log(total()); // 3

a = 3;
b = 4;
console.log(total()); // 7
```

Svelte 中的状态没有什么不同——当你引用使用 `$state` 符文声明的内容时……

```js
let a = $state(1);
let b = $state(2);
```

……你正在访问它的**当前值**。

请注意，"函数"的范围很广——它包括代理的属性和 [`get`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/get)/[`set`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/set) 属性……

```js
/// file: index.js
// @filename: index.js
// ---cut---
/**
 * @param {{ a: number, b: number }} input
 */
function add(input) {
	return {
		get value() {
			return input.a + input.b;
		}
	};
}

let input = $state({ a: 1, b: 2 });
let total = add(input);
console.log(total.value); // 3

input.a = 3;
input.b = 4;
console.log(total.value); // 7
```

……尽管如果你发现自己编写这样的代码，请考虑使用[类](#类)。

## 跨模块传递状态

你可以在 `.svelte.js` 和 `.svelte.ts` 文件中声明状态，但只有在不直接重新赋值的情况下才能**导出**该状态。换句话说，你不能这样做：

```js
/// file: state.svelte.js
export let count = $state(0);

export function increment() {
	count += 1;
}
```

这是因为对 `count` 的每个引用都会被 Svelte 编译器转换——上面的代码大致等同于：

```js
/// file: state.svelte.js (编译器输出)
// @filename: index.ts
interface Signal<T> {
	value: T;
}

interface Svelte {
	state<T>(value?: T): Signal<T>;
	get<T>(source: Signal<T>): T;
	set<T>(source: Signal<T>, value: T): void;
}
declare const $: Svelte;
// ---cut---
export let count = $.state(0);

export function increment() {
	$.set(count, $.get(count) + 1);
}
```

> [!NOTE] 你可以通过在[演练场](/playground)中点击"JS Output"选项卡来查看 Svelte 生成的代码。

由于编译器一次只操作一个文件，如果另一个文件导入 `count`，Svelte 不知道它需要将每个引用包装在 `$.get` 和 `$.set` 中：

```js
// @filename: state.svelte.js
export let count = 0;

// @filename: index.js
// ---cut---
import { count } from './state.svelte.js';

console.log(typeof count); // 'object'，而不是 'number'
```

这给你留下了两个在模块之间共享状态的选项——要么不重新赋值它……

```js
// 这是允许的——因为我们更新的是
// `counter.count` 而不是 `counter`，
// Svelte 不会将其包装在 `$.state` 中
export const counter = $state({
	count: 0
});

export function increment() {
	counter.count += 1;
}
```

……要么不直接导出它：

```js
let count = $state(0);

export function getCount() {
	return count;
}

export function increment() {
	count += 1;
}
```
