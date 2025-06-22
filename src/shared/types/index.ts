// 通用类型定义
export interface BaseProps {
  className?: string;
  children?: React.ReactNode;
}

// 加载组件类型
export interface LoadingProps extends BaseProps {
  size?: 'small' | 'medium' | 'large';
  text?: string;
}

// 文章类型
export interface Post {
  id: string;
  title: string;
  content: string;
  excerpt?: string;
  author: string;
  publishedAt: Date;
  updatedAt?: Date;
  tags?: string[];
  category?: string;
  featured?: boolean;
}

// API 响应类型
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// 分页类型
export interface PaginationParams {
  page: number;
  limit: number;
  total?: number;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: PaginationParams;
}

// 表单验证类型
export interface ValidationError {
  field: string;
  message: string;
}

export interface FormState<T = any> {
  data: T;
  errors: ValidationError[];
  isSubmitting: boolean;
  isValid: boolean;
}

// 主题类型
export type Theme = 'light' | 'dark' | 'auto';

// 语言类型
export type Language = 'zh' | 'en';

// 用户类型
export interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  role: 'admin' | 'editor' | 'user';
  createdAt: Date;
  lastLoginAt?: Date;
}

// 搜索类型
export interface SearchParams {
  query: string;
  category?: string;
  tags?: string[];
  dateRange?: {
    start: Date;
    end: Date;
  };
}

// 配置类型
export interface AppConfig {
  siteName: string;
  siteDescription: string;
  theme: Theme;
  language: Language;
  postsPerPage: number;
  enableComments: boolean;
  enableSearch: boolean;
}