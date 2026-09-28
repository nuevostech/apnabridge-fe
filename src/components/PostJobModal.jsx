import { useEffect, useState } from 'react'
import { createJob } from '../utils/api'
import './PostJobModal.css'

const CATEGORY_OPTIONS = [
  { value: 'it', label: 'IT & Software' },
  { value: 'healthcare', label: 'Healthcare' },
  { value: 'finance', label: 'Finance' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'hospitality', label: 'Hospitality' },
  { value: 'retail', label: 'Retail' },
  { value: 'internships', label: 'Internships' },
  { value: 'remote', label: 'Remote Jobs' },
]

const INITIAL_FORM = {
  title: '',
  company: '',
  country: 'usa',
  location: '',
  category: 'it',
  jobType: 'Full-time',
  description: '',
  email: '',
}

export default function PostJobModal({ onClose, onPosted }) {
  const [form, setForm] = useState(INITIAL_FORM)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKeyDown)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = ''
    }
  }, [onClose])

  const handleChange = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setSubmitting(true)

    try {
      await createJob(form)
      setSubmitted(true)
      onPosted?.()
    } catch (err) {
      setError(err.message || 'Could not post the job. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="post-job-overlay" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="post-job-modal" role="dialog" aria-modal="true" aria-labelledby="post-job-title">
        <button type="button" className="post-job-close" aria-label="Close" onClick={onClose}>
          ×
        </button>

        {submitted ? (
          <div className="post-job-success">
            <span className="post-job-success-icon">✔</span>
            <h2>Job posted!</h2>
            <p>Your listing is submitted for review and will appear in Featured Jobs once approved.</p>
            <button type="button" className="jobs-post-btn" onClick={onClose}>
              Done
            </button>
          </div>
        ) : (
          <>
            <h2 id="post-job-title">Post a Job</h2>
            <p className="post-job-sub">Reach skilled, motivated Indian talent across the USA and India.</p>

            {error && <p className="post-job-error">{error}</p>}

            <form className="post-job-form" onSubmit={handleSubmit}>
              <label>
                Job title
                <input
                  type="text"
                  required
                  placeholder="e.g. Software Development Engineer"
                  value={form.title}
                  onChange={handleChange('title')}
                />
              </label>

              <label>
                Company name
                <input
                  type="text"
                  required
                  placeholder="e.g. Amazon"
                  value={form.company}
                  onChange={handleChange('company')}
                />
              </label>

              <div className="post-job-row">
                <label>
                  Country
                  <select value={form.country} onChange={handleChange('country')}>
                    <option value="usa">USA</option>
                    <option value="india">India</option>
                  </select>
                </label>

                <label>
                  Job type
                  <select value={form.jobType} onChange={handleChange('jobType')}>
                    <option>Full-time</option>
                    <option>Part-time</option>
                    <option>Internship</option>
                    <option>Contract</option>
                    <option>Remote</option>
                  </select>
                </label>
              </div>

              <label>
                Category
                <select value={form.category} onChange={handleChange('category')}>
                  {CATEGORY_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                Location
                <input
                  type="text"
                  required
                  placeholder="e.g. Seattle, WA or Bengaluru, India"
                  value={form.location}
                  onChange={handleChange('location')}
                />
              </label>

              <label>
                Job description
                <textarea
                  rows={4}
                  required
                  placeholder="Role, responsibilities, and requirements"
                  value={form.description}
                  onChange={handleChange('description')}
                />
              </label>

              <label>
                Contact email
                <input
                  type="email"
                  required
                  placeholder="hiring@company.com"
                  value={form.email}
                  onChange={handleChange('email')}
                />
              </label>

              <button type="submit" className="jobs-post-btn post-job-submit" disabled={submitting}>
                {submitting ? 'Posting…' : 'Post Job →'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}