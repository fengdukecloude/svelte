---
title: Svelte 4 迁移指南
---

本迁移指南概述了如何从 Svelte 版本 3 迁移到 4。有关每个更改的更多详细信息，请参阅链接的 PR。使用迁移脚本自动迁移其中一些：`npx svelte-migrate@latest svelte-4`

如果你是库作者，请考虑是仅支持 Svelte 4 还是也可以支持 Svelte 3。由于大多数破坏性更改不会影响很多人，这可能很容易实现。还要记得更新 `peerDependencies` 中的版本范围。

## 最低版本要求

- 升级到 Node 16 或更高版本。不再支持早期版本。([#8566](https://github.com/sveltejs/svelte/issues/8566))
- 如果你使用 SvelteKit，请升级到 1.20.4 或更新版本 ([sveltejs/kit#10172](https://github.com/sveltejs/kit/pull/10172))
- 如果你在没有 SvelteKit 的情况下使用 Vite，请升级到 `vite-plugin-svelte` 2.4.1 或更新版本 ([#8516](https://github.com/sveltejs/svelte/issues/8516))
- 如果你使用 webpack，请升级到 webpack 5 或更高版本以及 `svelte-loader` 3.1.8 或更高版本。不再支持早期版本。([#8515](https://github.com/sveltejs/svelte/issues/8515), [198dbcf](https://github.com/sveltejs/svelte/commit/198dbcf))
- 如果你使用 Rollup，请升级到 `rollup-plugin-svelte` 7.1.5 或更高版本 ([198dbcf](https://github.com/sveltejs/svelte/commit/198dbcf))
- 如果你使用 TypeScript，请升级到 TypeScript 5 或更高版本。较低版本可能仍然有效，但不保证。([#8488](https://github.com/sveltejs/svelte/issues/8488))

## 打包器的浏览器条件

打包器现在必须在为浏览器构建前端包时指定 `browser` 条件。SvelteKit 和 Vite 将自动为你处理此问题。如果你使用其他工具，你可能会观察到生命周期回调（如 `onMount`）未被调用，你需要更新模块解析配置。
- 对于 Rollup，这是在 `@rollup/plugin-node-resolve` 插件中通过在其选项中设置 `browser: true` 来完成的。有关更多详细信息，请参阅 [`rollup-plugin-svelte`](https://github.com/sveltejs/rollup-plugin-svelte/#usage) 文档
- 对于 webpack，这是通过将 `"browser"` 添加到 `conditionNames` 数组来完成的。如果你已设置，你可能还必须更新 `alias` 配置。有关更多详细信息，请参阅 [`svelte-loader`](https://github.com/sveltejs/svelte-loader#usage) 文档

([#8516](https://github.com/sveltejs/svelte/issues/8516))

## 移除 CJS 相关输出

Svelte 不再支持编译器输出的 CommonJS (CJS) 格式，并且还删除了 `svelte/register` 钩子和 CJS 运行时版本。如果你需要保持 CJS 输出格式，请考虑使用打包器在构建后步骤中将 Svelte 的 ESM 输出转换为 CJS。([#8613](https://github.com/sveltejs/svelte/issues/8613))

## Svelte 函数的更严格类型

现在 `createEventDispatcher`、`Action`、`ActionReturn` 和 `onMount` 有更严格的类型：

- `createEventDispatcher` 现在支持指定有效负载是可选的、必需的还是不存在的，并相应地检查调用站点 ([#7224](https://github.com/sveltejs/svelte/issues/7224))

```ts
// @errors: 2554 2345
import { createEventDispatcher } from 'svelte';

const dispatch = createEventDispatcher<{
	optional: number | null;
	required: string;
	noArgument: null;
}>();

// Svelte 版本 3:
dispatch('optional');
dispatch('required'); // 我仍然可以省略 detail 参数
dispatch('noArgument', 'surprise'); // 我仍然可以添加 detail 参数

// Svelte 版本 4 使用 TypeScript 严格模式:
dispatch('optional');
dispatch('required'); // 错误，缺少参数
dispatch('noArgument', 'surprise'); // 错误，不能传递参数
```

- `Action` 和 `ActionReturn` 现在的默认参数类型为 `undefined`，这意味着如果你想指定此动作接收参数，你需要为泛型添加类型。迁移脚本将自动迁移此内容 ([#7442](https://github.com/sveltejs/svelte/pull/7442))

```ts
// @noErrors
---const action: Action = (node, params) => { ... } // 如果你以任何方式使用 params，这现在是一个错误---
+++const action: Action<HTMLElement, string> = (node, params) => { ... } // params 的类型是 string+++
```

- 如果你从 `onMount` 异步返回函数，`onMount` 现在会显示类型错误，因为这可能是你代码中的错误，你期望在销毁时调用回调，而它只会对同步返回的函数执行此操作 ([#8136](https://github.com/sveltejs/svelte/issues/8136))

```js
// @noErrors
// 此更改揭示实际错误的示例
onMount(
---	// someCleanup() 未被调用，因为传递给 onMount 的函数是异步的
	async () => {
		const something = await foo();---
+++	// someCleanup() 被调用，因为传递给 onMount 的函数是同步的
	() => {
		foo().then(something => {...});
		// ...
		return () => someCleanup();
	}
);
```

## 使用 Svelte 的自定义元素

使用 Svelte 创建自定义元素已经过全面改进和显著改进。`tag` 选项已弃用，改为使用新的 `customElement` 选项：

```svelte
---<svelte:options tag="my-component" />---
+++<svelte:options customElement="my-component" />+++
```

进行此更改是为了允许高级用例的[更多可配置性](custom-elements#Component-options)。迁移脚本将自动调整你的代码。属性的更新时机也略有变化。([#8457](https://github.com/sveltejs/svelte/issues/8457))

## SvelteComponentTyped 已弃用

`SvelteComponentTyped` 已弃用，因为 `SvelteComponent` 现在具有其所有类型功能。将所有 `SvelteComponentTyped` 实例替换为 `SvelteComponent`。

```js
---import { SvelteComponentTyped } from 'svelte';---
+++import { SvelteComponent } from 'svelte';+++

---export class Foo extends SvelteComponentTyped<{ aProp: string }> {}---
+++export class Foo extends SvelteComponent<{ aProp: string }> {}+++
```

如果你之前使用 `SvelteComponent` 作为组件实例类型，你现在可能会看到一个有点不透明的类型错误，可以通过将 `: typeof SvelteComponent` 更改为 `: typeof SvelteComponent<any>` 来解决。

```svelte
<script>
	import ComponentA from './ComponentA.svelte';
	import ComponentB from './ComponentB.svelte';
	import { SvelteComponent } from 'svelte';

	let component: typeof SvelteComponent+++<any>+++;

	function choseRandomly() {
		component = Math.random() > 0.5 ? ComponentA : ComponentB;
	}
</script>

<button on:click={choseRandomly}>random</button>
<svelte:element this={component} />
```

迁移脚本将自动为你完成这两项操作。([#8512](https://github.com/sveltejs/svelte/issues/8512))

## 过渡默认为本地

过渡现在默认为本地，以防止页面导航时的混淆。"本地"意味着如果过渡在嵌套的控制流块（`each/if/await/key`）内，并且不是直接父块而是其上方的块被创建/销毁，则过渡不会播放。在以下示例中，`slide` 入场动画仅在 `success` 从 `false` 变为 `true` 时播放，但在 `show` 从 `false` 变为 `true` 时**不会**播放：

```svelte
{#if show}
	...
	{#if success}
		<p in:slide>成功</p>
	{/each}
{/if}
```

要使过渡全局化，请添加 `|global` 修饰符——然后它们将在**任何**上方的控制流块被创建/销毁时播放。迁移脚本将自动为你执行此操作。([#6686](https://github.com/sveltejs/svelte/issues/6686))

## 默认插槽绑定

默认插槽绑定不再暴露给命名插槽，反之亦然：

```svelte
<script>
	import Nested from './Nested.svelte';
</script>

<Nested let:count>
	<p>
		默认插槽中的 count — 可用：{count}
	</p>
	<p slot="bar">
		bar 插槽中的 count — 不可用：{count}
	</p>
</Nested>
```

这使插槽绑定更加一致，因为当例如默认插槽来自列表而命名插槽不是时，行为是未定义的。([#6049](https://github.com/sveltejs/svelte/issues/6049))

## 预处理器

预处理器应用的顺序已更改。现在，预处理器按顺序执行，并且在一个组内，顺序是 markup、script、style。

```js
// @errors: 2304
import { preprocess } from 'svelte/compiler';

const { code } = await preprocess(
	source,
	[
		{
			markup: () => {
				console.log('markup-1');
			},
			script: () => {
				console.log('script-1');
			},
			style: () => {
				console.log('style-1');
			}
		},
		{
			markup: () => {
				console.log('markup-2');
			},
			script: () => {
				console.log('script-2');
			},
			style: () => {
				console.log('style-2');
			}
		}
	],
	{
		filename: 'App.svelte'
	}
);

// Svelte 3 记录:
// markup-1
// markup-2
// script-1
// script-2
// style-1
// style-2

// Svelte 4 记录:
// markup-1
// script-1
// style-1
// markup-2
// script-2
// style-2
```

例如，如果你使用 `MDsveX`，这可能会影响你——在这种情况下，你应该确保它在任何 script 或 style 预处理器之前。

```js
// @noErrors
preprocess: [
---	vitePreprocess(),
	mdsvex(mdsvexConfig)---
+++	mdsvex(mdsvexConfig),
	vitePreprocess()+++
]
```

每个预处理器还必须有一个名称。([#8618](https://github.com/sveltejs/svelte/issues/8618))

## 新的 eslint 包

`eslint-plugin-svelte3` 已弃用。它可能仍然适用于 Svelte 4，但我们不保证。我们建议切换到我们的新包 [eslint-plugin-svelte](https://github.com/sveltejs/eslint-plugin-svelte)。有关如何迁移的说明，请参阅[此 Github 帖子](https://github.com/sveltejs/kit/issues/10242#issuecomment-1610798405)。或者，你可以使用 `npm create svelte@latest` 创建一个新项目，选择 eslint（可能还有 TypeScript）选项，然后将相关文件复制到现有项目中。

## 其他破坏性更改

- `inert` 属性现在应用于退出元素，使其对辅助技术不可见并防止交互。([#8628](https://github.com/sveltejs/svelte/pull/8628))
- 运行时现在使用 `classList.toggle(name, boolean)`，这可能在非常旧的浏览器中不起作用。如果你需要支持这些浏览器，请考虑使用 [polyfill](https://github.com/eligrey/classList.js)。([#8629](https://github.com/sveltejs/svelte/issues/8629))
- 运行时现在使用 `CustomEvent` 构造函数，这可能在非常旧的浏览器中不起作用。如果你需要支持这些浏览器，请考虑使用 [polyfill](https://github.com/theftprevention/event-constructor-polyfill/tree/master)。([#8775](https://github.com/sveltejs/svelte/pull/8775))
- 使用 `svelte/store` 中的 `StartStopNotifier` 接口（传递给 `writable` 等的创建函数）从头开始实现自己的 store 的人现在需要除了 set 函数之外还传递一个 update 函数。这对使用 store 或使用现有 Svelte store 创建 store 的人没有影响。([#6750](https://github.com/sveltejs/svelte/issues/6750))
- `derived` 现在会在传递给它的 store 的虚假值上抛出错误。([#7947](https://github.com/sveltejs/svelte/issues/7947))
- `svelte/internal` 的类型定义已被删除，以进一步阻止使用那些不是公共 API 的内部方法。其中大多数可能会在 Svelte 5 中更改
- DOM 节点的移除现在是批处理的，这略微改变了其顺序，如果你在这些元素上使用 `MutationObserver`，这可能会影响触发事件的顺序 ([#8763](https://github.com/sveltejs/svelte/pull/8763))
- 如果你之前通过 `svelte.JSX` 命名空间增强了全局类型，你需要迁移此内容以使用 `svelteHTML` 命名空间。类似地，如果你使用 `svelte.JSX` 命名空间来使用其中的类型定义，你需要迁移这些以改用 `svelte/elements` 中的类型。你可以在[这里](https://github.com/sveltejs/language-tools/blob/master/docs/preprocessors/typescript.md#im-getting-deprecation-warnings-for-sveltejsx--i-want-to-migrate-to-the-new-typings)找到有关该怎么做的更多信息
