---
title: 测试
---

测试帮助你编写和维护代码，并防止回归。测试框架帮助你做到这一点，允许你描述关于代码应该如何行为的断言或期望。Svelte 对你使用哪个测试框架不持意见——你可以使用 [Vitest](https://vitest.dev/)、[Jasmine](https://jasmine.github.io/)、[Cypress](https://www.cypress.io/) 和 [Playwright](https://playwright.dev/) 等解决方案编写单元测试、集成测试和端到端测试。

## 使用 Vitest 进行单元和组件测试

单元测试允许你测试代码的小型隔离部分。集成测试允许你测试应用程序的各个部分，看看它们是否能协同工作。如果你使用 Vite（包括通过 SvelteKit），我们建议使用 [Vitest](https://vitest.dev/)。你可以使用 Svelte CLI 在项目创建期间或之后[设置 Vitest](/docs/cli/vitest)。

要手动设置 Vitest，首先安装它：

```sh
npm install -D vitest
```

然后调整你的 `vite.config.js`：

<!-- prettier-ignore -->
```js
/// file: vite.config.js
import { defineConfig } from +++'vitest/config'+++;

export default defineConfig({
	// ...
	// 告诉 Vitest 使用 `package.json` 文件中的 `browser` 入口点，即使它在 Node 中运行
	resolve: process.env.VITEST
		? {
				conditions: ['browser']
			}
		: undefined
});
```

> [!NOTE] 如果加载所有包的浏览器版本不可取，因为（例如）你还测试后端库，[你可能需要使用别名配置](https://github.com/testing-library/svelte-testing-library/issues/222#issuecomment-1909993331)

现在你可以为 `.js/.ts` 文件中的代码编写单元测试：

```js
/// file: multiplier.svelte.test.js
import { flushSync } from 'svelte';
import { expect, test } from 'vitest';
import { multiplier } from './multiplier.svelte.js';

test('Multiplier', () => {
	let double = multiplier(0, 2);

	expect(double.value).toEqual(0);

	double.set(5);

	expect(double.value).toEqual(10);
});
```

```js
/// file: multiplier.svelte.js
/**
 * @param {number} initial
 * @param {number} k
 */
export function multiplier(initial, k) {
	let count = $state(initial);

	return {
		get value() {
			return count * k;
		},
		/** @param {number} c */
		set: (c) => {
			count = c;
		}
	};
}
```

### 在测试文件中使用符文

由于 Vitest 以与源文件相同的方式处理测试文件，只要文件名包含 `.svelte`，你就可以在测试中使用符文：

```js
/// file: multiplier.svelte.test.js
import { flushSync } from 'svelte';
import { expect, test } from 'vitest';
import { multiplier } from './multiplier.svelte.js';

test('Multiplier', () => {
	let count = $state(0);
	let double = multiplier(() => count, 2);

	expect(double.value).toEqual(0);

	count = 5;

	expect(double.value).toEqual(10);
});
```

```js
/// file: multiplier.svelte.js
/**
 * @param {() => number} getCount
 * @param {number} k
 */
export function multiplier(getCount, k) {
	return {
		get value() {
			return getCount() * k;
		}
	};
}
```

如果被测试的代码使用副作用，你需要将测试包装在 `$effect.root` 中：

```js
/// file: logger.svelte.test.js
import { flushSync } from 'svelte';
import { expect, test } from 'vitest';
import { logger } from './logger.svelte.js';

test('Effect', () => {
	const cleanup = $effect.root(() => {
		let count = $state(0);

		// logger 使用 $effect 记录其输入的更新
		let log = logger(() => count);

		// 副作用通常在微任务后运行，
		// 使用 flushSync 同步执行所有待处理的副作用
		flushSync();
		expect(log).toEqual([0]);

		count = 1;
		flushSync();

		expect(log).toEqual([0, 1]);
	});

	cleanup();
});
```

```js
/// file: logger.svelte.js
/**
 * @param {() => any} getValue
 */
export function logger(getValue) {
	/** @type {any[]} */
	let log = [];

	$effect(() => {
		log.push(getValue());
	});

	return log;
}
```

### 组件测试

可以隔离测试你的组件，这允许你在浏览器（真实或模拟）中渲染它们，模拟行为并进行断言，而无需启动整个应用。

> [!NOTE] 在编写组件测试之前，请考虑你是否真的需要测试组件，还是更多地是测试组件**内部**的逻辑。如果是这样，请考虑提取该逻辑以隔离测试它，而无需组件的开销。

要开始，请安装 jsdom（一个模拟 DOM API 的库）：

```sh
npm install -D jsdom
```

然后调整你的 `vite.config.js`：

```js
/// file: vite.config.js
import { defineConfig } from 'vitest/config';

export default defineConfig({
	plugins: [
		/* ... */
	],
	test: {
		// 如果你正在客户端测试组件，你需要设置 DOM 环境。
		// 如果不是所有文件都应该有这个环境，你可以在测试文件顶部
		// 使用 `// @vitest-environment jsdom` 注释代替。
		environment: 'jsdom'
	},
	// 告诉 Vitest 使用 `package.json` 文件中的 `browser` 入口点，即使它在 Node 中运行
	resolve: process.env.VITEST
		? {
				conditions: ['browser']
			}
		: undefined
});
```

之后，你可以创建一个测试文件，在其中导入要测试的组件，以编程方式与其交互并编写关于结果的期望：

```js
/// file: component.test.js
import { flushSync, mount, unmount } from 'svelte';
import { expect, test } from 'vitest';
import Component from './Component.svelte';

