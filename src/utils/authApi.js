// src/utils/authApi.js
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  let data = null;
  try {
    data = await res.json();
  } catch {
    // no JSON body
  }

  if (!res.ok) {
    const message = data?.message || data?.error || "Something went wrong";
    throw new Error(message);
  }

  return data;
}

export async function signup({
  firstName,
  lastName,
  email,
  phone,
  companyName,
  companyAddress,
  companyLocations,
  companySize,
  companyType,
  password,
}) {
  const hashedPassword = await hashPassword(password);
  return request("/auth/signup", {
    method: "POST",
    body: JSON.stringify({
      first_name: firstName,
      last_name: lastName,
      email,
      phone,
      company_name: companyName,
      company_address: companyAddress,
      company_locations: companyLocations,
      company_size: companySize,
      company_type: companyType,
      password: hashedPassword,
    }),
  });
}

export function verifyEmail({ email, otp }) {
  return request("/auth/verify-email", {
    method: "POST",
    body: JSON.stringify({ email, otp }),
  });
}

export function resendOtp({ email }) {
  return request("/auth/resend-otp", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}

export async function login({ email, password }) {
  const hashedPassword = await hashPassword(password);
  return request("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password: hashedPassword }),
  });
}