/**
 * 测试工具模块
 * 提供测试辅助函数和工具
 */

// Note: Enzyme has been replaced with React Testing Library for better React 18 compatibility
// import { ReactWrapper, ShallowWrapper } from 'enzyme';

/**
 * 测试数据生成器
 */
export class TestDataGenerator {
  /**
   * 生成随机字符串
   */
  static randomString(length = 10): string {
    const chars =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  /**
   * 生成随机数字
   */
  static randomNumber(min = 0, max = 100): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  /**
   * 生成随机布尔值
   */
  static randomBoolean(): boolean {
    return Math.random() < 0.5;
  }

  /**
   * 生成随机日期
   */
  static randomDate(start?: Date, end?: Date): Date {
    const startTime = start ? start.getTime() : new Date(2020, 0, 1).getTime();
    const endTime = end ? end.getTime() : new Date().getTime();
    return new Date(startTime + Math.random() * (endTime - startTime));
  }

  /**
   * 生成随机邮箱
   */
  static randomEmail(): string {
    const domains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com'];
    const username = this.randomString(8).toLowerCase();
    const domain = domains[Math.floor(Math.random() * domains.length)];
    return `${username}@${domain}`;
  }

  /**
   * 生成随机 URL
   */
  static randomUrl(): string {
    const protocols = ['http', 'https'];
    const domains = ['example.com', 'test.org', 'demo.net'];
    const protocol = protocols[Math.floor(Math.random() * protocols.length)];
    const domain = domains[Math.floor(Math.random() * domains.length)];
    const path = this.randomString(6).toLowerCase();
    return `${protocol}://${domain}/${path}`;
  }

  /**
   * 生成模拟文章数据
   */
  static mockArticle(): {
    id: string;
    title: string;
    content: string;
    author: string;
    createdAt: Date;
    updatedAt: Date;
    tags: string[];
    published: boolean;
  } {
    return {
      id: this.randomString(12),
      title: `测试文章 ${this.randomString(5)}`,
      content: `这是一篇测试文章的内容。${this.randomString(100)}`,
      author: `作者${this.randomString(4)}`,
      createdAt: this.randomDate(),
      updatedAt: this.randomDate(),
      tags: Array.from({ length: this.randomNumber(1, 5) }, () =>
        this.randomString(6)
      ),
      published: this.randomBoolean(),
    };
  }

  /**
   * 生成模拟用户数据
   */
  static mockUser(): {
    id: string;
    username: string;
    email: string;
    avatar?: string;
    createdAt: Date;
    lastLoginAt: Date;
  } {
    const avatarUrl = this.randomBoolean() ? this.randomUrl() : undefined;
    const user: any = {
      id: this.randomString(12),
      username: `user${this.randomString(6)}`,
      email: this.randomEmail(),
      createdAt: this.randomDate(),
      lastLoginAt: this.randomDate(),
    };
    
    if (avatarUrl) {
      user.avatar = avatarUrl;
    }
    
    return user;
  }
}

/**
 * DOM 测试工具
 */
export class DOMTestUtils {
  /**
   * 等待元素出现
   */
  static async waitForElement(
    selector: string,
    timeout = 5000
  ): Promise<HTMLElement> {
    return new Promise((resolve, reject) => {
      const startTime = Date.now();

      const checkElement = () => {
        const element = document.querySelector(selector) as HTMLElement;
        if (element) {
          resolve(element);
          return;
        }

        if (Date.now() - startTime > timeout) {
          reject(
            new Error(`Element ${selector} not found within ${timeout}ms`)
          );
          return;
        }

        setTimeout(checkElement, 100);
      };

      checkElement();
    });
  }

  /**
   * 等待元素消失
   */
  static async waitForElementToDisappear(
    selector: string,
    timeout = 5000
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      const startTime = Date.now();

      const checkElement = () => {
        const element = document.querySelector(selector);
        if (!element) {
          resolve();
          return;
        }

        if (Date.now() - startTime > timeout) {
          reject(
            new Error(`Element ${selector} still exists after ${timeout}ms`)
          );
          return;
        }

        setTimeout(checkElement, 100);
      };

      checkElement();
    });
  }

  /**
   * 模拟用户输入
   */
  static simulateUserInput(element: HTMLInputElement, value: string): void {
    element.focus();
    element.value = value;

    // 触发输入事件
    const inputEvent = new Event('input', { bubbles: true });
    element.dispatchEvent(inputEvent);

    // 触发变化事件
    const changeEvent = new Event('change', { bubbles: true });
    element.dispatchEvent(changeEvent);
  }

  /**
   * 模拟键盘事件
   */
  static simulateKeyPress(
    element: HTMLElement,
    key: string,
    options: KeyboardEventInit = {}
  ): void {
    const event = new KeyboardEvent('keydown', {
      key,
      bubbles: true,
      ...options,
    });
    element.dispatchEvent(event);
  }

  /**
   * 模拟鼠标点击
   */
  static simulateClick(
    element: HTMLElement,
    options: MouseEventInit = {}
  ): void {
    const event = new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
      ...options,
    });
    element.dispatchEvent(event);
  }

  /**
   * 获取元素的计算样式
   */
  static getComputedStyle(element: HTMLElement, property: string): string {
    return window.getComputedStyle(element).getPropertyValue(property);
  }

  /**
   * 检查元素是否可见
   */
  static isElementVisible(element: HTMLElement): boolean {
    const style = window.getComputedStyle(element);
    return (
      style.display !== 'none' &&
      style.visibility !== 'hidden' &&
      style.opacity !== '0' &&
      element.offsetWidth > 0 &&
      element.offsetHeight > 0
    );
  }
}

