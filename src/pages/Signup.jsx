import { useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signup, verifyEmail, resendOtp } from "../utils/authApi";
import PasswordInput from "../components/PasswordInput";
import logo from "../assets/apnabridge-logo.png";
import "../styles/Auth.css";

const OTP_LENGTH = 6;
const RESEND_COOLDOWN = 30; // seconds

const COMPANY_SIZE_OPTIONS = ["1-10", "11-50", "51-200", "201-500", "500+"];
const COMPANY_TYPE_OPTIONS = ["IT", "Non-IT"];

export default function Signup() {
  const navigate = useNavigate();

  const [step, setStep] = useState("form"); // "form" | "otp"
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    companyName: "",
    companyAddress: "",
    companySize: "",
    companyType: "",
    password: "",
    confirmPassword: "",
  });
  const [locations, setLocations] = useState([""]);

  const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(""));
  const otpRefs = useRef([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [cooldown, setCooldown] = useState(0);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleLocationChange(index, value) {
    const next = [...locations];
    next[index] = value;
    setLocations(next);
  }

  function addLocation() {
    setLocations([...locations, ""]);
  }

  function removeLocation(index) {
    setLocations(locations.filter((_, i) => i !== index));
  }

  function validateForm() {
    if (!form.firstName.trim()) return "Please enter your first name.";
    if (!form.lastName.trim()) return "Please enter your last name.";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) return "Please enter a valid email.";
    if (!form.phone.trim()) return "Please enter a phone number.";
    if (!form.companyName.trim()) return "Please enter a company name.";
    if (!form.companyAddress.trim()) return "Please enter a company address.";
    if (!form.companySize) return "Please select a company size.";
    if (!form.companyType) return "Please select a company type.";
    if (form.password.length < 8) return "Password must be at least 8 characters.";
    if (form.password !== form.confirmPassword) return "Passwords do not match.";
    return "";
  }

  async function handleSignupSubmit(e) {
    e.preventDefault();
    setError("");
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    try {
      await signup({
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        phone: form.phone,
        companyName: form.companyName,
        companyAddress: form.companyAddress,
        companyLocations: locations.map((l) => l.trim()).filter(Boolean),
        companySize: form.companySize,
        companyType: form.companyType,
        password: form.password,
      });
      setStep("otp");
      setInfo(`We sent a ${OTP_LENGTH}-digit code to ${form.email}.`);
      startCooldown();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function startCooldown() {
    setCooldown(RESEND_COOLDOWN);
    const interval = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }

  function handleOtpChange(index, value) {
    if (!/^\d?$/.test(value)) return;
    const next = [...otp];
    next[index] = value;
    setOtp(next);

    if (value && index < OTP_LENGTH - 1) {
      otpRefs.current[index + 1]?.focus();
    }
  }

  function handleOtpKeyDown(index, e) {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  }

  function handleOtpPaste(e) {
    const pasted = e.clipboardData.getData("text").trim();
    if (/^\d+$/.test(pasted)) {
      const digits = pasted.slice(0, OTP_LENGTH).split("");
      setOtp((prev) => prev.map((_, i) => digits[i] || prev[i]));
    }
    e.preventDefault();
  }

  async function handleVerifySubmit(e) {
    e.preventDefault();
    setError("");
    const code = otp.join("");
    if (code.length !== OTP_LENGTH) {
      setError(`Please enter the full ${OTP_LENGTH}-digit code.`);
      return;
    }

    setLoading(true);
    try {
      await verifyEmail({ email: form.email, otp: code });
      navigate("/login", {
        state: { verifiedEmail: form.email, justVerified: true },
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleResend() {
    if (cooldown > 0) return;
    setError("");
    try {
      await resendOtp({ email: form.email });
      setInfo("A new code has been sent.");
      startCooldown();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="auth-page">
      <div className={`auth-card ${step === "form" ? "auth-card-wide" : ""}`}>
        <div className="auth-logo">
          <img src={logo} alt="ApnaBridge" />
        </div>

        {step === "form" ? (
          <>
            <div className="auth-title">Create Account</div>
            <p className="auth-subtext">Join ApnaBridge to list or discover businesses.</p>

            {error && <div className="auth-error">{error}</div>}

            <form onSubmit={handleSignupSubmit} className="auth-form">
              <div className="auth-row">
                <label>
                  First Name
                  <input
                    type="text"
                    name="firstName"
                    value={form.firstName}
                    onChange={handleChange}
                    placeholder="Enter your first name"
                    autoComplete="given-name"
                    required
                  />
                </label>
                <label>
                  Last Name
                  <input
                    type="text"
                    name="lastName"
                    value={form.lastName}
                    onChange={handleChange}
                    placeholder="Enter your last name"
                    autoComplete="family-name"
                    required
                  />
                </label>
              </div>

              <div className="auth-row">
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
                  Phone Number
                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="Enter your phone number"
                    autoComplete="tel"
                    required
                  />
                </label>
              </div>

              <div className="auth-row">
                <label>
                  Company Name
                  <input
                    type="text"
                    name="companyName"
                    value={form.companyName}
                    onChange={handleChange}
                    placeholder="Enter your company name"
                    autoComplete="organization"
                    required
                  />
                </label>
                <label>
                  Company Type
                  <select name="companyType" value={form.companyType} onChange={handleChange} required>
                    <option value="" disabled>
                      Select company type
                    </option>
                    {COMPANY_TYPE_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <label>
                Company Address
                <input
                  type="text"
                  name="companyAddress"
                  value={form.companyAddress}
                  onChange={handleChange}
                  placeholder="Enter your company address"
                  autoComplete="street-address"
                  required
                />
              </label>

              <label>
                Company Locations
                <div className="auth-locations">
                  {locations.map((loc, i) => (
                    <div className="auth-location-row" key={i}>
                      <input
                        type="text"
                        value={loc}
                        onChange={(e) => handleLocationChange(i, e.target.value)}
                        placeholder={`Location ${i + 1}`}
                      />
                      {locations.length > 1 && (
                        <button
                          type="button"
                          className="auth-location-remove"
                          onClick={() => removeLocation(i)}
                          aria-label="Remove location"
                        >
                          ×
                        </button>
                      )}
                    </div>
                  ))}
                  <button type="button" className="auth-location-add" onClick={addLocation}>
                    + Add another location
                  </button>
                </div>
              </label>

              <div className="auth-row">
                <label>
                  Company Size
                  <select name="companySize" value={form.companySize} onChange={handleChange} required>
                    <option value="" disabled>
                      Select company size
                    </option>
                    {COMPANY_SIZE_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt} employees
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  {/* spacer to keep the grid aligned on this row */}
                </label>
              </div>

              <div className="auth-row">
                <label>
                  Password
                  <PasswordInput
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    autoComplete="new-password"
                    placeholder="Create a password"
                  />
                </label>
                <label>
                  Confirm Password
                  <PasswordInput
                    name="confirmPassword"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    autoComplete="new-password"
                    placeholder="Confirm your password"
                  />
                </label>
              </div>

              <button type="submit" className="auth-submit" disabled={loading}>
                {loading ? "Creating account..." : "Sign Up \u2192"}
              </button>
            </form>

            <hr className="auth-divider" />

            <p className="auth-footer">
              Already have an account? <Link to="/login">Log in</Link>
            </p>
            <p className="auth-copyright">© 2026 ApnaBridge. All Rights Reserved.</p>
          </>
        ) : (
          <>
            <div className="auth-title">Verify Your Email</div>
            <p className="auth-subtext">{info}</p>

            {error && <div className="auth-error">{error}</div>}

            <form onSubmit={handleVerifySubmit} className="auth-form">
              <div className="otp-inputs" onPaste={handleOtpPaste}>
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    ref={(el) => (otpRefs.current[i] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(i, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(i, e)}
                    className="otp-box"
                  />
                ))}
              </div>

              <button type="submit" className="auth-submit" disabled={loading}>
                {loading ? "Verifying..." : "Verify Email \u2192"}
              </button>
            </form>

            <p className="auth-footer">
              Didn't get a code?{" "}
              <button
                type="button"
                className="link-button"
                onClick={handleResend}
                disabled={cooldown > 0}
              >
                {cooldown > 0 ? `Resend in ${cooldown}s` : "Resend code"}
              </button>
            </p>
          </>
        )}
      </div>
    </div>
  );
}