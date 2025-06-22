export interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  date: string;
  imageUrl?: string;
  tags: string[];
}

// 导入图片
import images01 from '@/assets/images/images_01.jpg';
import images02 from '@/assets/images/images_02.jpg';
import previewGif from '@/assets/images/preview.gif';

export const recentPosts: BlogPost[] = [
  {
    id: 1,
    title: 'halo-theme-reina主题预览',
    excerpt:
      '这是一个简洁的 Halo 主题，专注于创作与阅读，如果你也喜欢的话，欢迎使用和分享。',
    date: '2024-01-15',
    imageUrl: images01,
    tags: ['Halo', '主题', '设计'],
  },
  {
    id: 2,
    title: '我的开发笔记',
    excerpt:
      '记录了我在开发过程中遇到的问题和解决方案，以及一些有用的技巧和工具推荐。',
    date: '2024-01-10',
    imageUrl: images02,
    tags: ['开发', '笔记', '工具'],
  },
  {
    id: 3,
    title: '我是如何学习编程的',
    excerpt: '分享我的编程学习经历，包括使用的资源、遇到的困难以及克服方法。',
    date: '2024-01-05',
    imageUrl: previewGif,
    tags: ['学习', '编程', '经验'],
  },
];

export const updatePost = (updatedPost: BlogPost) => {
  const index = recentPosts.findIndex(post => post.id === updatedPost.id);
  if (index !== -1) {
    recentPosts[index] = updatedPost;
  }
};

export const deletePost = (postId: number) => {
  const index = recentPosts.findIndex(post => post.id === postId);
  if (index !== -1) {
    recentPosts.splice(index, 1);
  }
};
