'use client'

import { FormEvent, useState } from 'react'
import type { ContactNote } from '@/data/types'
import { submitContact } from '@/lib/formgrid/client'

export function ContactForm() {
  const [values, setValues] = useState<ContactNote>({ name: '', email: '', message: '' })
  const [error, setError] = useState('')
  const [sending, setSending] = useState(false)
  const [sentId, setSentId] = useState('')

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')

    if (!values.name.trim() || !values.email.trim() || !values.message.trim()) {
      setError('Name, email, and a message. All three.')
      return
    }

    setSending(true)
    try {
      const result = await submitContact(values)
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
          It landed.
        </h2>
        <p style={{ marginTop: '1rem', color: 'var(--ink-soft)' }}>
          If it is about a table, we will treat it as one. Your reference is{' '}
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
      <label className="form-span">
        Message
        <textarea
          name="message"
          value={values.message}
          onChange={(event) => setValues({ ...values, message: event.target.value })}
        />
      </label>
      {error ? (
        <p className="form-error form-span" role="alert">
          {error}
        </p>
      ) : null}
      <button className="btn" type="submit" disabled={sending}>
        {sending ? 'Sending' : 'Send the note'}
      </button>
    </form>
  )
}
