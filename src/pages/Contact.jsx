import { useState } from 'react'
import { sendContactMessage } from '../utils/api'
import { whatsappGroups } from '../data/whatsapp'

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [sent, setSent] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSubmitting(true)
    setSubmitError('')

    try {
      await sendContactMessage(form)
      setSent(true)
    } catch (err) {
      setSubmitError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="section contact-page">
      <div className="section-head">
        <h1>Contact</h1>
        <p className="lede">Questions about a listing or ApnaBridge in general? Reach out.</p>
      </div>

      <div className="contact-grid">
        <form className="contact-form" onSubmit={handleSubmit}>
          {sent ? (
            <div className="form-success">
              <h2>Message sent</h2>
              <p>Thanks, {form.name || 'there'} — we'll get back to you shortly.</p>
            </div>
          ) : (
            <>
              <label>
                Name
                <input required value={form.name} onChange={(e) => update('name', e.target.value)} />
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
              <label>
                Message
                <textarea
                  required
                  rows={5}
                  value={form.message}
                  onChange={(e) => update('message', e.target.value)}
                />
              </label>
              {submitError && <p className="form-error">{submitError}</p>}
              <button type="submit" className="btn btn-primary" disabled={submitting}>
                {submitting ? 'Sending…' : 'Send Message'}
              </button>
            </>
          )}
        </form>

        <div className="contact-direct">
          <h2>Direct</h2>
          <a href={whatsappGroups.USA} target="_blank" rel="noreferrer" className="contact-direct-link">
            🇺🇸 WhatsApp (USA)
          </a>
          <a href={whatsappGroups.India} target="_blank" rel="noreferrer" className="contact-direct-link">
            🇮🇳 WhatsApp (India)
          </a>
          <a href="mailto:hello@apnabridge.com" className="contact-direct-link">
            hello@apnabridge.com
          </a>
        </div>
      </div>
    </section>
  )
}