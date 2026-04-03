---
title: $props
tags: rune-props
---

组件的输入被称为 **props**，这是 **properties**（属性）的缩写。你可以像向元素传递属性一样向组件传递 props：

```svelte
<!--- file: App.svelte --->
<script>
	import MyComponent from './MyComponent.svelte';
</script>

<MyComponent adjective="cool" />
```

在另一边，在 `MyComponent.svelte` 内部，我们可以使用 `$props` 符文接收 props……

```svelte
<!--- file: MyComponent.svelte --->
<script>
	let props = $props();
</script>

<p>这个组件是 {props.adjective}</p>
```

……不过更常见的是，你会[**解构**](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment)你的 props：

```svelte
<!--- file: MyComponent.svelte --->
<script>
	let { adjective } = $props();
</script>

<p>这个组件是 {adjective}</p>
```

## 回退值

解构允许我们声明回退值，当父组件没有设置给定的 prop（或值为 `undefined`）时使用：

```js
let { adjective = 'happy' } = $props();
```

> [!NOTE] 回退值不会转换为响应式状态代理（有关更多信息，请参阅[更新 props](#Updating-props)）

## 重命名 props

我们还可以使用解构赋值来重命名 props，这在它们是无效标识符或 JavaScript 关键字（如 `super`）时是必要的：

```js
let { super: trouper = 'lights are gonna find me' } = $props();
```

## 剩余 props

最后，我们可以使用**剩余属性**来获取，嗯，剩余的 props：

```js
let { a, b, c, ...others } = $props();
```

## 更新 props

组件内部对 prop 的引用在 prop 本身更新时会更新——当 `App.svelte` 中的 `count` 改变时，它也会在 `Child.svelte` 内部改变。但子组件能够临时覆盖 prop 值，这对于未保存的临时状态很有用：

<!-- codeblock:start {"title":"临时更新 props","selected":"Child.svelte"} -->
```svelte
<!--- file: App.svelte --->
<script>
	import Child from './Child.svelte';

	let count = $state(0);
</script>

<button onclick={() => (count += 1)}>
	点击次数（父级）：{count}
</button>

<Child {count} />
```

```svelte
<!--- file: Child.svelte --->
<script>
	let { count } = $props();
</script>

<button onclick={() => (count += 1)}>
	点击次数（子级）：{count}
</button>
```
<!-- codeblock:end -->

虽然你可以临时**重新赋值** props，但你不应该**修改** props，除非它们是[可绑定的]($bindable)。

如果 prop 是常规对象，修改将没有效果：

<!-- codeblock:start {"title":"非响应式 props","selected":"Child.svelte"} -->
```svelte
<!--- file: App.svelte --->
<script>
	import Child from './Child.svelte';
</script>

<Child object={{ count: 0 }} />
```

```svelte
<!--- file: Child.svelte --->
<script>
	let { object } = $props();
</script>

<button onclick={() => {
	// 没有效果
	object.count += 1
}}>
	点击次数：{object.count}
</button>
```
<!-- codeblock:end -->

但是，如果 prop 是响应式状态代理，那么修改**将**有效果，但你会看到 [`ownership_invalid_mutation`](runtime-warnings#Client-warnings-ownership_invalid_mutation) 警告，因为组件正在修改不"属于"它的状态：

<!-- codeblock:start {"title":"无效的修改","selected":"Child.svelte"} -->
```svelte
<!--- file: App.svelte --->
<script>
	import Child from './Child.svelte';

	let object = $state({count: 0});
</script>

<Child {object} />
```

```svelte
<!--- file: Child.svelte --->
<script>
	let { object } = $props();
</script>

<button onclick={() => {
	// 会导致下面的计数更新，
	// 但会有警告。不要修改
	// 你不拥有的对象！
	object.count += 1
}}>
	点击次数：{object.count}
</button>
```
<!-- codeblock:end -->

未使用 `$bindable` 声明的 prop 的回退值保持不变——它不会转换为响应式状态代理——这意味着修改不会导致更新：

<!-- codeblock:start {"title":"非响应式回退 props","selected":"Child.svelte"} -->
```svelte
<!--- file: App.svelte --->
<script>
	import Child from './Child.svelte';
</script>

<Child />
```

```svelte
<!--- file: Child.svelte --->
<script>
	let { object = { count: 0 } } = $props();
</script>

<button onclick={() => {
	// 如果使用回退值，则没有效果
	object.count += 1
}}>
	点击次数：{object.count}
</button>
```
<!-- codeblock:end -->

总之：不要修改 props。要么使用回调 props 来传达更改，要么——如果父级和子级应该共享同一个对象——使用 [`$bindable`]($bindable) 符文。

## 类型安全

你可以通过注释你的 props 来为组件添加类型安全，就像你对任何其他变量声明所做的那样。在 TypeScript 中，可能看起来像这样……

```svelte
<script lang="ts">
	let { adjective }: { adjective: string } = $props();
</script>
```

……而在 JSDoc 中你可以这样做：

```svelte
<script>
	/** @type {{ adjective: string }} */
	let { adjective } = $props();
</script>
```

当然，你可以将类型声明与注释分开：

```svelte
<script lang="ts">
	interface Props {
		adjective: string;
	}

	let { adjective }: Props = $props();
</script>
```

> [!NOTE] 原生 DOM 元素的接口在 `svelte/elements` 模块中提供（参见[类型化包装组件](typescript#Typing-wrapper-components)）

如果你的组件公开了像 `children` 这样的[代码片段](snippet) props，应该使用从 `'svelte'` 导入的 `Snippet` 接口进行类型化——有关示例，请参阅[类型化代码片段](snippet#Typing-snippets)。

建议添加类型，因为它确保使用你的组件的人可以轻松发现他们应该提供哪些 props。


## `$props.id()`

此符文在 5.20.0 版本中添加，生成一个对当前组件实例唯一的 ID。在水合服务端渲染的组件时，该值在服务器和客户端之间将保持一致。

这对于通过 `for` 和 `aria-labelledby` 等属性链接元素很有用。

```svelte
<script>
	const uid = $props.id();
</script>

<form>
	<label for="{uid}-firstname">名字：</label>
	<input id="{uid}-firstname" type="text" />

	<label for="{uid}-lastname">姓氏：</label>
	<input id="{uid}-lastname" type="text" />
</form>
```
