import type { Villa } from '@/types/villa'

const photo = (id: string) =>
  `https://images.unsplash.com/photo-${id}?w=1200&q=80`

const hero = (id: string) =>
  `https://images.unsplash.com/photo-${id}?w=1600&q=80`

const villaPuncakIndahGallery = [
  photo('1618773921431-3c0b0c6d9f2c'),
  photo('1600573472550-7cebed81323f'),
  photo('1600210492486-724fe5c67fb0'),
  photo('1582719508461-2e7eb0f4c6f4'),
  photo('1598928501494-5369b2ab1e1b'),
]

const villaBukitRespatiGallery = [
  photo('1586023499903-d8b5b8a7ac37'),
  photo('1598928501494-5369b2ab1e1b'),
  photo('1616137466830-6cc50c2b8df5'),
  photo('1600047509807-ba8f99d2cdde'),
  photo('1600566753190-17f0baa2a6c3'),
]

const villaCloudNineGallery = [
  photo('1560448204-603b448c3e1c'),
  photo('1600566753190-17f0baa2a6c3'),
  photo('1600210492486-724fe5c67fb0'),
  photo('1618773921431-3c0b0c6d9f2c'),
  photo('1598928501494-5369b2ab1e1b'),
]

const villaAlamAsriGallery = [
  photo('1582719508461-2e7eb0f4c6f4'),
  photo('1560448204-603b448c3e1c'),
  photo('1616137466830-6cc50c2b8df5'),
  photo('1600047509807-ba8f99d2cdde'),
  photo('1600573472550-7cebed81323f'),
]

const villaMountainViewGallery = [
  photo('1586023499903-d8b5b8a7ac37'),
  photo('1598928501494-5369b2ab1e1b'),
  photo('1600573472550-7cebed81323f'),
  photo('1582719508461-2e7eb0f4c6f4'),
  photo('1600566753190-17f0baa2a6c3'),
]

export const villas: Villa[] = [
  {
    id: '1',
    name: 'Villa Puncak Indah',
    slug: 'villa-puncak-indah',
    description:
      'Villa nyaman dengan pemandangan pegunungan yang menakjubkan. Dilengkapi kolam renang pribadi dan taman luas untuk keluarga.',
    price: 2500000,
    capacity: 10,
    bedrooms: 4,
    bathrooms: 3,
    location: 'Cisarua, Puncak',
    thumbnailImage: hero('1564013799919-ab600027ffc6'),
    heroImage: hero('1564013799919-ab600027ffc6'),
    galleryImages: villaPuncakIndahGallery,
    facilities: ['Kolam Renang', 'Taman', 'Parkir Luas', 'Dapur', 'WiFi'],
    status: 'active',
    price_information: null,
  },
  {
    id: '2',
    name: 'Villa Bukit Respati',
    slug: 'villa-bukit-respati',
    description:
      'Villa bergaya modern dengan fasilitas lengkap. Cocok untuk gathering dan acara keluarga besar.',
    price: 3500000,
    capacity: 16,
    bedrooms: 6,
    bathrooms: 4,
    location: 'Megamendung, Puncak',
    thumbnailImage: hero('1600596542815-ffad4c1539a9'),
    heroImage: hero('1600596542815-ffad4c1539a9'),
    galleryImages: villaBukitRespatiGallery,
    facilities: ['Kolam Renang', 'Aula', 'Parkir Luas', 'Dapur', 'WiFi', 'Karaoke'],
    status: 'active',
    price_information: 'Weekday : Rp3.500.000\nWeekend : Rp5.000.000\n\nLibur Nasional : Rp6.500.000',
  },
  {
    id: '3',
    name: 'Villa Cloud Nine',
    slug: 'villa-cloud-nine',
    description:
      'Villa eksklusif di ketinggian dengan pemandangan awan langsung dari kamar. Dilengkapi fireplace dan spa.',
    price: 5000000,
    capacity: 8,
    bedrooms: 3,
    bathrooms: 2,
    location: 'Tugu Selatan, Puncak',
    thumbnailImage: hero('1600585154340-be6161a56a0c'),
    heroImage: hero('1600585154340-be6161a56a0c'),
    galleryImages: villaCloudNineGallery,
    facilities: ['Fireplace', 'Spa', 'Taman', 'Dapur', 'WiFi', 'AC'],
    status: 'active',
    price_information: null,
  },
  {
    id: '4',
    name: 'Villa Alam Asri',
    slug: 'villa-alam-asri',
    description:
      'Villa sederhana namun asri dikelilingi kebun teh. Cocok untuk liburan santai keluarga kecil.',
    price: 1500000,
    capacity: 6,
    bedrooms: 2,
    bathrooms: 1,
    location: 'Pacet, Puncak',
    thumbnailImage: hero('1600607687939-ce8a6c25118c'),
    heroImage: hero('1600607687939-ce8a6c25118c'),
    galleryImages: villaAlamAsriGallery,
    facilities: ['Taman', 'Dapur', 'Parkir', 'WiFi'],
    status: 'active',
    price_information: null,
  },
  {
    id: '5',
    name: 'Villa Mountain View',
    slug: 'villa-mountain-view',
    description:
      'Villa mewah dengan pemandangan Gunung Pangrango. Fasilitas lengkap untuk acara pernikahan dan gathering perusahaan.',
    price: 7500000,
    capacity: 25,
    bedrooms: 8,
    bathrooms: 6,
    location: 'Cipanas, Puncak',
    thumbnailImage: hero('1600607687644-aac4c3eac7f4'),
    heroImage: hero('1600607687644-aac4c3eac7f4'),
    galleryImages: villaMountainViewGallery,
    facilities: ['Kolam Renang', 'Aula Besar', 'Taman', 'Dapur', 'Parkir Luas', 'WiFi', 'AC', 'Karaoke'],
    status: 'active',
    price_information: null,
  },
]

export function getVillaBySlug(slug: string): Villa | undefined {
  return villas.find((villa) => villa.slug === slug)
}
