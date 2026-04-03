# Svelte 文档翻译术语表

本术语表用于确保 Svelte 文档中文翻译的一致性和准确性。

## 核心概念

| English | 中文 | 说明 | 首次出现保留原文 |
|---------|------|------|------------------|
| Rune | 符文 | Svelte 5 的核心概念 | ✓ |
| Component | 组件 | - | ✗ |
| Reactivity | 响应式 / 响应性 | 根据上下文选择 | ✓ |
| Reactive | 响应式的 | - | ✗ |
| State | 状态 | - | ✗ |
| Props | 属性 / Props | 保留 Props 或译为属性 | ✓ |
| Store | 存储 / Store | - | ✓ |
| Derived | 派生 | 派生状态 | ✗ |
| Effect | 副作用 / 效果 | $effect 相关 | ✓ |
| Binding | 绑定 | - | ✗ |
| Snippet | 代码片段 / Snippet | Svelte 5 新特性 | ✓ |

## Runes 相关

| English | 中文 | 说明 |
|---------|------|------|
| `$state` | `$state`（状态符文） | 保持代码不变 |
| `$derived` | `$derived`（派生符文） | 保持代码不变 |
| `$effect` | `$effect`（副作用符文） | 保持代码不变 |
| `$props` | `$props`（属性符文） | 保持代码不变 |
| `$bindable` | `$bindable`（可绑定符文） | 保持代码不变 |
| `$inspect` | `$inspect`（检查符文） | 保持代码不变 |
| `$host` | `$host`（宿主符文） | 保持代码不变 |

## 模板语法

| English | 中文 | 说明 |
|---------|------|------|
| Template | 模板 | - |
| Markup | 标记 | HTML 标记 |
| Expression | 表达式 | - |
| Directive | 指令 | - |
| Attribute | 属性 / 特性 | HTML 属性 |
| Event Handler | 事件处理器 / 事件处理函数 | - |
| Transition | 过渡 / 过渡效果 | - |
| Animation | 动画 | - |
| Action | 动作 / Action | use: 指令 |

## 生命周期和运行时

| English | 中文 | 说明 |
|---------|------|------|
| Lifecycle | 生命周期 | - |
| Hook | 钩子 / Hook | - |
| Mount | 挂载 | - |
| Unmount | 卸载 | - |
| Update | 更新 | - |
| Render | 渲染 | - |
| Hydration | 水合 / 激活 | SSR 相关 |
| Server-Side Rendering (SSR) | 服务端渲染 (SSR) | - |
| Client-Side Rendering (CSR) | 客户端渲染 (CSR) | - |

## 特殊元素

| English | 中文 | 说明 |
|---------|------|------|
| `<svelte:window>` | `<svelte:window>` | 保持不变 |
| `<svelte:document>` | `<svelte:document>` | 保持不变 |
| `<svelte:body>` | `<svelte:body>` | 保持不变 |
| `<svelte:head>` | `<svelte:head>` | 保持不变 |
| `<svelte:element>` | `<svelte:element>` | 保持不变 |
| `<svelte:component>` | `<svelte:component>` | 保持不变 |
| `<svelte:self>` | `<svelte:self>` | 保持不变 |
| `<svelte:fragment>` | `<svelte:fragment>` | 保持不变 |
| `<svelte:boundary>` | `<svelte:boundary>` | 保持不变 |

## 样式相关

| English | 中文 | 说明 |
|---------|------|------|
| Scoped Styles | 作用域样式 | - |
| Global Styles | 全局样式 | - |
| CSS Custom Properties | CSS 自定义属性 / CSS 变量 | - |
| Styling | 样式 / 样式化 | - |

## 开发工具

| English | 中文 | 说明 |
|---------|------|------|
| Compiler | 编译器 | - |
| Bundle | 打包 / 构建产物 | - |
| Build | 构建 | - |
| Development | 开发 | - |
| Production | 生产 | - |
| Hot Module Replacement (HMR) | 热模块替换 (HMR) | - |
| TypeScript | TypeScript | 保持不变 |
| Playground | 演练场 / 在线编辑器 | - |

## 测试和最佳实践

| English | 中文 | 说明 |
|---------|------|------|
| Testing | 测试 | - |
| Unit Test | 单元测试 | - |
| Integration Test | 集成测试 | - |
| Best Practice | 最佳实践 | - |
| Performance | 性能 | - |
| Optimization | 优化 | - |
| Accessibility (a11y) | 无障碍访问 / 可访问性 | - |

## 遗留功能 (Legacy)

| English | 中文 | 说明 |
|---------|------|------|
| Legacy | 遗留 / 旧版 | Svelte 4 及以前 |
| Reactive Assignment | 响应式赋值 | Svelte 4 特性 |
| `$$props` | `$$props` | 保持不变 |
| `$$restProps` | `$$restProps` | 保持不变 |
| `$$slots` | `$$slots` | 保持不变 |
| Slot | 插槽 | - |

## 错误和警告

| English | 中文 | 说明 |
|---------|------|------|
| Error | 错误 | - |
| Warning | 警告 | - |
| Compile Error | 编译错误 | - |
| Runtime Error | 运行时错误 | - |
| Client Error | 客户端错误 | - |
| Server Error | 服务端错误 | - |

## 通用技术术语

| English | 中文 | 说明 |
|---------|------|------|
| Framework | 框架 | - |
| Library | 库 | - |
| Package | 包 | - |
| Module | 模块 | - |
| Import | 导入 | - |
| Export | 导出 | - |
| Function | 函数 | - |
| Method | 方法 | - |
| Property | 属性 | - |
| Value | 值 | - |
| Variable | 变量 | - |
| Constant | 常量 | - |
| Object | 对象 | - |
| Array | 数组 | - |
| String | 字符串 | - |
| Number | 数字 | - |
| Boolean | 布尔值 | - |
| Null | null | 保持不变 |
| Undefined | undefined | 保持不变 |
| Callback | 回调 / 回调函数 | - |
| Promise | Promise | 保持不变 |
| Async/Await | async/await | 保持不变 |

## 翻译原则

1. **首次出现原则**: 标记为"首次出现保留原文"的术语，在文档中首次出现时使用"中文（English）"格式
2. **代码保持原则**: 所有代码中的术语保持英文不变
3. **上下文原则**: 根据具体上下文选择最合适的翻译
4. **一致性原则**: 同一文档中相同术语使用相同翻译
5. **可读性原则**: 优先考虑中文表达的自然流畅性

## 更新记录

- 2026-04-01: 初始版本创建
