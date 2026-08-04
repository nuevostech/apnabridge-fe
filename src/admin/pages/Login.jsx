import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import logo from "../../assets/apnabridge-logo.png";
import "./Login.css";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
  e.preventDefault();

  setLoading(true);
  setError("");

  try {
    const response = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    const data = await response.json();

    if (response.ok && data.success) {
  localStorage.setItem("adminToken", data.token);
  localStorage.setItem("admin", JSON.stringify(data.admin));

  navigate("/admin");
} else {
  setError(data.message || "Invalid credentials.");
}
  } catch (error) {
    console.error(error);
    setError("Unable to connect to the server.");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="login-page">
      <div className="login-card">

        <div className="logo-container">

          <img
            src={logo}
            alt="ApnaBridge Logo"
            className="logo-image"
          />


          <h3>ADMIN PORTAL</h3>

          <p className="subtitle">
            Welcome back! Please sign in to continue.
          </p>

        </div>

        <form onSubmit={handleLogin}>

          <div className="form-group">

  <label>Email Address</label>

  <input
    type="email"
    placeholder="Enter your email"
    autoComplete="email"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
    required
  />

</div>

          <div className="form-group">

            <label>Password</label>

            <div className="password-wrapper">

              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={
                  showPassword
                    ? "Hide password"
                    : "Show password"
                }
              >
                {showPassword ? (
                  <FaEyeSlash />
                ) : (
                  <FaEye />
                )}
              </button>

            </div>

          </div>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="login-btn"
            disabled={loading}
          >
            {loading ? "Signing In..." : "Login →"}
          </button>

        </form>

        <div className="footer">

          <p>Authorized Personnel Only</p>

          <span>
            © 2026 APNABRIDGE. All Rights Reserved.
          </span>

        </div>

      </div>
    </div>
  );
}