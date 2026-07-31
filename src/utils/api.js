const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

async function request(path, options = {}) {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
    },
    ...options,
  });

  const body = await res.json().catch(() => null);

  if (!res.ok) {
    const message =
      body?.message ||
      body?.error?.message ||
      "Something went wrong. Please try again.";

    throw new Error(message);
  }

  return body;
}

// ---------------- Testimonials ----------------

export function getTestimonials() {
  return request("/testimonials");
}

export function createTestimonial({ quote, name, business }) {
  return request("/testimonials", {
    method: "POST",
    body: JSON.stringify({ quote, name, business }),
  });
}

// ---------------- Contact ----------------

export function sendContactMessage({ name, email, message }) {
  return request("/contact", {
    method: "POST",
    body: JSON.stringify({ name, email, message }),
  });
}

// ---------------- Businesses ----------------

// Public Businesses
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
// Create Business
export function createBusiness(data) {
  return request("/businesses", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// ================= ADMIN =================

// Get All Businesses (Admin)
export function getAdminBusinesses(page = 1, limit = 20) {
  return request(`/businesses/admin?page=${page}&limit=${limit}`);
}

// Approve Business
export function approveBusiness(id) {
  return request(`/businesses/${id}/approve`, {
    method: "PUT",
  });
}

// Reject Business
export function rejectBusiness(id) {
  return request(`/businesses/${id}/reject`, {
    method: "PUT",
  });
}
export function getContacts() {
  return request("/contact");
}
export function getDashboardSummary() {
  return request("/admin/dashboard");
}
export function getCategories() {
  return request("/categories");
}