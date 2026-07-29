import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import "../styles/Admin.css";

const AdminLayout = () => {
  const location = useLocation();

  const getTitle = () => {
    switch (location.pathname) {
      case "/admin":
        return "Dashboard";

      case "/admin/businesses":
        return "Businesses";

      case "/admin/testimonials":
        return "Testimonials";

      case "/admin/contacts":
        return "Contacts";

      default:
        return "Admin Dashboard";
    }
  };

  return (
    <div className="admin-layout">

      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="admin-content">

        <Topbar title={getTitle()} />

        <Outlet />

      </div>

    </div>
  );
};

export default AdminLayout;