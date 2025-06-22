import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useMemo,
  ReactNode,
} from 'react';
import { User, Theme, Language, Post, AppConfig } from '@/shared/types';
import { useLocalStorage } from '@/shared/hooks';
import apiService from '@/shared/services/api';

// 应用状态接口
interface AppState {
  // 用户状态
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  // 主题和语言
  theme: Theme;
  language: Language;

  // 文章数据
  posts: Post[];
  featuredPosts: Post[];
  currentPost: Post | null;

  // UI 状态
  sidebarOpen: boolean;
  searchQuery: string;
  searchResults: Post[];

  // 应用配置
  config: AppConfig | null;

  // 错误状态
  error: string | null;

  // 通知状态
  notifications: Notification[];
}

// 通知接口
interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
  timestamp: Date;
}

// 动作类型
type AppAction =
  // 用户相关动作
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_AUTHENTICATED'; payload: boolean }

  // 主题和语言
  | { type: 'SET_THEME'; payload: Theme }
  | { type: 'SET_LANGUAGE'; payload: Language }

  // 文章相关动作
  | { type: 'SET_POSTS'; payload: Post[] }
  | { type: 'ADD_POST'; payload: Post }
  | { type: 'UPDATE_POST'; payload: Post }
  | { type: 'DELETE_POST'; payload: string }
  | { type: 'SET_FEATURED_POSTS'; payload: Post[] }
  | { type: 'SET_CURRENT_POST'; payload: Post | null }

  // UI 状态
  | { type: 'TOGGLE_SIDEBAR' }
  | { type: 'SET_SIDEBAR_OPEN'; payload: boolean }
  | { type: 'SET_SEARCH_QUERY'; payload: string }
  | { type: 'SET_SEARCH_RESULTS'; payload: Post[] }

  // 配置
  | { type: 'SET_CONFIG'; payload: AppConfig }

  // 错误处理
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'CLEAR_ERROR' }

  // 通知
  | {
      type: 'ADD_NOTIFICATION';
      payload: Omit<Notification, 'id' | 'timestamp'>;
    }
  | { type: 'REMOVE_NOTIFICATION'; payload: string }
  | { type: 'CLEAR_NOTIFICATIONS' };

// 初始状态
const initialState: AppState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  theme: 'auto',
  language: 'zh',
  posts: [],
  featuredPosts: [],
  currentPost: null,
  sidebarOpen: false,
  searchQuery: '',
  searchResults: [],
  config: null,
  error: null,
  notifications: [],
};

// Reducer 函数
function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    // 用户相关
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_AUTHENTICATED':
      return { ...state, isAuthenticated: action.payload };

    // 主题和语言
    case 'SET_THEME':
      return { ...state, theme: action.payload };
    case 'SET_LANGUAGE':
      return { ...state, language: action.payload };

    // 文章相关
    case 'SET_POSTS':
      return { ...state, posts: action.payload };
    case 'ADD_POST':
      return { ...state, posts: [action.payload, ...state.posts] };
    case 'UPDATE_POST':
      return {
        ...state,
        posts: state.posts.map(post =>
          post.id === action.payload.id ? action.payload : post
        ),
      };
    case 'DELETE_POST':
      return {
        ...state,
        posts: state.posts.filter(post => post.id !== action.payload),
      };
    case 'SET_FEATURED_POSTS':
      return { ...state, featuredPosts: action.payload };
    case 'SET_CURRENT_POST':
      return { ...state, currentPost: action.payload };

    // UI 状态
    case 'TOGGLE_SIDEBAR':
      return { ...state, sidebarOpen: !state.sidebarOpen };
    case 'SET_SIDEBAR_OPEN':
      return { ...state, sidebarOpen: action.payload };
    case 'SET_SEARCH_QUERY':
      return { ...state, searchQuery: action.payload };
    case 'SET_SEARCH_RESULTS':
      return { ...state, searchResults: action.payload };

    // 配置
    case 'SET_CONFIG':
      return { ...state, config: action.payload };

    // 错误处理
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'CLEAR_ERROR':
      return { ...state, error: null };

    // 通知
    case 'ADD_NOTIFICATION': {
      const newNotification: Notification = {
        ...action.payload,
        id: Date.now().toString(),
        timestamp: new Date(),
      };
      return {
        ...state,
        notifications: [...state.notifications, newNotification],
      };
    }
    case 'REMOVE_NOTIFICATION':
      return {
        ...state,
        notifications: state.notifications.filter(n => n.id !== action.payload),
      };
    case 'CLEAR_NOTIFICATIONS':
      return { ...state, notifications: [] };

    default:
      return state;
  }
}

