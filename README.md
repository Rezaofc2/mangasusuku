# KomikCat

Portal baca komik online — Manhwa, Manga, dan Manhua Bahasa Indonesia. Dibangun dengan Next.js 16 (App Router). Sudah termasuk API scraper untuk mangasusuku.com.

## Fitur
- 🎨 UI dark mode modern (mirip komik.reyza.my.id)
- 🏠 Halaman Home dengan hero, Komik Terbaru, dan Komik Populer
- 📖 Halaman detail komik + daftar chapter lengkap
- 📱 Chapter reader dengan navigasi prev/next
- 🔍 Halaman pencarian & pagination
- 🌏 Bypass blokir Kominfo otomatis via Vercel (tanpa VPN)
- 🔌 API endpoints internal `/api/mangasusuku/*`

## Menjalankan Lokal
```bash
npm install
npm run dev
```

## Deploy ke Vercel
1. Push project ini ke GitHub
2. Buka [vercel.com](https://vercel.com), import repository
3. Vercel akan otomatis mendeteksi Next.js. Klik **Deploy**
4. Tidak perlu konfigurasi tambahan

## Struktur
- `/` — Home page
- `/komik/[slug]` — Detail komik
- `/baca/[[...slug]]` — Chapter reader
- `/search?q=...` — Pencarian
- `/api-docs` — Dokumentasi API
- `/api/mangasusuku/*` — API endpoints

## Endpoint API
| Path | Deskripsi |
|------|-----------|
| GET `/api/mangasusuku/search?q=...&page=1` | Cari komik |
| GET `/api/mangasusuku/ongoing?page=1` | Komik ongoing |
| GET `/api/mangasusuku/popular?page=1` | Komik populer |
| GET `/api/mangasusuku/detail?slug=...` | Detail komik |
| GET `/api/mangasusuku/read?slug=...` | Gambar chapter |

Semua request diproxy melalui server Vercel (luar Indo) sehingga bypass blokir Kominfo otomatis.
