import { useState } from 'react'
import { categories } from '../data/categories'

const PLANS = [
  {
    id: 'free',
    name: 'Free Listing',
    price: 'Free for 100 days',
    description: 'A full business profile in the directory — logo, contact info, gallery.',
  },
  {
    id: 'premium',
    name: 'Premium Promotion',
    price: 'Coming soon',
    description: 'Priority placement across search and category pages.',
    disabled: true,
  },
  {
    id: 'featured',
    name: 'Featured Business',
    price: 'Contact for pricing',
    description: 'Appear in the Featured Businesses section on the homepage.',
  },
  {
    id: 'video',
    name: 'Video Promotion',
    price: 'Contact for pricing',
    description: 'A short video about your business shared with the community.',
  },
  {
    id: 'social',
    name: 'Social Media Promotion',
    price: 'Contact for pricing',
    description: 'A dedicated post on ApnaBridge social channels.',
  },
]

const initialForm = {
  businessName: '',
  ownerName: '',
  category: '',
  city: '',
  phone: '',
  email: '',
  plan: 'free',
}

export default function Promote() {
  const [form, setForm] = useState(initialForm)
  const [submitted, setSubmitted] = useState(false)

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <section className="section">
      <div className="section-head">
        <h1>Promote Your Business</h1>
        <p className="lede">Free business promotion for your first 100 days on ApnaBridge.</p>
      </div>

      <div className="plan-grid">
        {PLANS.map((plan) => (
          <button
            key={plan.id}
            type="button"
            className={`plan-card ${form.plan === plan.id ? 'is-selected' : ''}`}
            disabled={plan.disabled}
            onClick={() => update('plan', plan.id)}
          >
            <h3>{plan.name}</h3>
            <p className="plan-price">{plan.price}</p>
            <p>{plan.description}</p>
          </button>
        ))}
      </div>

      <div className="promote-form-wrap">
        {submitted ? (
          <div className="form-success">
            <h2>Thanks, {form.ownerName || 'there'}!</h2>
            <p>
              We've received your details for <strong>{form.businessName}</strong>. Our team will
              reach out within 2 business days to finish setting up your listing.
            </p>
          </div>
        ) : (
          <form className="promote-form" onSubmit={handleSubmit}>
            <h2>Tell us about your business</h2>
            <div className="form-row">
              <label>
                Business Name
                <input
                  required
                  value={form.businessName}
                  onChange={(e) => update('businessName', e.target.value)}
                />
              </label>
              <label>
                Owner Name
                <input
                  required
                  value={form.ownerName}
                  onChange={(e) => update('ownerName', e.target.value)}
                />
              </label>
            </div>
            <div className="form-row">
              <label>
                Category
                <select
                  required
                  value={form.category}
                  onChange={(e) => update('category', e.target.value)}
                >
                  <option value="">Select a category</option>
                  {categories.map((c) => (
                    <option key={c.slug} value={c.slug}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                City &amp; State
                <input
                  required
                  placeholder="e.g. Edison, New Jersey"
                  value={form.city}
                  onChange={(e) => update('city', e.target.value)}
                />
              </label>
            </div>
            <div className="form-row">
              <label>
                Phone
                <input
                  required
                  type="tel"
                  value={form.phone}
                  onChange={(e) => update('phone', e.target.value)}
                />
              </label>
              <label>
                Email
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={(e) => update('email', e.target.value)}
                />
              </label>
            </div>
            <p className="lede">
              Selected plan: <strong>{PLANS.find((p) => p.id === form.plan)?.name}</strong>
            </p>
            <button type="submit" className="btn btn-primary">
              Submit Listing
            </button>
          </form>
        )}
      </div>
    </section>
  )
}