// Context 接口
interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;

  // 便捷方法
  actions: {
    // 用户操作
    login: (credentials: { email: string; password: string }) => Promise<void>;
    logout: () => Promise<void>;
    updateProfile: (userData: Partial<User>) => Promise<void>;

    // 文章操作
    loadPosts: (params?: { page?: number; limit?: number }) => Promise<void>;
    loadFeaturedPosts: () => Promise<void>;
    createPost: (
      postData: Omit<Post, 'id' | 'publishedAt' | 'updatedAt'>
    ) => Promise<void>;
    updatePost: (id: string, postData: Partial<Post>) => Promise<void>;
    deletePost: (id: string) => Promise<void>;
    searchPosts: (query: string) => Promise<void>;

    // UI 操作
    toggleSidebar: () => void;
    setSidebarOpen: (open: boolean) => void;
    setTheme: (theme: Theme) => void;
    setLanguage: (language: Language) => void;

    // 通知操作
    showNotification: (
      notification: Omit<Notification, 'id' | 'timestamp'>
    ) => void;
    hideNotification: (id: string) => void;
    clearNotifications: () => void;

    // 错误处理
    setError: (error: string | null) => void;
    clearError: () => void;
  };
}

// 创建 Context
const AppContext = createContext<AppContextType | undefined>(undefined);

// Provider 组件属性
interface AppProviderProps {
  children: ReactNode;
}

