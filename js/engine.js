/* MESIN INFERENSI: FORWARD CHAINING
   Pseudocode:
   1. Memori kerja <- fakta jawaban pengguna (Ya/Tidak)
   2. ULANGI
        aktif <- aturan yang premisnya terpenuhi, belum dipakai,
                 dan kesimpulannya belum ada di memori
        JIKA aktif kosong MAKA berhenti
        pilih aturan pertama (resolusi konflik: urutan aturan)
        tambahkan kesimpulan ke memori, catat jejak
   3. Hasil <- kesimpulan akhir (D) di memori; kosong = belum dapat disimpulkan */

function nama(k) {
  return (FAKTA[k] && FAKTA[k].t) || ANTARA[k] || (AKHIR[k] && AKHIR[k].n) || k;
}
const cek = (c, mem) => c[0] === "!" ? mem[c.slice(1)] === false : mem[c] === true;
const terpenuhi = (r, mem) =>
  (!r.all || r.all.every(c => cek(c, mem))) && (!r.any || r.any.some(c => cek(c, mem)));

function inferensi(input) {
  const mem = { ...input }, dipakai = new Set(), jejak = [], iterasi = [];
  const snap = () => Object.keys(mem).filter(k => mem[k] === true).join(", ") || "-";
  iterasi.push({ i: 0, memori: snap(), aktif: "-", dipilih: "-", baru: "-" });
  for (let n = 1; ; n++) {
    const aktif = ATURAN.filter(r => !dipakai.has(r.id) && terpenuhi(r, mem) && mem[r.then] !== true);
    if (!aktif.length) break;                 // kondisi berhenti
    const p = aktif[0];
    dipakai.add(p.id); mem[p.then] = true; jejak.push(p);
    iterasi.push({ i: n, memori: snap(), aktif: aktif.map(r => r.id).join(", "), dipilih: p.id, baru: p.then });
  }
  return { mem, jejak, iterasi, akhir: Object.keys(AKHIR).filter(k => mem[k] === true) };
}

// Pemeriksaan konsistensi aturan (Bagian B.5)
function konsistensi() {
  const premis = r => [...(r.all || []), ...(r.any || [])];
  const dipakai = new Set(ATURAN.flatMap(r => premis(r).map(c => c.replace("!", ""))));
  const dicapai = new Set(ATURAN.map(r => r.then));
  const ser = r => JSON.stringify([[...(r.all || [])].sort(), [...(r.any || [])].sort(), r.then]);
  return {
    faktaTakDipakai: Object.keys(FAKTA).filter(k => !dipakai.has(k)),
    antaraTakDipakai: Object.keys(ANTARA).filter(k => !dipakai.has(k)),
    takTercapai: [...Object.keys(ANTARA), ...Object.keys(AKHIR)].filter(k => !dicapai.has(k)),
    berulang: ATURAN.filter((r, i) => ATURAN.findIndex(x => ser(x) === ser(r)) !== i).map(r => r.id),
    konflik: ATURAN.filter(r => (r.all || []).some(c => (r.all || []).includes("!" + c))).map(r => r.id)
  };
}

// Struktur hubungan kesimpulan <- aturan <- premis (teks)
function pohon(k) {
  const rs = ATURAN.filter(r => r.then === k);
  if (!rs.length) return k;
  return k + " ← " + rs.map(r => r.id + "(" +
    premis2(r).map(c => (c[0] === "!" ? "¬" : "") + pohon(c.replace("!", ""))).join(r.any && !r.all ? " ∨ " : ", ") + ")").join(" | ");
}
const premis2 = r => [...(r.all || []), ...(r.any || [])];
