export const STORAGE_BUCKET = 'villa-media'

const BASE_PATH = 'villas'

function villaDir(slug: string) {
  return `${BASE_PATH}/${slug}`
}

export function getVillaThumbnailPath(slug: string): string {
  return `${villaDir(slug)}/thumbnail/thumbnail.webp`
}

export function getVillaHeroPath(slug: string): string {
  return `${villaDir(slug)}/hero/hero.webp`
}

export function getVillaGalleryPath(slug: string, index: number): string {
  const padded = String(index).padStart(3, '0')
  return `${villaDir(slug)}/gallery/gallery-${padded}.webp`
}

export function getVillaPublicUrl(
  supabase: { storage: { from: (bucket: string) => { getPublicUrl: (path: string) => { data: { publicUrl: string } } } } },
  path: string,
): string {
  return supabase.storage.from(STORAGE_BUCKET).getPublicUrl(path).data.publicUrl
}

export function storagePathToPublicUrl(path: string): string {
  if (!path) return ''
  if (path.startsWith('http://') || path.startsWith('https://')) return path
  const baseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  if (!baseUrl) return path
  return `${baseUrl}/storage/v1/object/public/${STORAGE_BUCKET}/${path}`
}
