import { NavLink, useNavigate } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();

  const menu = [
    {
      name: "Dashboard",
      path: "/admin",
      icon: "📊",
    },
    {
      name: "Businesses",
      path: "/admin/businesses",
      icon: "🏢",
    },
    {
      name: "Testimonials",
      path: "/admin/testimonials",
      icon: "💬",
    },
    {
      name: "Contacts",
      path: "/admin/contacts",
      icon: "📩",
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin/login");
  };

  return (
    <aside
      className="sidebar"
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
      }}
    >
      <div className="sidebar-logo">
        <h2>APNABRIDGE</h2>
        <p>Admin Dashboard</p>
      </div>

      <ul style={{ flex: 1 }}>
        {menu.map((item) => (
          <li key={item.path}>
            <NavLink
              to={item.path}
              end={item.path === "/admin"}
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              <span style={{ marginRight: 10 }}>{item.icon}</span>
              {item.name}
            </NavLink>
          </li>
        ))}
      </ul>

      <div style={{ padding: "20px" }}>
        <button
          onClick={handleLogout}
          style={{
            width: "100%",
            padding: "12px",
            border: "none",
            borderRadius: "8px",
            background: "#d97706",
            color: "#fff",
            fontSize: "16px",
            cursor: "pointer",
            fontWeight: "600",
          }}
        >
          🚪 Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;