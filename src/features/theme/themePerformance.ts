/**
 * 主题性能监控工具
 * 用于监测主题切换的性能指标和优化建议
 */

interface PerformanceMetrics {
  themeChangeTime: number;
  cssVariableUpdateTime: number;
  rerenderCount: number;
  memoryUsage?: number | undefined;
}

interface PerformanceEntry {
  timestamp: number;
  fromTheme: string;
  toTheme: string;
  metrics: PerformanceMetrics;
}

class ThemePerformanceMonitor {
  private entries: PerformanceEntry[] = [];
  private maxEntries = 100;
  private isEnabled = process.env.NODE_ENV === 'development';

  /**
   * 开始监控主题切换性能
   */
  startThemeChange(_fromTheme: string, _toTheme: string): string {
    if (!this.isEnabled) return '';

    const sessionId = `theme-change-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;

    // 标记开始时间
    performance.mark(`${sessionId}-start`);

    return sessionId;
  }

  /**
   * 结束监控并记录性能指标
   */
  endThemeChange(
    sessionId: string,
    fromTheme: string,
    toTheme: string,
    additionalMetrics: Partial<PerformanceMetrics> = {}
  ): PerformanceMetrics | null {
    if (!this.isEnabled || !sessionId) return null;

    try {
      // 标记结束时间
      performance.mark(`${sessionId}-end`);

      // 测量总时间
      performance.measure(
        `${sessionId}-duration`,
        `${sessionId}-start`,
        `${sessionId}-end`
      );

      const measure = performance.getEntriesByName(`${sessionId}-duration`)[0];
      const themeChangeTime = measure?.duration || 0;

      // 获取内存使用情况（如果支持）
      const memoryUsage = this.getMemoryUsage();

      const metrics: PerformanceMetrics = {
        themeChangeTime,
        cssVariableUpdateTime: additionalMetrics.cssVariableUpdateTime || 0,
        rerenderCount: additionalMetrics.rerenderCount || 0,
        memoryUsage,
        ...additionalMetrics,
      };

      // 记录性能条目
      this.addEntry({
        timestamp: Date.now(),
        fromTheme,
        toTheme,
        metrics,
      });

      // 清理性能标记
      this.cleanupMarks(sessionId);

      return metrics;
    } catch (error) {
      console.warn('主题性能监控失败:', error);
      return null;
    }
  }

  /**
   * 监控 CSS 变量更新性能
   */
  measureCSSVariableUpdate<T>(fn: () => T): { result: T; duration: number } {
    if (!this.isEnabled) {
      return { result: fn(), duration: 0 };
    }

    const startTime = performance.now();
    const result = fn();
    const duration = performance.now() - startTime;

    return { result, duration };
  }

  /**
   * 获取性能统计信息
   */
  getPerformanceStats() {
    if (!this.isEnabled || this.entries.length === 0) {
      return null;
    }

    const recentEntries = this.entries.slice(-20); // 最近20次切换
    const totalChanges = recentEntries.length;

    const avgThemeChangeTime =
      recentEntries.reduce(
        (sum, entry) => sum + entry.metrics.themeChangeTime,
        0
      ) / totalChanges;

    const avgCSSUpdateTime =
      recentEntries.reduce(
        (sum, entry) => sum + entry.metrics.cssVariableUpdateTime,
        0
      ) / totalChanges;

    const avgRerenderCount =
      recentEntries.reduce(
        (sum, entry) => sum + entry.metrics.rerenderCount,
        0
      ) / totalChanges;

    const slowestChange = recentEntries.reduce((max, entry) =>
      entry.metrics.themeChangeTime > max.metrics.themeChangeTime ? entry : max
    );

    const fastestChange = recentEntries.reduce((min, entry) =>
      entry.metrics.themeChangeTime < min.metrics.themeChangeTime ? entry : min
    );

    return {
      totalChanges,
      avgThemeChangeTime: Math.round(avgThemeChangeTime * 100) / 100,
      avgCSSUpdateTime: Math.round(avgCSSUpdateTime * 100) / 100,
      avgRerenderCount: Math.round(avgRerenderCount * 100) / 100,
      slowestChange: {
        time: Math.round(slowestChange.metrics.themeChangeTime * 100) / 100,
        transition: `${slowestChange.fromTheme} → ${slowestChange.toTheme}`,
      },
      fastestChange: {
        time: Math.round(fastestChange.metrics.themeChangeTime * 100) / 100,
        transition: `${fastestChange.fromTheme} → ${fastestChange.toTheme}`,
      },
    };
  }

  /**
   * 获取性能优化建议
   */
  getOptimizationSuggestions() {
    const stats = this.getPerformanceStats();
    if (!stats) return [];

    const suggestions: string[] = [];

    if (stats.avgThemeChangeTime > 100) {
      suggestions.push('主题切换时间较长，考虑优化 CSS 变量更新逻辑');
    }

    if (stats.avgCSSUpdateTime > 50) {
      suggestions.push(
        'CSS 变量更新耗时较长，考虑批量更新或使用 CSS 自定义属性'
      );
    }

    if (stats.avgRerenderCount > 5) {
      suggestions.push(
        '重渲染次数较多，考虑使用 React.memo 或 useMemo 优化组件'
      );
    }

    if (stats.slowestChange.time > 200) {
      suggestions.push(
        `最慢的主题切换 (${stats.slowestChange.transition}) 耗时 ${stats.slowestChange.time}ms，需要优化`
      );
    }

    return suggestions;
  }

  /**
   * 输出性能报告到控制台
   */
  logPerformanceReport() {
    if (!this.isEnabled) return;

    const stats = this.getPerformanceStats();
    const suggestions = this.getOptimizationSuggestions();

    if (!stats) {
      if (process.env.NODE_ENV === 'development') {
        console.log('📊 主题性能监控: 暂无数据');
      }
      return;
    }

    if (process.env.NODE_ENV === 'development') {
      console.log(`📊 主题性能监控报告:`);
      console.log(`总切换次数: ${stats.totalChanges}`);
      console.log(`平均切换时间: ${stats.avgThemeChangeTime}ms`);
      console.log(`平均CSS更新时间: ${stats.avgCSSUpdateTime}ms`);
      console.log(`平均重渲染次数: ${stats.avgRerenderCount}`);
      console.log(
        `最快切换: ${stats.fastestChange.time}ms (${stats.fastestChange.transition})`
      );
      console.log(
        `最慢切换: ${stats.slowestChange.time}ms (${stats.slowestChange.transition})`
      );

      if (suggestions.length > 0) {
        console.log('\n💡 性能优化建议:');
        suggestions.forEach(suggestion => console.log(`• ${suggestion}`));
      }
    }
  }

  /**
   * 清理旧的性能条目
   */
  private addEntry(entry: PerformanceEntry) {
    this.entries.push(entry);

    // 保持条目数量在限制内
    if (this.entries.length > this.maxEntries) {
      this.entries = this.entries.slice(-this.maxEntries);
    }
  }

  /**
   * 获取内存使用情况
   */
  private getMemoryUsage(): number | undefined {
    if ('memory' in performance) {
      const memory = (performance as { memory?: { usedJSHeapSize?: number } })
        .memory;
      return memory?.usedJSHeapSize;
    }
    return undefined;
  }

  /**
   * 清理性能标记
   */
  private cleanupMarks(sessionId: string) {
    try {
      performance.clearMarks(`${sessionId}-start`);
      performance.clearMarks(`${sessionId}-end`);
      performance.clearMeasures(`${sessionId}-duration`);
    } catch (error) {
      // 忽略清理错误
    }
  }

  /**
   * 启用/禁用性能监控
   */
  setEnabled(enabled: boolean) {
    this.isEnabled = enabled;
  }

  /**
   * 清除所有性能数据
   */
  clear() {
    this.entries = [];
  }
}

// 创建全局实例
export const themePerformanceMonitor = new ThemePerformanceMonitor();

// 开发环境下的便捷方法
if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
  // 添加到全局对象以便在控制台中使用
  (window as any).__themePerformance = {
    getStats: () => themePerformanceMonitor.getPerformanceStats(),
    getSuggestions: () => themePerformanceMonitor.getOptimizationSuggestions(),
    logReport: () => themePerformanceMonitor.logPerformanceReport(),
    clear: () => themePerformanceMonitor.clear(),
  };

  console.log('🔧 主题性能监控已启用，使用 __themePerformance 查看性能数据');
}

export default themePerformanceMonitor;
