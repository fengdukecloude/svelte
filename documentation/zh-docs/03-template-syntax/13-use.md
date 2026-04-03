---
title: use:
---

> [!NOTE]
> 在 Svelte 5.29 及更新版本中，请考虑使用[附件](@attach)，因为它们更灵活且可组合。

动作是在元素挂载时调用的函数。它们使用 `use:` 指令添加，并且通常会使用 `$effect`，以便在元素卸载时可以重置任何状态：

```svelte
<!--- file: App.svelte --->
<script>
	/** @type {import('svelte/action').Action} */
	function myaction(node) {
		// 节点已挂载到 DOM 中

		$effect(() => {
			// 设置代码在这里

			return () => {
				// 清理代码在这里
			};
		});
	}
</script>

<div use:myaction>...</div>
```

动作可以使用参数调用：

```svelte
<!--- file: App.svelte --->
<script>
	/** @type {import('svelte/action').Action} */
	function myaction(node, data) {
		// ...
	}
</script>

<div use:myaction={data}>...</div>
```

动作只调用一次（但不在服务端渲染期间）——如果参数改变，它**不会**再次运行。

> [!LEGACY]
> 在 `$effect` 符文之前，动作可以返回一个带有 `update` 和 `destroy` 方法的对象，其中 `update` 会在参数改变时使用最新值调用。使用副作用是首选方式。

## 类型化

`Action` 接口接收三个可选的类型参数——节点类型（如果动作适用于所有内容，可以是 `Element`）、参数和动作创建的任何自定义事件处理器：

```svelte
<!--- file: App.svelte --->
<script>
	/**
	 * @type {import('svelte/action').Action<
	 * 	HTMLDivElement,
	 * 	undefined,
	 * 	{
	 * 		onswiperight: (e: CustomEvent) => void;
	 * 		onswipeleft: (e: CustomEvent) => void;
	 * 		// ...
	 * 	}
	 * >}
	 */
	function gestures(node) {
		$effect(() => {
			// ...
			node.dispatchEvent(new CustomEvent('swipeleft'));

			// ...
			node.dispatchEvent(new CustomEvent('swiperight'));
		});
	}
</script>

<div
	use:gestures
	onswipeleft={next}
	onswiperight={prev}
>...</div>
```
