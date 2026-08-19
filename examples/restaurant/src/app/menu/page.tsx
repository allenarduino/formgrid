import type { Metadata } from 'next'
import { SheetRocketMenu } from '@/components/SheetRocketMenu'
import { house, hours, takeawayNote } from '@/data/content'

export const metadata: Metadata = {
  title: 'Menu',
  description:
    'The Ulíng menu is a Sheetrocket catalog widget, loaded live from the kitchen sheet. Cart is takeaway. Tables are booked separately.',
  alternates: { canonical: '/menu' },
}

export default function MenuPage() {
  return (
    <section className="wrap band">
      <div className="menu-intro">
        <div>
          <p className="kicker">Catalog</p>
          <h1 className="display" style={{ fontSize: 'clamp(2.6rem, 6vw, 4.4rem)', maxWidth: '12ch' }}>
            The menu widget.
          </h1>
          <p className="lede" style={{ marginTop: '1rem' }}>
            A Sheetrocket catalog on this page. Liza writes the sheet. If a dish is gone, it is gone.
          </p>
        </div>
        <p className="caption">
          {hours.map((row) => (
            <span key={row.days} style={{ display: 'block' }}>
              {row.days}: {row.service}
            </span>
          ))}
          <span style={{ display: 'block', marginTop: '0.75rem' }}>
            {house.street}, {house.locality}
          </span>
        </p>
      </div>

      <SheetRocketMenu />

      <p className="lede" style={{ marginTop: 'var(--space-4)' }}>
        {takeawayNote}
      </p>
    </section>
  )
}
