#!/usr/bin/env node

/**
 * CSS 开发工具脚本
 * 提供CSS构建、监听、检查和优化功能
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const chokidar = require('chokidar');

// 配置
const config = {
  srcDir: path.join(__dirname, '../src/styles'),
  distDir: path.join(__dirname, '../dist/css'),
  tempDir: path.join(__dirname, '../.temp'),
  watchPatterns: [
    'src/styles/**/*.css',
    'src/components/**/*.css',
    'src/**/*.module.css'
  ],
  buildCommand: 'npm run build:css',
  lintCommand: 'npm run css:lint',
  testCommand: 'npm run css:test'
};

// 颜色输出
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

const log = {
  info: (msg) => console.log(`${colors.blue}ℹ${colors.reset} ${msg}`),
  success: (msg) => console.log(`${colors.green}✓${colors.reset} ${msg}`),
  warning: (msg) => console.log(`${colors.yellow}⚠${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.red}✗${colors.reset} ${msg}`),
  title: (msg) => console.log(`${colors.bright}${colors.cyan}${msg}${colors.reset}`)
};

// 确保目录存在
function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    log.info(`Created directory: ${dir}`);
  }
}

// 执行命令
function execCommand(command, options = {}) {
  try {
    const result = execSync(command, {
      encoding: 'utf8',
      stdio: 'pipe',
      ...options
    });
    return { success: true, output: result };
  } catch (error) {
    return { success: false, error: error.message, output: error.stdout };
  }
}

// CSS 构建
function buildCSS() {
  log.title('🔨 Building CSS...');
  
  const startTime = Date.now();
  const result = execCommand(config.buildCommand);
  const duration = Date.now() - startTime;
  
  if (result.success) {
    log.success(`CSS built successfully in ${duration}ms`);
    return true;
  } else {
    log.error('CSS build failed:');
    console.log(result.error);
    return false;
  }
}

// CSS 检查
function lintCSS() {
  log.title('🔍 Linting CSS...');
  
  const result = execCommand(config.lintCommand);
  
  if (result.success) {
    log.success('CSS linting passed');
    if (result.output) {
      console.log(result.output);
    }
    return true;
  } else {
    log.error('CSS linting failed:');
    console.log(result.error);
    return false;
  }
}

// CSS 测试
function testCSS() {
  log.title('🧪 Testing CSS...');
  
  const result = execCommand(config.testCommand);
  
  if (result.success) {
    log.success('CSS tests passed');
    if (result.output) {
      console.log(result.output);
    }
    return true;
  } else {
    log.error('CSS tests failed:');
    console.log(result.error);
    return false;
  }
}

