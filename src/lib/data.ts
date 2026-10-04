export type Tier = 'start' | 'groei' | 'pro'
export type Role = 'artiest' | 'camera' | 'designer' | 'stylist'

export interface Member {
  id: string
  name: string
  role: Role
  tagline: string
  bio: string
  services: string[]
  stars: number
  credits: number
  costPerDay: number
  directBook: boolean
  available: number[] // dag-offsets vanaf vandaag
}

export interface Message {
  from: 'me' | 'them'
  text: string
  ts: number
}

export interface Booking {
  memberId: string
  date: string
  status: 'bevestigd' | 'aanvraag'
}

export interface Upload {
  title: string
  type: string
  credits: number
  ts: number
}

export const members: Member[] = [
  {
    id: 'm-luna',
    name: 'Luna Voss',
    role: 'artiest',
    tagline: 'R&B / Soul zangeres',
    bio: 'Luna schrijft en zingt Nederlandstalige en Engelstalige R&B. Drie EP\'s uitgebracht via Zheavenzy, live ervaring op regionale podia.',
    services: ['Studiozang', 'Writing camps', 'Live optredens', 'Feature op je track'],
    stars: 4.8,
    credits: 12400,
    costPerDay: 850,
    directBook: true,
    available: [1, 2, 4, 5, 8, 9, 11, 12],
  },
  {
    id: 'm-kai',
    name: 'Kai Bernhard',
    role: 'artiest',
    tagline: 'Producer & rapper',
    bio: 'Producer met een eigen sound: donkere drums, melodische toplines. Werkt graag met nieuwe vocalisten.',
    services: ['Beat productie', 'Vocal production', 'Mix reviews', 'Features'],
    stars: 4.6,
    credits: 8200,
    costPerDay: 700,
    directBook: false,
    available: [0, 3, 4, 7, 10, 13],
  },
  {
    id: 'm-mara',
    name: 'Mara Chen',
    role: 'camera',
    tagline: 'Videograaf — muziekvideo\'s & content',
    bio: 'Shoots voor artiesten: videoclips, behind-the-scenes, socials. Eigen gear (Sony FX6), edits inbegrepen.',
    services: ['Videoclips', 'Live-registraties', 'Social content', 'Editing & color grading'],
    stars: 4.9,
    credits: 15800,
    costPerDay: 1200,
    directBook: true,
    available: [2, 3, 6, 7, 9, 12, 13],
  },
  {
    id: 'm-denzel',
    name: 'Denzel Okafor',
    role: 'camera',
    tagline: 'Fotograaf — covers & persbeelden',
    bio: 'Gespecialiseerd in artwork-shoots en persfoto\'s voor artiesten en labels. Snelle turnaround, studio of op locatie.',
    services: ['Cover-shoots', 'Persfoto\'s', 'Event fotografie', 'Retouching'],
    stars: 4.4,
    credits: 5400,
    costPerDay: 600,
    directBook: false,
    available: [1, 5, 6, 8, 11, 14],
  },
  {
    id: 'm-sana',
    name: 'Sana El Idrissi',
    role: 'designer',
    tagline: 'Graphic designer — artwork & branding',
    bio: 'Ontwerpt covers, logo\'s en complete visuele identiteiten voor artiesten. Werkte aan 20+ releases op het platform.',
    services: ['Single/album artwork', 'Logo & huisstijl', 'Social templates', 'Merch designs'],
    stars: 4.7,
    credits: 9600,
    costPerDay: 500,
    directBook: true,
    available: [0, 1, 4, 6, 8, 10, 12],
  },
  {
    id: 'm-robin',
    name: 'Robin de Groot',
    role: 'designer',
    tagline: 'Motion designer — visuals & loops',
    bio: 'Motion graphics voor releases: Spotify canvasses, lyric videos en stage visuals.',
    services: ['Spotify canvas', 'Lyric videos', 'Stage visuals', 'Intro/outro animatie'],
    stars: 4.5,
    credits: 7100,
    costPerDay: 550,
    directBook: false,
    available: [2, 4, 5, 9, 10, 13],
  },
  {
    id: 'm-noor',
    name: 'Noor Janssen',
    role: 'stylist',
    tagline: 'Stylist — shoots & podiumlooks',
    bio: 'Styling voor videoclips, covershoots en live shows. Eigen netwerk van showrooms en merken.',
    services: ['Shoot styling', 'Podium-looks', 'Wardrobe planning', 'Styling advies'],
    stars: 4.8,
    credits: 11200,
    costPerDay: 750,
    directBook: true,
    available: [1, 3, 5, 7, 8, 11, 14],
  },
  {
    id: 'm-tom',
    name: 'Tom Verhoeven',
    role: 'stylist',
    tagline: 'Stylist & creative director',
    bio: 'Van moodboard tot volledige look. Combineert streetwear met high fashion voor artiesten die opvallen.',
    services: ['Creative direction', 'Look development', 'Event styling', 'Brand partnerships'],
    stars: 4.3,
    credits: 4300,
    costPerDay: 650,
    directBook: false,
    available: [0, 2, 6, 9, 12, 13],
  },
]

export const creditBundles = [
  { credits: 500, price: '€49', note: 'Starterbundel' },
  { credits: 2500, price: '€199', note: 'Meest gekozen', best: true },
  { credits: 6000, price: '€399', note: 'Beste waarde' },
]

export const uploadReward = 250

export const tierCredits: Record<Tier, number> = { start: 1000, groei: 3000, pro: 8000 }

export function roleLabel(role: Role) {
  return { artiest: 'Artiest', camera: 'Camera', designer: 'Designer', stylist: 'Stylist' }[role]
}

export function dayLabel(offset: number) {
  const d = new Date()
  d.setDate(d.getDate() + offset)
  return d.toLocaleDateString('nl-NL', { weekday: 'short', day: 'numeric', month: 'short' })
}

export function dayISO(offset: number) {
  const d = new Date()
  d.setDate(d.getDate() + offset)
  return d.toISOString().slice(0, 10)
}
