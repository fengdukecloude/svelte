---
title: {#snippet ...}
---

```svelte
<!--- copy: false  --->
{#snippet name()}...{/snippet}
```

```svelte
<!--- copy: false  --->
{#snippet name(param1, param2, paramN)}...{/snippet}
```

代码片段和 [render 标签](@render) 是在组件内创建可重用标记块的一种方式。与其编写像[这样](/playground/untitled#H4sIAAAAAAAAE5VUYW-kIBD9K8Tmsm2yXXRzvQ-s3eR-R-0HqqOQKhAZb9sz_vdDkV1t000vRmHewMx7w2AflbIGG7GnPlK8gYhFv42JthG-m9Gwf6BGcLbVXZuPSGrzVho8ZirDGpDIhldgySN5GpEMez9kaNuckY1ANJZRamRuu2ZnhEZt6a84pvs43mzD4pMsUDDi8DMkQFYCGdkvsJwblFq5uCik9bmJ4JZwUkv1eoknWigX2eGNN6aGXa6bjV8ybP-X7sM36T58SVcrIIV2xVIaA41xeD5kKqWXuqpUJEefOqVuOkL9DfBchGrzWfu0vb-RpTd3o-zBR045Ga3HfuE5BmJpKauuhbPtENlUF2sqR9jqpsPSxWsMrlngyj3VJiyYjJXb1-lMa7IWC-iSk2M5Zzh-SJjShe-siq5kpZRPs55BbSGU5YPyte4vVV_VfFXxVb10dSLf17pS2lM5HnpPxw4Zpv6x-F57p0jI3OKlVnhv5V9wPQrNYQQ9D_f6aGHlC89fq1Z3qmDkJCTCweOGF4VUFSPJvD_DhreVdA0eu8ehJJ5x91dBaBkpWm3ureCFPt3uzRv56d4kdp-2euG38XZ6dsnd3ZmPG9yRBCrzRUvi-MccOdwz3qE-fOZ7AwAhlrtTUx3c76vRhSwlFBHDtoPhefgHX3dM0PkEAAA=)的重复代码……

```svelte
{#each images as image}
	{#if image.href}
		<a href={image.href}>
			<figure>
				<img src={image.src} alt={image.caption} width={image.width} height={image.height} />
				<figcaption>{image.caption}</figcaption>
			</figure>
		</a>
	{:else}
		<figure>
			<img src={image.src} alt={image.caption} width={image.width} height={image.height} />
			<figcaption>{image.caption}</figcaption>
		</figure>
	{/if}
{/each}
```

……你可以编写[这样](/playground/untitled#H4sIAAAAAAAAE5VUYW-bMBD9KxbRlERKY4jWfSA02n5H6QcXDmwVbMs-lnaI_z6D7TTt1moTAnPvzvfenQ_GpBEd2CS_HxPJekjy5IfWyS7BFz0b9id0CM62ajDVjBS2MkLjqZQldoBE9KwFS-7I_YyUOPqlRGuqnKw5orY5pVpUduj3mitUln5LU3pI0_UuBp9FjTwnDr9AHETLMSeHK6xiGoWSLi9yYT034cwSRjohn17zcQPNFTs8s153sK9Uv_Yh0-5_5d7-o9zbD-UqCaRWrllSYZQxLw_HUhb0ta-y4NnJUxfUvc7QuLJSaO0a3oh2MLBZat8u-wsPnXzKQvTtVVF34xK5d69ThFmHEQ4SpzeVRediTG8rjD5vBSeN3E5JyHh6R1DQK9-iml5kjzQUN_lSgVU8DhYLx7wwjSvRkMDvTjiwF4zM1kXZ7DlF1eN3A7IG85e-zRrYEjjm0FkI4Cc7Ripm0pHOChexhcWXzreeZyRMU6Mk3ljxC9w4QH-cQZ_b3T5pjHxk1VNr1CDrnJy5QDh6XLO6FrLNSRb2l9gz0wo3S6m7HErSgLsPGMHkpDZK31jOanXeHPQz-eruLHUP0z6yTbpbrn223V70uMXNSpQSZjpL0y8hcxxpNqA6_ql3BQAxlxvfpQ_uT9GrWjQC6iRHM8D0MP0GQsIi92QEAAA=)：

```svelte
{#snippet figure(image)}
	<figure>
		<img src={image.src} alt={image.caption} width={image.width} height={image.height} />
		<figcaption>{image.caption}</figcaption>
	</figure>
{/snippet}

{#each images as image}
	{#if image.href}
		<a href={image.href}>
			{@render figure(image)}
		</a>
	{:else}
		{@render figure(image)}
	{/if}
{/each}
```

像函数声明一样，代码片段可以有任意数量的参数，这些参数可以有默认值，你可以解构每个参数。但是，你不能使用剩余参数。

## 代码片段作用域

代码片段可以在组件内的任何地方声明。它们可以引用在它们之外声明的值，例如在 `<script>` 标签中或在 `{#each ...}` 块中……

<!-- codeblock:start {"title":"代码片段"} -->
```svelte
<!--- file: App.svelte --->
<script>
	let { message = `很高兴见到你！` } = $props();
</script>

{#snippet hello(name)}
	<p>你好 {name}！{message}！</p>
{/snippet}

{@render hello('alice')}
{@render hello('bob')}
```
<!-- codeblock:end -->

……它们对同一词法作用域中的所有内容"可见"（即兄弟节点和这些兄弟节点的子节点）：

```svelte
<div>
	{#snippet x()}
		{#snippet y()}...{/snippet}

		<!-- 这没问题 -->
		{@render y()}
	{/snippet}

	<!-- 这会报错，因为 `y` 不在作用域内 -->
	{@render y()}
</div>

<!-- 这也会报错，因为 `x` 不在作用域内 -->
{@render x()}
```

代码片段可以引用自己和彼此：

<!-- codeblock:start {"title":"自引用代码片段"} -->
```svelte
<!--- file: App.svelte --->
{#snippet blastoff()}
	<span>🚀</span>
{/snippet}

{#snippet countdown(n)}
	{#if n > 0}
		<span>{n}...</span>
		{@render countdown(n - 1)}
	{:else}
		{@render blastoff()}
	{/if}
{/snippet}

{@render countdown(10)}
```
<!-- codeblock:end -->

## 将代码片段传递给组件

### 显式 props

在模板中，代码片段是像任何其他值一样的值。因此，它们可以作为 props 传递给组件：

<!-- codeblock:start {"title":"显式代码片段 props"} -->
```svelte
<!--- file: App.svelte --->
<script>
	import Table from './Table.svelte';

	const fruits = [
		{ name: '苹果', qty: 5, price: 2 },
		{ name: '香蕉', qty: 10, price: 1 },
		{ name: '樱桃', qty: 20, price: 0.5 }
	];
</script>

{#snippet header()}
	<th>水果</th>
	<th>数量</th>
	<th>价格</th>
	<th>总计</th>
{/snippet}

{#snippet row(d)}
	<td>{d.name}</td>
	<td>{d.qty}</td>
	<td>{d.price}</td>
	<td>{d.qty * d.price}</td>
{/snippet}

<Table data={fruits} {header} {row} />
```

```svelte
<!--- file: Table.svelte --->
<script>
	let { data, header, row } = $props();
</script>

<table>
	{#if header}
		<thead>
			<tr>{@render header()}</tr>
		</thead>
	{/if}

	<tbody>
		{#each data as d}
			<tr>{@render row(d)}</tr>
		{/each}
	</tbody>
</table>

<style>
	table {
		text-align: left;
		border-spacing: 0;
	}

	tbody tr:nth-child(2n+1) {
		background: ButtonFace;
	}

	table :global(th), table :global(td) {
		padding: 0.5em;
	}
</style>
```
<!-- codeblock:end -->

可以将其视为向组件传递内容而不是数据。这个概念类似于 Web 组件中的插槽。

### 隐式 props

作为编写便利，直接在组件**内部**声明的代码片段隐式成为组件**上**的 props：

<!-- codeblock:start {"title":"隐式代码片段 props"} -->
```svelte
<!--- file: App.svelte --->
<script>
	import Table from './Table.svelte';

	const fruits = [
		{ name: '苹果', qty: 5, price: 2 },
		{ name: '香蕉', qty: 10, price: 1 },
		{ name: '樱桃', qty: 20, price: 0.5 }
	];
</script>

<Table data={fruits}>
	{#snippet header()}
		<th>水果</th>
		<th>数量</th>
		<th>价格</th>
		<th>总计</th>
	{/snippet}

	{#snippet row(d)}
		<td>{d.name}</td>
		<td>{d.qty}</td>
		<td>{d.price}</td>
		<td>{d.qty * d.price}</td>
	{/snippet}
</Table>
```

```svelte
<!--- file: Table.svelte --->
<script>
	let { data, header, row } = $props();
</script>

<table>
	{#if header}
		<thead>
			<tr>{@render header()}</tr>
		</thead>
	{/if}

	<tbody>
		{#each data as d}
			<tr>{@render row(d)}</tr>
		{/each}
	</tbody>
</table>

<style>
	table {
		text-align: left;
		border-spacing: 0;
	}

	tbody tr:nth-child(2n+1) {
		background: ButtonFace;
	}

	table :global(th), table :global(td) {
		padding: 0.5em;
	}
</style>
```
<!-- codeblock:end -->

### 隐式 `children` 代码片段

组件标签内**不是**代码片段声明的任何内容隐式成为 `children` 代码片段的一部分：

<!-- codeblock:start {"title":"隐式 children 代码片段","selected":"Button.svelte"} -->
```svelte
<!--- file: App.svelte --->
<script>
	import Button from './Button.svelte';
</script>

<Button>点击我</Button>
```

```svelte
<!--- file: Button.svelte --->
<script>
	let { children } = $props();
</script>

<!-- 结果将是 <button>点击我</button> -->
<button>{@render children()}</button>
```
<!-- codeblock:end -->

> [!NOTE] 注意，如果你在组件内部也有内容，则不能有名为 `children` 的 prop——因此，你应该避免使用该名称的 props

### 可选的代码片段 props

你可以将代码片段 props 声明为可选的。你可以使用可选链在代码片段未设置时不渲染任何内容……

```svelte
<script>
    let { children } = $props();
</script>

{@render children?.()}
```

……或使用 `#if` 块来渲染回退内容：

```svelte
<script>
    let { children } = $props();
</script>

{#if children}
    {@render children()}
{:else}
    回退内容
{/if}
```

## 类型化代码片段

代码片段实现了从 `'svelte'` 导入的 `Snippet` 接口：

```svelte
<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		data: any[];
		children: Snippet;
		row: Snippet<[any]>;
	}

	let { data, children, row }: Props = $props();
</script>
```

通过此更改，如果你尝试在不提供 `data` prop 和 `row` 代码片段的情况下使用组件，将出现红色波浪线。请注意，提供给 `Snippet` 的类型参数是一个元组，因为代码片段可以有多个参数。

我们可以通过声明泛型来进一步收紧，以便 `data` 和 `row` 引用相同的类型：

```svelte
<script lang="ts" generics="T">
	import type { Snippet } from 'svelte';

	let {
		data,
		children,
		row
	}: {
		data: T[];
		children: Snippet;
		row: Snippet<[T]>;
	} = $props();
</script>
```

## 导出代码片段

在 `.svelte` 文件顶层声明的代码片段可以从 `<script module>` 导出以在其他组件中使用，前提是它们不引用非模块 `<script>` 中的任何声明（无论是直接还是通过其他代码片段间接引用）：

<!-- codeblock:start {"title":"导出的代码片段","selected":"snippets.svelte"} -->
```svelte
<!--- file: App.svelte --->
<script>
	import { add } from './snippets.svelte';
</script>

{@render add(1, 2)}

```

```svelte
<!--- file: snippets.svelte --->
<script module>
	export { add };
</script>

{#snippet add(a, b)}
	{a} + {b} = {a + b}
{/snippet}
```
<!-- codeblock:end -->

> [!NOTE]
> 这需要 Svelte 5.5.0 或更新版本

## 编程式代码片段

可以使用 [`createRawSnippet`](svelte#createRawSnippet) API 以编程方式创建代码片段。这适用于高级用例。

## 代码片段和插槽

在 Svelte 4 中，可以使用[插槽](legacy-slots)将内容传递给组件。代码片段更强大且更灵活，因此插槽在 Svelte 5 中已被弃用。
