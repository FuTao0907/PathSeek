import { ThemeMode, ThemeConfig, ThemeVariables, CSS_VARIABLES } from './types';
import { themePresets, getDefaultTheme } from './themes';
import { themePerformanceMonitor } from './themePerformance';
import { themeCache } from './themeCache';

/**
 * 将主题变量应用到CSS自定义属性
 */
export const applyThemeVariables = (variables: ThemeVariables): void => {
  const { duration } = themePerformanceMonitor.measureCSSVariableUpdate(() => {
    const root = document.documentElement;

    // 应用颜色变量
    Object.entries(variables.colors).forEach(([key, value]) => {
      const cssVar =
        CSS_VARIABLES.colors[key as keyof typeof CSS_VARIABLES.colors];
      root.style.setProperty(cssVar, value as string);
    });

    // 应用间距变量
    Object.entries(variables.spacing).forEach(([key, value]) => {
      const cssVar =
        CSS_VARIABLES.spacing[key as keyof typeof CSS_VARIABLES.spacing];
      root.style.setProperty(cssVar, value as string);
    });

    // 应用字体大小变量
    Object.entries(variables.fontSizes).forEach(([key, value]) => {
      const cssVar =
        CSS_VARIABLES.fontSizes[key as keyof typeof CSS_VARIABLES.fontSizes];
      root.style.setProperty(cssVar, value as string);
    });

    // 应用圆角变量
    Object.entries(variables.radius).forEach(([key, value]) => {
      const cssVar =
        CSS_VARIABLES.radius[key as keyof typeof CSS_VARIABLES.radius];
      root.style.setProperty(cssVar, value as string);
    });

    // 应用阴影变量
    Object.entries(variables.shadows).forEach(([key, value]) => {
      const cssVar =
        CSS_VARIABLES.shadows[key as keyof typeof CSS_VARIABLES.shadows];
      root.style.setProperty(cssVar, value as string);
    });

    // 应用断点变量
    Object.entries(variables.breakpoints).forEach(([key, value]) => {
      const cssVar =
        CSS_VARIABLES.breakpoints[
          key as keyof typeof CSS_VARIABLES.breakpoints
        ];
      root.style.setProperty(cssVar, value as string);
    });
  });

  // 在开发环境下记录 CSS 更新时间
  if (process.env.NODE_ENV === 'development' && duration > 10) {
    console.log(`🎨 CSS 变量更新耗时: ${duration.toFixed(2)}ms`);
  }
};

/**
 * 应用主题模式
 */
export const applyThemeMode = (mode: ThemeMode): void => {
  const body = document.body;
  const root = document.documentElement;

  // 清除所有主题类名
  body.classList.remove(
    'light-theme',
    'dark-theme',
    'high-contrast-theme',
    'eye-care-theme'
  );

  // 应用新的主题类名
  switch (mode) {
    case ThemeMode.LIGHT:
      body.classList.add('light-theme');
      break;
    case ThemeMode.DARK:
      body.classList.add('dark-theme');
      break;
    case ThemeMode.HIGH_CONTRAST:
      body.classList.add('high-contrast-theme');
      break;
    case ThemeMode.EYE_CARE:
      body.classList.add('eye-care-theme');
      break;
  }

  // 设置主题模式属性
  root.setAttribute('data-theme', mode);
};

/**
 * 应用主题配置
 */
export const applyThemeConfig = (config: ThemeConfig): void => {
  const root = document.documentElement;

  // 应用动画偏好
  if (config.reducedMotion) {
    root.style.setProperty('--transition-duration', '0s');
    root.style.setProperty('--animation-duration', '0s');
  } else {
    root.style.removeProperty('--transition-duration');
    root.style.removeProperty('--animation-duration');
  }

  // 应用高对比度设置
  if (config.highContrast) {
    root.setAttribute('data-high-contrast', 'true');
  } else {
    root.removeAttribute('data-high-contrast');
  }
};

/**
 * 检测系统主题偏好
 */
export const getSystemThemePreference = (): ThemeMode => {
  if (typeof window === 'undefined') return ThemeMode.LIGHT;

  // 检测深色模式偏好
  if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return ThemeMode.DARK;
  }

  // 检测高对比度偏好
  if (window.matchMedia('(prefers-contrast: high)').matches) {
    return ThemeMode.HIGH_CONTRAST;
  }

  // 检测动画偏好
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return ThemeMode.EYE_CARE;
  }

  return ThemeMode.LIGHT;
};

/**
 * 监听系统主题变化
 */
export const watchSystemTheme = (
  callback: (mode: ThemeMode) => void
): (() => void) => {
  if (typeof window === 'undefined') return () => {};

  const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
  const highContrastQuery = window.matchMedia('(prefers-contrast: high)');
  const reducedMotionQuery = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  );

  const handleChange = () => {
    callback(getSystemThemePreference());
  };

  darkModeQuery.addEventListener('change', handleChange);
  highContrastQuery.addEventListener('change', handleChange);
  reducedMotionQuery.addEventListener('change', handleChange);

  // 返回清理函数
  return () => {
    darkModeQuery.removeEventListener('change', handleChange);
    highContrastQuery.removeEventListener('change', handleChange);
    reducedMotionQuery.removeEventListener('change', handleChange);
  };
};

