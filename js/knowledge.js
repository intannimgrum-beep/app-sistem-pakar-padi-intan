/* BASIS PENGETAHUAN: sistem pakar diagnosis penyakit tanaman padi.
   Kode sumber (S1..S7) merujuk ke SUMBER. Pemetaan sumber adalah usulan:
   periksa ulang setiap sumber dan isi S6 dengan wawancara nyata. */
const SUMBER = {
  S1: "Buku saku bergambar pengenalan hama dan penyakit padi (BB Padi/IRRI), kikp-pertanian.id",
  S2: "Tabel gejala penyakit padi, BAB II skripsi Undip (mengutip Susanti dkk., 2018), eprints2.undip.ac.id/id/eprint/60611",
  S3: "Agrinova (UGM): penyakit padi pada penapisan aksesi, journal.ugm.ac.id/Agrinova/article/download/54706/27214",
  S4: "Balai Besar PPMBTPH, Laporan 2021: Gejala Seed Borne Padi, bbppmbtph.tanamanpangan.pertanian.go.id",
  S5: "JATT Unri: penyakit pada lima varietas padi, jatt.ejournal.unri.ac.id/index.php/JATT/article/download/7863/5716",
  S6: "Wawancara penyuluh/petani (ISI: nama, tanggal, hasil)",
  S7: "Sistem Pakar Diagnosis Penyakit Tanaman Padi Menggunakan Forward Chaining dan Dempster Shafer (referensi metode), scholar.unram.ac.id/papers/W3089663452"
};

const FAKTA = {
  F1: { g: "Daun", t: "Daun berbercak belah ketupat (jorong) dengan ujung runcing", s: "S1,S2" },
  F2: { g: "Daun", t: "Bercak berpusat abu-abu keputihan dengan tepi coklat", s: "S1,S2" },
  F3: { g: "Daun", t: "Bercak kecil oval coklat tersebar rapat di daun (seperti biji wijen)", s: "S1,S5" },
  F4: { g: "Daun", t: "Daun mengering dari tepi atau ujung, batasnya bergelombang kuning pucat", s: "S2,S3" },
  F5: { g: "Daun", t: "Daun berubah warna kuning hingga oranye", s: "S2,S5" },
  F6: { g: "Daun", t: "Daun sempit, pendek, kaku, hijau pucat, anakan sangat banyak seperti rumput", s: "S1,S2" },
  F7: { g: "Pelepah", t: "Bercak tidak beraturan di pelepah, tepi kemerahan, tengah abu-abu muda", s: "S2" },
  F8: { g: "Pelepah", t: "Ada butiran kecil bulat (sklerotia) coklat di pelepah", s: "S1,S6" },
  F9: { g: "Malai", t: "Bulir padi berubah menjadi bola spora hijau kehitaman", s: "S4,S6" },
  F10: { g: "Malai", t: "Leher malai coklat kehitaman, mudah patah, bulir hampa", s: "S1,S6" },
  F11: { g: "Tanaman", t: "Tanaman tampak kerdil", s: "S2,S5" },
  F12: { g: "Tanaman", t: "Terlihat wereng di rumpun padi", s: "S1,S5" },
  F13: { g: "Tanaman", t: "Tanaman muda layu, daun menggulung dan mengering (kresek)", s: "S3,S4" },
  F14: { g: "Lingkungan", t: "Sawah tergenang terus dan pemupukan nitrogen (urea) tinggi", s: "S6" },
  F15: { g: "Lingkungan", t: "Cuaca lembap, berkabut, atau sering hujan", s: "S6" },
  F16: { g: "Lingkungan", t: "Tanaman ditanam terlalu rapat", s: "S6" }
};

const ANTARA = {
  K1: "Gejala bercak blas pada daun",
  K2: "Serangan pada malai atau bulir",
  K3: "Gejala hawar pada pelepah",
  K4: "Gejala sistemik: daun kuning dan tanaman kerdil",
  K5: "Gejala hawar atau kresek pada daun",
  K6: "Lingkungan lembap atau rapat yang mendukung jamur",
  K7: "Bercak coklat kecil tanpa pola belah ketupat"
};

