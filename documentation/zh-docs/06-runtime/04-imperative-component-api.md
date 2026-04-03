---
title: 命令式组件 API
---

<!-- better title needed?

- mount
- unmount
- render
- hydrate
- how they interact with each other -->

每个 Svelte 应用程序都通过命令式创建根组件开始。在客户端，此组件挂载到特定元素。在服务器上，你希望获得可以渲染的 HTML 字符串。以下函数可帮助你完成这些任务。

## `mount`

实例化一个组件并将其挂载到给定目标：

```js
// @errors: 2322
import { mount } from 'svelte';
import App from './App.svelte';

const app = mount(App, {
	target: document.querySelector('#app'),
	props: { some: 'property' }
});
```

你可以在每个页面上挂载多个组件，也可以从应用程序内部挂载，例如在创建工具提示组件并将其附加到悬停元素时。

请注意，与 Svelte 4 中调用 `new App(...)` 不同，副作用（包括 `onMount` 回调和动作函数）不会在 `mount` 期间运行。如果你需要强制运行待处理的副作用（例如在测试的上下文中），你可以使用 `flushSync()` 来做到这一点。

## `unmount`

卸载先前使用 [`mount`](#mount) 或 [`hydrate`](#hydrate) 创建的组件。

如果 `options.outro` 为 `true`，则在从 DOM 中移除组件之前将播放[过渡](transition)：

```js
import { mount, unmount } from 'svelte';
import App from './App.svelte';

const app = mount(App, { target: document.body });

// 稍后
unmount(app, { outro: true });
```

如果 `options.outro` 为 true，则在过渡完成后返回解析的 `Promise`，否则立即返回。

## `render`

仅在服务器上可用，并且在使用 `server` 选项编译时可用。接受一个组件并返回一个带有 `body` 和 `head` 属性的对象，你可以使用它在服务端渲染应用时填充 HTML：

```js
// @errors: 2724 2305 2307
import { render } from 'svelte/server';
import App from './App.svelte';

const result = render(App, {
	props: { some: 'property' }
});
result.body; // 在 <body> 标签中某处的 HTML
result.head; // 在 <head> 标签中某处的 HTML
```

## `hydrate`

类似于 `mount`，但会重用 Svelte 的 SSR 输出（来自 [`render`](#render) 函数）在目标内渲染的任何 HTML，并使其具有交互性：

```js
// @errors: 2322
import { hydrate } from 'svelte';
import App from './App.svelte';

const app = hydrate(App, {
	target: document.querySelector('#app'),
	props: { some: 'property' }
});
```

与 `mount` 一样，副作用不会在 `hydrate` 期间运行——如果需要，请在之后立即使用 `flushSync()`。
