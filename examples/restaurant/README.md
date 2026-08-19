# Ulíng: Formgrid and Sheetrocket example

A fictional Manila charcoal kitchen in Deptford, used to show a restaurant website whose **menu is not hardcoded**. The menu is a Sheetrocket catalog widget, pointed at a Google Sheet. Tables go through a Formgrid-shaped form.

This is not a dashboard demo. A visitor should see a kitchen. A developer can later point the reservation form at a live Formgrid endpoint.

[Examples index](../)

## The brand

**Ulíng** (oo-LING, Tagalog for charcoal) is a Filipino grill in a former auto shop at 14 Creekside, Deptford. Liza Santos on the fire. Tom Reeve on the room. Twelve tables. Rice, vinegar, smoke.

Visitor line: rice, vinegar, and whatever is on the menu tonight.

## Run it

From the repository root (after `pnpm install`):

```bash
pnpm example:restaurant
```

Or from this folder:

```bash
pnpm install
pnpm dev
```

Open [http://localhost:5175](http://localhost:5175). The Formgrid dashboard does not need to be running.

```bash
pnpm build
pnpm start
```

`pnpm build` writes a static site to `out/`. `pnpm start` serves that folder.

## What it demonstrates

- A live menu from Google Sheets via the Sheetrocket catalog widget (categories, availability, cart, Place order)
- A realistic reservation flow: visitor → `/reservations` → `submitReservation()` → Formgrid-shaped submission
- A clear split: food checkout stays inside the widget; tables stay on Formgrid
- App Router metadata, sitemap, robots, and Restaurant JSON-LD
- Static export, independently runnable from the travel example

## The menu (Sheetrocket)

There is **one menu**: the embed on `/menu`. Dishes are not duplicated in React.

The widget is mounted only on that page, after hydration, with this config (do not change the ids unless you own the sheet):

```html
<div
  data-sheetrocket="cmsuc4mu80003105r8yf6oedv"
  data-widget="menu-widget"
  data-sheet="cmsjk1a1d0001w0vxhz7v8kkz"
  data-tab="Sheet1"
  data-columns="4"
  data-filter-column="Category"
  data-cart="true"
  data-button-label="Add to cart"
  data-row-filter-column="Status"
  data-row-filter-value="Available"
></div>
<script src="https://sheetrocket.com/catalog-widget.js" async></script>
```

The kitchen marks rows `Available` or not. The widget filters to `Available`. Cart and **Place order** post to Sheetrocket (`POST /api/widgets/{id}/orders`). This example does not build a second cart.

Light page CSS sits the catalog on bone. The widget keeps its own controls.

## Reservations (Formgrid)

```
src/data/content.ts          House copy, hours, address. Not dishes.
src/lib/formgrid/client.ts   submitReservation() and submitContact()
```

### Connect Formgrid later

1. Create a form in Formgrid.
2. Set the public endpoint (this value is inlined at build time):

```bash
NEXT_PUBLIC_FORMGRID_ENDPOINT=https://your-instance/api/f/uling-tables
```

3. `submitReservation` already POSTs `{ formData: reservation }` when that variable is set.

Optional: `NEXT_PUBLIC_SITE_URL` for canonical URLs and the sitemap (defaults to `http://localhost:5175`).

Without the endpoint, the form waits 700ms and returns a local reference id. Nothing is stored on a server.

## Stack

Next.js 14 App Router, React 18, TypeScript. CSS variables in `src/styles/tokens.css`. No Tailwind.

## Pages

| Path | Page |
|------|------|
| `/` | Home |
| `/menu` | Menu (Sheetrocket catalog widget) |
| `/about` | The room |
| `/reservations` | Table form |
| `/contact` | Address, hours, a note |

## Photographs

Images are curated Unsplash URLs with photographer credits in captions. Replace with licensed originals in `public/images/` when this is more than an example.