// 分析CSS文件
function analyzeCSS() {
  log.title('📊 Analyzing CSS...');
  
  const cssFiles = [];
  const walkDir = (dir) => {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      if (stat.isDirectory()) {
        walkDir(filePath);
      } else if (file.endsWith('.css')) {
        cssFiles.push(filePath);
      }
    });
  };
  
  if (fs.existsSync(config.srcDir)) {
    walkDir(config.srcDir);
  }
  
  let totalSize = 0;
  let totalLines = 0;
  const analysis = {
    files: cssFiles.length,
    totalSize: 0,
    totalLines: 0,
    averageFileSize: 0,
    largestFile: { name: '', size: 0 },
    cssVariables: new Set(),
    selectors: new Set(),
    mediaQueries: new Set()
  };
  
  cssFiles.forEach(file => {
    const content = fs.readFileSync(file, 'utf8');
    const size = Buffer.byteLength(content, 'utf8');
    const lines = content.split('\n').length;
    
    totalSize += size;
    totalLines += lines;
    
    if (size > analysis.largestFile.size) {
      analysis.largestFile = { name: path.basename(file), size };
    }
    
    // 分析CSS变量
    const variableMatches = content.match(/--[a-zA-Z0-9-]+/g);
    if (variableMatches) {
      variableMatches.forEach(variable => analysis.cssVariables.add(variable));
    }
    
    // 分析选择器
    const selectorMatches = content.match(/\.[a-zA-Z0-9-_]+/g);
    if (selectorMatches) {
      selectorMatches.forEach(selector => analysis.selectors.add(selector));
    }
    
    // 分析媒体查询
    const mediaMatches = content.match(/@media[^{]+/g);
    if (mediaMatches) {
      mediaMatches.forEach(media => analysis.mediaQueries.add(media.trim()));
    }
  });
  
  analysis.totalSize = totalSize;
  analysis.totalLines = totalLines;
  analysis.averageFileSize = Math.round(totalSize / cssFiles.length);
  
  // 输出分析结果
  console.log('\n📈 CSS Analysis Results:');
  console.log(`Files: ${analysis.files}`);
  console.log(`Total size: ${(analysis.totalSize / 1024).toFixed(2)} KB`);
  console.log(`Total lines: ${analysis.totalLines}`);
  console.log(`Average file size: ${(analysis.averageFileSize / 1024).toFixed(2)} KB`);
  console.log(`Largest file: ${analysis.largestFile.name} (${(analysis.largestFile.size / 1024).toFixed(2)} KB)`);
  console.log(`CSS variables: ${analysis.cssVariables.size}`);
  console.log(`Unique selectors: ${analysis.selectors.size}`);
  console.log(`Media queries: ${analysis.mediaQueries.size}`);
  
  // 保存分析报告
  const reportPath = path.join(config.tempDir, 'css-analysis.json');
  ensureDir(config.tempDir);
  fs.writeFileSync(reportPath, JSON.stringify({
    ...analysis,
    cssVariables: Array.from(analysis.cssVariables),
    selectors: Array.from(analysis.selectors),
    mediaQueries: Array.from(analysis.mediaQueries),
    timestamp: new Date().toISOString()
  }, null, 2));
  
  log.success(`Analysis report saved to: ${reportPath}`);
}

// 监听模式
function watchCSS() {
  log.title('👀 Watching CSS files...');
  
  const watcher = chokidar.watch(config.watchPatterns, {
    ignored: /node_modules/,
    persistent: true,
    ignoreInitial: true
  });
  
  let buildTimeout;
  
  const debouncedBuild = () => {
    clearTimeout(buildTimeout);
    buildTimeout = setTimeout(() => {
      log.info('CSS files changed, rebuilding...');
      const success = buildCSS();
      if (success) {
        log.success('Rebuild completed');
      }
    }, 300);
  };
  
  watcher
    .on('change', (filePath) => {
      log.info(`Changed: ${path.relative(process.cwd(), filePath)}`);
      debouncedBuild();
    })
    .on('add', (filePath) => {
      log.info(`Added: ${path.relative(process.cwd(), filePath)}`);
      debouncedBuild();
    })
    .on('unlink', (filePath) => {
      log.info(`Removed: ${path.relative(process.cwd(), filePath)}`);
      debouncedBuild();
    })
    .on('error', (error) => {
      log.error(`Watcher error: ${error}`);
    });
  
  log.success('Watching for changes... (Press Ctrl+C to stop)');
  
  // 优雅退出
  process.on('SIGINT', () => {
    log.info('Stopping watcher...');
    watcher.close();
    process.exit(0);
  });
}

// 清理构建文件
function cleanCSS() {
  log.title('🧹 Cleaning CSS build files...');
  
  const dirsToClean = [config.distDir, config.tempDir];
  
  dirsToClean.forEach(dir => {
    if (fs.existsSync(dir)) {
      fs.rmSync(dir, { recursive: true, force: true });
      log.success(`Cleaned: ${dir}`);
    }
  });
}

