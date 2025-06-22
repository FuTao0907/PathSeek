import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react';
import {
  ThemeContextType,
  ThemeMode,
  ThemeConfig,
  ThemeVariables,
} from './types';
import { getDefaultTheme, getNextTheme, themePresets } from './themes';
import { applyTheme } from './theme';
import { themeCache } from './themeCache';
import { themePerformanceMonitor } from './themePerformance';
import {
  getSystemThemePreference,
  watchSystemTheme,
  loadThemeConfig,
  validateThemeConfig,
} from './theme';

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // 初始化主题配置
  const [config, setConfig] = useState<ThemeConfig>(() => {
    // 尝试从localStorage加载配置
    const savedConfig = loadThemeConfig();
    if (savedConfig && validateThemeConfig(savedConfig)) {
      return savedConfig;
    }

    // 如果没有保存的配置，使用系统偏好或默认主题
    const systemPreference = getSystemThemePreference();
    const defaultTheme = getDefaultTheme();

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { mode: _, ...configWithoutMode } = defaultTheme.config;
    return {
      mode: systemPreference,
      reducedMotion: false,
      highContrast: false,
      ...configWithoutMode,
    };
  });

  // 获取当前主题变量
  const getCurrentVariables = useCallback((): ThemeVariables => {
    const preset = themePresets.find(p => p.config.mode === config.mode);
    const defaultVariables = getDefaultTheme().variables;

    if (!preset?.variables) {
      // 如果没有找到预设或变量，返回默认主题的完整变量
      return defaultVariables as ThemeVariables;
    }

    // 合并默认变量和当前预设变量，确保返回完整的 ThemeVariables
    return {
      colors: preset.variables.colors ?? defaultVariables.colors,
      spacing: preset.variables.spacing ?? defaultVariables.spacing,
      fontSizes: preset.variables.fontSizes ?? defaultVariables.fontSizes,
      radius: preset.variables.radius ?? defaultVariables.radius,
      shadows: preset.variables.shadows ?? defaultVariables.shadows,
      breakpoints: preset.variables.breakpoints ?? defaultVariables.breakpoints,
    } as ThemeVariables;
  }, [config.mode]);

  // 设置主题模式
  const setMode = useCallback(
    (mode: ThemeMode) => {
      // 开始性能监控
      const sessionId = themePerformanceMonitor.startThemeChange(
        config.mode,
        mode
      );

      const newConfig = { ...config, mode };
      setConfig(newConfig);
      applyTheme(mode, newConfig);

      // 结束性能监控
      setTimeout(() => {
        themePerformanceMonitor.endThemeChange(sessionId, config.mode, mode);
      }, 0);
    },
    [config]
  );

  // 更新配置
  const updateConfig = useCallback(
    (newConfig: Partial<ThemeConfig>) => {
      const oldConfig = config;
      const updatedConfig = { ...config, ...newConfig };

      // 如果主题模式发生变化，监控性能
      if (newConfig.mode && newConfig.mode !== oldConfig.mode) {
        const sessionId = themePerformanceMonitor.startThemeChange(
          oldConfig.mode,
          newConfig.mode
        );

        setConfig(updatedConfig);
        applyTheme(updatedConfig.mode, updatedConfig);

        setTimeout(() => {
          themePerformanceMonitor.endThemeChange(
            sessionId,
            oldConfig.mode ?? ThemeMode.LIGHT,
            newConfig.mode ?? ThemeMode.LIGHT
          );
        }, 0);
      } else {
        setConfig(updatedConfig);
        applyTheme(updatedConfig.mode, updatedConfig);
      }
    },
    [config]
  );

  // 切换主题（循环切换）
  const toggleTheme = useCallback(() => {
    const nextMode = getNextTheme(config.mode);
    setMode(nextMode);
  }, [config.mode, setMode]);

  // 初始化主题应用和缓存
  useEffect(() => {
    // 预加载常用主题到缓存
    themeCache.preloadCommonThemes();

    // 启动定期清理任务
    const stopCleanup = themeCache.startPeriodicCleanup();

    // 应用当前主题
    applyTheme(config.mode, config);

    // 清理函数
    return () => {
      stopCleanup();
    };
  }, [config]);

  // 监听系统主题变化（仅在AUTO模式下）
  useEffect(() => {
    if (config.mode !== ThemeMode.AUTO) return;

    const cleanup = watchSystemTheme(systemMode => {
      if (systemMode !== config.mode) {
        setMode(systemMode);
      }
    });

    return cleanup;
  }, [config.mode, setMode]);

  // 监听用户偏好变化
  useEffect(() => {
    const handleReducedMotion = (e: MediaQueryListEvent) => {
      updateConfig({ reducedMotion: e.matches });
    };

    const handleHighContrast = (e: MediaQueryListEvent) => {
      updateConfig({ highContrast: e.matches });
    };

    const reducedMotionQuery = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    );
    const highContrastQuery = window.matchMedia('(prefers-contrast: high)');

    reducedMotionQuery.addEventListener('change', handleReducedMotion);
    highContrastQuery.addEventListener('change', handleHighContrast);

    return () => {
      reducedMotionQuery.removeEventListener('change', handleReducedMotion);
      highContrastQuery.removeEventListener('change', handleHighContrast);
    };
  }, [updateConfig]);

  return (
    <ThemeContext.Provider
      value={{
        mode: config.mode,
        config,
        variables: getCurrentVariables(),
        setMode,
        updateConfig,
        toggleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};
