---
title: <slot>
---

在 Svelte 5 中，内容可以以 [snippets](snippet) 的形式传递给组件，并使用 [render 标签](@render) 渲染。

在遗留模式下，组件标签内的内容被视为 _插槽内容_，可以由组件使用 `<slot>` 元素渲染：

```svelte
<!--- file: App.svelte --->
<script>
	import Modal from './Modal.svelte';
</script>

<Modal>This is some slotted content</Modal>
```

```svelte
<!--- file: Modal.svelte --->
<div class="modal">
	<slot></slot>
</div>
```

> [!NOTE] 如果你想渲染常规的 `<slot>` 元素，可以使用 `<svelte:element this={'slot'} />`。

## 命名插槽

组件除了默认插槽外还可以有 _命名_ 插槽。在父组件侧，向直接位于组件标签内的元素、组件或 [`<svelte:fragment>`](legacy-svelte-fragment) 添加 `slot="..."` 属性。

```svelte
<!--- file: App.svelte --->
<script>
	import Modal from './Modal.svelte';

	let open = true;
</script>

{#if open}
	<Modal>
		This is some slotted content

		+++<div slot="buttons">+++
			<button on:click={() => open = false}>
				close
			</button>
		+++</div>+++
	</Modal>
{/if}
```

在子组件侧，添加相应的 `<slot name="...">` 元素：

```svelte
<!--- file: Modal.svelte --->
<div class="modal">
	<slot></slot>
	<hr>
	+++<slot name="buttons"></slot>+++
</div>
```

## 后备内容

如果没有提供插槽内容，组件可以通过将其放在 `<slot>` 元素内来定义后备内容：

```svelte
<slot>
	This will be rendered if no slotted content is provided
</slot>
```

## 向插槽内容传递数据

插槽可以渲染零次或多次，并且可以使用 props 将值 _传回_ 给父组件。父组件使用 `let:` 指令向插槽模板公开值。

```svelte
<!--- file: FancyList.svelte --->
<ul>
	{#each items as data}
		<li class="fancy">
			<!-- 'item' here... -->
			<slot item={process(data)} />
		</li>
	{/each}
</ul>
```

```svelte
<!--- file: App.svelte --->
<!-- ...corresponds to 'item' here: -->
<FancyList {items} let:item={processed}>
	<div>{processed.text}</div>
</FancyList>
```

通常的简写规则适用——`let:item` 等同于 `let:item={item}`，`<slot {item}>` 等同于 `<slot item={item}>`。

命名插槽也可以公开值。`let:` 指令放在具有 `slot` 属性的元素上。

```svelte
<!--- file: FancyList.svelte --->
<ul>
	{#each items as item}
		<li class="fancy">
			<slot name="item" item={process(data)} />
		</li>
	{/each}
</ul>

<slot name="footer" />
```

```svelte
<!--- file: App.svelte --->
<FancyList {items}>
	<div slot="item" let:item>{item.text}</div>
	<p slot="footer">Copyright (c) 2019 Svelte Industries</p>
</FancyList>
```


