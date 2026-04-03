---
title: {@debug ...}
---

`{@debug ...}` 标签提供了 `console.log(...)` 的替代方案。它在特定变量发生更改时记录它们的值，并在你打开开发工具时暂停代码执行。

```svelte
<script>
	let user = {
		firstname: 'Ada',
		lastname: 'Lovelace'
	};
</script>

{@debug user}

<h1>你好 {user.firstname}！</h1>
```

`{@debug ...}` 接受以逗号分隔的变量名列表（不是任意表达式）。

```svelte
<!-- 可以编译 -->
{@debug user}
{@debug user1, user2, user3}

<!-- 不能编译 -->
{@debug user.firstname}
{@debug myArray[0]}
{@debug !isReady}
{@debug typeof user === 'object'}
```

不带任何参数的 `{@debug}` 标签将插入一个 `debugger` 语句，该语句在**任何**状态更改时触发，而不是指定的变量。