test('Component', () => {
	// 使用 Svelte 的 `mount` API 实例化组件
	const component = mount(Component, {
		target: document.body, // 由于 jsdom，`document` 存在
		props: { initial: 0 }
	});

	expect(document.body.innerHTML).toBe('<button>0</button>');

	// 点击按钮，然后刷新更改，以便你可以同步编写期望
	document.body.querySelector('button').click();
	flushSync();

	expect(document.body.innerHTML).toBe('<button>1</button>');

	// 从 DOM 中移除组件
	unmount(component);
});
```

虽然这个过程非常直接，但它也是低级的并且有些脆弱，因为组件的精确结构可能会经常改变。像 [@testing-library/svelte](https://testing-library.com/docs/svelte-testing-library/intro/) 这样的工具可以帮助简化你的测试。上面的测试可以重写为：

```js
/// file: component.test.js
import { render, screen } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import { expect, test } from 'vitest';
import Component from './Component.svelte';

test('Component', async () => {
	const user = userEvent.setup();
	render(Component);

	const button = screen.getByRole('button');
	expect(button).toHaveTextContent(0);

	await user.click(button);
	expect(button).toHaveTextContent(1);
});
```

当编写涉及双向绑定、context 或代码片段 props 的组件测试时，最好为你的特定测试创建一个包装组件并与之交互。`@testing-library/svelte` 包含一些[示例](https://testing-library.com/docs/svelte-testing-library/example)。

## 使用 Storybook 进行组件测试

[Storybook](https://storybook.js.org) 是一个用于开发和记录 UI 组件的工具，它也可以用于测试你的组件。它们使用 Vitest 的浏览器模式运行，该模式在真实浏览器中渲染你的组件，以获得最真实的测试环境。

要开始，首先通过 `npx sv add storybook` 在你的项目中安装 Storybook（[使用 Svelte 的 CLI](/docs/cli/storybook)）并选择包含测试功能的推荐配置。如果你已经在使用 Storybook，并且有关 Storybook 测试功能的更多信息，请按照 [Storybook 测试文档](https://storybook.js.org/docs/writing-tests?renderer=svelte)开始。

你可以为组件变体创建故事，并使用 [play 函数](https://storybook.js.org/docs/writing-tests/interaction-testing?renderer=svelte#writing-interaction-tests)测试交互，该函数允许你使用 Testing Library 和 Vitest API 模拟行为并进行断言。以下是两个可以测试的故事示例，一个渲染空的 LoginForm 组件，另一个模拟用户填写表单：

```svelte
/// file: LoginForm.stories.svelte
<script module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { expect, fn } from 'storybook/test';

	import LoginForm from './LoginForm.svelte';

	const { Story } = defineMeta({
		component: LoginForm,
		args: {
			// 将模拟函数传递给 `onSubmit` prop
			onSubmit: fn(),
		}
	});
</script>
 
<Story name="Empty Form" />
 
<Story
	name="Filled Form"
	play={async ({ args, canvas, userEvent }) => {
		// 模拟用户填写表单
		await userEvent.type(canvas.getByTestId('email'), 'email@provider.com');
		await userEvent.type(canvas.getByTestId('password'), 'a-random-password');
		await userEvent.click(canvas.getByRole('button'));

		// 运行断言
		await expect(args.onSubmit).toHaveBeenCalledTimes(1);
		await expect(canvas.getByText('你进来了！')).toBeInTheDocument();
	}}
/>
```

## 使用 Playwright 进行端到端测试

E2E（"端到端"的缩写）测试允许你通过用户的视角测试完整的应用程序。本节以 [Playwright](https://playwright.dev/) 为例，但你也可以使用其他解决方案，如 [Cypress](https://www.cypress.io/) 或 [NightwatchJS](https://nightwatchjs.org/)。

你可以使用 Svelte CLI 在项目创建期间或之后[设置 Playwright](/docs/cli/playwright)。你也可以[使用 `npm init playwright` 设置它](https://playwright.dev/docs/intro)。此外，你可能还想安装 IDE 插件，如 [VS Code 扩展](https://playwright.dev/docs/getting-started-vscode)，以便能够从 IDE 内部执行测试。

如果你运行了 `npm init playwright` 或没有使用 Vite，你可能需要调整 Playwright 配置以告诉 Playwright 在运行测试之前要做什么——主要是在特定端口启动你的应用程序。例如：

```js
/// file: playwright.config.js
const config = {
	webServer: {
		command: 'npm run build && npm run preview',
		port: 4173
	},
	testDir: 'tests',
	testMatch: /(.+\.)?(test|spec)\.[jt]s/
};

export default config;
```

现在你可以开始编写测试了。这些完全不知道 Svelte 作为框架，所以你主要与 DOM 交互并编写断言。

```js
// @errors: 2307 7031
/// file: tests/hello-world.spec.js
import { expect, test } from '@playwright/test';

test('主页有预期的 h1', async ({ page }) => {
	await page.goto('/');
	await expect(page.locator('h1')).toBeVisible();
});
```
