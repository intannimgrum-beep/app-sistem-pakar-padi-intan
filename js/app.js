const $ = id => document.getElementById(id);
const KEYS = Object.keys(FAKTA);
let idx = 0, jawab = {}, user = {};
const tbl = (h, rows) => `<div class="scroll"><table><tr>${h.map(x => `<th>${x}</th>`).join("")}</tr>` +
  rows.map(r => `<tr>${r.map(x => `<td>${x}</td>`).join("")}</tr>`).join("") + `</table></div>`;
const pt = c => (c[0] === "!" ? "TIDAK " : "") + c.replace("!", "");
const aturanTeks = r => [r.all && r.all.map(pt).join(" DAN "), r.any && "(" + r.any.map(pt).join(" ATAU ") + ")"].filter(Boolean).join(" DAN ");
$("hero").innerHTML = heroSvg();

function lihat(v) {
  document.querySelectorAll(".view").forEach(e => e.classList.toggle("hidden", e.id !== "v-" + v));
  document.querySelectorAll("nav button").forEach(b => b.classList.toggle("on", b.dataset.v === v));
  window.scrollTo(0, 0);
  ({ gal: renderGal, kb: renderKB, uji: renderUji, info: renderInfo, dok: renderDok }[v] || (() => {}))();
}
const step = s => ["s-intro", "s-tanya", "s-hasil"].forEach(i => $(i).classList.toggle("hidden", i !== s));

/* ---- konsultasi ---- */
function mulai() { user = { nama: $("nama").value.trim(), lok: $("merek").value.trim() }; idx = 0; jawab = {}; tanya(); step("s-tanya"); }
function tanya() {
  const k = KEYS[idx];
  $("bar").style.width = (idx / KEYS.length * 100) + "%";
  $("no").textContent = `Pertanyaan ${idx + 1} dari ${KEYS.length}`;
  $("kat").textContent = (IKON[FAKTA[k].g] || "") + " Bagian: " + FAKTA[k].g;
  $("soal").textContent = FAKTA[k].t + "?";
  $("b-ya").classList.toggle("pilih", jawab[k] === true);
  $("b-tidak").classList.toggle("pilih", jawab[k] === false);
  $("back").disabled = idx === 0;
  $("next").textContent = idx === KEYS.length - 1 ? "Lihat hasil" : "Lanjut";
}
function pilih(v) { jawab[KEYS[idx]] = v; $("galat").textContent = ""; tanya(); }
function mundur() { if (idx > 0) { idx--; tanya(); } }
function lanjut() {
  if (jawab[KEYS[idx]] === undefined) { $("galat").textContent = "Pilih Ya atau Tidak dulu sebelum lanjut."; return; }
  idx < KEYS.length - 1 ? (idx++, tanya()) : hasil();
}
function hasil() {
  const h = inferensi(jawab);
  $("sapa").textContent = (user.nama ? "Hasil konsultasi untuk " + user.nama : "Hasil konsultasi") + (user.lok ? " · " + user.lok : "");
  const awal = Object.keys(ANTARA).filter(k => h.mem[k] === true);
  $("out").innerHTML = h.akhir.length
    ? h.akhir.map(k => `<div class="diag">${foto(k)}<div><span class="badge">${k}</span><h3>${AKHIR[k].n}</h3>
        <p><b>Penyebab:</b> ${AKHIR[k].p}</p><p><b>Ciri khas:</b> ${AKHIR[k].c}</p><p><b>Saran:</b> ${AKHIR[k].s}</p></div></div>`).join("")
    : `<div class="diag none"><h3>Belum dapat disimpulkan</h3><p>Jawaban Anda belum cukup untuk menetapkan satu penyakit.${awal.length ? " Indikasi awal yang ditemukan: " + awal.map(k => `<span class="chip">${k}: ${ANTARA[k]}</span>`).join("") : ""}</p>
       <p>Amati lagi gejala di daun, pelepah, malai, dan hama pada rumpun, lalu ulangi konsultasi atau tanyakan ke penyuluh pertanian.</p></div>`;
  const ya = KEYS.filter(k => jawab[k]);
  $("gejala").innerHTML = ya.length ? ya.map(k => `<span class="chip">${k}: ${FAKTA[k].t}</span>`).join("") : `<span class="mute">Semua jawaban "Tidak".</span>`;
  $("jejak").innerHTML = h.jejak.length ? tbl(["Aturan", "JIKA", "MAKA", "Sumber"], h.jejak.map(r => [r.id, aturanTeks(r), `${r.then}: ${nama(r.then)}`, r.src]))
    : `<span class="mute">Tidak ada aturan yang dijalankan.</span>`;
  $("iter").innerHTML = tbl(["Iterasi", "Memori kerja (bernilai Ya)", "Aturan aktif", "Dipilih", "Fakta baru"], h.iterasi.map(t => [t.i, t.memori, t.aktif, t.dipilih, t.baru])) +
    `<p class="mute">Berhenti saat tidak ada lagi aturan aktif.</p>`;
  $("graf").innerHTML = grafSvg(h.mem, h.jejak); $("bar").style.width = "100%"; step("s-hasil"); window.scrollTo(0, 0);
}
function ulang() { $("galat").textContent = ""; step("s-intro"); window.scrollTo(0, 0); }

