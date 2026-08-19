export type ImageAsset = {
  src: string
  alt: string
  credit: string
  width: number
  height: number
}

export type Reservation = {
  name: string
  email: string
  phone: string
  date: string
  time: string
  guests: number
  requests: string
}

export type ContactNote = {
  name: string
  email: string
  message: string
}

export type FormResult = {
  ok: true
  id: string
}
