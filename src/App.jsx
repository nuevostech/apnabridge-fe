import { Route, Routes, useLocation } from "react-router-dom";
import { useEffect } from "react";

import Header from "./components/Header";
import Footer from "./components/Footer";

// Public Pages
import Home from "./pages/Home";
import Businesses from "./pages/Businesses";
import BusinessProfile from "./pages/BusinessProfile";
import Categories from "./pages/Categories";
import Promote from "./pages/Promote";
import Resources from "./pages/Resources";
import About from "./pages/About";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";

// Admin
import AdminLayout from "./admin/layouts/AdminLayout";
import Dashboard from "./admin/pages/Dashboard";
import BusinessesAdmin from "./admin/pages/Businesses";
import Testimonials from "./admin/pages/Testimonials";
import Contacts from "./admin/pages/Contacts";

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function App() {
  const location = useLocation();

  const isAdmin = location.pathname.startsWith("/admin");

  return (
    <>
      <ScrollToTop />

      {!isAdmin && <Header />}

      <main className={isAdmin ? "" : "site-main"}>
        <Routes>
          {/* Public Website */}
          <Route path="/" element={<Home />} />
          <Route path="/businesses" element={<Businesses />} />
          <Route path="/businesses/:id" element={<BusinessProfile />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/promote" element={<Promote />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />

          {/* Admin Dashboard */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="businesses" element={<BusinessesAdmin />} />
            <Route path="testimonials" element={<Testimonials />} />
            <Route path="contacts" element={<Contacts />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      {!isAdmin && <Footer />}
    </>
  );
}

export default App;