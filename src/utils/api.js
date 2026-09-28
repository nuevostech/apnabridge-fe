const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

async function request(path, options = {}) {
  const isFormData = options.body instanceof FormData;

  const token = localStorage.getItem("adminToken");

  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      ...(isFormData ? {} : { "Content-Type": "application/json" }),

      // JWT Token
      ...(token ? { Authorization: `Bearer ${token}` } : {}),

      ...options.headers,
    },
  });

  const body = await res.json().catch(() => null);

  // Token expired / Unauthorized
  if (res.status === 401 || res.status === 403) {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("admin");

    window.location.href = "/admin/login";
    return;
  }

  if (!res.ok) {
    const message =
      body?.message ||
      body?.error?.message ||
      "Something went wrong. Please try again.";

    throw new Error(message);
  }

  return body;
}

// ======================================================
// Testimonials (Public)
// ======================================================

export function getTestimonials() {
  return request("/testimonials");
}

export function createTestimonial({
  description,
  name,
  business,
}) {
  return request("/testimonials", {
    method: "POST",
    body: JSON.stringify({
      description,
      name,
      business,
    }),
  });
}

// ======================================================
// Testimonials (Admin)
// ======================================================

export function getAdminTestimonials() {
  return request("/admin/testimonials");
}

export function approveTestimonial(id) {
  return request(`/admin/testimonials/${id}/approve`, {
    method: "PUT",
  });
}

export function rejectTestimonial(id) {
  return request(`/admin/testimonials/${id}/reject`, {
    method: "PUT",
  });
}

export function deleteTestimonial(id) {
  return request(`/admin/testimonials/${id}`, {
    method: "DELETE",
  });
}

// ======================================================
// Contact
// ======================================================

export function sendContactMessage({
  name,
  email,
  message,
}) {
  return request("/contact", {
    method: "POST",
    body: JSON.stringify({
      name,
      email,
      message,
    }),
  });
}

export function getContacts() {
  return request("/contact");
}

// ======================================================
// Businesses (Public)
// ======================================================

export function getBusinesses(page = 1, limit = 10) {
  return request(`/businesses?page=${page}&limit=${limit}`);
}

export function getBusiness(id) {
  return request(`/businesses/${id}`);
}

export function getFeaturedBusinesses() {
  return request("/businesses/featured");
}

export function getRecentBusinesses() {
  return request("/businesses/recent");
}

export function searchBusinesses(keyword) {
  return request(
    `/businesses/search?q=${encodeURIComponent(keyword)}`
  );
}

export function createBusiness(formData) {
  return request("/businesses", {
    method: "POST",
    body: formData,
  });
}

// ======================================================
// Businesses (Admin)
// ======================================================

export function getAdminBusinesses(page = 1, limit = 20) {
  return request(
    `/businesses/admin?page=${page}&limit=${limit}`
  );
}

export function approveBusiness(id) {
  return request(`/businesses/${id}/approve`, {
    method: "PUT",
  });
}

export function rejectBusiness(id) {
  return request(`/businesses/${id}/reject`, {
    method: "PUT",
  });
}

export function deleteBusiness(id) {
  return request(`/businesses/${id}`, {
    method: "DELETE",
  });
}

// ======================================================
// Dashboard
// ======================================================

export function getDashboardSummary() {
  return request("/admin/dashboard");
}

// ======================================================
// Categories
// ======================================================

export function getCategories() {
  return request("/categories");
}

// ======================================================
// Jobs (Public)
// ======================================================

export function getJobs({
  country = "all",
  category = "",
  q = "",
  location = "",
  page = 1,
  limit = 10,
} = {}) {
  const params = new URLSearchParams({
    country,
    page,
    limit,
  });

  if (category) params.set("category", category);
  if (q) params.set("q", q);
  if (location) params.set("location", location);

  return request(`/jobs?${params.toString()}`);
}

export function getFeaturedJobs(country = "all") {
  const params = new URLSearchParams({ country });
  return request(`/jobs/featured?${params.toString()}`);
}

export function getJobCategoryCounts() {
  return request("/jobs/categories/counts");
}

export function getJob(id) {
  return request(`/jobs/${id}`);
}

export function searchJobs(keyword) {
  return request(`/jobs/search?q=${encodeURIComponent(keyword)}`);
}

export function createJob({
  title,
  company,
  country,
  location,
  category,
  jobType,
  description,
  email,
  tags = [],
}) {
  return request("/jobs", {
    method: "POST",
    body: JSON.stringify({
      title,
      company,
      country,
      location,
      category,
      jobType,
      description,
      email,
      tags,
    }),
  });
}

// ======================================================
// Jobs (Admin)
// ======================================================

export function getAdminJobs(page = 1, limit = 20) {
  return request(`/jobs/admin?page=${page}&limit=${limit}`);
}

export function approveJob(id) {
  return request(`/jobs/${id}/approve`, { method: "PUT" });
}

export function rejectJob(id) {
  return request(`/jobs/${id}/reject`, { method: "PUT" });
}

export function deleteJob(id) {
  return request(`/jobs/${id}`, { method: "DELETE" });
}

// ======================================================
// Auth
// ======================================================

export function login(email, password) {
  return request("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}