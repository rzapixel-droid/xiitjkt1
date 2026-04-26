/* ═══════════════════════════════════════════
   app.js — main application logic
   (particles, music, render, countdown)
   ═══════════════════════════════════════════ */

/* ── STORAGE LAYER ──
   Pakai localStorage — data tetap ada setelah refresh di Vercel/hosting manapun.
   Semua fungsi async agar kompatibel dengan kode lama.
────────────────────────────────────────── */
const S = {
  async get(k) {
    try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : null; }
    catch { return null; }
  },
  async set(k, v) {
    try { localStorage.setItem(k, JSON.stringify(v)); return true; }
    catch (e) { console.warn('localStorage full:', e); return false; }
  },
  async del(k) {
    try { localStorage.removeItem(k); return true; }
    catch { return false; }
  },
  async list(p) {
    try { return Object.keys(localStorage).filter(k => k.startsWith(p)); }
    catch { return []; }
  }
};

/* ── STATE ── */
let D = JSON.parse(JSON.stringify(DEF));

/* ── INIT ── */
async function init() {
  /*
   * Prioritas data:
   *   Firebase & Cloudinary → dari config.js (berlaku semua device)
   *   Semua yang lain       → dari localStorage Admin Panel
   *                           (logo, wali, siswa, galeri, prestasi, password, dll)
   */
  const saved = await S.get('tjkt1-app');
  if (saved) {
    /* Mulai dari data yang disimpan Admin Panel */
    D = Object.assign(JSON.parse(JSON.stringify(DEF)), saved);
  } else {
    D = JSON.parse(JSON.stringify(DEF));
  }

  /* Firebase & Cloudinary dari config.js selalu override localStorage
     agar semua device dapat config yang sama tanpa perlu isi admin panel */
  if (DEF.fbConfig)  D.fbConfig  = DEF.fbConfig;
  if (DEF.cldCloud)  D.cldCloud  = DEF.cldCloud;
  if (DEF.cldPreset) D.cldPreset = DEF.cldPreset;
  /* Semua field lain (logo, wali, siswa, prestasi, password) → dari localStorage */

  /* LULUS_DATE selalu dari data.js (hardcoded 6 Mei 2026) */
  window._EFFECTIVE_LULUS_DATE = LULUS_DATE;

  /* Init Firebase */
  await initFirebase();

  if (fbReady) {
    /* Firebase tersambung:
       1. Ambil siteData (logo, wali, siswa, dll) dari cloud → berlaku semua device
       2. Pasang realtime listener agar update admin langsung terlihat semua orang */
    await fbLoadSiteData();
    fbWatchSiteData();
  } else {
    /* Firebase belum diisi di config.js — fallback ke localStorage */
    console.info('ℹ Menggunakan localStorage sebagai fallback');
  }

  initParticles();
  initMusic();
  renderAll();
  loadPesan();
  startSinceLulus();
  initReveal();
  animCounters();
}

/* save() — tulis ke Firebase (kalau ada) DAN localStorage (sebagai cache lokal) */
async function save() {
  /* Selalu simpan ke localStorage sebagai cache */
  await S.set('tjkt1-app', D);
  /* Kalau Firebase ready, sync ke cloud agar semua device dapat update */
  if (fbReady) {
    const ok = await fbSaveSiteData();
    if (!ok) console.warn('⚠ Gagal sync ke Firebase, data tersimpan lokal saja');
  }
  return true;
}

function renderAll() {
  renderHero();
  renderWali();
  renderSiswa();
  renderGaleri('all');
  renderPrestasi();
  updateFooter();
}

/* ═══════════════════════════════════════════
   PARTICLES
   ═══════════════════════════════════════════ */
function initParticles() {
  const canvas = document.getElementById('particleCanvas');
  const ctx    = canvas.getContext('2d');

  let W, H, particles = [];
  const COLORS = ['rgba(124,111,255,', 'rgba(255,95,126,', 'rgba(61,224,160,', 'rgba(255,198,87,'];

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  class Particle {
    constructor() { this.reset(true); }
    reset(rand) {
      this.x  = Math.random() * W;
      this.y  = rand ? Math.random() * H : H + 10;
      this.r  = Math.random() * 1.8 + 0.4;
      this.vx = (Math.random() - 0.5) * 0.3;
      this.vy = -(Math.random() * 0.5 + 0.1);
      this.alpha = Math.random() * 0.5 + 0.1;
      this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
      this.life  = 0;
      this.maxLife = 200 + Math.random() * 300;
    }
    update() {
      this.x += this.vx; this.y += this.vy; this.life++;
      if (this.life > this.maxLife || this.y < -10) this.reset(false);
    }
    draw() {
      const t = this.life / this.maxLife;
      const a = this.alpha * (t < 0.1 ? t / 0.1 : t > 0.8 ? (1 - t) / 0.2 : 1);
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = this.color + a + ')';
      ctx.fill();
    }
  }

  function spawn() {
    particles = [];
    for (let i = 0; i < 120; i++) particles.push(new Particle());
  }

  function loop() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(loop);
  }

  window.addEventListener('resize', () => { resize(); spawn(); });
  resize(); spawn(); loop();
}

