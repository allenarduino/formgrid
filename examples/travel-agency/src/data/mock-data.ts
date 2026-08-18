import type { Destination, ImageAsset, Testimonial, Tour } from './types'

function photo(
  id: string,
  alt: string,
  credit: string,
  width: number,
  height: number,
  crop = 'w=1600'
): ImageAsset {
  return {
    src: `https://images.unsplash.com/${id}?auto=format&fit=crop&${crop}&q=80`,
    alt,
    credit,
    width,
    height,
  }
}

export const destinations: Destination[] = [
  {
    id: 'faroe',
    slug: 'faroe',
    name: 'The Faroe Islands',
    region: 'North Atlantic',
    country: 'Faroe Islands',
    standfirst: 'Eighteen islands, a ferry timetable, and weather that is part of the itinerary.',
    overview:
      'The Faroes reward people who stay long enough for a second walk in the same valley. Villages keep their own rhythms. The cliffs are famous; the inlets and the turf farms are why we return. This is not a country you cross. It is a small Atlantic you learn by walking.',
    whenToGo: 'June to September, when the ferries are least likely to strand you overnight, though they still might.',
    hero: photo(
      'photo-1534313314376-a72289b6181e',
      'Turf-roofed houses above a Faroese inlet under low cloud',
      'Benjamin Pietri',
      1600,
      1067
    ),
    gallery: [
      photo('photo-1519904981063-b0cf448d479e', 'Cliffs dropping into the North Atlantic', 'Benjamin Pietri', 1600, 2000, 'w=1200'),
      photo('photo-1470071459604-3b5ec3a7fe05', 'Mist moving through a green valley', 'v2osk', 1600, 1067),
    ],
  },
  {
    id: 'extremadura',
    slug: 'extremadura',
    name: 'Extremadura',
    region: 'Western Spain',
    country: 'Spain',
    standfirst: 'Dehesa, granite, and towns that most travellers skip on the way to Andalusia.',
    overview:
      'Extremadura is oak country. The light in November is low and useful. Kitchens still keep their own pigs. Roman stones in Mérida are a half-day, not a reason to rush the sierra. We come here because the landscape is still a working one.',
    whenToGo: 'November for the montanera and empty roads. Spring is milder and less interesting to us.',
    hero: photo(
      'photo-1558642452-9d2a7deb7f62',
      'Stone village lane in western Spain in late-afternoon light',
      'Javi Sanz',
      1600,
      1067
    ),
    gallery: [
      photo('photo-1414235077428-798356cebc26', 'A set table in a dim dining room', 'Jay Wennington', 1600, 1067),
      photo('photo-1470770841072-f971796a3aa9', 'A house by water at dusk', 'Luca Bravo', 1600, 1066),
    ],
  },
  {
    id: 'nakasendo',
    slug: 'nakasendo',
    name: 'Nakasendo',
    region: 'Kiso Valley',
    country: 'Japan',
    standfirst: 'The old inland road, walked in sections, before the maples become a crowd.',
    overview:
      'The Nakasendo is not a trail you complete for a badge. We walk the stages that still feel like a road between towns: cedar, stone, one dinner at one time. Luggage goes by van. Kyoto is an ending, not a checklist.',
    whenToGo: 'Late October, shoulder season, when rooms in the post towns are still available.',
    hero: photo(
      'photo-1524413840807-0c3cb6fa808d',
      'Mount Fuji seen across water on a still morning',
      'David Chen',
      1600,
      1067
    ),
    gallery: [
      photo('photo-1493976040374-85c8e12f0c0e', 'A Kyoto temple roof among trees', 'Su San Lee', 1600, 2000, 'w=1200'),
      photo('photo-1528360983277-13d401cdc186', 'Paper lanterns along a night street', 'Sorasak', 1600, 1067),
    ],
  },
  {
    id: 'harris',
    slug: 'harris',
    name: 'Harris & the Small Isles',
    region: 'Outer Hebrides',
    country: 'Scotland',
    standfirst: 'Machair, single-track, and ferries that still run to a printed timetable.',
    overview:
      'Harris is Callum’s home water. The beaches are photographed constantly; we go early or choose the east lochs. A week here is weather, walking, and one ferry to a smaller island. Doing very little is sometimes the correct day.',
    whenToGo: 'May and September. Midges in May are real. September is kinder.',
    hero: photo(
      'photo-1506377247377-2a5b3b417ebb',
      'A Scottish glen under broken cloud',
      'Robert Lukeman',
      1600,
      1067
    ),
    gallery: [
      photo('photo-1418065460487-3e41a6c84dc5', 'A misted pine forest', 'Sebastian Unrau', 1600, 1067),
      photo('photo-1501785888041-af3ef285b470', 'A mountain road above a lake', 'Luca Bravo', 1600, 1066),
    ],
  },
  {
    id: 'oaxaca',
    slug: 'oaxaca',
    name: 'Oaxaca highlands',
    region: 'Sierra Norte',
    country: 'Mexico',
    standfirst: 'Markets first, then the sierra, at the pace of a combi that waits.',
    overview:
      'The city is not a backdrop. Three nights among stalls and kitchens, then up to a Zapotec village that hosts walkers properly. Inês first came for a map and kept returning. Altitude is part of the plan, not a surprise.',
    whenToGo: 'February and November. We usually miss the thickest Day of the Dead crowds on purpose.',
    hero: photo(
      'photo-1518638150340-f706e86654de',
      'A Mexican courtyard with painted walls and deep shade',
      'Alex Azabache',
      1600,
      2000,
      'w=1200'
    ),
    gallery: [
      photo('photo-1568402102990-bc067fb68adb', 'Colour-washed street facade', 'Jezael Melgoza', 1600, 1067),
      photo('photo-1556910103-1c0279aa1bd0', 'Hands working in a kitchen', 'Roberto Nickson', 1600, 1067),
    ],
  },
  {
    id: 'albania',
    slug: 'albania',
    name: 'Albanian coast',
    region: 'Himarë to Porto Palermo',
    country: 'Albania',
    standfirst: 'The road before the season, when tavernas are still for the village.',
    overview:
      'May water is cold. The paths are old mule tracks. Rooms sit above family kitchens. This is not the Riviera of the posters, and that is why the week works. Tirana is a long transfer; we do not pretend otherwise.',
    whenToGo: 'May, before the coast fills. Summer is a different place.',
    hero: photo(
      'photo-1498307833015-e7b400441eb8',
      'A steep Mediterranean coast with a town on the water',
      'Heidi Kaden',
      1600,
      1067
    ),
    gallery: [
      photo('photo-1516483638261-f4dbaf036963', 'Harbour houses stacked above the sea', 'Heidi Kaden', 1600, 2000, 'w=1200'),
      photo('photo-1507525428034-b723cf961d3e', 'A quiet beach under a pale sky', 'Sean Oulashin', 1600, 1067),
    ],
  },
]

