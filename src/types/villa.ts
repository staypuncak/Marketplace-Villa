export type Villa = {
  id: string
  name: string
  slug: string
  description: string
  price: number
  capacity: number
  location: string
  thumbnailImage: string
  heroImage: string
  galleryImages: string[]
  facilities: string[]
  status: 'active' | 'inactive' | 'draft' | 'archived'
  price_information: string | null
}
