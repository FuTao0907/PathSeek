/**
 * CSS测试工具函数
 * 用于验证主题系统和CSS变量的功能
 */

import { getCSSVariable, setCSSVariable } from '@/features/theme/theme';

/**
 * 测试CSS变量是否正确设置
 */
export const testCSSVariables = (): { [key: string]: boolean } => {
  const results: { [key: string]: boolean } = {};

  // 测试基础变量
  const testVariables = [
    '--primary-color',
    '--text-primary',
    '--bg-primary',
    '--spacing-md',
    '--font-size-base',
    '--radius-md',
    '--shadow-md',
  ];

  testVariables.forEach(variable => {
    const value = getCSSVariable(variable);
    results[variable] = value !== '' && value !== undefined;
  });

  return results;
};

/**
 * 测试主题切换功能
 */
export const testThemeSwitching = async (): Promise<boolean> => {
  try {
    const originalColor = getCSSVariable('--primary-color');

    // 设置测试颜色
    const testColor = '#ff0000';
    setCSSVariable('--primary-color', testColor);

    // 验证颜色是否改变
    const newColor = getCSSVariable('--primary-color');
    const success = newColor === testColor;

    // 恢复原始颜色
    setCSSVariable('--primary-color', originalColor);

    return success;
  } catch (error) {
    console.error('Theme switching test failed:', error);
    return false;
  }
};

/**
 * 测试响应式断点
 */
export const testResponsiveBreakpoints = (): { [key: string]: boolean } => {
  const results: { [key: string]: boolean } = {};

  const breakpoints = [
    { name: 'sm', query: '(max-width: 640px)' },
    { name: 'md', query: '(max-width: 768px)' },
    { name: 'lg', query: '(min-width: 1024px)' },
    { name: 'xl', query: '(min-width: 1280px)' },
  ];

  breakpoints.forEach(({ name, query }) => {
    try {
      const mediaQuery = window.matchMedia(query);
      results[name] = mediaQuery !== null;
    } catch (error) {
      results[name] = false;
    }
  });

  return results;
};

/**
 * 测试可访问性特性
 */
export const testAccessibilityFeatures = (): { [key: string]: boolean } => {
  const results: { [key: string]: boolean } = {};

  // 测试动画偏好
  try {
    const reducedMotionQuery = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    );
    results.reducedMotion = reducedMotionQuery !== null;
  } catch (error) {
    results.reducedMotion = false;
  }

  // 测试高对比度
  try {
    const highContrastQuery = window.matchMedia('(prefers-contrast: high)');
    results.highContrast = highContrastQuery !== null;
  } catch (error) {
    results.highContrast = false;
  }

  // 测试深色模式偏好
  try {
    const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
    results.darkMode = darkModeQuery !== null;
  } catch (error) {
    results.darkMode = false;
  }

  return results;
};

/**
 * 测试CSS工具类
 */
export const testUtilityClasses = (): { [key: string]: boolean } => {
  const results: { [key: string]: boolean } = {};

  // 创建测试元素
  const testElement = document.createElement('div');
  document.body.appendChild(testElement);

  const testClasses = [
    { name: 'margin', class: 'm-md', property: 'margin' },
    { name: 'padding', class: 'p-lg', property: 'padding' },
    { name: 'text-size', class: 'text-xl', property: 'fontSize' },
    { name: 'background', class: 'bg-primary', property: 'backgroundColor' },
    { name: 'border-radius', class: 'rounded-lg', property: 'borderRadius' },
    { name: 'display-flex', class: 'flex', property: 'display' },
    {
      name: 'justify-center',
      class: 'justify-center',
      property: 'justifyContent',
    },
  ];

  testClasses.forEach(({ name, class: className, property }) => {
    try {
      testElement.className = className;
      const computedStyle = window.getComputedStyle(testElement);
      const value = computedStyle.getPropertyValue(property);
      results[name] = value !== '' && value !== 'initial' && value !== 'auto';
    } catch (error) {
      results[name] = false;
    }
  });

  // 清理测试元素
  document.body.removeChild(testElement);

  return results;
};

/**
 * 测试CSS变量继承
 */
export const testCSSVariableInheritance = (): boolean => {
  try {
    // 创建父子元素
    const parent = document.createElement('div');
    const child = document.createElement('div');
    parent.appendChild(child);
    document.body.appendChild(parent);

    // 在父元素设置CSS变量
    parent.style.setProperty('--test-variable', '#123456');

    // 检查子元素是否能访问该变量
    const childStyle = window.getComputedStyle(child);
    const inheritedValue = childStyle
      .getPropertyValue('--test-variable')
      .trim();

    // 清理
    document.body.removeChild(parent);

    return inheritedValue === '#123456';
  } catch (error) {
    console.error('CSS variable inheritance test failed:', error);
    return false;
  }
};

