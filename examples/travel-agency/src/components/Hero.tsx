import Link from 'next/link'
import type { ImageAsset } from '@/data/types'
import { Photo } from './Photo'

type Props = {
  image: ImageAsset
  kicker: string
  title: string
  lede: string
  primary: { href: string; label: string }
  secondary: { href: string; label: string }
}

export function Hero({ image, kicker, title, lede, primary, secondary }: Props) {
  return (
    <section className="hero">
      <figure className="hero-figure">
        <Photo image={image} frame="hero" priority zoom={false} />
      </figure>
      <div className="hero-copy">
        <p className="kicker">{kicker}</p>
        <h1 className="display">{title}</h1>
        <p className="lede">{lede}</p>
        <div className="hero-actions">
          <Link className="btn" href={primary.href}>
            {primary.label}
          </Link>
          <Link href={secondary.href}>{secondary.label}</Link>
        </div>
      </div>
    </section>
  )
}
