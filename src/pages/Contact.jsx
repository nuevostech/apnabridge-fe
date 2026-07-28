import { useState } from 'react'

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [sent, setSent] = useState(false)

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    setSent(true)
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
              <button type="submit" className="btn btn-primary">
                Send Message
              </button>
            </>
          )}
        </form>

        <div className="contact-direct">
          <h2>Direct</h2>
          <a href="https://wa.me/10000000000" target="_blank" rel="noreferrer" className="contact-direct-link">
            WhatsApp
          </a>
          <a href="mailto:hello@apnabridge.com" className="contact-direct-link">
            hello@apnabridge.com
          </a>
        </div>
      </div>
    </section>
  )
}