/* ---- galeri ---- */
function renderGal() {
  $("gal").innerHTML = `<div class="galgrid">` + Object.keys(AKHIR).map(k => `<div class="card">${foto(k)}<h3>${AKHIR[k].n}</h3>
    <p><b>Penyebab:</b> ${AKHIR[k].p}</p><p><b>Ciri:</b> ${AKHIR[k].c}</p></div>`).join("") + `</div>`;
}

/* ---- basis pengetahuan ---- */
function renderKB() {
  const c = konsistensi(), ada = a => a.length ? a.join(", ") : "tidak ada";
  $("kb").innerHTML =
    `<div class="card"><h3>Tabel fakta (${KEYS.length} fakta)</h3>` + tbl(["Kode", "Bagian", "Fakta atau gejala", "Domain nilai", "Sumber"], KEYS.map(k => [k, FAKTA[k].g, FAKTA[k].t, "Ya / Tidak", FAKTA[k].s])) + `</div>
    <div class="card"><h3>Kesimpulan antara (${Object.keys(ANTARA).length})</h3>` + tbl(["Kode", "Kesimpulan antara"], Object.keys(ANTARA).map(k => [k, ANTARA[k]])) +
    `<h3 style="margin-top:18px">Kesimpulan akhir (${Object.keys(AKHIR).length})</h3>` + tbl(["Kode", "Penyakit", "Penyebab", "Saran"], Object.keys(AKHIR).map(k => [k, AKHIR[k].n, AKHIR[k].p, AKHIR[k].s])) + `</div>
    <div class="card"><h3>Aturan produksi (${ATURAN.length} aturan)</h3>` + tbl(["Kode", "Premis (JIKA)", "Kesimpulan (MAKA)", "Sumber"], ATURAN.map(r => [r.id, aturanTeks(r), r.then, r.src])) + `</div>
    <div class="card"><h3>Struktur hubungan (graf dependensi)</h3><p class="mute">Format: kesimpulan ← aturan(premis). ¬ = bernilai Tidak, ∨ = ATAU.</p>${grafSvg({}, [])}<pre>${Object.keys(AKHIR).map(pohon).join("\n\n")}</pre></div>
    <div class="card"><h3>Pemeriksaan konsistensi otomatis</h3>` + tbl(["Pemeriksaan", "Hasil"], [
      ["Aturan berulang", ada(c.berulang)], ["Aturan konflik (F dan TIDAK F)", ada(c.konflik)],
      ["Fakta tidak pernah dipakai", ada(c.faktaTakDipakai)], ["Kesimpulan antara tidak pernah dipakai", ada(c.antaraTakDipakai)],
      ["Kesimpulan tidak dapat dicapai", ada(c.takTercapai)]]) + `<p class="mute">Beberapa penyakit dicapai lewat lebih dari satu aturan (jalur alternatif), bukan pengulangan.</p></div>`;
}

