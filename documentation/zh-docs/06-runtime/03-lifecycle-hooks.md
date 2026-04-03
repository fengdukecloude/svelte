---
title: 生命周期钩子
---

<!-- - onMount/onDestroy
- mention that `$effect` might be better for your use case
- beforeUpdate/afterUpdate with deprecation notice?
- or skip this entirely and only have it in the reference docs? -->

在 Svelte 5 中，组件生命周期仅包含两个部分：创建和销毁。其间的所有内容——当某些状态更新时——与整个组件无关；只有需要对状态更改做出反应的部分会收到通知。这是因为在底层，最小的更改单元实际上不是组件，而是组件在组件初始化时设置的（渲染）副作用。因此，不存在"更新前"/"更新后"钩子这样的东西。

## `onMount`

`onMount` 函数安排一个回调，在组件挂载到 DOM 后立即运行。它必须在组件初始化期间调用（但不需要**在**组件内部；可以从外部模块调用）。

`onMount` 不会在服务端渲染的组件内运行。

```svelte
<script>
	import { onMount } from 'svelte';

	onMount(() => {
		console.log('组件已挂载');
	});
</script>
```

如果从 `onMount` 返回一个函数，它将在组件卸载时调用。

```svelte
<script>
	import { onMount } from 'svelte';

	onMount(() => {
		const interval = setInterval(() => {
			console.log('beep');
		}, 1000);

		return () => clearInterval(interval);
	});
</script>
```

> [!NOTE] 此行为仅在传递给 `onMount` 的函数是**同步**时才有效。`async` 函数始终返回 `Promise`。

## `onDestroy`

安排一个回调在组件卸载之前立即运行。

在 `onMount`、`beforeUpdate`、`afterUpdate` 和 `onDestroy` 中，这是唯一在服务端组件内运行的。

```svelte
<script>
	import { onDestroy } from 'svelte';

	onDestroy(() => {
		console.log('组件正在被销毁');
	});
</script>
```

## `tick`

虽然没有"更新后"钩子，但你可以使用 `tick` 来确保在继续之前更新 UI。`tick` 返回一个 promise，该 promise 在应用任何待处理的状态更改后解析，如果没有待处理的状态更改，则在下一个微任务中解析。

```svelte
<script>
	import { tick } from 'svelte';

	$effect.pre(() => {
		console.log('组件即将更新');
		tick().then(() => {
				console.log('组件刚刚更新');
		});
	});
</script>
```

## 已弃用：`beforeUpdate` / `afterUpdate`

Svelte 4 包含在整个组件更新前后运行的钩子。为了向后兼容，这些钩子在 Svelte 5 中被模拟，但在使用符文的组件内不可用。

```svelte
<script>
	import { beforeUpdate, afterUpdate } from 'svelte';

	beforeUpdate(() => {
		console.log('组件即将更新');
	});

	afterUpdate(() => {
		console.log('组件刚刚更新');
	});
</script>
```

使用 `$effect.pre` 代替 `beforeUpdate`，使用 `$effect` 代替 `afterUpdate`——这些符文提供了更细粒度的控制，并且只对你真正感兴趣的更改做出反应。

### 聊天窗口示例

要实现一个在新消息出现时自动滚动到底部的聊天窗口（但仅当你**已经**滚动到底部时），我们需要在更新 DOM 之前测量它。

在 Svelte 4 中，我们使用 `beforeUpdate` 来做到这一点，但这是一种有缺陷的方法——它在**每次**更新之前触发，无论是否相关。在下面的示例中，我们需要引入像 `updatingMessages` 这样的检查，以确保在有人切换深色模式时不会弄乱滚动位置。

使用符文，我们可以使用 `$effect.pre`，它的行为与 `$effect` 相同，但在 DOM 更新之前运行。只要我们在副作用主体内显式引用 `messages`，它就会在 `messages` 更改时运行，但**不会**在 `theme` 更改时运行。

因此，`beforeUpdate` 及其同样麻烦的对应物 `afterUpdate` 在 Svelte 5 中已被弃用。