const AKHIR = {
  D1: {
    n: "Blas (Pyricularia oryzae)", p: "Jamur Pyricularia oryzae", c: "Bercak belah ketupat, pusat keabuan, tepi coklat; dapat menyerang leher malai.",
    s: "Gunakan varietas tahan, pupuk nitrogen berimbang, atur jarak tanam. Bila serangan meluas, konsultasikan fungisida yang dianjurkan kepada penyuluh."
  },
  D2: {
    n: "Hawar Daun Bakteri / Kresek", p: "Bakteri Xanthomonas oryzae pv. oryzae", c: "Daun mengering dari tepi, batas bergelombang; tanaman muda layu (kresek).",
    s: "Tanam varietas tahan, jangan menggenangi sawah terus-menerus, kurangi nitrogen berlebih, dan jaga sanitasi lahan."
  },
  D3: {
    n: "Tungro", p: "Virus tungro, ditularkan wereng hijau", c: "Daun kuning hingga oranye dan tanaman kerdil.",
    s: "Kendalikan wereng hijau, tanam serempak, pakai varietas tahan tungro, cabut rumpun terserang dan benamkan."
  },
  D4: {
    n: "Bercak Coklat", p: "Jamur Bipolaris/Helminthosporium oryzae", c: "Bercak kecil oval coklat tersebar rapat di daun.",
    s: "Perbaiki kesuburan lahan dengan pemupukan berimbang, gunakan benih sehat, dan jaga pengairan."
  },
  D5: {
    n: "Hawar Pelepah (Rhizoctonia solani)", p: "Jamur Rhizoctonia solani", c: "Bercak tak beraturan di pelepah, tepi kemerahan, tengah abu-abu muda.",
    s: "Longgarkan jarak tanam, kurangi nitrogen berlebih, bersihkan gulma pematang, dan konsultasikan fungisida bila perlu."
  },
  D6: {
    n: "Kerdil Rumput", p: "Virus kerdil rumput, ditularkan wereng coklat", c: "Anakan sangat banyak, daun sempit kaku, tanaman kerdil.",
    s: "Kendalikan wereng coklat, cabut rumpun terserang, tanam varietas tahan, dan tanam serempak."
  },
  D7: {
    n: "Gosong Palsu (False Smut)", p: "Jamur Ustilaginoidea virens", c: "Bulir berubah menjadi bola spora hijau kehitaman pada malai.",
    s: "Buang malai terserang, hindari nitrogen berlebih saat berbunga, dan tanyakan waktu penanganan yang tepat kepada penyuluh."
  }
};

// all = semua terpenuhi (AND), any = salah satu (OR), awalan "!" = nilai Tidak
const ATURAN = [
  { id: "R1", all: ["F1", "F2"], then: "K1", src: "S1,S2" },
  { id: "R2", any: ["F9", "F10"], then: "K2", src: "S1,S4" },
  { id: "R3", all: ["F7", "F8"], then: "K3", src: "S1,S2" },
  { id: "R4", all: ["F7", "F16"], then: "K3", src: "S2,S6" },
  { id: "R5", all: ["F5", "F11"], then: "K4", src: "S2,S5" },
  { id: "R6", any: ["F4", "F13"], then: "K5", src: "S2,S3" },
  { id: "R7", any: ["F15", "F16"], then: "K6", src: "S6" },
  { id: "R8", all: ["F3", "!F1"], then: "K7", src: "S1,S5" },
  { id: "R9", all: ["K1", "K6"], then: "D1", src: "S1,S5" },
  { id: "R10", all: ["K1", "F10"], then: "D1", src: "S1,S6" },
  { id: "R11", all: ["F1", "F15"], then: "D1", src: "S5,S6" },
  { id: "R12", all: ["K5", "F14"], then: "D2", src: "S3,S6" },
  { id: "R13", all: ["F4", "F13"], then: "D2", src: "S3,S4" },
  { id: "R14", all: ["K4", "F12", "!F6"], then: "D3", src: "S1,S5" },
  { id: "R15", all: ["K7"], then: "D4", src: "S1,S5" },
  { id: "R16", all: ["K3", "K6"], then: "D5", src: "S2,S6" },
  { id: "R17", all: ["K3", "F14"], then: "D5", src: "S2,S6" },
  { id: "R18", all: ["F6", "F11"], then: "D6", src: "S1,S2" },
  { id: "R19", all: ["F6", "F12"], then: "D6", src: "S1,S2" },
  { id: "R20", all: ["K2", "F9"], then: "D7", src: "S4,S6" },
  { id: "R21", all: ["F9", "F15"], then: "D7", src: "S4,S6" }
];

