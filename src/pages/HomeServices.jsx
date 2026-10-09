import { useEffect, useRef, useState } from 'react'
import './HomeServices.css'

const API_BASE_URL = 'http://127.0.0.1:5001/api'

const INITIAL_RENTAL_FORM = {
  propertyType: 'House',
  country: 'India',
  title: '',
  location: '',
  city: '',
  rent: '',
  deposit: '',
  bedrooms: '',
  bathrooms: '',
  area: '',
  furnishing: 'Unfurnished',
  available: 'Immediately',
  ownerName: '',
  phone: '',
  description: '',
}

function getCurrency(country) {
  return country === 'USA' ? '$' : '₹'
}

function getLocale(country) {
  return country === 'USA' ? 'en-US' : 'en-IN'
}

function formatRent(value, country = 'India') {
  const numericValue = Number(value)

  if (Number.isNaN(numericValue)) {
    return `${getCurrency(country)}0`
  }

  return `${getCurrency(country)}${numericValue.toLocaleString(
    getLocale(country)
  )}`
}

function getImageUrl(imagePath) {
  if (!imagePath) return ''

  if (
    imagePath.startsWith('http://') ||
    imagePath.startsWith('https://') ||
    imagePath.startsWith('data:')
  ) {
    return imagePath
  }

  try {
    const apiOrigin = new URL(API_BASE_URL).origin
    return `${apiOrigin}${imagePath.startsWith('/') ? '' : '/'}${imagePath}`
  } catch {
    return imagePath
  }
}

function getPropertyImages(property) {
  if (!property || !Array.isArray(property.images)) {
    return []
  }

  return property.images
    .map(getImageUrl)
    .filter(Boolean)
}

function getRentFilterOptions(country) {
  const currency = getCurrency(country)
  const locale = getLocale(country)

  const formatAmount = (value) =>
    `${currency}${Number(value).toLocaleString(locale)}`

  return [
    {
      value: 'below_10000',
      label: `Below ${formatAmount(10000)}`,
      min: null,
      max: 10000,
    },
    {
      value: '10000_20000',
      label: `${formatAmount(10000)} - ${formatAmount(20000)}`,
      min: 10000,
      max: 20000,
    },
    {
      value: '20000_30000',
      label: `${formatAmount(20000)} - ${formatAmount(30000)}`,
      min: 20000,
      max: 30000,
    },
    {
      value: '30000_50000',
      label: `${formatAmount(30000)} - ${formatAmount(50000)}`,
      min: 30000,
      max: 50000,
    },
    {
      value: 'above_50000',
      label: `Above ${formatAmount(50000)}`,
      min: 50000,
      max: null,
    },
  ]
}

function Modal({ title, children, onClose, large = false }) {
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = ''
    }
  }, [onClose])

  return (
    <div
      className="rental-modal-overlay"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose()
        }
      }}
    >
      <div
        className={`rental-modal ${large ? 'rental-modal-large' : ''}`}
        role="dialog"
        aria-modal="true"
      >
        <button
          type="button"
          className="rental-modal-close"
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>

        <div className="rental-modal-header">
          <h2>{title}</h2>
        </div>

        {children}
      </div>
    </div>
  )
}

