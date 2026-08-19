'use client'

import { useEffect } from 'react'

export function MotionInit() {
  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const apply = () => {
      document.documentElement.classList.toggle('js-motion', !media.matches)
    }
    apply()
    media.addEventListener('change', apply)
    return () => media.removeEventListener('change', apply)
  }, [])

  return null
}
