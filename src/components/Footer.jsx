import { Link } from 'react-router-dom'
import logo from '../assets/apnabridge-logo.png'

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        <div className="footer-col">
          <img src={logo} alt="ApnaBridge" className="brand-logo footer-logo" />
          <p>Promoting Indian businesses across the USA and India.</p>
        </div>

        <div className="footer-col">
          <h4>Explore</h4>
          <Link to="/businesses">Businesses</Link>
          <Link to="/categories">Categories</Link>
          <Link to="/promote">Promote Your Business</Link>
          <Link to="/resources">Resources</Link>
        </div>

        <div className="footer-col">
          <h4>Company</h4>
          <Link to="/about">About</Link>
          <Link to="/contact">Contact</Link>
        </div>

        <div className="footer-col">
          <h4>Stay connected</h4>
          <a href="https://wa.me/10000000000" target="_blank" rel="noreferrer">
            Join WhatsApp Community
          </a>
          <a href="mailto:hello@apnabridge.com">hello@apnabridge.com</a>
        </div>
      </div>
      <div className="site-footer-bottom">
        <p>&copy; {new Date().getFullYear()} ApnaBridge. All rights reserved.</p>
      </div>
    </footer>
  )
}
