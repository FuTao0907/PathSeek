/**
 * 安全工具模块
 * 提供XSS防护、数据验证和安全相关功能
 */

/**
 * HTML 转义映射
 */
const HTML_ESCAPE_MAP: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#x27;',
  '/': '&#x2F;',
  '`': '&#x60;',
  '=': '&#x3D;',
};

/**
 * 转义 HTML 字符，防止 XSS 攻击
 */
export function escapeHtml(text: string): string {
  if (typeof text !== 'string') {
    return String(text);
  }

  return text.replace(/[&<>"'`=/]/g, match => HTML_ESCAPE_MAP[match] || match);
}

/**
 * 反转义 HTML 字符
 */
export function unescapeHtml(html: string): string {
  if (typeof html !== 'string') {
    return String(html);
  }

  const reverseMap: Record<string, string> = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#x27;': "'",
    '&#x2F;': '/',
    '&#x60;': '`',
    '&#x3D;': '=',
  };

  return html.replace(
    /&(?:amp|lt|gt|quot|#x27|#x2F|#x60|#x3D);/g,
    match => reverseMap[match] || match
  );
}

/**
 * 清理和验证 URL，防止 JavaScript 协议注入
 */
export function sanitizeUrl(url: string): string {
  if (typeof url !== 'string') {
    return '';
  }

  const trimmedUrl = url.trim().toLowerCase();

  // 检查危险协议
  const dangerousProtocols = [
    'javascript:',
    'data:',
    'vbscript:',
    'file:',
    'about:',
  ];

  for (const protocol of dangerousProtocols) {
    if (trimmedUrl.startsWith(protocol)) {
      return '';
    }
  }

  // 允许的协议
  const allowedProtocols = ['http:', 'https:', 'mailto:', 'tel:', 'ftp:'];
  const hasProtocol = allowedProtocols.some(protocol =>
    trimmedUrl.startsWith(protocol)
  );

  // 如果没有协议，假设是相对路径
  if (!hasProtocol && !trimmedUrl.startsWith('//')) {
    return url;
  }

  return hasProtocol ? url : '';
}

/**
 * 验证和清理文件名
 */
export function sanitizeFileName(fileName: string): string {
  if (!fileName) return '';

  // 移除危险字符
  let sanitized = fileName.replace(/[<>:"/\\|?*]/g, '');

  // 移除控制字符 (0-31)
  sanitized = sanitized
    .split('')
    .filter(char => char.charCodeAt(0) > 31)
    .join('');

  return sanitized
    .replace(/^(con|prn|aux|nul|com[0-9]|lpt[0-9])$/i, '')
    .replace(/^\.|\.$/, '')
    .trim()
    .substring(0, 255);
}

/**
 * 验证邮箱格式
 */
export function validateEmail(email: string): boolean {
  if (typeof email !== 'string') {
    return false;
  }

  const emailRegex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  return emailRegex.test(email) && email.length <= 254;
}

/**
 * 验证密码强度
 */
export interface PasswordStrength {
  score: number; // 0-4
  feedback: string[];
  isValid: boolean;
}

export function validatePasswordStrength(password: string): PasswordStrength {
  if (typeof password !== 'string') {
    return {
      score: 0,
      feedback: ['密码必须是字符串'],
      isValid: false,
    };
  }

  const feedback: string[] = [];
  let score = 0;

  // 长度检查
  if (password.length < 8) {
    feedback.push('密码长度至少需要8个字符');
  } else if (password.length >= 12) {
    score += 1;
  }

  // 包含小写字母
  if (/[a-z]/.test(password)) {
    score += 1;
  } else {
    feedback.push('密码应包含小写字母');
  }

  // 包含大写字母
  if (/[A-Z]/.test(password)) {
    score += 1;
  } else {
    feedback.push('密码应包含大写字母');
  }

  // 包含数字
  if (/\d/.test(password)) {
    score += 1;
  } else {
    feedback.push('密码应包含数字');
  }

  // 包含特殊字符
  if (/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) {
    score += 1;
  } else {
    feedback.push('密码应包含特殊字符');
  }

  // 检查常见弱密码
  const commonPasswords = [
    'password',
    '123456',
    'password123',
    'admin',
    'qwerty',
    '12345678',
    '123456789',
    'password1',
    'abc123',
    '111111',
  ];

  if (commonPasswords.includes(password.toLowerCase())) {
    feedback.push('请避免使用常见密码');
    score = Math.max(0, score - 2);
  }

  return {
    score: Math.min(4, score),
    feedback,
    isValid: score >= 3 && password.length >= 8,
  };
}

/**
 * 生成安全的随机字符串
 */
export function generateSecureToken(length = 32): string {
  const chars =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';

  // 使用 crypto.getRandomValues 如果可用
  if (
    typeof window !== 'undefined' &&
    window.crypto &&
    window.crypto.getRandomValues
  ) {
    const array = new Uint8Array(length);
    window.crypto.getRandomValues(array);

    for (let i = 0; i < length; i++) {
      result += chars[array[i]! % chars.length];
    }
  } else {
    // 回退到 Math.random
    for (let i = 0; i < length; i++) {
      result += chars[Math.floor(Math.random() * chars.length)];
    }
  }

  return result;
}

/**
 * 验证 JSON 数据
 */
export function validateJson(jsonString: string): {
  isValid: boolean;
  data?: any;
  error?: string;
} {
  try {
    const data = JSON.parse(jsonString);
    return { isValid: true, data };
  } catch (error) {
    return {
      isValid: false,
      error: error instanceof Error ? error.message : '无效的JSON格式',
    };
  }
}

/**
 * 深度清理对象，移除潜在的危险属性
 */
export function sanitizeObject(obj: any, maxDepth = 10): any {
  if (maxDepth <= 0) {
    return null;
  }

  if (obj === null || typeof obj !== 'object') {
    return typeof obj === 'string' ? escapeHtml(obj) : obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(item => sanitizeObject(item, maxDepth - 1));
  }

  const sanitized: any = {};
  const dangerousKeys = ['__proto__', 'constructor', 'prototype'];

  for (const [key, value] of Object.entries(obj)) {
    if (dangerousKeys.includes(key)) {
      continue;
    }

    const sanitizedKey = escapeHtml(key);
    sanitized[sanitizedKey] = sanitizeObject(value, maxDepth - 1);
  }

  return sanitized;
}

/**
 * 内容安全策略 (CSP) 助手
 */
export const CSP = {
  /**
   * 生成 CSP nonce
   */
  generateNonce(): string {
    return generateSecureToken(16);
  },

  /**
   * 创建 CSP 头部
   */
  createHeader(
    options: {
      defaultSrc?: string[];
      scriptSrc?: string[];
      styleSrc?: string[];
      imgSrc?: string[];
      connectSrc?: string[];
      fontSrc?: string[];
      objectSrc?: string[];
      mediaSrc?: string[];
      frameSrc?: string[];
    } = {}
  ): string {
    const directives: string[] = [];

    const defaultOptions = {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", 'data:', 'https:'],
      connectSrc: ["'self'"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
    };

    const mergedOptions = { ...defaultOptions, ...options };

    for (const [directive, sources] of Object.entries(mergedOptions)) {
      if (sources && sources.length > 0) {
        const directiveName = directive
          .replace(/([A-Z])/g, '-$1')
          .toLowerCase();
        directives.push(`${directiveName} ${sources.join(' ')}`);
      }
    }

    return directives.join('; ');
  },
};

/**
 * 速率限制器
 */
export class RateLimiter {
  private requests: Map<string, number[]> = new Map();
  private maxRequests: number;
  private windowMs: number;

  constructor(maxRequests = 100, windowMs = 60000) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
  }

  /**
   * 检查是否允许请求
   */
  isAllowed(identifier: string): boolean {
    const now = Date.now();
    const requests = this.requests.get(identifier) || [];

    // 清理过期的请求记录
    const validRequests = requests.filter(time => now - time < this.windowMs);

    if (validRequests.length >= this.maxRequests) {
      return false;
    }

    validRequests.push(now);
    this.requests.set(identifier, validRequests);

    return true;
  }

  /**
   * 获取剩余请求次数
   */
  getRemainingRequests(identifier: string): number {
    const now = Date.now();
    const requests = this.requests.get(identifier) || [];
    const validRequests = requests.filter(time => now - time < this.windowMs);

    return Math.max(0, this.maxRequests - validRequests.length);
  }

  /**
   * 重置特定标识符的限制
   */
  reset(identifier: string): void {
    this.requests.delete(identifier);
  }

  /**
   * 清理所有过期记录
   */
  cleanup(): void {
    const now = Date.now();

    this.requests.forEach((requests, identifier) => {
      const validRequests = requests.filter(time => now - time < this.windowMs);

      if (validRequests.length === 0) {
        this.requests.delete(identifier);
      } else {
        this.requests.set(identifier, validRequests);
      }
    });
  }
}

// 创建默认的速率限制器实例
export const defaultRateLimiter = new RateLimiter();

// 定期清理过期记录
if (typeof window !== 'undefined') {
  setInterval(() => {
    defaultRateLimiter.cleanup();
  }, 60000); // 每分钟清理一次
}
