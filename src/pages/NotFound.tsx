import React from 'react';
import { Link } from 'react-router-dom';

const NotFound: React.FC = () => {
  return (
    <div className="content-area">
      <h2>404 - 页面未找到</h2>
      <p>您访问的页面不存在。</p>
      <p>
        <Link to="/">返回首页</Link>
      </p>
    </div>
  );
};

export default NotFound;