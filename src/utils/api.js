const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'

async function request(path, options = {}) {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })

  const body = await res.json().catch(() => null)

  if (!res.ok) {
    const message = body?.error?.message || 'Something went wrong. Please try again.'
    throw new Error(message)
  }

  return body
}

export function getTestimonials() {
  return request('/testimonials')
}

export function createTestimonial({ quote, name, business }) {
  return request('/testimonials', {
    method: 'POST',
    body: JSON.stringify({ quote, name, business }),
  })
}

export function sendContactMessage({ name, email, message }) {
  return request('/contact', {
    method: 'POST',
    body: JSON.stringify({ name, email, message }),
  })
}