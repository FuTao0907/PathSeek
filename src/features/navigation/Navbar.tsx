import ThemeToggle from '@/features/theme/ThemeToggle';
import { useProfile } from '@/pages/Profile';
import { Modal } from '@/shared/components/Modal';
import '@/styles/Navbar.css';
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom'; // Import useNavigate

const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate(); // Initialize useNavigate
  const { profile } = useProfile();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo">
          <div className="profile-link">
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
            { path: '/about', label: '关于' },
          ].map(({ path, label }) => (
            <li key={path} className="navbar-item">
              <Link
                to={path}
                className={`navbar-link ${location.pathname === path ? 'active' : ''}`}
              >
                {label}
              </Link>
            </li>
          ))}
          <li className="navbar-item">
            <ThemeToggle
              variant="dropdown"
              showLabels={false}
              className="theme-toggle"
            />
          </li>
          <li className="navbar-item">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="add-article-button"
            >
              ✍️ 添加文章
            </button>
          </li>
        </ul>
      </div>

      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)}>
        <div className="add-article-modal">
          <div
            className="add-article-option"
            onClick={() => {
              setIsAddModalOpen(false);
              navigate('/new-post'); // Navigate to the new post page
            }}
          >
            <h3>线上编写</h3>
            <p>在线编辑 Markdown 文件，配置文章属性</p>
          </div>
          <div
            className="add-article-option"
            onClick={() => {
              // TODO: 实现文件上传功能
              setIsAddModalOpen(false);
            }}
          >
            <h3>上传 Markdown 文件</h3>
            <p>拖入或选择本地 Markdown 文件</p>
          </div>
        </div>
      </Modal>
    </nav>
  );
};

export default Navbar;
