export type Tier = 'start' | 'groei' | 'pro'
export type Role = 'artiest' | 'camera' | 'designer' | 'stylist'

export interface RoleConfig {
  key: Role
  label: string
  title: string
  desc: string
  badge: string
  iconName: string
  defaultServices: string[]
}

export const roleConfigs: Record<Role, RoleConfig> = {
  artiest: {
    key: 'artiest',
    label: 'Artiest / Muzikant',
    title: 'Muziek & Vocalen',
    desc: 'Zangers, rappers, songwriters, instrumentalisten & producers.',
    badge: 'Artiest',
    iconName: 'Mic2',
    defaultServices: ['Studiozang', 'Writing camps', 'Live optredens', 'Track feature'],
  },
  camera: {
    key: 'camera',
    label: 'Camera & Video',
    title: 'Visuele Productie',
    desc: 'Videografen, clipregisseurs en artwork fotografen.',
    badge: 'Visual Maker',
    iconName: 'Video',
    defaultServices: ['Videoclips', 'Live-registraties', 'Social content', 'Cover-shoots'],
  },
  designer: {
    key: 'designer',
    label: 'Graphic Designer',
    title: 'Art Direction & Branding',
    desc: 'Album covers, Spotify canvas, merchandise en merkidentiteit.',
    badge: 'Designer',
    iconName: 'Palette',
    defaultServices: ['Single/album artwork', 'Logo & huisstijl', 'Spotify canvas', 'Social templates'],
  },
  stylist: {
    key: 'stylist',
    label: 'Stylist & Creative Director',
    title: 'Mode & Podium Image',
    desc: 'Wardrobe planning, shoot styling en podium appearance.',
    badge: 'Stylist',
    iconName: 'Sparkles',
    defaultServices: ['Shoot styling', 'Podium-looks', 'Wardrobe planning', 'Styling advies'],
  },
}

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
  followers: number
  collabs: number
  avatarUrl?: string
  logoUrl?: string
  website?: string
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
    id: 'm-jamal',
    name: 'Jamal Drenthe',
    role: 'artiest',
    tagline: 'Executive Producer & Recording Artist',
    bio: 'Executive Producer en Artiest bij Zheavenzy. Bekend om vernieuwende trap producties, diepe 808s, futuristische melodieën en authentieke hip hop anthems.',
    services: ['Executive Productie', 'Beat Productie', 'Audio Mix & Master', 'Track Feature'],
    stars: 5.0,
    credits: 24500,
    costPerDay: 1500,
    directBook: true,
    available: [0, 1, 2, 3, 4, 5, 6, 7],
    followers: 18500,
    collabs: 68,
    avatarUrl: '/jd-avatar.png',
    logoUrl: '/jdlogo-dark-transparent.png',
  },
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
    followers: 2100,
    collabs: 34,
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
    followers: 1400,
    collabs: 21,
  },
  {
    id: 'm-mara',
    name: 'Mara Chen',
    role: 'camera',
    tagline: 'Videograaf voor muziekvideo\'s en content',
    bio: 'Shoots voor artiesten: videoclips, behind-the-scenes, socials. Eigen gear (Sony FX6), edits inbegrepen.',
    services: ['Videoclips', 'Live-registraties', 'Social content', 'Editing & color grading'],
    stars: 4.9,
    credits: 15800,
    costPerDay: 1200,
    directBook: true,
    available: [2, 3, 6, 7, 9, 12, 13],
    followers: 3200,
    collabs: 47,
  },
  {
    id: 'm-denzel',
    name: 'Denzel Okafor',
    role: 'camera',
    tagline: 'Fotograaf voor covers en persbeelden',
    bio: 'Gespecialiseerd in artwork-shoots en persfoto\'s voor artiesten en labels. Snelle turnaround, studio of op locatie.',
    services: ['Cover-shoots', 'Persfoto\'s', 'Event fotografie', 'Retouching'],
    stars: 4.4,
    credits: 5400,
    costPerDay: 600,
    directBook: false,
    available: [1, 5, 6, 8, 11, 14],
    followers: 890,
    collabs: 15,
  },
  {
    id: 'm-sana',
    name: 'Sana El Idrissi',
    role: 'designer',
    tagline: 'Graphic designer voor artwork en branding',
    bio: 'Ontwerpt covers, logo\'s en complete visuele identiteiten voor artiesten. Werkte aan 20+ releases op het platform.',
    services: ['Single/album artwork', 'Logo & huisstijl', 'Social templates', 'Merch designs'],
    stars: 4.7,
    credits: 9600,
    costPerDay: 500,
    directBook: true,
    available: [0, 1, 4, 6, 8, 10, 12],
    followers: 2600,
    collabs: 38,
  },
  {
    id: 'm-robin',
    name: 'Robin de Groot',
    role: 'designer',
    tagline: 'Motion designer voor visuals en animatie',
    bio: 'Motion graphics voor releases: Spotify canvasses, lyric videos en stage visuals.',
    services: ['Spotify canvas', 'Lyric videos', 'Stage visuals', 'Intro/outro animatie'],
    stars: 4.5,
    credits: 7100,
    costPerDay: 550,
    directBook: false,
    available: [2, 4, 5, 9, 10, 13],
    followers: 1100,
    collabs: 19,
  },
  {
    id: 'm-noor',
    name: 'Noor Janssen',
    role: 'stylist',
    tagline: 'Stylist voor shoots en podiumkleding',
    bio: 'Styling voor videoclips, covershoots en live shows. Eigen netwerk van showrooms en merken.',
    services: ['Shoot styling', 'Podium-looks', 'Wardrobe planning', 'Styling advies'],
    stars: 4.8,
    credits: 11200,
    costPerDay: 750,
    directBook: true,
    available: [1, 3, 5, 7, 8, 11, 14],
    followers: 2900,
    collabs: 41,
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
    followers: 760,
    collabs: 12,
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
