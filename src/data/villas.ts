import type { Villa } from '@/types/villa'

export const villas: Villa[] = [
  {
    id: '1',
    name: 'Villa Puncak Indah',
    slug: 'villa-puncak-indah',
    description:
      'Villa nyaman dengan pemandangan pegunungan yang menakjubkan. Dilengkapi kolam renang pribadi dan taman luas untuk keluarga.',
    price: 2500000,
    capacity: 10,
    location: 'Cisarua, Puncak',
    image: '/images/villa-puncak-indah.jpg',
    facilities: ['Kolam Renang', 'Taman', 'Parkir Luas', 'Dapur', 'WiFi'],
    status: 'active',
  },
  {
    id: '2',
    name: 'Villa Bukit Respati',
    slug: 'villa-bukit-respati',
    description:
      'Villa bergaya modern dengan fasilitas lengkap. Cocok untuk gathering dan acara keluarga besar.',
    price: 3500000,
    capacity: 16,
    location: 'Megamendung, Puncak',
    image: '/images/villa-bukit-respati.jpg',
    facilities: ['Kolam Renang', 'Aula', 'Parkir Luas', 'Dapur', 'WiFi', 'Karaoke'],
    status: 'active',
  },
  {
    id: '3',
    name: 'Villa Cloud Nine',
    slug: 'villa-cloud-nine',
    description:
      'Villa eksklusif di ketinggian dengan pemandangan awan langsung dari kamar. Dilengkapi fireplace dan spa.',
    price: 5000000,
    capacity: 8,
    location: 'Tugu Selatan, Puncak',
    image: '/images/villa-cloud-nine.jpg',
    facilities: ['Fireplace', 'Spa', 'Taman', 'Dapur', 'WiFi', 'AC'],
    status: 'active',
  },
  {
    id: '4',
    name: 'Villa Alam Asri',
    slug: 'villa-alam-asri',
    description:
      'Villa sederhana namun asri dikelilingi kebun teh. Cocok untuk liburan santai keluarga kecil.',
    price: 1500000,
    capacity: 6,
    location: 'Pacet, Puncak',
    image: '/images/villa-alam-asri.jpg',
    facilities: ['Taman', 'Dapur', 'Parkir', 'WiFi'],
    status: 'active',
  },
  {
    id: '5',
    name: 'Villa Mountain View',
    slug: 'villa-mountain-view',
    description:
      'Villa mewah dengan pemandangan Gunung Pangrango. Fasilitas lengkap untuk acara pernikahan dan gathering perusahaan.',
    price: 7500000,
    capacity: 25,
    location: 'Cipanas, Puncak',
    image: '/images/villa-mountain-view.jpg',
    facilities: ['Kolam Renang', 'Aula Besar', 'Taman', 'Dapur', 'Parkir Luas', 'WiFi', 'AC', 'Karaoke'],
    status: 'active',
  },
]

export function getVillaBySlug(slug: string): Villa | undefined {
  return villas.find((villa) => villa.slug === slug)
}