/* ═══════════════════════════════════════════
   MUSIC — YouTube "17" Tulus
   Fix: pakai iframe visible tapi di luar layar,
   trigger play saat klik APAPUN di halaman.
   ═══════════════════════════════════════════ */
const YT_VIDEO_ID = 'BKchLHHe2-c';
let ytPlayer  = null;
let ytReady   = false;
let ytPlaying = false;
let ytVolume  = 40;
let ytAutoplayPending = true;

/* Dipanggil otomatis oleh YouTube IFrame API SDK */
function onYouTubeIframeAPIReady() {
  /* Pastikan container ada */
  let container = document.getElementById('ytFrame');
  if (!container) {
    container = document.createElement('div');
    container.id = 'ytFrame';
    document.body.appendChild(container);
  }

  ytPlayer = new YT.Player('ytFrame', {
    videoId: YT_VIDEO_ID,
    playerVars: {
      autoplay: 1,        /* minta autoplay — browser bisa izinkan setelah interaksi */
      loop:     1,
      playlist: YT_VIDEO_ID,
      controls: 0,
      mute:     1,        /* mulai mute agar browser izinkan, unmute setelah ready */
      playsinline: 1,
      rel: 0, modestbranding: 1, iv_load_policy: 3
    },
    events: {
      onReady(e) {
        ytReady = true;
        e.target.setVolume(ytVolume);

        /* Coba play langsung (unmuted) */
        e.target.unMute();
        e.target.playVideo();

        /* Fallback: tunggu interaksi user pertama */
        const startPlay = () => {
          if (!ytPlaying) {
            e.target.unMute();
            e.target.setVolume(ytVolume);
            e.target.playVideo();
          }
          /* Perbarui UI music bar supaya muncul */
          updateMusicUI();
        };
        document.addEventListener('click',   startPlay, { once: true });
        document.addEventListener('scroll',  startPlay, { once: true });
        document.addEventListener('keydown', startPlay, { once: true });
        document.addEventListener('touchstart', startPlay, { once: true });
      },
      onStateChange(e) {
        ytPlaying = (e.data === YT.PlayerState.PLAYING);
        updateMusicUI();
        /* Loop manual kalau ended */
        if (e.data === YT.PlayerState.ENDED) {
          ytPlayer.seekTo(0);
          ytPlayer.playVideo();
        }
      },
      onError() {
        /* YouTube video mungkin diblokir di wilayah tertentu — silent fail */
        console.warn('YouTube player error — musik tidak tersedia');
      }
    }
  });
}

function initMusic() {
  /* Load YouTube IFrame API secara async */
  if (!document.querySelector('script[src*="youtube.com/iframe_api"]')) {
    const tag = document.createElement('script');
    tag.src   = 'https://www.youtube.com/iframe_api';
    tag.async = true;
    document.head.appendChild(tag);
  }
  updateMusicUI();
}

function updateMusicUI() {
  /* Nav button */
  const navBtn = document.getElementById('musicNavBtn');
  if (navBtn) {
    navBtn.textContent = ytPlaying ? '🎵 ▶' : '🎵';
    navBtn.classList.toggle('playing', ytPlaying);
  }
  /* Disc spinner */
  const disc = document.getElementById('mbDisc');
  if (disc) disc.className = 'mb-disc' + (ytPlaying ? ' spin' : '');
  /* Play/pause button di bar */
  const mbPlay = document.getElementById('mbPlayBtn');
  if (mbPlay) mbPlay.textContent = ytPlaying ? '⏸' : '▶';
  /* Music bar visibility */
  const bar = document.getElementById('musicBar');
  if (bar) bar.classList.toggle('visible', ytPlaying);
  /* FAB button */
  const fab = document.getElementById('musicFab');
  if (fab) {
    fab.textContent = ytPlaying ? '⏸' : '🎵';
    fab.classList.toggle('playing', ytPlaying);
    fab.title = ytPlaying ? 'Pause lagu' : 'Putar 17 - Tulus';
  }
}

