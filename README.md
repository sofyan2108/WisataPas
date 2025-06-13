# WisataPas - Platform Rekomendasi Wisata di Pasuruan

WisataPas adalah platform web yang menyediakan rekomendasi wisata di Kabupaten Pasuruan. Platform ini membantu pengguna menemukan destinasi wisata yang sesuai dengan preferensi mereka menggunakan teknologi AI.

## 🌟 Fitur Utama

- **Pencarian Destinasi Wisata**: Temukan destinasi wisata berdasarkan lokasi, kategori, dan preferensi
- **Rekomendasi AI**: Dapatkan rekomendasi wisata yang dipersonalisasi menggunakan teknologi AI
- **Favorit**: Simpan destinasi wisata favorit untuk referensi di masa mendatang
- **Detail Wisata**: Informasi lengkap tentang setiap destinasi wisata termasuk:
  - Deskripsi lokasi
  - Fasilitas
  - Harga tiket
  - Jam operasional
  - Lokasi (dengan peta)
  - Galeri foto
  - Ulasan pengunjung
- **Responsif**: Tampilan yang optimal di desktop, tablet, dan smartphone

## 🛠️ Teknologi yang Digunakan

### Frontend
- HTML5
- CSS3 (dengan CSS Variables dan Flexbox/Grid)
- JavaScript (ES6+)
- Leaflet.js untuk integrasi peta
- Font Awesome untuk ikon

### Backend
- Python
- Flask
- TensorFlow untuk model rekomendasi AI
- PostgreSQL untuk database

## 🚀 Cara Menjalankan Proyek

1. Clone repositori
```bash
git clone https://github.com/username/WisataPas.git
cd WisataPas
```

2. Install dependensi frontend
```bash
npm install
```

3. Install dependensi backend
```bash
pip install -r requirements.txt
```

4. Jalankan server development
```bash
# Frontend
npm run dev

# Backend
python app.py
```

5. Buka browser dan akses `http://localhost:3000`

## 📱 Tampilan Responsif

WisataPas didesain dengan pendekatan mobile-first dan mendukung berbagai ukuran layar:
- Desktop (1200px ke atas)
- Tablet (768px - 1199px)
- Smartphone (di bawah 768px)

## 🎨 Struktur Proyek

```
WisataPas/
├── src/
│   ├── styles/
│   │   ├── components/
│   │   │   ├── header.css
│   │   │   ├── footer.css
│   │   │   └── destination-modal.css
│   │   └── pages/
│   │       ├── home.css
│   │       ├── destination.css
│   │       ├── favorite.css
│   │       └── about.css
│   ├── scripts/
│   │   ├── main.js
│   │   ├── destination.js
│   │   └── favorite.js
│   └── assets/
│       ├── images/
│       └── icons/
├── public/
├── backend/
│   ├── app.py
│   ├── models/
│   └── utils/
├── requirements.txt
└── README.md
```

## 🤝 Kontribusi

Kontribusi selalu diterima! Untuk berkontribusi:

1. Fork repositori
2. Buat branch fitur (`git checkout -b feature/AmazingFeature`)
3. Commit perubahan (`git commit -m 'Add some AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Buat Pull Request

## 📝 Lisensi

Proyek ini dilisensikan di bawah Lisensi MIT - lihat file [LICENSE](LICENSE) untuk detail.

## 👥 Tim Pengembang

- [Sofyan Farros] - Frontend Developer
- [Muhammad Jamaludin] - Backend Developer
- [Abdullah Ridho] - Project Manager
- [Miftahullah Surya] - AI Engineer (Machine Learning)
- [Marsha Kamilla] - AI Engineer (Machine Learning)
- [Husnul Khatimah] - AI Engineer (Machine Learning)

## 🙏 Ucapan Terima Kasih

- [Dicoding Indonesia](https://www.dicoding.com/) untuk program pembelajaran
- Semua kontributor yang telah membantu pengembangan proyek ini

