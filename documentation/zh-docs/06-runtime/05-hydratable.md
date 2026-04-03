---
title: 可水合数据
---

在 Svelte 中，当你想在服务器上渲染异步内容数据时，你可以简单地 `await` 它。这很棒！但是，它有一个陷阱：在客户端水合该内容时，Svelte 必须重做异步工作，这会阻塞水合，无论需要多长时间：

```svelte
<script>
  import { getUser } from 'my-database-library';

  // 这将在服务器上获取用户，将用户名渲染到 h1 中，
  // 然后，在客户端水合期间，它将**再次**获取用户，
  // 阻塞水合直到完成。
  const user = await getUser();
</script>

<h1>{user.name}</h1>
```

这很愚蠢。如果我们已经在服务器上完成了获取数据的艰苦工作，我们不想在客户端水合期间再次获取它。`hydratable` 是一个为解决此问题而构建的低级 API。你可能不会经常需要这个——它将在你使用的任何数据获取库的幕后使用。例如，它为 [SvelteKit 中的远程函数](/docs/kit/remote-functions)提供支持。

要修复上面的示例：

```svelte
<script>
  import { hydratable } from 'svelte';
  import { getUser } from 'my-database-library';

  // 在服务端渲染期间，这将序列化并存储 `getUser` 的结果，将其
  // 与提供的键关联并将其烘焙到 `head` 内容中。在水合期间，它将
  // 查找序列化版本，返回它而不是运行 `getUser`。水合完成后，
  // 如果再次调用它，它将简单地调用 `getUser`。
  const user = await hydratable('user', () => getUser());
</script>

<h1>{user.name}</h1>
```

此 API 还可用于提供对在服务端渲染和水合之间稳定的随机或基于时间的值的访问。例如，要获得在水合时不更新的随机数：

```ts
import { hydratable } from 'svelte';
const rand = hydratable('random', () => Math.random());
```

如果你是库作者，请确保在 `hydratable` 值的键前加上库的名称，以便你的键不会与其他库冲突。

## 序列化

从 `hydratable` 函数返回的所有数据都必须是可序列化的。但这并不意味着你仅限于 JSON——Svelte 使用 [`devalue`](https://npmjs.com/package/devalue)，它可以序列化各种东西，包括 `Map`、`Set`、`URL` 和 `BigInt`。查看文档页面以获取完整列表。除此之外，由于一些 Svelte 魔法，你还可以无所畏惧地使用 promise：

```svelte
<script>
  import { hydratable } from 'svelte';
  const promises = hydratable('random', () => {
    return {
      one: Promise.resolve(1),
      two: Promise.resolve(2)
    }
  });
</script>

{await promises.one}
{await promises.two}
```

## CSP

`hydratable` 向从 `render` 返回的 `head` 添加一个内联 `<script>` 块。如果你使用[内容安全策略](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CSP)（CSP），此脚本可能无法运行。你可以向 `render` 提供 `nonce`：

```js
/// file: server.js
import { render } from 'svelte/server';
import App from './App.svelte';
// ---cut---
const nonce = crypto.randomUUID();

const { head, body } = await render(App, {
	csp: { nonce }
});
```

这将向脚本块添加 `nonce`，假设你稍后会将相同的 nonce 添加到包含它的文档的 CSP 标头中：

```js
/// file: server.js
let response = new Response();
let nonce = 'xyz123';
// ---cut---
response.headers.set(
  'Content-Security-Policy',
  `script-src 'nonce-${nonce}'`
 );
```

`nonce`（除了英国俚语定义外，意思是"使用一次的数字"）仅在动态服务端渲染单个响应时使用是至关重要的。

如果你是提前生成静态 HTML，则必须使用哈希：

```js
/// file: server.js
import { render } from 'svelte/server';
import App from './App.svelte';
// ---cut---
const { head, body, hashes } = await render(App, {
	csp: { hash: true }
});
```

`hashes.script` 将是一个字符串数组，如 `["sha256-abcd123"]`。与 `nonce` 一样，哈希应在你的 CSP 标头中使用：

```js
/// file: server.js
let response = new Response();
let hashes = { script: ['sha256-xyz123'] };
// ---cut---
response.headers.set(
  'Content-Security-Policy',
  `script-src ${hashes.script.map((hash) => `'${hash}'`).join(' ')}`
 );
```

如果可以，我们建议使用 `nonce` 而不是 hash，因为 `hash` 将来会干扰流式 SSR。