function toggleMusic() {
  if (!ytReady || !ytPlayer) {
    /* Player belum siap — beri tahu user */
    const bar = document.getElementById('musicBar');
    if (bar) bar.classList.add('visible');
    return;
  }
  if (ytPlaying) { ytPlayer.pauseVideo(); }
  else           { ytPlayer.unMute(); ytPlayer.setVolume(ytVolume); ytPlayer.playVideo(); }
}

function nextSong() { if (ytReady && ytPlayer) { ytPlayer.seekTo(0); ytPlayer.playVideo(); } }

function setVolume(v) {
  ytVolume = Math.round(parseFloat(v) * 100);
  if (ytReady && ytPlayer) { ytPlayer.unMute(); ytPlayer.setVolume(ytVolume); }
}

/* ═══════════════════════════════════════════
   HERO
   ═══════════════════════════════════════════ */
function renderHero() {
  const w = document.getElementById('heroLogoWrap');
  if (w) w.innerHTML = D.logo
    ? `<img src="${D.logo}" class="hlogoImg">`
    : `<div class="hlogoPh">XII</div>`;
  updateFooter();
}

function updateFooter() {
  const f = document.getElementById('fSchool');
  if (f) f.textContent = D.school + ' — Angkatan 2023–2026';
}

/* ═══════════════════════════════════════════
   WALI KELAS
   ═══════════════════════════════════════════ */
function renderWali() {
  const tabs   = document.getElementById('wTabs');
  const panels = document.getElementById('wPanels');
  if (!tabs || !panels) return;
  tabs.innerHTML = ''; panels.innerHTML = '';

  D.wali.forEach((w, i) => {
    tabs.innerHTML += `<button class="wtab${i === 0 ? ' on' : ''}" onclick="swW(${i},this)">${w.kelas}</button>`;
    const ava = w.foto
      ? `<img src="${w.foto}" class="wava">`
      : `<div class="wavaph">${init2(w.nama)}</div>`;
    panels.innerHTML += `
      <div class="wpanel${i === 0 ? ' on' : ''}" id="wp${i}">
        ${ava}
        <div class="winfo">
          <h2>${w.nama}</h2>
          <div class="wnip">NIP · ${w.nip}</div>
          <div class="tags">
            <span class="tag tp">${w.kelas}</span>
            <span class="tag tr">${w.tahun}</span>
            <span class="tag tg">${w.mapel}</span>
          </div>
          <p class="wq">"${esc(w.quote)}"</p>
        </div>
      </div>`;
  });
}

function swW(i, btn) {
  document.querySelectorAll('.wtab').forEach(b => b.classList.remove('on'));
  document.querySelectorAll('.wpanel').forEach(p => p.classList.remove('on'));
  btn.classList.add('on');
  document.getElementById('wp' + i).classList.add('on');
}

/* ═══════════════════════════════════════════
   SISWA
   ═══════════════════════════════════════════ */
function renderSiswa() {
  const g = document.getElementById('sisGrid');
  if (!g) return;
  g.innerHTML = '';
  [...D.siswa].sort((a, b) => parseInt(a.no) - parseInt(b.no)).forEach(s => {
    const ava = s.foto
      ? `<img src="${s.foto}" style="width:60px;height:60px;border-radius:50%;object-fit:cover;margin:0 auto .75rem;display:block;border:2px solid ${s.w}">`
      : `<div class="sava" style="background:${s.w}22;border:2px solid ${s.w}44;color:${s.w}">${init2(s.nama)}</div>`;
    g.innerHTML += `
      <div class="scard">
        ${s.role ? `<span class="srole">${esc(s.role)}</span>` : ''}
        ${ava}
        <div class="sname">${esc(s.nama)}</div>
        <div class="snomor">No. ${s.no}</div>
      </div>`;
  });
  const el = document.getElementById('cS');
  if (el) el.textContent = D.siswa.length;
}

/* ═══════════════════════════════════════════
   GALERI
   ═══════════════════════════════════════════ */
