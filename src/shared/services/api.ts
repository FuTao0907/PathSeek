import {
  ApiResponse,
  AppConfig,
  PaginatedResponse,
  Post,
  SearchParams,
  User,
} from '../types';

// API 基础配置
const API_BASE_URL = process.env.REACT_APP_API_URL || '/api';
const DEFAULT_TIMEOUT = 10000;

// HTTP 状态码
const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
} as const;

// 请求配置接口
interface RequestConfig extends RequestInit {
  timeout?: number | undefined;
  baseURL?: string | undefined;
}

// 错误类
class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public response?: Response
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// HTTP 客户端类
class HttpClient {
  private baseURL: string;
  private defaultTimeout: number;
  private defaultHeaders: Record<string, string>;

  constructor(
    baseURL: string = API_BASE_URL,
    timeout: number = DEFAULT_TIMEOUT
  ) {
    this.baseURL = baseURL;
    this.defaultTimeout = timeout;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    };
  }

  // 设置认证令牌
  setAuthToken(token: string) {
    this.defaultHeaders['Authorization'] = `Bearer ${token}`;
  }

  // 移除认证令牌
  removeAuthToken() {
    delete this.defaultHeaders['Authorization'];
  }

  // 创建请求URL
  private createURL(endpoint: string, baseURL?: string): string {
    const base = baseURL || this.baseURL;
    return endpoint.startsWith('http') ? endpoint : `${base}${endpoint}`;
  }

  // 处理超时
  private createTimeoutPromise(timeout: number): Promise<never> {
    return new Promise((_, reject) => {
      setTimeout(() => {
        reject(new ApiError('Request timeout', 0));
      }, timeout);
    });
  }

  // 处理响应
  private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    const contentType = response.headers.get('content-type');
    const isJson = contentType?.includes('application/json');

    let data: any;
    try {
      data = isJson ? await response.json() : await response.text();
    } catch (error) {
      throw new ApiError('Failed to parse response', response.status, response);
    }

    if (!response.ok) {
      const message = data?.message || data?.error || `HTTP ${response.status}`;
      throw new ApiError(message, response.status, response);
    }

    // 如果响应已经是 ApiResponse 格式，直接返回
    if (data && typeof data === 'object' && 'success' in data) {
      return data;
    }

    // 否则包装成 ApiResponse 格式
    return {
      success: true,
      data,
      message: 'Success',
    };
  }

  // 通用请求方法
  private async request<T>(
    endpoint: string,
    config: RequestConfig = {}
  ): Promise<ApiResponse<T>> {
    const {
      timeout = this.defaultTimeout,
      baseURL,
      headers = {},
      ...restConfig
    } = config;

    const url = this.createURL(endpoint, baseURL);
    const requestHeaders = { ...this.defaultHeaders, ...headers };

    const fetchPromise = fetch(url, {
      ...restConfig,
      headers: requestHeaders,
    });

    const timeoutPromise = this.createTimeoutPromise(timeout);

    try {
      const response = await Promise.race([fetchPromise, timeoutPromise]);
      return await this.handleResponse<T>(response);
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(
        error instanceof Error ? error.message : 'Network error',
        0
      );
    }
  }

  // GET 请求
  async get<T>(
    endpoint: string,
    config?: RequestConfig
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...config, method: 'GET' });
  }

  // POST 请求
  async post<T>(
    endpoint: string,
    data?: any,
    config?: RequestConfig
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...config,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    } as RequestConfig);
  }

  // PUT 请求
  async put<T>(
    endpoint: string,
    data?: any,
    config?: RequestConfig
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...config,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    } as RequestConfig);
  }

  // PATCH 请求
  async patch<T>(
    endpoint: string,
    data?: any,
    config?: RequestConfig
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...config,
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    } as RequestConfig);
  }

  // DELETE 请求
  async delete<T>(
    endpoint: string,
    config?: RequestConfig
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...config, method: 'DELETE' });
  }

  // 上传文件
  async upload<T>(
    endpoint: string,
    file: File,
    config?: Omit<RequestConfig, 'headers'>
  ): Promise<ApiResponse<T>> {
    const formData = new FormData();
    formData.append('file', file);

    const headers = { ...this.defaultHeaders };
    delete headers['Content-Type']; // 让浏览器自动设置 multipart/form-data

    return this.request<T>(endpoint, {
      ...config,
      method: 'POST',
      headers,
      body: formData,
    });
  }
}

// 创建 HTTP 客户端实例
const httpClient = new HttpClient();

// API 服务类
class ApiService {
  private http: HttpClient;

  constructor(httpClient: HttpClient) {
    this.http = httpClient;
  }

