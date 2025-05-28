import React from 'react';
import { RouterProvider } from 'react-router-dom';
import router from './routes';
import { ProfileProvider } from './pages/Profile';
import { ThemeProvider } from './contexts/ThemeContext';

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <ProfileProvider>
        <RouterProvider router={router} />
      </ProfileProvider>
    </ThemeProvider>
  );
};

export default App;