/**
 * React 测试工具
 * Note: This class is deprecated due to Enzyme removal
 */
export class ReactTestUtils {
  /**
   * 查找组件中的文本
   * Note: This method is deprecated due to Enzyme removal
   */
  static findByText(
    wrapper: any, // ReactWrapper | ShallowWrapper,
    text: string | RegExp
  ): any { // ReactWrapper | ShallowWrapper {
    return wrapper.findWhere((node: { text: () => any; }) => {
      const nodeText = node.text();
      if (typeof text === 'string') {
        return nodeText.includes(text);
      }
      return text.test(nodeText);
    });
  }

  /**
   * 查找具有特定属性的组件
   * Note: This method is deprecated due to Enzyme removal
   */
  static findByProp(
    wrapper: any, // ReactWrapper | ShallowWrapper,
    propName: string,
    propValue?: any
  ): any { // ReactWrapper | ShallowWrapper {
    return wrapper.findWhere((node: { props: () => any; }) => {
      const props = node.props();
      if (propValue === undefined) {
        return Object.prototype.hasOwnProperty.call(props, propName);
      }
      return props[propName] === propValue;
    });
  }

  /**
   * 查找组件中的元素
   * Note: This method is deprecated due to Enzyme removal
   */
  static findByTestId(
    wrapper: any, // ReactWrapper | ShallowWrapper,
    testId: string
  ): any { // ReactWrapper | ShallowWrapper {
    return wrapper.find(`[data-testid="${testId}"]`);
  }

  /**
   * 模拟用户输入
   * Note: This method is deprecated due to Enzyme removal
   */
  static simulateInput(
    wrapper: any, // ReactWrapper | ShallowWrapper,
    selector: string,
    value: string
  ): any { // ReactWrapper | ShallowWrapper {
    const input = wrapper.find(selector);
    input.simulate('change', { target: { value } });
    return input;
  }

  /**
   * 模拟异步操作完成
   */
  static async flushPromises(): Promise<void> {
    return new Promise(resolve => setImmediate(resolve));
  }

  /**
   * 等待组件更新
   * Note: This method is deprecated due to Enzyme removal
   */
  static async waitForUpdate(
    wrapper: any, // ReactWrapper,
    timeout = 1000
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      const startTime = Date.now();

      const checkUpdate = () => {
        wrapper.update();

        if (Date.now() - startTime > timeout) {
          reject(new Error(`Component did not update within ${timeout}ms`));
          return;
        }

        setTimeout(() => {
          resolve();
        }, 10);
      };

      checkUpdate();
    });
  }
}

/**
 * API 模拟工具
 */
export class APIMockUtils {
  private static originalFetch: typeof fetch;
  private static mockResponses: Map<string, any> = new Map();

  /**
   * 开始模拟 fetch
   */
  static startMocking(): void {
    this.originalFetch = global.fetch;
    global.fetch = this.mockFetch.bind(this);
  }

  /**
   * 停止模拟 fetch
   */
  static stopMocking(): void {
    if (this.originalFetch) {
      global.fetch = this.originalFetch;
    }
    this.mockResponses.clear();
  }

  /**
   * 设置模拟响应
   */
  static mockResponse(
    url: string | RegExp,
    response: any,
    options: {
      status?: number;
      statusText?: string;
      headers?: Record<string, string>;
      delay?: number;
    } = {}
  ): void {
    const key = url instanceof RegExp ? url.source : url;
    this.mockResponses.set(key, {
      response,
      status: options.status || 200,
      statusText: options.statusText || 'OK',
      headers: options.headers || { 'Content-Type': 'application/json' },
      delay: options.delay || 0,
    });
  }

  /**
   * 模拟 fetch 函数
   */
  private static async mockFetch(
    input: RequestInfo | URL,
    _init?: RequestInit
  ): Promise<Response> {
    // 将 input 转换为字符串 URL
    const url = typeof input === 'string' ? input : 
                input instanceof URL ? input.toString() : 
                input.url;
    // 查找匹配的模拟响应
    let mockData: any = null;

    for (const [key, data] of Array.from(this.mockResponses.entries())) {
      if (typeof key === 'string' ? key === url : new RegExp(key).test(url)) {
        mockData = data;
        break;
      }
    }

    if (!mockData) {
      throw new Error(`No mock response found for ${url}`);
    }

    // 模拟延迟
    if (mockData.delay > 0) {
      await new Promise(resolve => setTimeout(resolve, mockData.delay));
    }

    // 创建模拟响应
    const response = new Response(JSON.stringify(mockData.response), {
      status: mockData.status,
      statusText: mockData.statusText,
      headers: mockData.headers,
    });

    return response;
  }

