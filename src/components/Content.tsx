import { Outlet } from 'react-router-dom';
import '@/styles/responsive.css';
const Content = () => {
  return (
    <div className="content">
      <Outlet />
    </div>
  );
};
export default Content;
