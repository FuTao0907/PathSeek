import { RouterProvider } from 'react-router-dom';
import router from '@/routes';
import { ProfileProvider } from '@/pages/Profile';
import { ThemeProvider } from '@/features/theme/ThemeContext';
import ErrorBoundary from '@/shared/components/ErrorBoundary';
import '@/styles/ErrorBoundary.css';

const App = () => {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <ProfileProvider>
          <RouterProvider router={router} />
        </ProfileProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
};

export default App;