function renderGaleri(filter) {
  const g = document.getElementById('galGrid');
  if (!g) return;
  const all = [...GDF, ...D.galeri].filter(x =>
    filter === 'all' ||
    x.tag === filter ||
    (filter === 'video' && x.type === 'video')
  );
  g.innerHTML = '';
  if (!all.length) {
    g.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:3rem;color:var(--muted)">Belum ada konten di kategori ini</div>';
    return;
  }
  all.forEach((x, i) => {
    const c   = WC[i % WC.length];
    const cls = 'gc ' + (x.type === 'video' ? 'vd' : 'ph');
    /* url bisa dari Cloudinary (string URL) atau placeholder (null) */
    const url = x.url || x.data || null;
    let inner;
    if      (url && x.type === 'video') inner = `<video src="${url}" style="width:100%;height:100%;object-fit:cover" muted playsinline preload="metadata">`;
    else if (url)                        inner = `<img src="${url}" style="width:100%;height:100%;object-fit:cover" loading="lazy">`;
    else                                 inner = `<div class="gcph" style="background:${c}10"><div class="ico">${x.type === 'video' ? '🎬' : '📷'}</div><div class="lbl" style="color:${c}99">${esc(x.label)}</div></div>`;
    g.innerHTML += `
      <div class="${cls}">
        ${inner}
        ${x.type === 'video' ? '<div class="vbadge">VIDEO</div>' : ''}
        <div class="gover"><span>${esc(x.sub || x.label)}</span></div>
      </div>`;
  });
}

function fG(tag, btn) {
  document.querySelectorAll('.gtab').forEach(b => b.classList.remove('on'));
  btn.classList.add('on');
  renderGaleri(tag);
}

/* ═══════════════════════════════════════════
   PRESTASI
   ═══════════════════════════════════════════ */
function renderPrestasi() {
  const g = document.getElementById('presGrid');
  if (!g) return;
  g.innerHTML = D.prestasi.map(p => `
    <div class="pcard rv">
      <span class="pmedal ${p.medal}">${p.tahun}</span>
      <div class="pico">${p.ico}</div>
      <h3>${esc(p.judul)}</h3>
      <p>${esc(p.desc)}</p>
    </div>`).join('');
  g.querySelectorAll('.pcard.rv').forEach(el => obs.observe(el));
}

/* ═══════════════════════════════════════════
   TIMER SEJAK LULUS
   ═══════════════════════════════════════════ */
function startSinceLulus() {
  function tick() {
    const now  = new Date();
    const diff = now - (window._EFFECTIVE_LULUS_DATE || LULUS_DATE); // ms sejak lulus

    if (diff < 0) {
      /* belum lulus — tampilkan countdown menuju lulus */
      const d = Math.floor(-diff / 86400000);
      const h = Math.floor((-diff % 86400000) / 3600000);
      const m = Math.floor((-diff % 3600000) / 60000);
      const s = Math.floor((-diff % 60000) / 1000);
      document.getElementById('sl-label').textContent = '⏳ Menuju hari kelulusan…';
      document.getElementById('sl-d').textContent = p2(d);
      document.getElementById('sl-h').textContent = p2(h);
      document.getElementById('sl-m').textContent = p2(m);
      document.getElementById('sl-s').textContent = p2(s);
    } else {
      /* sudah lulus — tampilkan sudah berapa lama */
      const totalSec  = Math.floor(diff / 1000);
      const years     = Math.floor(diff / (365.25 * 86400000));
      const rem1      = diff - years * 365.25 * 86400000;
      const days      = Math.floor(rem1 / 86400000);
      const hours     = Math.floor((rem1 % 86400000) / 3600000);
      const mins      = Math.floor((rem1 % 3600000)  / 60000);
      const secs      = Math.floor((rem1 % 60000)    / 1000);

      document.getElementById('sl-label').textContent = '🎓 Sudah lulus selama…';
      document.getElementById('sl-yr').textContent = years;
      document.getElementById('sl-d').textContent  = p2(days);
      document.getElementById('sl-h').textContent  = p2(hours);
      document.getElementById('sl-m').textContent  = p2(mins);
      document.getElementById('sl-s').textContent  = p2(secs);

      /* tampilkan kolom tahun kalau sudah > 0 */
      document.getElementById('slBoxYear').style.display = years > 0 ? 'block' : 'none';
    }
  }
  tick(); setInterval(tick, 1000);
}

/* ═══════════════════════════════════════════
   KOMENTAR / PESAN
   Mode: Firebase (realtime, semua orang bisa lihat)
         → fallback ke local storage kalau belum setup Firebase
   ═══════════════════════════════════════════ */

/* Render array pesan ke grid */
function renderPesanItems(items) {
  const grid = document.getElementById('kGrid');
  if (!grid) return;
  if (!items.length) {
    grid.innerHTML = '<div class="kempty">Belum ada pesan. Jadilah yang pertama! 💌</div>';
    return;
  }
  grid.innerHTML = '';
  items.forEach((p, i) => {
    const c  = WC[i % WC.length];
    const dt = new Date(p.ts).toLocaleDateString('id-ID', { day:'numeric', month:'short', year:'numeric' });
    grid.innerHTML += `
      <div class="kcard">
        <div class="kqi">"</div>
        <p class="ktxt">${esc(p.pesan)}</p>
        <div class="kauth">
          <div class="kava" style="background:${c}22;color:${c};border:1.5px solid ${c}40">${init2(p.nama)}</div>
          <div>
            <div class="kname">${esc(p.nama)}</div>
            <div class="krole">${esc(p.role)}</div>
          </div>
        </div>
        <div class="kts2">${dt}</div>
      </div>`;
  });
}

