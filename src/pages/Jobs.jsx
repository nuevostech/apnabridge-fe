import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import PostJobModal from '../components/PostJobModal'
import JobDetailModal from '../components/JobDetailModal'
import heroIllustration from '../assets/jobs-hero-illustration.png'
import { getJobCategoryCounts, getJobs } from '../utils/api'
import './Jobs.css'

const COUNTRY_TABS = [
  { key: 'all', label: 'All' },
  { key: 'india', label: 'India' },
  { key: 'usa', label: 'USA' },
]

// Static category metadata (icon/label/colors). Live counts come from the API.
const CATEGORY_META = [
  { key: 'it', label: 'IT & Software', icon: '💻', bg: '#e8f0fe' },
  { key: 'healthcare', label: 'Healthcare', icon: '⚕️', bg: '#e6f9ef' },
  { key: 'finance', label: 'Finance', icon: '📈', bg: '#e6f9ef' },
  { key: 'marketing', label: 'Marketing', icon: '📣', bg: '#fdece0' },
  { key: 'hospitality', label: 'Hospitality', icon: '🏨', bg: '#fde4e1' },
  { key: 'retail', label: 'Retail', icon: '🛍️', bg: '#fdf3d9' },
  { key: 'internships', label: 'Internships', icon: '🎓', bg: '#f1e9fb' },
  { key: 'remote', label: 'Remote Jobs', icon: '🏠', bg: '#e8f0fe' },
]

