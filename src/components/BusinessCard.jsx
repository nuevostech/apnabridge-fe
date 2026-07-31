import { Link } from 'react-router-dom'
import { Logo } from './Placeholder'
import { getCategoryBySlug } from '../data/categories'

export default function BusinessCard({ business }) {
  const category = getCategoryBySlug(business.category)
  return (
    <Link to={`/businesses/${business.id}`} className="business-card">
      <Logo name={business.businessName} src={business.logoUrl} />
      <div className="business-card-body">
        <h3>{business.businessName}</h3>
        <p className="business-card-meta">
          {category?.icon} {category?.name} · {business.city}, {business.state}
        </p>
      </div>
      {business.promoted && <span className="badge">Promoted</span>}
    </Link>
  )
}
