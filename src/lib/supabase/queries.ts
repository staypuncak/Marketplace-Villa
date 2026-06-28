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

export async function getAllVillas(): Promise<Villa[]> {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('villas')
      .select('*, media!inner(*)')
      .eq('status', 'active')
      .eq('media.is_cover', true)
      .order('name')

    if (error || !data) {
      console.error('Supabase getAllVillas error:', error)
      return fallbackVillas
    }

    return (data as unknown as VillaWithMedia[]).map(mapVillaRow)
  } catch (err) {
    console.error('Supabase getAllVillas exception:', err)
    return fallbackVillas
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