/**
 * 测试主题类名应用
 */
export const testThemeClassApplication = (): { [key: string]: boolean } => {
  const results: { [key: string]: boolean } = {};
  const body = document.body;

  const themeClasses = [
    'light-theme',
    'dark-theme',
    'high-contrast-theme',
    'eye-care-theme',
  ];

  themeClasses.forEach(themeClass => {
    try {
      // 添加主题类
      body.classList.add(themeClass);

      // 检查类是否存在
      const hasClass = body.classList.contains(themeClass);

      // 移除主题类
      body.classList.remove(themeClass);

      results[themeClass] = hasClass;
    } catch (error) {
      results[themeClass] = false;
    }
  });

  return results;
};

/**
 * 运行所有CSS测试
 */
export const runAllCSSTests = async (): Promise<{
  cssVariables: { [key: string]: boolean };
  themeSwitching: boolean;
  responsiveBreakpoints: { [key: string]: boolean };
  accessibilityFeatures: { [key: string]: boolean };
  utilityClasses: { [key: string]: boolean };
  variableInheritance: boolean;
  themeClassApplication: { [key: string]: boolean };
  summary: {
    total: number;
    passed: number;
    failed: number;
    passRate: number;
  };
}> => {
  if (process.env.NODE_ENV === 'development') {
    console.log('🧪 Running CSS tests...');
  }

  const results = {
    cssVariables: testCSSVariables(),
    themeSwitching: await testThemeSwitching(),
    responsiveBreakpoints: testResponsiveBreakpoints(),
    accessibilityFeatures: testAccessibilityFeatures(),
    utilityClasses: testUtilityClasses(),
    variableInheritance: testCSSVariableInheritance(),
    themeClassApplication: testThemeClassApplication(),
  };

  // 计算总结
  let total = 0;
  let passed = 0;

  // 计算对象类型的测试结果
  Object.entries(results).forEach(([key, value]) => {
    if (typeof value === 'object' && value !== null) {
      Object.values(value).forEach(result => {
        total++;
        if (result) passed++;
      });
    } else if (typeof value === 'boolean') {
      total++;
      if (value) passed++;
    }
  });

  const failed = total - passed;
  const passRate = total > 0 ? (passed / total) * 100 : 0;

  const summary = {
    total,
    passed,
    failed,
    passRate: Math.round(passRate * 100) / 100,
  };

  if (process.env.NODE_ENV === 'development') {
    console.log('✅ CSS tests completed:', summary);
  }

  return {
    ...results,
    summary,
  };
};

/**
 * 生成测试报告
 */
export const generateTestReport = async (): Promise<string> => {
  const results = await runAllCSSTests();

  let report = '# CSS 测试报告\n\n';
  report += `## 总结\n`;
  report += `- 总测试数: ${results.summary.total}\n`;
  report += `- 通过: ${results.summary.passed}\n`;
  report += `- 失败: ${results.summary.failed}\n`;
  report += `- 通过率: ${results.summary.passRate}%\n\n`;

  // 详细结果
  Object.entries(results).forEach(([category, value]) => {
    if (category === 'summary') return;

    report += `## ${category}\n`;

    if (typeof value === 'object' && value !== null) {
      Object.entries(value).forEach(([test, result]) => {
        const status = result ? '✅' : '❌';
        report += `- ${test}: ${status}\n`;
      });
    } else {
      const status = value ? '✅' : '❌';
      report += `- ${category}: ${status}\n`;
    }

    report += '\n';
  });

  return report;
};

/**
 * 性能测试：测量CSS变量访问速度
 */
export const performanceTestCSSVariables = (): {
  getVariableTime: number;
  setVariableTime: number;
  iterations: number;
} => {
  const iterations = 1000;

  // 测试获取CSS变量的性能
  const getStart = performance.now();
  for (let i = 0; i < iterations; i++) {
    getCSSVariable('--primary-color');
  }
  const getEnd = performance.now();
  const getVariableTime = getEnd - getStart;

  // 测试设置CSS变量的性能
  const setStart = performance.now();
  for (let i = 0; i < iterations; i++) {
    setCSSVariable('--test-perf-var', `#${i.toString(16).padStart(6, '0')}`);
  }
  const setEnd = performance.now();
  const setVariableTime = setEnd - setStart;

  return {
    getVariableTime: Math.round(getVariableTime * 100) / 100,
    setVariableTime: Math.round(setVariableTime * 100) / 100,
    iterations,
  };
};
