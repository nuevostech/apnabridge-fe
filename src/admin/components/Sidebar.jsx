import { NavLink } from "react-router-dom";

const Sidebar = () => {
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

  return (
    <aside className="sidebar">

      <div className="sidebar-logo">
        <h2>APNABRIDGE</h2>
        <p>Admin Dashboard</p>
      </div>

      <ul>
        {menu.map((item) => (
          <li key={item.path}>
            <NavLink
              to={item.path}
              end={item.path === "/admin"}
              className={({ isActive }) =>
                isActive ? "active" : ""
              }
            >
              <span style={{ marginRight: 10 }}>
                {item.icon}
              </span>

              {item.name}
            </NavLink>
          </li>
        ))}
      </ul>

    </aside>
  );
};

export default Sidebar;