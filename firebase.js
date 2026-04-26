/* ═══════════════════════════════════════════════════════
   firebase.js — Firebase Realtime Database
   Handles semua operasi pesan/komentar ke cloud.

   CARA SETUP (baca juga panduan di Admin Panel → 🔥 Firebase):
   1. Buka console.firebase.google.com
   2. Create project → beri nama (misal: xii-tjkt1)
   3. Klik "Realtime Database" di sidebar → Create database
   4. Pilih region "asia-southeast1 (Singapore)" → Start in test mode → Enable
   5. Klik ikon gear (Project settings) → tab "General" → scroll ke "Your apps"
   6. Klik icon </> (Web) → register app → salin firebaseConfig
   7. Masuk Admin Panel website → tab 🔥 Firebase → isi config → Simpan
   ═══════════════════════════════════════════════════════ */

/* ── State Firebase ── */
let fbApp      = null;
let fbDb       = null;
let fbReady    = false;
let fbUnsubMsg = null;   /* listener realtime pesan */

/* ── Init Firebase dari config yang disimpan di D ── */
async function initFirebase() {
  const cfg = D.fbConfig;
  if (!cfg || !cfg.apiKey || !cfg.databaseURL) return false;

  try {
    /* Load Firebase SDK via CDN hanya sekali */
    if (!window._fbLoaded) {
      await loadScript('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js');
      await loadScript('https://www.gstatic.com/firebasejs/10.12.0/firebase-database-compat.js');
      window._fbLoaded = true;
    }

    /* Inisialisasi atau reuse app */
    if (!fbApp) {
      try        { fbApp = firebase.app();              }
      catch (_)  { fbApp = firebase.initializeApp(cfg); }
    }
    fbDb    = firebase.database(fbApp);
    fbReady = true;
    console.log('✅ Firebase connected:', cfg.databaseURL);
    return true;
  } catch (err) {
    console.error('Firebase init error:', err);
    fbReady = false;
    return false;
  }
}

/* ── Helper: load script dinamis ── */
function loadScript(src) {
  return new Promise((res, rej) => {
    if (document.querySelector(`script[src="${src}"]`)) return res();
    const s = document.createElement('script');
    s.src = src; s.onload = res; s.onerror = rej;
    document.head.appendChild(s);
  });
}

/* ── Ref helper ── */
function msgRef()    { return fbDb.ref('pesan'); }
function msgIdRef(k) { return fbDb.ref('pesan/' + k); }

/* ════════════════════════════════════════
   LOAD PESAN (realtime listener)
   ════════════════════════════════════════ */
function fbLoadPesan(onData) {
  if (!fbReady) return;

  /* Hapus listener lama jika ada */
  if (fbUnsubMsg) { msgRef().off('value', fbUnsubMsg); }

  fbUnsubMsg = msgRef().on('value', snap => {
    const raw = snap.val() || {};
    const items = Object.entries(raw)
      .map(([k, v]) => ({ k, ...v }))
      .sort((a, b) => b.ts - a.ts);
    onData(items);
  });
}

/* ════════════════════════════════════════
   KIRIM PESAN
   ════════════════════════════════════════ */
async function fbKirimPesan(nama, role, pesan) {
  if (!fbReady) return { ok: false, err: 'Firebase belum terhubung' };
  try {
    const key = 'msg_' + Date.now() + '_' + Math.random().toString(36).slice(2,7);
    await msgIdRef(key).set({ nama, role, pesan, ts: Date.now() });
    return { ok: true };
  } catch (err) {
    return { ok: false, err: err.message };
  }
}

/* ════════════════════════════════════════
   HAPUS PESAN (admin only)
   ════════════════════════════════════════ */
async function fbHapusPesan(key) {
  if (!fbReady) return false;
  try { await msgIdRef(key).remove(); return true; }
  catch { return false; }
}

/* ════════════════════════════════════════
   CEK KONEKSI
   ════════════════════════════════════════ */
async function fbCekKoneksi() {
  if (!fbReady) return false;
  try {
    await fbDb.ref('.info/connected').once('value');
    return true;
  } catch { return false; }
}

/* ════════════════════════════════════════
   SIMPAN CONFIG ke D dan storage
   ════════════════════════════════════════ */
async function saveFbConfig(cfg) {
  D.fbConfig = cfg;
  await save();
}
