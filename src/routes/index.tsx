import { createBrowserRouter } from 'react-router-dom';
import Layout from '@/layout/layout';
import Home from '@/pages/Home';
import About from '@/pages/About';
import NotFound from '@/pages/NotFound';
import Class from '@/pages/Class';
import Post from '@/pages/Post';
import Profile from '@/pages/Profile';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: '',
        element: <Home />,
      },
      {
        path: 'post/:id',
        element: <Post />,
      },
      {
        path: 'about',
        element: <About />,
      },
      {
        path: 'class',
        element: <Class />,
      },
      {
        path: 'profile',
        element: <Profile />,
      },
      {
        path: '*',
        element: <NotFound />,
      },
    ],
  },
]);

export default router;
