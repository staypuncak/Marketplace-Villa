import { cache } from 'react'
import { createClient } from './server'
import { createStaticClient } from './static'
import { storagePathToPublicUrl } from '@/lib/storage/media-paths'
import type { Villa } from '@/types/villa'
import type { Tables } from './types'
import { villas as fallbackVillas, getVillaBySlug as fallbackGetVillaBySlug } from '@/data/villas'

export type WebsiteSettings = {
  hero: { eyebrow: string; headline: string; subheadline: string }
  contact: { whatsappNumber: string; whatsappMessage: string }
  finalCta: { eyebrow: string; headline: string; subheadline: string; primaryButton: string; secondaryButton: string }
  footer: { description: string; instagram: string; tiktok: string; facebook: string }
  seo: { siteTitle: string; metaDescription: string; ogImage: string }
}

const fallbackSettings: WebsiteSettings = {
  hero: { eyebrow: 'Liburan Nyaman @ Puncak Bogor', headline: 'Booking Villa Puncak Lebih Aman, Lebih Hemat.', subheadline: 'Villa terverifikasi, harga transparan, tanpa biaya tambahan, dan didampingi admin resmi hingga Anda check-in dengan tenang.' },
  contact: { whatsappNumber: '', whatsappMessage: 'Halo StayPuncak, saya ingin tanya tentang villa.' },
  finalCta: { eyebrow: 'Siap Untuk Liburan Berkesan Di Puncak?', headline: 'Tinggalkan Penat, Ciptakan Kenangan Hangat.', subheadline: 'Ratusan keluarga sudah membuktikannya. Sekarang giliran Anda mewujudkan liburan sempurna bersama StayPuncak.', primaryButton: 'WhatsApp Kami', secondaryButton: 'Lihat Semua Villa' },
  footer: { description: 'StayPuncak adalah Pengelola Villa Resmi di Puncak Bogor, yang menawarkan akomodasi berkualitas, harga terjangkau, fasilitas modern, dan jaminan keamanan booking online.', instagram: '', tiktok: '', facebook: '' },
  seo: { siteTitle: 'StayPuncak — Villa Premium di Puncak', metaDescription: 'Temukan villa premium terbaik di Puncak, Bogor. Booking villa untuk liburan keluarga, pasangan, atau acara spesial.', ogImage: '' },
}

export const getWebsiteSettings = cache(async (): Promise<WebsiteSettings> => {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('website_settings')
      .select('key, value')

    if (error || !data) {
      console.error('Supabase getWebsiteSettings error:', error)
      return fallbackSettings
    }

    const merged = { ...fallbackSettings }

    for (const row of data) {
      const val = row.value as Record<string, string>
      if (row.key === 'hero' && val) {
        merged.hero = { ...merged.hero, ...val }
      }
      if (row.key === 'contact' && val) {
        merged.contact = { ...merged.contact, whatsappNumber: val.whatsapp_number || val.whatsappNumber || '', whatsappMessage: val.whatsapp_message || val.whatsappMessage || '' }
      }
      if (row.key === 'final_cta' && val) {
        merged.finalCta = { ...merged.finalCta, eyebrow: val.eyebrow || merged.finalCta.eyebrow, headline: val.headline || merged.finalCta.headline, subheadline: val.subheadline || merged.finalCta.subheadline, primaryButton: val.primary_button || val.primaryButton || merged.finalCta.primaryButton, secondaryButton: val.secondary_button || val.secondaryButton || merged.finalCta.secondaryButton }
      }
      if (row.key === 'footer' && val) {
        merged.footer = { ...merged.footer, description: val.description || merged.footer.description, instagram: val.instagram || merged.footer.instagram, tiktok: val.tiktok || merged.footer.tiktok, facebook: val.facebook || merged.footer.facebook }
      }
      if (row.key === 'seo' && val) {
        merged.seo = { ...merged.seo, siteTitle: val.site_title || val.siteTitle || merged.seo.siteTitle, metaDescription: val.meta_description || val.metaDescription || merged.seo.metaDescription, ogImage: val.og_image || val.ogImage || merged.seo.ogImage }
      }
    }

    return merged
  } catch (err) {
    console.error('Supabase getWebsiteSettings exception:', err)
    return fallbackSettings
  }
})

type VillaRow = Tables<'villas'>
type MediaRow = Tables<'media'>

type VillaWithMedia = VillaRow & { media: MediaRow[] }

const FALLBACK_GALLERY = [
  '/images/gallery-01.svg',
  '/images/gallery-02.svg',
  '/images/gallery-03.svg',
  '/images/gallery-04.svg',
  '/images/gallery-05.svg',
]

function mapVillaRow(row: VillaWithMedia): Villa {
  const media = row.media ?? []

  const cover = media.find((m) => m.is_cover)
  const hero = media.find((m) => !m.is_cover && m.sort_order === 1)
  const gallery = media
    .filter((m) => !m.is_cover && m.sort_order >= 2)
    .sort((a, b) => a.sort_order - b.sort_order)

  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description ?? '',
    price: Number(row.price),
    capacity: row.capacity,
    location: row.location ?? '',
    thumbnailImage: cover ? storagePathToPublicUrl(cover.image_url) : FALLBACK_GALLERY[0],
    heroImage: hero ? storagePathToPublicUrl(hero.image_url) : (cover ? storagePathToPublicUrl(cover.image_url) : FALLBACK_GALLERY[0]),
    galleryImages: gallery.length > 0
      ? gallery.map((m) => storagePathToPublicUrl(m.image_url))
      : FALLBACK_GALLERY,
    facilities: (row.facilities as string[]) ?? [],
    status: row.status,
  }
}

