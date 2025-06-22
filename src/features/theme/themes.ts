import { ThemeVariables, ThemePreset, ThemeMode } from './types';

// 基础主题变量
const baseVariables: ThemeVariables = {
  colors: {
    primary: '#3b82f6',
    primaryLight: '#60a5fa',
    primaryDark: '#1d4ed8',
    secondary: '#6366f1',
    secondaryLight: '#818cf8',
    secondaryDark: '#4338ca',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#06b6d4',
    textPrimary: '#1f2937',
    textSecondary: '#6b7280',
    textMuted: '#9ca3af',
    textLight: '#f9fafb',
    bgPrimary: '#ffffff',
    bgSecondary: '#f9fafb',
    bgGlass: 'rgba(255, 255, 255, 0.8)',
    bgGlassHover: 'rgba(255, 255, 255, 0.9)',
    dropdownBg: 'rgba(255, 255, 255, 0.95)',
    dropdownBorder: 'rgba(229, 231, 235, 0.6)',
    dropdownShadow: 'rgba(0, 0, 0, 0.1)',
    borderPrimary: '#e5e7eb',
    borderSecondary: '#d1d5db',
    borderMuted: '#f3f4f6',
    borderColor: '#e2e8f0',
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '2.5rem',
    '3xl': '3rem',
    '4xl': '4rem',
    '5xl': '5rem',
    '6xl': '6rem',
  },
  fontSizes: {
    xs: '0.75rem',
    sm: '0.875rem',
    base: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '1.875rem',
    '4xl': '2.25rem',
    '5xl': '3rem',
  },
  radius: {
    sm: '0.25rem',
    md: '0.375rem',
    lg: '0.5rem',
    xl: '0.75rem',
    '2xl': '1rem',
    '3xl': '1.5rem',
    full: '9999px',
  },
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    primary: '0 4px 14px 0 rgba(59, 130, 246, 0.25)',
    secondary: '0 4px 14px 0 rgba(99, 102, 241, 0.25)',
  },
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },
};

// 主题预设配置
export const themePresets: ThemePreset[] = [
  {
    name: 'light',
    displayName: 'Light Mode',
    description: '经典的明亮主题，适合日间使用',
    config: {
      mode: ThemeMode.LIGHT,
      reducedMotion: false,
      highContrast: false,
    },
    variables: baseVariables,
  },
  {
    name: 'dark',
    displayName: 'Dark Mode',
    description: '护眼的深色主题，适合夜间使用',
    config: {
      mode: ThemeMode.DARK,
      reducedMotion: false,
      highContrast: false,
    },
    variables: {
      ...baseVariables,
      colors: {
        ...baseVariables.colors,
        primary: '#60a5fa',
        primaryLight: '#93c5fd',
        primaryDark: '#3b82f6',
        textPrimary: '#f9fafb',
        textSecondary: '#d1d5db',
        textMuted: '#9ca3af',
        textLight: '#1f2937',
        bgPrimary: '#111827',
        bgSecondary: '#1f2937',
        bgGlass: 'rgba(17, 24, 39, 0.8)',
        bgGlassHover: 'rgba(17, 24, 39, 0.9)',
        dropdownBg: 'rgba(30, 41, 59, 0.95)',
        dropdownBorder: 'rgba(75, 85, 99, 0.6)',
        dropdownShadow: 'rgba(0, 0, 0, 0.4)',
        borderPrimary: '#374151',
        borderSecondary: '#4b5563',
        borderMuted: '#1f2937',
        borderColor: '#374151',
      },
    },
  },
  {
    name: 'high-contrast',
    displayName: 'High Contrast',
    description: '高对比度主题，提升可访问性',
    config: {
      mode: ThemeMode.HIGH_CONTRAST,
      reducedMotion: false,
      highContrast: true,
    },
    variables: {
      ...baseVariables,
      colors: {
        ...baseVariables.colors,
        primary: '#000000',
        primaryLight: '#333333',
        primaryDark: '#000000',
        textPrimary: '#000000',
        textSecondary: '#333333',
        textMuted: '#666666',
        bgPrimary: '#ffffff',
        bgSecondary: '#f5f5f5',
        dropdownBg: 'rgba(255, 255, 255, 0.98)',
        dropdownBorder: 'rgba(0, 0, 0, 0.8)',
        dropdownShadow: 'rgba(0, 0, 0, 0.3)',
        borderPrimary: '#000000',
        borderSecondary: '#333333',
        borderColor: '#000000',
      },
      shadows: {
        ...baseVariables.shadows,
        sm: '0 2px 4px 0 rgba(0, 0, 0, 0.3)',
        md: '0 4px 8px 0 rgba(0, 0, 0, 0.3)',
        lg: '0 8px 16px 0 rgba(0, 0, 0, 0.3)',
        xl: '0 16px 32px 0 rgba(0, 0, 0, 0.3)',
      },
    },
  },
  {
    name: 'eye-care',
    displayName: 'Eye Care',
    description: '温和的护眼主题，减少蓝光刺激',
    config: {
      mode: ThemeMode.EYE_CARE,
      reducedMotion: true,
      highContrast: false,
    },
    variables: {
      ...baseVariables,
      colors: {
        ...baseVariables.colors,
        primary: '#8b5a3c',
        primaryLight: '#a67c5a',
        primaryDark: '#6d4428',
        bgPrimary: '#faf8f5',
        bgSecondary: '#f5f2ed',
        bgGlass: 'rgba(250, 248, 245, 0.8)',
        bgGlassHover: 'rgba(250, 248, 245, 0.9)',
        dropdownBg: 'rgba(250, 248, 245, 0.95)',
        dropdownBorder: 'rgba(232, 221, 212, 0.8)',
        dropdownShadow: 'rgba(139, 90, 60, 0.15)',
        textPrimary: '#3c2e26',
        textSecondary: '#5c4a3d',
        borderPrimary: '#e8ddd4',
        borderSecondary: '#ddd2c7',
        borderMuted: '#f0e7dc',
        borderColor: '#e8ddd4',
      },
    },
  },
];

