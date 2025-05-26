import React from 'react';
import { RouterProvider } from 'react-router-dom';
import router from './routes';
import { ProfileProvider } from './pages/Profile';

const App: React.FC = () => {
  return (
    <ProfileProvider>
      <RouterProvider router={router} />
    </ProfileProvider>
  );
};

export default App;
