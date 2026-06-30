export type BlogArticle = {
  id: string
  title: string
  slug: string
  excerpt: string
  category: string
  date: string
}

export const blogArticles: BlogArticle[] = [
  {
    id: '1',
    title: 'Tips Memilih Villa Puncak untuk Liburan Keluarga',
    slug: 'tips-memilih-villa-puncak',
    excerpt:
      'Liburan keluarga di Puncak Bogor semakin berkesan dengan villa yang tepat. Simak tips memilih villa yang cocok untuk kebutuhan keluarga Anda.',
    category: 'Panduan',
    date: '2026-06-25',
  },
  {
    id: '2',
    title: 'Rekomendasi Villa Puncak untuk Rombongan',
    slug: 'rekomendasi-villa-rombongan',
    excerpt:
      'Mencari villa untuk gathering atau liburan rombongan? Berikut rekomendasi villa di Puncak dengan kapasitas besar dan fasilitas lengkap.',
    category: 'Rekomendasi',
    date: '2026-06-20',
  },
  {
    id: '3',
    title: 'Kenapa Booking Villa Puncak via WhatsApp Lebih Praktis',
    slug: 'booking-via-whatsapp-praktis',
    excerpt:
      'Booking villa via WhatsApp memberikan kemudahan komunikasi langsung dengan pemilik villa tanpa perlu aplikasi tambahan.',
    category: 'Tips',
    date: '2026-06-15',
  },
  {
    id: '4',
    title: 'Waktu Terbaik untuk Liburan ke Puncak Bogor',
    slug: 'waktu-terbaik-liburan-puncak',
    excerpt:
      'Puncak Bogor memiliki pesona berbeda di setiap musim. Kenali waktu terbaik untuk liburan agar pengalaman Anda maksimal.',
    category: 'Panduan',
    date: '2026-06-10',
  },
  {
    id: '5',
    title: 'Checklist Sebelum Sewa Villa di Puncak',
    slug: 'checklist-sewa-villa-puncak',
    excerpt:
      'Jangan sampai ada yang terlewat. Gunakan checklist lengkap ini sebelum menyewa villa di Puncak Bogor untuk liburan yang nyaman.',
    category: 'Tips',
    date: '2026-06-05',
  },
]
