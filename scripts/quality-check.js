#!/usr/bin/env node

/**
 * 代码质量检查脚本
 * 自动化执行各种代码质量检查
 */

import { execSync } from 'child_process';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';
import { blue, gray, green, red, yellow, bold } from 'chalk';

// 检查项目配置
const checks = {
  // TypeScript 类型检查
  typeCheck: {
    name: 'TypeScript 类型检查',
    command: 'npm run type-check',
    required: true,
  },

  // ESLint 检查
  lint: {
    name: 'ESLint 代码检查',
    command: 'npm run lint:check',
    required: true,
  },

  // Prettier 格式检查
  format: {
    name: 'Prettier 格式检查',
    command: 'npm run format:check',
    required: true,
  },

  // 单元测试
  test: {
    name: '单元测试',
    command: 'npm run test:ci',
    required: true,
  },

  // 安全检查
  security: {
    name: '安全漏洞检查',
    command: 'npm audit --audit-level=moderate',
    required: false,
  },

  // 构建检查
  build: {
    name: '构建检查',
    command: 'npm run build',
    required: true,
  },
};

// 结果统计
const results = {
  passed: 0,
  failed: 0,
  warnings: 0,
  total: 0,
};

// 执行命令并捕获输出
function executeCommand(command, name) {
  console.log(blue(`\n🔍 执行: ${name}`));
  console.log(gray(`命令: ${command}`));

  try {
    const output = execSync(command, {
      encoding: 'utf8',
      stdio: 'pipe',
      cwd: process.cwd(),
    });

    console.log(green(`✅ ${name} - 通过`));
    if (output.trim()) {
      console.log(gray(output.trim()));
    }

    return { success: true, output };
  } catch (error) {
    console.log(red(`❌ ${name} - 失败`));
    if (error.stdout) {
      console.log(yellow('标准输出:'));
      console.log(error.stdout.toString());
    }
    if (error.stderr) {
      console.log(red('错误输出:'));
      console.log(error.stderr.toString());
    }

    return { success: false, error: error.message, output: error.stdout };
  }
}

// 检查项目依赖
function checkDependencies() {
  console.log(blue('\n📦 检查项目依赖...'));

  const packageJsonPath = join(process.cwd(), 'package.json');
  if (!existsSync(packageJsonPath)) {
    console.log(red('❌ 未找到 package.json 文件'));
    return false;
  }

  const nodeModulesPath = join(process.cwd(), 'node_modules');
  if (!existsSync(nodeModulesPath)) {
    console.log(yellow('⚠️  未找到 node_modules，正在安装依赖...'));
    try {
      execSync('npm install', { stdio: 'inherit' });
      console.log(green('✅ 依赖安装完成'));
    } catch (error) {
      console.log(red('❌ 依赖安装失败'));
      return false;
    }
  }

  console.log(green('✅ 项目依赖检查通过'));
  return true;
}

// 生成质量报告
function generateReport() {
  console.log(blue('\n📊 生成质量报告...'));

  const reportData = {
    timestamp: new Date().toISOString(),
    results,
    checks: Object.keys(checks).map(key => ({
      name: checks[key].name,
      command: checks[key].command,
      required: checks[key].required,
      status: results[key] ? 'passed' : 'failed',
    })),
  };

  const reportsDir = join(process.cwd(), 'reports');
  if (!existsSync(reportsDir)) {
    mkdirSync(reportsDir, { recursive: true });
  }

  const reportPath = join(reportsDir, `quality-report-${Date.now()}.json`);
  writeFileSync(reportPath, JSON.stringify(reportData, null, 2));

  console.log(green(`✅ 质量报告已生成: ${reportPath}`));

  // 生成 Markdown 报告
  const markdownReport = generateMarkdownReport(reportData);
  const markdownPath = join(reportsDir, `quality-report-${Date.now()}.md`);
  writeFileSync(markdownPath, markdownReport);

  console.log(green(`✅ Markdown 报告已生成: ${markdownPath}`));
}

// 生成 Markdown 格式报告
function generateMarkdownReport(data) {
  const { results, checks } = data;
  const timestamp = new Date(data.timestamp).toLocaleString('zh-CN');

  let markdown = `# 代码质量检查报告\n\n`;
  markdown += `**生成时间**: ${timestamp}\n\n`;

  // 概要
  markdown += `## 📊 检查概要\n\n`;
  markdown += `- ✅ 通过: ${results.passed}\n`;
  markdown += `- ❌ 失败: ${results.failed}\n`;
  markdown += `- ⚠️  警告: ${results.warnings}\n`;
  markdown += `- 📋 总计: ${results.total}\n\n`;

  // 详细结果
  markdown += `## 📋 详细结果\n\n`;
  markdown += `| 检查项 | 状态 | 必需 | 命令 |\n`;
  markdown += `|--------|------|------|------|\n`;

  checks.forEach(check => {
    const status = check.status === 'passed' ? '✅ 通过' : '❌ 失败';
    const required = check.required ? '是' : '否';
    markdown += `| ${check.name} | ${status} | ${required} | \`${check.command}\` |\n`;
  });

  markdown += `\n`;

  // 建议
  if (results.failed > 0) {
    markdown += `## 💡 改进建议\n\n`;
    markdown += `- 🔧 修复失败的检查项\n`;
    markdown += `- 📝 查看详细错误信息\n`;
    markdown += `- 🔄 重新运行检查\n\n`;
  } else {
    markdown += `## 🎉 恭喜\n\n`;
    markdown += `所有检查项都已通过！代码质量良好。\n\n`;
  }

  return markdown;
}

// 主函数
async function main() {
  console.log(bold.blue('🚀 开始代码质量检查\n'));

  // 检查依赖
  if (!checkDependencies()) {
    process.exit(1);
  }

  // 执行所有检查
  for (const [key, check] of Object.entries(checks)) {
    results.total++;

    const result = executeCommand(check.command, check.name);

    if (result.success) {
      results.passed++;
      results[key] = true;
    } else {
      if (check.required) {
        results.failed++;
        results[key] = false;
      } else {
        results.warnings++;
        results[key] = 'warning';
      }
    }
  }

  // 生成报告
  generateReport();

  // 输出总结
  console.log(bold.blue('\n📊 检查完成'));
  console.log(green(`✅ 通过: ${results.passed}`));
  console.log(red(`❌ 失败: ${results.failed}`));
  console.log(yellow(`⚠️  警告: ${results.warnings}`));
  console.log(blue(`📋 总计: ${results.total}`));

  // 根据结果设置退出码
  if (results.failed > 0) {
    console.log(red('\n💥 质量检查失败，请修复问题后重试'));
    process.exit(1);
  } else {
    console.log(green('\n🎉 所有质量检查通过！'));
    process.exit(0);
  }
}

// 错误处理
process.on('uncaughtException', error => {
  console.error(red('💥 未捕获的异常:'), error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error(red('💥 未处理的 Promise 拒绝:'), reason);
  process.exit(1);
});

// 运行主函数
if (require.main === module) {
  main().catch(error => {
    console.error(red('💥 执行失败:'), error);
    process.exit(1);
  });
}

export default { executeCommand, checkDependencies, generateReport };
