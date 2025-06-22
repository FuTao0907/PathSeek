import Navbar from '@/features/navigation/Navbar';
import FloatingButton from '@/shared/components/FloatingButton';
import { useState, useCallback } from 'react';
import Content from '@/components/Content';

import '@/styles/Layout.css';

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
    reader.onload = e => {
      const imageUrl = e.target?.result as string;
      setBackgroundImage(imageUrl);
    };
    reader.readAsDataURL(file);
  }, []);

  return (
    <div
      className="App"
      style={{
        backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'none',
      }}
    >
      <Navbar />
      <Content />
      <FloatingButton
        onToggleFullscreen={toggleFullscreen}
        onChangeBackground={changeBackground}
      />
    </div>
  );
};

export default Layout;
