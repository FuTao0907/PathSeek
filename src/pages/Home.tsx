import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useProfile } from './Profile';
import '../styles/Home.css';
import { BlogPost, recentPosts as initialPosts, updatePost, deletePost } from '../data/posts';

interface EditModalProps {
  post: BlogPost | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (post: BlogPost) => void;
}

const EditModal: React.FC<EditModalProps> = ({ post, isOpen, onClose, onSave }) => {
  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');

  React.useEffect(() => {
    if (isOpen && post) {
      setTitle(post.title);
      setExcerpt(post.excerpt);
      if (post.imageUrl) {
        setImageUrl(post.imageUrl);
        setPreviewUrl(post.imageUrl);
      }
    }
  }, [isOpen, post]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setImageUrl(reader.result);
          setPreviewUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (post) {
      onSave({
        ...post,
        title,
        excerpt,
        imageUrl
      });
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <h2>编辑文章</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>文章图片</label>
            <div className="image-upload-container">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="image-input"
              />
              {previewUrl && (
                <div className="image-preview">
                  <img src={previewUrl} alt="预览" />
                </div>
              )}
            </div>
          </div>
          <div className="form-group">
            <label>文章标题</label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>文章简介</label>
            <textarea
              value={excerpt}
              onChange={e => setExcerpt(e.target.value)}
              required
              rows={4}
            />
          </div>
          <div className="modal-actions">
            <button type="button" onClick={onClose} className="cancel-button">
              取消
            </button>
            <button type="submit" className="save-button">
              保存
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

interface DeleteModalProps {
  post: BlogPost | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const DeleteModal: React.FC<DeleteModalProps> = ({ post, isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content delete-modal" onClick={e => e.stopPropagation()}>
        <h2>确认删除</h2>
        <p>确定要删除文章 "{post?.title}" 吗？此操作不可撤销。</p>
        <div className="modal-actions">
          <button onClick={onClose} className="cancel-button">取消</button>
          <button onClick={onConfirm} className="delete-button">删除</button>
        </div>
      </div>
    </div>
  );
};

const Home: React.FC = () => {
  const { profile } = useProfile();
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [posts, setPosts] = useState<BlogPost[]>(initialPosts);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);

  const handleEdit = (post: BlogPost) => {
    setSelectedPost(post);
    setEditModalOpen(true);
  };

  const handleDelete = (post: BlogPost) => {
    setSelectedPost(post);
    setDeleteModalOpen(true);
  };

  const handleSave = (updatedPost: BlogPost) => {
    updatePost(updatedPost);
    setPosts(posts.map(post => post.id === updatedPost.id ? updatedPost : post));
    setEditModalOpen(false);
  };

  const handleDeleteConfirm = () => {
    if (selectedPost) {
      deletePost(selectedPost.id);
      setPosts(posts.filter(post => post.id !== selectedPost.id));
      setDeleteModalOpen(false);
    }
  };

  const handleImageClick = (imageUrl: string) => {
    setImagePreviewUrl(imageUrl);
  };

  const handleCloseImagePreview = () => {
    setImagePreviewUrl(null);
  };

  return (
    <>
      <div className="content-area home-page">
        <section className="home-profile-section">
          <div className="home-profile-info">
            <Link to="/profile" className="home-avatar-container">
              <img src={profile.avatar} alt="头像" className="home-avatar" />
            </Link>
            <Link to="/profile"><h1>{profile.name}</h1></Link>
            <p className="home-bio">{profile.bio}</p>
            <div className="home-social-links">
              {profile.socialLinks.github && (
                <a href={profile.socialLinks.github} target="_blank" rel="noopener noreferrer">GitHub</a>
              )}
              {profile.socialLinks.twitter && (
                <a href={profile.socialLinks.twitter} target="_blank" rel="noopener noreferrer">Twitter</a>
              )}
              {profile.socialLinks.website && (
                <a href={profile.socialLinks.website} target="_blank" rel="noopener noreferrer">个人网站</a>
              )}
            </div>
          </div>
        </section>

        <section className="recent-posts">
          <h2>学习笔记</h2>
          <div className="home-post-list">
            {posts.map(post => (
              <article key={post.id} className="home-post-card">
                <div className="post-actions">
                  <button
                    className="action-button edit-button"
                    onClick={() => handleEdit(post)}
                    title="编辑文章"
                  >
                    <svg viewBox="0 0 24 24" width="16" height="16">
                      <path fill="currentColor" d="M19.4 7.34L16.66 4.6A2 2 0 0014 4.53l-9 9a2 2 0 00-.57 1.21L4 18.91a1 1 0 00.29.8A1 1 0 005 20h.09l4.17-.38a2 2 0 001.21-.57l9-9a1.92 1.92 0 00-.07-2.71zM9.08 17.62l-3 .28.27-3L12 9.32l2.7 2.7zM16 10.68L13.32 8l1.95-2L18 8.73z"/>
                    </svg>
                  </button>
                  <button
                    className="action-button delete-button"
                    onClick={() => handleDelete(post)}
                    title="删除文章"
                  >
                    <svg viewBox="0 0 24 24" width="16" height="16">
                      <path fill="currentColor" d="M19 7a1 1 0 00-1 1v11.191A1.92 1.92 0 0116.191 21H7.81A1.92 1.92 0 016 19.191V8a1 1 0 00-2 0v11.191A3.918 3.918 0 007.81 23h8.381A3.918 3.918 0 0020 19.191V8a1 1 0 00-1-1zm1-3h-4V3a1 1 0 00-1-1H9a1 1 0 00-1 1v1H4a1 1 0 000 2h16a1 1 0 000-2zM10 3h4v1h-4z"/>
                      <path fill="currentColor" d="M9 17V9a1 1 0 00-2 0v8a1 1 0 002 0zm4 0V9a1 1 0 00-2 0v8a1 1 0 002 0zm4 0V9a1 1 0 00-2 0v8a1 1 0 002 0z"/>
                    </svg>
                  </button>
                </div>
                {post.imageUrl && (
                  <div className="home-post-image" onClick={() => post.imageUrl && handleImageClick(post.imageUrl)}>
                    <img src={post.imageUrl} alt={post.title} />
                  </div>
                )}
                <div className="home-post-content">
                  <h3 className="home-post-title">{post.title}</h3>
                  <p className="home-post-meta">
                    <span className="home-post-date">{post.date}</span>
                    <span className="home-post-tags">
                      {post.tags.map(tag => (
                        <span key={tag} className="home-tag">{tag}</span>
                      ))}
                    </span>
                  </p>
                  <p className="home-post-excerpt">{post.excerpt}</p>
                  <Link to={`/post/${post.id}`} className="home-read-more">阅读全文</Link>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
      <EditModal
        post={selectedPost}
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        onSave={handleSave}
      />
      <DeleteModal
        post={selectedPost}
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
      />
      {imagePreviewUrl && (
        <div className="image-preview-overlay" onClick={handleCloseImagePreview}>
          <div className="image-preview-container">
            <img src={imagePreviewUrl} alt="预览图片" />
          </div>
        </div>
      )}
    </>
  );
};

export default Home;