// Hasil diharapkan ditentukan dari basis pengetahuan, bukan dari program
const UJI = [
  { n: "Blas pada daun", ya: ["F1", "F2", "F15"], h: ["D1"] },
  { n: "Hawar daun bakteri", ya: ["F4", "F13", "F14"], h: ["D2"] },
  { n: "Tungro", ya: ["F5", "F11", "F12"], h: ["D3"] },
  { n: "Bercak coklat", ya: ["F3"], h: ["D4"] },
  { n: "Hawar pelepah", ya: ["F7", "F8", "F16"], h: ["D5"] },
  { n: "Kerdil rumput", ya: ["F6", "F11", "F12"], h: ["D6"] },
  { n: "Gosong palsu", ya: ["F9", "F15"], h: ["D7"] },
  { n: "Dua penyakit sekaligus", ya: ["F1", "F2", "F15", "F9"], h: ["D1", "D7"] },
  { n: "Belum dapat disimpulkan", ya: ["F5", "F11"], h: [] }
];

// Identitas mahasiswa (isi sebelum dikumpulkan)
const IDENTITAS = {
  nama: "INTAN KUSUMA NINGRUM", kelas: "7TI-R1", prodi: "S1 Teknik Informatika",
  judul: "Sistem Pakar Diagnosis Penyakit Tanaman Padi Menggunakan Forward Chaining"
};

// Kontribusi tiap sumber (Bagian A.2). Periksa ulang terhadap dokumen aslinya.
const KONTRIBUSI = {
  S1: "Daftar penyakit padi dan gejala bergambar; dasar fakta daun dan pelepah (F1, F2, F3, F6, F8).",
  S2: "Tabel gejala per penyakit (blas, tungro, hawar daun bakteri, kerdil rumput, hawar pelepah, gosong palsu); dasar F1, F2, F4, F5, F6, F7.",
  S3: "Daftar penyakit penting padi di Indonesia dan gejala kresek; dasar F4 dan F13.",
  S4: "Gejala penyakit di lapang (blas, kresek, bercak coklat, false smut, hawar pelepah); dasar F9 dan F13.",
  S5: "Pengamatan gejala blas dan tungro pada lima varietas; dasar F1, F3, F5, F11, F12.",
  S6: "Wawancara: kondisi lahan dan cuaca yang memicu penyakit; dasar F14, F15, F16.",
  S7: "Rujukan penerapan Forward Chaining pada sistem pakar penyakit padi (metode)."
};

// Daftar istilah dan definisi operasional (Bagian A.3)
const GLOSARIUM = [
  ["Blas", "Penyakit jamur Pyricularia oryzae; bercak belah ketupat pada daun dan dapat menyerang leher malai."],
  ["Hawar daun bakteri", "Penyakit akibat bakteri Xanthomonas oryzae pv. oryzae; daun mengering dari tepi atau ujung."],
  ["Kresek", "Gejala hawar bakteri pada tanaman muda: daun menggulung, layu, dan mengering."],
  ["Tungro", "Penyakit virus yang ditularkan wereng hijau; daun kuning hingga oranye dan tanaman kerdil."],
  ["Hawar pelepah", "Penyakit jamur Rhizoctonia solani; bercak tidak beraturan pada pelepah."],
  ["Gosong palsu", "Penyakit jamur Ustilaginoidea virens; bulir berubah menjadi bola spora hijau kehitaman."],
  ["Kerdil rumput", "Penyakit virus yang ditularkan wereng coklat; anakan banyak, daun sempit kaku, tanaman kerdil."],
  ["Pelepah", "Bagian daun yang membungkus batang padi."],
  ["Leher malai", "Ruas batang tepat di bawah malai."],
  ["Bulir hampa", "Bulir padi yang tidak berisi."],
  ["Sklerotia", "Butiran kecil keras, struktur bertahan jamur, terlihat pada pelepah."],
  ["Wereng", "Serangga hama penghisap yang dapat menularkan virus padi."],
  ["Anakan", "Batang baru yang tumbuh dari rumpun padi."],
  ["Fakta", "Gejala atau kondisi yang dijawab pengguna dengan nilai Ya atau Tidak."],
  ["Kesimpulan antara", "Indikasi awal yang diturunkan dari fakta dan dipakai oleh aturan berikutnya."],
  ["Aturan produksi", "Pernyataan JIKA premis MAKA kesimpulan."],
  ["Memori kerja", "Kumpulan fakta dan kesimpulan yang sedang diketahui sistem selama inferensi."],
  ["Forward Chaining", "Inferensi maju dari fakta ke kesimpulan dengan mengaktifkan aturan yang premisnya terpenuhi."],
  ["Kondisi berhenti", "Keadaan ketika tidak ada lagi aturan aktif yang dapat dijalankan."]
];