export default function HomeServices() {
  const [activeType, setActiveType] = useState('All')
  const [search, setSearch] = useState('')
  const [country, setCountry] = useState('All')
  const [city, setCity] = useState('All')
  const [maxRent, setMaxRent] = useState('Any')
  const [sortBy, setSortBy] = useState('recommended')

  const rentFilterOptions = getRentFilterOptions(
    country === 'All' ? 'India' : country
  )

  const [properties, setProperties] = useState([])
  const [cities, setCities] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [selectedProperty, setSelectedProperty] = useState(null)
  const propertyGalleryRef = useRef(null)
  const [contactProperty, setContactProperty] = useState(null)
  const [visitProperty, setVisitProperty] = useState(null)
  const [showPostModal, setShowPostModal] = useState(false)

  const [rentalForm, setRentalForm] = useState(INITIAL_RENTAL_FORM)
  const [rentalImages, setRentalImages] = useState([])
  const [postSubmitted, setPostSubmitted] = useState(false)
  const [postLoading, setPostLoading] = useState(false)
  const [visitLoading, setVisitLoading] = useState(false)

  const [visitForm, setVisitForm] = useState({
    userName: '',
    phone: '',
    preferredDate: '',
    preferredTime: '',
    message: '',
  })

  const fetchRentals = async () => {
    setLoading(true)
    setError('')

    try {
      const params = new URLSearchParams()

      if (activeType !== 'All') {
        params.append('type', activeType)
      }

      if (country !== 'All') {
        params.append('country', country)
      }

      if (city !== 'All') {
        params.append('city', city)
      }

      if (search.trim()) {
        params.append('search', search.trim())
      }

      if (maxRent !== 'Any') {
        const selectedRentRange = rentFilterOptions.find(
          (option) => option.value === maxRent
        )

        if (selectedRentRange) {
          if (selectedRentRange.min !== null) {
            params.append('minRent', selectedRentRange.min)
          }

          if (selectedRentRange.max !== null) {
            params.append('maxRent', selectedRentRange.max)
          }
        }
      }

      if (sortBy !== 'recommended') {
        params.append('sort', sortBy)
      }

      const queryString = params.toString()

      const response = await fetch(
        `${API_BASE_URL}/rentals${queryString ? `?${queryString}` : ''}`
      )

      const contentType = response.headers.get('content-type') || ''
      const result = contentType.includes('application/json')
        ? await response.json()
        : {}

      if (!response.ok) {
        throw new Error(
          result.message ||
            `Rental API request failed (${response.status})`
        )
      }

      const rentalData = Array.isArray(result.data)
        ? result.data
        : []

      setProperties(rentalData)

      const uniqueCities = [
        ...new Set(
          rentalData
            .map((property) => property.city)
            .filter(Boolean)
        ),
      ]

      setCities(uniqueCities)
    } catch (fetchError) {
      console.error('Failed to load rentals:', fetchError)

      setProperties([])
      setError(
        fetchError.message ||
          'Unable to load rental properties. Please try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRentals()
  }, [activeType, country, city, search, maxRent, sortBy])

  const handleRentalChange = (field) => (event) => {
    setRentalForm((current) => ({
      ...current,
      [field]: event.target.value,
    }))
  }

  const handleRentalImagesChange = (event) => {
    const selectedFiles = Array.from(event.target.files || [])

    if (!selectedFiles.length) {
      return
    }

    const imageFiles = selectedFiles.filter((file) =>
      file.type.startsWith('image/')
    )

    if (imageFiles.length !== selectedFiles.length) {
      alert('Only image files are allowed.')
    }

    setRentalImages((current) => {
      const combined = [...current, ...imageFiles]

      const uniqueFiles = combined.filter(
        (file, index, files) =>
          index ===
          files.findIndex(
            (item) =>
              item.name === file.name &&
              item.size === file.size &&
              item.lastModified === file.lastModified
          )
      )

      if (uniqueFiles.length > 10) {
        alert('You can upload a maximum of 10 images.')
      }

      return uniqueFiles.slice(0, 10)
    })

    event.target.value = ''
  }

  const removeRentalImage = (indexToRemove) => {
    setRentalImages((current) =>
      current.filter((_, index) => index !== indexToRemove)
    )
  }

  const handleVisitChange = (field) => (event) => {
    setVisitForm((current) => ({
      ...current,
      [field]: event.target.value,
    }))
  }

  const handlePostRental = async (event) => {
    event.preventDefault()

    setPostLoading(true)

    try {
      const formData = new FormData()

      formData.append('propertyType', rentalForm.propertyType)
      formData.append('country', rentalForm.country)
      formData.append('title', rentalForm.title.trim())
      formData.append('location', rentalForm.location.trim())
      formData.append('city', rentalForm.city.trim())
      formData.append('rent', String(Number(rentalForm.rent)))
      formData.append(
        'deposit',
        rentalForm.deposit ? String(Number(rentalForm.deposit)) : '0'
      )
      formData.append('bedrooms', rentalForm.bedrooms)
      formData.append('bathrooms', rentalForm.bathrooms)
      formData.append('area', rentalForm.area.trim())
      formData.append('furnishing', rentalForm.furnishing)
      formData.append('available', rentalForm.available.trim())
      formData.append('ownerName', rentalForm.ownerName.trim())
      formData.append('phone', rentalForm.phone.trim())
      formData.append('description', rentalForm.description.trim())
      formData.append('features', JSON.stringify([]))

      rentalImages.forEach((file) => {
        formData.append('images', file)
      })

      const response = await fetch(
        `${API_BASE_URL}/rentals`,
        {
          method: 'POST',
          body: formData,
        }
      )

      const contentType = response.headers.get('content-type') || ''
      const result = contentType.includes('application/json')
        ? await response.json()
        : {}

      if (!response.ok) {
        throw new Error(
          result.message ||
            `Failed to submit rental property (${response.status})`
        )
      }

      setPostSubmitted(true)

      if (
        rentalForm.city.trim() &&
        !cities.includes(rentalForm.city.trim())
      ) {
        setCities((current) => [
          ...current,
          rentalForm.city.trim(),
        ])
      }
    } catch (submitError) {
      console.error(
        'Rental submission error:',
        submitError
      )

      alert(
        submitError.message ||
          'Failed to submit rental property'
      )
    } finally {
      setPostLoading(false)
    }
  }

  const handleScheduleVisit = async (event) => {
    event.preventDefault()

    if (!visitProperty) {
      return
    }

    setVisitLoading(true)

    try {
      const response = await fetch(
        `${API_BASE_URL}/rentals/${visitProperty.id}/visits`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(visitForm),
        }
      )

      const contentType = response.headers.get('content-type') || ''
      const result = contentType.includes('application/json')
        ? await response.json()
        : {}

      if (!response.ok) {
        throw new Error(
          result.message ||
            `Failed to schedule property visit (${response.status})`
        )
      }

      alert(
        result.message ||
          'Property visit requested successfully.'
      )

      setVisitProperty(null)

      setVisitForm({
        userName: '',
        phone: '',
        preferredDate: '',
        preferredTime: '',
        message: '',
      })
    } catch (visitError) {
      console.error(
        'Schedule visit error:',
        visitError
      )

      alert(
        visitError.message ||
          'Failed to schedule property visit'
      )
    } finally {
      setVisitLoading(false)
    }
  }

  const openVisitModal = (property) => {
    setContactProperty(null)
    setVisitProperty(property)

    setVisitForm({
      userName: '',
      phone: '',
      preferredDate: '',
      preferredTime: '',
      message: '',
    })
  }

  const closePostModal = () => {
    setShowPostModal(false)
    setPostSubmitted(false)
    setPostLoading(false)
    setRentalForm(INITIAL_RENTAL_FORM)
    setRentalImages([])
  }

  return (
    <main className="rental-page">

      {/* =====================================================
          HERO
      ====================================================== */}

      <section className="rental-hero">
        <div className="rental-hero-inner">
          <p className="rental-eyebrow">
            APNABRIDGE RENTALS
          </p>

          <h1>
            Find a House or Room
            <br />
            That Feels Like Home
          </h1>

          <p className="rental-hero-description">
            Discover houses and rooms available for rent in your
            preferred location. Connect directly with property
            owners on ApnaBridge.
          </p>

          <div className="rental-hero-actions">
            <button
              type="button"
              className="rental-btn rental-btn-primary"
              onClick={() => {
                document
                  .getElementById('rental-listings')
                  ?.scrollIntoView({ behavior: 'smooth' })
              }}
            >
              Find a Rental
            </button>

            <button
              type="button"
              className="rental-btn rental-btn-secondary"
              onClick={() => setShowPostModal(true)}
            >
              Post Your Property
            </button>
          </div>
        </div>
      </section>

      {/* =====================================================
          SEARCH
      ====================================================== */}

      <section className="rental-search-wrapper">
        <div className="rental-search-box">
          <div className="rental-search-field rental-search-main">
            <span className="rental-field-icon">⌕</span>

            <div>
              <label htmlFor="rental-search">
                Search
              </label>

              <input
                id="rental-search"
                type="text"
                placeholder="Location, house, room..."
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
              />
            </div>
          </div>

          <div className="rental-search-field">
            <span className="rental-field-icon">🌍</span>

            <div>
              <label htmlFor="rental-country">
                Country
              </label>

              <select
                id="rental-country"
                value={country}
                onChange={(event) => {
                  setCountry(event.target.value)
                  setCity('All')
                  setMaxRent('Any')
                }}
              >
                <option value="All">All countries</option>
                <option value="India">India</option>
                <option value="USA">USA</option>
              </select>
            </div>
          </div>

          <div className="rental-search-field">
            <span className="rental-field-icon">⌖</span>

            <div>
              <label htmlFor="rental-city">
                Location
              </label>

              <select
                id="rental-city"
                value={city}
                onChange={(event) =>
                  setCity(event.target.value)
                }
              >
                <option value="All">All locations</option>

                {cities.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="rental-search-field">
            <span className="rental-field-icon">
              {getCurrency(country === 'All' ? 'India' : country)}
            </span>

            <div>
              <label htmlFor="rental-max-rent">
                Maximum Rent
              </label>

              <select
                id="rental-max-rent"
                value={maxRent}
                onChange={(event) =>
                  setMaxRent(event.target.value)
                }
              >
                <option value="Any">Any budget</option>

                {rentFilterOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          PROPERTY TYPES
      ====================================================== */}

      <section className="rental-types">
        <div className="rental-container">
          <div className="rental-section-heading">
            <div>
              <p className="rental-eyebrow">
                EXPLORE RENTALS
              </p>

              <h2>
                What are you looking for?
              </h2>

              <p>
                Choose a property type and find available
                rental options.
              </p>
            </div>
          </div>

          <div className="rental-type-grid">
            <button
              type="button"
              className={`rental-type-card ${
                activeType === 'All' ? 'is-active' : ''
              }`}
              onClick={() => setActiveType('All')}
            >
              <span className="rental-type-icon">
                🏘️
              </span>

              <span>
                <strong>All Rentals</strong>
                <small>
                  Browse all properties
                </small>
              </span>
            </button>

            <button
              type="button"
              className={`rental-type-card ${
                activeType === 'House' ? 'is-active' : ''
              }`}
              onClick={() => setActiveType('House')}
            >
              <span className="rental-type-icon">
                🏠
              </span>

              <span>
                <strong>Houses</strong>
                <small>
                  Independent houses & homes
                </small>
              </span>
            </button>

            <button
              type="button"
              className={`rental-type-card ${
                activeType === 'Room' ? 'is-active' : ''
              }`}
              onClick={() => setActiveType('Room')}
            >
              <span className="rental-type-icon">
                🛏️
              </span>

              <span>
                <strong>Rooms</strong>
                <small>
                  Private rooms & stays
                </small>
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* =====================================================
          LISTINGS
      ====================================================== */}

      <section
        className="rental-listings-section"
        id="rental-listings"
      >
        <div className="rental-container">

          <div className="rental-listings-heading">
            <div>
              <p className="rental-eyebrow">
                AVAILABLE PROPERTIES
              </p>

              <h2>
                Houses & Rooms for Rent
              </h2>

              <p>
                {properties.length}{' '}
                {properties.length === 1
                  ? 'property'
                  : 'properties'}{' '}
                available
              </p>
            </div>

            <div className="rental-sort">
              <label htmlFor="rental-sort">
                Sort by
              </label>

              <select
                id="rental-sort"
                value={sortBy}
                onChange={(event) =>
                  setSortBy(event.target.value)
                }
              >
                <option value="recommended">
                  Recommended
                </option>

                <option value="low">
                  Rent: Low to High
                </option>

                <option value="high">
                  Rent: High to Low
                </option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="rental-empty-state">
              <div className="rental-empty-icon">
                🏠
              </div>

              <h3>
                Loading rentals...
              </h3>

              <p>
                Please wait while we load available properties.
              </p>
            </div>
          ) : error ? (
            <div className="rental-empty-state">
              <div className="rental-empty-icon">
                ⚠️
              </div>

              <h3>
                Unable to load rentals
              </h3>

              <p>
                {error}
              </p>

              <button
                type="button"
                className="rental-btn rental-btn-primary"
                onClick={fetchRentals}
              >
                Try Again
              </button>
            </div>
          ) : properties.length > 0 ? (
            <div className="rental-property-grid">
              {properties.map((property) => (
                <article
                  className="rental-property-card"
                  key={property.id}
                >
                  <div className="rental-property-image">
                    {getPropertyImages(property).length > 0 ? (
                      <img
                        className="rental-property-photo"
                        src={getPropertyImages(property)[0]}
                        alt={property.title}
                      />
                    ) : (
                      <div className="rental-image-placeholder">
                        <span>
                          {property.propertyType === 'Room'
                            ? '🛏️'
                            : '🏠'}
                        </span>

                        <small>
                          Property Image
                        </small>
                      </div>
                    )}

                    <span className="rental-property-badge">
                      {property.propertyType}
                    </span>

                    <span className="rental-available-badge">
                      {property.available || 'Available'}
                    </span>
                  </div>

                  <div className="rental-property-content">
                    <div className="rental-property-top">
                      <div>
                        <h3>{property.title}</h3>

                        <p className="rental-location">
                          🌍 {property.country || 'India'} · ⌖ {property.location}
                        </p>
                      </div>

                      <div className="rental-price">
                        <strong>
                          {formatRent(property.rent, property.country)}
                        </strong>

                        <span>/month</span>
                      </div>
                    </div>

                    <div className="rental-property-meta">
                      <span>
                        🛏 {property.bedrooms}{' '}
                        {property.bedrooms === 1
                          ? 'Bedroom'
                          : 'Bedrooms'}
                      </span>

                      <span>
                        🚿 {property.bathrooms} Bath
                      </span>

                      <span>
                        📐 {property.area}
                      </span>
                    </div>

                    <div className="rental-property-tags">
                      <span>
                        {property.furnishing}
                      </span>

                      <span>
                        {property.available}
                      </span>
                    </div>

                    <div className="rental-card-actions">
                      <button
                        type="button"
                        className="rental-card-details"
                        onClick={() =>
                          setSelectedProperty(property)
                        }
                      >
                        View Details
                      </button>

                      <button
                        type="button"
                        className="rental-card-contact"
                        onClick={() =>
                          setContactProperty(property)
                        }
                      >
                        Contact Owner
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="rental-empty-state">
              <div className="rental-empty-icon">
                🏠
              </div>

              <h3>
                No rentals found
              </h3>

              <p>
                Try changing your location, budget or
                search criteria.
              </p>

              <button
                type="button"
                className="rental-btn rental-btn-primary"
                onClick={() => {
                  setSearch('')
                  setCountry('All')
                  setCity('All')
                  setMaxRent('Any')
                  setActiveType('All')
                }}
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* =====================================================
          OWNER CTA
      ====================================================== */}

      <section className="rental-owner-cta">
        <div className="rental-owner-cta-inner">
          <div>
            <p className="rental-eyebrow">
              PROPERTY OWNERS
            </p>

            <h2>
              Have a house or room for rent?
            </h2>

            <p>
              List your rental property on ApnaBridge and
              connect directly with people looking for a
              place to stay.
            </p>
          </div>

          <button
            type="button"
            className="rental-btn rental-btn-light"
            onClick={() => setShowPostModal(true)}
          >
            Post Your Property →
          </button>
        </div>
      </section>

      {/* =====================================================
          PROPERTY DETAILS MODAL
      ====================================================== */}

      {selectedProperty && (
        <Modal
          title={selectedProperty.title}
          onClose={() => setSelectedProperty(null)}
          large
        >
          <div className="property-detail-modal">

            <div className="property-detail-image">
              {getPropertyImages(selectedProperty).length > 0 ? (
                <div className="property-detail-gallery" ref={propertyGalleryRef}>
                  {getPropertyImages(selectedProperty).map((image, index) => (
                    <img
                      key={`${image}-${index}`}
                      src={image}
                      alt={`${selectedProperty.title} ${index + 1}`}
                    />
                  ))}
                </div>
              ) : (
                <>
                  <span>
                    {selectedProperty.propertyType === 'Room'
                      ? '🛏️'
                      : '🏠'}
                  </span>

                  <small>
                    Property Image
                  </small>
                </>
              )}

              {getPropertyImages(selectedProperty).length > 1 && (
                <>
                  <button
                    type="button"
                    className="property-detail-gallery-control property-detail-gallery-previous"
                    aria-label="Previous property image"
                    onClick={() =>
                      propertyGalleryRef.current?.scrollBy({
                        left: -propertyGalleryRef.current.clientWidth,
                        behavior: 'smooth',
                      })
                    }
                  >
                    ‹
                  </button>
                  <button
                    type="button"
                    className="property-detail-gallery-control property-detail-gallery-next"
                    aria-label="Next property image"
                    onClick={() =>
                      propertyGalleryRef.current?.scrollBy({
                        left: propertyGalleryRef.current.clientWidth,
                        behavior: 'smooth',
                      })
                    }
                  >
                    ›
                  </button>
                </>
              )}
            </div>

            <div className="property-detail-info">
              <div className="property-detail-location">
                🌍 {selectedProperty.country || 'India'} · ⌖ {selectedProperty.location}
              </div>

              <div className="property-detail-price">
                <strong>
                  {formatRent(selectedProperty.rent, selectedProperty.country)}
                </strong>

                <span>/month</span>
              </div>

              <div className="property-detail-grid">
                <div>
                  <span>Property Type</span>
                  <strong>
                    {selectedProperty.propertyType}
                  </strong>
                </div>

                <div>
                  <span>Bedrooms</span>
                  <strong>
                    {selectedProperty.bedrooms}
                  </strong>
                </div>

                <div>
                  <span>Bathrooms</span>
                  <strong>
                    {selectedProperty.bathrooms}
                  </strong>
                </div>

                <div>
                  <span>Area</span>
                  <strong>
                    {selectedProperty.area}
                  </strong>
                </div>

                <div>
                  <span>Furnishing</span>
                  <strong>
                    {selectedProperty.furnishing}
                  </strong>
                </div>

                <div>
                  <span>Deposit</span>
                  <strong>
                    {formatRent(selectedProperty.deposit, selectedProperty.country)}
                  </strong>
                </div>
              </div>

              <div className="property-detail-description">
                <h3>
                  About this property
                </h3>

                <p>
                  {selectedProperty.description}
                </p>
              </div>

              <div className="property-detail-features">
                <h3>
                  Amenities & Features
                </h3>

                <div>
                  {(selectedProperty.features || []).map(
                    (feature) => (
                      <span key={feature}>
                        ✓ {feature}
                      </span>
                    )
                  )}
                </div>
              </div>

              <div className="property-detail-owner">
                <div>
                  <span>
                    Listed by
                  </span>

                  <strong>
                    {selectedProperty.ownerName}
                  </strong>
                </div>

                <button
                  type="button"
                  className="rental-btn rental-btn-primary"
                  onClick={() => {
                    setSelectedProperty(null)
                    setContactProperty(selectedProperty)
                  }}
                >
                  Contact Owner
                </button>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* =====================================================
          CONTACT OWNER MODAL
      ====================================================== */}

      {contactProperty && (
        <Modal
          title="Contact Property Owner"
          onClose={() => setContactProperty(null)}
        >
          <div className="contact-owner-modal">
            <div className="contact-property-summary">
              <div className="contact-property-icon">
                {contactProperty.propertyType === 'Room'
                  ? '🛏️'
                  : '🏠'}
              </div>

              <div>
                <h3>
                  {contactProperty.title}
                </h3>

                <p>
                  🌍 {contactProperty.country || 'India'} · {contactProperty.location}
                </p>

                <strong>
                  {formatRent(contactProperty.rent, contactProperty.country)}
                  /month
                </strong>
              </div>
            </div>

            <div className="owner-contact-box">
              <span>
                Property Owner
              </span>

              <strong>
                {contactProperty.ownerName}
              </strong>

              <span>
                Phone Number
              </span>

              <a
                href={`tel:${contactProperty.phone}`}
                className="owner-phone"
              >
                {contactProperty.phone}
              </a>
            </div>

            <div className="contact-owner-actions">
              <a
                href={`tel:${contactProperty.phone}`}
                className="rental-btn rental-btn-primary"
              >
                📞 Call Owner
              </a>

              <button
                type="button"
                className="rental-btn rental-btn-secondary"
                onClick={() => {
                  setContactProperty(null)
                  setVisitProperty(contactProperty)
                }}
              >
                Schedule Visit
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* =====================================================
          SCHEDULE VISIT MODAL
      ====================================================== */}

      {visitProperty && (
        <Modal
          title="Schedule a Property Visit"
          onClose={() => setVisitProperty(null)}
        >
          <form
            className="rental-form"
            onSubmit={handleScheduleVisit}
          >
            <div className="visit-property-summary">
              <strong>
                {visitProperty.title}
              </strong>

              <span>
                🌍 {visitProperty.country || 'India'} · ⌖ {visitProperty.location}
              </span>
            </div>

            <div className="rental-form-row">
              <label>
                Your Name
                <input
                  type="text"
                  required
                  placeholder="Enter your name"
                  value={visitForm.userName}
                  onChange={handleVisitChange('userName')}
                />
              </label>

              <label>
                Phone Number
                <input
                  type="tel"
                  required
                  placeholder="Enter phone number"
                  value={visitForm.phone}
                  onChange={handleVisitChange('phone')}
                />
              </label>
            </div>

            <div className="rental-form-row">
              <label>
                Preferred Date
                <input
                  type="date"
                  required
                  value={visitForm.preferredDate}
                  onChange={handleVisitChange('preferredDate')}
                />
              </label>

              <label>
                Preferred Time
                <select
                  required
                  value={visitForm.preferredTime}
                  onChange={handleVisitChange('preferredTime')}
                >
                  <option value="" disabled>
                    Select time
                  </option>
                  <option value="morning">
                    Morning
                  </option>
                  <option value="afternoon">
                    Afternoon
                  </option>
                  <option value="evening">
                    Evening
                  </option>
                </select>
              </label>
            </div>

            <label>
              Message
              <textarea
                rows="4"
                placeholder="Any questions for the owner?"
                value={visitForm.message}
                onChange={handleVisitChange('message')}
              />
            </label>

            <button
              type="submit"
              className="rental-btn rental-btn-primary rental-btn-full"
              disabled={visitLoading}
            >
              {visitLoading
                ? 'Submitting...'
                : 'Request Property Visit'}
            </button>
          </form>
        </Modal>
      )}

      {/* =====================================================
          POST RENTAL PROPERTY MODAL
      ====================================================== */}

      {showPostModal && (
        <Modal
          title="Post Your Rental Property"
          onClose={closePostModal}
          large
        >
          {postSubmitted ? (
            <div className="rental-success">
              <div className="rental-success-icon">
                ✓
              </div>

              <h3>
                Property submitted successfully
              </h3>

              <p>
                Your rental property details have been
                submitted. The listing can be reviewed before
                being displayed to users.
              </p>

              <button
                type="button"
                className="rental-btn rental-btn-primary"
                onClick={closePostModal}
              >
                Done
              </button>
            </div>
          ) : (
            <form
              className="rental-form"
              onSubmit={handlePostRental}
            >
              <div className="rental-form-section">
                <h3>
                  Property Information
                </h3>

                <div className="rental-form-row">
                  <label>
                    Country
                    <select
                      value={rentalForm.country}
                      onChange={handleRentalChange('country')}
                    >
                      <option value="India">India</option>
                      <option value="USA">USA</option>
                    </select>
                  </label>

                  <label>
                    Property Type
                    <select
                      value={rentalForm.propertyType}
                      onChange={handleRentalChange(
                        'propertyType'
                      )}
                    >
                      <option value="House">
                        House
                      </option>

                      <option value="Room">
                        Room
                      </option>
                    </select>
                  </label>
                </div>

                <div className="rental-form-row">
                  <label>
                    Property Title
                    <input
                      type="text"
                      required
                      placeholder="e.g. 2 BHK Family House"
                      value={rentalForm.title}
                      onChange={handleRentalChange(
                        'title'
                      )}
                    />
                  </label>

                  <label>
                    Furnishing
                    <select
                      value={rentalForm.furnishing}
                      onChange={handleRentalChange(
                        'furnishing'
                      )}
                    >
                      <option value="Unfurnished">
                        Unfurnished
                      </option>
                      <option value="Semi Furnished">
                        Semi Furnished
                      </option>
                      <option value="Fully Furnished">
                        Fully Furnished
                      </option>
                    </select>
                  </label>
                </div>

                <div className="rental-image-upload-section">
                  <label className="rental-image-upload-label">
                    Property Images
                    <span>
                      Add one or multiple images (maximum 10)
                    </span>

                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleRentalImagesChange}
                    />
                  </label>

                  {rentalImages.length > 0 && (
                    <div className="rental-upload-preview-grid">
                      {rentalImages.map((file, index) => (
                        <div
                          className="rental-upload-preview"
                          key={`${file.name}-${file.size}-${file.lastModified}`}
                        >
                          <img
                            src={URL.createObjectURL(file)}
                            alt={`Property preview ${index + 1}`}
                          />

                          <button
                            type="button"
                            onClick={() => removeRentalImage(index)}
                            aria-label={`Remove image ${index + 1}`}
                          >
                            ×
                          </button>

                          <small>{file.name}</small>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="rental-form-row">
                  <label>
                    Location / Area
                    <input
                      type="text"
                      required
                      placeholder="e.g. Madhapur"
                      value={rentalForm.location}
                      onChange={handleRentalChange(
                        'location'
                      )}
                    />
                  </label>

                  <label>
                    City
                    <input
                      type="text"
                      required
                      placeholder="e.g. Hyderabad"
                      value={rentalForm.city}
                      onChange={handleRentalChange(
                        'city'
                      )}
                    />
                  </label>
                </div>

                <div className="rental-form-row">
                  <label>
                    Monthly Rent ({getCurrency(rentalForm.country)})
                    <input
                      type="number"
                      min="0"
                      required
                      placeholder={`e.g. 20000 ${getCurrency(rentalForm.country)}`}
                      value={rentalForm.rent}
                      onChange={handleRentalChange(
                        'rent'
                      )}
                    />
                  </label>

                  <label>
                    Security Deposit ({getCurrency(rentalForm.country)})
                    
                    <input
                      type="number"
                      min="0"
                      placeholder={`e.g. 50000 ${getCurrency(rentalForm.country)}`}
                      value={rentalForm.deposit}
                      onChange={handleRentalChange(
                        'deposit'
                      )}
                    />
                  </label>
                </div>
              </div>

              <div className="rental-form-section">
                <h3>
                  Property Details
                </h3>

                <div className="rental-form-row">
                  <label>
                    Bedrooms
                    <select
                      value={rentalForm.bedrooms}
                      onChange={handleRentalChange(
                        'bedrooms'
                      )}
                    >
                      <option value="">
                        Select
                      </option>
                      <option value="1">
                        1
                      </option>
                      <option value="2">
                        2
                      </option>
                      <option value="3">
                        3
                      </option>
                      <option value="4">
                        4
                      </option>
                      <option value="5+">
                        5+
                      </option>
                    </select>
                  </label>

                  <label>
                    Bathrooms
                    <select
                      value={rentalForm.bathrooms}
                      onChange={handleRentalChange(
                        'bathrooms'
                      )}
                    >
                      <option value="">
                        Select
                      </option>
                      <option value="1">
                        1
                      </option>
                      <option value="2">
                        2
                      </option>
                      <option value="3">
                        3
                      </option>
                      <option value="4+">
                        4+
                      </option>
                    </select>
                  </label>
                </div>

                <div className="rental-form-row">
                  <label>
                    Area
                    <input
                      type="text"
                      placeholder="e.g. 1200 sq.ft"
                      value={rentalForm.area}
                      onChange={handleRentalChange(
                        'area'
                      )}
                    />
                  </label>

                </div>

                <label>
                  Availability
                  <input
                    type="text"
                    placeholder="e.g. Immediately or From 15 Oct"
                    value={rentalForm.available}
                    onChange={handleRentalChange(
                      'available'
                    )}
                  />
                </label>

                <label>
                  Property Description
                  <textarea
                    rows="4"
                    required
                    placeholder="Describe your property..."
                    value={rentalForm.description}
                    onChange={handleRentalChange(
                      'description'
                    )}
                  />
                </label>
              </div>

              <div className="rental-form-section">
                <h3>
                  Owner Information
                </h3>

                <div className="rental-form-row">
                  <label>
                    Owner Name
                    <input
                      type="text"
                      required
                      placeholder="Your name"
                      value={rentalForm.ownerName}
                      onChange={handleRentalChange(
                        'ownerName'
                      )}
                    />
                  </label>

                  <label>
                    Phone Number
                    <input
                      type="tel"
                      required
                      placeholder="10-digit phone number"
                      value={rentalForm.phone}
                      onChange={handleRentalChange(
                        'phone'
                      )}
                    />
                  </label>
                </div>
              </div>

              <button
                type="submit"
                className="rental-btn rental-btn-primary rental-btn-full"
                disabled={postLoading}
              >
                {postLoading
                  ? 'Submitting...'
                  : 'Submit Rental Property'}
              </button>
            </form>
          )}
        </Modal>
      )}
    </main>
  )
}