// Provider 组件
export function AppProvider({ children }: AppProviderProps) {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const [storedTheme, setStoredTheme] = useLocalStorage<Theme>('theme', 'auto');
  const [storedLanguage, setStoredLanguage] = useLocalStorage<Language>(
    'language',
    'zh'
  );

  // 初始化应用
  useEffect(() => {
    const initializeApp = async () => {
      dispatch({ type: 'SET_LOADING', payload: true });

      try {
        // 设置主题和语言
        dispatch({ type: 'SET_THEME', payload: storedTheme });
        dispatch({ type: 'SET_LANGUAGE', payload: storedLanguage });

        // 检查认证状态
        const token = localStorage.getItem('authToken');
        if (token) {
          try {
            const response = await apiService.users.getProfile();
            if (response.success && response.data) {
              dispatch({ type: 'SET_USER', payload: response.data });
              dispatch({ type: 'SET_AUTHENTICATED', payload: true });
            }
          } catch (error) {
            // 令牌无效，清除本地存储
            localStorage.removeItem('authToken');
          }
        }

        // 加载应用配置
        try {
          const configResponse = await apiService.config.get();
          if (configResponse.success && configResponse.data) {
            // 确保配置数据包含所有必需字段
            const responseData = configResponse.data as Partial<AppConfig>;
            const config: AppConfig = {
              siteName: responseData.siteName || 'Path Seek',
              siteDescription:
                responseData.siteDescription || 'A modern blog platform',
              theme: responseData.theme || 'auto',
              language: responseData.language || 'zh',
              postsPerPage: responseData.postsPerPage || 10,
              enableComments: responseData.enableComments ?? true,
              enableSearch: responseData.enableSearch ?? true,
            };
            dispatch({ type: 'SET_CONFIG', payload: config });
          }
        } catch (error) {
          console.warn('Failed to load app config:', error);
        }

        // 加载初始数据将在 actions 定义后单独处理
      } catch (error) {
        console.error('App initialization error:', error);
        dispatch({ type: 'SET_ERROR', payload: '应用初始化失败' });
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    initializeApp();
  }, [storedTheme, storedLanguage]);

  // 便捷操作方法
  const actions = useMemo(
    () => ({
      // 用户操作
      login: async (credentials: { email: string; password: string }) => {
        dispatch({ type: 'SET_LOADING', payload: true });
        try {
          const response = await apiService.auth.login(credentials);
          if (response.success && response.data) {
            const { user, token } = response.data;
            localStorage.setItem('authToken', token);
            dispatch({ type: 'SET_USER', payload: user });
            dispatch({ type: 'SET_AUTHENTICATED', payload: true });
            actions.showNotification({
              type: 'success',
              title: '登录成功',
              message: `欢迎回来，${user.username}！`,
            });
          }
        } catch (error) {
          const message = error instanceof Error ? error.message : '登录失败';
          dispatch({ type: 'SET_ERROR', payload: message });
          actions.showNotification({
            type: 'error',
            title: '登录失败',
            message,
          });
        } finally {
          dispatch({ type: 'SET_LOADING', payload: false });
        }
      },

      logout: async () => {
        try {
          await apiService.auth.logout();
        } catch (error) {
          console.warn('Logout API call failed:', error);
        } finally {
          localStorage.removeItem('authToken');
          dispatch({ type: 'SET_USER', payload: null });
          dispatch({ type: 'SET_AUTHENTICATED', payload: false });
          actions.showNotification({
            type: 'info',
            title: '已退出登录',
            message: '您已成功退出登录',
          });
        }
      },

      updateProfile: async (userData: Partial<User>) => {
        try {
          const response = await apiService.users.updateProfile(userData);
          if (response.success && response.data) {
            dispatch({ type: 'SET_USER', payload: response.data });
            actions.showNotification({
              type: 'success',
              title: '更新成功',
              message: '个人资料已更新',
            });
          }
        } catch (error) {
          const message = error instanceof Error ? error.message : '更新失败';
          actions.showNotification({
            type: 'error',
            title: '更新失败',
            message,
          });
        }
      },

      // 文章操作
      loadPosts: async (params?: { page?: number; limit?: number }) => {
        try {
          const response = await apiService.posts.getAll(params);
          if (response.success && response.data) {
            dispatch({ type: 'SET_POSTS', payload: response.data.data || [] });
          }
        } catch (error) {
          console.error('Failed to load posts:', error);
        }
      },

      loadFeaturedPosts: async () => {
        try {
          const response = await apiService.posts.getFeatured();
          if (response.success && response.data) {
            dispatch({ type: 'SET_FEATURED_POSTS', payload: response.data });
          }
        } catch (error) {
          console.error('Failed to load featured posts:', error);
        }
      },

      createPost: async (
        postData: Omit<Post, 'id' | 'publishedAt' | 'updatedAt'>
      ) => {
        try {
          const response = await apiService.posts.create(postData);
          if (response.success && response.data) {
            dispatch({ type: 'ADD_POST', payload: response.data });
            actions.showNotification({
              type: 'success',
              title: '发布成功',
              message: '文章已成功发布',
            });
          }
        } catch (error) {
          const message = error instanceof Error ? error.message : '发布失败';
          actions.showNotification({
            type: 'error',
            title: '发布失败',
            message,
          });
        }
      },

      updatePost: async (id: string, postData: Partial<Post>) => {
        try {
          const response = await apiService.posts.update(id, postData);
          if (response.success && response.data) {
            dispatch({ type: 'UPDATE_POST', payload: response.data });
            actions.showNotification({
              type: 'success',
              title: '更新成功',
              message: '文章已更新',
            });
          }
        } catch (error) {
          const message = error instanceof Error ? error.message : '更新失败';
          actions.showNotification({
            type: 'error',
            title: '更新失败',
            message,
          });
        }
      },

      deletePost: async (id: string) => {
        try {
          const response = await apiService.posts.delete(id);
          if (response.success) {
            dispatch({ type: 'DELETE_POST', payload: id });
            actions.showNotification({
              type: 'success',
              title: '删除成功',
              message: '文章已删除',
            });
          }
        } catch (error) {
          const message = error instanceof Error ? error.message : '删除失败';
          actions.showNotification({
            type: 'error',
            title: '删除失败',
            message,
          });
        }
      },

      searchPosts: async (query: string) => {
        dispatch({ type: 'SET_SEARCH_QUERY', payload: query });
        if (!query.trim()) {
          dispatch({ type: 'SET_SEARCH_RESULTS', payload: [] });
          return;
        }

        try {
          const response = await apiService.posts.search({ query });
          if (response.success && response.data) {
            dispatch({ type: 'SET_SEARCH_RESULTS', payload: response.data });
          }
        } catch (error) {
          console.error('Search failed:', error);
          dispatch({ type: 'SET_SEARCH_RESULTS', payload: [] });
        }
      },

      // UI 操作
      toggleSidebar: () => {
        dispatch({ type: 'TOGGLE_SIDEBAR' });
      },

      setSidebarOpen: (open: boolean) => {
        dispatch({ type: 'SET_SIDEBAR_OPEN', payload: open });
      },

      setTheme: (theme: Theme) => {
        dispatch({ type: 'SET_THEME', payload: theme });
        setStoredTheme(theme);
      },

      setLanguage: (language: Language) => {
        dispatch({ type: 'SET_LANGUAGE', payload: language });
        setStoredLanguage(language);
      },

      // 通知操作
      showNotification: (
        notification: Omit<Notification, 'id' | 'timestamp'>
      ) => {
        dispatch({ type: 'ADD_NOTIFICATION', payload: notification });

        // 自动移除通知
        const duration = notification.duration || 5000;
        setTimeout(() => {
          // 这里需要获取最新的通知ID，但由于闭包问题，我们使用一个简单的方法
          // 在实际应用中，可能需要更复杂的逻辑
        }, duration);
      },

      hideNotification: (id: string) => {
        dispatch({ type: 'REMOVE_NOTIFICATION', payload: id });
      },

      clearNotifications: () => {
        dispatch({ type: 'CLEAR_NOTIFICATIONS' });
      },

      // 错误处理
      setError: (error: string | null) => {
        dispatch({ type: 'SET_ERROR', payload: error });
      },

      clearError: () => {
        dispatch({ type: 'CLEAR_ERROR' });
      },
    }),
    [dispatch, setStoredLanguage, setStoredTheme]
  );

  // 加载初始数据
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        await actions.loadPosts({ page: 1, limit: 10 });
        await actions.loadFeaturedPosts();
      } catch (error) {
        console.error('Failed to load initial data:', error);
      }
    };

    // 只在应用初始化完成后加载数据
    if (!state.isLoading) {
      loadInitialData();
    }
  }, [state.isLoading, actions]);

  const contextValue: AppContextType = {
    state,
    dispatch,
    actions,
  };

  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  );
}

