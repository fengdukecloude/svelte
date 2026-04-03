---
title: bind:
---

数据通常从父级向下流向子级。`bind:` 指令允许数据以另一种方式流动，从子级到父级。

一般语法是 `bind:property={expression}`，其中 `expression` 是一个 [_左值_](https://press.rebus.community/programmingfundamentals/chapter/lvalue-and-rvalue/)（即变量或对象属性）。当表达式是与属性同名的标识符时，我们可以省略表达式——换句话说，这些是等价的：

<!-- prettier-ignore -->
```svelte
<input bind:value={value} />
<input bind:value />
```


Svelte 创建一个事件监听器来更新绑定的值。如果元素已经有相同事件的监听器，该监听器将在绑定值更新之前触发。

大多数绑定是**双向的**，这意味着对值的更改将影响元素，反之亦然。少数绑定是**只读的**，这意味着更改它们的值不会对元素产生影响。

## 函数绑定

你也可以使用 `bind:property={get, set}`，其中 `get` 和 `set` 是函数，允许你执行验证和转换：

```svelte
<input bind:value={
	() => value,
	(v) => value = v.toLowerCase()}
/>
```

在只读绑定（如[尺寸绑定](#Dimensions)）的情况下，`get` 值应该是 `null`：

```svelte
<div
	bind:clientWidth={null, redraw}
	bind:clientHeight={null, redraw}
>...</div>
```

> [!NOTE]
> 函数绑定在 Svelte 5.9.0 及更新版本中可用。

## `<input bind:value>`

`<input>` 元素上的 `bind:value` 指令绑定输入的 `value` 属性：

<!-- prettier-ignore -->
```svelte
<script>
	let message = $state('hello');
</script>

<input bind:value={message} />
<p>{message}</p>
```

在数字输入（`type="number"` 或 `type="range"`）的情况下，值将被强制转换为数字：

<!-- codeblock:start {"title":"数字绑定"} -->
```svelte
<!--- file: App.svelte --->
<script>
	let a = $state(1);
	let b = $state(2);
</script>

<label>
	<input type="number" bind:value={a} min="0" max="10" />
	<input type="range" bind:value={a} min="0" max="10" />
</label>

<label>
	<input type="number" bind:value={b} min="0" max="10" />
	<input type="range" bind:value={b} min="0" max="10" />
</label>

<p>{a} + {b} = {a + b}</p>
```
<!-- codeblock:end -->

如果输入为空或无效（在 `type="number"` 的情况下），值为 `undefined`。

从 5.6.0 开始，如果 `<input>` 有 `defaultValue` 并且是表单的一部分，当表单重置时它将恢复到该值而不是空字符串。请注意，对于初始渲染，绑定的值优先，除非它是 `null` 或 `undefined`。

```svelte
<script>
	let value = $state('');
</script>

<form>
	<input bind:value defaultValue="不是空字符串">
	<input type="reset" value="重置">
</form>
```

> [!NOTE]
> 谨慎使用重置按钮，并确保用户在尝试提交表单时不会意外点击它们。

## `<input bind:checked>`

复选框输入可以使用 `bind:checked` 绑定：

```svelte
<label>
	<input type="checkbox" bind:checked={accepted} />
	接受条款和条件
</label>
```

从 5.6.0 开始，如果 `<input>` 有 `defaultChecked` 属性并且是表单的一部分，当表单重置时它将恢复到该值而不是 `false`。请注意，对于初始渲染，绑定的值优先，除非它是 `null` 或 `undefined`。

```svelte
<script>
	let checked = $state(true);
</script>

<form>
	<input type="checkbox" bind:checked defaultChecked={true}>
	<input type="reset" value="重置">
</form>
```

> [!NOTE] 对于单选输入，使用 `bind:group` 而不是 `bind:checked`。

## `<input bind:indeterminate>`

复选框可以处于[不确定](https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/indeterminate)状态，独立于它们是否被选中：

```svelte
<script>
	let checked = $state(false);
	let indeterminate = $state(true);
</script>

<form>
	<input type="checkbox" bind:checked bind:indeterminate>

	{#if indeterminate}
		等待中...
	{:else if checked}
		已选中
	{:else}
		未选中
	{/if}
</form>
```

## `<input bind:group>`

一起工作的输入可以使用 `bind:group`：

<!-- codeblock:start {"title":"bind:group"} -->
```svelte
<!--- file: App.svelte --->
<script>
	let tortilla = $state('Plain');

	/** @type {string[]} */
	let fillings = $state([]);
</script>

<h1>定制你的墨西哥卷饼</h1>

<!-- 分组的单选输入是互斥的 -->
<label><input type="radio" bind:group={tortilla} value="Plain" /> 原味</label>
<label><input type="radio" bind:group={tortilla} value="Whole wheat" /> 全麦</label>
<label><input type="radio" bind:group={tortilla} value="Spinach" /> 菠菜</label>

<!-- 分组的复选框输入填充数组 -->
<label><input type="checkbox" bind:group={fillings} value="Rice" /> 米饭</label>
<label><input type="checkbox" bind:group={fillings} value="Beans" /> 豆子</label>
<label><input type="checkbox" bind:group={fillings} value="Cheese" /> 奶酪</label>
<label><input type="checkbox" bind:group={fillings} value="Guac (extra)" /> 鳄梨酱（额外）</label>

<p>玉米饼：{tortilla}</p>
<p>馅料：{fillings.join(', ') || '无'}</p>

<style>
	label {
		display: block;
	}
</style>
```
<!-- codeblock:end -->

> [!NOTE] `bind:group` 仅在输入位于同一 Svelte 组件中时才有效。

## `<input bind:files>`

在 `type="file"` 的 `<input>` 元素上，你可以使用 `bind:files` 来获取[选定文件的 `FileList`](https://developer.mozilla.org/en-US/docs/Web/API/FileList)。当你想以编程方式更新文件时，你总是需要使用 `FileList` 对象。目前 `FileList` 对象不能直接构造，因此你需要创建一个新的 [`DataTransfer`](https://developer.mozilla.org/en-US/docs/Web/API/DataTransfer) 对象并从那里获取 `files`。

```svelte
<script>
	let files = $state();

	function clear() {
		files = new DataTransfer().files; // null 或 undefined 不起作用
	}
</script>

<label for="avatar">上传图片：</label>
<input accept="image/png, image/jpeg" bind:files id="avatar" name="avatar" type="file" />
<button onclick={clear}>清除</button>
```

`FileList` 对象也不能被修改，因此如果你想例如从列表中删除单个文件，你需要创建一个新的 `DataTransfer` 对象并添加你想保留的文件。

> [!NOTE] `DataTransfer` 可能在服务端 JS 运行时中不可用。如果组件是服务端渲染的，将绑定到 `files` 的状态保持未初始化可以防止潜在错误。

## `<select bind:value>`

`<select>` 值绑定对应于所选 `<option>` 上的 `value` 属性，它可以是任何值（不仅仅是字符串，这在 DOM 中通常是这种情况）。

```svelte
<select bind:value={selected}>
	<option value={a}>a</option>
	<option value={b}>b</option>
	<option value={c}>c</option>
</select>
```

`<select multiple>` 元素的行为类似于复选框组。绑定的变量是一个数组，每个选定的 `<option>` 的 `value` 属性都有一个条目。

```svelte
<select multiple bind:value={fillings}>
	<option value="Rice">米饭</option>
	<option value="Beans">豆子</option>
	<option value="Cheese">奶酪</option>
	<option value="Guac (extra)">鳄梨酱（额外）</option>
</select>
```

当 `<option>` 的值与其文本内容匹配时，可以省略该属性。

```svelte
<select multiple bind:value={fillings}>
	<option>米饭</option>
	<option>豆子</option>
	<option>奶酪</option>
	<option>鳄梨酱（额外）</option>
</select>
```

你可以通过向应该初始选定的 `<option>`（在 `<select multiple>` 的情况下为多个选项）添加 `selected` 属性来为 `<select>` 提供默认值。如果 `<select>` 是表单的一部分，当表单重置时它将恢复到该选择。请注意，对于初始渲染，如果绑定的值不是 `undefined`，则它优先。

```svelte
<select bind:value={selected}>
	<option value={a}>a</option>
	<option value={b} selected>b</option>
	<option value={c}>c</option>
</select>
```

## `<audio>`

`<audio>` 元素有自己的一组绑定——五个双向绑定……

- [`currentTime`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/currentTime)
- [`playbackRate`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/playbackRate)
- [`paused`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/paused)
- [`volume`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/volume)
- [`muted`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/muted)

……和六个只读绑定：

- [`duration`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/duration)
- [`buffered`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/buffered)
- [`seekable`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/seekable)
- [`seeking`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/seeking_event)
- [`ended`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/ended)
- [`readyState`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/readyState)
- [`played`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/played)

```svelte
<audio src={clip} bind:duration bind:currentTime bind:paused></audio>
```

## `<video>`

`<video>` 元素具有与 [`<audio>`](#audio) 元素相同的所有绑定，加上只读的 [`videoWidth`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLVideoElement/videoWidth) 和 [`videoHeight`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLVideoElement/videoHeight) 绑定。

## `<img>`

`<img>` 元素有两个只读绑定：

- [`naturalWidth`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement/naturalWidth)
- [`naturalHeight`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement/naturalHeight)

## `<details bind:open>`

`<details>` 元素支持绑定到 `open` 属性。

```svelte
<details bind:open={isOpen}>
	<summary>你如何安慰一个 JavaScript bug？</summary>
	<p>你 console 它。</p>
</details>
```

## `window` 和 `document`

要绑定到 `window` 和 `document` 的属性，请参阅 [`<svelte:window>`](svelte-window) 和 [`<svelte:document>`](svelte-document)。

## Contenteditable 绑定

具有 `contenteditable` 属性的元素支持以下绑定：

- [`innerHTML`](https://developer.mozilla.org/en-US/docs/Web/API/Element/innerHTML)
- [`innerText`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/innerText)
- [`textContent`](https://developer.mozilla.org/en-US/docs/Web/API/Node/textContent)

> [!NOTE] `innerText` 和 `textContent` 之间存在[细微差别](https://developer.mozilla.org/en-US/docs/Web/API/Node/textContent#differences_from_innertext)。

<!-- for some reason puts the comment and html on same line -->
<!-- prettier-ignore -->
```svelte
<div contenteditable="true" bind:innerHTML={html}></div>
```

## 尺寸

所有可见元素都有以下只读绑定，使用 `ResizeObserver` 测量：

- [`clientWidth`](https://developer.mozilla.org/en-US/docs/Web/API/Element/clientWidth)
- [`clientHeight`](https://developer.mozilla.org/en-US/docs/Web/API/Element/clientHeight)
- [`offsetWidth`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/offsetWidth)
- [`offsetHeight`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/offsetHeight)
- [`contentRect`](https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserverEntry/contentRect)
- [`contentBoxSize`](https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserverEntry/contentBoxSize)
- [`borderBoxSize`](https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserverEntry/borderBoxSize)
- [`devicePixelContentBoxSize`](https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserverEntry/devicePixelContentBoxSize)

```svelte
<div bind:offsetWidth={width} bind:offsetHeight={height}>
	<Chart {width} {height} />
</div>
```

> [!NOTE] `display: inline` 元素没有宽度或高度（除了具有"固有"尺寸的元素，如 `<img>` 和 `<canvas>`），并且不能使用 `ResizeObserver` 观察。你需要将这些元素的 `display` 样式更改为其他样式，例如 `inline-block`。请注意，CSS 变换不会触发 `ResizeObserver` 回调。

## bind:this

```svelte
<!--- copy: false --->
bind:this={dom_node}
```

要获取对 DOM 节点的引用，使用 `bind:this`。值将是 `undefined`，直到组件挂载——换句话说，你应该在副作用或事件处理器中读取它，而不是在组件初始化期间：

```svelte
<script>
	/** @type {HTMLCanvasElement} */
	let canvas;

	$effect(() => {
		const ctx = canvas.getContext('2d');
		drawStuff(ctx);
	});
</script>

<canvas bind:this={canvas}></canvas>
```

组件也支持 `bind:this`，允许你以编程方式与组件实例交互。

```svelte
<!--- file: App.svelte --->
<ShoppingCart bind:this={cart} />

<button onclick={() => cart.empty()}> 清空购物车 </button>
```

```svelte
<!--- file: ShoppingCart.svelte --->
<script>
	// 所有实例导出都在实例对象上可用
	export function empty() {
		// ...
	}
</script>
```

> [!NOTE] 在使用[函数绑定](#Function-bindings)的情况下，需要 getter 以确保在组件或元素销毁时正确地将值设为 null。

## bind:_property_ 用于组件

```svelte
bind:property={variable}
```

你可以使用与元素相同的语法绑定到组件 props。

```svelte
<Keypad bind:value={pin} />
```

虽然 Svelte props 在没有绑定的情况下是响应式的，但该响应性默认只向下流入组件。使用 `bind:property` 允许属性的更改从组件内部向上流回组件外部。

要将属性标记为可绑定，使用 [`$bindable`]($bindable) 符文：

```svelte
<script>
	let { readonlyProperty, bindableProperty = $bindable() } = $props();
</script>
```

将属性声明为可绑定意味着它**可以**使用 `bind:` 使用，而不是**必须**使用 `bind:` 使用。

可绑定属性可以有回退值：

```svelte
<script>
	let { bindableProperty = $bindable('回退值') } = $props();
</script>
```

此回退值**仅**在属性**未**绑定时适用。当属性被绑定且存在回退值时，父级应提供除 `undefined` 之外的值，否则会抛出运行时错误。这可以防止难以推理的情况，即不清楚应该应用哪个值。
