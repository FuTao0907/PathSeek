import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../styles/Navbar.css';
import { useProfile } from '../pages/Profile';

const Navbar: React.FC = () => {
  const location = useLocation();
  const { profile } = useProfile();
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    // 从localStorage获取主题设置，如果没有则默认为false（白天模式）
    const savedMode = localStorage.getItem('darkMode');
    return savedMode ? JSON.parse(savedMode) : false;
  });

  useEffect(() => {
    // 当darkMode状态改变时，更新document的data-theme属性和localStorage
    if (darkMode) {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
    }
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo">
          <div className="profile-link">
            <img src={profile.avatar} alt="用户头像" className="navbar-avatar" />
            <h1>Path Seek</h1>
          </div>
        </div>
        <ul className="navbar-menu">
          {[
            { path: '/', label: '首页' },
            {
              path: '/class',
              label: '分类',
            },
            { path: '/about', label: '关于' }
          ].map(({ path, label }) => (
            <li key={path} className="navbar-item">
              <Link to={path} className={`navbar-link ${location.pathname === path ? 'active' : ''}`}>
                {label}
              </Link>
            </li>
          ))}
          <li className="navbar-item theme-toggle">
            <button onClick={toggleTheme} className="theme-toggle-button">
              {darkMode ? '☀️ 白天模式' : '🌙 黑夜模式'}
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;