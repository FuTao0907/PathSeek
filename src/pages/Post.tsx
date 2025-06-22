import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github-dark.css';

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
    title: 'Markdown 语法完整指南',
    content: `# Markdown 语法完整指南

这是一个全面的 **Markdown** 语法指南，展示了各种格式化选项和功能。

## 文本格式化

### 基本格式

这是 *斜体文本*，这是 **粗体文本**，这是 ***粗斜体文本***。

你也可以使用 ~~删除线~~ 来标记删除的内容。

### 代码

行内代码使用反引号：\`console.log('Hello World')\`

代码块示例：

\`\`\`javascript
// JavaScript 代码示例
function greetUser(name) {
  const greeting = \`Hello, \${name}!\`;
  console.log(greeting);
  return greeting;
}

// 调用函数
greetUser('Markdown');
\`\`\`

\`\`\`python
# Python 代码示例
def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)

# 生成斐波那契数列
for i in range(10):
    print(f"F({i}) = {fibonacci(i)}")
\`\`\`

## 列表

### 无序列表

- 第一项
- 第二项
  - 嵌套项目 1
  - 嵌套项目 2
- 第三项

### 有序列表

1. 首先做这个
2. 然后做那个
3. 最后完成这个
   1. 子步骤 A
   2. 子步骤 B

## 引用

> 这是一个引用块。引用块用于突出显示重要信息或引用他人的话。
> 
> 你可以在引用块中包含多个段落。

> ### 嵌套引用
> 
> > 这是嵌套的引用块。

## 链接和图片

这是一个 [链接到 GitHub](https://github.com) 的示例。

这是一个图片示例：

![Markdown Logo](https://markdown-here.com/img/icon256.png)

## 表格

| 功能 | 支持 | 说明 |
|------|------|------|
| 标题 | ✅ | 支持 H1-H6 |
| 列表 | ✅ | 有序和无序列表 |
| 代码 | ✅ | 行内和代码块 |
| 表格 | ✅ | 支持表格格式 |
| 链接 | ✅ | 内部和外部链接 |

## 分隔线

---

## 任务列表

- [x] 完成 Markdown 解析器
- [x] 添加语法高亮
- [ ] 添加数学公式支持
- [ ] 添加图表支持

## 总结

Markdown 是一种轻量级的标记语言，它允许你使用易读易写的纯文本格式编写文档，然后转换成有效的 HTML。

**主要优势：**

1. **简单易学** - 语法简洁明了
2. **跨平台** - 在任何文本编辑器中都能使用
3. **可读性强** - 即使是原始文本也很容易阅读
4. **广泛支持** - 被众多平台和工具支持

希望这个指南对你有帮助！`,
    date: '2024-01-15',
    imageUrl: '/images/post1.jpg',
    tags: ['Markdown', '语法', '指南', '文档'],
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
    tags: ['开发', '笔记', '工具'],
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
    tags: ['学习', '编程', '经验'],
  },
];

const Post: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const post = posts.find(p => p.id === Number(id));
  const [readingProgress, setReadingProgress] = useState(0);
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const updateReadingProgress = () => {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrollTop / docHeight) * 100;
      setReadingProgress(progress);
      setShowBackToTop(scrollTop > 300);
    };

    window.addEventListener('scroll', updateReadingProgress);
    return () => window.removeEventListener('scroll', updateReadingProgress);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const shareArticle = () => {
    if (navigator.share && post) {
      navigator.share({
        title: post.title,
        text: post.content.substring(0, 100) + '...',
        url: window.location.href,
      });
    } else {
      // 复制链接到剪贴板
      navigator.clipboard.writeText(window.location.href);
      alert('链接已复制到剪贴板！');
    }
  };

  if (!post) {
    return (
      <div className="content-area">
        <h2>文章未找到</h2>
        <p>抱歉，您请求的文章不存在。</p>
      </div>
    );
  }

  return (
    <>
      <div
        className="reading-progress"
        style={{ width: `${readingProgress}%` }}
      ></div>
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
                  <span key={tag} className="tag">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </header>
          <div className="post-body markdown-content">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeHighlight]}
              components={{
                // 自定义组件渲染
                h1: ({ children }) => (
                  <h1 className="markdown-h1">{children}</h1>
                ),
                h2: ({ children }) => (
                  <h2 className="markdown-h2">{children}</h2>
                ),
                h3: ({ children }) => (
                  <h3 className="markdown-h3">{children}</h3>
                ),
                h4: ({ children }) => (
                  <h4 className="markdown-h4">{children}</h4>
                ),
                h5: ({ children }) => (
                  <h5 className="markdown-h5">{children}</h5>
                ),
                h6: ({ children }) => (
                  <h6 className="markdown-h6">{children}</h6>
                ),
                p: ({ children }) => <p className="markdown-p">{children}</p>,
                ul: ({ children }) => (
                  <ul className="markdown-ul">{children}</ul>
                ),
                ol: ({ children }) => (
                  <ol className="markdown-ol">{children}</ol>
                ),
                li: ({ children }) => (
                  <li className="markdown-li">{children}</li>
                ),
                blockquote: ({ children }) => (
                  <blockquote className="markdown-blockquote">
                    {children}
                  </blockquote>
                ),
                code: ({
                  inline,
                  className,
                  children,
                  ...props
                }: {
                  inline?: boolean;
                  className?: string | undefined;
                  children?: React.ReactNode;
                }) => {
                  const match = /language-(\w+)/.exec(className || '');
                  return !inline && match ? (
                    <pre className="markdown-pre">
                      <code className={`markdown-code ${className}`} {...props}>
                        {children}
                      </code>
                    </pre>
                  ) : (
                    <code className="markdown-inline-code" {...props}>
                      {children}
                    </code>
                  );
                },
                table: ({ children }) => (
                  <table className="markdown-table">{children}</table>
                ),
                thead: ({ children }) => (
                  <thead className="markdown-thead">{children}</thead>
                ),
                tbody: ({ children }) => (
                  <tbody className="markdown-tbody">{children}</tbody>
                ),
                tr: ({ children }) => (
                  <tr className="markdown-tr">{children}</tr>
                ),
                th: ({ children }) => (
                  <th className="markdown-th">{children}</th>
                ),
                td: ({ children }) => (
                  <td className="markdown-td">{children}</td>
                ),
                a: ({ children, href }) => (
                  <a
                    className="markdown-link"
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {children}
                  </a>
                ),
                img: ({ src, alt }) => (
                  <img
                    className="markdown-img"
                    src={src}
                    alt={alt}
                    loading="lazy"
                  />
                ),
                hr: () => <hr className="markdown-hr" />,
                strong: ({ children }) => (
                  <strong className="markdown-strong">{children}</strong>
                ),
                em: ({ children }) => (
                  <em className="markdown-em">{children}</em>
                ),
              }}
            >
              {post.content}
            </ReactMarkdown>
          </div>

          {/* 文章操作按钮 */}
          <div className="post-actions">
            <button
              className="share-btn"
              onClick={shareArticle}
              title="分享文章"
            >
              <span>📤</span>
              分享
            </button>
            <button className="like-btn" title="点赞文章">
              <span>❤️</span>
              点赞
            </button>
          </div>
        </article>

        {/* 返回顶部按钮 */}
        {showBackToTop && (
          <button
            className="back-to-top"
            onClick={scrollToTop}
            title="返回顶部"
          >
            <span>⬆️</span>
          </button>
        )}
      </div>
    </>
  );
};

export default Post;
