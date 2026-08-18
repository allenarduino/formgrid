import type { Inquiry, InquiryResult } from '../../data/types'

const endpoint = process.env.NEXT_PUBLIC_FORMGRID_ENDPOINT

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * Formgrid client. Safe for the browser so the static GitHub Pages build can post
 * without an API route. Mock today; POST to NEXT_PUBLIC_FORMGRID_ENDPOINT later.
 */
export async function submitInquiry(inquiry: Inquiry): Promise<InquiryResult> {
  if (endpoint) {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ formData: inquiry }),
    })

    if (!response.ok) {
      throw new Error('The house could not receive your note. Please try again.')
    }

    const data = (await response.json()) as { data?: { id?: string } }
    return { ok: true, id: data.data?.id ?? crypto.randomUUID() }
  }

  await delay(700)
  return { ok: true, id: `marram-${Date.now()}` }
}
