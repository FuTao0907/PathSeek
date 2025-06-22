/**
 * 主题开发工具组件
 * 仅在开发环境下显示，用于监控和调试主题系统
 */

import React, { useState, useEffect } from 'react';
import { themePerformanceMonitor } from './themePerformance';
import { themeCache } from './themeCache';
import { useTheme } from './ThemeContext';

interface DevToolsProps {
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  minimized?: boolean;
}

const ThemeDevTools: React.FC<DevToolsProps> = ({
  position = 'bottom-right',
  minimized = true,
}) => {
  const [isMinimized, setIsMinimized] = useState(minimized);
  const [activeTab, setActiveTab] = useState<'performance' | 'cache' | 'theme'>(
    'performance'
  );
  const [stats, setStats] = useState<any>(null);
  const [cacheInfo, setCacheInfo] = useState<any>(null);
  const { mode, config } = useTheme();

  // 定期更新统计信息
  useEffect(() => {
    const updateStats = () => {
      setStats(themePerformanceMonitor.getPerformanceStats());
      setCacheInfo(themeCache.getDetailedInfo());
    };

    updateStats();
    const interval = setInterval(updateStats, 2000);

    return () => clearInterval(interval);
  }, []);

  // 仅在开发环境下渲染
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  const positionClasses = {
    'top-left': 'top-4 left-4',
    'top-right': 'top-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'bottom-right': 'bottom-4 right-4',
  };

  const renderPerformanceTab = () => {
    if (!stats) {
      return <div className="text-sm text-gray-500">暂无性能数据</div>;
    }

    const suggestions = themePerformanceMonitor.getOptimizationSuggestions();

    return (
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="bg-blue-50 p-2 rounded">
            <div className="font-medium text-blue-700">平均切换时间</div>
            <div className="text-blue-600">{stats.avgThemeChangeTime}ms</div>
          </div>
          <div className="bg-green-50 p-2 rounded">
            <div className="font-medium text-green-700">总切换次数</div>
            <div className="text-green-600">{stats.totalChanges}</div>
          </div>
          <div className="bg-yellow-50 p-2 rounded">
            <div className="font-medium text-yellow-700">最慢切换</div>
            <div className="text-yellow-600">{stats.slowestChange.time}ms</div>
          </div>
          <div className="bg-purple-50 p-2 rounded">
            <div className="font-medium text-purple-700">最快切换</div>
            <div className="text-purple-600">{stats.fastestChange.time}ms</div>
          </div>
        </div>

        {suggestions.length > 0 && (
          <div className="bg-orange-50 p-2 rounded">
            <div className="font-medium text-orange-700 text-xs mb-1">
              优化建议
            </div>
            <ul className="text-xs text-orange-600 space-y-1">
              {suggestions.map((suggestion, index) => (
                <li key={index} className="flex items-start gap-1">
                  <span>•</span>
                  <span>{suggestion}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <button
          onClick={() => themePerformanceMonitor.logPerformanceReport()}
          className="w-full text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
        >
          输出详细报告
        </button>
      </div>
    );
  };

  const renderCacheTab = () => {
    if (!cacheInfo) {
      return <div className="text-sm text-gray-500">暂无缓存数据</div>;
    }

    const { stats: cacheStats, entries } = cacheInfo;

    return (
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="bg-indigo-50 p-2 rounded">
            <div className="font-medium text-indigo-700">缓存条目</div>
            <div className="text-indigo-600">{cacheStats.totalEntries}</div>
          </div>
          <div className="bg-green-50 p-2 rounded">
            <div className="font-medium text-green-700">命中率</div>
            <div className="text-green-600">{cacheStats.hitRate}%</div>
          </div>
          <div className="bg-blue-50 p-2 rounded">
            <div className="font-medium text-blue-700">命中次数</div>
            <div className="text-blue-600">{cacheStats.totalHits}</div>
          </div>
          <div className="bg-red-50 p-2 rounded">
            <div className="font-medium text-red-700">未命中</div>
            <div className="text-red-600">{cacheStats.totalMisses}</div>
          </div>
        </div>

        {entries.length > 0 && (
          <div className="bg-gray-50 p-2 rounded">
            <div className="font-medium text-gray-700 text-xs mb-1">
              热门缓存
            </div>
            <div className="space-y-1">
              {entries.slice(0, 3).map((entry: any, index: number) => (
                <div
                  key={index}
                  className="text-xs text-gray-600 flex justify-between"
                >
                  <span>{entry.key}</span>
                  <span>{entry.accessCount}次</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-1">
          <button
            onClick={() => themeCache.clear()}
            className="flex-1 text-xs bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
          >
            清空缓存
          </button>
          <button
            onClick={() => themeCache.preloadCommonThemes()}
            className="flex-1 text-xs bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
          >
            预加载
          </button>
        </div>
      </div>
    );
  };

  const renderThemeTab = () => {
    return (
      <div className="space-y-3">
        <div className="bg-gray-50 p-2 rounded">
          <div className="font-medium text-gray-700 text-xs mb-1">当前主题</div>
          <div className="text-xs text-gray-600">
            <div>模式: {mode}</div>
            <div>高对比度: {config.highContrast ? '是' : '否'}</div>
            <div>减少动画: {config.reducedMotion ? '是' : '否'}</div>
          </div>
        </div>

        <div className="bg-blue-50 p-2 rounded">
          <div className="font-medium text-blue-700 text-xs mb-1">CSS 变量</div>
          <div className="text-xs text-blue-600 space-y-1">
            <div>
              --color-primary:{' '}
              {getComputedStyle(document.documentElement).getPropertyValue(
                '--color-primary'
              )}
            </div>
            <div>
              --color-background:{' '}
              {getComputedStyle(document.documentElement).getPropertyValue(
                '--color-background'
              )}
            </div>
            <div>
              --color-surface:{' '}
              {getComputedStyle(document.documentElement).getPropertyValue(
                '--color-surface'
              )}
            </div>
            <div>
              --color-text:{' '}
              {getComputedStyle(document.documentElement).getPropertyValue(
                '--color-text'
              )}
            </div>
          </div>
        </div>

        <button
          onClick={() => {
            if (process.env.NODE_ENV === 'development') {
              console.log('当前主题配置:', { mode, config });
              console.log('当前 CSS 变量:', {
                primary: getComputedStyle(
                  document.documentElement
                ).getPropertyValue('--color-primary'),
                background: getComputedStyle(
                  document.documentElement
                ).getPropertyValue('--color-background'),
                surface: getComputedStyle(
                  document.documentElement
                ).getPropertyValue('--color-surface'),
                text: getComputedStyle(
                  document.documentElement
                ).getPropertyValue('--color-text'),
              });
            }
          }}
          className="w-full text-xs bg-gray-500 text-white px-2 py-1 rounded hover:bg-gray-600"
        >
          输出主题信息
        </button>
      </div>
    );
  };

  if (isMinimized) {
    return (
      <div className={`fixed ${positionClasses[position]} z-50`}>
        <button
          onClick={() => setIsMinimized(false)}
          className="bg-gray-800 text-white p-2 rounded-full shadow-lg hover:bg-gray-700 transition-colors"
          title="打开主题开发工具"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
    );
  }

  return (
    <div
      className={`fixed ${positionClasses[position]} z-50 bg-white border border-gray-200 rounded-lg shadow-lg w-80`}
    >
      {/* 头部 */}
      <div className="flex items-center justify-between p-3 border-b border-gray-200">
        <h3 className="text-sm font-medium text-gray-800">主题开发工具</h3>
        <button
          onClick={() => setIsMinimized(true)}
          className="text-gray-400 hover:text-gray-600"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>

      {/* 标签页 */}
      <div className="flex border-b border-gray-200">
        {[
          { key: 'performance', label: '性能' },
          { key: 'cache', label: '缓存' },
          { key: 'theme', label: '主题' },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`flex-1 px-3 py-2 text-xs font-medium ${
              activeTab === tab.key
                ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 内容区域 */}
      <div className="p-3">
        {activeTab === 'performance' && renderPerformanceTab()}
        {activeTab === 'cache' && renderCacheTab()}
        {activeTab === 'theme' && renderThemeTab()}
      </div>
    </div>
  );
};

export default ThemeDevTools;
