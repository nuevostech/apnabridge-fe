import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import BusinessCard from '../components/BusinessCard'
import {
  createTestimonial,
  getTestimonials,
  getFeaturedBusinesses,
  getRecentBusinesses,
  searchBusinesses,
  getCategories,
} from "../utils/api";
const emptyTestimonialForm = { description: '', name: '', business: '' }

export default function Home() {
  const navigate = useNavigate()

  const [query, setQuery] = useState('')
  const [featured, setFeatured] = useState([]);
  const [recent, setRecent] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [categories, setCategories] = useState([]);
const [isSearching, setIsSearching] = useState(false);

  const [testimonialsList, setTestimonialsList] = useState([])
  const [showTestimonialForm, setShowTestimonialForm] = useState(false)
  const [testimonialForm, setTestimonialForm] = useState(emptyTestimonialForm)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')

  useEffect(() => {
  
  getTestimonials()
  .then((res) => {
    setTestimonialsList(res.data || []);
  })
  .catch((err) => {
    console.error("Testimonials:", err);
    setTestimonialsList([]);
  });

  getFeaturedBusinesses()
    .then((res) => {
      setFeatured(res.data || []);
    })
    .catch((err) => {
      console.error("Featured Businesses:", err);
    });
  getRecentBusinesses()
  .then((res) => {
    setRecent(res.data || []);
  })
  .catch((err) => {
    console.error("Recent Businesses:", err);
  });
getCategories()
  .then((res) => {
    setCategories(res.data || []);
  })
  .catch((err) => {
    console.error("Categories:", err);
  });

}, []);

  async function handleSearch(e) {
  e.preventDefault();

  if (!query.trim()) {
    setIsSearching(false);
    setSearchResults([]);
    return;
  }

  try {
    const res = await searchBusinesses(query);

    // If your API returns an array directly
    setSearchResults(res.data || []);

    setIsSearching(true);
  } catch (err) {
    console.error("Search failed:", err);
  }
}

  function updateTestimonialField(field, value) {
    setTestimonialForm((f) => ({ ...f, [field]: value }))
  }

  async function handleTestimonialSubmit(e) {
    e.preventDefault()
    setSubmitting(true)
    setSubmitError('')

    try {
      await createTestimonial(testimonialForm);

alert(
  "Thank you! Your testimonial has been submitted and is awaiting admin approval."
);

setTestimonialForm(emptyTestimonialForm);
setShowTestimonialForm(false);
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
          <h2>{isSearching ? "Search Results" : "Featured Businesses"}</h2>
          <Link to="/businesses" className="section-link">
            View all
          </Link>
        </div>
        <div className="card-grid">
  {(isSearching ? searchResults : featured).map((b) => (
    <Link
      key={b.id}
      to={`/businesses/${b.id}`}
      style={{
        textDecoration: "none",
        color: "inherit",
      }}
    >
      <BusinessCard business={b} />
    </Link>
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
  {categories.slice(0, 10).map((category) => (
    <Link
      key={category.id}
      to={`/businesses?category=${category.id}`}
      className="category-chip"
    >
      <span className="category-icon">📂</span>
      {category.name}
    </Link>
  ))}
</div>
      </section>

      <section className="section">
        <h2>Businesses by Country</h2>
        <div className="country-grid">
          <Link to="/businesses?country=USA" className="country-card">
            <span className="country-flag"></span>
            <h3>USA Businesses</h3>
            <p>Browse USA businesses</p>
          </Link>
          <Link to="/businesses?country=India" className="country-card">
            <span className="country-flag"></span>
            <h3>India Businesses</h3>
            <p>Browse India businesses</p>
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
    {recent.map((b) => (
      <Link
        key={b.id}
        to={`/businesses/${b.id}`}
        style={{
          textDecoration: "none",
          color: "inherit",
        }}
      >
        <BusinessCard business={b} />
      </Link>
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
  value={testimonialForm.description}
  onChange={(e) =>
    updateTestimonialField("description", e.target.value)
  }
/>
            </label>
            {submitError && <p className="form-error">{submitError}</p>}
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Submitting…' : 'Submit Testimonial'}
            </button>
          </form>
        )}

        <div className="testimonial-grid">
  {testimonialsList?.map((t) => (
    <blockquote key={t.id || t.name} className="testimonial-card">
      <p>&ldquo;{t.description || t.quote}&rdquo;</p>

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
