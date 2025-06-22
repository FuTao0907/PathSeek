/**
 * 代码质量检查工具模块
 * 提供代码质量分析和改进建议
 */

/**
 * 代码复杂度分析器
 */
export class ComplexityAnalyzer {
  /**
   * 计算圈复杂度
   */
  static calculateCyclomaticComplexity(code: string): number {
    // 简化的圈复杂度计算
    const patterns = [
      /\bif\b/g,
      /\belse\s+if\b/g,
      /\bwhile\b/g,
      /\bfor\b/g,
      /\bdo\b/g,
      /\bswitch\b/g,
      /\bcase\b/g,
      /\bcatch\b/g,
      /\btry\b/g,
      /\?/g, // 三元操作符
      /&&/g,
      /\|\|/g,
    ];

    let complexity = 1; // 基础复杂度

    patterns.forEach(pattern => {
      const matches = code.match(pattern);
      if (matches) {
        complexity += matches.length;
      }
    });

    return complexity;
  }

  /**
   * 分析函数长度
   */
  static analyzeFunctionLength(code: string): {
    functionName: string;
    lineCount: number;
    complexity: number;
    recommendation: string;
  }[] {
    const functions: {
      functionName: string;
      lineCount: number;
      complexity: number;
      recommendation: string;
    }[] = [];

    // 匹配函数定义
    const functionRegex =
      /(?:function\s+(\w+)|const\s+(\w+)\s*=\s*(?:async\s+)?(?:\([^)]*\)\s*=>|function))([\s\S]*?)(?=\n(?:function|const|export|$))/g;

    let match;
    while ((match = functionRegex.exec(code)) !== null) {
      const functionName = match[1] || match[2] || 'anonymous';
      const functionBody = match[3] || '';
      const lineCount = functionBody.split('\n').length;
      const complexity = this.calculateCyclomaticComplexity(functionBody);

      let recommendation = '良好';
      if (lineCount > 50) {
        recommendation = '函数过长，建议拆分';
      } else if (complexity > 10) {
        recommendation = '复杂度过高，建议简化';
      } else if (lineCount > 30 || complexity > 7) {
        recommendation = '需要关注，考虑重构';
      }

      functions.push({
        functionName,
        lineCount,
        complexity,
        recommendation,
      });
    }

    return functions;
  }

  /**
   * 检查代码重复
   */
  static findDuplicateCode(
    code: string,
    minLength = 3
  ): {
    pattern: string;
    occurrences: number;
    lines: number[];
  }[] {
    const lines = code.split('\n');
    const duplicates: Map<string, number[]> = new Map();

    // 检查连续行的重复
    for (let i = 0; i <= lines.length - minLength; i++) {
      for (let j = minLength; j <= Math.min(10, lines.length - i); j++) {
        const pattern = lines
          .slice(i, i + j)
          .map(line => line.trim())
          .filter(line => line.length > 0)
          .join('\n');

        if (pattern.length > 20) {
          // 只检查有意义的代码块
          if (!duplicates.has(pattern)) {
            duplicates.set(pattern, []);
          }
          const patternLines = duplicates.get(pattern);
          if (patternLines) {
            patternLines.push(i + 1);
          }
        }
      }
    }

    return Array.from(duplicates.entries())
      .filter(([, occurrences]) => occurrences.length > 1)
      .map(([pattern, lines]) => ({
        pattern:
          pattern.substring(0, 100) + (pattern.length > 100 ? '...' : ''),
        occurrences: lines.length,
        lines,
      }))
      .sort((a, b) => b.occurrences - a.occurrences);
  }
}

/**
 * 代码风格检查器
 */