// 验证主题变量完整性
const validateThemeVariables = (variables: Partial<ThemeVariables>): ThemeVariables => {
  return {
    colors: { ...baseVariables.colors, ...variables.colors },
    spacing: { ...baseVariables.spacing, ...variables.spacing },
    fontSizes: { ...baseVariables.fontSizes, ...variables.fontSizes },
    radius: { ...baseVariables.radius, ...variables.radius },
    shadows: { ...baseVariables.shadows, ...variables.shadows },
    breakpoints: { ...baseVariables.breakpoints, ...variables.breakpoints },
  };
};

// 获取主题预设
export const getThemePreset = (name: string): ThemePreset | undefined => {
  const preset = themePresets.find(preset => preset.name === name);
  if (preset) {
    return {
      ...preset,
      variables: validateThemeVariables(preset.variables),
    };
  }
  return undefined;
};

// 获取默认主题
export const getDefaultTheme = (): ThemePreset => {
  const defaultTheme = themePresets.find(preset => preset.name === 'light');
  if (!defaultTheme) {
    throw new Error('Default theme not found');
  }
  return defaultTheme;
};

// 主题切换顺序
export const themeOrder = [ThemeMode.LIGHT, ThemeMode.DARK, ThemeMode.EYE_CARE];

// 获取所有可用主题名称
export const getAvailableThemes = (): string[] => {
  return themePresets.map(preset => preset.name);
};

// 获取下一个主题
export const getNextTheme = (currentMode: ThemeMode): ThemeMode => {
  const currentIndex = themeOrder.indexOf(currentMode);
  if (currentIndex === -1) {
    // 如果当前模式不在切换顺序中，返回第一个主题
    return themeOrder[0] || ThemeMode.LIGHT;
  }
  const nextIndex = (currentIndex + 1) % themeOrder.length;
  return themeOrder[nextIndex] || ThemeMode.LIGHT;
};

// 获取上一个主题
export const getPreviousTheme = (currentMode: ThemeMode): ThemeMode => {
  const currentIndex = themeOrder.indexOf(currentMode);
  if (currentIndex === -1) {
    // 如果当前模式不在切换顺序中，返回最后一个主题
    return themeOrder[themeOrder.length - 1] || ThemeMode.EYE_CARE;
  }
  const previousIndex = currentIndex === 0 ? themeOrder.length - 1 : currentIndex - 1;
  return themeOrder[previousIndex] || ThemeMode.LIGHT;
};
