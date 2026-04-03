# Svelte 文档翻译规范

本文档规定了 Svelte 文档中文翻译的标准和规范，确保翻译质量的一致性和专业性。

## 总体原则

1. **准确性第一**: 确保技术概念翻译准确，不产生歧义
2. **保持原意**: 忠实于原文，不随意增删内容
3. **自然流畅**: 中文表达自然，符合中文阅读习惯
4. **术语统一**: 严格遵循术语表，保持一致性
5. **格式完整**: 保持 Markdown 格式和代码完整性

## Markdown 格式规范

### 1. Frontmatter

保持 YAML frontmatter 格式，翻译 `title` 字段：

```yaml
---
title: Overview
---
```

翻译为：

```yaml
---
title: 概述
---
```

### 2. 标题层级

保持标题层级不变，翻译标题内容：

```markdown
## What are runes?
```

翻译为：

```markdown
## 什么是符文（Runes）？
```

**注意**: 核心概念首次出现时保留英文原文。

### 3. 链接处理

#### 内部链接
保持链接路径不变，翻译链接文字：

```markdown
[interactive tutorial](/tutorial)
```

翻译为：

```markdown
[交互式教程](/tutorial)
```

#### 外部链接
保持完整 URL，翻译链接文字：

```markdown
[StackBlitz](https://sveltekit.new)
```

翻译为：

```markdown
[StackBlitz](https://sveltekit.new)
```

#### 文档内部引用
保持相对路径，翻译文字：

```markdown
[SvelteKit](../kit)
```

翻译为：

```markdown
[SvelteKit](../kit)
```

### 4. 列表

保持列表格式，翻译内容：

```markdown
- You don't need to import them
- They're not values
- Just like JavaScript keywords
```

翻译为：

```markdown
- 你不需要导入它们
- 它们不是值
- 就像 JavaScript 关键字一样
```

### 5. 引用块和特殊标记

保持特殊标记格式，翻译内容：

```markdown
> [!NOTE] **rune** /ruːn/ _noun_
>
> A letter or mark used as a mystical or magic symbol.
```

翻译为：

```markdown
> [!NOTE] **rune** /ruːn/ _名词_
>
> 用作神秘或魔法符号的字母或标记。
```

**支持的标记**:
- `[!NOTE]` - 注意
- `[!LEGACY]` - 遗留
- `[!WARNING]` - 警告
- `[!TIP]` - 提示

## 代码处理规范

### 1. 代码块

**规则**: 代码本身不翻译，仅翻译注释

#### Svelte 代码示例

```svelte
<!--- file: App.svelte --->
<script>
	function greet() {
		alert('Welcome to Svelte!');
	}
</script>

<button onclick={greet}>click me</button>
```

翻译为：

```svelte
<!--- file: App.svelte --->
<script>
	function greet() {
		alert('欢迎使用 Svelte！');
	}
</script>

<button onclick={greet}>点击我</button>
```

**注意**:
- 文件路径注释 `<!--- file: ... --->` 保持不变
- 代码逻辑不变，仅翻译字符串内容和 HTML 文本
- 函数名、变量名保持英文

#### JavaScript 代码

```js
// This creates reactive state
let message = $state('hello');
```

翻译为：

```js
// 这会创建响应式状态
let message = $state('hello');
```

### 2. 内联代码

保持内联代码不变：

```markdown
The `$state` rune creates reactive state.
```

翻译为：

```markdown
`$state` 符文创建响应式状态。
```

**不要翻译**:
- 函数名: `$state`, `$derived`, `$effect`
- 变量名: `count`, `message`, `props`
- 关键字: `let`, `const`, `function`
- API 名称: `onMount`, `createEventDispatcher`

### 3. 代码块语言标识

保持语言标识符不变：

- `svelte` - Svelte 组件
- `js` / `javascript` - JavaScript
- `ts` / `typescript` - TypeScript
- `html` - HTML
- `css` - CSS
- `bash` / `sh` - Shell 命令

## 标点符号规范

### 1. 中英文混排

- **中文语境**: 使用中文标点（，。！？；：）
- **英文专有名词**: 周围使用英文标点或空格

#### 正确示例

```
Svelte 是一个用于构建用户界面的框架。
使用 `$state` 创建响应式状态。
Runes（符文）是 Svelte 5 的核心特性。
```

