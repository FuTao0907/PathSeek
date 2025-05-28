import { createBrowserRouter, Outlet } from 'react-router-dom';
import Home from '@/pages/Home';
import About from '@/pages/About';
import NotFound from '@/pages/NotFound';
import Class from '@/pages/Class';
import Post from '@/pages/Post';
import Profile from '@/pages/Profile';
import NewPost from '@/pages/NewPost';
import Navbar from '@/components/Navbar';
import FloatingButton from '@/components/FloatingButton';
import { useState, useCallback } from 'react';
import '@/styles/App.css';

const Layout = () => {
  const [backgroundImage, setBackgroundImage] = useState('');

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  }, []);

  const changeBackground = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const imageUrl = e.target?.result as string;
      setBackgroundImage(imageUrl);
    };
    reader.readAsDataURL(file);
  }, []);

  return (
    <div className="App" style={{ backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'none' }}>
      <Navbar />
      <Outlet />
      <FloatingButton
        onToggleFullscreen={toggleFullscreen}
        onChangeBackground={changeBackground}
      />
    </div>
  );
}
const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: '',
        element: <Home />
      },
      {
        path: 'post/:id',
        element: <Post />
      },
      {
        path: 'about',
        element: <About />
      },
      {
        path: 'class',
        element: <Class />
      },
      {
        path: 'profile',
        element: <Profile />
      },
      {
        path: 'new-post', // Add route for NewPost
        element: <NewPost />
      },
      {
        path: '*',
        element: <NotFound />
      }
    ]
  }
]);

export default router;