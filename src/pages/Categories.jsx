import { Link } from 'react-router-dom'
import { categories } from '../data/categories'
import { useData } from '../store/DataContext'

export default function Categories() {
  const { businesses } = useData()
  return (
    <section className="section">
      <div className="section-head">
        <h1>Categories</h1>
        <p className="lede">Browse businesses by what they do.</p>
      </div>
      <div className="category-grid category-grid-full">
        {categories.map((c) => {
          const count = businesses.filter((b) => b.category === c.slug).length
          return (
            <Link key={c.slug} to={`/businesses?category=${c.slug}`} className="category-chip">
              <span className="category-icon">{c.icon}</span>
              <span>{c.name}</span>
              <span className="category-count">{count}</span>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