#### 错误示例

```
Svelte是一个用于构建用户界面的框架.
使用$state创建响应式状态.
Runes(符文)是Svelte 5的核心特性.
```

### 2. 引号使用

- **中文引号**: 「」或 ""（用于强调）
- **保持英文引号**: 代码、专有名词

```markdown
这被称为"响应式"。
文件名为 "App.svelte"。
```

### 3. 省略号

- 中文: ……（两个省略号）
- 英文: ... (三个点，用于代码)

## 术语翻译规范

### 1. 核心术语首次出现

核心术语首次出现时使用"中文（English）"格式：

```markdown
Runes are symbols...
```

翻译为：

```markdown
符文（Runes）是一些符号……
```

后续出现直接使用中文：

```markdown
Runes have a `$` prefix...
```

翻译为：

```markdown
符文具有 `$` 前缀……
```

### 2. 保留英文的情况

以下情况保留英文：

1. **代码中的所有内容**
2. **专有名词**: Svelte, SvelteKit, TypeScript, JavaScript
3. **技术缩写**: SSR, CSR, HMR, API
4. **包名和库名**: npm, Node.js, Vite
5. **文件扩展名**: `.svelte`, `.js`, `.ts`

### 3. 可选翻译

某些术语可根据上下文选择是否翻译：

- Props → 属性 / Props
- Store → 存储 / Store  
- Hook → 钩子 / Hook
- Action → 动作 / Action

**原则**: 优先使用中文，但如果英文更清晰则保留。

## 特殊内容处理

### 1. 文件路径注释

保持不变：

```svelte
<!--- file: App.svelte --->
<!--- file: src/lib/Counter.svelte --->
```

### 2. 类型定义

保持代码不变，翻译注释：

```ts
interface Props {
	// The current count value
	count: number;
}
```

翻译为：

```ts
interface Props {
	// 当前计数值
	count: number;
}
```

### 3. 错误消息

翻译错误消息内容，保持代码引用：

```markdown
Error: `count` is not defined
```

翻译为：

```markdown
错误：`count` 未定义
```

### 4. 版本标记

保持格式，翻译说明：

```markdown
> [!LEGACY]
> Runes didn't exist prior to Svelte 5.
```

翻译为：

```markdown
> [!LEGACY]
> 符文在 Svelte 5 之前不存在。
```

## 翻译质量检查清单

翻译完成后，请检查：

- [ ] 所有 frontmatter 的 title 已翻译
- [ ] 代码块保持完整，未被翻译
- [ ] 代码注释已翻译
- [ ] 内联代码保持英文
- [ ] 链接路径未改变
- [ ] 术语符合术语表
- [ ] 标点符号使用正确
- [ ] 中文表达自然流畅
- [ ] 特殊标记格式正确
- [ ] 没有遗漏段落

## 常见错误示例

### ❌ 错误 1: 翻译代码

```js
让 计数 = $状态(0);
```

### ✅ 正确 1: 保持代码

```js
let count = $state(0);
```

---

### ❌ 错误 2: 改变链接路径

```markdown
[教程](/教程)
```

### ✅ 正确 2: 保持路径

```markdown
[教程](/tutorial)
```

---

### ❌ 错误 3: 使用英文标点

```markdown
Svelte是一个框架.它很快.
```

### ✅ 正确 3: 使用中文标点

```markdown
Svelte 是一个框架。它很快。
```

---

### ❌ 错误 4: 术语不一致

```markdown
组件使用 props 接收参数。
组件通过属性传递数据。
```

### ✅ 正确 4: 术语统一

```markdown
组件使用属性（Props）接收参数。
组件通过属性传递数据。
```

## 翻译工作流程

1. **阅读原文**: 完整理解原文含义
2. **查阅术语表**: 确认关键术语翻译
3. **初步翻译**: 使用 AI 工具生成初稿
4. **人工校对**: 检查准确性和流畅性
5. **格式检查**: 运行自动化校验脚本
6. **最终审核**: 根据审核清单复查

## 参考资源

- [术语表](./GLOSSARY.md)
- [审核清单](./REVIEW_CHECKLIST.md)
- [Svelte 官方文档](https://svelte.dev)
- [中文技术文档写作规范](https://github.com/ruanyf/document-style-guide)

---

**版本**: 1.0  
**更新日期**: 2026-04-01
