---
title: TypeScript
---

<!-- - [basically what we have today](https://svelte.dev/docs/typescript)
- built-in support, but only for type-only features
- generics
- using `Component` and the other helper types
- using `svelte-check` -->

你可以在 Svelte 组件中使用 TypeScript。像 [Svelte VS Code 扩展](https://marketplace.visualstudio.com/items?itemName=svelte.svelte-vscode)这样的 IDE 扩展将帮助你在编辑器中捕获错误，[`svelte-check`](https://www.npmjs.com/package/svelte-check) 在命令行上执行相同的操作，你可以将其集成到 CI 中。

## `<script lang="ts">`

要在 Svelte 组件中使用 TypeScript，请在 `script` 标签中添加 `lang="ts"`：

```svelte
<script lang="ts">
	let name: string = 'world';

	function greet(name: string) {
		alert(`你好，${name}！`);
	}
</script>

<button onclick={(e: Event) => greet(e.target.innerText)}>
	{name as string}
</button>
```

这样做允许你使用 TypeScript 的**仅类型**功能。也就是说，所有在转译为 JavaScript 时消失的功能，例如类型注释或接口声明。需要 TypeScript 编译器输出实际代码的功能不受支持。这包括：

- 使用枚举
- 在构造函数中使用 `private`、`protected` 或 `public` 修饰符以及初始化器
- 使用尚未成为 ECMAScript 标准一部分的功能（即在 TC39 流程中尚未达到第 4 级），因此尚未在 Acorn（我们用于解析 JavaScript 的解析器）中实现

如果你想使用这些功能之一，你需要设置 `script` 预处理器。

## 预处理器设置

要在 Svelte 组件中使用非仅类型的 TypeScript 功能，你需要添加一个预处理器，将 TypeScript 转换为 JavaScript。

### 使用 Vite

如果你使用 SvelteKit，或使用 Vite **而不使用** SvelteKit，你可以在配置文件中使用 `@sveltejs/vite-plugin-svelte` 中的 `vitePreprocess`：

```ts
/// file: svelte.config.js
// @noErrors
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

const config = {
	// 注意额外的 `{ script: true }`
	preprocess: vitePreprocess({ script: true })
};

export default config;
```

### 使用其他构建工具

如果你使用 Rollup（通过 [rollup-plugin-svelte](https://github.com/sveltejs/rollup-plugin-svelte)）或 Webpack（通过 [svelte-loader](https://github.com/sveltejs/svelte-loader)）等工具，请安装 `typescript` 和 `svelte-preprocess` 并将预处理器添加到插件配置中。有关更多信息，请参阅相应的插件 README。

> [!NOTE] 如果你正在启动一个新项目，我们建议使用 SvelteKit 或 Vite

## tsconfig.json 设置

使用 TypeScript 时，请确保正确设置你的 `tsconfig.json`。

- 使用至少 `ES2015` 的 [`target`](https://www.typescriptlang.org/tsconfig/#target)，以便类不会被编译为函数
- 将 [`verbatimModuleSyntax`](https://www.typescriptlang.org/tsconfig/#verbatimModuleSyntax) 设置为 `true`，以便导入保持原样
- 将 [`isolatedModules`](https://www.typescriptlang.org/tsconfig/#isolatedModules) 设置为 `true`，以便单独查看每个文件。TypeScript 有一些需要跨文件分析和编译的功能，Svelte 编译器和像 Vite 这样的工具不会这样做。

## 为 `$props` 添加类型

像为常规对象添加类型一样为 `$props` 添加类型，具有某些属性。

```svelte
<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		requiredProperty: number;
		optionalProperty?: boolean;
		snippetWithStringArgument: Snippet<[string]>;
		eventHandler: (arg: string) => void;
		[key: string]: unknown;
	}

	let {
		requiredProperty,
		optionalProperty,
		snippetWithStringArgument,
		eventHandler,
		...everythingElse
	}: Props = $props();
</script>

<button onclick={() => eventHandler('点击了按钮')}>
	{@render snippetWithStringArgument('你好')}
</button>
```

## 泛型 `$props`

组件可以声明其属性之间的泛型关系。一个例子是接收项目列表和接收列表中项目的回调属性的泛型列表组件。要声明 `items` 属性和 `select` 回调在相同类型上操作，请将 `generics` 属性添加到 `script` 标签：

```svelte
<script lang="ts" generics="Item extends { text: string }">
	interface Props {
		items: Item[];
		select(item: Item): void;
	}

	let { items, select }: Props = $props();
</script>

{#each items as item}
	<button onclick={() => select(item)}>
		{item.text}
	</button>
{/each}
```

`generics` 的内容是你将放在泛型函数的 `<...>` 标签之间的内容。换句话说，你可以使用多个泛型、`extends` 和回退类型。

## 为包装组件添加类型

如果你正在编写一个包装原生元素的组件，你可能希望向用户公开底层元素的所有属性。在这种情况下，使用（或扩展）`svelte/elements` 提供的接口之一。这是一个 `Button` 组件的示例：

```svelte
<script lang="ts">
	import type { HTMLButtonAttributes } from 'svelte/elements';

	let { children, ...rest }: HTMLButtonAttributes = $props();
</script>

<button {...rest}>
	{@render children?.()}
</button>
```

并非所有元素都有专用的类型定义。对于没有专用类型定义的元素，使用 `SvelteHTMLElements`：

```svelte
<script lang="ts">
	import type { SvelteHTMLElements } from 'svelte/elements';

	let { children, ...rest }: SvelteHTMLElements['div'] = $props();
</script>

<div {...rest}>
	{@render children?.()}
</div>
```

## 为 `$state` 添加类型

你可以像为任何其他变量添加类型一样为 `$state` 添加类型。

```ts
let count: number = $state(0);
```

如果你不给 `$state` 一个初始值，它的类型的一部分将是 `undefined`。

```ts
// @noErrors
// 错误：类型 'number | undefined' 不可分配给类型 'number'
let count: number = $state();
```

如果你知道变量在首次使用之前**将**被定义，请使用 `as` 转换。这在类的上下文中特别有用：

```ts
class Counter {
	count = $state() as number;
	constructor(initial: number) {
		this.count = initial;
	}
}
```

## `Component` 类型

Svelte 组件的类型是 `Component`。你可以使用它及其相关类型来表达各种约束。

将其与动态组件一起使用以限制可以传递给它的组件类型：

```svelte
<script lang="ts">
	import type { Component } from 'svelte';

	interface Props {
		// 只能传递最多需要 "prop" 属性的组件
		DynamicComponent: Component<{ prop: string }>;
	}

	let { DynamicComponent }: Props = $props();
</script>

<DynamicComponent prop="foo" />
```

> [!LEGACY] 在 Svelte 4 中，组件的类型是 `SvelteComponent`

要从组件中提取属性，请使用 `ComponentProps`。

```ts
import type { Component, ComponentProps } from 'svelte';
import MyComponent from './MyComponent.svelte';

function withProps<TComponent extends Component<any>>(
	component: TComponent,
	props: ComponentProps<TComponent>
) {}

// 如果第二个参数不是第一个参数中组件期望的正确 props，则会出错。
withProps(MyComponent, { foo: 'bar' });
```

要声明变量期望组件的构造函数或实例类型：

```svelte
<script lang="ts">
	import MyComponent from './MyComponent.svelte';

	let componentConstructor: typeof MyComponent = MyComponent;
	let componentInstance: MyComponent;
</script>

<MyComponent bind:this={componentInstance} />
```

## 增强内置 DOM 类型

Svelte 提供了所有存在的 HTML DOM 类型的最佳努力。有时你可能想使用实验性属性或来自动作的自定义事件。在这些情况下，TypeScript 会抛出类型错误，说它不知道这些类型。如果它是非实验性的标准属性/事件，这很可能是我们的 [HTML 类型](https://github.com/sveltejs/svelte/blob/main/packages/svelte/elements.d.ts)中缺少的类型。在这种情况下，欢迎你打开一个 issue 和/或 PR 来修复它。

如果这是自定义或实验性属性/事件，你可以通过像这样增强 `svelte/elements` 模块来增强类型：

```ts
/// file: additional-svelte-typings.d.ts
import { HTMLButtonAttributes } from 'svelte/elements';

declare module 'svelte/elements' {
	// 添加一个新元素
	export interface SvelteHTMLElements {
		'custom-button': HTMLButtonAttributes;
	}

	// 添加一个在所有 html 元素上可用的新全局属性
	export interface HTMLAttributes<T> {
		globalattribute?: string;
	}

	// 为 button 元素添加一个新属性
	export interface HTMLButtonAttributes {
		veryexperimentalattribute?: string;
	}
}

export {}; // 确保这不是环境模块，否则类型将被覆盖而不是增强
```

然后确保在你的 `tsconfig.json` 中引用了 `d.ts` 文件。如果它读取类似 `"include": ["src/**/*"]` 的内容并且你的 `d.ts` 文件在 `src` 内，它应该可以工作。你可能需要重新加载才能使更改生效。