  /**
   * 模拟网络错误
   */
  static mockNetworkError(url: string | RegExp): void {
    const key = url instanceof RegExp ? url.source : url;
    this.mockResponses.set(key, {
      error: true,
      message: 'Network Error',
    });
  }
}

/**
 * 性能测试工具
 */
export class PerformanceTestUtils {
  /**
   * 测量函数执行时间
   */
  static async measureExecutionTime<T>(
    fn: () => T | Promise<T>,
    iterations = 1
  ): Promise<{
    result: T;
    averageTime: number;
    minTime: number;
    maxTime: number;
    times: number[];
  }> {
    const times: number[] = [];
    let result: T;

    for (let i = 0; i < iterations; i++) {
      const start = performance.now();
      result = await fn();
      const end = performance.now();
      times.push(end - start);
    }

    return {
      result: result!,
      averageTime: times.reduce((a, b) => a + b, 0) / times.length,
      minTime: Math.min(...times),
      maxTime: Math.max(...times),
      times,
    };
  }

  /**
   * 测量内存使用情况
   */
  static measureMemoryUsage(): {
    used: number;
    total: number;
    percentage: number;
  } | null {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      return {
        used: memory.usedJSHeapSize,
        total: memory.totalJSHeapSize,
        percentage: (memory.usedJSHeapSize / memory.totalJSHeapSize) * 100,
      };
    }
    return null;
  }

  /**
   * 创建性能标记
   */
  static mark(name: string): void {
    if ('mark' in performance) {
      performance.mark(name);
    }
  }

  /**
   * 测量两个标记之间的时间
   */
  static measure(name: string, startMark: string, endMark: string): number {
    if ('measure' in performance) {
      performance.measure(name, startMark, endMark);
      const entries = performance.getEntriesByName(name, 'measure');
      return entries.length > 0
        ? (entries[entries.length - 1]?.duration ?? 0)
        : 0;
    }
    return 0;
  }
}

/**
 * 测试断言工具
 */
export class AssertionUtils {
  /**
   * 断言值为真
   */
  static assertTrue(value: any, message?: string): void {
    if (!value) {
      throw new Error(message || `Expected ${value} to be truthy`);
    }
  }

  /**
   * 断言值为假
   */
  static assertFalse(value: any, message?: string): void {
    if (value) {
      throw new Error(message || `Expected ${value} to be falsy`);
    }
  }

  /**
   * 断言值相等
   */
  static assertEqual(actual: any, expected: any, message?: string): void {
    if (actual !== expected) {
      throw new Error(message || `Expected ${actual} to equal ${expected}`);
    }
  }

  /**
   * 断言深度相等
   */
  static assertDeepEqual(actual: any, expected: any, message?: string): void {
    if (JSON.stringify(actual) !== JSON.stringify(expected)) {
      throw new Error(
        message ||
          `Expected ${JSON.stringify(actual)} to deep equal ${JSON.stringify(expected)}`
      );
    }
  }

  /**
   * 断言抛出错误
   */
  static assertThrows(
    fn: () => any,
    expectedError?: string | RegExp,
    message?: string
  ): void {
    let thrown = false;
    let error: Error | null = null;

    try {
      fn();
    } catch (e) {
      thrown = true;
      error = e as Error;
    }

    if (!thrown) {
      throw new Error(message || 'Expected function to throw an error');
    }

    if (expectedError) {
      const errorMessage = error?.message || '';
      const matches =
        typeof expectedError === 'string'
          ? errorMessage.includes(expectedError)
          : expectedError.test(errorMessage);

      if (!matches) {
        throw new Error(
          message || `Expected error message to match ${expectedError}`
        );
      }
    }
  }

  /**
   * 断言异步函数抛出错误
   */
  static async assertThrowsAsync(
    fn: () => Promise<unknown>,
    expectedError?: string | RegExp,
    message?: string
  ): Promise<void> {
    let thrown = false;
    let error: Error | null = null;

    try {
      await fn();
    } catch (e) {
      thrown = true;
      error = e as Error;
    }

    if (!thrown) {
      throw new Error(message || 'Expected async function to throw an error');
    }

    if (expectedError) {
      const errorMessage = error?.message || '';
      const matches =
        typeof expectedError === 'string'
          ? errorMessage.includes(expectedError)
          : expectedError.test(errorMessage);

      if (!matches) {
        throw new Error(
          message || `Expected error message to match ${expectedError}`
        );
      }
    }
  }
}

// 在开发环境中暴露到全局对象
if (process.env.NODE_ENV === 'development') {
  (window as unknown as Record<string, unknown>).testUtils = {
    TestDataGenerator,
    DOMTestUtils,
    ReactTestUtils,
    APIMockUtils,
    PerformanceTestUtils,
    AssertionUtils,
  };
}