export const tours: Tour[] = [
  {
    id: 'faroe-on-foot',
    slug: 'faroe-on-foot',
    destinationSlug: 'faroe',
    title: 'Faroe, on foot',
    standfirst: 'Nine days of turf roofs, sheep paths, and weather that changes its mind twice before lunch.',
    overview:
      'We walk between villages that still keep their own ferry timetable. Distances are short on the map and long in the legs, because the wind is a companion you negotiate with. Nights are in small guesthouses where dinner is whatever came off the boat. This is not a peak-bagging week. It is a week of looking carefully at a very particular Atlantic.',
    durationDays: 9,
    experienceType: 'Walking',
    startingPrice: 4280,
    currency: 'EUR',
    groupSize: 8,
    season: 'June to September',
    fitness: 'Steady hill walking, 12 to 18 km most days, some exposure.',
    featured: false,
    hero: photo(
      'photo-1534313314376-a72289b6181e',
      'Turf-roofed houses above a Faroese inlet under low cloud',
      'Benjamin Pietri',
      1600,
      1067
    ),
    gallery: [
      photo('photo-1519904981063-b0cf448d479e', 'Cliffs dropping into the North Atlantic', 'Benjamin Pietri', 1600, 2000, 'w=1200'),
      photo('photo-1464822759023-fed622ff2c3b', 'A high ridge above cloud', 'Kalen Emsley', 1600, 1067),
      photo('photo-1470071459604-3b5ec3a7fe05', 'Mist moving through a green valley', 'v2osk', 1600, 1067),
    ],
    itinerary: [
      { day: 1, title: 'Tórshavn', body: 'Arrive by air. Walk the old town in the evening, when the harbour lights come on and the wind drops, or does not.' },
      { day: 2, title: 'Nólsoy', body: 'Ferry out. A loop around the island with puffins in season and a village café that closes when it feels like it.' },
      { day: 3, title: 'Vágar', body: 'Lake to cliff. The path to Trælanípa is short and the drop is not. We take it slowly and eat rye in the car after.' },
      { day: 4, title: 'Saksun', body: 'A tidal lagoon, a turf church, and a walk that turns back when the water says so.' },
      { day: 5, title: 'Kalsoy', body: 'The tunnel island. Lighthouse at the end of the road, then the path beyond it.' },
      { day: 6, title: 'Klaksvík', body: 'A rest morning. Fish soup, a bookshop, and the northern harbour.' },
      { day: 7, title: 'Viðareiði', body: 'The northernmost village. Out and back on a sheep path with the sea on three sides.' },
      { day: 8, title: 'Kirkjubøur', body: 'Medieval stones and a working farm. We walk the old route from the capital and stay for coffee in the farmhouse.' },
      { day: 9, title: 'Depart', body: 'Morning flights. Weather permitting, which it often is not. We build a buffer into the plan.' },
    ],
    included: [
      'Eight nights in family-run guesthouses',
      'Breakfasts and six dinners',
      'All island ferries and private transfers',
      'Walking guide throughout',
      'Printed field booklet, posted two weeks prior',
    ],
    notIncluded: ['International flights', 'Lunches', 'Travel insurance', 'Drinks beyond table water'],
    practical: [
      'Pack a shell you trust and boots already worn in.',
      'June still sees closed cafés on Sundays.',
      'We meet at Vágar Airport at 14:00 on day one.',
    ],
    relatedSlugs: ['harris-small-isles', 'albania-before-the-season'],
  },
  {
    id: 'extremadura-november',
    slug: 'extremadura-november',
    destinationSlug: 'extremadura',
    title: 'Extremadura, November',
    standfirst: 'Dehesa, woodsmoke, and the week the ibérico pigs move under the oaks.',
    overview:
      'November in Extremadura is for people who like a low sun and a long lunch. We base in a restored casa in the sierra, walk out through holm oak and granite, and eat in kitchens that still keep their own pigs. Mérida’s Roman stones are a half-day, not a checklist. This week is about a landscape that most travellers skip on the way to Andalusia.',
    durationDays: 8,
    experienceType: 'Winter',
    startingPrice: 3640,
    currency: 'EUR',
    groupSize: 10,
    season: 'November',
    fitness: 'Easy to moderate walking. Some days are mostly eating.',
    featured: true,
    hero: photo(
      'photo-1558642452-9d2a7deb7f62',
      'Stone village lane in western Spain in late-afternoon light',
      'Javi Sanz',
      1600,
      1067
    ),
    gallery: [
      photo('photo-1414235077428-798356cebc26', 'A set table in a dim dining room', 'Jay Wennington', 1600, 1067),
      photo('photo-1504674900247-0877df9cc836', 'A plate of slow-cooked food', 'Brooke Lark', 1600, 1067),
      photo('photo-1470770841072-f971796a3aa9', 'A house by water at dusk', 'Luca Bravo', 1600, 1066),
    ],
    itinerary: [
      { day: 1, title: 'Cáceres', body: 'Arrive into the old town after dark. A short walk, a simple supper, beds in a house with thick walls.' },
      { day: 2, title: 'Into the sierra', body: 'Transfer west. Settle into the casa. Afternoon walk among the oaks. Fire in the evening.' },
      { day: 3, title: 'Dehesa circuit', body: 'A full day on estate tracks. If the montanera has begun, we keep a polite distance from the pigs.' },
      { day: 4, title: 'Kitchen morning', body: 'With a cook who still makes migas the way her grandmother did. Lunch lasts until the light slants.' },
      { day: 5, title: 'Mérida', body: 'The theatre, the bridge, the museum if anyone wants it. Back before dark for soup.' },
      { day: 6, title: 'Trujillo and the plains', body: 'A hill town and a long view. We do not linger in souvenir streets.' },
      { day: 7, title: 'Last walk', body: 'A shorter loop, a longer lunch, packing that can wait.' },
      { day: 8, title: 'Out via Madrid or Seville', body: 'Morning transfer. We time it for the late-morning trains.' },
    ],
    included: [
      'Seven nights, two houses',
      'Breakfasts and five dinners, one cooking morning',
      'Private van throughout',
      'Host from the house',
      'Field booklet',
    ],
    notIncluded: ['Flights', 'Two free lunches', 'Wine beyond the table pour at dinners we host'],
    practical: [
      'Nights near freezing. Days often clear.',
      'Nearest airport: Madrid or Seville, then train or our transfer.',
      'This week runs once. If it fills, we wait until next November.',
    ],
    relatedSlugs: ['oaxaca-highlands', 'harris-small-isles'],
  },
  {
    id: 'nakasendo-shoulder',
    slug: 'nakasendo-shoulder',
    destinationSlug: 'nakasendo',
    title: 'Nakasendo, shoulder season',
    standfirst: 'Ten days on the old inland road, Magome to the Kyoto basin, before the maples are a crowd.',
    overview:
      'We walk sections of the Nakasendo when the post towns still have rooms and the cedar forests are quiet. Luggage goes by road. You walk with a daypack. Nights are in family inns that serve one dinner, at one time, and expect you to be on time. Callum has walked this road in three seasons; this departure is the one he prefers.',
    durationDays: 10,
    experienceType: 'Walking',
    startingPrice: 5120,
    currency: 'EUR',
    groupSize: 8,
    season: 'Late October',
    fitness: 'Daily walking 10 to 16 km on stone, root, and tarmac. Some climbs.',
    hero: photo(
      'photo-1524413840807-0c3cb6fa808d',
      'Mount Fuji seen across water on a still morning',
      'David Chen',
      1600,
      1067
    ),
    gallery: [
      photo('photo-1493976040374-85c8e12f0c0e', 'A Kyoto temple roof among trees', 'Su San Lee', 1600, 2000, 'w=1200'),
      photo('photo-1528360983277-13d401cdc186', 'Paper lanterns along a night street', 'Sorasak', 1600, 1067),
      photo('photo-1545569341-9eb8b5644453', 'A gravel courtyard and timber gate', 'Manuel Cosentino', 1600, 1067),
    ],
    itinerary: [
      { day: 1, title: 'Tokyo, evening only', body: 'Arrive. One night near Tokyo Station. We eat nearby and sleep early.' },
      { day: 2, title: 'To Magome', body: 'Shinkansen, then a local line. Afternoon acclimatising walk through the post town.' },
      { day: 3, title: 'Magome to Tsumago', body: 'The classic stage, done slowly, with tea at the halfway house if it is open.' },
      { day: 4, title: 'Tsumago rest', body: 'A short ridge walk or a morning in the temple. Luggage stays put.' },
      { day: 5, title: 'Nagiso to Kiso-Fukushima', body: 'A working town, a proper bath, a dinner that is not performance.' },
      { day: 6, title: 'Narai', body: 'The longest preserved street. We stay in a house that still has a noren on the door.' },
      { day: 7, title: 'Torii Pass', body: 'Up and over. The view is not guaranteed. The forest is.' },
      { day: 8, title: 'To Kyoto', body: 'Train afternoon. Evening in a neighbourhood inn, not a riverside hotel.' },
      { day: 9, title: 'Kyoto basin walk', body: 'Fushimi to the quieter side of the Higashiyama if the crowds allow; otherwise the canal paths north.' },
      { day: 10, title: 'Depart', body: 'Kansai or Tokyo connections. We stay with you until the station.' },
    ],
    included: [
      'Nine nights in inns and one city hotel',
      'Breakfasts and eight dinners',
      'Luggage transfers on walking days',
      'Rail passes as required for the route',
      'Bilingual walking host',
    ],
    notIncluded: ['Long-haul flights', 'Lunches', 'Onsen extras', 'Personal rail beyond the itinerary'],
    practical: [
      'A light pack is enough. We move bags for you.',
      'Tatami rooms. If stairs or futons are a problem, tell us before you book.',
      'October rain is ordinary. Bring a serious shell.',
    ],
    relatedSlugs: ['faroe-on-foot', 'oaxaca-highlands'],
  },
  {
    id: 'harris-small-isles',
    slug: 'harris-small-isles',
    destinationSlug: 'harris',
    title: 'Harris and the small isles',
    standfirst: 'Eight days of machair, single-track, and ferries that still run to a printed timetable.',
    overview:
      'Callum is from here. The week is not a greatest-hits of the Hebrides. We stay on Harris, take one ferry to a small isle, and spend a day doing very little because the weather asked us to. Evenings are in a house that looks at the Sound of Taransay. The beaches are famous. We go early or not at all.',
    durationDays: 8,
    experienceType: 'Coast',
    startingPrice: 3890,
    currency: 'EUR',
    groupSize: 8,
    season: 'May and September',
    fitness: 'Coastal walking on sand, bog, and rock. One longer ridge optional.',
    hero: photo(
      'photo-1506377247377-2a5b3b417ebb',
      'A Scottish glen under broken cloud',
      'Robert Lukeman',
      1600,
      1067
    ),
    gallery: [
      photo('photo-1418065460487-3e41a6c84dc5', 'A misted pine forest', 'Sebastian Unrau', 1600, 1067),
      photo('photo-1476514525535-07fb3b4ae5f1', 'A small boat on still water', 'Luca Bravo', 1600, 1067),
      photo('photo-1501785888041-af3ef285b470', 'A mountain road above a lake', 'Luca Bravo', 1600, 1066),
    ],
    itinerary: [
      { day: 1, title: 'Tarbert', body: 'Ferry from Uig or Skye. Settle. First walk to the harbour in whatever light is left.' },
      { day: 2, title: 'West coast beaches', body: 'Luskentyre if the tide and the coaches allow; otherwise Seilebost and a flask.' },
      { day: 3, title: 'Harris hills', body: 'A modest ridge with a large view. Optional short day for anyone who prefers the shore.' },
      { day: 4, title: 'Stornoway market day', body: 'North for black pudding, a bookshop, and the museum if it is open.' },
      { day: 5, title: 'Small isle', body: 'A day ferry. Packed lunch. Back for a late supper.' },
      { day: 6, title: 'Weather day', body: 'Held in the plan on purpose. Walking, reading, or a distillery depending on the sky.' },
      { day: 7, title: 'East lochs', body: 'The quieter side. Otters if we are lucky. We are often not. Still worth it.' },
      { day: 8, title: 'South', body: 'Ferry off. We do not rush the morning.' },
    ],
    included: [
      'Seven nights in two houses',
      'Breakfasts and five dinners',
      'Island ferries listed in the booklet',
      'Callum as host',
      'Field booklet',
    ],
    notIncluded: ['Mainland travel to the ferry', 'Two dinners in Tarbert', 'Midges (bring your own defence)'],
    practical: [
      'May midges exist. September less so.',
      'A midge net is not glamorous. Bring one.',
      'Ferries cancel. The itinerary has slack for that.',
    ],
    relatedSlugs: ['faroe-on-foot', 'extremadura-november'],
  },
  {
    id: 'oaxaca-highlands',
    slug: 'oaxaca-highlands',
    destinationSlug: 'oaxaca',
    title: 'Oaxaca highlands',
    standfirst: 'Nine days between markets, kitchens, and the Sierra Norte, at the pace of a combi that waits.',
    overview:
      'We spend three nights in the city because the markets are not a backdrop. Then we go up to a Zapotec village that hosts walkers properly, with meals in a communal kitchen and paths that leave from the basketball court. Inês first came here for a map project and kept going back. This is the week she built from those years, not from a brochure.',
    durationDays: 9,
    experienceType: 'Table',
    startingPrice: 3420,
    currency: 'EUR',
    groupSize: 8,
    season: 'February and November',
    fitness: 'Altitude around 2,000 m. Walking days 8 to 14 km on dirt and cobble.',
    hero: photo(
      'photo-1518638150340-f706e86654de',
      'A Mexican courtyard with painted walls and deep shade',
      'Alex Azabache',
      1600,
      2000,
      'w=1200'
    ),
    gallery: [
      photo('photo-1568402102990-bc067fb68adb', 'Colour-washed street facade', 'Jezael Melgoza', 1600, 1067),
      photo('photo-1556910103-1c0279aa1bd0', 'Hands working in a kitchen', 'Roberto Nickson', 1600, 1067),
      photo('photo-1469474968028-56623f02e425', 'Sun through a valley', 'David Marcu', 1600, 1067),
    ],
    itinerary: [
      { day: 1, title: 'Oaxaca city', body: 'Arrive. Evening in the zócalo without an itinerary.' },
      { day: 2, title: 'Markets', body: 'Mercado Sánchez Pascuas first, not the one built for cameras. Lunch at a stall Inês has used for a decade.' },
      { day: 3, title: 'Cooking', body: 'A morning with a cook in her house. Mole if the season is right; something quieter if it is not.' },
      { day: 4, title: 'Up to the sierra', body: 'Combi and a last stretch on foot. Welcome meal with the host family network.' },
      { day: 5, title: 'Village to village', body: 'A connecting path. Packed tortillas. A different roof at night.' },
      { day: 6, title: 'High loop', body: 'Cloud forest if the weather holds. We turn back if it does not.' },
      { day: 7, title: 'Down to the city', body: 'A slower return. Evening at a mezcalaría that still feels like a shop.' },
      { day: 8, title: 'Monte Albán, early', body: 'Before the coaches. Afternoon free. Last supper together.' },
      { day: 9, title: 'Depart', body: 'Airport runs from 06:00. We stagger them.' },
    ],
    included: [
      'Eight nights (city inn and village houses)',
      'Breakfasts and six dinners, one cooking morning',
      'Village hosting fees',
      'Inês as host',
      'Field booklet, including a market map she drew',
    ],
    notIncluded: ['Flights into Oaxaca', 'Most lunches', 'Personal shopping', 'Travel insurance'],
    practical: [
      'Altitude is real. We do not rush day one.',
      'Spanish helps and is not required. Inês translates.',
      'November is for Day of the Dead only if you want the crowds; we usually go after.',
    ],
    relatedSlugs: ['extremadura-november', 'nakasendo-shoulder'],
  },
  {
    id: 'albania-before-the-season',
    slug: 'albania-before-the-season',
    destinationSlug: 'albania',
    title: 'Albanian coast, before the season',
    standfirst: 'Eight days from Himarë to Porto Palermo, when the road is still for goats and the water is still cold.',
    overview:
      'May on this coast is not summer. The sea is for the committed. The tavernas that are open are the ones that stay open for the village. We walk sections of the old coastal paths, swim when the sun allows, and sleep in rooms above a family kitchen. This is not the Riviera of the posters. It is better for it.',
    durationDays: 8,
    experienceType: 'Coast',
    startingPrice: 2980,
    currency: 'EUR',
    groupSize: 10,
    season: 'May',
    fitness: 'Coastal paths with some steep, loose sections. Swimming optional and cold.',
    hero: photo(
      'photo-1498307833015-e7b400441eb8',
      'A steep Mediterranean coast with a town on the water',
      'Heidi Kaden',
      1600,
      1067
    ),
    gallery: [
      photo('photo-1516483638261-f4dbaf036963', 'Harbour houses stacked above the sea', 'Heidi Kaden', 1600, 2000, 'w=1200'),
      photo('photo-1507525428034-b723cf961d3e', 'A quiet beach under a pale sky', 'Sean Oulashin', 1600, 1067),
      photo('photo-1476514525535-07fb3b4ae5f1', 'Open water in early light', 'Luca Bravo', 1600, 1067),
    ],
    itinerary: [
      { day: 1, title: 'Tirana to the coast', body: 'A long transfer with a proper lunch stop. Arrive Himarë in time to swim if you are stubborn.' },
      { day: 2, title: 'Himarë paths', body: 'Old mule tracks above the bay. Dinner in a courtyard that still has a grape vine.' },
      { day: 3, title: 'Gjipe', body: 'A canyon to a beach. We carry lunch. We do not stay for the sunset party because there is not one yet.' },
      { day: 4, title: 'Dhermi to the north coves', body: 'A shorter walk, a longer swim, rooms a little further along the road.' },
      { day: 5, title: 'Porto Palermo', body: 'The fortress, the bay, a fish lunch if the boats went out.' },
      { day: 6, title: 'At sea', body: 'A small boat if the water is kind; a headland walk if it is not.' },
      { day: 7, title: 'Last ridge', body: 'Up for the view back down the coast we have been using all week.' },
      { day: 8, title: 'Out', body: 'Return to Tirana. Evening flights only. We will not run for a noon departure.' },
    ],
    included: [
      'Seven nights in family rooms',
      'Breakfasts and five dinners',
      'Van and one boat morning',
      'Walking host',
      'Field booklet',
    ],
    notIncluded: ['Flights into Tirana', 'Two dinners', 'Alcohol', 'Towels you will want for the boat'],
    practical: [
      'May water is 17 to 19°C. A shorty helps.',
      'The coast road is slow. That is the point of starting early in the week.',
      'Cash still matters in smaller places. We brief you in the booklet.',
    ],
    relatedSlugs: ['faroe-on-foot', 'harris-small-isles'],
  },
]

