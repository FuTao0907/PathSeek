import React, { JSX } from 'react';
import { useParams } from 'react-router-dom';

interface BlogPost {
  id: number;
  title: string;
  content: string;
  date: string;
  imageUrl?: string;
  tags: string[];
}

// 模拟文章数据
const posts: BlogPost[] = [
  {
    id: 1,
    title: 'halo-theme-reina主题预览',
    content: `这是一个简洁的 Halo 主题，专注于创作与阅读，如果你也喜欢的话，欢迎使用和分享。

## 主题特点

- 简洁优雅的设计风格
- 响应式布局，完美支持移动端
- 深色模式支持
- 文章目录支持
- 代码高亮支持

## 使用方法

1. 下载主题
2. 上传到 Halo 后台
3. 启用主题
4. 设置主题选项

## 自定义配置

主题提供了丰富的自定义配置选项，你可以根据自己的需求进行个性化设置。`,
    date: '2024-01-15',
    imageUrl: '/images/post1.jpg',
    tags: ['Halo', '主题', '设计']
  },
  {
    id: 2,
    title: '我的开发笔记',
    content: `记录了我在开发过程中遇到的问题和解决方案，以及一些有用的技巧和工具推荐。

## 常见问题解决

### 1. React 组件性能优化

- 使用 React.memo 避免不必要的重渲染
- 合理使用 useCallback 和 useMemo
- 使用虚拟列表处理大量数据

### 2. TypeScript 类型定义

- 接口继承和类型交叉
- 泛型的使用场景
- 类型守卫的实践

## 推荐工具

1. VS Code 插件推荐
2. 开发效率工具
3. 调试工具使用技巧`,
    date: '2024-01-10',
    imageUrl: '/images/post2.jpg',
    tags: ['开发', '笔记', '工具']
  },
  {
    id: 3,
    title: '我是如何学习编程的',
    content: `分享我的编程学习经历，包括使用的资源、遇到的困难以及克服方法。

## 学习路线

1. HTML/CSS 基础
2. JavaScript 核心概念
3. React 框架学习
4. TypeScript 类型系统

## 学习资源

- 官方文档
- 在线课程
- 技术博客
- 开源项目

## 实践项目

通过实际项目来巩固所学知识是最有效的学习方法。`,
    date: '2024-01-05',
    imageUrl: '/images/post3.jpg',
    tags: ['学习', '编程', '经验']
  }
];

const Post: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const post = posts.find(p => p.id === Number(id));

  if (!post) {
    return (
      <div className="content-area">
        <h2>文章未找到</h2>
        <p>抱歉，您请求的文章不存在。</p>
      </div>
    );
  }

  return (
    <div className="content-area post-page">
      {post.imageUrl && (
        <div className="post-header-image">
          <img src={post.imageUrl} alt={post.title} />
        </div>
      )}
      <article className="post-content">
        <header className="post-header">
          <h1>{post.title}</h1>
          <div className="post-meta">
            <span className="post-date">{post.date}</span>
            <div className="post-tags">
              {post.tags.map(tag => (
                <span key={tag} className="tag">{tag}</span>
              ))}
            </div>
          </div>
        </header>
        <div className="post-body">
          {post.content.split('\n\n').map((paragraph, index) => {
            if (paragraph.startsWith('#')) {
              const matches = paragraph.match(/^#+/);
              if (matches) {
                const level = matches[0].length;
                const text = paragraph.replace(/^#+\s/, '');
                const HeadingTag = `h${level}` as keyof JSX.IntrinsicElements;
                return <HeadingTag key={index}>{text}</HeadingTag>;
              }
              return <p key={index}>{paragraph}</p>;
            }
            if (paragraph.startsWith('-')) {
              return (
                <ul key={index}>
                  {paragraph.split('\n').map((item, i) => (
                    <li key={i}>{item.replace(/^-\s/, '')}</li>
                  ))}
                </ul>
              );
            }
            if (paragraph.startsWith('1.')) {
              return (
                <ol key={index}>
                  {paragraph.split('\n').map((item, i) => (
                    <li key={i}>{item.replace(/^\d+\.\s/, '')}</li>
                  ))}
                </ol>
              );
            }
            return <p key={index}>{paragraph}</p>;
          })}
        </div>
      </article>
    </div>
  );
};

export default Post;