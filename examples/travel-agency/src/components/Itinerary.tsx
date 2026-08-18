import type { ItineraryDay } from '@/data/types'

export function Itinerary({ days }: { days: ItineraryDay[] }) {
  return (
    <ol className="itinerary">
      {days.map((day) => (
        <li key={day.day}>
          <span className="day">Day {String(day.day).padStart(2, '0')}</span>
          <div>
            <h3 className="display" style={{ fontSize: '1.45rem', lineHeight: 1.15 }}>
              {day.title}
            </h3>
            <p style={{ marginTop: '0.45rem', color: 'var(--ink-soft)' }}>{day.body}</p>
          </div>
        </li>
      ))}
    </ol>
  )
}
