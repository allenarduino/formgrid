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
}

export function Photo({ image, frame, priority, zoom = true }: Props) {
  return (
    <div className={`img-frame img-frame-${frame} ${zoom ? 'img-zoom' : ''}`}>
      <Image
        src={image.src}
        alt={image.alt}
        fill
        sizes={sizesMap[frame]}
        priority={priority}
        style={{ objectFit: 'cover' }}
      />
    </div>
  )
}