export class StyleChecker {
  /**
   * 检查命名约定
   */
  static checkNamingConventions(code: string): {
    type: string;
    name: string;
    issue: string;
    suggestion: string;
  }[] {
    const issues: {
      type: string;
      name: string;
      issue: string;
      suggestion: string;
    }[] = [];

    // 检查变量命名（camelCase）
    const variableRegex = /(?:const|let|var)\s+([a-zA-Z_$][a-zA-Z0-9_$]*)/g;
    let match: RegExpExecArray | null;
    while ((match = variableRegex.exec(code)) !== null) {
      const varName = match[1];
      if (varName && (
        !/^[a-z][a-zA-Z0-9]*$/.test(varName) &&
        !/^[A-Z_][A-Z0-9_]*$/.test(varName)
      )) {
        issues.push({
          type: '变量',
          name: varName,
          issue: '不符合 camelCase 命名约定',
          suggestion: this.toCamelCase(varName),
        });
      }
    }

    // 检查函数命名（camelCase）
    const functionRegex = /function\s+([a-zA-Z_$][a-zA-Z0-9_$]*)/g;
    while ((match = functionRegex.exec(code)) !== null) {
      const funcName = match[1];
      if (funcName && !/^[a-z][a-zA-Z0-9]*$/.test(funcName)) {
        issues.push({
          type: '函数',
          name: funcName,
          issue: '不符合 camelCase 命名约定',
          suggestion: this.toCamelCase(funcName),
        });
      }
    }

    // 检查类命名（PascalCase）
    const classRegex = /class\s+([a-zA-Z_$][a-zA-Z0-9_$]*)/g;
    while ((match = classRegex.exec(code)) !== null) {
      const className = match[1];
      if (className && !/^[A-Z][a-zA-Z0-9]*$/.test(className)) {
        issues.push({
          type: '类',
          name: className,
          issue: '不符合 PascalCase 命名约定',
          suggestion: this.toPascalCase(className),
        });
      }
    }

    return issues;
  }

  /**
   * 转换为 camelCase
   */
  private static toCamelCase(str: string): string {
    return str
      .replace(/[-_\s](.)/g, (_, char) => char.toUpperCase())
      .replace(/^[A-Z]/, char => char.toLowerCase());
  }

  /**
   * 转换为 PascalCase
   */
  private static toPascalCase(str: string): string {
    return str
      .replace(/[-_\s](.)/g, (_, char) => char.toUpperCase())
      .replace(/^[a-z]/, char => char.toUpperCase());
  }

  /**
   * 检查代码格式
   */
  static checkFormatting(code: string): {
    line: number;
    issue: string;
    suggestion: string;
  }[] {
    const issues: {
      line: number;
      issue: string;
      suggestion: string;
    }[] = [];

    const lines = code.split('\n');

    lines.forEach((line, index) => {
      const lineNumber = index + 1;

      // 检查行尾空格
      if (line.endsWith(' ') || line.endsWith('\t')) {
        issues.push({
          line: lineNumber,
          issue: '行尾有多余空格',
          suggestion: '删除行尾空格',
        });
      }

      // 检查过长的行
      if (line.length > 120) {
        issues.push({
          line: lineNumber,
          issue: '行过长（超过120字符）',
          suggestion: '考虑换行或简化代码',
        });
      }

      // 检查缩进一致性
      const leadingSpacesMatch = line.match(/^\s*/);
      if (leadingSpacesMatch) {
        const leadingSpaces = leadingSpacesMatch[0];
        if (leadingSpaces.includes(' ') && leadingSpaces.includes('\t')) {
          issues.push({
            line: lineNumber,
            issue: '混合使用空格和制表符缩进',
            suggestion: '统一使用空格或制表符',
          });
        }
      }
    });

    return issues;
  }
}

/**
 * 安全检查器
 */
export class SecurityChecker {
  /**
   * 检查潜在的安全问题
   */
  static checkSecurityIssues(code: string): {
    type: string;
    line: number;
    issue: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    suggestion: string;
  }[] {
    const issues: {
      type: string;
      line: number;
      issue: string;
      severity: 'low' | 'medium' | 'high' | 'critical';
      suggestion: string;
    }[] = [];

    const lines = code.split('\n');

    lines.forEach((line, index) => {
      const lineNumber = index + 1;

      // 检查 eval 使用
      if (line.includes('eval(')) {
        issues.push({
          type: 'Code Injection',
          line: lineNumber,
          issue: '使用了 eval() 函数',
          severity: 'critical',
          suggestion:
            '避免使用 eval()，考虑使用 JSON.parse() 或其他安全替代方案',
        });
      }

      // 检查 innerHTML 使用
      if (line.includes('.innerHTML')) {
        issues.push({
          type: 'XSS',
          line: lineNumber,
          issue: '直接设置 innerHTML 可能导致 XSS',
          severity: 'high',
          suggestion: '使用 textContent 或进行适当的输入清理',
        });
      }

      // 检查硬编码的敏感信息
      const sensitivePatterns = [
        { pattern: /password\s*[=:]\s*['"][^'"]+['"]/i, type: 'Password' },
        { pattern: /api[_-]?key\s*[=:]\s*['"][^'"]+['"]/i, type: 'API Key' },
        { pattern: /secret\s*[=:]\s*['"][^'"]+['"]/i, type: 'Secret' },
        { pattern: /token\s*[=:]\s*['"][^'"]+['"]/i, type: 'Token' },
      ];

      sensitivePatterns.forEach(({ pattern, type }) => {
        if (pattern.test(line)) {
          issues.push({
            type: 'Sensitive Data',
            line: lineNumber,
            issue: `硬编码的${type}`,
            severity: 'critical',
            suggestion: '使用环境变量或安全的配置管理',
          });
        }
      });

      // 检查不安全的随机数生成
      if (line.includes('Math.random()')) {
        issues.push({
          type: 'Weak Randomness',
          line: lineNumber,
          issue: 'Math.random() 不适用于安全相关的随机数生成',
          severity: 'medium',
          suggestion: '对于安全用途，使用 crypto.getRandomValues()',
        });
      }
    });

    return issues;
  }
}

