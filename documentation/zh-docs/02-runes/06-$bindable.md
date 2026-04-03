---
title: $bindable
---

通常，props 是单向的，从父级到子级。这使得理解数据如何在应用中流动变得容易。

在 Svelte 中，组件 props 可以被**绑定**，这意味着数据也可以从子级**向上**流向父级。这不是你应该经常做的事情——过度使用会使你的数据流变得不可预测，并使组件更难维护——但如果谨慎使用，它可以简化你的代码。

这也意味着状态代理可以在子级中被**修改**。

> [!NOTE] 使用普通 props 也可以进行修改，但强烈不建议这样做——如果 Svelte 检测到组件正在修改它不"拥有"的状态，它会发出警告。

要将 prop 标记为可绑定，我们使用 `$bindable` 符文：

<!-- prettier-ignore -->
```svelte
/// file: FancyInput.svelte
<script>
	let { value = $bindable(), ...props } = $props();
</script>

<input bind:value={value} {...props} />

<style>
	input {
		font-family: 'Comic Sans MS';
		color: deeppink;
	}
</style>
```

现在，使用 `<FancyInput>` 的组件可以添加 [`bind:`](bind) 指令（[演示](/playground/untitled#H4sIAAAAAAAAE3WQwWrDMBBEf2URBSfg2nfFMZRCoYeecqx6UJx1IyqvhLUONcb_XqSkTUOSk1az7DBvJtEai0HI90nw6FHIJIhckO7i78n7IhzQctS2OuAtvXHESByEFFVoeuO5VqTYdN71DC-amvGV_MDQ9q6DrCjP0skkWymKJxYZOgxBfyKs4SGwZlxke7TWZcuVoqo8-1P1z3lraCcP2g64nk4GM5S1osrXf0JV-lrkgvGbheR-wDm_g30V8JL-1vpOCZFogpQsEsWcemtxscyhKArfOx9gjps0Lq4hzRVfemaYfu-PoIqqwKPFY_XpaIqj4tYRP7a6M3aUkD27zjSw0RTgbZN6Z8WNs66XsEP03tBXUueUJFlelvYx_wCuI3leNwIAAA==)）：

<!-- prettier-ignore -->
```svelte
/// file: App.svelte
<script>
	import FancyInput from './FancyInput.svelte';

	let message = $state('hello');
</script>

<FancyInput bind:value={message} />
<p>{message}</p>
```

父组件**不必**使用 `bind:`——它可以只传递一个普通的 prop。有些父级不想听他们的孩子要说什么。

在这种情况下，你可以为完全没有传递 prop 时指定一个回退值：

```js
/// file: FancyInput.svelte
let { value = $bindable('fallback'), ...props } = $props();
```
