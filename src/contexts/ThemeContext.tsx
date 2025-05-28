import React, { createContext, useContext, useState, } from 'react';

interface ThemeContextType {
  darkMode: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    // 从localStorage获取主题设置，如果没有则默认为false（白天模式）
    const savedMode = localStorage.getItem('darkMode');
    return savedMode ? JSON.parse(savedMode) : false;
  });

  // 暂时注释掉主题切换功能
  // useEffect(() => {
  //   // 清除所有主题类名
  //   document.body.classList.remove('dark-theme', 'light-theme');
  //   
  //   // 应用当前主题
  //   if (darkMode) {
  //     document.body.classList.add('dark-theme');
  //   } else {
  //     document.body.classList.add('light-theme');
  //   }
  // }, []); // 只在组件挂载时执行一次

  // useEffect(() => {
  //   // 当darkMode状态改变时，更新body的类名和localStorage
  //   document.body.classList.remove('dark-theme', 'light-theme');
  //   
  //   if (darkMode) {
  //     document.body.classList.add('dark-theme');
  //   } else {
  //     document.body.classList.add('light-theme');
  //   }
  //   localStorage.setItem('darkMode', JSON.stringify(darkMode));
  // }, [darkMode]);

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  return (
    <ThemeContext.Provider value={{ darkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};