/**
 * 性能检查器
 */
export class PerformanceChecker {
  /**
   * 检查性能问题
   */
  static checkPerformanceIssues(code: string): {
    type: string;
    line: number;
    issue: string;
    impact: 'low' | 'medium' | 'high';
    suggestion: string;
  }[] {
    const issues: {
      type: string;
      line: number;
      issue: string;
      impact: 'low' | 'medium' | 'high';
      suggestion: string;
    }[] = [];

    const lines = code.split('\n');

    lines.forEach((line, index) => {
      const lineNumber = index + 1;

      // 检查循环中的 DOM 操作
      if (
        (line.includes('for') || line.includes('while')) &&
        (line.includes('document.') || line.includes('querySelector'))
      ) {
        issues.push({
          type: 'DOM Performance',
          line: lineNumber,
          issue: '循环中进行 DOM 操作',
          impact: 'high',
          suggestion: '将 DOM 操作移出循环，或使用 DocumentFragment',
        });
      }

      // 检查频繁的字符串拼接
      if (line.includes('+=') && line.includes('"')) {
        issues.push({
          type: 'String Performance',
          line: lineNumber,
          issue: '使用 += 进行字符串拼接',
          impact: 'medium',
          suggestion: '对于大量字符串拼接，考虑使用数组 join() 或模板字符串',
        });
      }

      // 检查同步的 localStorage 操作
      if (line.includes('localStorage.') || line.includes('sessionStorage.')) {
        issues.push({
          type: 'Storage Performance',
          line: lineNumber,
          issue: '同步的存储操作可能阻塞主线程',
          impact: 'medium',
          suggestion: '考虑使用异步存储方案或批量操作',
        });
      }

      // 检查未优化的正则表达式
      const regexPattern = /new RegExp\(|\/.+\/[gimuy]*(?!\s*\.|\s*\[)/;
      if (
        regexPattern.test(line) &&
        !line.includes('const') &&
        !line.includes('let')
      ) {
        issues.push({
          type: 'Regex Performance',
          line: lineNumber,
          issue: '在循环或频繁调用中创建正则表达式',
          impact: 'medium',
          suggestion: '将正则表达式定义为常量，避免重复创建',
        });
      }
    });

    return issues;
  }
}

/**
 * 代码质量报告生成器
 */
export class QualityReporter {
  /**
   * 生成完整的代码质量报告
   */
  static generateReport(code: string): {
    summary: {
      totalLines: number;
      totalFunctions: number;
      averageComplexity: number;
      qualityScore: number;
    };
    complexity: ReturnType<typeof ComplexityAnalyzer.analyzeFunctionLength>;
    duplicates: ReturnType<typeof ComplexityAnalyzer.findDuplicateCode>;
    style: ReturnType<typeof StyleChecker.checkNamingConventions>;
    formatting: ReturnType<typeof StyleChecker.checkFormatting>;
    security: ReturnType<typeof SecurityChecker.checkSecurityIssues>;
    performance: ReturnType<typeof PerformanceChecker.checkPerformanceIssues>;
    recommendations: string[];
  } {
    const lines = code.split('\n');
    const complexity = ComplexityAnalyzer.analyzeFunctionLength(code);
    const duplicates = ComplexityAnalyzer.findDuplicateCode(code);
    const style = StyleChecker.checkNamingConventions(code);
    const formatting = StyleChecker.checkFormatting(code);
    const security = SecurityChecker.checkSecurityIssues(code);
    const performance = PerformanceChecker.checkPerformanceIssues(code);

    const averageComplexity =
      complexity.length > 0
        ? complexity.reduce((sum, fn) => sum + fn.complexity, 0) /
          complexity.length
        : 0;

    // 计算质量分数（0-100）
    let qualityScore = 100;
    qualityScore -=
      security.filter(issue => issue.severity === 'critical').length * 20;
    qualityScore -=
      security.filter(issue => issue.severity === 'high').length * 10;
    qualityScore -=
      security.filter(issue => issue.severity === 'medium').length * 5;
    qualityScore -=
      performance.filter(issue => issue.impact === 'high').length * 10;
    qualityScore -=
      performance.filter(issue => issue.impact === 'medium').length * 5;
    qualityScore -= style.length * 2;
    qualityScore -= formatting.length * 1;
    qualityScore -= duplicates.length * 5;
    qualityScore -= Math.max(0, averageComplexity - 5) * 2;

    qualityScore = Math.max(0, Math.min(100, qualityScore));

    // 生成建议
    const recommendations: string[] = [];

    if (security.some(issue => issue.severity === 'critical')) {
      recommendations.push('🚨 立即修复严重安全问题');
    }

    if (averageComplexity > 10) {
      recommendations.push('🔄 重构复杂函数，降低圈复杂度');
    }

    if (duplicates.length > 0) {
      recommendations.push('♻️ 提取重复代码为可复用函数');
    }

    if (performance.some(issue => issue.impact === 'high')) {
      recommendations.push('⚡ 优化性能瓶颈');
    }

    if (style.length > 5) {
      recommendations.push('📝 统一代码命名规范');
    }

    if (formatting.length > 10) {
      recommendations.push('🎨 使用代码格式化工具');
    }

    if (qualityScore > 90) {
      recommendations.push('✅ 代码质量优秀，继续保持');
    } else if (qualityScore > 70) {
      recommendations.push('👍 代码质量良好，可进一步优化');
    } else {
      recommendations.push('⚠️ 代码质量需要改进');
    }

    return {
      summary: {
        totalLines: lines.length,
        totalFunctions: complexity.length,
        averageComplexity: Math.round(averageComplexity * 100) / 100,
        qualityScore: Math.round(qualityScore),
      },
      complexity,
      duplicates,
      style,
      formatting,
      security,
      performance,
      recommendations,
    };
  }

  /**
   * 生成 Markdown 格式的报告
   */
  static generateMarkdownReport(code: string): string {
    const report = this.generateReport(code);

    let markdown = `# 代码质量报告\n\n`;

    // 概要
    markdown += `## 📊 概要\n\n`;
    markdown += `- **总行数**: ${report.summary.totalLines}\n`;
    markdown += `- **函数数量**: ${report.summary.totalFunctions}\n`;
    markdown += `- **平均复杂度**: ${report.summary.averageComplexity}\n`;
    markdown += `- **质量分数**: ${report.summary.qualityScore}/100\n\n`;

    // 建议
    if (report.recommendations.length > 0) {
      markdown += `## 💡 建议\n\n`;
      report.recommendations.forEach(rec => {
        markdown += `- ${rec}\n`;
      });
      markdown += `\n`;
    }

    // 安全问题
    if (report.security.length > 0) {
      markdown += `## 🔒 安全问题\n\n`;
      report.security.forEach(issue => {
        const severity =
          issue.severity === 'critical'
            ? '🚨'
            : issue.severity === 'high'
              ? '⚠️'
              : issue.severity === 'medium'
                ? '⚡'
                : 'ℹ️';
        markdown += `${severity} **第${issue.line}行**: ${issue.issue}\n`;
        markdown += `   - 建议: ${issue.suggestion}\n\n`;
      });
    }

    // 性能问题
    if (report.performance.length > 0) {
      markdown += `## ⚡ 性能问题\n\n`;
      report.performance.forEach(issue => {
        const impact =
          issue.impact === 'high'
            ? '🔴'
            : issue.impact === 'medium'
              ? '🟡'
              : '🟢';
        markdown += `${impact} **第${issue.line}行**: ${issue.issue}\n`;
        markdown += `   - 建议: ${issue.suggestion}\n\n`;
      });
    }

    // 复杂度分析
    if (report.complexity.length > 0) {
      markdown += `## 🔄 复杂度分析\n\n`;
      markdown += `| 函数名 | 行数 | 复杂度 | 建议 |\n`;
      markdown += `|--------|------|--------|------|\n`;
      report.complexity.forEach(fn => {
        markdown += `| ${fn.functionName} | ${fn.lineCount} | ${fn.complexity} | ${fn.recommendation} |\n`;
      });
      markdown += `\n`;
    }

    return markdown;
  }
}

// 在开发环境中暴露到全局对象
if (process.env.NODE_ENV === 'development') {
  (window as any).codeQuality = {
    ComplexityAnalyzer,
    StyleChecker,
    SecurityChecker,
    PerformanceChecker,
    QualityReporter,
  };
}
