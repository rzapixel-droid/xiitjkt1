# XII TJKT 1 — Website Kelas

## 📁 Struktur File

```
xii-tjkt1/
├── config.js      ← ⭐ Edit ini di VS Code (Firebase & Cloudinary)
├── index.html     ← Halaman utama
├── style.css      ← Desain
├── data.js        ← Konstanta default (jangan diedit)
├── firebase.js    ← Firebase module (jangan diedit)
├── app.js         ← Logika utama (jangan diedit)
├── admin.js       ← Admin panel (jangan diedit)
└── README.md      ← Panduan ini
```

---

## ✅ Siapa mengisi apa?

| Yang diisi | Cara mengisi | Siapa |
|---|---|---|
| Firebase config | Edit `config.js` di VS Code | Developer (kamu) |
| Cloudinary config | Edit `config.js` di VS Code | Developer (kamu) |
| Logo kelas | Admin Panel → 🖼 Logo | Ketua kelas |
| Nama sekolah | Admin Panel → 🖼 Logo | Ketua kelas |
| Wali kelas (3 orang) | Admin Panel → 👩‍🏫 Wali Kelas | Ketua kelas |
| Daftar 33 siswa + foto | Admin Panel → 👥 Siswa | Ketua kelas |
| Foto & video galeri | Admin Panel → 📸 Galeri | Ketua kelas |
| Prestasi kelas | Admin Panel → 🏆 Prestasi | Ketua kelas |
| Ganti password | Admin Panel → 🔒 Password | Ketua kelas |

---

## ⭐ Setup oleh Developer (VS Code) — config.js

Buka `config.js`, isi 2 bagian ini saja:

### Firebase (database pesan)
```js
const FIREBASE_CONFIG = {
  apiKey:      'AIzaSyXXXXXXXXXXXXXXX',
  authDomain:  'nama-project.firebaseapp.com',
  databaseURL: 'https://nama-project-rtdb.asia-southeast1.firebasedatabase.app',
  projectId:   'nama-project',
  appId:       '1:123456:web:abcdef',
};
```

**Cara dapat:**
1. [console.firebase.google.com](https://console.firebase.google.com) → Add project
2. Build → Realtime Database → Create → asia-southeast1 → **test mode**
3. Gear ⚙ → Project settings → Your apps → `</>` → Register → copy config

### Cloudinary (upload foto & video besar)
```js
const CLOUDINARY_CONFIG = {
  cloudName:    'dxyz123abc',
  uploadPreset: 'tjkt1_preset',
};
```

**Cara dapat:**
1. Daftar di [cloudinary.com](https://cloudinary.com) (gratis 25GB)
2. Cloud Name ada di dashboard pojok kiri atas
3. Settings → Upload → Upload presets → Add preset → **Unsigned** → Save

Setelah isi → save → push ke GitHub → Vercel auto redeploy. Semua device langsung dapat config terbaru!

---

## 🚀 Deploy ke Vercel

1. Upload semua file ke GitHub repo
2. [vercel.com](https://vercel.com) → New Project → import repo → Deploy
3. Dapat link: `https://xii-tjkt1.vercel.app`

---

## ⚙️ Admin Panel (untuk ketua kelas)

- Buka website → klik tombol **⚙ Admin** kanan atas
- Password default: `sotobiwiwi`
- Bisa ganti password di tab 🔒 Password

---

## 🎵 Musik — "17" Tulus (MP3 lokal)

1. Download lagu "17" - Tulus dalam format MP3
2. Rename filenya jadi **`lagu.mp3`** (huruf kecil semua)
3. Taruh di folder yang sama dengan `index.html`
4. Push ke GitHub → otomatis tersedia di Vercel

Struktur folder seharusnya:
```
xii-tjkt1/
├── lagu.mp3      ← taruh di sini
├── index.html
├── config.js
└── ... (file lainnya)
```

Musik akan auto-play saat user pertama kali klik/scroll halaman.
Tombol 🎵 bulat di pojok kanan bawah untuk play/pause manual.
Kredit lagu otomatis muncul di footer website.
