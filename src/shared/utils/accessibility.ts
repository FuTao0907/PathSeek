/**
 * 可访问性 (A11y) 工具模块
 * 提供无障碍访问功能和辅助工具
 */

/**
 * 焦点管理器
 */
export class FocusManager {
  private focusableSelectors = [
    'a[href]',
    'button:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
    '[contenteditable="true"]',
  ].join(', ');

  /**
   * 获取容器内所有可聚焦元素
   */
  getFocusableElements(container: HTMLElement = document.body): HTMLElement[] {
    return Array.from(
      container.querySelectorAll(this.focusableSelectors)
    ).filter(el => this.isVisible(el as HTMLElement)) as HTMLElement[];
  }

  /**
   * 检查元素是否可见
   */
  private isVisible(element: HTMLElement): boolean {
    const style = window.getComputedStyle(element);
    return (
      style.display !== 'none' &&
      style.visibility !== 'hidden' &&
      style.opacity !== '0' &&
      element.offsetWidth > 0 &&
      element.offsetHeight > 0
    );
  }

  /**
   * 设置焦点陷阱
   */
  trapFocus(container: HTMLElement): () => void {
    const focusableElements = this.getFocusableElements(container);
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        // Tab
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    container.addEventListener('keydown', handleTabKey);
    firstElement?.focus();

    // 返回清理函数
    return () => {
      container.removeEventListener('keydown', handleTabKey);
    };
  }

  /**
   * 恢复焦点到指定元素
   */
  restoreFocus(element: HTMLElement | null): void {
    if (element && this.isVisible(element)) {
      element.focus();
    }
  }
}

/**
 * 屏幕阅读器公告管理器
 */
export class ScreenReaderAnnouncer {
  private liveRegion: HTMLElement | null = null;
  private politeRegion: HTMLElement | null = null;

  constructor() {
    this.createLiveRegions();
  }

  /**
   * 创建 ARIA live regions
   */
  private createLiveRegions(): void {
    // 创建 assertive live region (立即公告)
    this.liveRegion = document.createElement('div');
    this.liveRegion.setAttribute('aria-live', 'assertive');
    this.liveRegion.setAttribute('aria-atomic', 'true');
    this.liveRegion.className = 'sr-only';
    document.body.appendChild(this.liveRegion);

    // 创建 polite live region (礼貌公告)
    this.politeRegion = document.createElement('div');
    this.politeRegion.setAttribute('aria-live', 'polite');
    this.politeRegion.setAttribute('aria-atomic', 'true');
    this.politeRegion.className = 'sr-only';
    document.body.appendChild(this.politeRegion);
  }

  /**
   * 立即公告消息
   */
  announce(message: string): void {
    if (this.liveRegion) {
      this.liveRegion.textContent = message;
      // 清空内容，确保下次相同消息也能被读出
      setTimeout(() => {
        if (this.liveRegion) {
          this.liveRegion.textContent = '';
        }
      }, 1000);
    }
  }

  /**
   * 礼貌地公告消息
   */
  announcePolite(message: string): void {
    if (this.politeRegion) {
      this.politeRegion.textContent = message;
      setTimeout(() => {
        if (this.politeRegion) {
          this.politeRegion.textContent = '';
        }
      }, 1000);
    }
  }

  /**
   * 销毁 live regions
   */
  destroy(): void {
    if (this.liveRegion) {
      document.body.removeChild(this.liveRegion);
      this.liveRegion = null;
    }
    if (this.politeRegion) {
      document.body.removeChild(this.politeRegion);
      this.politeRegion = null;
    }
  }
}

/**
 * 键盘导航助手
 */
