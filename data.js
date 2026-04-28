/* ═══════════════════════════════════════════
   data.js — default data & constants
   ═══════════════════════════════════════════ */

const LULUS_DATE = new Date('2026-05-06T00:00:00');

const WC = ['#f5c400','#ff5f7e','#3de0a0','#ffc657','#e6b800','#fd79a8','#55efc4','#fdcb6e','#74b9ff','#e17055'];

/* Galeri placeholder (sebelum admin upload) */
const GDF = [
  {id:'d1', type:'photo', tag:'x',     label:'MPLS 2023',        sub:'Hari pertama sekolah', data:null},
  {id:'d2', type:'photo', tag:'x',     label:'Praktek Kabel',    sub:'Lab Kelas X',           data:null},
  {id:'d3', type:'photo', tag:'xi',    label:'Foto Kelas XI',    sub:'Semester 3 2024',       data:null},
  {id:'d4', type:'photo', tag:'pkl',   label:'Di Kantor ISP',    sub:'PKL 2025',              data:null},
  {id:'d5', type:'photo', tag:'acara', label:'Kunjus',       sub:'Yogyakarta',          data:null},
  {id:'d6', type:'video', tag:'xii',   label:'Momen Perpisahan', sub:'Nangis bareng ',      data:null},
  {id:'d7', type:'photo', tag:'xii',   label:'Foto Kelas XII',   sub:'Last year 2026',        data:null},
  {id:'d8', type:'photo', tag:'acara', label:'HUT Sekolah',      sub:'Pentas seni',           data:null},
];

const DEF = {
  logo: null,
  school: 'SMK Negeri / Swasta',
  password: 'sotobiwiwi',
  wali: [
    {
      kelas:'X TJKT 1', tahun:'2023–2024',
      nama:'Bpk/Ibu Wali Kelas X', nip:'19XX XXXX XXXX XX01',
      mapel:'Dasar-Dasar TJKT',
      quote:'Kelas X adalah pondasi segalanya. Tetap semangat dan jangan pernah menyerah belajar!',
      foto:null
    },
    {
      kelas:'XI TJKT 1', tahun:'2024–2025',
      nama:'Bpk/Ibu Wali Kelas XI', nip:'19XX XXXX XXXX XX02',
      mapel:'Administrasi Sistem Jaringan',
      quote:'PKL bukan akhir perjalanan — justru awal kalian mengenal dunia kerja yang sesungguhnya.',
      foto:null
    },
    {
      kelas:'XII TJKT 1', tahun:'2025–2026',
      nama:'Bpk/Ibu Wali Kelas XII', nip:'19XX XXXX XXXX XX03',
      mapel:'Teknologi Layanan Jaringan',
      quote:'Jadilah anak yang tidak hanya pintar secara akademis, tapi juga berakhlak mulia dan siap menghadapi tantangan.',
      foto:null
    },
  ],
  siswa: [
    {no:'01',nama:'Ahmad Fauzi Ramdan',   role:'Ketua Kelas',  foto:null, w:'#f5c400'},
    {no:'02',nama:'Budi Santoso',          role:'',             foto:null, w:'#ff5f7e'},
    {no:'03',nama:'Citra Dewi Lestari',    role:'Wakil Ketua', foto:null, w:'#3de0a0'},
    {no:'04',nama:'Dina Rahmawati',        role:'Sekretaris',  foto:null, w:'#ffc657'},
    {no:'05',nama:'Eko Prasetyo',          role:'',             foto:null, w:'#e6b800'},
    {no:'06',nama:'Fajar Kurniawan',       role:'',             foto:null, w:'#fd79a8'},
    {no:'07',nama:'Gilang Ramadhan',       role:'',             foto:null, w:'#55efc4'},
    {no:'08',nama:'Hana Putri Utami',      role:'Bendahara',   foto:null, w:'#fdcb6e'},
    {no:'09',nama:'Irfan Maulana',         role:'',             foto:null, w:'#74b9ff'},
    {no:'10',nama:'Joko Prasetya',         role:'',             foto:null, w:'#e17055'},
    {no:'11',nama:'Kartika Sari',          role:'',             foto:null, w:'#f5c400'},
    {no:'12',nama:'Lutfi Azhari',          role:'',             foto:null, w:'#ff5f7e'},
    {no:'13',nama:'Maya Indah Sari',       role:'',             foto:null, w:'#3de0a0'},
    {no:'14',nama:'Naufal Rizki',          role:'',             foto:null, w:'#e6b800'},
    {no:'15',nama:'Olivia Permata',        role:'',             foto:null, w:'#ffc657'},
    {no:'16',nama:'Putra Mahardika',       role:'',             foto:null, w:'#fd79a8'},
    {no:'17',nama:'Qori Annisa',           role:'',             foto:null, w:'#55efc4'},
    {no:'18',nama:'Rizky Pratama',         role:'',             foto:null, w:'#fdcb6e'},
    {no:'19',nama:'Siti Nurhaliza',        role:'',             foto:null, w:'#74b9ff'},
    {no:'20',nama:'Taufik Hidayat',        role:'',             foto:null, w:'#e17055'},
    {no:'21',nama:'Ulfa Khoirunnisa',      role:'',             foto:null, w:'#f5c400'},
    {no:'22',nama:'Vino Bastian',          role:'',             foto:null, w:'#ff5f7e'},
    {no:'23',nama:'Wahyu Santoso',         role:'',             foto:null, w:'#3de0a0'},
    {no:'24',nama:'Xenia Kirana',          role:'',             foto:null, w:'#e6b800'},
    {no:'25',nama:'Yusuf Maulana',         role:'',             foto:null, w:'#ffc657'},
    {no:'26',nama:'Zahra Amalia',          role:'',             foto:null, w:'#fd79a8'},
    {no:'27',nama:'Andi Wirawan',          role:'',             foto:null, w:'#55efc4'},
    {no:'28',nama:'Bella Safitri',         role:'',             foto:null, w:'#fdcb6e'},
    {no:'29',nama:'Candra Maulida',        role:'',             foto:null, w:'#74b9ff'},
    {no:'30',nama:'Dodi Permana',          role:'',             foto:null, w:'#e17055'},
    {no:'31',nama:'Eva Susanti',           role:'',             foto:null, w:'#f5c400'},
    {no:'32',nama:'Firman Syahputra',      role:'',             foto:null, w:'#ff5f7e'},
    {no:'33',nama:'Gita Nirmala',          role:'',             foto:null, w:'#3de0a0'},
  ],
  galeri: [],
  prestasi: [
    {ico:'🏆', judul:'Juara 1 LKS Jaringan',   desc:'LKS tingkat Kabupaten bidang IT Network Systems Administration', medal:'mg', tahun:'2024'},
    {ico:'🥇', judul:'Nilai UKK Tertinggi',     desc:'Rata-rata nilai UKK tertinggi se-sekolah tahun 2026',           medal:'mg', tahun:'2026'},
    {ico:'🥈', judul:'Juara 2 Web Design',      desc:'Kompetisi web design tingkat kecamatan — hari teknologi nasional', medal:'ms', tahun:'2025'},
    {ico:'📡', judul:'Proyek Jaringan Kampus',  desc:'Memasang dan mengkonfigurasi jaringan WiFi seluruh area sekolah', medal:'mb', tahun:'2026'},
    {ico:'🎖️', judul:'PKL Terbaik',             desc:'5 siswa mendapat penghargaan PKL terbaik dari perusahaan magang', medal:'ms', tahun:'2025'},
    {ico:'💻', judul:'Final CTF Provinsi',      desc:'Tim XII TJKT 1 masuk final Capture The Flag tingkat provinsi',   medal:'mb', tahun:'2025'},
  ]
};
