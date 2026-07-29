import { createContext, useContext, useEffect, useState } from 'react'
import { businesses as seedBusinesses } from '../data/businesses'
import { testimonials as seedTestimonials } from '../data/testimonials'

const BUSINESSES_KEY = 'apnabridge_businesses'
const TESTIMONIALS_KEY = 'apnabridge_testimonials'

function loadFromStorage(key, seed) {
  try {
    const raw = localStorage.getItem(key)
    if (raw) return JSON.parse(raw)
  } catch {
    // corrupt storage, fall back to seed
  }
  return seed
}

function slugify(name) {
  const base = name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
  return `${base || 'business'}-${Math.random().toString(36).slice(2, 6)}`
}

const DataContext = createContext(null)

export function DataProvider({ children }) {
  const [businesses, setBusinesses] = useState(() => loadFromStorage(BUSINESSES_KEY, seedBusinesses))
  const [testimonials, setTestimonials] = useState(() => loadFromStorage(TESTIMONIALS_KEY, seedTestimonials))

  useEffect(() => {
    localStorage.setItem(BUSINESSES_KEY, JSON.stringify(businesses))
  }, [businesses])

  useEffect(() => {
    localStorage.setItem(TESTIMONIALS_KEY, JSON.stringify(testimonials))
  }, [testimonials])

  function addBusiness(input) {
    const business = {
      id: slugify(input.name),
      name: input.name,
      ownerName: input.ownerName,
      category: input.category,
      country: input.country,
      state: input.state,
      city: input.city,
      phone: input.phone,
      whatsapp: input.whatsapp || input.phone,
      email: input.email,
      website: input.website || '',
      about: input.about || '',
      instagram: input.instagram || '',
      facebook: input.facebook || '',
      logoUrl: input.logoUrl || null,
      coverUrl: input.coverUrl || null,
      gallery: input.gallery || [],
      featured: false,
      promoted: false,
      createdAt: new Date().toISOString(),
    }
    setBusinesses((prev) => [business, ...prev])
    return business
  }

  function addTestimonial(input) {
    const testimonial = {
      id: `t-${Date.now()}`,
      quote: input.quote,
      name: input.name,
      business: input.business,
    }
    setTestimonials((prev) => [testimonial, ...prev])
    return testimonial
  }

  function getBusinessById(id) {
    return businesses.find((b) => b.id === id)
  }

  return (
    <DataContext.Provider
      value={{ businesses, addBusiness, getBusinessById, testimonials, addTestimonial }}
    >
      {children}
    </DataContext.Provider>
  )
}

export function useData() {
  const ctx = useContext(DataContext)
  if (!ctx) throw new Error('useData must be used within DataProvider')
  return ctx
}
