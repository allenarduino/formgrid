import type { ImageAsset } from './types'

function photo(id: string, alt: string, credit: string, width = 1600, height = 2000): ImageAsset {
  return {
    src: `https://images.unsplash.com/${id}?auto=format&fit=crop&crop=entropy&w=${width}&h=${height}&q=80`,
    alt,
    credit,
    width,
    height,
  }
}

export const house = {
  name: 'Ulíng',
  tagline: 'Rice, vinegar, and whatever is on the menu tonight.',
  founded: 2022,
  street: '14 Creekside',
  locality: 'Deptford, London SE8 4SA',
  phone: '+44 20 8694 4182',
  email: 'tables@uling.kitchen',
  cuisine: 'Filipino grill',
}

export const hours = [
  { days: 'Tuesday to Thursday', service: '12.00 to 14.30, 18.00 to 22.00' },
  { days: 'Friday and Saturday', service: '12.00 to 15.00, 18.00 to 22.30' },
  { days: 'Sunday', service: '12.00 to 16.00' },
  { days: 'Monday', service: 'Closed' },
]

export const seatingNote =
  'Twelve tables. We hold a booking for fifteen minutes. Larger than eight, write to us first.'

export const takeawayNote =
  'The cart on the catalog is for bags to take home. A table is booked on Reservations. We do not mix the two.'

export const story = [
  'The unit still smells faintly of oil when it rains. Liza kept the pit. Tom kept the roller door. Ulíng opened in 2022 with twelve seats and a menu on a sheet.',
  'We cook the way a Manila afternoon grill does: fire first, rice always, vinegar on the table. Inihaw when the meat is right. Pickles when the jar is ready. One or two sweets if there is time.',
  'The catalog is a live sheet, shown through a menu widget. When a dish is gone, Liza marks it unavailable. You see what is actually on. That is the whole menu. There is not a second one.',
]

export const fireCopy = [
  'Lump charcoal and a little binchotan. No gas on the grill. Rice from the cooker at the back, not from a pan for show.',
  'Vinegar is cane and coconut. It cuts the smoke. If you want the food milder, say so. If you want it sharper, the bottle is already on the table.',
]

export const founders = [
  {
    name: 'Liza Santos',
    role: 'The fire',
    bio: 'Quezon City, then a long stretch of London kitchens that would not let her cook this way. She runs the catalog and the pit.',
  },
  {
    name: 'Tom Reeve',
    role: 'The room',
    bio: 'This unit used to sell parts. He still has the keys. Now he books tables, keeps the vinegar barrels, and knows who takes the last sisig.',
  },
]

export const photos = {
  hero: photo(
    'photo-1544025162-d76694265947',
    'Charred ribs and pickles on a board, fresh off the grill',
    'Alex Munsell',
    1600,
    1600
  ),
  intro: photo(
    'photo-1556910103-1c02745aae4d',
    'Hands working over a steel kitchen counter',
    'Chad Montano',
    1400,
    1750
  ),
  fire: photo(
    'photo-1615937657715-bc7b4b7962c1',
    'Steak and potatoes in a cast-iron pan',
    'Madie Hamilton',
    1800,
    1200
  ),
  room: photo(
    'photo-1517248135467-4c7edcad34c4',
    'A dim restaurant room with tables set for service',
    'Nick Karvounis',
    1800,
    1200
  ),
  rice: photo(
    'photo-1512058564366-18510be2db19',
    'A bowl of rice on a worn table',
    'Chad Montano',
    1400,
    1400
  ),
}

export const reservationTimes = [
  '12.00',
  '12.30',
  '13.00',
  '13.30',
  '18.00',
  '18.30',
  '19.00',
  '19.30',
  '20.00',
  '20.30',
  '21.00',
]
