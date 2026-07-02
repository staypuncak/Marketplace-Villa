export interface Testimonial {
  id: string
  name: string
  city: string
  text: string
  villaName: string
}

export const testimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Rina Wijaya',
    city: 'Jakarta',
    text: 'Pengalaman menginap yang luar biasa! Villa bersih, nyaman, dan pemandangannya sangat indah. Anak-anak pun betah berlama-lama di sini.',
    villaName: 'Villa Pinus Indah',
  },
  {
    id: '2',
    name: 'Bambang Setiawan',
    city: 'Bandung',
    text: 'Pelayanan ramah dan fast response. Harga sesuai dengan kualitas yang didapat. Pasti balik lagi liburan ke sini bersama keluarga besar.',
    villaName: 'Villa Bukit Permai',
  },
  {
    id: '3',
    name: 'Sari Dewi',
    city: 'Tangerang',
    text: 'Recommended banget buat gathering kantor! Fasilitas lengkap, view pegunungan bikin adem, dan akses mudah dari tol.',
    villaName: 'Villa Highland Resort',
  },
  {
    id: '4',
    name: 'Hendra Kusuma',
    city: 'Depok',
    text: 'Bokingnya gampang banget via WhatsApp. Langsung dapat konfirmasi cepat. Villanya exceed expectation, bersih dan wangi.',
    villaName: 'Villa Cempaka Putih',
  },
  {
    id: '5',
    name: 'Dian Pratama',
    city: 'Bekasi',
    text: 'Weekend terakhir di Puncak bareng teman-teman. Villa nyaman, dapur lengkap, halamannya luas buat barbekuyan. Top markotop!',
    villaName: 'Villa Gardenia Hijau',
  },
]
