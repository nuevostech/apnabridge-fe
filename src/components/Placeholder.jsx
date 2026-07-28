import { colorFor, initials } from '../utils/avatar'

export function LogoPlaceholder({ name, size = 56 }) {
  return (
    <div
      className="logo-placeholder"
      style={{ background: colorFor(name), width: size, height: size, fontSize: size * 0.4 }}
      aria-hidden="true"
    >
      {initials(name)}
    </div>
  )
}

export function CoverPlaceholder({ name, className = '' }) {
  const color = colorFor(name)
  return (
    <div
      className={`cover-placeholder ${className}`}
      style={{ background: `linear-gradient(135deg, ${color}, var(--ink))` }}
      aria-hidden="true"
    >
      <span>{initials(name)}</span>
    </div>
  )
}
