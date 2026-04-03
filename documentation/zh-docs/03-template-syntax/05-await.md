---
title: {#await ...}
tags: template-await
---

```svelte
<!--- copy: false  --->
{#await expression}...{:then name}...{:catch name}...{/await}
```

```svelte
<!--- copy: false  --->
{#await expression}...{:then name}...{/await}
```

```svelte
<!--- copy: false  --->
{#await expression then name}...{/await}
```

```svelte
<!--- copy: false  --->
{#await expression catch name}...{/await}
```

Await 块允许你根据 [`Promise`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) 的三种可能状态进行分支——待定（pending）、已完成（fulfilled）或已拒绝（rejected）。

```svelte
{#await promise}
	<!-- promise 待定中 -->
	<p>等待 promise 解析...</p>
{:then value}
	<!-- promise 已完成或不是 Promise -->
	<p>值是 {value}</p>
{:catch error}
	<!-- promise 被拒绝 -->
	<p>出错了：{error.message}</p>
{/await}
```

> [!NOTE] 在服务端渲染期间，只会渲染待定分支。
>
> 如果提供的表达式不是 `Promise`，则只会渲染 `:then` 分支，包括在服务端渲染期间。

如果你不需要在 promise 被拒绝时渲染任何内容（或没有可能的错误），可以省略 `catch` 块。

```svelte
{#await promise}
	<!-- promise 待定中 -->
	<p>等待 promise 解析...</p>
{:then value}
	<!-- promise 已完成 -->
	<p>值是 {value}</p>
{/await}
```

如果你不关心待定状态，也可以省略初始块。

```svelte
{#await promise then value}
	<p>值是 {value}</p>
{/await}
```

同样，如果你只想显示错误状态，可以省略 `then` 块。

```svelte
{#await promise catch error}
	<p>错误是 {error}</p>
{/await}
```

> [!NOTE] 你可以将 `#await` 与 [`import(...)`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import) 一起使用来懒加载组件：
>
> ```svelte
> {#await import('./Component.svelte') then { default: Component }}
> 	<Component />
> {/await}
> ```