/* Load pesan — pakai Firebase kalau siap, fallback ke local */
async function loadPesan() {
  const grid = document.getElementById('kGrid');
  if (!grid) return;
  grid.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:2rem;color:var(--muted)">⏳ Memuat pesan...</div>';

  if (fbReady) {
    /* Firebase: realtime listener — otomatis update tiap ada pesan baru */
    fbLoadPesan(items => {
      renderPesanItems(items);
      /* sync ke admin panel juga */
      if (typeof renderMsgAdmItems === 'function') renderMsgAdmItems(items);
    });
  } else {
    /* Fallback: local storage */
    const keys  = await S.list('msg-');
    const items = [];
    for (const k of keys) { const v = await S.get(k); if (v) items.push({ k, ...v }); }
    items.sort((a, b) => b.ts - a.ts);
    renderPesanItems(items);
  }
}

/* Kirim pesan */
async function kirimPesan() {
  const nama  = document.getElementById('kNama').value.trim();
  const role  = document.getElementById('kRole').value;
  const pesan = document.getElementById('kPesan').value.trim();
  const sts   = document.getElementById('kSts');
  const btn   = document.getElementById('kBtn');

  if (!nama)            { sts.innerHTML = '<span class="err">⚠ Nama tidak boleh kosong</span>';  return; }
  if (pesan.length < 5) { sts.innerHTML = '<span class="err">⚠ Pesan terlalu pendek</span>'; return; }

  btn.disabled = true; btn.textContent = 'Mengirim...';

  let ok = false;
  if (fbReady) {
    /* Kirim ke Firebase */
    const res = await fbKirimPesan(nama, role, pesan);
    ok = res.ok;
    if (!ok) console.error('Firebase send error:', res.err);
  } else {
    /* Fallback ke local storage */
    ok = await S.set('msg-' + Date.now(), { nama, role, pesan, ts: Date.now() });
  }

  if (ok) {
    sts.innerHTML = '<span class="ok">✅ Pesan terkirim! Semua orang bisa melihatnya 🎉</span>';
    document.getElementById('kNama').value  = '';
    document.getElementById('kPesan').value = '';
    /* Firebase listener otomatis refresh, local butuh manual */
    if (!fbReady) setTimeout(() => { loadPesan(); loadMsgAdm(); }, 800);
    setTimeout(() => { sts.innerHTML = ''; }, 3000);
  } else {
    sts.innerHTML = '<span class="err">❌ Gagal mengirim. Cek koneksi atau setup Firebase.</span>';
  }

  btn.disabled = false; btn.textContent = 'Kirim Pesan 💌';
}

/* ═══════════════════════════════════════════
   SCROLL REVEAL
   ═══════════════════════════════════════════ */
const obs = new IntersectionObserver(
  entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('vs'); }),
  { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
);

function initReveal() {
  document.querySelectorAll('.rv').forEach(el => obs.observe(el));
}

/* ═══════════════════════════════════════════
   COUNTER ANIMASI
   ═══════════════════════════════════════════ */
function animCounters() {
  const go = (el, t, d = 1400) => {
    if (!el) return;
    let s = 0, st = t / (d / 16);
    const iv = setInterval(() => {
      s += st;
      if (s >= t) { el.textContent = t; clearInterval(iv); }
      else          el.textContent = Math.floor(s);
    }, 16);
  };
  setTimeout(() => {
    go(document.getElementById('cS'), D.siswa.length || 33);
    go(document.getElementById('cK'), Math.max(100, D.galeri.length * 10 + 500), 2000);
  }, 600);
}

/* ═══════════════════════════════════════════
   HELPERS
   ═══════════════════════════════════════════ */
function esc(t) {
  return String(t)
    .replace(/&/g,'&amp;').replace(/</g,'&lt;')
    .replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
function init2(n) {
  return String(n).split(' ').slice(0, 2).map(w => w[0] || '').join('').toUpperCase();
}
function p2(n) { return String(n).padStart(2, '0'); }
function rd(file, cb) {
  const r = new FileReader();
  r.onload = e => cb(e.target.result);
  r.readAsDataURL(file);
}
