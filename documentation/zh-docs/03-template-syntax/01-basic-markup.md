---
title: 基本标记
---

Svelte 组件内的标记可以被认为是 HTML++。

## 标签

小写标签，如 `<div>`，表示常规的 HTML 元素。大写标签或使用点表示法的标签，如 `<Widget>` 或 `<my.stuff>`，表示**组件**。

```svelte
<script>
	import Widget from './Widget.svelte';
</script>

<div>
	<Widget />
</div>
```

## 元素属性

默认情况下，属性的工作方式与它们的 HTML 对应物完全相同。

```svelte
<div class="foo">
	<button disabled>不能触摸这个</button>
</div>
```

与 HTML 一样，值可以不加引号。

<!-- prettier-ignore -->
```svelte
<input type=checkbox />
```

属性值可以包含 JavaScript 表达式。

```svelte
<a href="page/{p}">第 {p} 页</a>
```

或者它们可以**是** JavaScript 表达式。

```svelte
<button disabled={!clickable}>...</button>
```

布尔属性在其值为 [truthy](https://developer.mozilla.org/en-US/docs/Glossary/Truthy) 时包含在元素上，在其值为 [falsy](https://developer.mozilla.org/en-US/docs/Glossary/Falsy) 时排除。

所有其他属性都会被包含，除非它们的值是 [nullish](https://developer.mozilla.org/en-US/docs/Glossary/Nullish)（`null` 或 `undefined`）。

```svelte
<input required={false} placeholder="此输入字段不是必需的" />
<div title={null}>此 div 没有 title 属性</div>
```

> [!NOTE] 引用单个表达式不会影响值的解析方式，但在 Svelte 6 中，它会导致值被强制转换为字符串：
>
> <!-- prettier-ignore -->
> ```svelte
> <button disabled="{number !== 42}">...</button>
> ```

当属性名称和值匹配（`name={name}`）时，它们可以替换为 `{name}`。

```svelte
<button {disabled}>...</button>
<!-- 等同于
<button disabled={disabled}>...</button>
-->
```

## 组件属性

按照惯例，传递给组件的值被称为**属性**或 **props**，而不是**特性**（attributes），后者是 DOM 的特性。

与元素一样，`name={name}` 可以替换为 `{name}` 简写。

```svelte
<Widget foo={bar} answer={42} text="hello" />
```

## 展开属性

**展开属性**允许一次将多个属性或属性传递给元素或组件。

元素或组件可以有多个展开属性，与常规属性交错。顺序很重要——如果 `things.a` 存在，它将优先于 `a="b"`，而 `c="d"` 将优先于 `things.c`：

```svelte
<Widget a="b" {...things} c="d" />
```

## 事件

可以通过向元素添加以 `on` 开头的属性来监听 DOM 事件。例如，要监听 `click` 事件，向按钮添加 `onclick` 属性：

```svelte
<button onclick={() => console.log('已点击')}>点击我</button>
```

事件属性区分大小写。`onclick` 监听 `click` 事件，`onClick` 监听 `Click` 事件，这是不同的。这确保你可以监听具有大写字符的自定义事件。

因为事件只是属性，所以适用与属性相同的规则：

- 你可以使用简写形式：`<button {onclick}>点击我</button>`
- 你可以展开它们：`<button {...thisSpreadContainsEventAttributes}>点击我</button>`

在时机上，事件属性总是在绑定的事件之后触发（例如，`oninput` 总是在 `bind:value` 更新后触发）。在底层，一些事件处理器直接使用 `addEventListener` 附加，而其他的则被**委托**。

当使用 `ontouchstart` 和 `ontouchmove` 事件属性时，处理器是[被动的](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener#using_passive_listeners)以获得更好的性能。这通过允许浏览器立即滚动文档，而不是等待查看事件处理器是否调用 `event.preventDefault()`，从而大大提高了响应性。

在极少数情况下，你需要阻止这些事件的默认行为，你应该使用 [`on`](svelte-events#on)（例如在动作内部）。

### 事件委托

为了减少内存占用并提高性能，Svelte 使用了一种称为事件委托的技术。这意味着对于某些事件——见下面的列表——应用根处的单个事件监听器负责运行事件路径上的任何处理器。

有几个需要注意的陷阱：

- 当你手动分派具有委托监听器的事件时，确保设置 `{ bubbles: true }` 选项，否则它不会到达应用根
- 当直接使用 `addEventListener` 时，避免调用 `stopPropagation`，否则事件不会到达应用根，处理器不会被调用。同样，在应用根内手动添加的处理器将在 DOM 深处声明式添加的处理器（例如使用 `onclick={...}`）**之前**运行，在捕获和冒泡阶段都是如此。出于这些原因，最好使用从 `svelte/events` 导入的 `on` 函数而不是 `addEventListener`，因为它将确保保留顺序并正确处理 `stopPropagation`。

以下事件处理器被委托：

- `beforeinput`
- `click`
- `change`
- `dblclick`
- `contextmenu`
- `focusin`
- `focusout`
- `input`
- `keydown`
- `keyup`
- `mousedown`
- `mousemove`
- `mouseout`
- `mouseover`
- `mouseup`
- `pointerdown`
- `pointermove`
- `pointerout`
- `pointerover`
- `pointerup`
- `touchend`
- `touchmove`
- `touchstart`

## 文本表达式

可以通过用花括号包围 JavaScript 表达式将其作为文本包含。

```svelte
{expression}
```

`null` 或 `undefined` 的表达式将被省略；所有其他表达式都会被[强制转换为字符串](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String#string_coercion)。

可以使用它们的 [HTML 实体](https://developer.mozilla.org/docs/Glossary/Entity)字符串在 Svelte 模板中包含花括号：`&lbrace;`、`&lcub;` 或 `&#123;` 表示 `{`，`&rbrace;`、`&rcub;` 或 `&#125;` 表示 `}`。

如果你使用正则表达式（`RegExp`）[字面量表示法](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp#literal_notation_and_constructor)，你需要将其包装在括号中。

<!-- prettier-ignore -->
```svelte
<h1>你好 {name}！</h1>
<p>{a} + {b} = {a + b}。</p>

<div>{(/^[A-Za-z ]+$/).test(value) ? x : y}</div>
```

表达式将被字符串化并转义以防止代码注入。如果你想渲染 HTML，请使用 `{@html}` 标签。

```svelte
{@html potentiallyUnsafeHtmlString}
```

> [!NOTE] 确保你转义传递的字符串或仅使用你控制的值填充它，以防止 [XSS 攻击](https://owasp.org/www-community/attacks/xss/)

## 注释

你可以在组件内使用 HTML 注释。

```svelte
<!-- 这是一个注释！ --><h1>你好世界</h1>
```

以 `svelte-ignore` 开头的注释会禁用下一个标记块的警告。通常，这些是无障碍警告；确保你出于正当理由禁用它们。

```svelte
<!-- svelte-ignore a11y_autofocus -->
<input bind:value={name} autofocus />
```

你可以添加一个以 `@component` 开头的特殊注释，当在其他文件中悬停在组件名称上时会显示。

````svelte
<!--
@component
- 你可以在这里使用 markdown。
- 你也可以在这里使用代码块。
- 用法：
  ```html
  <Main name="Arethra">
  ```
-->
<script>
	let { name } = $props();
</script>

<main>
	<h1>
		你好，{name}
	</h1>
</main>
````