export class KeyboardNavigation {
  /**
   * 处理方向键导航
   */
  static handleArrowNavigation(
    event: KeyboardEvent,
    elements: HTMLElement[],
    currentIndex: number,
    options: {
      horizontal?: boolean;
      vertical?: boolean;
      loop?: boolean;
    } = {}
  ): number {
    const { horizontal = true, vertical = true, loop = true } = options;
    let newIndex = currentIndex;

    switch (event.key) {
      case 'ArrowLeft':
        if (horizontal) {
          event.preventDefault();
          newIndex = loop
            ? (currentIndex - 1 + elements.length) % elements.length
            : Math.max(0, currentIndex - 1);
        }
        break;
      case 'ArrowRight':
        if (horizontal) {
          event.preventDefault();
          newIndex = loop
            ? (currentIndex + 1) % elements.length
            : Math.min(elements.length - 1, currentIndex + 1);
        }
        break;
      case 'ArrowUp':
        if (vertical) {
          event.preventDefault();
          newIndex = loop
            ? (currentIndex - 1 + elements.length) % elements.length
            : Math.max(0, currentIndex - 1);
        }
        break;
      case 'ArrowDown':
        if (vertical) {
          event.preventDefault();
          newIndex = loop
            ? (currentIndex + 1) % elements.length
            : Math.min(elements.length - 1, currentIndex + 1);
        }
        break;
      case 'Home':
        event.preventDefault();
        newIndex = 0;
        break;
      case 'End':
        event.preventDefault();
        newIndex = elements.length - 1;
        break;
    }

    if (newIndex !== currentIndex && elements[newIndex]) {
      elements[newIndex]?.focus();
    }

    return newIndex;
  }

  /**
   * 处理 Escape 键
   */
  static handleEscape(event: KeyboardEvent, callback: () => void): void {
    if (event.key === 'Escape') {
      event.preventDefault();
      callback();
    }
  }

  /**
   * 处理 Enter 和 Space 键激活
   */
  static handleActivation(event: KeyboardEvent, callback: () => void): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      callback();
    }
  }
}

/**
 * 颜色对比度检查器
 */
