---
title: 遗留 API - 组件和特殊元素（完整版）
---

本文件整合了 99-legacy 文件夹中关于组件和特殊元素的内容，方便完整阅读。

---

# <svelte:component>

在 runes 模式下，如果 `MyComponent` 的值发生变化，`<MyComponent>` 将重新渲染。有关示例，请参阅 [Svelte 5 迁移指南](/docs/svelte/v5-migration-guide#svelte:component-is-no-longer-necessary)。

在遗留模式下，它不会——我们必须使用 `<svelte:component>`，当其 `this` 表达式的值发生变化时，它会销毁并重新创建组件实例：

```svelte
<svelte:component this={MyComponent} />
```

如果 `this` 为假值，则不会渲染任何组件。

---

# <svelte:self>

`<svelte:self>` 元素允许组件递归地包含自身。

它不能出现在标记的顶层；它必须在 if 或 each 块内部，或传递给组件的插槽，以防止无限循环。

```svelte
<script>
	export let count;
</script>

{#if count > 0}
	<p>counting down... {count}</p>
	<svelte:self count={count - 1} />
{:else}
	<p>lift-off!</p>
{/if}
```

> [!NOTE]
> 这个概念已过时，因为组件可以导入自身：
> ```svelte
> <!--- file: App.svelte --->
> <script>
> 	import Self from './App.svelte'
> 	export let count;
> </script>
>
> {#if count > 0}
> 	<p>counting down... {count}</p>
> 	<Self count={count - 1} />
> {:else}
> 	<p>lift-off!</p>
> {/if}
> ```

---

# 命令式组件 API

在 Svelte 3 和 4 中，与组件交互的 API 与 Svelte 5 不同。请注意，此页面 _不_ 适用于 Svelte 5 应用程序中的遗留模式组件。

## 创建组件

```ts
// @noErrors
const component = new Component(options);
```

客户端组件——即使用 `generate: 'dom'` 编译的组件（或未指定 `generate` 选项）是一个 JavaScript 类。

```ts
// @noErrors
import App from './App.svelte';

const app = new App({
	target: document.body,
	props: {
		// assuming App.svelte contains something like
		// `export let answer`:
		answer: 42
	}
});
```

可以提供以下初始化选项：

| 选项      | 默认值      | 描述                                                                                          |
| --------- | ----------- | ---------------------------------------------------------------------------------------------------- |
| `target`  | **none**    | 要渲染到的 `HTMLElement` 或 `ShadowRoot`。此选项是必需的                               |
| `anchor`  | `null`      | `target` 的子元素，在其之前立即渲染组件                                       |
| `props`   | `{}`        | 要提供给组件的属性对象                                                   |
| `context` | `new Map()` | 要提供给组件的根级上下文键值对的 `Map`                             |
| `hydrate` | `false`     | 见下文                                                                                            |
| `intro`   | `false`     | 如果为 `true`，将在初始渲染时播放过渡，而不是等待后续状态更改 |

`target` 的现有子元素保留在原处。

`hydrate` 选项指示 Svelte 升级现有 DOM（通常来自服务器端渲染）而不是创建新元素。它只有在组件使用 [`hydratable: true` 选项](/docs/svelte-compiler#compile) 编译时才有效。`<head>` 元素的水合只有在服务器端渲染代码也使用 `hydratable: true` 编译时才能正常工作，这会为 `<head>` 中的每个元素添加一个标记，以便组件知道在水合期间要删除哪些元素。

虽然 `target` 的子元素通常保持不变，但 `hydrate: true` 将导致任何子元素被删除。因此，`anchor` 选项不能与 `hydrate: true` 一起使用。

现有 DOM 不需要与组件匹配——Svelte 会在进行时"修复"DOM。

```ts
/// file: index.js
// @noErrors
import App from './App.svelte';

const app = new App({
	target: document.querySelector('#server-rendered-html'),
	hydrate: true
});
```

> [!NOTE]
> 在 Svelte 5+ 中，请使用 [`mount`](svelte#mount) 代替

## `$set`

```ts
// @noErrors
component.$set(props);
```

以编程方式在实例上设置 props。`component.$set({ x: 1 })` 等同于组件的 `<script>` 块内的 `x = 1`。

调用此方法会为下一个微任务安排更新——DOM _不会_ 同步更新。

```ts
// @noErrors
component.$set({ answer: 42 });
```

> [!NOTE]
> 在 Svelte 5+ 中，使用 `$state` 创建组件 props 并更新它
>
> ```js
> // @noErrors
> let props = $state({ answer: 42 });
> const component = mount(Component, { props });
> // ...
> props.answer = 24;
> ```

## `$on`

```ts
// @noErrors
component.$on(ev, callback);
```

使 `callback` 函数在组件调度 `event` 时被调用。

返回一个函数，调用时将删除事件监听器。

```ts
// @noErrors
const off = component.$on('selected', (event) => {
	console.log(event.detail.selection);
});

off();
```

> [!NOTE]
> 在 Svelte 5+ 中，请传递回调 props

## `$destroy`

```js
// @noErrors
component.$destroy();
```

从 DOM 中删除组件并触发任何 `onDestroy` 处理器。

> [!NOTE]
> 在 Svelte 5+ 中，请使用 [`unmount`](svelte#unmount) 代替

## 组件 props

```js
// @noErrors
component.prop;
```

```js
// @noErrors
component.prop = value;
```

如果组件使用 `accessors: true` 编译，每个实例将具有与组件的每个 prop 对应的 getter 和 setter。设置值将导致 _同步_ 更新，而不是 `component.$set(...)` 导致的默认异步更新。

默认情况下，`accessors` 为 `false`，除非你编译为自定义元素。

```js
// @noErrors
console.log(component.count);
component.count += 1;
```

> [!NOTE]
> 在 Svelte 5+ 中，这个概念已过时。如果你想从外部访问属性，请 `export` 它们

## 服务器端组件 API

```js
// @noErrors
const result = Component.render(...)
```

与客户端组件不同，服务器端组件在渲染后没有生命周期——它们的全部工作就是创建一些 HTML 和 CSS。因此，API 有所不同。

服务器端组件公开一个 `render` 方法，可以使用可选的 props 调用。它返回一个具有 `head`、`html` 和 `css` 属性的对象，其中 `head` 包含遇到的任何 `<svelte:head>` 元素的内容。

你可以使用 `svelte/register` 将 Svelte 组件直接导入 Node。

```js
// @noErrors
require('svelte/register');

const App = require('./App.svelte').default;

const { head, html, css } = App.render({
	answer: 42
});
```

`.render()` 方法接受以下参数：

| 参数      | 默认值 | 描述                                        |
| --------- | ------- | -------------------------------------------------- |
| `props`   | `{}`    | 要提供给组件的属性对象 |
| `options` | `{}`    | 选项对象                               |

`options` 对象接受以下选项：

| 选项      | 默认值      | 描述                                                              |
| --------- | ----------- | ------------------------------------------------------------------------ |
| `context` | `new Map()` | 要提供给组件的根级上下文键值对的 `Map` |

```js
// @noErrors
const { head, html, css } = App.render(
	// props
	{ answer: 42 },
	// options
	{
		context: new Map([['context-key', 'context-value']])
	}
);
```

> [!NOTE]
> 在 Svelte 5+ 中，请使用 [`render`](svelte-server#render) 代替
