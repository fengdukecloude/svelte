# Svelte 官方文档中文翻译

这是 Svelte 官方文档的中文翻译版本，与英文文档保持同步更新。

## 📚 文档结构

```
zh-docs/
├── 01-introduction/      # 介绍和入门
├── 02-runes/            # 符文（Svelte 5 核心特性）
├── 03-template-syntax/  # 模板语法
├── 04-styling/          # 样式系统
├── 05-special-elements/ # 特殊元素
├── 06-runtime/          # 运行时 API
├── 07-misc/             # 最佳实践、测试等
├── 98-reference/        # API 参考
└── 99-legacy/           # 遗留功能（Svelte 4）
```

## 🔧 翻译工具

### 校验脚本

运行自动化校验：

```bash
cd zh-docs/scripts
node validate.js
```

### 进度统计

查看翻译进度：

```bash
cd zh-docs/scripts
node check-progress.js
```

## 📖 翻译规范

翻译时请遵循以下文档：

- [术语表](./GLOSSARY.md) - 统一的术语翻译对照
- [翻译规范](./TRANSLATION_GUIDE.md) - 详细的翻译标准
- [审核清单](./REVIEW_CHECKLIST.md) - 质量检查清单

## 🎯 翻译原则

1. **准确性第一** - 确保技术概念翻译准确
2. **保持原意** - 忠实于原文，不随意增删
3. **自然流畅** - 中文表达自然，符合阅读习惯
4. **术语统一** - 严格遵循术语表
5. **格式完整** - 保持 Markdown 格式和代码完整性

## ⚠️ 重要规则

### 代码处理

- ✅ **翻译**: 代码注释、字符串内容、HTML 文本
- ❌ **不翻译**: 代码逻辑、变量名、函数名、API 名称

### 术语处理

核心术语首次出现时使用"中文（English）"格式：

```markdown
符文（Runes）是 Svelte 5 的核心特性。
```

后续直接使用中文：

```markdown
符文具有 `$` 前缀。
```

### 链接处理

保持链接路径不变，仅翻译链接文字：

```markdown
[交互式教程](/tutorial)  ✅
[教程](/教程)  ❌
```

## 📊 翻译进度

运行 `node scripts/check-progress.js` 查看最新进度。

## 🤝 贡献指南

1. 翻译前阅读翻译规范
2. 翻译时参考术语表
3. 翻译后运行校验脚本
4. 使用审核清单自查
5. 提交前确保所有检查通过

## 📝 版本信息

- **翻译版本**: 基于 Svelte 5 官方文档
- **最后更新**: 2026-04-01
- **翻译方式**: AI 翻译 + 人工校验

## 🔗 相关链接

- [Svelte 官方网站](https://svelte.dev)
- [Svelte 英文文档](https://svelte.dev/docs)
- [SvelteKit 文档](https://kit.svelte.dev)
- [Svelte GitHub](https://github.com/sveltejs/svelte)

## 📄 许可证

本翻译遵循 Svelte 官方文档的许可证。
