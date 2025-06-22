import { Post, ValidationError } from '../types';

// 字符串工具函数
export const stringUtils = {
  // 截断文本
  truncate: (text: string, length: number, suffix = '...'): string => {
    if (text.length <= length) return text;
    return text.substring(0, length).trim() + suffix;
  },

  // 首字母大写
  capitalize: (text: string): string => {
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  },

  // 转换为 slug
  slugify: (text: string): string => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '') // 移除特殊字符
      .replace(/[\s_-]+/g, '-') // 替换空格和下划线为连字符
      .replace(/^-+|-+$/g, ''); // 移除开头和结尾的连字符
  },

  // 移除 HTML 标签
  stripHtml: (html: string): string => {
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  },

  // 高亮搜索关键词
  highlightText: (text: string, query: string): string => {
    if (!query.trim()) return text;
    const regex = new RegExp(`(${query})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
  },
};

// 日期工具函数
export const dateUtils = {
  // 格式化日期
  format: (date: Date | string, locale = 'zh-CN'): string => {
    const d = new Date(date);
    return d.toLocaleDateString(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  },

  // 相对时间
  timeAgo: (date: Date | string): string => {
    const now = new Date();
    const past = new Date(date);
    const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);

    const intervals = {
      年: 31536000,
      月: 2592000,
      周: 604800,
      天: 86400,
      小时: 3600,
      分钟: 60,
    };

    for (const [unit, seconds] of Object.entries(intervals)) {
      const interval = Math.floor(diffInSeconds / seconds);
      if (interval >= 1) {
        return `${interval}${unit}前`;
      }
    }

    return '刚刚';
  },

  // 检查是否为今天
  isToday: (date: Date | string): boolean => {
    const today = new Date();
    const checkDate = new Date(date);
    return (
      today.getDate() === checkDate.getDate() &&
      today.getMonth() === checkDate.getMonth() &&
      today.getFullYear() === checkDate.getFullYear()
    );
  },

  // 检查是否为本周
  isThisWeek: (date: Date | string): boolean => {
    const today = new Date();
    const checkDate = new Date(date);
    const startOfWeek = new Date(
      today.setDate(today.getDate() - today.getDay())
    );
    const endOfWeek = new Date(
      today.setDate(today.getDate() - today.getDay() + 6)
    );
    return checkDate >= startOfWeek && checkDate <= endOfWeek;
  },
};

// 数组工具函数
export const arrayUtils = {
  // 去重
  unique: <T>(array: T[]): T[] => {
    return Array.from(new Set(array));
  },

  // 分组
  groupBy: <T, K extends keyof T>(array: T[], key: K): Record<string, T[]> => {
    return array.reduce(
      (groups, item) => {
        const group = String(item[key]);
        if (!groups[group]) {
          groups[group] = [];
        }
        groups[group]!.push(item);
        return groups;
      },
      {} as Record<string, T[]>
    );
  },

  // 随机排序
  shuffle: <T>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = shuffled[i]!;
      shuffled[i] = shuffled[j]!;
      shuffled[j] = temp;
    }
    return shuffled;
  },

  // 分页
  paginate: <T>(array: T[], page: number, limit: number): T[] => {
    const startIndex = (page - 1) * limit;
    return array.slice(startIndex, startIndex + limit);
  },
};

// 对象工具函数
export const objectUtils = {
  // 深拷贝
  deepClone: <T>(obj: T): T => {
    if (obj === null || typeof obj !== 'object') return obj;
    if (obj instanceof Date) return new Date(obj.getTime()) as unknown as T;
    if (obj instanceof Array)
      return obj.map(item => objectUtils.deepClone(item)) as unknown as T;
    if (typeof obj === 'object') {
      const clonedObj = {} as T;
      for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          clonedObj[key] = objectUtils.deepClone(obj[key]);
        }
      }
      return clonedObj;
    }
    return obj;
  },

  // 深度合并
  deepMerge: <T extends Record<string, any>>(
    target: T,
    source: Partial<T>
  ): T => {
    const result = { ...target };
    for (const key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        if (
          typeof source[key] === 'object' &&
          source[key] !== null &&
          !Array.isArray(source[key])
        ) {
          result[key] = objectUtils.deepMerge(
            result[key] || ({} as any),
            source[key] as any
          ) as any;
        } else {
          result[key] = source[key] as any;
        }
      }
    }
    return result;
  },

  // 选择对象属性
  pick: <T extends object, K extends keyof T>(
    obj: T,
    keys: K[]
  ): Pick<T, K> => {
    const result = {} as Pick<T, K>;
    keys.forEach(key => {
      if (key in obj) {
        result[key] = obj[key];
      }
    });
    return result;
  },

  // 排除对象属性
  omit: <T, K extends keyof T>(obj: T, keys: K[]): Omit<T, K> => {
    const result = { ...obj };
    keys.forEach(key => {
      delete result[key];
    });
    return result;
  },
};

// 验证工具函数
export const validationUtils = {
  // 邮箱验证
  isEmail: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  // URL 验证
  isUrl: (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  },

  // 手机号验证（中国）
  isPhoneNumber: (phone: string): boolean => {
    const phoneRegex = /^1[3-9]\d{9}$/;
    return phoneRegex.test(phone);
  },

  // 密码强度验证
  isStrongPassword: (password: string): boolean => {
    // 至少8位，包含大小写字母、数字和特殊字符
    const strongPasswordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return strongPasswordRegex.test(password);
  },

  // 表单验证器
  validateForm: <T extends Record<string, any>>(
    data: T,
    rules: Record<keyof T, (value: any) => string | null>
  ): ValidationError[] => {
    const errors: ValidationError[] = [];

    for (const field in rules) {
      const error = rules[field](data[field]);
      if (error) {
        errors.push({ field: String(field), message: error });
      }
    }

    return errors;
  },
};

// 性能工具函数
export const performanceUtils = {
  // 防抖
  debounce: <T extends (...args: any[]) => any>(
    func: T,
    wait: number
  ): ((...args: Parameters<T>) => void) => {
    let timeout: NodeJS.Timeout;
    return (...args: Parameters<T>) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  },

  // 节流
  throttle: <T extends (...args: any[]) => any>(
    func: T,
    limit: number
  ): ((...args: Parameters<T>) => void) => {
    let inThrottle: boolean;
    return (...args: Parameters<T>) => {
      if (!inThrottle) {
        func(...args);
        inThrottle = true;
        setTimeout(() => (inThrottle = false), limit);
      }
    };
  },

  // 延迟执行
  delay: (ms: number): Promise<void> => {
    return new Promise(resolve => setTimeout(resolve, ms));
  },

  // 测量执行时间
  measureTime: async <T>(
    fn: () => Promise<T> | T
  ): Promise<{ result: T; time: number }> => {
    const start = performance.now();
    const result = await fn();
    const time = performance.now() - start;
    return { result, time };
  },
};

// 文件工具函数
export const fileUtils = {
  // 格式化文件大小
  formatFileSize: (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  },

  // 获取文件扩展名
  getFileExtension: (filename: string): string => {
    return filename.slice(((filename.lastIndexOf('.') - 1) >>> 0) + 2);
  },

  // 检查文件类型
  isImageFile: (filename: string): boolean => {
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'];
    const extension = fileUtils.getFileExtension(filename).toLowerCase();
    return imageExtensions.includes(extension);
  },

  // 读取文件为 Base64
  readFileAsBase64: (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  },
};

// 搜索和过滤工具
export const searchUtils = {
  // 模糊搜索
  fuzzySearch: <T>(items: T[], query: string, keys: (keyof T)[]): T[] => {
    if (!query.trim()) return items;

    const searchTerms = query
      .toLowerCase()
      .split(' ')
      .filter(term => term.length > 0);

    return items.filter(item => {
      return searchTerms.every(term => {
        return keys.some(key => {
          const value = String(item[key]).toLowerCase();
          return value.includes(term);
        });
      });
    });
  },

  // 高亮搜索结果
  highlightMatches: (text: string, query: string): string => {
    if (!query.trim()) return text;

    const searchTerms = query.split(' ').filter(term => term.length > 0);
    let highlightedText = text;

    searchTerms.forEach(term => {
      const regex = new RegExp(`(${term})`, 'gi');
      highlightedText = highlightedText.replace(regex, '<mark>$1</mark>');
    });

    return highlightedText;
  },

  // 文章搜索
  searchPosts: (posts: Post[], query: string): Post[] => {
    return searchUtils.fuzzySearch(posts, query, [
      'title',
      'content',
      'excerpt',
      'author',
    ]);
  },
};

// 导出所有工具函数
export const utils = {
  string: stringUtils,
  date: dateUtils,
  array: arrayUtils,
  object: objectUtils,
  validation: validationUtils,
  performance: performanceUtils,
  file: fileUtils,
  search: searchUtils,
};

export default utils;
