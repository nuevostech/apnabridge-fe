import './JobDetailModal.css'

function initialsFor(name = '') {
  const words = name.trim().split(/\s+/).filter(Boolean)
  if (words.length === 0) return '?'
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase()
  return `${words[0][0]}${words[1][0]}`.toUpperCase()
}

export default function JobDetailModal({ job, onClose }) {
  if (!job) return null

  const {
    title,
    company,
    location,
    tags = [],
    description,
    contactEmail,
    contactPhone,
    contactWhatsapp,
    companyWebsite,
  } = job

  return (
    <div className="jobdetail-overlay" onClick={onClose}>
      <div className="jobdetail-panel" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="jobdetail-close" onClick={onClose} aria-label="Close">
          ✕
        </button>

        <div className="jobdetail-header">
          <div className="jobdetail-avatar">{initialsFor(company)}</div>
          <div>
            <h2>{title}</h2>
            <p className="jobdetail-meta">
              {company}
              {location ? ` · ${location}` : ''}
            </p>
            {tags.length > 0 && (
              <div className="jobdetail-tags">
                {tags.map((tag) => (
                  <span key={tag} className="jobdetail-tag">{tag}</span>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="jobdetail-body">
          <div className="jobdetail-main">
            <h3>About this role</h3>
            <p>
              {description ||
                'No additional description was provided for this job yet. Reach out using the contact details for more information.'}
            </p>
          </div>

          <aside className="jobdetail-contact">
            <h4>Contact</h4>

            {contactPhone && (
              <div className="jobdetail-contact-row">
                <span className="jobdetail-contact-label">Phone</span>
                <span>{contactPhone}</span>
              </div>
            )}

            {contactWhatsapp && (
              <div className="jobdetail-contact-row">
                <span className="jobdetail-contact-label">WhatsApp</span>
                <a href={`https://wa.me/${contactWhatsapp}`} target="_blank" rel="noreferrer">
                  Message on WhatsApp
                </a>
              </div>
            )}

            {contactEmail && (
              <div className="jobdetail-contact-row">
                <span className="jobdetail-contact-label">Email</span>
                <span>{contactEmail}</span>
              </div>
            )}

            {companyWebsite && (
              <div className="jobdetail-contact-row">
                <span className="jobdetail-contact-label">Website</span>
                <a href={companyWebsite} target="_blank" rel="noreferrer">{companyWebsite}</a>
              </div>
            )}

            <a
              className="jobdetail-apply-btn"
              href={`mailto:${contactEmail}?subject=${encodeURIComponent(`Application: ${title}`)}`}
            >
              Apply Now
            </a>
          </aside>
        </div>
      </div>
    </div>
  )
}