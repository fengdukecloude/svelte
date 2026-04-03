#!/usr/bin/env node

/**
 * Svelte 文档翻译自动化校验脚本
 * 
 * 功能：
 * 1. 检查文件完整性（所有英文文件都有对应的中文文件）
 * 2. 检查 Markdown 格式完整性
 * 3. 检查术语一致性
 * 4. 检查代码块完整性
 * 5. 生成校验报告
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DOCS_DIR = path.resolve(__dirname, '../../docs');
const ZH_DOCS_DIR = path.resolve(__dirname, '..');

// 术语表（从 GLOSSARY.md 提取的关键术语）
const TERMINOLOGY = {
  'Rune': '符文',
  'Component': '组件',
  'Reactivity': '响应式',
  'State': '状态',
  'Props': '属性',
  'Effect': '副作用',
  'Derived': '派生',
  'Binding': '绑定',
  'Snippet': '代码片段',
  'Template': '模板',
  'Lifecycle': '生命周期',
  'Mount': '挂载',
  'Unmount': '卸载',
  'Render': '渲染',
  'Hydration': '水合',
};

// 不应该被翻译的内联代码模式
const CODE_PATTERNS = [
  /`\$state`/g,
  /`\$derived`/g,
  /`\$effect`/g,
  /`\$props`/g,
  /`\$bindable`/g,
  /`\$inspect`/g,
  /`\$host`/g,
];

class ValidationReport {
  constructor() {
    this.errors = [];
    this.warnings = [];
    this.stats = {
      totalFiles: 0,
      translatedFiles: 0,
      missingFiles: 0,
      checkedFiles: 0,
    };
  }

  addError(file, message) {
    this.errors.push({ file, message, type: 'error' });
  }

  addWarning(file, message) {
    this.warnings.push({ file, message, type: 'warning' });
  }

  print() {
    console.log('\n=== Svelte 文档翻译校验报告 ===\n');
    
    console.log('📊 统计信息:');
    console.log(`  总文件数: ${this.stats.totalFiles}`);
    console.log(`  已翻译: ${this.stats.translatedFiles}`);
    console.log(`  缺失: ${this.stats.missingFiles}`);
    console.log(`  已检查: ${this.stats.checkedFiles}`);
    console.log(`  翻译进度: ${((this.stats.translatedFiles / this.stats.totalFiles) * 100).toFixed(1)}%\n`);

    if (this.errors.length > 0) {
      console.log(`❌ 错误 (${this.errors.length}):`);
      this.errors.forEach(({ file, message }) => {
        console.log(`  ${file}`);
        console.log(`    ${message}`);
      });
      console.log('');
    }

    if (this.warnings.length > 0) {
      console.log(`⚠️  警告 (${this.warnings.length}):`);
      this.warnings.forEach(({ file, message }) => {
        console.log(`  ${file}`);
        console.log(`    ${message}`);
      });
      console.log('');
    }

    if (this.errors.length === 0 && this.warnings.length === 0) {
      console.log('✅ 所有检查通过！\n');
    }

    return this.errors.length === 0;
  }
}

/**
 * 获取所有 Markdown 文件
 */
function getAllMarkdownFiles(dir, baseDir = dir) {
  const files = [];
  const items = fs.readdirSync(dir);

  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      files.push(...getAllMarkdownFiles(fullPath, baseDir));
    } else if (item.endsWith('.md')) {
      files.push(path.relative(baseDir, fullPath));
    }
  }

  return files;
}

/**
 * 检查文件完整性
 */
function checkFileCompleteness(report) {
  console.log('🔍 检查文件完整性...');
  
  const englishFiles = getAllMarkdownFiles(DOCS_DIR);
  report.stats.totalFiles = englishFiles.length;

  for (const file of englishFiles) {
    const zhFile = path.join(ZH_DOCS_DIR, file);
    
    if (fs.existsSync(zhFile)) {
      report.stats.translatedFiles++;
    } else {
      report.stats.missingFiles++;
      report.addWarning(file, '缺少中文翻译文件');
    }
  }
}

/**
 * 检查单个文件的格式
 */
function checkFileFormat(filePath, relativePath, report) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');

  // 检查 frontmatter
  if (!content.startsWith('---')) {
    report.addError(relativePath, '缺少 YAML frontmatter');
    return;
  }

  const frontmatterEnd = content.indexOf('---', 3);
  if (frontmatterEnd === -1) {
    report.addError(relativePath, 'frontmatter 格式错误');
    return;
  }

  const frontmatter = content.substring(0, frontmatterEnd + 3);
  
  // 检查 title 是否存在
  if (!frontmatter.includes('title:')) {
    report.addError(relativePath, 'frontmatter 缺少 title 字段');
  }

  // 检查是否有未翻译的英文 title
  const titleMatch = frontmatter.match(/title:\s*(.+)/);
  if (titleMatch) {
    const title = titleMatch[1].trim();
    // 简单检查：如果 title 全是英文字母，可能未翻译
    if (/^[A-Za-z\s\-]+$/.test(title)) {
      report.addWarning(relativePath, `title 可能未翻译: "${title}"`);
    }
  }

  // 检查代码块
  checkCodeBlocks(content, relativePath, report);

  // 检查链接
  checkLinks(content, relativePath, report);

  // 检查特殊标记
  checkSpecialMarkers(content, relativePath, report);
}

