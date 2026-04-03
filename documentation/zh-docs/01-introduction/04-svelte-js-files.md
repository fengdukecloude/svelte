---
title: .svelte.js 和 .svelte.ts 文件
---

除了 `.svelte` 文件，Svelte 还可以处理 `.svelte.js` 和 `.svelte.ts` 文件。

这些文件的行为与任何其他 `.js` 或 `.ts` 模块一样，只是你可以使用符文（runes）。这对于创建可重用的响应式逻辑或在应用中共享响应式状态非常有用（但请注意，你[不能导出重新赋值的状态]($state#Passing-state-across-modules)）。

> [!LEGACY]
> 这是 Svelte 5 之前不存在的概念
