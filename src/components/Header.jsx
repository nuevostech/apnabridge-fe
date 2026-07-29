import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import logo from '../assets/apnabridge-logo.png'

const NAV_LINKS = [
  { to: '/', label: 'Home', end: true },
  { to: '/businesses', label: 'Businesses' },
  { to: '/categories', label: 'Categories' },
  { to: '/promote', label: 'Promote Your Business' },
  { to: '/resources', label: 'Resources' },
  { to: '/about', label: 'About' },
]

export default function Header() {
  const [open, setOpen] = useState(false)

  return (
    <header className="site-header">
      <div className="site-header-inner">
        <NavLink to="/" className="brand" onClick={() => setOpen(false)}>
          <img src={logo} alt="ApnaBridge" className="brand-logo" />
        </NavLink>

        <button
          type="button"
          className="nav-toggle"
          aria-expanded={open}
          aria-label="Toggle navigation"
          onClick={() => setOpen((v) => !v)}
        >
          <span />
          <span />
          <span />
        </button>

        <nav className={`site-nav ${open ? 'is-open' : ''}`}>
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) => (isActive ? 'is-active' : '')}
              onClick={() => setOpen(false)}
            >
              {link.label}
            </NavLink>
          ))}
          <NavLink to="/contact" className="nav-cta" onClick={() => setOpen(false)}>
            Contact
          </NavLink>
        </nav>
      </div>
    </header>
  )
}
