import { Link } from 'react-router-dom'

export default function About() {
  return (
    <section className="section about-page">
      <div className="section-head">
        <h1>About ApnaBridge</h1>
      </div>

      <div className="about-block">
        <h2>Our Mission</h2>
        <p>
          ApnaBridge connects Indian-owned businesses with the community across the USA and
          India — making it simple for customers to find trusted local businesses, and for
          business owners to be found by them.
        </p>
      </div>

      <div className="about-block">
        <h2>Why ApnaBridge</h2>
        <p>
          Most directories treat every business the same. ApnaBridge is built around one
          community — with filters for state, city and category that actually match how people
          search, a WhatsApp-first way to reach owners directly, and a free 100-day start so
          listing has no upfront cost.
        </p>
      </div>

      <Link to="/promote" className="btn btn-primary">
        List Your Business
      </Link>
    </section>
  )
}