/**
 * 保存主题配置到本地存储
 */
export const saveThemeConfig = (config: ThemeConfig): void => {
  try {
    localStorage.setItem('theme-config', JSON.stringify(config));
  } catch (error) {
    console.warn('Failed to save theme config to localStorage:', error);
  }
};

/**
 * 从本地存储加载主题配置
 */
export const loadThemeConfig = (): ThemeConfig | null => {
  try {
    const saved = localStorage.getItem('theme-config');
    return saved ? JSON.parse(saved) : null;
  } catch (error) {
    console.warn('Failed to load theme config from localStorage:', error);
    return null;
  }
};

/**
 * 获取CSS变量值
 */
export const getCSSVariable = (variable: string): string => {
  if (typeof window === 'undefined') return '';
  return getComputedStyle(document.documentElement)
    .getPropertyValue(variable)
    .trim();
};

/**
 * 设置CSS变量值
 */
export const setCSSVariable = (variable: string, value: string): void => {
  if (typeof window === 'undefined') return;
  document.documentElement.style.setProperty(variable, value);
};

/**
 * 生成主题CSS字符串
 */
export const generateThemeCSS = (variables: ThemeVariables): string => {
  const cssRules: string[] = [':root {'];

  // 生成颜色变量
  Object.entries(variables.colors).forEach(([key, value]) => {
    const cssVar =
      CSS_VARIABLES.colors[key as keyof typeof CSS_VARIABLES.colors];
    cssRules.push(`  ${cssVar}: ${value};`);
  });

  // 生成间距变量
  Object.entries(variables.spacing).forEach(([key, value]) => {
    const cssVar =
      CSS_VARIABLES.spacing[key as keyof typeof CSS_VARIABLES.spacing];
    cssRules.push(`  ${cssVar}: ${value};`);
  });

  // 生成字体大小变量
  Object.entries(variables.fontSizes).forEach(([key, value]) => {
    const cssVar =
      CSS_VARIABLES.fontSizes[key as keyof typeof CSS_VARIABLES.fontSizes];
    cssRules.push(`  ${cssVar}: ${value};`);
  });

  // 生成圆角变量
  Object.entries(variables.radius).forEach(([key, value]) => {
    const cssVar =
      CSS_VARIABLES.radius[key as keyof typeof CSS_VARIABLES.radius];
    cssRules.push(`  ${cssVar}: ${value};`);
  });

  // 生成阴影变量
  Object.entries(variables.shadows).forEach(([key, value]) => {
    const cssVar =
      CSS_VARIABLES.shadows[key as keyof typeof CSS_VARIABLES.shadows];
    cssRules.push(`  ${cssVar}: ${value};`);
  });

  // 生成断点变量
  Object.entries(variables.breakpoints).forEach(([key, value]) => {
    const cssVar =
      CSS_VARIABLES.breakpoints[key as keyof typeof CSS_VARIABLES.breakpoints];
    cssRules.push(`  ${cssVar}: ${value};`);
  });

  cssRules.push('}');
  return cssRules.join('\n');
};

/**
 * 验证主题配置
 */
export const validateThemeConfig = (config: any): config is ThemeConfig => {
  return (
    config &&
    typeof config === 'object' &&
    Object.values(ThemeMode).includes(config.mode) &&
    (config.reducedMotion === undefined ||
      typeof config.reducedMotion === 'boolean') &&
    (config.highContrast === undefined ||
      typeof config.highContrast === 'boolean')
  );
};

/**
 * 应用完整主题
 */
export const applyTheme = (
  mode: ThemeMode,
  customConfig?: Partial<ThemeConfig>
): void => {
  const config = { mode, ...customConfig };

  // 尝试从缓存获取主题变量
  let completeVariables = themeCache.get(mode, config);

  if (!completeVariables) {
    // 缓存未命中，计算主题变量
    const preset = themePresets.find((p: any) => p.config.mode === mode);
    if (!preset) {
      console.warn(`Theme preset not found for mode: ${mode}`);
      return;
    }

    // 获取默认主题变量作为基础
    const defaultVariables = getDefaultTheme().variables;

    // 合并默认变量和当前预设变量，确保所有属性都存在
    completeVariables = {
      colors: preset.variables.colors || defaultVariables.colors!,
      spacing: preset.variables.spacing || defaultVariables.spacing!,
      fontSizes: preset.variables.fontSizes || defaultVariables.fontSizes!,
      radius: preset.variables.radius || defaultVariables.radius!,
      shadows: preset.variables.shadows || defaultVariables.shadows!,
      breakpoints:
        preset.variables.breakpoints || defaultVariables.breakpoints!,
    };

    // 缓存计算结果
    themeCache.set(mode, config, completeVariables);
  }

  // 应用主题变量
  applyThemeVariables(completeVariables);

  // 应用主题模式
  applyThemeMode(mode);

  // 应用主题配置
  applyThemeConfig(config);

  // 保存配置
  saveThemeConfig(config);
};
