#!/usr/bin/env node

/**
 * 翻译进度统计脚本
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DOCS_DIR = path.resolve(__dirname, '../../docs');
const ZH_DOCS_DIR = path.resolve(__dirname, '..');

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

function countWords(content) {
  // 统计中文字符和英文单词
  const chineseChars = (content.match(/[\u4e00-\u9fa5]/g) || []).length;
  const englishWords = (content.match(/[a-zA-Z]+/g) || []).length;
  return { chineseChars, englishWords };
}

function main() {
  const englishFiles = getAllMarkdownFiles(DOCS_DIR);
  const zhFiles = getAllMarkdownFiles(ZH_DOCS_DIR).filter(
    f => !['GLOSSARY.md', 'TRANSLATION_GUIDE.md', 'REVIEW_CHECKLIST.md', 'README.md'].includes(f)
  );

  console.log('\n📊 Svelte 文档翻译进度统计\n');
  console.log('='.repeat(60));
  
  const stats = {
    total: englishFiles.length,
    translated: 0,
    totalChineseChars: 0,
    totalEnglishWords: 0,
  };

  const missingFiles = [];

  for (const file of englishFiles) {
    const zhFile = path.join(ZH_DOCS_DIR, file);
    
    if (fs.existsSync(zhFile)) {
      stats.translated++;
      const content = fs.readFileSync(zhFile, 'utf-8');
      const { chineseChars, englishWords } = countWords(content);
      stats.totalChineseChars += chineseChars;
      stats.totalEnglishWords += englishWords;
    } else {
      missingFiles.push(file);
    }
  }

  const percentage = ((stats.translated / stats.total) * 100).toFixed(1);

  console.log(`\n总文件数: ${stats.total}`);
  console.log(`已翻译: ${stats.translated}`);
  console.log(`待翻译: ${stats.total - stats.translated}`);
  console.log(`完成度: ${percentage}%`);
  console.log(`\n总字数统计:`);
  console.log(`  中文字符: ${stats.totalChineseChars.toLocaleString()}`);
  console.log(`  英文单词: ${stats.totalEnglishWords.toLocaleString()}`);

  if (missingFiles.length > 0 && missingFiles.length <= 20) {
    console.log(`\n待翻译文件 (${missingFiles.length}):`);
    missingFiles.forEach(f => console.log(`  - ${f}`));
  }

  console.log('\n' + '='.repeat(60) + '\n');
}

main();