export const testimonials: Testimonial[] = [
  {
    id: 't1',
    quote:
      'I have been on trips that tried to be impressive. This one tried to be accurate. We walked the same valley twice because the light was different. I did not know I wanted that.',
    name: 'Helen Morrow',
    place: 'Sheffield',
    tourSlug: 'extremadura-november',
  },
  {
    id: 't2',
    quote:
      'Callum knew when to stop talking. The booklet was better than most apps. I still have the ferry times underlined.',
    name: 'Jonas Berg',
    place: 'Malmö',
    tourSlug: 'harris-small-isles',
  },
]

export const house = {
  name: 'Marram',
  studio: 'Rua Pedro de Alcântara 42, Alcântara, Lisbon',
  desk: 'A planning desk in Edinburgh, used when the Atlantic is being difficult.',
  founded: 2014,
  email: 'notes@marram.example',
  phone: '+351 21 000 1842',
  hours: 'Tuesday to Friday, 10:00 to 16:00 Western European Time',
  founders: [
    {
      name: 'Inês Vale',
      role: 'Cartographic editor, then this',
      bio: 'Spent a decade making maps for a press that still believed in paper. She plans the weeks that turn on kitchens, markets, and the way a town sits in its valley.',
    },
    {
      name: 'Callum Reed',
      role: 'Walking guide, Harris',
      bio: 'Grew up on a ferry timetable. He hosts the Atlantic weeks and still writes the walking notes by hand before they go to print.',
    },
  ],
  story: [
    'Marram is named for the grass that holds a dune together. We liked the plant more than any word for travel.',
    'The house exists because Inês and Callum were tired of itineraries that treated a country as a list. They wanted weeks that stayed. One landscape. A table you return to. Enough weather to have an opinion about it.',
    'We run a handful of departures a year. Group size is eight to ten. Two weeks before you leave, a field booklet arrives in the post: maps, ferry times, a reading list, and the number of a person who will actually answer.',
  ],
}

export const essay = {
  kicker: 'From the booklet',
  title: 'Notes from last November in Extremadura',
  body: [
    'The pigs had already moved under the oaks when we arrived. You hear them before you see them. The dehesa looks empty until it does not.',
    'We walked a loop that the estate manager described as “not interesting,” which usually means it has not been put on Instagram. Stone walls. A well. A view of a town that has lost a station and kept a bakery.',
    'Lunch was migas and a salad of oranges that would have been better in January. Nobody minded. The fire was lit at four because the house gets cold at five. That is the whole method: pay attention to when the house gets cold.',
  ],
}