// Hook 用于使用 Context
export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}

// 便捷 Hooks
export function useAuth() {
  const { state, actions } = useAppContext();
  return {
    user: state.user,
    isAuthenticated: state.isAuthenticated,
    isLoading: state.isLoading,
    login: actions.login,
    logout: actions.logout,
    updateProfile: actions.updateProfile,
  };
}

export function usePosts() {
  const { state, actions } = useAppContext();
  return {
    posts: state.posts,
    featuredPosts: state.featuredPosts,
    currentPost: state.currentPost,
    searchResults: state.searchResults,
    searchQuery: state.searchQuery,
    loadPosts: actions.loadPosts,
    loadFeaturedPosts: actions.loadFeaturedPosts,
    createPost: actions.createPost,
    updatePost: actions.updatePost,
    deletePost: actions.deletePost,
    searchPosts: actions.searchPosts,
  };
}

export function useUI() {
  const { state, actions } = useAppContext();
  return {
    theme: state.theme,
    language: state.language,
    sidebarOpen: state.sidebarOpen,
    error: state.error,
    notifications: state.notifications,
    setTheme: actions.setTheme,
    setLanguage: actions.setLanguage,
    toggleSidebar: actions.toggleSidebar,
    setSidebarOpen: actions.setSidebarOpen,
    showNotification: actions.showNotification,
    hideNotification: actions.hideNotification,
    clearNotifications: actions.clearNotifications,
    setError: actions.setError,
    clearError: actions.clearError,
  };
}

export default AppContext;