- [之前](/playground/untitled#H4sIAAAAAAAAE31WXa_bNgz9K6yL1QmWOLlrC-w6H8MeBgwY9tY9NfdBtmlbiywZkpyPBfnvo2zLcZK28AWuRPGI5OGhkEuQc4EmiL9eAskqDOLg97oOZoE9125jDigs0t6oRqfOsjap5rXd7uTO8qpW2sIFEsyVxn_qjFmcAcstar-xPN3DFXKtKgi768IVgQku0ELj3Lgs_kZjWIEGNpAzYXDlHWyJFZI1zJjeh4O5uvl_DY8oUkVeVoFuJKYls-_CGYS25Aboj0EtWNqel0wWoBoLTGZgmdgDS9zW4Uz4NsrswPHoyutN4xInkylstnBxdmIhh8m7xzqmoNE2Wq46n1RJQzEbq4g-JQSl7e-HDx-GdaTy3KD9E3lRWvj5Zu9QX1QN20dj7zyHz8s-1S6lW7Cpz3RnXTcm04hIlfdFuO8p2mQ5-3a06cqjrn559bF_2NHOnRZ5I1PLlXQNyQT-hedMHeUEDyjtdMxsa4n2eIbNhlTwhyRthaOKOmYtniwF6pwt0wXa6MBEg0OibZec27gz_dk3UrZ6hB2LLYoiv521Yd8Gt-foTrfhiCDP0lC9VUUhcDLU49Xe_9943cNvEArHfAjxeBTovvXiNpFynfEDpIIZs9kFbg52QbeNHWZzebz32s7xHco3nJAJl1nshmhz8dYOQJDyZetnbb2gTWe-vEeWlrfpZMavr56ldb29eNt6UXvgwgFbp_WC0tl2RK25rGk6lYz3nUI2lzvBXGHhPZPGWmKUXFNBKqdaW259wl_aHbiqoVIZdpE60Nax6IOujT0LbFFxIVTCxCRR2XloUcYNvSbnGHKBp763jHoj59xiZWJI0Wm0P_m3MSS985xkasn-cFq20xTDy3J5KFcjgUTD69BHdcHIjz431z28IqlxGcPSfdFnrGDZn6gD6lyo45zyHAD-btczf-98nhQxHEvKfeUtOVkSejD3q-9X7JbzjGtsdUxlKdFU8qGsT78uaw848syWMXz85Waq2Gnem4mAn3prweq4q6Y3JEpnqMmnPoFRgmd3ySW0LLRqSKlwYHriCvJvUs2yjMaaoA-XzTXLeGMe45zmhv_XAno3Mj0xF7USuqNvnE9H343QHlq-eAgxpbTPNR9yzUkgLjwSR0NK4wKoxy-jDg-9vy8sUSToakzW-9fX13Em9Q8T6Z26uZhBN36XUYo5q7ggLXBZoub2Ofv7g6GCZfTxe034NCjiudXj7Omla0eTfo7QBPOcYxbE7qG-vl3_B1G-_i_JCAAA)
- [之后](/playground/untitled#H4sIAAAAAAAAE31WXa-jNhD9K7PsdknUQJLurtRLPqo-VKrU1327uQ8GBnBjbGSb5KZR_nvHgMlXtyIS9njO-MyZGZRzUHCBJkhez4FkNQZJ8HvTBLPAnhq3MQcUFmlvVKszZ1mbTPPGbndyZ3ndKG3hDJZne7hAoVUNYY8JV-RBPgIt2AprhA18MpZZnIQ50_twuvLHNRrDSjRXj9fwiCJTBLIKdCsxq5j9EM4gtBU3QD8GjWBZd14xWYJqLTCZg2ViDyx1W4cz4dv0hsiB49FRHkyfsCgws3GjcTKZwmYLZ2feWc9o1W8zJQ2Fb62i5JUQRNRHgs-fx3WsisKg_RN5WVn4-WrvUd9VA9tH4-AcwbfFQIpkLWByvWzqSe2sk3kyjUlOec_XPU-3TRaz_75tuvKoi19e3OvipSpamVmupJM2F_gXnnJ1lBM8oLQjHceys8R7PMFms4HwD2lRhzeEe-EsvluSrHe2TJdo4wMTLY48XKwPzm0KGm2r5ajFtRYU4TWOY7-ddWHfxhDP0QkQhnf5PWRnVVkKnIx8fZsOb5dR16nwG4TCCRdCMphWQ7z1_DoOcp3zA2SCGbPZBa5jd0G_TRxmc36Me-mG6A7l60XIlMs8ce2-OXtrDyBItdz6qVjPadObzx-RZdV1nJjx64tXad1sz962njceOHfAzmk9JzrbXqg1lw3NkZL7vgE257t-uMDcO6attSSokpmgFqVMO2U93e_dDlzOUKsc-3t6zNZp6K9cG3sS2KGSUqiUiUmq8tNYoJwbmvpTAoXA96GyjCojI26xNglk6DpwOPm7NdRYp4ia0JL94bTqRiGB5WJxqFY37RGPoz3c6i4jP3rcUA7wmhqNywQW7om_YQ2L4UQdUBdCHSPiOQJ8bFcxHzeK0jKBY0XcV95SkCWlD9t-9eOM3TLKucauiyktJdpaPqT19ddF4wFHntsqgS-_XE01e48GMwnw02AtWZP02QyGVOkcNfk072CU4PkduZSWpVYt9SkcmJ64hPwHpWF5ziVls3wIFmmW89Y83vMeGf5PBxjcyPSkXNy10J18t3x6-a6CDtBq6SGklNKeazFyLahB3PVIGo2UbhOgGi9vKjzW_j6xVFFD17difXx5ebll0vwvkcGpn4sZ9MN3vqFYsJoL6gUuK9TcPrO_PxgzWMRfflSEr2NHPJf6lj1957rRpH8CNMG84JgHidUtXt4u_wK21LXERAgAAA==)

<!-- prettier-ignore -->
```svelte
<script>
	import { ---beforeUpdate, afterUpdate,--- tick } from 'svelte';

	---let updatingMessages = false;---
	let theme = +++$state('dark')+++;
	let messages = +++$state([])+++;

	let viewport;

	---beforeUpdate(() => {---
	+++$effect.pre(() => {+++
		---if (!updatingMessages) return;---
		+++messages;+++
		const autoscroll = viewport && viewport.offsetHeight + viewport.scrollTop > viewport.scrollHeight - 50;

		if (autoscroll) {
			tick().then(() => {
				viewport.scrollTo(0, viewport.scrollHeight);
			});
		}

		---updatingMessages = false;---
	});

	function handleKeydown(event) {
		if (event.key === 'Enter') {
			const text = event.target.value;
			if (!text) return;

			---updatingMessages = true;---
			messages = [...messages, text];
			event.target.value = '';
		}
	}

	function toggle() {
		theme = theme === 'dark' ? 'light' : 'dark';
	}
</script>

<div class:dark={theme === 'dark'}>
	<div bind:this={viewport}>
		{#each messages as message}
			<p>{message}</p>
		{/each}
	</div>

	<input +++onkeydown+++={handleKeydown} />

	<button +++onclick+++={toggle}> 切换深色模式 </button>
</div>
```
