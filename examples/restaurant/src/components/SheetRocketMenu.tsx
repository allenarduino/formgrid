'use client'

import { useEffect, useState } from 'react'

const SCRIPT_SRC = 'https://sheetrocket.com/catalog-widget.js'

export function SheetRocketMenu() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    const script = document.createElement('script')
    script.src = SCRIPT_SRC
    script.async = true
    script.dataset.ulingWidget = '1'
    document.body.appendChild(script)

    return () => {
      script.remove()
    }
  }, [mounted])

  if (!mounted) {
    return (
      <div className="menu-board-slot" aria-busy="true">
        <p className="caption">The catalog is coming up.</p>
      </div>
    )
  }

  return (
    <div style={{ padding: '1rem' }}
      data-sheetrocket="cmsuc4mu80003105r8yf6oedv"
      data-widget="menu-widget"
      data-sheet="cmsjk1a1d0001w0vxhz7v8kkz"
      data-tab="Sheet1"
      data-filter-column="Category"
      data-cart="true"
      data-button-label="Add to cart"
      data-row-filter-column="Status"
      data-row-filter-value="Available"
    ></div>


  )
}