  // 认证相关
  auth = {
    login: (credentials: { email: string; password: string }) =>
      this.http.post<{ user: User; token: string }>('/auth/login', credentials),

    register: (userData: {
      username: string;
      email: string;
      password: string;
    }) =>
      this.http.post<{ user: User; token: string }>('/auth/register', userData),

    logout: () => this.http.post('/auth/logout'),

    refreshToken: () => this.http.post<{ token: string }>('/auth/refresh'),

    forgotPassword: (email: string) =>
      this.http.post('/auth/forgot-password', { email }),

    resetPassword: (token: string, password: string) =>
      this.http.post('/auth/reset-password', { token, password }),
  };

  // 用户相关
  users = {
    getProfile: () => this.http.get<User>('/users/profile'),

    updateProfile: (userData: Partial<User>) =>
      this.http.put<User>('/users/profile', userData),

    changePassword: (data: { currentPassword: string; newPassword: string }) =>
      this.http.post('/users/change-password', data),

    uploadAvatar: (file: File) =>
      this.http.upload<{ avatarUrl: string }>('/users/avatar', file),
  };

  // 文章相关
  posts = {
    getAll: (params?: {
      page?: number;
      limit?: number;
      category?: string;
      tag?: string;
    }) => {
      const searchParams = new URLSearchParams();
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined) {
            searchParams.append(key, String(value));
          }
        });
      }
      const query = searchParams.toString();
      return this.http.get<PaginatedResponse<Post>>(
        `/posts${query ? `?${query}` : ''}`
      );
    },

    getById: (id: string) => this.http.get<Post>(`/posts/${id}`),

    create: (postData: Omit<Post, 'id' | 'publishedAt' | 'updatedAt'>) =>
      this.http.post<Post>('/posts', postData),

    update: (id: string, postData: Partial<Post>) =>
      this.http.put<Post>(`/posts/${id}`, postData),

    delete: (id: string) => this.http.delete(`/posts/${id}`),

    search: (params: SearchParams) =>
      this.http.post<Post[]>('/posts/search', params),

    getFeatured: () => this.http.get<Post[]>('/posts/featured'),

    getByCategory: (
      category: string,
      params?: { page?: number; limit?: number }
    ) => {
      const searchParams = new URLSearchParams({ category });
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined) {
            searchParams.append(key, String(value));
          }
        });
      }
      return this.http.get<PaginatedResponse<Post>>(
        `/posts/category?${searchParams.toString()}`
      );
    },

    getByTag: (tag: string, params?: { page?: number; limit?: number }) => {
      const searchParams = new URLSearchParams({ tag });
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined) {
            searchParams.append(key, String(value));
          }
        });
      }
      return this.http.get<PaginatedResponse<Post>>(
        `/posts/tag?${searchParams.toString()}`
      );
    },
  };

  // 分类和标签
  taxonomy = {
    getCategories: () => this.http.get<string[]>('/categories'),
    getTags: () => this.http.get<string[]>('/tags'),
    getPopularTags: (limit = 10) =>
      this.http.get<string[]>(`/tags/popular?limit=${limit}`),
  };

  // 文件上传
  files = {
    upload: (file: File, type: 'image' | 'document' = 'image') =>
      this.http.upload<{ url: string; filename: string }>(
        `/files/upload?type=${type}`,
        file
      ),

    delete: (filename: string) => this.http.delete(`/files/${filename}`),
  };

  // 系统配置
  config = {
    get: () => this.http.get<AppConfig>('/config'),
    update: (config: Partial<AppConfig>) =>
      this.http.put<AppConfig>('/config', config),
  };

  // 统计数据
  stats = {
    getOverview: () => this.http.get('/stats/overview'),
    getPostStats: (period: 'week' | 'month' | 'year' = 'month') =>
      this.http.get(`/stats/posts?period=${period}`),
    getUserStats: () => this.http.get('/stats/users'),
  };
}

// 创建 API 服务实例
const apiService = new ApiService(httpClient);

// 设置请求拦截器（用于添加认证令牌）
const setupAuthInterceptor = () => {
  const token = localStorage.getItem('authToken');
  if (token) {
    httpClient.setAuthToken(token);
  }
};

// 设置响应拦截器（用于处理认证失败）
const setupResponseInterceptor = () => {
  // 这里可以添加全局错误处理逻辑
  // 例如：当收到 401 错误时，自动跳转到登录页面
};

// 初始化拦截器
setupAuthInterceptor();
setupResponseInterceptor();

// 导出
export { ApiError, HTTP_STATUS, HttpClient };
export default apiService;
export { httpClient };
