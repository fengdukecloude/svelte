---
title: 响应式 $: 语句
---

在 runes 模式下，对状态更新的反应使用 [`$derived`]($derived) 和 [`$effect`]($effect) runes 处理。

在遗留模式下，任何顶层语句（即不在块或函数内部）都可以通过在其前面加上 `$:` [标签](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/label)来变为响应式。这些语句在 `<script>` 中的其他代码之后、组件标记渲染之前运行，然后在它们依赖的值发生变化时运行。

```svelte
<script>
	let a = 1;
	let b = 2;

	// this is a 'reactive statement', and it will re-run
	// when `a`, `b` or `sum` change
	$: console.log(`${a} + ${b} = ${sum}`);

	// this is a 'reactive assignment' — `sum` will be
	// recalculated when `a` or `b` change. It is
	// not necessary to declare `sum` separately
	$: sum = a + b;
</script>
```

语句按其依赖关系和赋值进行 _拓扑_ 排序：由于 `console.log` 语句依赖于 `sum`，即使它在源代码中出现得更晚，`sum` 也会先被计算。

可以通过将多个语句放在一个块中来组合它们：

```js
// @noErrors
$: {
	// recalculate `total` when `items` changes
	total = 0;

	for (const item of items) {
		total += item.value;
	}
}
```

响应式赋值的左侧可以是标识符，也可以是解构赋值：

```js
// @noErrors
$: ({ larry, moe, curly } = stooges);
```

## 理解依赖关系

`$:` 语句的依赖关系在编译时确定——它们是语句内部引用（但未赋值）的任何变量。

换句话说，像这样的语句在 `count` 变化时 _不会_ 重新运行，因为编译器无法"看到"依赖关系：

```js
// @noErrors
let count = 0;
let double = () => count * 2;

$: doubled = double();
```

类似地，如果依赖关系被间接引用，拓扑排序将失败：`z` 永远不会更新，因为当更新发生时 `y` 不被认为是"脏的"。将 `$: z = y` 移到 `$: setY(x)` 下面可以解决这个问题：

```svelte
<script>
	let x = 0;
	let y = 0;

	$: z = y;
	$: setY(x);

	function setY(value) {
		y = value;
	}
</script>
```

## 仅浏览器代码

响应式语句在服务器端渲染和浏览器中都会运行。这意味着任何只应在浏览器中运行的代码都必须包装在 `if` 块中：

```js
// @noErrors
$: if (browser) {
	document.title = title;
}
```
