---
title: 概述
---

Svelte 5 引入了对 Svelte API 的一些重大更改，包括 [runes](what-are-runes)、[snippets](snippet) 和事件属性。因此，一些 Svelte 3/4 功能已被弃用（尽管目前仍受支持，除非另有说明），并最终将被移除。我们建议你逐步[迁移现有代码](v5-migration-guide)。

以下页面记录了这些功能，适用于：

- 仍在使用 Svelte 3/4 的人
- 使用 Svelte 5，但组件尚未迁移的人

由于 Svelte 3/4 语法在 Svelte 5 中仍然有效，我们将区分 _遗留模式_ 和 _runes 模式_。一旦组件处于 runes 模式（你可以通过使用 runes 或显式设置 `runes: true` 编译器选项来选择加入），遗留模式功能将不再可用。

如果你只对 Svelte 3/4 语法感兴趣，可以在 [v4.svelte.dev](https://v4.svelte.dev) 浏览其文档。
