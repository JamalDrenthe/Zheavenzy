/**
 * CRMos REST API Client — Bi-directionele AI Agent Integratie
 * Volledige integratie voor Zheavenzy & Jamal Drenthe Ecosysteem
 */

export interface CRMosContactUpsert {
  first_name: string
  last_name?: string
  email: string
  phone?: string
  company?: string
  company_tags?: string[]
  tags?: string[]
  notes?: string
  status?: 'lead' | 'qualified' | 'customer' | 'partner' | string
  vvc_tag?: string
}

export interface CRMosContact {
  id?: string
  first_name: string
  last_name?: string
  email: string
  phone?: string
  company?: string
  company_tags?: string[]
  tags?: string[]
  notes?: string
  status?: string
}

export interface CRMosDeal {
  id?: string
  name: string
  value: number
  stage: 'lead' | 'contacted' | 'proposal' | 'negotiation' | 'won' | 'lost' | string
  company_name: string
  contact_id?: string
  probability?: number
  notes?: string
}

export interface CRMosActivity {
  id?: string
  contact_id?: string
  type: 'call' | 'email' | 'meeting' | 'form' | 'booking' | 'system' | string
  title: string
  description: string
  performed_by: string
}

export interface CRMosCandidate {
  id?: string
  first_name: string
  last_name?: string
  email: string
  phone?: string
  skills?: string[]
  experience_years?: number
  location?: string
  notes?: string
}

export interface CRMosApiResponse<T = unknown> {
  success: boolean
  message?: string
  data?: T
  count?: number
}

// Standaard configuratie
export const CRMOS_CONFIG = {
  baseUrl: (import.meta.env.VITE_CRMOS_API_URL || 'https://crmos.one/api/v1').replace(/\/+$/, ''),
  apiKey: import.meta.env.VITE_CRMOS_API_KEY || 'crm_live_master_jamaldrenthe_2026_all_ecosystem',
  companyTag: '#zheavenzy',
  companyName: 'Zheavenzy',
}

/**
 * Centrale HTTP request fetcher voor CRMos REST API
 */
