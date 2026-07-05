import { createClient } from './server'
import { createStaticClient } from './static'
import { storagePathToPublicUrl } from '@/lib/storage/media-paths'
import type { Villa } from '@/types/villa'
import type { Tables } from './types'
import { villas as fallbackVillas, getVillaBySlug as fallbackGetVillaBySlug } from '@/data/villas'

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
