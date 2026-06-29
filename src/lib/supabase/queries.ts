import { createClient } from './server'
import type { Villa } from '@/types/villa'
import type { Tables } from './types'
import { villas as fallbackVillas, getVillaBySlug as fallbackGetVillaBySlug } from '@/data/villas'

type VillaRow = Tables<'villas'>
type MediaRow = Tables<'media'>

type VillaWithMedia = VillaRow & { media: MediaRow[] }

function mapVillaRow(row: VillaWithMedia): Villa {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description ?? '',
    price: Number(row.price),
    capacity: row.capacity,
    location: row.location ?? '',
    image: row.media[0]?.image_url ?? '/images/placeholder.jpg',
    facilities: (row.facilities as string[]) ?? [],
    status: row.status,
  }
}

function filterVillas(
  villas: Villa[],
  search?: string,
  location?: string,
  capacity?: string,
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

  return result
}

export async function getAllVillas(search?: string, location?: string, capacity?: string): Promise<Villa[]> {
  try {
    const supabase = await createClient()

    let query = supabase
      .from('villas')
      .select('*, media!inner(*)')
      .eq('status', 'active')
      .eq('media.is_cover', true)

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

    const { data, error } = await query.order('name')

    if (error || !data) {
      console.error('Supabase getAllVillas error:', error)
      return filterVillas(fallbackVillas, search, location, capacity)
    }

    return (data as unknown as VillaWithMedia[]).map(mapVillaRow)
  } catch (err) {
    console.error('Supabase getAllVillas exception:', err)
    return filterVillas(fallbackVillas, search, location, capacity)
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
      .select('*, media!inner(*)')
      .eq('slug', slug)
      .eq('status', 'active')
      .eq('media.is_cover', true)
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