// 生成CSS变量文档
function generateCSSVariableDocs() {
  log.title('📚 Generating CSS variables documentation...');
  
  const variablesFile = path.join(config.srcDir, 'variables.css');
  if (!fs.existsSync(variablesFile)) {
    log.error('variables.css not found');
    return;
  }
  
  const content = fs.readFileSync(variablesFile, 'utf8');
  const variables = [];
  
  // 解析CSS变量
  const lines = content.split('\n');
  let currentSection = '';
  
  lines.forEach((line, index) => {
    const trimmed = line.trim();
    
    // 检测注释作为分组
    if (trimmed.startsWith('/*') && trimmed.includes('*/')) {
      currentSection = trimmed.replace(/\/\*|\*\//g, '').trim();
    }
    
    // 检测CSS变量
    const variableMatch = trimmed.match(/^(--[a-zA-Z0-9-]+):\s*([^;]+);?/);
    if (variableMatch) {
      variables.push({
        name: variableMatch[1],
        value: variableMatch[2].trim(),
        section: currentSection,
        line: index + 1
      });
    }
  });
  
  // 生成Markdown文档
  let docs = '# CSS Variables Documentation\n\n';
  docs += `Generated on: ${new Date().toLocaleString()}\n\n`;
  
  // 按分组组织变量
  const sections = {};
  variables.forEach(variable => {
    const section = variable.section || 'Other';
    if (!sections[section]) {
      sections[section] = [];
    }
    sections[section].push(variable);
  });
  
  Object.entries(sections).forEach(([section, vars]) => {
    docs += `## ${section}\n\n`;
    docs += '| Variable | Value | Line |\n';
    docs += '|----------|-------|------|\n';
    
    vars.forEach(variable => {
      docs += `| \`${variable.name}\` | \`${variable.value}\` | ${variable.line} |\n`;
    });
    
    docs += '\n';
  });
  
  // 保存文档
  const docsPath = path.join(config.tempDir, 'css-variables.md');
  ensureDir(config.tempDir);
  fs.writeFileSync(docsPath, docs);
  
  log.success(`CSS variables documentation generated: ${docsPath}`);
  log.info(`Found ${variables.length} CSS variables in ${Object.keys(sections).length} sections`);
}

// 主函数
function main() {
  const command = process.argv[2];
  
  switch (command) {
    case 'build':
      buildCSS();
      break;
      
    case 'lint':
      lintCSS();
      break;
      
    case 'test':
      testCSS();
      break;
      
    case 'watch':
      watchCSS();
      break;
      
    case 'analyze':
      analyzeCSS();
      break;
      
    case 'clean':
      cleanCSS();
      break;
      
    case 'docs':
      generateCSSVariableDocs();
      break;
      
    case 'all':
      log.title('🚀 Running all CSS tasks...');
      cleanCSS();
      if (lintCSS() && buildCSS() && testCSS()) {
        analyzeCSS();
        generateCSSVariableDocs();
        log.success('All CSS tasks completed successfully!');
      } else {
        log.error('Some CSS tasks failed');
        process.exit(1);
      }
      break;
      
    default:
      console.log(`
${colors.bright}CSS Development Tools${colors.reset}
`);
      console.log('Usage: node scripts/css-tools.js <command>\n');
      console.log('Commands:');
      console.log('  build    - Build CSS files');
      console.log('  lint     - Lint CSS files');
      console.log('  test     - Run CSS tests');
      console.log('  watch    - Watch and rebuild CSS files');
      console.log('  analyze  - Analyze CSS files');
      console.log('  clean    - Clean build files');
      console.log('  docs     - Generate CSS variables documentation');
      console.log('  all      - Run all tasks (clean, lint, build, test, analyze, docs)');
      console.log('');
      break;
  }
}

// 运行主函数
if (require.main === module) {
  main();
}

module.exports = {
  buildCSS,
  lintCSS,
  testCSS,
  watchCSS,
  analyzeCSS,
  cleanCSS,
  generateCSSVariableDocs
};