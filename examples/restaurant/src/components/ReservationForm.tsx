'use client'

import { FormEvent, useMemo, useState } from 'react'
import { reservationTimes } from '@/data/content'
import type { Reservation } from '@/data/types'
import { submitReservation } from '@/lib/formgrid/client'

export function ReservationForm() {
  const minDate = useMemo(() => new Date().toISOString().slice(0, 10), [])
  const [values, setValues] = useState<Reservation>({
    name: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    guests: 2,
    requests: '',
  })
  const [error, setError] = useState('')
  const [sending, setSending] = useState(false)
  const [sentId, setSentId] = useState('')

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')

    if (!values.name.trim() || !values.email.trim() || !values.date || !values.time) {
      setError('Name, email, a date, and a time. Those four are required.')
      return
    }

    setSending(true)
    try {
      const result = await submitReservation(values)
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
        <h2 className="display" style={{ fontSize: '2.1rem' }}>
          We have the note.
        </h2>
        <p style={{ marginTop: '1rem', color: 'var(--ink-soft)' }}>
          Tom writes back the same day if he can, the next morning if he cannot. We will hold the
          table or tell you plainly that we cannot. Your reference is{' '}
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
          type="text"
          name="name"
          autoComplete="name"
          value={values.name}
          onChange={(event) => setValues({ ...values, name: event.target.value })}
        />
      </label>
      <label>
        Email
        <input
          type="email"
          name="email"
          autoComplete="email"
          value={values.email}
          onChange={(event) => setValues({ ...values, email: event.target.value })}
        />
      </label>
      <label>
        Phone
        <input
          type="tel"
          name="phone"
          autoComplete="tel"
          value={values.phone}
          onChange={(event) => setValues({ ...values, phone: event.target.value })}
        />
      </label>
      <label>
        Guests
        <select
          name="guests"
          value={values.guests}
          onChange={(event) => setValues({ ...values, guests: Number(event.target.value) })}
        >
          {Array.from({ length: 8 }, (_, index) => index + 1).map((count) => (
            <option key={count} value={count}>
              {count}
            </option>
          ))}
        </select>
      </label>
      <label>
        Date
        <input
          type="date"
          name="date"
          min={minDate}
          value={values.date}
          onChange={(event) => setValues({ ...values, date: event.target.value })}
        />
      </label>
      <label>
        Time
        <select
          name="time"
          value={values.time}
          onChange={(event) => setValues({ ...values, time: event.target.value })}
        >
          <option value="">Choose a sitting</option>
          {reservationTimes.map((time) => (
            <option key={time} value={time}>
              {time}
            </option>
          ))}
        </select>
      </label>
      <label className="form-span">
        Requests
        <textarea
          name="requests"
          value={values.requests}
          onChange={(event) => setValues({ ...values, requests: event.target.value })}
          placeholder="Allergies, a high chair, a reason to linger."
        />
      </label>
      {error ? (
        <p className="form-error form-span" role="alert">
          {error}
        </p>
      ) : null}
      <button className="btn" type="submit" disabled={sending}>
        {sending ? 'Sending' : 'Request the table'}
      </button>
    </form>
  )
}
