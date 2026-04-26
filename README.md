# 📁 XII TJKT 1 — Website Kelas

## Struktur File
```
xii-tjkt1/
├── index.html     ← Buka ini di browser
├── style.css      ← Desain & tampilan
├── data.js        ← Data default (siswa, wali kelas, dll)
├── firebase.js    ← Firebase Realtime Database module
├── app.js         ← Logika utama (partikel, musik, render)
├── admin.js       ← Admin panel
└── README.md      ← Panduan ini
```

---

## 🔥 Setup Firebase (untuk pesan realtime semua orang bisa lihat)

1. Buka **console.firebase.google.com** → Add project
2. Nama project bebas (misal: `xii-tjkt1-2026`) → Create
3. Sidebar: **Build → Realtime Database → Create database**
4. Region: **asia-southeast1 (Singapore)** → **Start in test mode** → Enable
5. Gear icon → **Project settings** → scroll ke **Your apps** → klik `</>`
6. Register app → salin `firebaseConfig`
7. Admin Panel → tab **🔥 Firebase** → isi semua field → **Simpan & Hubungkan**
8. Selesai! Pesan dari semua orang tersimpan di cloud ✅

Gratis selamanya untuk proyek kecil.

---

## ☁️ Setup Cloudinary (untuk upload foto & video besar)

1. Daftar di **cloudinary.com** (gratis, 25GB)
2. Catat **Cloud Name** dari dashboard
3. Settings → Upload → Upload presets → Add preset → **Signing Mode: Unsigned** → Save
4. Admin Panel → tab **☁ Cloudinary** → isi Cloud Name & Preset → Simpan
5. Upload foto/video di tab Galeri — tanpa batas ukuran ✅

---

## 🎵 Musik

Lagu "17" Tulus via YouTube — auto-play saat user klik halaman pertama kali.
Butuh koneksi internet dan harus dihosting (bukan file:// lokal).

---

## ⚙️ Admin Panel

Password default: **`tjkt1admin`**

| Tab | Fungsi |
|-----|--------|
| 🖼 Logo | Upload logo & nama sekolah |
| 👩‍🏫 Wali Kelas | Edit 3 wali kelas (X, XI, XII) |
| 👥 Siswa | Tambah/hapus siswa + foto |
| 📸 Galeri | Upload foto & video via Cloudinary |
| ☁ Cloudinary | Setup cloud config |
| 🔥 Firebase | Setup database realtime |
| 🏆 Prestasi | Tambah/hapus prestasi |
| 💬 Pesan | Kelola pesan pengunjung |
| 🔒 Password | Ganti password admin |

---

## 🌐 Deploy ke Vercel (gratis)

1. Daftar di **github.com** → buat repo baru → upload semua file ini
2. Daftar di **vercel.com** → New Project → import repo GitHub
3. Deploy → dapat link misal: `https://xii-tjkt1.vercel.app`
4. Setup Firebase & Cloudinary lewat Admin Panel setelah deploy

---

## ⏱️ Timer Sejak Lulus

Dihitung dari **6 Mei 2026**. Sebelum = countdown ke kelulusan. Sesudah = sudah berapa lama.
