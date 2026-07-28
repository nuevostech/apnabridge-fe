import { Link, useParams } from 'react-router-dom'
import { CoverPlaceholder, LogoPlaceholder } from '../components/Placeholder'
import { getBusinessById } from '../data/businesses'
import { getCategoryBySlug } from '../data/categories'

export default function BusinessProfile() {
  const { id } = useParams()
  const business = getBusinessById(id)

  if (!business) {
    return (
      <section className="section">
        <p className="empty-state">We couldn't find that business.</p>
        <Link to="/businesses" className="btn btn-ghost">
          Back to Businesses
        </Link>
      </section>
    )
  }

  const category = getCategoryBySlug(business.category)
  const waLink = `https://wa.me/${business.whatsapp.replace(/[^\d]/g, '')}`

  return (
    <section className="profile-page">
      <CoverPlaceholder name={business.name} className="profile-cover" />

      <div className="profile-header">
        <LogoPlaceholder name={business.name} size={88} />
        <div>
          <h1>{business.name}</h1>
          <p className="business-card-meta">
            {category?.icon} {category?.name} · {business.city}, {business.state} ·{' '}
            {business.country === 'USA' ? '🇺🇸' : '🇮🇳'} {business.country}
          </p>
          <p className="profile-owner">Owned by {business.ownerName}</p>
        </div>
        {business.promoted && <span className="badge">Promoted</span>}
      </div>

      <div className="profile-body">
        <div className="profile-main">
          <h2>About</h2>
          <p>{business.about}</p>

          <h2>Gallery</h2>
          <div className="gallery-grid">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="gallery-item" aria-hidden="true" />
            ))}
          </div>

          <h2>Follow</h2>
          <div className="social-links">
            <a
              href={`https://instagram.com/${business.instagram}`}
              target="_blank"
              rel="noreferrer"
            >
              Instagram
            </a>
            <a href={`https://facebook.com/${business.facebook}`} target="_blank" rel="noreferrer">
              Facebook
            </a>
          </div>
        </div>

        <aside className="profile-sidebar">
          <h2>Contact</h2>
          <ul className="contact-list">
            <li>
              <span>Phone</span>
              <a href={`tel:${business.phone}`}>{business.phone}</a>
            </li>
            <li>
              <span>WhatsApp</span>
              <a href={waLink} target="_blank" rel="noreferrer">
                Message on WhatsApp
              </a>
            </li>
            <li>
              <span>Email</span>
              <a href={`mailto:${business.email}`}>{business.email}</a>
            </li>
            <li>
              <span>Website</span>
              <a href={business.website} target="_blank" rel="noreferrer">
                {business.website.replace('https://', '')}
              </a>
            </li>
          </ul>
          <a href={waLink} target="_blank" rel="noreferrer" className="btn btn-primary btn-block">
            Contact {business.name}
          </a>
        </aside>
      </div>
    </section>
  )
}
