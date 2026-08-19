'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import type { ImageAsset } from '@/data/types'

type Frame = 'hero' | 'portrait' | 'wide' | 'detail' | 'mosaic-wide' | 'mosaic-tall' | 'mosaic-mid' | 'related' | 'gallery'

const sizesMap: Record<Frame, string> = {
  hero: '(min-width: 900px) 55vw, 100vw',
  portrait: '(min-width: 900px) 40vw, 100vw',
  wide: '(min-width: 900px) 65vw, 100vw',
  detail: '100vw',
  'mosaic-wide': '(min-width: 900px) 66vw, 100vw',
  'mosaic-tall': '(min-width: 900px) 33vw, 100vw',
  'mosaic-mid': '(min-width: 900px) 50vw, 100vw',
  related: '(min-width: 900px) 45vw, 100vw',
  gallery: '(min-width: 900px) 33vw, 100vw',
}

type Props = {
  image: ImageAsset
  frame: Frame
  priority?: boolean
  zoom?: boolean
  delay?: number
}

export function Photo({ image, frame, priority, zoom = true, delay = 0 }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)
  const fullBleed = frame === 'hero' || frame === 'detail'

  useEffect(() => {
    const node = ref.current
    if (!node) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setInView(true)
          observer.disconnect()
        }
      },
      { threshold: 0.18, rootMargin: '0px 0px -8% 0px' }
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={`img-frame img-frame-${frame} ${zoom ? 'img-zoom' : ''} ${inView ? 'is-in' : ''} ${fullBleed ? 'img-frame-bleed' : ''}`}
      style={{ '--reveal-delay': `${delay}ms` } as React.CSSProperties}
    >
      <Image
        className="img-frame-media"
        src={image.src}
        alt={image.alt}
        fill
        sizes={sizesMap[frame]}
        priority={priority}
        style={{ objectFit: 'cover' }}
      />
      {fullBleed ? null : <span className="img-frame-shutter" aria-hidden />}
      <span className="img-frame-tick" aria-hidden />
    </div>
  )
}