async function crmosFetch<T>(endpoint: string, options: RequestInit = {}): Promise<CRMosApiResponse<T>> {
  const url = `${CRMOS_CONFIG.baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'X-CRMOS-API-KEY': CRMOS_CONFIG.apiKey,
    ...(options.headers as Record<string, string>),
  }

  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 8000)

    const response = await fetch(url, {
      ...options,
      headers,
      signal: controller.signal,
    })
    clearTimeout(timeoutId)

    const contentType = response.headers.get('content-type') || ''
    if (contentType.includes('application/json')) {
      const data = await response.json()
      return {
        success: response.ok,
        data,
      }
    }

    const text = await response.text()
    return {
      success: response.ok,
      message: text.slice(0, 200),
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err)
    // Non-blocking waarschuwing zodat app altijd responsive blijft
    console.warn(`[CRMos API] Error connecting to ${url}:`, message)
    return {
      success: false,
      message,
    }
  }
}

// -------------------------------------------------------------
// 1. DATA OPHALEN & REALTIME ZOEKEN (GET)
// -------------------------------------------------------------

/**
 * Universeel zoeken over contacten, deals, kandidaten en teams tegelijk
 */
export async function searchCRMos(query: string): Promise<CRMosApiResponse> {
  if (!query.trim()) return { success: false, message: 'Geen zoekterm opgegeven' }
  return crmosFetch(`/search?q=${encodeURIComponent(query.trim())}`)
}

/**
 * Contacten filteren op zoekterm, company tag of VVC-tag
 */
export async function getCRMosContacts(params?: {
  q?: string
  company_tag?: string
  tag?: string
}): Promise<CRMosApiResponse> {
  const queryParts: string[] = []
  if (params?.q) queryParts.push(`q=${encodeURIComponent(params.q)}`)
  if (params?.company_tag) queryParts.push(`company_tag=${encodeURIComponent(params.company_tag)}`)
  if (params?.tag) queryParts.push(`tag=${encodeURIComponent(params.tag)}`)

  const queryString = queryParts.length > 0 ? `?${queryParts.join('&')}` : ''
  return crmosFetch(`/contacts${queryString}`)
}

/**
 * Enkel contact ophalen op ID
 */
export async function getCRMosContactById(id: string): Promise<CRMosApiResponse> {
  return crmosFetch(`/contacts/${encodeURIComponent(id)}`)
}

/**
 * Referral Teams & Kernleiders ophalen
 */
export async function getCRMosTeams(): Promise<CRMosApiResponse> {
  return crmosFetch('/teams')
}

/**
 * Bedrijven & Pipelines ophalen
 */
export async function getCRMosCompanies(): Promise<CRMosApiResponse> {
  return crmosFetch('/companies')
}

/**
 * Deals ophalen eventueel gefilterd op bedrijf
 */
export async function getCRMosDeals(company?: string): Promise<CRMosApiResponse> {
  const query = company ? `?company=${encodeURIComponent(company)}` : ''
  return crmosFetch(`/deals${query}`)
}

/**
 * Kandidaten & No Cure No Pay profielen ophalen
 */
export async function getCRMosCandidates(): Promise<CRMosApiResponse> {
  return crmosFetch('/candidates')
}

// -------------------------------------------------------------
// 2. DATA TERUGSCHRIJVEN & VERRIJKEN (POST, PUT, PATCH)
// -------------------------------------------------------------

/**
 * A. Contact inschrijven of slim verrijken (Upsert)
 * Als het contact al bestaat (op email of vvc_tag), wordt het verrijkt.
 */
export async function upsertCRMosContact(contact: CRMosContactUpsert): Promise<CRMosApiResponse> {
  return crmosFetch('/contacts/upsert', {
    method: 'POST',
    body: JSON.stringify({
      company: CRMOS_CONFIG.companyName,
      company_tags: [CRMOS_CONFIG.companyTag],
      ...contact,
      tags: Array.from(new Set([...(contact.tags || []), CRMOS_CONFIG.companyTag, 'Zheavenzy Platform'])),
    }),
  })
}

/**
 * B. Nieuw Contact Aanmaken
 */
export async function createCRMosContact(contact: CRMosContact): Promise<CRMosApiResponse> {
  return crmosFetch('/contacts', {
    method: 'POST',
    body: JSON.stringify({
      company: CRMOS_CONFIG.companyName,
      company_tags: [CRMOS_CONFIG.companyTag],
      ...contact,
      tags: Array.from(new Set([...(contact.tags || []), CRMOS_CONFIG.companyTag])),
    }),
  })
}

/**
 * C. Bestaand Contact Bijwerken
 */
export async function patchCRMosContact(id: string, updates: Partial<CRMosContact>): Promise<CRMosApiResponse> {
  return crmosFetch(`/contacts/${encodeURIComponent(id)}`, {
    method: 'PATCH',
    body: JSON.stringify(updates),
  })
}

/**
 * D. Deal / Verkoopkans Inschrijven in de Sales Pipeline
 */
export async function createCRMosDeal(deal: CRMosDeal): Promise<CRMosApiResponse> {
  return crmosFetch('/deals', {
    method: 'POST',
    body: JSON.stringify({
      ...deal,
      company_name: deal.company_name || CRMOS_CONFIG.companyName,
    }),
  })
}

/**
 * E. Activiteit / Gespreksnotitie Loggen
 */
export async function logCRMosActivity(activity: CRMosActivity): Promise<CRMosApiResponse> {
  return crmosFetch('/activities', {
    method: 'POST',
    body: JSON.stringify({
      ...activity,
      performed_by: activity.performed_by || 'Zheavenzy AI Agent',
    }),
  })
}

/**
 * F. Kandidaat / No Cure No Pay Sollicitant Inschrijven
 */
export async function createCRMosCandidate(candidate: CRMosCandidate): Promise<CRMosApiResponse> {
  return crmosFetch('/candidates', {
    method: 'POST',
    body: JSON.stringify(candidate),
  })
}

// -------------------------------------------------------------
// 3. ZHEAVENZY ECOSYSTEEM SMART HOOKS (Automatische Synchronisatie)
// -------------------------------------------------------------

/**
 * Synchroniseer een contactformulier inzending direct naar CRMos als Lead & Activiteit
 */
export async function syncLeadFromContactForm(lead: {
  name: string
  email: string
  type: string
  message: string
}): Promise<void> {
  const nameParts = lead.name.trim().split(' ')
  const firstName = nameParts[0] || 'Bezoeker'
  const lastName = nameParts.slice(1).join(' ') || ''

  try {
    // 1. Upsert contact in CRMos
    await upsertCRMosContact({
      first_name: firstName,
      last_name: lastName,
      email: lead.email.toLowerCase().trim(),
      company: 'Zheavenzy Lead',
      company_tags: [CRMOS_CONFIG.companyTag],
      tags: [CRMOS_CONFIG.companyTag, `Discipline: ${lead.type}`, 'Contact Formulier', 'Inkomende Lead'],
      notes: `Bericht van website: "${lead.message}" (Type: ${lead.type})`,
      status: 'lead',
    })

    // 2. Log activiteit in CRMos
    await logCRMosActivity({
      type: 'form',
      title: `Zheavenzy Contactaanvraag — ${lead.name}`,
      description: `Aanvraag ontvangen voor discipline '${lead.type}'. Bericht: "${lead.message}"`,
      performed_by: 'Zheavenzy Website Agent',
    })

    // 3. Schrijf deal in pipeline
    await createCRMosDeal({
      name: `Zheavenzy Aanvraag — ${lead.name} (${lead.type})`,
      value: lead.type === 'artiest' ? 1200 : 850,
      stage: 'lead',
      company_name: 'Zheavenzy',
      probability: 40,
      notes: `Verzonden via contactpagina door ${lead.email}`,
    })
  } catch (err) {
    console.warn('[CRMos Sync] Non-blocking sync error:', err)
  }
}

/**
 * Synchroniseer een geregistreerd of bijgewerkt lidmaatschap naar CRMos
 */
export async function syncMemberToCRMos(member: {
  name: string
  email: string
  role: string
  tier: string
  credits?: number
  bio?: string
}): Promise<void> {
  const nameParts = member.name.trim().split(' ')
  const firstName = nameParts[0] || 'Lid'
  const lastName = nameParts.slice(1).join(' ') || ''

  try {
    await upsertCRMosContact({
      first_name: firstName,
      last_name: lastName,
      email: member.email.toLowerCase().trim(),
      company: 'Zheavenzy Netwerk',
      company_tags: [CRMOS_CONFIG.companyTag],
      tags: [
        CRMOS_CONFIG.companyTag,
        `#role_${member.role}`,
        `#tier_${member.tier}`,
        'Actief Lidmaatschap',
        'Zheavenzy Creative',
      ],
      notes: `Zheavenzy lid: ${member.name}. Rol: ${member.role}, Tier: ${member.tier.toUpperCase()}, Credits saldo: ${member.credits ?? 0}. Bio: ${member.bio || 'Geen'}`,
      status: 'qualified',
    })

    await logCRMosActivity({
      type: 'system',
      title: `Zheavenzy Account Geactiveerd — ${member.name}`,
      description: `Discipline: ${member.role} | Tier: ${member.tier.toUpperCase()} | Credits: ${member.credits ?? 0}`,
      performed_by: 'Zheavenzy Auth System',
    })
  } catch (err) {
    console.warn('[CRMos Sync] Member sync error:', err)
  }
}

/**
 * Log een boeking of credit-aankoop als deal / activiteit in CRMos
 */
export async function syncBookingToCRMos(booking: {
  userName: string
  userEmail: string
  memberName: string
  date: string
  status: string
}): Promise<void> {
  try {
    await logCRMosActivity({
      type: 'booking',
      title: `Zheavenzy Boeking: ${booking.userName} -> ${booking.memberName}`,
      description: `Datum: ${booking.date} | Status: ${booking.status} | Aanvrager: ${booking.userEmail}`,
      performed_by: 'Zheavenzy Boekingsengine',
    })

    await createCRMosDeal({
      name: `Boeking: ${booking.userName} bij ${booking.memberName}`,
      value: 750,
      stage: booking.status === 'bevestigd' ? 'won' : 'proposal',
      company_name: 'Zheavenzy',
      probability: booking.status === 'bevestigd' ? 100 : 70,
      notes: `Geboekt via Zheavenzy platform voor ${booking.date}`,
    })
  } catch (err) {
    console.warn('[CRMos Sync] Booking sync error:', err)
  }
}
