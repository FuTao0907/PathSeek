/**
 * 主题缓存系统
 * 用于缓存主题变量和优化主题切换性能
 */

import { ThemeMode, ThemeVariables, ThemeConfig } from './types';
import { themePresets } from './themes';

interface CacheEntry {
  variables: ThemeVariables;
  timestamp: number;
  accessCount: number;
  lastAccessed: number;
}

interface CacheStats {
  totalEntries: number;
  hitRate: number;
  totalHits: number;
  totalMisses: number;
  memoryUsage: number;
}

class ThemeCache {
  private cache = new Map<string, CacheEntry>();
  private maxSize = 20;
  private ttl = 5 * 60 * 1000; // 5分钟
  private hits = 0;
  private misses = 0;

  /**
   * 生成缓存键
   */
  private generateKey(mode: ThemeMode, config: ThemeConfig): string {
    const configHash = JSON.stringify({
      mode,
      highContrast: config.highContrast,
      reducedMotion: config.reducedMotion,
      customColors: config.customColors,
    });
    return btoa(configHash).replace(/[+/=]/g, '');
  }

  /**
   * 获取缓存的主题变量
   */
  get(mode: ThemeMode, config: ThemeConfig): ThemeVariables | null {
    const key = this.generateKey(mode, config);
    const entry = this.cache.get(key);

    if (!entry) {
      this.misses++;
      return null;
    }

    // 检查是否过期
    if (Date.now() - entry.timestamp > this.ttl) {
      this.cache.delete(key);
      this.misses++;
      return null;
    }

    // 更新访问统计
    entry.accessCount++;
    entry.lastAccessed = Date.now();
    this.hits++;

    return entry.variables;
  }

  /**
   * 设置缓存的主题变量
   */
  set(mode: ThemeMode, config: ThemeConfig, variables: ThemeVariables): void {
    const key = this.generateKey(mode, config);

    // 如果缓存已满，清理最少使用的条目
    if (this.cache.size >= this.maxSize) {
      this.evictLeastUsed();
    }

    const entry: CacheEntry = {
      variables: this.deepClone(variables),
      timestamp: Date.now(),
      accessCount: 1,
      lastAccessed: Date.now(),
    };

    this.cache.set(key, entry);
  }

  /**
   * 预加载常用主题
   */
  preloadCommonThemes(): void {
    const commonModes = [ThemeMode.LIGHT, ThemeMode.DARK, ThemeMode.EYE_CARE];
    const defaultConfig: ThemeConfig = {
      mode: ThemeMode.LIGHT,
      highContrast: false,
      reducedMotion: false,
    };

    commonModes.forEach(mode => {
      const preset = themePresets.find((p: any) => p.config.mode === mode);
      if (preset && !this.get(mode, { ...defaultConfig, mode })) {
        // 确保使用完整的主题变量
        const completeVariables: ThemeVariables = {
          colors: preset.variables.colors || {},
          spacing: preset.variables.spacing || {},
          fontSizes: preset.variables.fontSizes || {},
          radius: preset.variables.radius || {},
          shadows: preset.variables.shadows || {},
          breakpoints: preset.variables.breakpoints || {},
        } as ThemeVariables;

        this.set(mode, { ...defaultConfig, mode }, completeVariables);
      }
    });
  }

  /**
   * 清理过期的缓存条目
   */
  cleanup(): number {
    const now = Date.now();
    let cleanedCount = 0;

    Array.from(this.cache.entries()).forEach(([key, entry]) => {
      if (now - entry.timestamp > this.ttl) {
        this.cache.delete(key);
        cleanedCount++;
      }
    });

    return cleanedCount;
  }

  /**
   * 清除所有缓存
   */
  clear(): void {
    this.cache.clear();
    this.hits = 0;
    this.misses = 0;
  }

  /**
   * 获取缓存统计信息
   */
  getStats(): CacheStats {
    const totalRequests = this.hits + this.misses;
    const hitRate = totalRequests > 0 ? (this.hits / totalRequests) * 100 : 0;

    // 估算内存使用量（粗略计算）
    const memoryUsage = this.cache.size * 1024; // 假设每个条目约1KB

    return {
      totalEntries: this.cache.size,
      hitRate: Math.round(hitRate * 100) / 100,
      totalHits: this.hits,
      totalMisses: this.misses,
      memoryUsage,
    };
  }

  /**
   * 获取缓存详细信息（开发环境）
   */
  getDetailedInfo() {
    if (process.env.NODE_ENV !== 'development') {
      return null;
    }

    const entries = Array.from(this.cache.entries()).map(([key, entry]) => ({
      key: key.substring(0, 8) + '...',
      accessCount: entry.accessCount,
      age: Math.round((Date.now() - entry.timestamp) / 1000),
      lastAccessed: Math.round((Date.now() - entry.lastAccessed) / 1000),
    }));

    return {
      stats: this.getStats(),
      entries: entries.sort((a, b) => b.accessCount - a.accessCount),
    };
  }

  /**
   * 驱逐最少使用的缓存条目
   */
  private evictLeastUsed(): void {
    if (this.cache.size === 0) return;

    let leastUsedKey = '';
    let leastUsedCount = Infinity;

    Array.from(this.cache.entries()).forEach(([key, entry]) => {
      if (entry.accessCount < leastUsedCount) {
        leastUsedCount = entry.accessCount;
        leastUsedKey = key;
      }
    });

    if (leastUsedKey) {
      this.cache.delete(leastUsedKey);
    }
  }

  /**
   * 深度克隆对象
   */
  private deepClone<T>(obj: T): T {
    if (obj === null || typeof obj !== 'object') {
      return obj;
    }

    if (obj instanceof Date) {
      return new Date(obj.getTime()) as unknown as T;
    }

    if (Array.isArray(obj)) {
      return obj.map(item => this.deepClone(item)) as unknown as T;
    }

    const cloned = {} as T;
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        cloned[key] = this.deepClone(obj[key]);
      }
    }

    return cloned;
  }

  /**
   * 设置缓存配置
   */
  configure(options: { maxSize?: number; ttl?: number }): void {
    if (options.maxSize !== undefined) {
      this.maxSize = Math.max(1, options.maxSize);
    }
    if (options.ttl !== undefined) {
      this.ttl = Math.max(1000, options.ttl); // 最少1秒
    }
  }

  /**
   * 定期清理任务
   */
  startPeriodicCleanup(interval = 60000): () => void {
    const cleanupInterval = setInterval(() => {
      const cleaned = this.cleanup();
      if (process.env.NODE_ENV === 'development' && cleaned > 0) {
        console.log(`🧹 主题缓存清理: 移除了 ${cleaned} 个过期条目`);
      }
    }, interval);

    return () => clearInterval(cleanupInterval);
  }
}

// 创建全局缓存实例
export const themeCache = new ThemeCache();

// 开发环境下的便捷方法
if (process.env.NODE_ENV === 'development') {
  (window as any).__themeCache = {
    getStats: () => themeCache.getStats(),
    getInfo: () => themeCache.getDetailedInfo(),
    clear: () => themeCache.clear(),
    preload: () => themeCache.preloadCommonThemes(),
  };

  if (process.env.NODE_ENV === 'development') {
    console.log('💾 主题缓存已启用，使用 __themeCache 查看缓存信息');
  }
}

export default themeCache;
