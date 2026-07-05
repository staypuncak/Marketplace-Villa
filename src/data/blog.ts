const img = (id: string) =>
  `https://images.unsplash.com/photo-${id}?w=1200&q=80`

export type BlogArticle = {
  id: string
  title: string
  slug: string
  excerpt: string
  category: string
  date: string
  featured_image_url: string | null
  content: string
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
    featured_image_url: img('1564013799919-ab600027ffc6'),
    content: `Memilih villa untuk liburan keluarga memang membutuhkan pertimbangan khusus. Tidak seperti hotel, villa menawarkan privasi dan ruang yang lebih luas, namun Anda perlu memastikan beberapa hal sebelum memutuskan.

Pertama, perhatikan kapasitas villa. Villa yang ideal untuk keluarga biasanya memiliki minimal 3 kamar tidur dengan ruang keluarga yang luas. Pastikan juga terdapat dapur lengkap jika Anda berencana memasak sendiri selama liburan.

Kedua, fasilitas ramah anak. Cari villa yang memiliki halaman luas, kolam renang dengan kedalaman yang aman untuk anak-anak, dan area bermain. Beberapa villa di Puncak bahkan menyediakan perlengkapan bayi seperti baby cot dan high chair.

Ketiga, lokasi strategis. Pilih villa yang dekat dengan pusat oleh-oleh, restoran, dan tempat wisata alam seperti Taman Safari atau Kebun Teh. Lokasi yang strategis akan memudahkan Anda saat berkeliling Puncak.

Terakhir, baca ulasan dari tamu sebelumnya. Pengalaman orang lain bisa menjadi referensi berharga untuk mengetahui kondisi villa yang sebenarnya.`,
  },
  {
    id: '2',
    title: 'Rekomendasi Villa Puncak untuk Rombongan',
    slug: 'rekomendasi-villa-rombongan',
    excerpt:
      'Mencari villa untuk gathering atau liburan rombongan? Berikut rekomendasi villa di Puncak dengan kapasitas besar dan fasilitas lengkap.',
    category: 'Rekomendasi',
    date: '2026-06-20',
    featured_image_url: img('1600585154340-be6161a56a0c'),
    content: `Liburan rombongan bersama keluarga besar, teman kantor, atau komunitas membutuhkan akomodasi yang bisa menampung banyak orang tanpa mengurangi kenyamanan. Villa-villa di Puncak Bogor menawarkan solusi tepat untuk kebutuhan ini.

Villa dengan kapasitas 15-25 orang sangat cocok untuk gathering dan acara keluarga besar. Beberapa villa bahkan memiliki aula indoor yang bisa digunakan untuk makan malam bersama atau meeting singkat.

Fasilitas yang wajib dimiliki villa rombongan antara lain: area parkir luas yang bisa menampung beberapa mobil, dapur besar untuk menyiapkan konsumsi rombongan, kolam renang ukuran besar, serta ruang serbaguna untuk berkumpul.

Lokasi villa juga penting dipertimbangkan. Villa di kawasan Cisarua dan Megamendung umumnya lebih mudah diakses dan dekat dengan berbagai fasilitas umum seperti supermarket dan rumah makan.

Jangan lupa untuk menghubungi pengelola villa jauh-jauh hari untuk memastikan ketersediaan, terutama di musim liburan dan akhir pekan.`,
  },
  {
    id: '3',
    title: 'Kenapa Booking Villa Puncak via WhatsApp Lebih Praktis',
    slug: 'booking-via-whatsapp-praktis',
    excerpt:
      'Booking villa via WhatsApp memberikan kemudahan komunikasi langsung dengan pemilik villa tanpa perlu aplikasi tambahan.',
    category: 'Tips',
    date: '2026-06-15',
    featured_image_url: img('1600881332395-9cddc5ac54ac'),
    content: `Di era digital seperti sekarang, memesan akomodasi bisa dilakukan melalui berbagai platform. Namun, booking villa di Puncak via WhatsApp memiliki beberapa keunggulan yang tidak dimiliki platform lain.

Komunikasi Langsung
Anda bisa bertanya langsung tentang ketersediaan villa, negosiasi harga untuk rombongan, atau request fasilitas khusus tanpa harus menunggu respon email atau mengisi formulir panjang.

Tidak Ada Biaya Tambahan
Booking langsung via WhatsApp dengan pemilik villa berarti tidak ada biaya komisi atau biaya pemesanan tambahan. Harga yang Anda dapatkan adalah harga langsung dari pemilik.

Fleksibilitas Pembayaran
Proses pembayaran bisa disesuaikan dengan kesepakatan antara Anda dan pemilik villa. Umumnya menggunakan transfer bank dengan DP 50% dan pelunasan saat check-in.

Konfirmasi Cepat
Pemilik villa biasanya merespon lebih cepat dibandingkan platform pemesanan online. Anda bisa mendapatkan konfirmasi dalam hitungan menit, bukan jam atau hari.

Informasi Lebih Detail
Anda bisa meminta video tour, foto tambahan, atau informasi spesifik tentang villa yang tidak tercantum di website.`,
  },
  {
    id: '4',
    title: 'Waktu Terbaik untuk Liburan ke Puncak Bogor',
    slug: 'waktu-terbaik-liburan-puncak',
    excerpt:
      'Puncak Bogor memiliki pesona berbeda di setiap musim. Kenali waktu terbaik untuk liburan agar pengalaman Anda maksimal.',
    category: 'Panduan',
    date: '2026-06-10',
    featured_image_url: img('1506905925346-21bda0b80e00'),
    content: `Puncak Bogor terkenal dengan udaranya yang sejuk dan pemandangan alam yang indah sepanjang tahun. Namun, setiap musim menawarkan pengalaman yang berbeda.

Musim Kemarau (April-Oktober)
Ini adalah waktu paling populer untuk liburan ke Puncak. Cuaca cerah dengan pemandangan gunung yang jelas, cocok untuk aktivitas outdoor seperti berjalan di kebun teh, berkunjung ke Taman Safari, atau sekadar bersantai di halaman villa.

Musim Hujan (November-Maret)
Suasana Puncak di musim hujan memiliki pesona tersendiri. Kabut tipis yang menyelimuti perbukitan menciptakan panorama yang dramatis. Ini waktu yang tepat untuk menikmati secangkir kopi hangat di teras villa sambil menikmati pemandangan.

Akhir Pekan vs Hari Kerja
Akhir pekan dan hari libur nasional adalah waktu tersibuk. Jika Anda menginginkan ketenangan, pilihlah weekday. Harga villa di weekday juga umumnya lebih terjangkau.

Musim Liburan
Libur Lebaran, Natal, dan Tahun Baru adalah high season. Disarankan booking minimal 2-3 minggu sebelumnya untuk mendapatkan villa terbaik.`,
  },
  {
    id: '5',
    title: 'Checklist Sebelum Sewa Villa di Puncak',
    slug: 'checklist-sewa-villa-puncak',
    excerpt:
      'Jangan sampai ada yang terlewat. Gunakan checklist lengkap ini sebelum menyewa villa di Puncak Bogor untuk liburan yang nyaman.',
    category: 'Tips',
    date: '2026-06-05',
    featured_image_url: img('1600596542815-ffad4c1539a9'),
    content: `Sebelum menyewa villa di Puncak, ada beberapa hal penting yang perlu Anda persiapkan agar liburan berjalan lancar. Berikut checklist lengkapnya.

Sebelum Booking
Tentukan tanggal dan durasi menginap. Pastikan villa yang dipilih memiliki kapasitas sesuai jumlah tamu. Periksa fasilitas utama seperti kamar tidur, kamar mandi, dapur, dan area parkir.

Saat Booking
Tanyakan ketersediaan villa di tanggal yang diinginkan. Konfirmasi harga total termasuk biaya tambahan seperti listrik atau kebersihan. Tanyakan kebijakan pembatalan untuk antisipasi jika ada perubahan rencana.

Sebelum Berangkat
Konfirmasi ulang booking 1-2 hari sebelumnya. Catat alamat lengkap dan nomor kontak pengelola. Siapkan peta atau gunakan Google Maps karena beberapa villa berada di jalan yang cukup kompleks.

Perlengkapan yang Dibawa
Pakaian hangat karena suhu Puncak bisa mencapai 15-20 derajat Celcius di malam hari. Bawa obat pribadi dan perlengkapan mandi cadangan. Jangan lupa kamera untuk mengabadikan momen.

Saat Check-In
Periksa kondisi villa dan fasilitas saat tiba. Laporkan segera jika ada kerusakan atau kekurangan. Simpan nomor kontak pengelola untuk keadaan darurat.

Dengan persiapan yang matang, liburan Anda di Puncak pasti akan berkesan dan menyenangkan.`,
  },
]