export class ColorContrastChecker {
  /**
   * 将十六进制颜色转换为 RGB
   */
  private static hexToRgb(
    hex: string
  ): { r: number; g: number; b: number } | null {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1]!, 16),
          g: parseInt(result[2]!, 16),
          b: parseInt(result[3]!, 16),
        }
      : null;
  }

  /**
   * 计算相对亮度
   */
  private static getLuminance(r: number, g: number, b: number): number {
    const [rs, gs, bs] = [r, g, b].map(c => {
      c = c / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * rs! + 0.7152 * gs! + 0.0722 * bs!;
  }

  /**
   * 计算对比度比率
   */
  static getContrastRatio(color1: string, color2: string): number {
    const rgb1 = this.hexToRgb(color1);
    const rgb2 = this.hexToRgb(color2);

    if (!rgb1 || !rgb2) {
      throw new Error('Invalid color format');
    }

    const lum1 = this.getLuminance(rgb1.r, rgb1.g, rgb1.b);
    const lum2 = this.getLuminance(rgb2.r, rgb2.g, rgb2.b);

    const brightest = Math.max(lum1, lum2);
    const darkest = Math.min(lum1, lum2);

    return (brightest + 0.05) / (darkest + 0.05);
  }

  /**
   * 检查是否符合 WCAG 标准
   */
  static checkWCAGCompliance(
    foreground: string,
    background: string,
    level: 'AA' | 'AAA' = 'AA',
    size: 'normal' | 'large' = 'normal'
  ): {
    ratio: number;
    passes: boolean;
    level: string;
  } {
    const ratio = this.getContrastRatio(foreground, background);
    let requiredRatio: number;

    if (level === 'AAA') {
      requiredRatio = size === 'large' ? 4.5 : 7;
    } else {
      requiredRatio = size === 'large' ? 3 : 4.5;
    }

    return {
      ratio: Math.round(ratio * 100) / 100,
      passes: ratio >= requiredRatio,
      level: `WCAG ${level}`,
    };
  }
}

/**
 * 动画偏好检查器
 */
export class MotionPreferences {
  /**
   * 检查用户是否偏好减少动画
   */
  static prefersReducedMotion(): boolean {
    if (typeof window === 'undefined') return false;

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    return mediaQuery.matches;
  }

  /**
   * 监听动画偏好变化
   */
  static onMotionPreferenceChange(
    callback: (prefersReduced: boolean) => void
  ): () => void {
    if (typeof window === 'undefined') {
      // Return no-op function for SSR compatibility
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      return () => {};
    }

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handler = (e: MediaQueryListEvent) => callback(e.matches);

    mediaQuery.addEventListener('change', handler);

    // 返回清理函数
    return () => mediaQuery.removeEventListener('change', handler);
  }

  /**
   * 应用动画偏好到元素
   */
  static applyMotionPreference(element: HTMLElement): void {
    if (this.prefersReducedMotion()) {
      element.style.animation = 'none';
      element.style.transition = 'none';
    }
  }
}

/**
 * 可访问性检查器
 */
export class AccessibilityChecker {
  /**
   * 检查元素是否有适当的 ARIA 标签
   */
  static checkAriaLabels(element: HTMLElement): string[] {
    const issues: string[] = [];
    const tagName = element.tagName.toLowerCase();

    // 检查按钮
    if (
      tagName === 'button' &&
      !element.textContent?.trim() &&
      !element.getAttribute('aria-label')
    ) {
      issues.push('按钮缺少可访问的名称');
    }

    // 检查输入框
    if (
      tagName === 'input' &&
      !element.getAttribute('aria-label') &&
      !element.getAttribute('aria-labelledby')
    ) {
      const associatedLabel = document.querySelector(
        `label[for="${element.id}"]`
      );
      if (!associatedLabel) {
        issues.push('输入框缺少标签');
      }
    }

    // 检查图片
    if (tagName === 'img' && !element.getAttribute('alt')) {
      issues.push('图片缺少 alt 属性');
    }

    return issues;
  }

  /**
   * 检查颜色对比度
   */
  static checkColorContrast(element: HTMLElement): string[] {
    const issues: string[] = [];
    const styles = window.getComputedStyle(element);
    const color = styles.color;
    const backgroundColor = styles.backgroundColor;

    if (
      color &&
      backgroundColor &&
      color !== 'rgba(0, 0, 0, 0)' &&
      backgroundColor !== 'rgba(0, 0, 0, 0)'
    ) {
      try {
        const result = ColorContrastChecker.checkWCAGCompliance(
          color,
          backgroundColor
        );
        if (!result.passes) {
          issues.push(`颜色对比度不足: ${result.ratio}:1 (需要至少 4.5:1)`);
        }
      } catch {
        // 忽略颜色格式错误
      }
    }

    return issues;
  }

  /**
   * 检查键盘可访问性
   */
  static checkKeyboardAccessibility(element: HTMLElement): string[] {
    const issues: string[] = [];
    const tagName = element.tagName.toLowerCase();
    const role = element.getAttribute('role');
    const tabIndex = element.getAttribute('tabindex');

    // 检查交互元素是否可聚焦
    const interactiveElements = ['button', 'a', 'input', 'select', 'textarea'];
    const interactiveRoles = ['button', 'link', 'menuitem', 'tab'];

    const isInteractive =
      interactiveElements.includes(tagName) ||
      (role && interactiveRoles.includes(role)) ||
      element.onclick !== null;

    if (isInteractive && tabIndex === '-1') {
      issues.push('交互元素不可通过键盘访问');
    }

    return issues;
  }

  /**
   * 运行完整的可访问性检查
   */
  static runFullCheck(container: HTMLElement = document.body): {
    element: HTMLElement;
    issues: string[];
  }[] {
    const results: { element: HTMLElement; issues: string[] }[] = [];
    const elements = container.querySelectorAll('*');

    elements.forEach(el => {
      const element = el as HTMLElement;
      const issues = [
        ...this.checkAriaLabels(element),
        ...this.checkColorContrast(element),
        ...this.checkKeyboardAccessibility(element),
      ];

      if (issues.length > 0) {
        results.push({ element, issues });
      }
    });

    return results;
  }
}

// 创建全局实例
export const focusManager = new FocusManager();
export const screenReader = new ScreenReaderAnnouncer();

// 在开发环境中暴露到全局对象
if (process.env.NODE_ENV === 'development') {
  (window as any).a11y = {
    focusManager,
    screenReader,
    KeyboardNavigation,
    ColorContrastChecker,
    MotionPreferences,
    AccessibilityChecker,
  };
}
