import React, { useState } from 'react';
import '@/styles/NewPost.css'; // We'll create this CSS file next

const NewPost: React.FC = () => {
  const [markdown, setMarkdown] = useState<string>('');
  const [title, setTitle] = useState<string>('');

  const handleMarkdownChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMarkdown(event.target.value);
  };

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const handleExport = () => {
    if (!title.trim()) {
      alert('请输入文章标题！');
      return;
    }
    const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${title.trim()}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="new-post-page">
      <h1>创建新文章</h1>
      <div className="new-post-container">
        <div className="form-group">
          <label htmlFor="post-title">文章标题</label>
          <input 
            type="text" 
            id="post-title"
            value={title}
            onChange={handleTitleChange}
            placeholder="请输入文章标题"
          />
        </div>
        <div className="form-group">
          <label htmlFor="markdown-editor">Markdown 内容</label>
          <textarea
            id="markdown-editor"
            value={markdown}
            onChange={handleMarkdownChange}
            placeholder="在此输入 Markdown 内容..."
            rows={20}
          />
        </div>
        <div className="actions">
          <button onClick={handleExport} className="export-button">
            导出 Markdown 文件
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewPost;