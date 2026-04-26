/* ═══════════════════════════════════════════
   admin.js — admin panel logic
   ═══════════════════════════════════════════ */

let sFotoB64 = null;

/* ── OPEN / CLOSE ── */
function openAdmin()  { document.getElementById('adminOv').classList.add('on'); }
function closeAdmin() { document.getElementById('adminOv').classList.remove('on'); }

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('adminOv').addEventListener('click', e => {
    if (e.target === document.getElementById('adminOv')) closeAdmin();
  });
});

/* ── LOGIN ── */
function doLogin() {
  if (document.getElementById('aPw').value === D.password) {
    document.getElementById('aLogin').style.display   = 'none';
    document.getElementById('aContent').style.display = 'block';
    /* pre-fill info fields */
    document.getElementById('aSchool').value   = D.school;
    document.getElementById('cldCloud').value  = D.cldCloud  || '';
    document.getElementById('cldPreset').value = D.cldPreset || '';
    /* pre-fill Firebase config */
    const fb = D.fbConfig || {};
    const fillFb = (id, val) => { const el = document.getElementById(id); if (el) el.value = val || ''; };
    fillFb('fbApiKey',     fb.apiKey);
    fillFb('fbAuthDomain', fb.authDomain);
    fillFb('fbDbUrl',      fb.databaseURL);
    fillFb('fbProjectId',  fb.projectId);
    fillFb('fbAppId',      fb.appId);
    /* tampilkan status koneksi Firebase */
    const fbBadge = document.getElementById('fbStatusBadge');
    if (fbBadge) fbBadge.innerHTML = fbReady
      ? '<span class="ok">🟢 Firebase terhubung</span>'
      : '<span style="color:var(--muted);font-size:.78rem">⚪ Belum terhubung</span>';
    /* re-render all admin panels */
    renderWaliAdm();
    renderSaList();
    renderGAList();
    renderPresAdmList();
    loadMsgAdm();
  } else {
    const e = document.getElementById('loginErr');
    e.textContent = '❌ Password salah!';
    setTimeout(() => e.textContent = '', 2000);
  }
}

/* ── TAB SWITCH ── */
function aTab(n, btn) {
  document.querySelectorAll('.atab').forEach(b  => b.classList.remove('on'));
  document.querySelectorAll('.apanel').forEach(p => p.classList.remove('on'));
  btn.classList.add('on');
  const map = {
    logo:'pLogo', wali:'pWali', siswa:'pSiswa',
    galeri:'pGaleri', cloudinary:'pCloudinary',
    firebase:'pFirebase', prestasi:'pPrestasi',
    pesan:'pPesan', pw:'pPw'
  };
  document.getElementById(map[n]).classList.add('on');
  if (n === 'pesan') loadMsgAdm();
}

/* ══════════════════════════════════════════
   LOGO & INFO
   ══════════════════════════════════════════ */
function uploadLogo(inp) {
  if (!inp.files[0]) return;
  rd(inp.files[0], b64 => {
    D.logo = b64;
    save();
    document.getElementById('lprev').innerHTML = `<img src="${b64}" style="width:100%;height:100%;object-fit:cover;border-radius:50%">`;
    renderHero();
  });
}

function removeLogo() {
  D.logo = null; save();
  document.getElementById('lprev').innerHTML = '<span>XII</span>';
  renderHero();
}

async function saveInfo() {
  D.school = document.getElementById('aSchool').value || D.school;
  await save(); updateFooter();
  showSts('infoSts', '✅ Tersimpan!', 'ok');
}

/* ══════════════════════════════════════════
   WALI KELAS ADMIN
   ══════════════════════════════════════════ */
function renderWaliAdm() {
  const c = document.getElementById('waliAdmList');
  if (!c) return;
  c.innerHTML = D.wali.map((w, i) => `
    <div class="asec">
      <h3>Edit — Wali Kelas ${w.kelas}</h3>
      <div class="arow">
        <div class="af"><label>NAMA</label><input type="text" id="wN${i}" value="${esc(w.nama)}"></div>
        <div class="af"><label>NIP</label><input type="text" id="wNip${i}" value="${esc(w.nip)}"></div>
      </div>
      <div class="arow">
        <div class="af"><label>MATA PELAJARAN</label><input type="text" id="wM${i}" value="${esc(w.mapel)}"></div>
        <div class="af"><label>TAHUN MENJABAT</label><input type="text" id="wT${i}" value="${esc(w.tahun)}"></div>
      </div>
      <div class="af" style="margin-bottom:.75rem">
        <label>KUTIPAN / PESAN</label>
        <textarea id="wQ${i}">${esc(w.quote)}</textarea>
      </div>
      <div style="display:flex;align-items:center;gap:.75rem;margin-bottom:.75rem">
        ${w.foto
          ? `<img src="${w.foto}" style="width:48px;height:48px;border-radius:50%;object-fit:cover">`
          : `<div style="width:48px;height:48px;border-radius:50%;background:var(--card2);border:1px dashed var(--border);display:flex;align-items:center;justify-content:center">👤</div>`}
        <label style="cursor:pointer">
          <span class="ab pri sm" style="display:inline-block">Upload Foto</span>
          <input type="file" accept="image/*" style="display:none" onchange="upWaliFoto(this,${i})">
        </label>
        ${w.foto ? `<button class="ab dan sm" onclick="removeWaliFoto(${i})">Hapus Foto</button>` : ''}
      </div>
      <button class="ab pri" onclick="saveWali(${i})">Simpan Wali ${w.kelas}</button>
      <div id="wSts${i}" style="margin-top:.5rem"></div>
    </div>`).join('');
}

function upWaliFoto(inp, i) {
  if (!inp.files[0]) return;
  rd(inp.files[0], b64 => { D.wali[i].foto = b64; renderWaliAdm(); renderWali(); });
}

function removeWaliFoto(i) {
  D.wali[i].foto = null; renderWaliAdm(); renderWali();
}

async function saveWali(i) {
  D.wali[i].nama  = document.getElementById('wN' + i).value;
  D.wali[i].nip   = document.getElementById('wNip' + i).value;
  D.wali[i].mapel = document.getElementById('wM' + i).value;
  D.wali[i].tahun = document.getElementById('wT' + i).value;
  D.wali[i].quote = document.getElementById('wQ' + i).value;
  await save(); renderWali();
  showSts('wSts' + i, '✅ Tersimpan!', 'ok');
}

/* ══════════════════════════════════════════
   SISWA ADMIN
   ══════════════════════════════════════════ */
function prevSFoto(inp) {
  if (!inp.files[0]) return;
  rd(inp.files[0], b64 => {
    sFotoB64 = b64;
    document.getElementById('sFotoN').textContent = '✅ Foto siap';
  });
}

async function addSiswa() {
  const no   = String(document.getElementById('sNo').value).padStart(2, '0');
  const nama = document.getElementById('sNama').value.trim();
  const role = document.getElementById('sRole').value.trim();
  if (!no || !nama) { showSts('sSts', '⚠ No & Nama wajib diisi', 'err'); return; }

  D.siswa.push({ no, nama, role, foto: sFotoB64 || null, w: WC[D.siswa.length % WC.length] });
  sFotoB64 = null;
  ['sNo','sNama','sRole'].forEach(id => document.getElementById(id).value = '');
  document.getElementById('sFotoN').textContent = '';
  document.getElementById('sFoto').value = '';

  await save(); renderSiswa(); renderSaList();
  showSts('sSts', '✅ Siswa ditambahkan!', 'ok');
}

async function delSiswa(i) {
  if (!confirm('Hapus siswa ini?')) return;
  D.siswa.splice(i, 1);
  await save(); renderSiswa(); renderSaList();
}

function renderSaList() {
  const list = document.getElementById('saList');
  const cnt  = document.getElementById('sCnt');
  if (!list || !cnt) return;
  cnt.textContent = D.siswa.length;
  const sorted = [...D.siswa].sort((a, b) => parseInt(a.no) - parseInt(b.no));
  list.innerHTML = sorted.map(s => {
    const ri  = D.siswa.indexOf(s);
    const ava = s.foto
      ? `<img src="${s.foto}" style="width:42px;height:42px;border-radius:50%;object-fit:cover;flex-shrink:0;border:2px solid ${s.w}">`
      : `<div class="saAvaPh" style="background:${s.w}22;color:${s.w};border:2px solid ${s.w}44">${init2(s.nama)}</div>`;
    return `
      <div class="saItem">
        ${ava}
        <div class="saInfo">
          <div class="saName">${s.no}. ${esc(s.nama)}</div>
          <div class="saNo">${s.role || '—'}</div>
        </div>
        <button class="ab dan sm" onclick="delSiswa(${ri})">✕</button>
      </div>`;
  }).join('');
}

/* ══════════════════════════════════════════
   GALERI ADMIN — Cloudinary Upload
   ══════════════════════════════════════════ */

/* Ambil config Cloudinary dari data D */
function getCldConfig() {
  return { cloud: D.cldCloud || '', preset: D.cldPreset || '' };
}

async function uploadGaleri(inp) {
  const files = Array.from(inp.files);
  const lbl   = document.getElementById('gLbl').value || 'Kenangan';
  const tag   = document.getElementById('gTag').value;
  if (!files.length) return;

  const { cloud, preset } = getCldConfig();
  if (!cloud || !preset) {
    showSts('gSts', '⚠ Isi Cloud Name & Upload Preset Cloudinary dulu di tab ☁ Cloudinary!', 'err');
    return;
  }

  let done = 0, failed = 0;
  showSts('gSts', `⏳ Mengupload ${files.length} file ke Cloudinary...`, 'ok');

  for (const f of files) {
    const isV    = f.type.startsWith('video');
    const rType  = isV ? 'video' : 'image';
    const fd     = new FormData();
    fd.append('file',           f);
    fd.append('upload_preset',  preset);
    fd.append('folder',         'xii-tjkt1');

    try {
      const res  = await fetch(`https://api.cloudinary.com/v1_1/${cloud}/${rType}/upload`, { method:'POST', body: fd });
      const data = await res.json();

      if (data.secure_url) {
        D.galeri.push({
          id:    'g' + Date.now() + Math.random(),
          type:  isV ? 'video' : 'photo',
          tag, label: lbl, sub: lbl,
          url:   data.secure_url,
          pid:   data.public_id   /* untuk hapus via API kalau diperlukan */
        });
        done++;
      } else {
        failed++;
        console.error('Cloudinary error:', data);
      }
    } catch (e) {
      failed++;
      console.error('Upload error:', e);
    }
  }

  await save(); renderGaleri('all'); renderGAList();
  inp.value = ''; document.getElementById('gLbl').value = '';

  if (failed > 0) showSts('gSts', `✅ ${done} berhasil, ❌ ${failed} gagal. Cek console.`, 'ok');
  else            showSts('gSts', `✅ ${done} file berhasil diupload ke Cloudinary!`, 'ok');
}

async function delGaleri(id) {
  D.galeri = D.galeri.filter(g => g.id !== id);
  await save(); renderGaleri('all'); renderGAList();
}

function renderGAList() {
  const list = document.getElementById('gAList');
  const cnt  = document.getElementById('gCnt');
  if (!list || !cnt) return;
  cnt.textContent = GDF.length + D.galeri.length;
  list.innerHTML = D.galeri.map(g => {
    const src = g.url || g.data || null;
    const thumb = src
      ? (g.type === 'video'
          ? `<video src="${src}" muted preload="metadata" style="width:100%;height:100%;object-fit:cover">`
          : `<img src="${src}" style="width:100%;height:100%;object-fit:cover" loading="lazy">`)
      : `<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;color:var(--muted);font-size:1.5rem">📷</div>`;
    return `
    <div class="gAItem">
      ${thumb}
      <div style="position:absolute;bottom:.3rem;left:.3rem;right:.3rem;font-size:.6rem;color:#fff;background:rgba(0,0,0,.6);border-radius:4px;padding:.1rem .3rem;overflow:hidden;white-space:nowrap;text-overflow:ellipsis">${esc(g.label)}</div>
      <button class="gADel" onclick="delGaleri('${g.id}')">✕</button>
    </div>`;
  }).join('');
  if (!D.galeri.length) list.innerHTML = '<div style="color:var(--muted);font-size:.82rem;grid-column:1/-1">Belum ada yang diupload ke Cloudinary</div>';
}

/* ── Simpan config Cloudinary ── */
async function saveCldConfig() {
  const cloud  = document.getElementById('cldCloud').value.trim();
  const preset = document.getElementById('cldPreset').value.trim();
  if (!cloud || !preset) { showSts('cldSts', '⚠ Keduanya wajib diisi!', 'err'); return; }
  D.cldCloud  = cloud;
  D.cldPreset = preset;
  await save();
  showSts('cldSts', '✅ Config Cloudinary tersimpan!', 'ok');
}

/* ══════════════════════════════════════════
   PRESTASI ADMIN
   ══════════════════════════════════════════ */
function renderPresAdmList() {
  const list = document.getElementById('presAdmList');
  const cnt  = document.getElementById('presCnt');
  if (!list || !cnt) return;
  cnt.textContent = D.prestasi.length;
  list.innerHTML = D.prestasi.map((p, i) => `
    <div class="presAdmItem">
      <div class="picol">${p.ico}</div>
      <div class="pinfo">
        <div class="ptitle">${esc(p.judul)} <span style="font-size:.65rem;color:var(--muted)">(${p.tahun})</span></div>
        <div class="pdesc2">${esc(p.desc)}</div>
      </div>
      <button class="ab dan sm" onclick="delPrestasi(${i})">✕</button>
    </div>`).join('');
  if (!D.prestasi.length) list.innerHTML = '<div style="color:var(--muted);font-size:.82rem">Belum ada prestasi</div>';
}

async function addPrestasi() {
  const ico   = document.getElementById('pIco').value.trim()   || '🏅';
  const judul = document.getElementById('pJudul').value.trim();
  const desc  = document.getElementById('pDesc').value.trim();
  const medal = document.getElementById('pMedal').value;
  const tahun = document.getElementById('pTahun').value.trim() || new Date().getFullYear().toString();

  if (!judul) { showSts('presSts', '⚠ Judul wajib diisi', 'err'); return; }

  D.prestasi.push({ ico, judul, desc, medal, tahun });
  ['pIco','pJudul','pDesc','pTahun'].forEach(id => document.getElementById(id).value = '');

  await save(); renderPrestasi(); renderPresAdmList();
  showSts('presSts', '✅ Prestasi ditambahkan!', 'ok');
}

async function delPrestasi(i) {
  if (!confirm('Hapus prestasi ini?')) return;
  D.prestasi.splice(i, 1);
  await save(); renderPrestasi(); renderPresAdmList();
}

/* ══════════════════════════════════════════
   PESAN ADMIN — Firebase aware
   ══════════════════════════════════════════ */

/* Dipanggil dari realtime listener Firebase di app.js */
function renderMsgAdmItems(items) {
  const list = document.getElementById('msgAdmList');
  if (!list) return;
  if (!items.length) {
    list.innerHTML = '<div style="color:var(--muted);font-size:.85rem">Belum ada pesan masuk</div>';
    return;
  }
  list.innerHTML = items.map((p, i) => `
    <div class="msgItem">
      <div class="kava" style="background:${WC[i%WC.length]}22;color:${WC[i%WC.length]};width:36px;height:36px;border-radius:50%;flex-shrink:0;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:.78rem">${init2(p.nama)}</div>
      <div class="msgContent">
        <div class="msgName">${esc(p.nama)} <span style="font-weight:400;color:var(--muted);font-size:.72rem">— ${esc(p.role)}</span></div>
        <div class="msgTxt">${esc(p.pesan)}</div>
        <div class="msgMeta">${new Date(p.ts).toLocaleString('id-ID')}</div>
      </div>
      <button class="ab dan sm" onclick="delMsg('${p.k}')">Hapus</button>
    </div>`).join('');
}

async function loadMsgAdm() {
  const list = document.getElementById('msgAdmList');
  if (!list) return;

  if (fbReady) {
    /* Firebase: ambil sekali (listener realtime sudah di loadPesan) */
    list.innerHTML = '<div style="color:var(--muted);font-size:.85rem">⏳ Memuat dari Firebase...</div>';
    const snap  = await fbDb.ref('pesan').once('value');
    const raw   = snap.val() || {};
    const items = Object.entries(raw)
      .map(([k, v]) => ({ k, ...v }))
      .sort((a, b) => b.ts - a.ts);
    renderMsgAdmItems(items);
  } else {
    /* Fallback: local storage */
    const keys = await S.list('msg-');
    if (!keys.length) { list.innerHTML = '<div style="color:var(--muted);font-size:.85rem">Belum ada pesan masuk</div>'; return; }
    const items = [];
    for (const k of keys) { const v = await S.get(k); if (v) items.push({ k, ...v }); }
    items.sort((a, b) => b.ts - a.ts);
    renderMsgAdmItems(items);
  }
}

async function delMsg(key) {
  if (!confirm('Hapus pesan ini?')) return;
  if (fbReady) {
    const ok = await fbHapusPesan(key);
    if (!ok) { alert('Gagal hapus. Cek koneksi.'); return; }
    /* Realtime listener otomatis refresh tampilan */
  } else {
    await S.del(key);
    loadMsgAdm();
    loadPesan();
  }
}

/* ══════════════════════════════════════════
   FIREBASE CONFIG — Admin
   ══════════════════════════════════════════ */
async function saveFbConfigAdmin() {
  const fields = ['fbApiKey','fbAuthDomain','fbDbUrl','fbProjectId','fbAppId'];
  const vals   = fields.map(id => (document.getElementById(id)?.value || '').trim());

  if (!vals[0] || !vals[2]) {
    showSts('fbSts', '⚠ API Key dan Database URL wajib diisi!', 'err');
    return;
  }

  const cfg = {
    apiKey:      vals[0],
    authDomain:  vals[1],
    databaseURL: vals[2],
    projectId:   vals[3],
    appId:       vals[4],
  };

  showSts('fbSts', '⏳ Menghubungkan ke Firebase...', 'ok');
  await saveFbConfig(cfg);

  /* Re-init Firebase dengan config baru */
  fbApp   = null;
  fbReady = false;
  const ok = await initFirebase();

  if (ok) {
    showSts('fbSts', '✅ Firebase terhubung! Pesan sekarang tersimpan di cloud 🎉', 'ok');
    loadPesan();
    loadMsgAdm();
  } else {
    showSts('fbSts', '❌ Gagal terhubung. Cek config & pastikan Database URL benar.', 'err');
  }
}

async function testFbKoneksi() {
  showSts('fbSts', '⏳ Mengecek koneksi...', 'ok');
  const ok = await fbCekKoneksi();
  showSts('fbSts', ok ? '✅ Firebase OK — koneksi berhasil!' : '❌ Tidak terhubung. Cek config.', ok ? 'ok' : 'err');
}

/* ══════════════════════════════════════════
   PASSWORD
   ══════════════════════════════════════════ */
async function gantiPw() {
  const l = document.getElementById('pwL').value;
  const b = document.getElementById('pwB').value;
  const k = document.getElementById('pwK').value;
  if (l !== D.password)  { showSts('pwSts', '❌ Password lama salah', 'err'); return; }
  if (b.length < 6)      { showSts('pwSts', '⚠ Min 6 karakter', 'err'); return; }
  if (b !== k)           { showSts('pwSts', '⚠ Konfirmasi tidak cocok', 'err'); return; }
  D.password = b; await save();
  ['pwL','pwB','pwK'].forEach(id => document.getElementById(id).value = '');
  showSts('pwSts', '✅ Password berhasil diganti!', 'ok');
}

/* ── HELPER ── */
function showSts(id, msg, type) {
  const el = document.getElementById(id);
  if (!el) return;
  el.innerHTML = `<span class="${type}">${msg}</span>`;
  setTimeout(() => el.innerHTML = '', 2500);
}
