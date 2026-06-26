export type Villa = {
  id: string
  name: string
  slug: string
  description: string
  price: number
  capacity: number
  location: string
  image: string
  facilities: string[]
  status: 'active' | 'inactive' | 'draft'
}
