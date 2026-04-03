---
title: 自定义元素
---

<!-- - [basically what we have today](https://svelte.dev/docs/custom-elements-api) -->

Svelte 组件也可以使用 `customElement: true` 编译器选项编译为自定义元素（又名 Web 组件）。你应该使用 `<svelte:options>` [元素](svelte-options)为组件指定标签名称。在自定义元素内，你可以通过 [`$host`](https://svelte.dev/docs/svelte/$host) 符文访问宿主元素。

```svelte
<svelte:options customElement="my-element" />

<script>
	let { name = 'world' } = $props();
</script>

<h1>你好 {name}！</h1>
<slot />
```

你可以为任何不想公开的内部组件省略标签名称，并像常规 Svelte 组件一样使用它们。如果需要，消费者仍然可以在之后使用静态 `element` 属性为其命名，该属性包含自定义元素构造函数，并且在 `customElement` 编译器选项为 `true` 时可用。

```js
// @noErrors
import MyElement from './MyElement.svelte';

customElements.define('my-element', MyElement.element);
```

一旦定义了自定义元素，它就可以用作常规 DOM 元素：

```js
document.body.innerHTML = `
	<my-element>
		<p>这是一些插槽内容</p>
	</my-element>
`;
```

任何 [props](basic-markup#Component-props) 都作为 DOM 元素的属性公开（以及在可能的情况下作为属性可读/可写）。

```js
// @noErrors
const el = document.querySelector('my-element');

// 获取 'name' prop 的当前值
console.log(el.name);

// 设置新值，更新 shadow DOM
el.name = 'everybody';
```

请注意，你需要明确列出所有属性，即在不在[组件选项](#Component-options)中声明 `props` 的情况下执行 `let props = $props()` 意味着 Svelte 无法知道要将哪些 props 作为 DOM 元素上的属性公开。

## 组件生命周期

自定义元素是使用包装方法从 Svelte 组件创建的。这意味着内部 Svelte 组件不知道它是自定义元素。自定义元素包装器负责适当地处理其生命周期。

创建自定义元素时，它包装的 Svelte 组件**不会**立即创建。它仅在调用 `connectedCallback` 后的下一个 tick 中创建。在将自定义元素插入 DOM 之前分配给它的属性会被临时保存，然后在组件创建时设置，因此它们的值不会丢失。但是，在自定义元素上调用导出的函数不起作用，它们仅在元素挂载后可用。如果你需要在组件创建之前调用函数，你可以通过使用 [`extend` 选项](#Component-options)来解决它。

当使用 Svelte 编写的自定义元素被创建或更新时，shadow DOM 将在下一个 tick 中反映该值，而不是立即反映。这样可以批量更新，并且临时（但同步）将元素从 DOM 中分离的 DOM 移动不会导致卸载内部组件。

内部 Svelte 组件在调用 `disconnectedCallback` 后的下一个 tick 中被销毁。

## 组件选项

在构造自定义元素时，你可以通过在 `<svelte:options>` 中将 `customElement` 定义为对象来定制多个方面，自 Svelte 4 起。此对象可能包含以下属性：

- `tag: string`：自定义元素名称的可选 `tag` 属性。如果设置，将在导入此组件时使用文档的 `customElements` 注册表定义具有此标签名称的自定义元素。
- `shadow`：用于修改 shadow root 属性的可选属性。它接受以下值：
  - `"none"`：不创建 shadow root。请注意，样式不再封装，并且你不能使用插槽。
  - `"open"`：使用 `mode: "open"` 选项创建 shadow root。
  - [`ShadowRootInit`](https://developer.mozilla.org/en-US/docs/Web/API/Element/attachShadow#options)：你可以传递一个设置对象，该对象将在创建 shadow root 时传递给 `attachShadow()`。
- `props`：用于修改组件属性的某些细节和行为的可选属性。它提供以下设置：
  - `attribute: string`：要更新自定义元素的 prop，你有两种选择：在自定义元素的引用上设置属性（如上所示）或使用 HTML 属性。对于后者，默认属性名称是小写属性名称。通过分配 `attribute: "<desired name>"` 来修改它。
  - `reflect: boolean`：默认情况下，更新的 prop 值不会反映回 DOM。要启用此行为，请设置 `reflect: true`。
  - `type: 'String' | 'Boolean' | 'Number' | 'Array' | 'Object'`：在将属性值转换为 prop 值并将其反映回来时，默认情况下假定 prop 值是 `String`。这可能并不总是准确的。例如，对于数字类型，使用 `type: "Number"` 定义它
    你不需要列出所有属性，未列出的属性将使用默认设置。
- `extend`：一个可选属性，期望一个函数作为其参数。它传递 Svelte 生成的自定义元素类，并期望你返回一个自定义元素类。如果你对自定义元素的生命周期有非常具体的要求，或者想要增强类以例如使用 [ElementInternals](https://developer.mozilla.org/en-US/docs/Web/API/ElementInternals#examples) 以更好地集成 HTML 表单，这会很方便。

```svelte
<svelte:options
	customElement={{
		tag: 'custom-element',
		shadow: {
			mode: import.meta.env.DEV ? 'open' : 'closed',
			clonable: true,
			// ...
		},
		props: {
			name: { reflect: true, type: 'Number', attribute: 'element-index' }
		},
		extend: (customElementConstructor) => {
			// 扩展类，以便我们可以让它参与 HTML 表单
			return class extends customElementConstructor {
				static formAssociated = true;

				constructor() {
					super();
					this.attachedInternals = this.attachInternals();
				}

				// 在这里添加函数，而不是在下面的组件中，以便
				// 它始终可用，而不仅仅是在内部 Svelte 组件挂载时
				randomIndex() {
					this.elementIndex = Math.random();
				}
			};
		}
	}}
/>

<script>
	let { elementIndex, attachedInternals } = $props();
	// ...
	function check() {
		attachedInternals.checkValidity();
	}
</script>

...
```

> [!NOTE] 虽然 `extend` 函数中支持 Typescript，但它受到限制：你需要在其中一个脚本上设置 `lang="ts"`，并且你只能在其中使用[可擦除语法](https://www.typescriptlang.org/tsconfig/#erasableSyntaxOnly)。它们不会被脚本预处理器处理。

## 注意事项和限制

自定义元素可以是在非 Svelte 应用中打包组件以供使用的有用方式，因为它们可以与原生 HTML 和 JavaScript 以及[大多数框架](https://custom-elements-everywhere.com/)一起使用。但是，有一些重要的差异需要注意：

- 样式是**封装的**，而不仅仅是**作用域的**（除非你设置 `shadow: "none"`）。这意味着任何非组件样式（例如你可能在 `global.css` 文件中拥有的样式）都不会应用于自定义元素，包括带有 `:global(...)` 修饰符的样式
- 样式不是作为单独的 .css 文件提取出来的，而是作为 JavaScript 字符串内联到组件中
- 自定义元素通常不适合服务端渲染，因为在 JavaScript 加载之前 shadow DOM 是不可见的
- 在 Svelte 中，插槽内容**延迟**渲染。在 DOM 中，它**急切**渲染。换句话说，即使组件的 `<slot>` 元素在 `{#if ...}` 块内，它也会始终被创建。类似地，在 `{#each ...}` 块中包含 `<slot>` 不会导致插槽内容被多次渲染
- 已弃用的 `let:` 指令无效，因为自定义元素无法将数据传递给填充插槽的父组件
- 需要 polyfill 来支持旧版浏览器
- 你可以在自定义元素内的常规 Svelte 组件之间使用 Svelte 的 context 功能，但不能跨自定义元素使用它们。换句话说，你不能在父自定义元素上使用 `setContext`，然后在子自定义元素中使用 `getContext` 读取它。
- 不要声明以 `on` 开头的属性或特性，因为它们的使用将被解释为事件监听器。换句话说，Svelte 将 `<custom-element oneworld={true}></custom-element>` 视为 `customElement.addEventListener('eworld', true)`（而不是 `customElement.oneworld = true`）
