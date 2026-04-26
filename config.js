/* ╔══════════════════════════════════════════════════════════════╗
   ║           config.js — KONFIGURASI TEKNIS                    ║
   ║                                                              ║
   ║  HANYA Firebase & Cloudinary yang diisi di sini.            ║
   ║  Semua hal lain (logo, wali kelas, siswa, galeri,           ║
   ║  prestasi, password) diatur lewat ⚙ ADMIN PANEL.           ║
   ║                                                              ║
   ║  Cara pakai:                                                 ║
   ║  1. Isi apiKey Firebase & cloudName Cloudinary di bawah     ║
   ║  2. Save → push ke GitHub → Vercel auto redeploy            ║
   ║  3. Berlaku untuk SEMUA device otomatis ✅                  ║
   ╚══════════════════════════════════════════════════════════════╝ */


/* ══════════════════════════════════════════════════════
   1. FIREBASE — Database untuk Pesan & Komentar Realtime
      Cara dapat config:
      a. Buka console.firebase.google.com
      b. Buat project → Build → Realtime Database → Create
      c. Region: asia-southeast1 → Start in test mode → Enable
      d. Gear ⚙ → Project settings → Your apps → </> → Register
      e. Salin nilai dari firebaseConfig ke bawah ini
   ══════════════════════════════════════════════════════ */
const FIREBASE_CONFIG = {
  apiKey:      'AIzaSyAuFZFszBFOwsR--X1uDnS9hhvJrZnNEfM',
  authDomain:  'xii-tjkt-1-banjar.firebaseapp.com',
  databaseURL: 'https://xii-tjkt-1-banjar-default-rtdb.asia-southeast1.firebasedatabase.app',
  projectId:   'xii-tjkt-1-banjar',
  appId:       '1:781458943897:web:5459a551ce0341cfe82d08',
};


/* ══════════════════════════════════════════════════════
   2. CLOUDINARY — Upload Foto & Video (gratis 25GB)
      Cara dapat config:
      a. Daftar di cloudinary.com (gratis)
      b. Lihat Cloud Name di pojok kiri atas dashboard
      c. Settings → Upload → Upload presets → Add preset
      d. Set Signing Mode = Unsigned → Save → catat namanya
   ══════════════════════════════════════════════════════ */
const CLOUDINARY_CONFIG = {
  cloudName:    'duw6k06kt',
  uploadPreset: 'qrk6gv5h',
};


/* ══════════════════════════════════════════════════════
   INTERNAL — Jangan diubah di bawah sini
   ══════════════════════════════════════════════════════ */
(function applyTechConfig() {
  /* Terapkan ke DEF segera setelah data.js dimuat */
  if (typeof DEF === 'undefined') {
    console.error('config.js: DEF belum ada. Pastikan data.js dimuat sebelum config.js');
    return;
  }

  /* Firebase — hanya apply kalau sudah diisi (bukan placeholder) */
  if (FIREBASE_CONFIG.apiKey && !FIREBASE_CONFIG.apiKey.startsWith('ISI_')) {
    DEF.fbConfig = {
      apiKey:      FIREBASE_CONFIG.apiKey,
      authDomain:  FIREBASE_CONFIG.authDomain,
      databaseURL: FIREBASE_CONFIG.databaseURL,
      projectId:   FIREBASE_CONFIG.projectId,
      appId:       FIREBASE_CONFIG.appId,
    };
    console.log('✅ Firebase config loaded from config.js');
  } else {
    console.info('ℹ Firebase: belum diisi di config.js — akan cek localStorage');
  }

  /* Cloudinary — hanya apply kalau sudah diisi */
  if (CLOUDINARY_CONFIG.cloudName && !CLOUDINARY_CONFIG.cloudName.startsWith('ISI_')) {
    DEF.cldCloud  = CLOUDINARY_CONFIG.cloudName;
    DEF.cldPreset = CLOUDINARY_CONFIG.uploadPreset;
    console.log('✅ Cloudinary config loaded from config.js');
  } else {
    console.info('ℹ Cloudinary: belum diisi di config.js — akan cek localStorage');
  }
})();