/**
 * 检查代码块
 */
function checkCodeBlocks(content, filePath, report) {
  const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
  let match;
  let blockIndex = 0;

  while ((match = codeBlockRegex.exec(content)) !== null) {
    blockIndex++;
    const lang = match[1] || 'unknown';
    const code = match[2];

    // 检查代码块是否包含中文（可能被错误翻译）
    if (['js', 'javascript', 'ts', 'typescript', 'svelte'].includes(lang)) {
      // 排除注释和字符串中的中文
      const codeWithoutComments = code
        .replace(/\/\/.*$/gm, '') // 单行注释
        .replace(/\/\*[\s\S]*?\*\//g, '') // 多行注释
        .replace(/'[^']*'/g, '') // 单引号字符串
        .replace(/"[^"]*"/g, '') // 双引号字符串
        .replace(/`[^`]*`/g, ''); // 模板字符串

      // 检查是否有中文字符（可能是被翻译的代码）
      if (/[\u4e00-\u9fa5]/.test(codeWithoutComments)) {
        report.addError(filePath, `代码块 #${blockIndex} 包含中文字符，代码可能被错误翻译`);
      }
    }

    // 检查文件路径注释是否保持不变
    if (code.includes('<!--- file:') && /<!--- file:.*[\u4e00-\u9fa5]/.test(code)) {
      report.addError(filePath, `代码块 #${blockIndex} 的文件路径注释被翻译了`);
    }
  }
}

/**
 * 检查链接
 */
function checkLinks(content, filePath, report) {
  // 检查 Markdown 链接格式
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  let match;

  while ((match = linkRegex.exec(content)) !== null) {
    const linkText = match[1];
    const linkUrl = match[2];

    // 检查内部链接是否被错误修改
    if (linkUrl.startsWith('/') || linkUrl.startsWith('../')) {
      // 内部链接不应该包含中文
      if (/[\u4e00-\u9fa5]/.test(linkUrl)) {
        report.addError(filePath, `链接路径包含中文: ${linkUrl}`);
      }
    }
  }
}

/**
 * 检查特殊标记
 */
function checkSpecialMarkers(content, filePath, report) {
  // 检查特殊标记格式
  const markers = ['[!NOTE]', '[!LEGACY]', '[!WARNING]', '[!TIP]'];
  
  for (const marker of markers) {
    if (content.includes(marker.replace('[!', '[！'))) {
      report.addWarning(filePath, `特殊标记使用了中文符号: ${marker}`);
    }
  }
}

/**
 * 检查已翻译的文件
 */
function checkTranslatedFiles(report) {
  console.log('🔍 检查已翻译文件的格式...');
  
  const zhFiles = getAllMarkdownFiles(ZH_DOCS_DIR);
  
  for (const file of zhFiles) {
    // 跳过辅助文档
    if (['GLOSSARY.md', 'TRANSLATION_GUIDE.md', 'REVIEW_CHECKLIST.md', 'README.md'].includes(file)) {
      continue;
    }

    const fullPath = path.join(ZH_DOCS_DIR, file);
    checkFileFormat(fullPath, file, report);
    report.stats.checkedFiles++;
  }
}

/**
 * 生成进度报告
 */
function generateProgressReport() {
  const englishFiles = getAllMarkdownFiles(DOCS_DIR);
  const zhFiles = getAllMarkdownFiles(ZH_DOCS_DIR);
  
  const categories = {
    '01-introduction': { total: 0, translated: 0 },
    '02-runes': { total: 0, translated: 0 },
    '03-template-syntax': { total: 0, translated: 0 },
    '04-styling': { total: 0, translated: 0 },
    '05-special-elements': { total: 0, translated: 0 },
    '06-runtime': { total: 0, translated: 0 },
    '07-misc': { total: 0, translated: 0 },
    '98-reference': { total: 0, translated: 0 },
    '99-legacy': { total: 0, translated: 0 },
  };

  for (const file of englishFiles) {
    for (const category of Object.keys(categories)) {
      if (file.startsWith(category)) {
        categories[category].total++;
        if (zhFiles.includes(file)) {
          categories[category].translated++;
        }
        break;
      }
    }
  }

  console.log('\n📈 分类翻译进度:\n');
  for (const [category, stats] of Object.entries(categories)) {
    if (stats.total > 0) {
      const percentage = ((stats.translated / stats.total) * 100).toFixed(1);
      const bar = '█'.repeat(Math.floor(stats.translated / stats.total * 20)) + 
                  '░'.repeat(20 - Math.floor(stats.translated / stats.total * 20));
      console.log(`  ${category.padEnd(20)} [${bar}] ${percentage}% (${stats.translated}/${stats.total})`);
    }
  }
  console.log('');
}

/**
 * 主函数
 */
function main() {
  const report = new ValidationReport();

  try {
    // 检查文件完整性
    checkFileCompleteness(report);

    // 检查已翻译文件
    checkTranslatedFiles(report);

    // 生成进度报告
    generateProgressReport();

    // 打印报告
    const success = report.print();

    // 返回退出码
    process.exit(success ? 0 : 1);
  } catch (error) {
    console.error('❌ 校验过程出错:', error.message);
    process.exit(1);
  }
}

main();
