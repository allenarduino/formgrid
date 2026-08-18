'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

const links = [
  { href: '/tours', label: 'Tours' },
  { href: '/destinations', label: 'Destinations' },
  { href: '/about', label: 'The House' },
  { href: '/plan', label: 'Plan a journey', cta: true },
]

function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`)
}

export function Header() {
  const pathname = usePathname() ?? ''
  const [open, setOpen] = useState(false)

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <header className="site-header">
      <div className="header-inner">
        <Link href="/" className="wordmark">
          Marram
        </Link>
        <nav className="nav-desktop" aria-label="Primary">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={link.cta ? 'nav-cta' : undefined}
              aria-current={isActive(pathname, link.href) ? 'page' : undefined}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <button
          type="button"
          className="menu-toggle"
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((value) => !value)}
        >
          {open ? 'Close' : 'Menu'}
        </button>
      </div>
      <nav id="mobile-nav" className={open ? 'nav-panel open' : 'nav-panel'} aria-label="Mobile">
        {links.map((link) => (
          <Link key={link.href} href={link.href} aria-current={isActive(pathname, link.href) ? 'page' : undefined}>
            {link.label}
          </Link>
        ))}
        <Link href="/contact">Contact</Link>
      </nav>
    </header>
  )
}
