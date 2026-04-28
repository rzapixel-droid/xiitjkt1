/* ═══════════════════════════════════════════════════════════════
   firebase.js — Firebase Realtime Database
   
   Menyimpan DUA jenis data ke Firebase:
   1. /siteData  → semua config admin (logo, wali, siswa, galeri, prestasi)
                   agar terlihat SAMA di semua device
   2. /pesan     → komentar pengunjung (realtime)
   ═══════════════════════════════════════════════════════════════ */

let fbApp      = null;
let fbDb       = null;
let fbReady    = false;
let fbUnsubMsg = null;

/* ════════════════════════════════════════
   INIT FIREBASE
   ════════════════════════════════════════ */
async function initFirebase() {
  const cfg = D.fbConfig;
  if (!cfg || !cfg.apiKey || !cfg.databaseURL) {
    console.info('ℹ Firebase: config belum diisi di config.js');
    return false;
  }

  try {
    if (!window._fbLoaded) {
      await loadScript('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js');
      await loadScript('https://www.gstatic.com/firebasejs/10.12.0/firebase-database-compat.js');
      window._fbLoaded = true;
    }

    if (!fbApp) {
      try        { fbApp = firebase.app(); }
      catch (_)  { fbApp = firebase.initializeApp(cfg); }
    }
    fbDb    = firebase.database(fbApp);
    fbReady = true;
    console.log('✅ Firebase connected:', cfg.projectId);
    return true;
  } catch (err) {
    console.error('Firebase init error:', err);
    fbReady = false;
    return false;
  }
}

function loadScript(src) {
  return new Promise((res, rej) => {
    if (document.querySelector(`script[src="${src}"]`)) return res();
    const s = document.createElement('script');
    s.src = src; s.onload = res; s.onerror = rej;
    document.head.appendChild(s);
  });
}

/* ════════════════════════════════════════
   SITE DATA — logo, wali, siswa, galeri, prestasi
   Disimpan di Firebase /siteData agar semua device sama
   ════════════════════════════════════════ */

/* Ambil siteData dari Firebase, terapkan ke D, lalu render ulang */
async function fbLoadSiteData() {
  if (!fbReady) return;
  try {
    const snap = await fbDb.ref('siteData').once('value');
    const data = snap.val();
    if (data) {
      /* Merge ke D — hanya field yang ada di Firebase yang diupdate */
      const fields = ['school','logo','password','wali','siswa','galeri','prestasi'];
      fields.forEach(f => { if (data[f] !== undefined) D[f] = data[f]; });
      console.log('✅ siteData loaded from Firebase');
      /* Re-render semua komponen dengan data terbaru */
      renderAll();
    }
  } catch (err) {
    console.error('fbLoadSiteData error:', err);
  }
}

/* Simpan D ke Firebase /siteData — dipanggil setiap admin save */
async function fbSaveSiteData() {
  if (!fbReady) return false;
  try {
    const payload = {
      school:   D.school   || '',
      logo:     D.logo     || null,
      password: D.password || 'sotobiwiwi',
      wali:     D.wali     || [],
      siswa:    D.siswa    || [],
      galeri:   D.galeri   || [],
      prestasi: D.prestasi || [],
    };
    await fbDb.ref('siteData').set(payload);
    return true;
  } catch (err) {
    console.error('fbSaveSiteData error:', err);
    return false;
  }
}

/* Listener realtime — kalau admin update dari device lain,
   semua visitor langsung dapat update tanpa refresh */
function fbWatchSiteData() {
  if (!fbReady) return;
  fbDb.ref('siteData').on('value', snap => {
    const data = snap.val();
    if (!data) return;
    const fields = ['school','logo','wali','siswa','galeri','prestasi'];
    fields.forEach(f => { if (data[f] !== undefined) D[f] = data[f]; });
    renderAll();
  });
}

/* ════════════════════════════════════════
   PESAN — komentar pengunjung
   ════════════════════════════════════════ */
function msgRef()    { return fbDb.ref('pesan'); }
function msgIdRef(k) { return fbDb.ref('pesan/' + k); }

function fbLoadPesan(onData) {
  if (!fbReady) return;
  if (fbUnsubMsg) { msgRef().off('value', fbUnsubMsg); }
  fbUnsubMsg = msgRef().on('value', snap => {
    const raw   = snap.val() || {};
    const items = Object.entries(raw)
      .map(([k, v]) => ({ k, ...v }))
      .sort((a, b) => b.ts - a.ts);
    onData(items);
  });
}

async function fbKirimPesan(nama, role, pesan) {
  if (!fbReady) return { ok: false, err: 'Firebase belum terhubung' };
  try {
    const key = 'msg_' + Date.now() + '_' + Math.random().toString(36).slice(2, 7);
    await msgIdRef(key).set({ nama, role, pesan, ts: Date.now() });
    return { ok: true };
  } catch (err) {
    return { ok: false, err: err.message };
  }
}

async function fbHapusPesan(key) {
  if (!fbReady) return false;
  try { await msgIdRef(key).remove(); return true; }
  catch { return false; }
}

async function fbCekKoneksi() {
  if (!fbReady) return false;
  try { await fbDb.ref('.info/connected').once('value'); return true; }
  catch { return false; }
}
