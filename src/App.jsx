import { Route, Routes, useLocation } from "react-router-dom";
import { useEffect } from "react";

import Header from "./components/Header";
import Footer from "./components/Footer";

/* ============================================================
   Public Pages
============================================================ */

import Home from "./pages/Home";
import Businesses from "./pages/Businesses";
import BusinessProfile from "./pages/BusinessProfile";
import Jobs from "./pages/Jobs";
import HomeServices from "./pages/HomeServices";
import Categories from "./pages/Categories";
import Promote from "./pages/Promote";
import Resources from "./pages/Resources";
import About from "./pages/About";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";

/* ============================================================
   User Authentication
============================================================ */

import UserLogin from "./pages/Login";
import UserSignup from "./pages/Signup";

/* ============================================================
   Admin
============================================================ */

import Login from "./admin/pages/Login";
import ProtectedRoute from "./admin/components/ProtectedRoute";
import AdminLayout from "./admin/layouts/AdminLayout";
import Dashboard from "./admin/pages/Dashboard";
import BusinessesAdmin from "./admin/pages/Businesses";
import AdminJobs from "./admin/pages/Jobs";
import Testimonials from "./admin/pages/Testimonials";
import Contacts from "./admin/pages/Contacts";

/* ============================================================
   Scroll To Top
============================================================ */

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

/* ============================================================
   App
============================================================ */

function App() {
  const location = useLocation();

  // Check if current page is an admin page
  const isAdmin = location.pathname.startsWith("/admin");

  // Check if current page is Login or Signup
  const isAuthPage = ["/login", "/signup"].includes(
    location.pathname
  );

  // Hide Header and Footer on admin/auth pages
  const hideChrome = isAdmin || isAuthPage;

  return (
    <>
      {/* Scroll To Top */}
      <ScrollToTop />

      {/* Public Header */}
      {!hideChrome && <Header />}

      {/* Main Content */}
      <main className={hideChrome ? "" : "site-main"}>
        <Routes>

          {/* ==================================================
              PUBLIC WEBSITE
          ================================================== */}

          {/* Home */}
          <Route
            path="/"
            element={<Home />}
          />

          {/* Businesses */}
          <Route
            path="/businesses"
            element={<Businesses />}
          />

          {/* Business Profile */}
          <Route
            path="/businesses/:id"
            element={<BusinessProfile />}
          />

          {/* Jobs */}
          <Route
            path="/jobs"
            element={<Jobs />}
          />

          {/* Home Services */}
          <Route
            path="/home-services"
            element={<HomeServices />}
          />

          {/* Categories */}
          <Route
            path="/categories"
            element={<Categories />}
          />

          {/* Promote Your Business */}
          <Route
            path="/promote"
            element={<Promote />}
          />

          {/* Resources */}
          <Route
            path="/resources"
            element={<Resources />}
          />

          {/* About */}
          <Route
            path="/about"
            element={<About />}
          />

          {/* Contact */}
          <Route
            path="/contact"
            element={<Contact />}
          />

          {/* ==================================================
              USER AUTHENTICATION
          ================================================== */}

          {/* User Login */}
          <Route
            path="/login"
            element={<UserLogin />}
          />

          {/* User Signup */}
          <Route
            path="/signup"
            element={<UserSignup />}
          />

          {/* ==================================================
              ADMIN LOGIN
          ================================================== */}

          <Route
            path="/admin/login"
            element={<Login />}
          />

          {/* ==================================================
              PROTECTED ADMIN DASHBOARD
          ================================================== */}

          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            {/* Admin Dashboard */}
            <Route
              index
              element={<Dashboard />}
            />

            {/* Admin Businesses */}
            <Route
              path="businesses"
              element={<BusinessesAdmin />}
            />

            {/* Admin Jobs */}
            <Route
              path="jobs"
              element={<AdminJobs />}
            />

            {/* Admin Testimonials */}
            <Route
              path="testimonials"
              element={<Testimonials />}
            />

            {/* Admin Contacts */}
            <Route
              path="contacts"
              element={<Contacts />}
            />
          </Route>

          {/* ==================================================
              404 PAGE
          ================================================== */}

          <Route
            path="*"
            element={<NotFound />}
          />

        </Routes>
      </main>

      {/* Public Footer */}
      {!hideChrome && <Footer />}
    </>
  );
}

export default App;