function sortVillas(villas: Villa[], sort?: string): Villa[] {
  if (sort === 'price_asc') {
    return [...villas].sort((a, b) => a.price - b.price)
  }
  if (sort === 'price_desc') {
    return [...villas].sort((a, b) => b.price - a.price)
  }
  return villas
}

function filterVillas(
  villas: Villa[],
  search?: string,
  location?: string,
  capacity?: string,
  sort?: string,
): Villa[] {
  let result = villas

  if (search) {
    const q = search.toLowerCase()
    result = result.filter(
      (v) =>
        v.name.toLowerCase().includes(q) ||
        v.location.toLowerCase().includes(q) ||
        v.description.toLowerCase().includes(q),
    )
  }

  if (location) {
    result = result.filter((v) => v.location === location)
  }

  if (capacity) {
    const min = Number(capacity)
    if (!isNaN(min) && min > 0) {
      result = result.filter((v) => v.capacity >= min)
    }
  }

  return sortVillas(result, sort)
}

export async function getAllVillas(search?: string, location?: string, capacity?: string, sort?: string): Promise<Villa[]> {
  try {
    const supabase = await createClient()

    let query = supabase
      .from('villas')
      .select('*, media(*)')
      .eq('status', 'active')

    if (search) {
      query = query.or(
        `name.ilike.%${search}%,location.ilike.%${search}%,description.ilike.%${search}%`,
      )
    }

    if (location) {
      query = query.eq('location', location)
    }

    if (capacity) {
      const min = Number(capacity)
      if (!isNaN(min) && min > 0) {
        query = query.gte('capacity', min)
      }
    }

    if (sort === 'price_asc') {
      query = query.order('price', { ascending: true })
    } else if (sort === 'price_desc') {
      query = query.order('price', { ascending: false })
    } else {
      query = query.order('name')
    }

    const { data, error } = await query

    if (error || !data) {
      console.error('Supabase getAllVillas error:', error)
      return filterVillas(fallbackVillas, search, location, capacity, sort)
    }

    return (data as unknown as VillaWithMedia[]).map(mapVillaRow)
  } catch (err) {
    console.error('Supabase getAllVillas exception:', err)
    return filterVillas(fallbackVillas, search, location, capacity, sort)
  }
}

export async function getAllVillasStatic(): Promise<Pick<Villa, 'slug'>[]> {
  try {
    const supabase = createStaticClient()

    const { data, error } = await supabase
      .from('villas')
      .select('slug')
      .eq('status', 'active')

    if (error || !data) {
      console.error('Supabase getAllVillasStatic error:', error)
      return fallbackVillas.map((v) => ({ slug: v.slug }))
    }

    return data.map((row) => ({ slug: row.slug }))
  } catch (err) {
    console.error('Supabase getAllVillasStatic exception:', err)
    return fallbackVillas.map((v) => ({ slug: v.slug }))
  }
}

export async function getLocations(): Promise<string[]> {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('villas')
      .select('location')
      .eq('status', 'active')
      .not('location', 'is', null)

    if (error || !data) {
      const locs = fallbackVillas.map((v) => v.location).filter(Boolean)
      return [...new Set(locs)]
    }

    const locs = data.map((d) => d.location).filter(Boolean)
    return [...new Set(locs)]
  } catch {
    const locs = fallbackVillas.map((v) => v.location).filter(Boolean)
    return [...new Set(locs)]
  }
}

export async function getVillaBySlug(slug: string): Promise<Villa | undefined> {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('villas')
      .select('*, media(*)')
      .eq('slug', slug)
      .eq('status', 'active')
      .single()

    if (error || !data) {
      console.error('Supabase getVillaBySlug error:', error)
      return fallbackGetVillaBySlug(slug)
    }

    return mapVillaRow(data as unknown as VillaWithMedia)
  } catch (err) {
    console.error('Supabase getVillaBySlug exception:', err)
    return fallbackGetVillaBySlug(slug)
  }
}

const avatarColors = [
  'bg-emerald-600', 'bg-teal-600', 'bg-lime-700', 'bg-blue-700', 'bg-amber-700',
  'bg-rose-600', 'bg-violet-600', 'bg-cyan-600', 'bg-orange-600', 'bg-pink-600',
]

export async function getPublishedTestimonials() {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('testimonials')
      .select('*')
      .eq('status', 'published')
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: false })

    if (error || !data || data.length === 0) {
      const { testimonials } = await import('@/data/testimonials')
      return testimonials.map((t, i) => ({
        id: t.id,
        name: t.name,
        city: t.city,
        text: t.text,
        villaName: t.villaName,
        avatarColor: avatarColors[i % avatarColors.length],
      }))
    }

    return data.map((row, i) => ({
      id: row.id,
      name: row.guest_name,
      city: row.guest_city || '',
      text: row.content,
      villaName: row.villa_name || '',
      avatarColor: avatarColors[i % avatarColors.length],
    }))
  } catch {
    const { testimonials } = await import('@/data/testimonials')
    return testimonials.map((t, i) => ({
      id: t.id,
      name: t.name,
      city: t.city,
      text: t.text,
      villaName: t.villaName,
      avatarColor: avatarColors[i % avatarColors.length],
    }))
  }
}
