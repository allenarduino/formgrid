'use client'

import { FormEvent, useMemo, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import type { Destination, Inquiry, TourWithDestination } from '@/data/types'
import { submitInquiry } from '@/lib/formgrid/client'

const months = ['May', 'June', 'July', 'August', 'September', 'October', 'November', 'February']
const budgets = ['Under €3,500', '€3,500 to €4,500', '€4,500 to €6,000', 'Open']

type Props = {
  destinations: Destination[]
  tours: TourWithDestination[]
}

export function BookingForm({ destinations, tours }: Props) {
  const searchParams = useSearchParams()
  const presetTour = searchParams?.get('tour') ?? ''
  const [values, setValues] = useState<Inquiry>({
    name: '',
    email: '',
    phone: '',
    destinationSlug: tours.find((item) => item.slug === presetTour)?.destination.slug ?? '',
    tourSlug: presetTour,
    preferredMonth: '',
    travelers: 2,
    budget: '',
    notes: '',
  })
  const [error, setError] = useState('')
  const [sending, setSending] = useState(false)
  const [sentId, setSentId] = useState('')

  const availableTours = useMemo(
    () =>
      values.destinationSlug
        ? tours.filter((item) => item.destination.slug === values.destinationSlug)
        : tours,
    [tours, values.destinationSlug]
  )

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')

    if (!values.name.trim() || !values.email.trim() || !values.tourSlug || !values.preferredMonth) {
      setError('Name, email, a tour, and a month are enough to start. Those four are required.')
      return
    }

    setSending(true)
    try {
      const result = await submitInquiry(values)
      setSentId(result.id)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something did not send.')
    } finally {
      setSending(false)
    }
  }

  if (sentId) {
    return (
      <div className="success">
        <p className="kicker">Received</p>
        <h2 className="display" style={{ fontSize: '2.2rem' }}>
          We’ve received your note.
        </h2>
        <p style={{ marginTop: '1rem', color: 'var(--ink-soft)' }}>
          Inês or Callum will write back within two working days. Your reference is{' '}
          <span style={{ fontFamily: 'var(--font-mono)' }}>{sentId}</span>.
        </p>
      </div>
    )
  }

  return (
    <form className="form" onSubmit={onSubmit} noValidate>
      <label>
        Name
        <input
          name="name"
          autoComplete="name"
          value={values.name}
          onChange={(event) => setValues({ ...values, name: event.target.value })}
          required
        />
      </label>
      <label>
        Email
        <input
          name="email"
          type="email"
          autoComplete="email"
          value={values.email}
          onChange={(event) => setValues({ ...values, email: event.target.value })}
          required
        />
      </label>
      <label>
        Phone
        <input
          name="phone"
          type="tel"
          autoComplete="tel"
          value={values.phone}
          onChange={(event) => setValues({ ...values, phone: event.target.value })}
        />
      </label>
      <label>
        Destination
        <select
          name="destination"
          value={values.destinationSlug}
          onChange={(event) =>
            setValues({ ...values, destinationSlug: event.target.value, tourSlug: '' })
          }
        >
          <option value="">Any landscape</option>
          {destinations.map((destination) => (
            <option key={destination.slug} value={destination.slug}>
              {destination.name}
            </option>
          ))}
        </select>
      </label>
      <label>
        Tour
        <select
          name="tour"
          value={values.tourSlug}
          onChange={(event) => setValues({ ...values, tourSlug: event.target.value })}
          required
        >
          <option value="">Choose a week</option>
          {availableTours.map((tour) => (
            <option key={tour.slug} value={tour.slug}>
              {tour.title}
            </option>
          ))}
        </select>
      </label>
      <label>
        Preferred month
        <select
          name="month"
          value={values.preferredMonth}
          onChange={(event) => setValues({ ...values, preferredMonth: event.target.value })}
          required
        >
          <option value="">Select</option>
          {months.map((month) => (
            <option key={month} value={month}>
              {month}
            </option>
          ))}
        </select>
      </label>
      <label>
        Travellers
        <input
          name="travelers"
          type="number"
          min={1}
          max={12}
          value={values.travelers}
          onChange={(event) => setValues({ ...values, travelers: Number(event.target.value) })}
        />
      </label>
      <label>
        Budget
        <select
          name="budget"
          value={values.budget}
          onChange={(event) => setValues({ ...values, budget: event.target.value })}
        >
          <option value="">Prefer not to say</option>
          {budgets.map((budget) => (
            <option key={budget} value={budget}>
              {budget}
            </option>
          ))}
        </select>
      </label>
      <label>
        Notes
        <textarea
          name="notes"
          value={values.notes}
          onChange={(event) => setValues({ ...values, notes: event.target.value })}
        />
      </label>
      {error ? (
        <p className="form-error" role="alert">
          {error}
        </p>
      ) : null}
      <button className="btn" type="submit" disabled={sending}>
        {sending ? 'Sending' : 'Send the note'}
      </button>
    </form>
  )
}
