/* Ilustrasi SVG tiap penyakit. Foto asli (img/D1.jpg dst.) menggantikannya otomatis. */
const LEAF = (c = "#5fae3a") => `<path d="M20 150C80 60 160 30 260 20C190 70 120 110 20 150Z" fill="${c}"/><path d="M20 150C100 95 180 55 260 20" stroke="#ffffff66" stroke-width="2" fill="none"/>`;
const svg = (k, body) => `<svg viewBox="0 0 280 170" role="img" aria-label="Ilustrasi ${AKHIR[k] ? AKHIR[k].n : k}"><rect width="280" height="170" fill="#dcefc8"/><circle cx="240" cy="30" r="16" fill="#f7e08a"/>${body}</svg>`;

function ilustrasi(k) {
  let b = "";
  const dots = (n, f) => Array.from({ length: n }, (_, i) => f(i)).join("");
  if (k === "D1") b = LEAF() + `<g fill="#dedfd0" stroke="#7a4a21" stroke-width="3">` +
    [[100, 104, -32], [155, 76, -30], [205, 48, -28]].map(([x, y, r]) => `<ellipse cx="${x}" cy="${y}" rx="19" ry="6" transform="rotate(${r} ${x} ${y})"/>`).join("") + `</g>`;
  else if (k === "D2") b = LEAF() + `<path d="M260 20C190 70 120 110 20 150" fill="none" stroke="#e9d27a" stroke-width="11" stroke-dasharray="28 8" stroke-linecap="round"/><path d="M260 20C230 28 200 40 175 56C200 62 235 50 260 20Z" fill="#e8d889"/>`;
  else if (k === "D3") b = `<path d="M30 160C90 90 160 70 230 60C170 100 110 130 30 160Z" fill="#f6d04d"/>` + LEAF("#f0a93a");
  else if (k === "D4") b = LEAF() + dots(15, i => `<ellipse cx="${48 + i * 14}" cy="${150 - (28 + i * 14) * .54 + ((i % 3) - 1) * 8}" rx="4" ry="2.6" fill="#7b4a22" transform="rotate(-28 ${48 + i * 14} ${150 - (28 + i * 14) * .54})"/>`);
  else if (k === "D5") b = `<rect x="105" y="8" width="70" height="160" rx="30" fill="#9cc95a"/><g fill="#d5cfb2" stroke="#9a3b1c" stroke-width="3"><ellipse cx="128" cy="55" rx="14" ry="20"/><ellipse cx="152" cy="105" rx="12" ry="26"/><ellipse cx="130" cy="140" rx="10" ry="12"/></g><g fill="#7b4a22"><circle cx="126" cy="52" r="3"/><circle cx="133" cy="60" r="2.5"/><circle cx="150" cy="100" r="3"/></g>`;
  else if (k === "D6") b = dots(24, i => `<path d="M${30 + i * 10} 165Q${34 + i * 10} 130 ${34 + i * 10 + (i % 3) * 4} ${92 + (i % 5) * 9}" stroke="${i % 2 ? "#bcd96d" : "#a5c85b"}" stroke-width="4" stroke-linecap="round" fill="none"/>`);
  else if (k === "D7") b = `<path d="M60 165C70 90 110 40 200 30" stroke="#6aa63b" stroke-width="5" fill="none"/>` +
    dots(11, i => { const t = (i + 1) / 12, x = 100 + t * 100 + (i % 2) * 8, y = 95 - t * 45 + (i % 3) * 8; return `<circle cx="${x}" cy="${y}" r="${7 + i % 3}" fill="${i % 3 ? "#5b7d22" : "#2f3d15"}"/>`; }) +
    dots(5, i => `<ellipse cx="${100 + i * 14}" cy="${132 - i * 5}" rx="3.5" ry="7" fill="#e6c860" transform="rotate(20 ${100 + i * 14} ${132 - i * 5})"/>`);
  return svg(k, b);
}
const heroSvg = () => `<svg viewBox="0 0 280 170" role="img" aria-label="Tanaman padi"><rect width="280" height="170" rx="16" fill="#dcefc8"/><circle cx="230" cy="36" r="20" fill="#f7e08a"/><path d="M0 130C60 100 120 120 180 105S250 110 280 100V170H0Z" fill="#9cc95a"/><path d="M0 150C70 130 140 145 280 125V170H0Z" fill="#6aa63b"/>` +
  [60, 105, 150, 195].map(x => `<path d="M${x} 160C${x - 6} 110 ${x + 10} 70 ${x + 34} 52" stroke="#4f8a2c" stroke-width="4" fill="none"/>` +
    Array.from({ length: 7 }, (_, j) => `<ellipse cx="${x + 18 + j * 3.4}" cy="${70 - j * 2.6 + (j % 2) * 5}" rx="3.4" ry="7" fill="#e8c24a" transform="rotate(${30 + j * 4} ${x + 18 + j * 3.4} ${70 - j * 2.6})"/>`).join("")).join("") + `</svg>`;