/* ---- pengujian ---- */
function renderUji() {
  const base = Object.fromEntries(KEYS.map(k => [k, false]));
  let sesuai = 0;
  const f = a => a.length ? a.join(", ") : "Belum dapat disimpulkan";
  const rows = UJI.map((u, i) => {
    const h = inferensi({ ...base, ...Object.fromEntries(u.ya.map(k => [k, true])) });
    const ok = JSON.stringify([...h.akhir].sort()) === JSON.stringify([...u.h].sort());
    if (ok) sesuai++;
    return [i + 1, `<b>${u.n}</b><br>Ya: ${u.ya.join(", ")}`, h.jejak.map(r => r.id).join(", ") || "-", f(u.h), f(h.akhir), ok ? `<span class="ok">Sesuai</span>` : `<span class="no">Tidak</span>`];
  });
  const pct = (sesuai / UJI.length * 100).toFixed(1).replace(/\.0$/, "");
  $("uji").innerHTML = `<div class="card"><p class="mute">Tingkat kesesuaian = (jumlah skenario sesuai / jumlah seluruh skenario) × 100%</p><div class="skor">${pct}%</div><p>${sesuai} dari ${UJI.length} skenario sesuai</p></div>
    <div class="card">` + tbl(["No", "Fakta masukan", "Aturan berjalan", "Hasil diharapkan", "Hasil sistem", "Status"], rows) + `</div>
    <p class="mute">Skenario mencakup tujuh penyakit, satu kasus dua penyakit sekaligus, dan satu kasus belum dapat disimpulkan.</p>` + utama();
}

/* ---- tentang ---- */
function renderInfo() {
  $("info").innerHTML = `
  <div class="card"><h3>Pengguna, ruang lingkup, dan batasan</h3><ul>
    <li><b>Calon pengguna:</b> petani, mahasiswa pertanian, dan penyuluh pemula.</li>
    <li><b>Ruang lingkup:</b> tujuh penyakit padi sawah berdasarkan gejala daun, pelepah, malai, tanaman, dan lahan.</li>
    <li><b>Batasan:</b> diagnosis awal; tidak membedakan strain patogen, tidak memberi dosis pestisida, dan tidak menggantikan penyuluh atau uji laboratorium. Gejala beberapa penyakit mirip pada fase awal.</li></ul></div>
  <div class="card"><h3>Metode: Forward Chaining</h3><p>Dipilih karena pengguna mengamati gejala lebih dulu, lalu sistem menurunkan kesimpulan bertahap (gejala → indikasi awal → penyakit).</p>
  <pre>1. Memori kerja ← fakta jawaban pengguna
2. ULANGI
     aktif ← aturan yang premisnya terpenuhi, belum dipakai,
             dan kesimpulannya belum ada di memori
     JIKA aktif kosong MAKA berhenti
     pilih aturan pertama (resolusi konflik: urutan)
     tambahkan kesimpulan ke memori, catat jejak
3. Hasil ← kesimpulan akhir (D) di memori
   JIKA tidak ada D MAKA "belum dapat disimpulkan"
   (tampilkan indikasi awal K bila ada)</pre></div>
  <div class="card"><h3>Sumber pengetahuan</h3><ul>${Object.keys(SUMBER).map(k => `<li><b>${k}</b>: ${SUMBER[k]}</li>`).join("")}</ul><p class="mute">S6 wajib diisi wawancara nyata sebelum dikumpulkan.</p></div>
  <div class="card"><h3>Pernyataan penggunaan AI</h3><p>Kerangka kode, ilustrasi SVG, dan draf basis aturan dibuat dengan bantuan AI (Claude). Pengembang bertanggung jawab memahami seluruh logika dan telah memeriksa aturan terhadap sumber. <i>Sesuaikan kalimat ini.</i></p></div>`;
}

