import type { ContactNote, FormResult, Reservation } from '../../data/types'

const endpoint = process.env.NEXT_PUBLIC_FORMGRID_ENDPOINT

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * Formgrid client. Safe for the browser so a static export can post
 * without an API route. Mock today; POST to NEXT_PUBLIC_FORMGRID_ENDPOINT later.
 */
export async function submitReservation(reservation: Reservation): Promise<FormResult> {
  return postForm(reservation, 'The kitchen could not take that booking. Please try again.')
}

export async function submitContact(note: ContactNote): Promise<FormResult> {
  return postForm(note, 'The note did not send. Please try again.')
}

async function postForm(formData: Reservation | ContactNote, failMessage: string): Promise<FormResult> {
  if (endpoint) {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ formData }),
    })

    if (!response.ok) {
      throw new Error(failMessage)
    }

    const data = (await response.json()) as { data?: { id?: string } }
    return { ok: true, id: data.data?.id ?? crypto.randomUUID() }
  }

  await delay(700)
  return { ok: true, id: `uling-${Date.now()}` }
}
