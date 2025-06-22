// 主题系统类型定义
export interface ThemeColors {
  // 主色调
  primary: string;
  primaryLight: string;
  primaryDark: string;

  // 辅助色
  secondary: string;
  secondaryLight: string;
  secondaryDark: string;

  // 状态色
  success: string;
  warning: string;
  error: string;
  info: string;

  // 文本颜色
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  textLight: string;

  // 背景色
  bgPrimary: string;
  bgSecondary: string;
  bgGlass: string;
  bgGlassHover: string;
  
  // 下拉框背景色
  dropdownBg: string;
  dropdownBorder: string;
  dropdownShadow: string;

  // 边框色
  borderPrimary: string;
  borderSecondary: string;
  borderMuted: string;
  borderColor: string;
}

export interface ThemeSpacing {
  xs: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  '2xl': string;
  '3xl': string;
  '4xl': string;
  '5xl': string;
  '6xl': string;
}

export interface ThemeFontSizes {
  xs: string;
  sm: string;
  base: string;
  lg: string;
  xl: string;
  '2xl': string;
  '3xl': string;
  '4xl': string;
  '5xl': string;
}

export interface ThemeRadius {
  sm: string;
  md: string;
  lg: string;
  xl: string;
  '2xl': string;
  '3xl': string;
  full: string;
}

export interface ThemeShadows {
  sm: string;
  md: string;
  lg: string;
  xl: string;
  primary: string;
  secondary: string;
}

export interface ThemeBreakpoints {
  sm: string;
  md: string;
  lg: string;
  xl: string;
  '2xl': string;
}

export interface ThemeVariables {
  colors: ThemeColors;
  spacing: ThemeSpacing;
  fontSizes: ThemeFontSizes;
  radius: ThemeRadius;
  shadows: ThemeShadows;
  breakpoints: ThemeBreakpoints;
}

// 主题模式枚举
export enum ThemeMode {
  LIGHT = 'light',
  DARK = 'dark',
  AUTO = 'auto',
  HIGH_CONTRAST = 'high-contrast',
  EYE_CARE = 'eye-care',
}

// 主题配置接口
export interface ThemeConfig {
  mode: ThemeMode;
  customColors?: Partial<ThemeColors>;
  reducedMotion?: boolean;
  highContrast?: boolean;
}

// 主题上下文类型
export interface ThemeContextType {
  mode: ThemeMode;
  config: ThemeConfig;
  variables: ThemeVariables;
  setMode: (mode: ThemeMode) => void;
  updateConfig: (config: Partial<ThemeConfig>) => void;
  toggleTheme: () => void;
}

// CSS变量映射类型
export type CSSVariableMap = {
  [K in keyof ThemeVariables]: {
    [P in keyof ThemeVariables[K]]: `--${string}`;
  };
};

// 主题预设类型
export interface ThemePreset {
  name: string;
  displayName: string;
  description: string;
  config: ThemeConfig;
  variables: Partial<ThemeVariables>;
}

// 导出默认主题变量映射
export const CSS_VARIABLES: CSSVariableMap = {
  colors: {
    primary: '--primary-color',
    primaryLight: '--primary-light',
    primaryDark: '--primary-dark',
    secondary: '--secondary-color',
    secondaryLight: '--secondary-light',
    secondaryDark: '--secondary-dark',
    success: '--success-color',
    warning: '--warning-color',
    error: '--error-color',
    info: '--info-color',
    textPrimary: '--text-primary',
    textSecondary: '--text-secondary',
    textMuted: '--text-muted',
    textLight: '--text-light',
    bgPrimary: '--bg-primary',
    bgSecondary: '--bg-secondary',
    bgGlass: '--bg-glass',
    bgGlassHover: '--bg-glass-hover',
    borderPrimary: '--border-primary',
    borderSecondary: '--border-secondary',
    borderMuted: '--border-muted',
    borderColor: '--border-color',
    dropdownBg: '--dropdown-bg',
    dropdownBorder: '--dropdown-border',
    dropdownShadow: '--dropdown-shadow',
  },
  spacing: {
    xs: '--spacing-xs',
    sm: '--spacing-sm',
    md: '--spacing-md',
    lg: '--spacing-lg',
    xl: '--spacing-xl',
    '2xl': '--spacing-2xl',
    '3xl': '--spacing-3xl',
    '4xl': '--spacing-4xl',
    '5xl': '--spacing-5xl',
    '6xl': '--spacing-6xl',
  },
  fontSizes: {
    xs: '--font-size-xs',
    sm: '--font-size-sm',
    base: '--font-size-base',
    lg: '--font-size-lg',
    xl: '--font-size-xl',
    '2xl': '--font-size-2xl',
    '3xl': '--font-size-3xl',
    '4xl': '--font-size-4xl',
    '5xl': '--font-size-5xl',
  },
  radius: {
    sm: '--radius-sm',
    md: '--radius-md',
    lg: '--radius-lg',
    xl: '--radius-xl',
    '2xl': '--radius-2xl',
    '3xl': '--radius-3xl',
    full: '--radius-full',
  },
  shadows: {
    sm: '--shadow-sm',
    md: '--shadow-md',
    lg: '--shadow-lg',
    xl: '--shadow-xl',
    primary: '--shadow-primary',
    secondary: '--shadow-secondary',
  },
  breakpoints: {
    sm: '--breakpoint-sm',
    md: '--breakpoint-md',
    lg: '--breakpoint-lg',
    xl: '--breakpoint-xl',
    '2xl': '--breakpoint-2xl',
  },
};
