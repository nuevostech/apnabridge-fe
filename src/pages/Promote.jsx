import { useState } from 'react'
import { Link } from 'react-router-dom'
import { categories } from '../data/categories'
import { countries, statesByCountry } from '../data/locations'
import { useData } from '../store/DataContext'
import { fileToDataUrl } from '../utils/files'
import { addBusiness } from "../services/businessService";
const MAX_GALLERY_PHOTOS = 6

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
  country: '',
  city: '',
  state: '',
  phone: '',
  email: '',
  website: '',
  instagram: '',
  facebook: '',
  about: '',
  plan: 'free',
  logoUrl: '',
  coverUrl: '',
  gallery: [],
}

export default function Promote() {
  const [form, setForm] = useState(initialForm)
  const [created, setCreated] = useState(null)
  const [processingImages, setProcessingImages] = useState(false)

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }))
  }

  function updateCountry(value) {
    setForm((f) => ({ ...f, country: value, state: '' }))
  }

  async function handleLogoChange(e) {
    const file = e.target.files[0]
    if (!file) return
    setProcessingImages(true)
    update('logoUrl', await fileToDataUrl(file, 300))
    setProcessingImages(false)
  }

  async function handleCoverChange(e) {
    const file = e.target.files[0]
    if (!file) return
    setProcessingImages(true)
    update('coverUrl', await fileToDataUrl(file, 1000))
    setProcessingImages(false)
  }

  async function handleGalleryChange(e) {
    const files = Array.from(e.target.files).slice(0, MAX_GALLERY_PHOTOS - form.gallery.length)
    if (files.length === 0) return
    setProcessingImages(true)
    const dataUrls = await Promise.all(files.map((f) => fileToDataUrl(f, 800)))
    setForm((f) => ({ ...f, gallery: [...f.gallery, ...dataUrls] }))
    setProcessingImages(false)
  }

  function removeGalleryPhoto(index) {
    setForm((f) => ({ ...f, gallery: f.gallery.filter((_, i) => i !== index) }))
  }

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const payload = {
      name: form.businessName,
      slug: form.businessName
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-"),

      owner_id: form.ownerName,

      description: form.about,

      phone: form.phone,
      email: form.email,
      website: form.website,

      city: form.city,
      state: form.state,
      country: form.country,

      category_slug: form.category,

      plan: "Free",

      logo: form.logoUrl,
      cover_image: form.coverUrl,
    };

    const response = await addBusiness(payload);

    console.log("Business Added:", response.data);

    alert("Business added successfully!");

    setCreated(response.data.data);

    setForm(initialForm);

  } catch (error) {
    console.error(error.response?.data || error);
    alert("Failed to add business");
  }
};
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
        {created ? (
          <div className="form-success">
            <h2>Thanks, {created.ownerName || 'there'}!</h2>
            <p>
              <strong>{created.name}</strong> is now live on ApnaBridge under the{' '}
              {PLANS.find((p) => p.id === form.plan)?.name} plan.
            </p>
            <Link to={`/businesses/${created.id}`} className="btn btn-primary">
              View Your Listing
            </Link>
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
                Country
                <select
                  required
                  value={form.country}
                  onChange={(e) => updateCountry(e.target.value)}
                >
                  <option value="">Select a country</option>
                  {countries.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <div className="form-row">
              <label>
                State
                <select
                  required
                  value={form.state}
                  disabled={!form.country}
                  onChange={(e) => update('state', e.target.value)}
                >
                  <option value="">
                    {form.country ? 'Select a state' : 'Select a country first'}
                  </option>
                  {(statesByCountry[form.country] || []).map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                City
                <input
                  required
                  placeholder="e.g. Edison"
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
            <div className="form-row">
              <label>
                Website (optional)
                <input
                  type="url"
                  placeholder="https://yourbusiness.com"
                  value={form.website}
                  onChange={(e) => update('website', e.target.value)}
                />
              </label>
              <label>
                Instagram (optional)
                <input
                  placeholder="username"
                  value={form.instagram}
                  onChange={(e) => update('instagram', e.target.value.replace(/^@/, ''))}
                />
              </label>
            </div>
            <label>
              Facebook (optional)
              <input
                placeholder="username or page name"
                value={form.facebook}
                onChange={(e) => update('facebook', e.target.value)}
              />
            </label>
            <label>
              About your business (optional)
              <textarea
                rows={3}
                value={form.about}
                onChange={(e) => update('about', e.target.value)}
              />
            </label>

            <div className="form-row">
              <label>
                Logo (optional)
                <input type="file" accept="image/*" onChange={handleLogoChange} />
              </label>
              <label>
                Cover Image (optional)
                <input type="file" accept="image/*" onChange={handleCoverChange} />
              </label>
            </div>

            {(form.logoUrl || form.coverUrl) && (
              <div className="photo-preview-row">
                {form.logoUrl && (
                  <img src={form.logoUrl} alt="Logo preview" className="photo-preview photo-preview-round" />
                )}
                {form.coverUrl && (
                  <img src={form.coverUrl} alt="Cover preview" className="photo-preview" />
                )}
              </div>
            )}

            <label>
              Gallery Photos (optional, up to {MAX_GALLERY_PHOTOS})
              <input
                type="file"
                accept="image/*"
                multiple
                disabled={form.gallery.length >= MAX_GALLERY_PHOTOS}
                onChange={handleGalleryChange}
              />
            </label>

            {form.gallery.length > 0 && (
              <div className="photo-preview-row">
                {form.gallery.map((src, i) => (
                  <div key={src.slice(-16) + i} className="photo-preview-wrap">
                    <img src={src} alt={`Gallery ${i + 1}`} className="photo-preview" />
                    <button
                      type="button"
                      className="photo-preview-remove"
                      aria-label="Remove photo"
                      onClick={() => removeGalleryPhoto(i)}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}

            {processingImages && <p className="lede">Processing photo…</p>}

            <p className="lede">
              Selected plan: <strong>{PLANS.find((p) => p.id === form.plan)?.name}</strong>
            </p>
            <button type="submit" className="btn btn-primary" disabled={processingImages}>
              Submit Listing
            </button>
          </form>
        )}
      </div>
    </section>
  )
}
