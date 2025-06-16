import { Outlet } from "react-router-dom";
import "@/styles/content.css"
const Content = () => {
  return (
    <div className="content">
      <Outlet />
    </div>
  );
};
export default Content;
