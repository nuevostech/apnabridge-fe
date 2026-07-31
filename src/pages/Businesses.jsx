import { useMemo, useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import BusinessCard from '../components/BusinessCard'
import { categories } from '../data/categories'
import { statesByCountry } from '../data/locations'
import { getBusinesses, searchBusinesses } from "../utils/api";
export default function Businesses() {
  const [businesses, setBusinesses] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams()
   const q = searchParams.get('q') || ''
  const country = searchParams.get('country') || ''
  const state = searchParams.get('state') || ''
  const city = searchParams.get('city') || ''
  const category = searchParams.get('category') || ''
  useEffect(() => {
  if (q) {
    fetchSearchBusinesses(q);
  } else {
    fetchBusinesses();
  }
}, [q]);
const fetchBusinesses = async () => {
  try {
    const response = await getBusinesses();

    console.log("API Response:", response);

    setBusinesses(response.data || []);
  } catch (error) {
    console.error("Error fetching businesses:", error);
  }
};
const fetchSearchBusinesses = async (keyword) => {
  try {
    const response = await searchBusinesses(keyword);
    setBusinesses(response.data || []);
  } catch (error) {
    console.error("Error searching businesses:", error);
  }
};
 

  function updateParam(key, value) {
    updateParams({ [key]: value })
  }

  function updateParams(updates) {
    const next = new URLSearchParams(searchParams)
    for (const [key, value] of Object.entries(updates)) {
      if (value) next.set(key, value)
      else next.delete(key)
    }
    setSearchParams(next)
  }

  function selectCountry(value) {
    updateParams({ country: value, state: '', city: '' })
  }

  function selectState(value) {
    updateParams({ state: value, city: '' })
  }

  const states = useMemo(() => {
    if (country) return statesByCountry[country] || []
    return [...statesByCountry.USA, ...statesByCountry.India].sort()
  }, [country])

  const cities = useMemo(() => {
    const pool = businesses.filter((b) => {
      if (country && b.country !== country) return false
      if (state && b.state !== state) return false
      return true
    })
    return [...new Set(pool.map((b) => b.city))].sort()
  }, [businesses, country, state])

  const results = useMemo(() => {
    return businesses.filter((b) => {
      if (country && b.country !== country) return false
      if (state && b.state !== state) return false
      if (city && b.city !== city) return false
      if (category && b.category_slug !== category) return false
      return true
    })
  }, [businesses, q, country, state, city, category])
  console.log("Businesses:", businesses);

  return (
    <section className="section businesses-page">
      <div className="section-head">
        <div>
          <h1>Businesses</h1>
          <p className="lede">{results.length} listing{results.length === 1 ? '' : 's'}</p>
        </div>
        <Link to="/promote" className="btn btn-primary">
          Add Business
        </Link>
      </div>

      <div className="country-tabs">
        <button
          type="button"
          className={country === '' ? 'is-active' : ''}
          onClick={() => selectCountry('')}
        >
          All
        </button>
        <button
          type="button"
          className={country === 'USA' ? 'is-active' : ''}
          onClick={() => selectCountry('USA')}
        >
           USA Businesses
        </button>
        <button
          type="button"
          className={country === 'India' ? 'is-active' : ''}
          onClick={() => selectCountry('India')}
        >
           India Businesses
        </button>
      </div>

      <div className="filters-bar">
        <input
          type="search"
          placeholder="Search..."
          value={q}
          onChange={(e) => updateParam('q', e.target.value)}
          aria-label="Search businesses"
        />
        <select value={state} onChange={(e) => selectState(e.target.value)} aria-label="Filter by state">
          <option value="">All states</option>
          {states.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <select value={city} onChange={(e) => updateParam('city', e.target.value)} aria-label="Filter by city">
          <option value="">All cities</option>
          {cities.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <select
          value={category}
          onChange={(e) => updateParam('category', e.target.value)}
          aria-label="Filter by category"
        >
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {results.length > 0 ? (
        <div className="card-grid">
  {results.map((b) => (
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
      ) : (
        <p className="empty-state">No businesses match those filters yet.</p>
      )}
    </section>
  )
}
