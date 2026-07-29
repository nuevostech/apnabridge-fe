import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import BusinessCard from '../components/BusinessCard'
import { categories } from '../data/categories'
import { useData } from '../store/DataContext'
import { testimonials as fallbackTestimonials } from '../data/testimonials'
import { createTestimonial, getTestimonials } from '../utils/api'

const emptyTestimonialForm = { quote: '', name: '', business: '' }

export default function Home() {
  const navigate = useNavigate()
  const { businesses } = useData()
  const [query, setQuery] = useState('')

  const [testimonialsList, setTestimonialsList] = useState(fallbackTestimonials)
  const [showTestimonialForm, setShowTestimonialForm] = useState(false)
  const [testimonialForm, setTestimonialForm] = useState(emptyTestimonialForm)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const featured = businesses.filter((b) => b.featured).slice(0, 6)
  const latest = [...businesses]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 4)

  useEffect(() => {
    getTestimonials()
      .then((res) => {
        if (res?.data?.length) setTestimonialsList(res.data)
      })
      .catch(() => {
        // Backend unreachable — keep showing the fallback testimonials.
      })
  }, [])

  function handleSearch(e) {
    e.preventDefault()
    navigate(query ? `/businesses?q=${encodeURIComponent(query)}` : '/businesses')
  }

  function updateTestimonialField(field, value) {
    setTestimonialForm((f) => ({ ...f, [field]: value }))
  }

  async function handleTestimonialSubmit(e) {
    e.preventDefault()
    setSubmitting(true)
    setSubmitError('')

    try {
      const created = await createTestimonial(testimonialForm)
      setTestimonialsList((list) => [created, ...list])
      setTestimonialForm(emptyTestimonialForm)
      setShowTestimonialForm(false)
    } catch (err) {
      setSubmitError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <section className="hero">
        <div className="hero-inner">
          <p className="eyebrow">Free for your first 100 days</p>
          <h1>Promoting Indian Businesses in the USA &amp; India</h1>
          <p className="hero-sub">
            Get discovered by the community — free business promotion for your first 100 days on
            ApnaBridge.
          </p>
          <div className="hero-actions">
            <Link to="/promote" className="btn btn-primary">
              List Your Business
            </Link>
            <Link to="/businesses" className="btn btn-ghost">
              Browse Businesses
            </Link>
          </div>
        </div>
      </section>

      <section className="search-section">
        <form className="search-bar" onSubmit={handleSearch}>
          <input
            type="search"
            placeholder="Search businesses, categories, cities..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search businesses"
          />
          <button type="submit" className="btn btn-primary">
            Search
          </button>
        </form>
      </section>

      <section className="section">
        <div className="section-head">
          <h2>Featured Businesses</h2>
          <Link to="/businesses" className="section-link">
            View all
          </Link>
        </div>
        <div className="card-grid">
          {featured.map((b) => (
            <BusinessCard key={b.id} business={b} />
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section-head">
          <h2>Businesses by Category</h2>
          <Link to="/categories" className="section-link">
            View all
          </Link>
        </div>
        <div className="category-grid">
          {categories.slice(0, 10).map((c) => (
            <Link key={c.slug} to={`/businesses?category=${c.slug}`} className="category-chip">
              <span className="category-icon">{c.icon}</span>
              {c.name}
            </Link>
          ))}
        </div>
      </section>

      <section className="section">
        <h2>Businesses by Country</h2>
        <div className="country-grid">
          <Link to="/businesses?country=USA" className="country-card">
            <span className="country-flag">🇺🇸</span>
            <h3>USA Businesses</h3>
            <p>{businesses.filter((b) => b.country === 'USA').length} listings</p>
          </Link>
          <Link to="/businesses?country=India" className="country-card">
            <span className="country-flag">🇮🇳</span>
            <h3>India Businesses</h3>
            <p>{businesses.filter((b) => b.country === 'India').length} listings</p>
          </Link>
        </div>
      </section>

      <section className="whatsapp-cta">
        <div>
          <h2>Join the ApnaBridge WhatsApp Community</h2>
          <p>Get promotion drops, business tips and local updates straight to your phone.</p>
        </div>
        <a
          href="https://wa.me/10000000000"
          target="_blank"
          rel="noreferrer"
          className="btn btn-primary"
        >
          Join on WhatsApp
        </a>
      </section>

      <section className="section">
        <h2>Latest Business Promotions</h2>
        <div className="card-grid">
          {latest.map((b) => (
            <BusinessCard key={b.id} business={b} />
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section-head">
          <h2>Testimonials</h2>
          <button
            type="button"
            className="btn btn-ghost"
            onClick={() => setShowTestimonialForm((v) => !v)}
          >
            {showTestimonialForm ? 'Cancel' : '+ Add Testimonial'}
          </button>
        </div>

        {showTestimonialForm && (
          <form className="contact-form testimonial-form" onSubmit={handleTestimonialSubmit}>
            <label>
              Your name
              <input
                required
                value={testimonialForm.name}
                onChange={(e) => updateTestimonialField('name', e.target.value)}
              />
            </label>
            <label>
              Business name
              <input
                required
                value={testimonialForm.business}
                onChange={(e) => updateTestimonialField('business', e.target.value)}
              />
            </label>
            <label>
              Your testimonial
              <textarea
                required
                rows={3}
                value={testimonialForm.quote}
                onChange={(e) => updateTestimonialField('quote', e.target.value)}
              />
            </label>
            {submitError && <p className="form-error">{submitError}</p>}
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Submitting…' : 'Submit Testimonial'}
            </button>
          </form>
        )}

        <div className="testimonial-grid">
          {testimonialsList.map((t) => (
            <blockquote key={t.id || t.name} className="testimonial-card">
              <p>&ldquo;{t.quote}&rdquo;</p>
              <footer>
                <strong>{t.name}</strong>
                <span>{t.business}</span>
              </footer>
            </blockquote>
          ))}
        </div>
      </section>
    </>
  )
}