/* ---- tambahan: identitas, skenario utama, dokumen ---- */
const IKON = { Daun: "🍃", Pelepah: "🌿", Malai: "🌾", Tanaman: "🌱", Lingkungan: "☁️" };
$("foot").textContent = `${IDENTITAS.nama} · ${IDENTITAS.nim} · ${IDENTITAS.prodi} · Sistem pakar diagnosis awal, bukan pengganti penyuluh pertanian.`;

function utama() {
  const u = UJI[0], base = Object.fromEntries(KEYS.map(k => [k, false]));
  const h = inferensi({ ...base, ...Object.fromEntries(u.ya.map(k => [k, true])) });
  return `<div class="card"><h3>Skenario utama: ${u.n} (iterasi lengkap)</h3>
    <p>Fakta masukan bernilai Ya: ${u.ya.map(k => `${k} (${FAKTA[k].t})`).join("; ")}.</p>` +
    tbl(["Iterasi", "Memori kerja (bernilai Ya)", "Aturan aktif", "Dipilih", "Fakta baru"], h.iterasi.map(t => [t.i, t.memori, t.aktif, t.dipilih, t.baru])) +
    `<p><b>Kondisi berhenti:</b> iterasi berhenti saat tidak ada aturan aktif. Hasil skenario ini: ${h.akhir.map(k => AKHIR[k].n).join(", ") || "belum dapat disimpulkan"}.
    Bila tidak ada penyakit (D) di memori kerja, sistem menampilkan "Belum dapat disimpulkan" beserta indikasi awal yang ditemukan.</p></div>`;
}

function renderDok() {
  const I = IDENTITAS;
  $("dok").innerHTML = `
  <div class="card"><h3>Formulir usulan kasus</h3>` + tbl(["Komponen", "Isian"], [
    ["NIM dan nama", `${I.nim} / ${I.nama}`], ["Kelas", I.kelas], ["Judul sistem pakar", I.judul], ["Bidang atau domain", "Pertanian (penyakit tanaman padi)"],
    ["Masalah yang akan diselesaikan", "Petani dan pemula sulit membedakan penyakit padi karena gejalanya mirip pada fase awal."],
    ["Calon pengguna", "Petani padi, mahasiswa pertanian, penyuluh pemula"],
    ["Keluaran", "Dugaan penyakit, penyebab, saran pengendalian awal, dan jejak aturan"],
    ["Metode inferensi", "Forward Chaining"], ["Sumber pengetahuan", "S1 sampai S7 (lihat di bawah)"],
    ["Alasan memilih kasus", "Gejala dapat diamati, banyak kemungkinan kesimpulan, mudah dinyatakan dengan aturan JIKA-MAKA, dan berisiko rendah."]]) + `</div>
  <div class="card"><h3>Sumber pengetahuan dan kontribusinya</h3>` + tbl(["Kode", "Identitas sumber", "Kontribusi"], Object.keys(SUMBER).map(k => [k, SUMBER[k], KONTRIBUSI[k]])) +
    `<p class="mute">Ringkasan telaah: penyakit padi penting di Indonesia meliputi blas, hawar daun bakteri, hawar pelepah, tungro, bercak coklat, dan kerdil rumput, dan gejala beberapa penyakit mirip pada fase awal sehingga dipakai aturan bertingkat. Tambahkan ringkasan wawancara Anda (S6) di laporan.</p></div>
  <div class="card"><h3>Daftar istilah dan definisi operasional</h3>` + tbl(["Istilah", "Definisi"], GLOSARIUM) + `</div>
  <div class="card"><h3>Bukti proses</h3><p>Unduh basis pengetahuan saat ini (JSON). Simpan satu salinan sebagai versi awal, dan satu lagi setelah revisi sebagai versi akhir.</p>
    <button class="btn" onclick="unduh()">Unduh basis pengetahuan (JSON)</button></div>`;
}
function unduh() {
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([JSON.stringify({ FAKTA, ANTARA, AKHIR, ATURAN }, null, 2)], { type: "application/json" }));
  a.download = "basis_pengetahuan_padi.json"; a.click();
}
