import { useCallback, useMemo } from 'react';
import { useTheme } from './ThemeContext';
import { ThemeMode } from './types';
import { themePresets } from './themes';

/**
 * 自定义 Hook：主题切换逻辑
 * 封装主题切换相关的状态和方法，提高代码复用性
 */
export const useThemeToggle = () => {
  const { mode, setMode, config, updateConfig } = useTheme();

  // 缓存主题图标映射
  const themeIcons = useMemo(
    () => ({
      [ThemeMode.LIGHT]: '☀️',
      [ThemeMode.DARK]: '🌙',
      [ThemeMode.HIGH_CONTRAST]: '⚫',
      [ThemeMode.EYE_CARE]: '👁️',
      [ThemeMode.AUTO]: '🔄',
    }),
    []
  );

  // 获取主题图标
  const getThemeIcon = useCallback(
    (themeMode: ThemeMode): string => {
      return themeIcons[themeMode] || '🎨';
    },
    [themeIcons]
  );

  // 获取主题标签
  const getThemeLabel = useCallback((themeMode: ThemeMode): string => {
    const preset = themePresets.find(p => p.config.mode === themeMode);
    return preset?.displayName || themeMode;
  }, []);

  // 切换到下一个主题（用于按钮模式）
  const toggleToNextTheme = useCallback(() => {
    const modes = [ThemeMode.LIGHT, ThemeMode.DARK, ThemeMode.EYE_CARE];
    const currentIndex = modes.indexOf(mode);
    const nextIndex = (currentIndex + 1) % modes.length;
    const nextMode = modes[nextIndex];
    if (nextMode) {
      setMode(nextMode);
    }
  }, [mode, setMode]);

  // 切换到指定主题
  const switchToTheme = useCallback(
    (newMode: ThemeMode) => {
      setMode(newMode);
    },
    [setMode]
  );

  // 更新减少动画设置
  const toggleReducedMotion = useCallback(
    (enabled: boolean) => {
      updateConfig({ reducedMotion: enabled });
    },
    [updateConfig]
  );

  // 更新高对比度设置
  const toggleHighContrast = useCallback(
    (enabled: boolean) => {
      updateConfig({ highContrast: enabled });
    },
    [updateConfig]
  );

  // 获取当前主题信息
  const currentThemeInfo = useMemo(() => {
    const preset = themePresets.find(p => p.config.mode === mode);
    return {
      mode,
      icon: getThemeIcon(mode),
      label: getThemeLabel(mode),
      description: preset?.description || '',
      preset,
    };
  }, [mode, getThemeIcon, getThemeLabel]);

  // 获取可用主题列表
  const availableThemes = useMemo(() => {
    return themePresets.map(preset => ({
      mode: preset.config.mode as ThemeMode,
      icon: getThemeIcon(preset.config.mode),
      label: preset.displayName,
      description: preset.description,
      isActive: mode === preset.config.mode,
    }));
  }, [mode, getThemeIcon]);

  return {
    // 当前状态
    currentMode: mode,
    config,
    currentThemeInfo,
    availableThemes,

    // 工具函数
    getThemeIcon,
    getThemeLabel,

    // 操作方法
    toggleToNextTheme,
    switchToTheme,
    toggleReducedMotion,
    toggleHighContrast,
  };
};

export default useThemeToggle;
