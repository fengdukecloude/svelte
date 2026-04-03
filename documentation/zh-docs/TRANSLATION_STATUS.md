# Svelte 文档翻译状态

**最后更新**: 2026-04-02

## 翻译进度总览

| 优先级 | 目录 | 文件数 | 已翻译 | 进度 | 状态 |
|--------|------|--------|--------|------|------|
| P0 | `01-introduction` | 5 | 5 | 100% | ✅ 完成 |
| P0 | `02-runes` | 9 | 9 | 100% | ✅ 完成 |
| P0 | `03-template-syntax` | 20 | 20 | 100% | ✅ 完成 |
| P1 | `04-styling` | 5 | 5 | 100% | ✅ 完成 |
| P1 | `05-special-elements` | 8 | 8 | 100% | ✅ 完成 |
| P1 | `06-runtime` | 6 | 6 | 100% | ✅ 完成 |
| P2 | `07-misc` | 8 | 0 | 0% | ⏳ 待翻译 |
| P2 | `98-reference` | 28 | 0 | 0% | ⏳ 待翻译 |
| P3 | `99-legacy` | 13 | 0 | 0% | ⏳ 待翻译 |
| - | **总计** | **102** | **54** | **52.9%** | 🚧 进行中 |

## 已完成的翻译

### ✅ 01-introduction (5/5)

- [x] `index.md` - 介绍
- [x] `01-overview.md` - 概述
- [x] `02-getting-started.md` - 快速开始
- [x] `03-svelte-files.md` - .svelte 文件
- [x] `04-svelte-js-files.md` - .svelte.js 和 .svelte.ts 文件

### ✅ 02-runes (9/9)

- [x] `index.md` - 符文
- [x] `01-what-are-runes.md` - 什么是符文？
- [x] `02-$state.md` - $state
- [x] `03-$derived.md` - $derived
- [x] `04-$effect.md` - $effect
- [x] `05-$props.md` - $props
- [x] `06-$bindable.md` - $bindable
- [x] `07-$inspect.md` - $inspect
- [x] `08-$host.md` - $host

### ✅ 03-template-syntax (20/20)

- [x] `index.md` - 模板语法
- [x] `01-basic-markup.md` - 基本标记
- [x] `02-if.md` - {#if ...}
- [x] `03-each.md` - {#each ...}
- [x] `04-key.md` - {#key ...}
- [x] `05-await.md` - {#await ...}
- [x] `06-snippet.md` - {#snippet ...}
- [x] `07-@render.md` - {@render ...}
- [x] `08-@html.md` - {@html ...}
- [x] `09-@attach.md` - {@attach ...}
- [x] `10-@const.md` - {@const ...}
- [x] `11-@debug.md` - {@debug ...}
- [x] `12-bind.md` - bind:
- [x] `13-use.md` - use:
- [x] `14-transition.md` - transition:
- [x] `15-in-and-out.md` - in: 和 out:
- [x] `16-animate.md` - animate:
- [x] `17-style.md` - style:
- [x] `18-class.md` - class
- [x] `19-await-expressions.md` - await

### ✅ 04-styling (5/5)

- [x] `index.md` - 样式
- [x] `01-scoped-styles.md` - 作用域样式
- [x] `02-global-styles.md` - 全局样式
- [x] `03-custom-properties.md` - 自定义属性
- [x] `04-nested-style-elements.md` - 嵌套的 <style> 元素

### ✅ 05-special-elements (8/8)

- [x] `index.md` - 特殊元素
- [x] `01-svelte-boundary.md` - <svelte:boundary>
- [x] `02-svelte-window.md` - <svelte:window>
- [x] `03-svelte-document.md` - <svelte:document>
- [x] `04-svelte-body.md` - <svelte:body>
- [x] `05-svelte-head.md` - <svelte:head>
- [x] `06-svelte-element.md` - <svelte:element>
- [x] `07-svelte-options.md` - <svelte:options>

### ✅ 06-runtime (6/6)

- [x] `index.md` - 运行时
- [x] `01-stores.md` - Store
- [x] `02-context.md` - Context
- [x] `03-lifecycle-hooks.md` - 生命周期钩子
- [x] `04-imperative-component-api.md` - 命令式组件 API
- [x] `05-hydratable.md` - 可水合数据

## 待翻译文档

### ⏳ 07-misc (0/8) - P2 优先级

最佳实践、测试、TypeScript 等。

### ⏳ 98-reference (0/28) - P2 优先级

API 参考文档。

### ⏳ 99-legacy (0/13) - P3 优先级

遗留功能文档（Svelte 4 及以前）。

## 翻译质量保证

### 已创建的辅助文档

- ✅ `GLOSSARY.md` - 术语表
- ✅ `TRANSLATION_GUIDE.md` - 翻译规范
- ✅ `REVIEW_CHECKLIST.md` - 审核清单
- ✅ `README.md` - 中文文档说明

### 已创建的工具脚本

- ✅ `scripts/validate.js` - 自动化校验脚本
- ✅ `scripts/check-progress.js` - 翻译进度统计
- ✅ `scripts/package.json` - 脚本配置

## 下一步计划

1. ✅ **P0 核心文档**: 已完成 `01-introduction`, `02-runes`, `03-template-syntax` (34 个文件)
2. ✅ **P1 重要文档**: 已完成 `04-styling`, `05-special-elements`, `06-runtime` (19 个文件)
3. **P2 文档翻译**: `07-misc` (8 个), `98-reference` (28 个)
4. **可选 P3 翻译**: `99-legacy` (13 个遗留功能)
5. **质量审核**: 运行校验脚本，人工审核
6. **最终发布**: 完成所有翻译和审核

**当前进度**: 54/102 文件 (52.9%) - 已完成所有 P0 和 P1 优先级文档！

## 翻译规范遵循情况

所有已翻译文档均遵循以下规范：

- ✅ 使用术语表中的统一翻译
- ✅ 代码块保持不变，仅翻译注释
- ✅ 链接路径保持不变，仅翻译文字
- ✅ 保持 Markdown 格式完整
- ✅ 中英文混排使用正确标点
- ✅ 核心术语首次出现时标注英文

## 如何使用校验工具

### 运行自动化校验

```bash
cd /Users/apple/dev/personal/study/svelte/documentation/zh-docs/scripts
node validate.js
```

### 查看翻译进度

```bash
cd /Users/apple/dev/personal/study/svelte/documentation/zh-docs/scripts
node check-progress.js
```

## 贡献者

- 初始翻译: AI 辅助翻译 + 人工校验
- 翻译日期: 2026-04-01

---

**注意**: 本翻译基于 Svelte 5 官方文档，随着官方文档更新，需要定期同步更新。
