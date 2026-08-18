import type { ImageAsset } from '@/data/types'
import { Photo } from './Photo'

export function ImageGallery({ images }: { images: ImageAsset[] }) {
  return (
    <div className="gallery">
      {images.map((image) => (
        <figure key={image.src}>
          <Photo image={image} frame="gallery" zoom={false} />
          <figcaption className="caption">{image.credit}</figcaption>
        </figure>
      ))}
    </div>
  )
}
