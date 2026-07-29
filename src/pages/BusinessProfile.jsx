import { Link, useParams } from 'react-router-dom'
import { Cover, Logo } from '../components/Placeholder'
import { getCategoryBySlug } from '../data/categories'
import { useData } from '../store/DataContext'

export default function BusinessProfile() {
  const { id } = useParams()
  const { getBusinessById } = useData()
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
      <Cover name={business.name} src={business.coverUrl} className="profile-cover" />

      <div className="profile-header">
        <Logo name={business.name} src={business.logoUrl} size={88} />
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
          {business.about && (
            <>
              <h2>About</h2>
              <p>{business.about}</p>
            </>
          )}

          {business.gallery?.length > 0 && (
            <>
              <h2>Gallery</h2>
              <div className="gallery-grid">
                {business.gallery.map((src, i) => (
                  <img key={src.slice(-16) + i} src={src} alt={`${business.name} gallery ${i + 1}`} className="gallery-item" />
                ))}
              </div>
            </>
          )}

          {(business.instagram || business.facebook) && (
            <>
              <h2>Follow</h2>
              <div className="social-links">
                {business.instagram && (
                  <a
                    href={`https://instagram.com/${business.instagram}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Instagram
                  </a>
                )}
                {business.facebook && (
                  <a href={`https://facebook.com/${business.facebook}`} target="_blank" rel="noreferrer">
                    Facebook
                  </a>
                )}
              </div>
            </>
          )}
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
            {business.website && (
              <li>
                <span>Website</span>
                <a href={business.website} target="_blank" rel="noreferrer">
                  {business.website.replace('https://', '')}
                </a>
              </li>
            )}
          </ul>
          <a href={waLink} target="_blank" rel="noreferrer" className="btn btn-primary btn-block">
            Contact {business.name}
          </a>
        </aside>
      </div>
    </section>
  )
}