function timeAgo(isoDate) {
  if (!isoDate) return ''
  const seconds = Math.floor((Date.now() - new Date(isoDate).getTime()) / 1000)
  if (seconds < 60) return 'just now'
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes} min${minutes > 1 ? 's' : ''} ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days} day${days > 1 ? 's' : ''} ago`
  const weeks = Math.floor(days / 7)
  if (weeks < 5) return `${weeks} week${weeks > 1 ? 's' : ''} ago`
  const months = Math.floor(days / 30)
  return `${months} month${months > 1 ? 's' : ''} ago`
}

function UserIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  )
}

function BriefcaseIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
  )
}

function HeartIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" stroke="none" {...props}>
      <path d="M12 21s-6.7-4.35-9.3-8.1C1 10.2 1.6 6.9 4.4 5.4c2.2-1.2 4.6-.4 5.9 1.4l1.7 2.3 1.7-2.3c1.3-1.8 3.7-2.6 5.9-1.4 2.8 1.5 3.4 4.8 1.7 7.5C18.7 16.65 12 21 12 21z" />
    </svg>
  )
}

function initialsFor(companyName = '') {
  const words = companyName.trim().split(/\s+/).filter(Boolean)
  if (words.length === 0) return '?'
  if (words.length === 1) return words[0].slice(0, 2)
  return `${words[0][0]}${words[1][0]}`
}

export default function Jobs() {
  const [country, setCountry] = useState('all')
  const [category, setCategory] = useState(null)

  const [jobs, setJobs] = useState([])
  const [jobsLoading, setJobsLoading] = useState(true)
  const [jobsError, setJobsError] = useState(null)

  const [categoryCounts, setCategoryCounts] = useState({})

  const [modalOpen, setModalOpen] = useState(false)
  const [selectedJob, setSelectedJob] = useState(null)

  const jobsSectionRef = useRef(null)

  const loadJobs = useCallback(async () => {
    setJobsLoading(true)
    setJobsError(null)

    try {
      const res = await getJobs({
        country,
        category: category || '',
        page: 1,
        limit: 20,
      })
      setJobs(res?.data || [])
    } catch (err) {
      setJobsError(err.message || 'Could not load jobs right now.')
    } finally {
      setJobsLoading(false)
    }
  }, [country, category])

  const loadCategoryCounts = useCallback(async () => {
    try {
      const res = await getJobCategoryCounts()
      setCategoryCounts(res?.data || {})
    } catch {
      // Non-critical — cards just show without counts.
    }
  }, [])

  useEffect(() => {
    loadJobs()
  }, [loadJobs])

  useEffect(() => {
    loadCategoryCounts()
  }, [loadCategoryCounts])

  const categories = useMemo(
    () =>
      CATEGORY_META.map((cat) => ({
        ...cat,
        count: categoryCounts[cat.key],
      })),
    [categoryCounts]
  )

  const handleJobPosted = () => {
    // Refresh both the list and the category counts so the new
    // posting shows up immediately in Featured Jobs / its category.
    loadJobs()
    loadCategoryCounts()
  }

  const scrollToJobs = () => {
    jobsSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const handleCategoryClick = (key) => {
    setCategory((prev) => (prev === key ? null : key))
    scrollToJobs()
  }

  const handleViewAllCategories = () => {
    setCategory(null)
  }

  const handleViewAllJobs = () => {
    setCategory(null)
    setKeyword('')
    setLocation('')
    setAppliedFilters({ keyword: '', location: '' })
    scrollToJobs()
  }

  return (
    <div className="jobs-page">
      <section className="jobs-hero">
        <div className="jobs-hero-top">
          <div className="jobs-hero-inner">
            <p className="jobs-eyebrow">Careers Without Borders</p>
            <h1>Find Your Next Opportunity</h1>
            <p className="jobs-hero-sub">
              Connecting Indian talent with opportunities in the USA and India.
            </p>
            <span className="jobs-hero-divider" aria-hidden="true"></span>

            <ul className="jobs-hero-points">
              <li>
                <span className="jobs-hero-icon"><UserIcon /></span>
                For Indian talent in the USA &amp; India
              </li>
              <li>
                <span className="jobs-hero-icon"><BriefcaseIcon /></span>
                For growing businesses
              </li>
              <li>
                <span className="jobs-hero-icon"><HeartIcon /></span>
                For a stronger community
              </li>
            </ul>
          </div>

          <div className="jobs-hero-image">
            <img src={heroIllustration} alt="India Gate, Taj Mahal and the Statue of Liberty rising from a globe" />
          </div>
        </div>

        <div className="jobs-search-panel">
          <div className="jobs-country-tabs" role="tablist" aria-label="Filter by country">
            {COUNTRY_TABS.map((tab) => (
              <button
                key={tab.key}
                type="button"
                role="tab"
                aria-selected={country === tab.key}
                className={`jobs-country-tab ${country === tab.key ? 'is-active' : ''}`}
                onClick={() => setCountry(tab.key)}
              >
                {tab.label.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="jobs-categories-section">
        <div className="jobs-section-heading">
          <h2>Browse Jobs by Category</h2>
          
        </div>

        <div className="jobs-category-grid">
          {categories.map((cat) => (
            <button
              type="button"
              key={cat.key}
              className={`jobs-category-card ${category === cat.key ? 'is-active' : ''}`}
              onClick={() => handleCategoryClick(cat.key)}
            >
              <span className="jobs-category-icon" style={{ backgroundColor: cat.bg }}>{cat.icon}</span>
              <span className="jobs-category-label">{cat.label}</span>
              <span className="jobs-category-count">
                {cat.count === undefined ? '—' : `${cat.count}+ jobs`}
              </span>
            </button>
          ))}
        </div>
      </section>

      <section className="jobs-main-section" ref={jobsSectionRef}>
        <div className="jobs-featured">
          <div className="jobs-section-heading">
            <div>
              <h2>Featured Jobs</h2>
              <p className="jobs-section-sub">Handpicked opportunities from top employers in our community.</p>
            </div>
            <button type="button" className="jobs-link-btn" onClick={handleViewAllJobs}>
              View All Jobs →
            </button>
          </div>

          <div className="jobs-list">
            {jobsLoading && <p className="jobs-empty">Loading jobs…</p>}

            {!jobsLoading && jobsError && (
              <p className="jobs-empty jobs-error">
                {jobsError}{' '}
                <button type="button" className="jobs-link-btn" onClick={loadJobs}>
                  Retry
                </button>
              </p>
            )}

            {!jobsLoading && !jobsError && jobs.length === 0 && (
              <p className="jobs-empty">No jobs match your filters right now. Try a different keyword or category.</p>
            )}

            {!jobsLoading &&
              !jobsError &&
              jobs.map((job) => (
                <div
                  className="job-card"
                  key={job.id}
                  onClick={() => setSelectedJob(job)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') setSelectedJob(job)
                  }}
                >
                  <div className="job-card-avatar">{initialsFor(job.company)}</div>
                  <div className="job-card-info">
                    <h3>{job.title}</h3>
                    <p className="job-card-company">{job.company}</p>
                  </div>
                  <div className="job-card-meta">
                    <span className="job-card-location">📍 {job.location}</span>
                    <div className="job-card-tags">
                      {(job.tags || []).map((tag) => (
                        <span
                          key={tag}
                          className={`job-tag ${tag === 'Remote' ? 'job-tag-remote' : ''} ${tag === 'Internship' ? 'job-tag-internship' : ''}`}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <span className="job-card-posted">{timeAgo(job.created_at)}</span>
                  <a
                    className="job-apply-btn"
                    href={`mailto:${job.contactEmail}?subject=${encodeURIComponent(`Application: ${job.title}`)}`}
                    onClick={(e) => e.stopPropagation()}
                  >
                    Apply Now
                  </a>
                </div>
              ))}
          </div>
        </div>

        <aside className="jobs-employer-cta">
          <span className="jobs-employer-eyebrow">For Employers</span>
          <h3>Hiring? Reach the Indian Community</h3>
          <p>
            Post your job and connect with skilled, motivated, and diverse Indian talent in the USA &amp; India.
          </p>
          <button type="button" className="jobs-post-btn" onClick={() => setModalOpen(true)}>
            Post a Job →
          </button>
          <ul className="jobs-employer-points">
            <li>✔ Get noticed by qualified candidates</li>
            <li>✔ Target the Indian professional community</li>
            <li>✔ Flexible pricing plans</li>
            <li>✔ Support from our team</li>
          </ul>
          <p className="jobs-employer-tagline">Talent Builds Stronger Tomorrow</p>
        </aside>
      </section>

      {modalOpen && (
        <PostJobModal
          onClose={() => setModalOpen(false)}
          onPosted={handleJobPosted}
        />
      )}

      {selectedJob && (
        <JobDetailModal
          job={selectedJob}
          onClose={() => setSelectedJob(null)}
        />
      )}
    </div>
  )
}