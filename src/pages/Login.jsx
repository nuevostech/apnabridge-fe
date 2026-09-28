import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { login } from "../utils/authApi";
import PasswordInput from "../components/PasswordInput";
import logo from "../assets/apnabridge-logo.png";
import "../styles/Auth.css";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const prefillEmail = location.state?.verifiedEmail || location.state?.unverifiedEmail || "";
  const [form, setForm] = useState({ email: prefillEmail, password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [info] = useState(
    location.state?.justVerified ? "Account verified! You can log in now." : ""
  );

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await login({ email: form.email, password: form.password });
      if (data?.token) {
        localStorage.setItem("token", data.token);
      }
      navigate("/");
    } catch (err) {
      if (err.message.toLowerCase().includes("verify")) {
        navigate("/signup", { state: { unverifiedEmail: form.email } });
        return;
      }
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <img src={logo} alt="ApnaBridge" />
        </div>
        <div className="auth-title"></div>
        <p className="auth-subtext">Welcome back Please login in to continue.</p>

        {info && !error && <div className="auth-info">{info}</div>}
        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <label>
            Email Address
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Enter your email"
              autoComplete="email"
              required
            />
          </label>

          <label>
            Password
            <PasswordInput
              name="password"
              value={form.password}
              onChange={handleChange}
              autoComplete="current-password"
              placeholder="Enter your password"
            />
          </label>

          <button type="submit" className="auth-submit" disabled={loading}>
            {loading ? "Logging in..." : "Login \u2192"}
          </button>
        </form>

        <hr className="auth-divider" />

        <p className="auth-footer">
          Don't have an account? <Link to="/signup">Sign up</Link>
        </p>
        <p className="auth-copyright">© 2026 ApnaBridge. All Rights Reserved.</p>
      </div>
    </div>
  );
}