const foto = k => `<div class="ilu">${ilustrasi(k)}<img src="img/${k}.jpg" alt="Foto ${AKHIR[k].n}" onload="this.parentNode.classList.add('foto')" onerror="this.remove()"></div>`;

/* Graf dependensi aturan (SVG). Fakta/kesimpulan terpenuhi berwarna hijau, aturan yang dijalankan berwarna emas. */
function grafSvg(mem = {}, jejak = []) {
  const F = Object.keys(FAKTA), K = Object.keys(ANTARA), D = Object.keys(AKHIR);
  const H = F.length * 25 + 50, pos = {};
  [[F, 10], [K, 320], [D, 630]].forEach(([arr, x]) => { const g = (H - 40) / arr.length; arr.forEach((k, i) => pos[k] = { x, y: 36 + g * i + g / 2 }); });
  const pakai = new Set(jejak.map(r => r.id)), hid = k => mem[k] === true;
  const edge = (r, c, on) => {
    const a = pos[c.replace("!", "")], b = pos[r.then], x1 = a.x + 48, xm = (x1 + b.x) / 2;
    return `<path d="M${x1} ${a.y}C${xm} ${a.y} ${xm} ${b.y} ${b.x} ${b.y}" fill="none" style="stroke:${on ? "var(--gold)" : "var(--line)"}" stroke-width="${on ? 2.6 : 1}" ${c[0] === "!" ? 'stroke-dasharray="4 3"' : ""}/>`;
  };
  let off = "", on = "";
  ATURAN.forEach(r => (r.all || []).concat(r.any || []).forEach(c => { if (pakai.has(r.id)) on += edge(r, c, true); else off += edge(r, c, false); }));
  const node = k => { const p = pos[k], a = hid(k);
    return `<g><title>${k}: ${nama(k)}</title><rect x="${p.x}" y="${p.y - 10}" width="48" height="20" rx="10" style="fill:${a ? "var(--ac)" : "var(--card)"};stroke:var(--ac)" stroke-width="1.5"/><text x="${p.x + 24}" y="${p.y}" text-anchor="middle" dominant-baseline="central" style="fill:${a ? "var(--card)" : "var(--ink)"};font:600 11px system-ui">${k}</text></g>`; };
  const lab = k => `<text x="${pos[k].x + 54}" y="${pos[k].y}" dominant-baseline="central" style="fill:var(--ink);font:11px system-ui">${AKHIR[k].n.replace(/ \(.*\)/, "").slice(0, 24)}</text>`;
  const head = [["Gejala (F)", 10], ["Indikasi awal (K)", 320], ["Penyakit (D)", 630]].map(([t, x]) => `<text x="${x}" y="16" style="fill:var(--mute);font:600 11px system-ui">${t}</text>`).join("");
  return `<div class="scroll"><svg viewBox="0 0 860 ${H}" style="min-width:680px;width:100%" role="img" aria-label="Graf dependensi aturan">${head}${off}${on}${[...F, ...K, ...D].map(node).join("")}${D.map(lab).join("")}</svg></div>
  <p class="mute">Garis emas = aturan yang dijalankan, garis putus = premis TIDAK, bulatan hijau = fakta atau kesimpulan terpenuhi. Arahkan kursor ke kode untuk melihat artinya.</p>`;
}
