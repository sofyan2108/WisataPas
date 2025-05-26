# WisataPas

Aplikasi web untuk menemukan destinasi wisata terbaik di Indonesia.

## Fitur

- Pencarian destinasi wisata
- Detail informasi destinasi
- Galeri foto
- Informasi lokasi dan peta
- Review dan rating
- Rekomendasi destinasi terkait
- Sistem favorit

## Teknologi yang Digunakan

- HTML5
- CSS3
- JavaScript (ES6+)
- Webpack
- Font Awesome
- Google Maps API

## Cara Menjalankan Aplikasi

1. Clone repository ini
```bash
git clone https://github.com/sofyan2108/WisataPas.git
```

2. Install dependencies
```bash
npm install
```

3. Jalankan aplikasi dalam mode development
```bash
npm run start-dev
```

4. Buka browser dan akses `http://localhost:8080`

## Build untuk Production

Untuk membuat versi production:
```bash
npm run build
```

## Struktur Project

```
src/
├── scripts/
│   ├── data/          # Data layer
│   ├── globals/       # Global configurations
│   ├── routes/        # Routing
│   ├── utils/         # Utilities
│   └── views/         # UI components
├── styles/            # CSS files
├── templates/         # HTML templates
└── app.js            # Application entry point
```

## Kontribusi

1. Fork repository
2. Buat branch baru (`git checkout -b fitur-baru`)
3. Commit perubahan (`git commit -am 'Menambah fitur baru'`)
4. Push ke branch (`git push origin fitur-baru`)
5. Buat Pull Request

## Lisensi

[MIT License](LICENSE) 