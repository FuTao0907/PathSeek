/**
 * 性能监控工具
 * 用于追踪和分析应用性能指标
 */

export interface PerformanceMetrics {
  // Core Web Vitals
  fcp?: number; // First Contentful Paint
  lcp?: number; // Largest Contentful Paint
  fid?: number; // First Input Delay
  cls?: number; // Cumulative Layout Shift
  ttfb?: number; // Time to First Byte

  // 自定义指标
  componentRenderTime?: number;
  themeChangeTime?: number;
  routeChangeTime?: number;
  apiResponseTime?: number;
}

export interface PerformanceEntry {
  name: string;
  startTime: number;
  duration: number;
  metrics: PerformanceMetrics;
  timestamp: number;
  userAgent: string;
  url: string;
}

class PerformanceMonitor {
  private entries: PerformanceEntry[] = [];
  private observers: PerformanceObserver[] = [];
  private isEnabled = true;

  constructor() {
    this.initializeObservers();
  }

  /**
   * 初始化性能观察器
   */
  private initializeObservers(): void {
    if (typeof window === 'undefined' || !('PerformanceObserver' in window)) {
      this.isEnabled = false;
      return;
    }

    try {
      // 观察导航和资源加载
      const navigationObserver = new PerformanceObserver(list => {
        for (const entry of list.getEntries()) {
          this.recordEntry('navigation', entry.startTime, entry.duration, {
            ttfb:
              (entry as PerformanceNavigationTiming).responseStart -
              entry.startTime,
          });
        }
      });
      navigationObserver.observe({ entryTypes: ['navigation'] });
      this.observers.push(navigationObserver);

      // 观察 Largest Contentful Paint
      const lcpObserver = new PerformanceObserver(list => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        if (lastEntry) {
          this.recordEntry('lcp', lastEntry.startTime, 0, {
            lcp: lastEntry.startTime,
          });
        }
      });
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
      this.observers.push(lcpObserver);

      // 观察 First Input Delay
      const fidObserver = new PerformanceObserver(list => {
        for (const entry of list.getEntries()) {
          const fidEntry = entry as PerformanceEventTiming;
          this.recordEntry(
            'fid',
            entry.startTime,
            fidEntry.processingStart - entry.startTime,
            {
              fid: fidEntry.processingStart - entry.startTime,
            }
          );
        }
      });
      fidObserver.observe({ entryTypes: ['first-input'] });
      this.observers.push(fidObserver);

      // 观察 Cumulative Layout Shift
      const clsObserver = new PerformanceObserver(list => {
        let clsValue = 0;
        for (const entry of list.getEntries()) {
          const clsEntry = entry as any; // LayoutShift interface
          if (!clsEntry.hadRecentInput) {
            clsValue += clsEntry.value;
          }
        }
        this.recordEntry('cls', performance.now(), 0, {
          cls: clsValue,
        });
      });
      clsObserver.observe({ entryTypes: ['layout-shift'] });
      this.observers.push(clsObserver);
    } catch (error) {
      console.warn('Performance monitoring initialization failed:', error);
      this.isEnabled = false;
    }
  }

  /**
   * 记录性能条目
   */
  private recordEntry(
    name: string,
    startTime: number,
    duration: number,
    metrics: PerformanceMetrics
  ): void {
    if (!this.isEnabled) return;

    const entry: PerformanceEntry = {
      name,
      startTime,
      duration,
      metrics,
      timestamp: Date.now(),
      userAgent: navigator.userAgent,
      url: window.location.href,
    };

    this.entries.push(entry);

    // 限制条目数量，避免内存泄漏
    if (this.entries.length > 1000) {
      this.entries = this.entries.slice(-500);
    }
  }

  /**
   * 测量组件渲染时间
   */
  measureComponentRender<T>(componentName: string, renderFn: () => T): T {
    if (!this.isEnabled) return renderFn();

    const startTime = performance.now();
    const result = renderFn();
    const duration = performance.now() - startTime;

    this.recordEntry(`component-render-${componentName}`, startTime, duration, {
      componentRenderTime: duration,
    });

    return result;
  }

  /**
   * 测量异步操作时间
   */
  async measureAsync<T>(
    operationName: string,
    asyncFn: () => Promise<T>
  ): Promise<T> {
    if (!this.isEnabled) return asyncFn();

    const startTime = performance.now();
    try {
      const result = await asyncFn();
      const duration = performance.now() - startTime;

      this.recordEntry(`async-${operationName}`, startTime, duration, {
        apiResponseTime: duration,
      });

      return result;
    } catch (error) {
      const duration = performance.now() - startTime;
      this.recordEntry(`async-${operationName}-error`, startTime, duration, {
        apiResponseTime: duration,
      });
      throw error;
    }
  }

  /**
   * 测量主题切换时间
   */
  measureThemeChange(themeName: string, changeFn: () => void): void {
    if (!this.isEnabled) {
      changeFn();
      return;
    }

    const startTime = performance.now();
    changeFn();

    // 使用 requestAnimationFrame 确保 DOM 更新完成
    requestAnimationFrame(() => {
      const duration = performance.now() - startTime;
      this.recordEntry(`theme-change-${themeName}`, startTime, duration, {
        themeChangeTime: duration,
      });
    });
  }

  /**
   * 获取性能统计
   */
  getStats(): {
    totalEntries: number;
    averageRenderTime: number;
    averageThemeChangeTime: number;
    averageApiResponseTime: number;
    webVitals: {
      fcp?: number;
      lcp?: number;
      fid?: number;
      cls?: number;
      ttfb?: number;
    };
  } {
    const renderEntries = this.entries.filter(e =>
      e.name.includes('component-render')
    );
    const themeEntries = this.entries.filter(e =>
      e.name.includes('theme-change')
    );
    const apiEntries = this.entries.filter(e => e.name.includes('async'));

    const averageRenderTime =
      renderEntries.length > 0
        ? renderEntries.reduce((sum, e) => sum + e.duration, 0) /
          renderEntries.length
        : 0;

    const averageThemeChangeTime =
      themeEntries.length > 0
        ? themeEntries.reduce((sum, e) => sum + e.duration, 0) /
          themeEntries.length
        : 0;

    const averageApiResponseTime =
      apiEntries.length > 0
        ? apiEntries.reduce((sum, e) => sum + e.duration, 0) / apiEntries.length
        : 0;

    // 获取最新的 Web Vitals 数据
    const latestMetrics = this.entries.reduce((acc, entry) => {
      if (entry.metrics.fcp !== undefined) acc.fcp = entry.metrics.fcp;
      if (entry.metrics.lcp !== undefined) acc.lcp = entry.metrics.lcp;
      if (entry.metrics.fid !== undefined) acc.fid = entry.metrics.fid;
      if (entry.metrics.cls !== undefined) acc.cls = entry.metrics.cls;
      if (entry.metrics.ttfb !== undefined) acc.ttfb = entry.metrics.ttfb;
      return acc;
    }, {} as PerformanceMetrics);

    return {
      totalEntries: this.entries.length,
      averageRenderTime,
      averageThemeChangeTime,
      averageApiResponseTime,
      webVitals: latestMetrics,
    };
  }

  /**
   * 获取详细的性能条目
   */
  getEntries(filter?: string): PerformanceEntry[] {
    if (!filter) return [...this.entries];
    return this.entries.filter(entry => entry.name.includes(filter));
  }

  /**
   * 清除性能数据
   */
  clear(): void {
    this.entries = [];
  }

  /**
   * 销毁监控器
   */
  destroy(): void {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
    this.entries = [];
    this.isEnabled = false;
  }

  /**
   * 导出性能数据
   */
  exportData(): string {
    return JSON.stringify(
      {
        timestamp: Date.now(),
        stats: this.getStats(),
        entries: this.entries,
      },
      null,
      2
    );
  }
}

// 创建全局实例
export const performanceMonitor = new PerformanceMonitor();

// 在开发环境中暴露到全局对象
if (process.env.NODE_ENV === 'development') {
  (window as any).performanceMonitor = performanceMonitor;
}

export default performanceMonitor;
