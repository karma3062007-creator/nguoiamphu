// Phòng Karaoke Âm Phủ (cùng xem/hát một video YouTube, chấm điểm người hát)
// và Chùa Niệm Phật (đếm số câu niệm chung của cả chùa trong ngày).
// Máy chủ giữ trạng thái chung; trình duyệt tự phát video theo giờ máy chủ.
const https = require("https");

module.exports = function createHalls({ clients, send, addMerit }) {
  const all = obj => { for (const c of clients.values()) if (c.p && c.p.sv) send(c, obj); };
  const nameOf = id => { const c = clients.get(id); return (c && c.p && c.p.n) || "Vong hồn"; };

  /* ---------- Karaoke ---------- */
  const K = { cur: null, q: [], here: new Set(), skips: new Set(), rates: new Map(), seq: 0 };
  const QMAX = 20, PER_USER = 2, MAX_DUR = 900;
  const need = () => Math.max(1, Math.ceil(K.here.size / 2));
  function avg() { if (!K.rates.size) return 0; let s = 0; for (const v of K.rates.values()) s += v; return s / K.rates.size; }
  function view() {
    return {
      t: "k.state", now: Date.now(),
      cur: K.cur && { id: K.cur.id, vid: K.cur.vid, title: K.cur.title, by: K.cur.by, name: K.cur.name, start: K.cur.start, dur: K.cur.dur },
      q: K.q.map(s => ({ id: s.id, vid: s.vid, title: s.title, by: s.by, name: s.name })),
      here: K.here.size, skips: K.skips.size, need: need(), avg: Math.round(avg() * 10) / 10, nr: K.rates.size
    };
  }
  let pubT = null;
  function pub(now) { if (now) { clearTimeout(pubT); pubT = null; all(view()); return; } if (!pubT) pubT = setTimeout(() => { pubT = null; all(view()); }, 400); }
  function fetchTitle(song) {
    const url = "https://www.youtube.com/oembed?format=json&url=" + encodeURIComponent("https://www.youtube.com/watch?v=" + song.vid);
    const req = https.get(url, { timeout: 5000 }, res => {
      let b = ""; res.setEncoding("utf8");
      res.on("data", d => { if (b.length < 20000) b += d; });
      res.on("end", () => { try { const j = JSON.parse(b); if (j.title) { song.title = String(j.title).slice(0, 90); pub(); } } catch (e) {} });
    });
    req.on("timeout", () => req.destroy()); req.on("error", () => {});
  }
  function finish() {
    const s = K.cur; if (!s) return;
    const a = avg(), n = K.rates.size;
    let gain = 0;
    if (n) { gain = Math.min(10, Math.round(a * 2)); addMerit(s.by, gain); }
    all({ t: "k.res", name: s.name, title: s.title, avg: Math.round(a * 10) / 10, nr: n, gain });
  }
  function next() {
    finish();
    K.cur = null; K.skips.clear(); K.rates.clear();
    const s = K.q.shift();
    if (s) { s.start = Date.now() + 2000; s.dur = 0; K.cur = s; }
    pub(true);
  }
  setInterval(() => {
    const s = K.cur; if (!s) return;
    const el = Date.now() - s.start;
    if (s.dur ? el > s.dur * 1000 + 3000 : el > 8 * 60000) next();
  }, 1000);

  function karaoke(c, m) {
    const id = c.id, now = Date.now();
    if (m.t === "k.get") { send(c, view()); return; }
    if (m.t === "k.here") { if (m.in) K.here.add(id); else { K.here.delete(id); K.skips.delete(id); } pub(); return; }
    if (m.t === "k.add") {
      const vid = typeof m.vid === "string" && /^[\w-]{11}$/.test(m.vid) ? m.vid : null;
      if (!vid) return send(c, { t: "k.err", msg: "Link YouTube không hợp lệ" });
      if (K.q.length >= QMAX) return send(c, { t: "k.err", msg: "Hàng chờ đã đầy, chờ bớt bài nhé" });
      if (K.q.filter(s => s.by === id).length >= PER_USER) return send(c, { t: "k.err", msg: `Mỗi người xếp tối đa ${PER_USER} bài` });
      if (now - (c.kAddAt || 0) < 3000) return; c.kAddAt = now;
      const song = { id: ++K.seq, vid, title: "", by: id, name: nameOf(id) };
      fetchTitle(song);
      if (!K.cur) { song.start = now + 2000; song.dur = 0; K.cur = song; } else K.q.push(song);
      pub(true); return;
    }
    if (m.t === "k.rm") { const i = K.q.findIndex(s => s.id === m.id && s.by === id); if (i >= 0) { K.q.splice(i, 1); pub(); } return; }
    const s = K.cur; if (!s) return;
    if (m.t === "k.dur") { const d = +m.d; if (m.vid === s.vid && !s.dur && d > 5) { s.dur = Math.min(MAX_DUR, d); pub(); } return; }
    if (m.t === "k.end") { if (m.vid === s.vid && now - s.start > 15000) next(); return; }
    if (m.t === "k.skip") {
      if (s.by === id) { next(); return; }
      K.skips.add(id); if (K.skips.size >= need()) next(); else pub(); return;
    }
    if (m.t === "k.rate") {
      const v = Math.floor(+m.s); if (s.by === id || !(v >= 1 && v <= 5)) return;
      K.rates.set(c.key || id, v); pub(); return;
    }
  }

  /* ---------- Chùa Niệm Phật ---------- */
  const dayKey = () => new Date(Date.now() + 7 * 3600e3).toISOString().slice(0, 10); // ngày theo giờ Việt Nam
  const N = { day: dayKey(), total: 0, by: new Map(), active: new Map() };
  let npT = null;
  function npPub() {
    if (npT) return;
    npT = setTimeout(() => {
      npT = null; const now = Date.now();
      for (const [id, at] of N.active) if (now - at > 8000) N.active.delete(id);
      const top = [...N.by.values()].sort((a, b) => b.c - a.c).slice(0, 5).map(v => ({ name: v.name, c: v.c }));
      for (const c of clients.values()) if (c.p && c.p.sv) {
        const mine = N.by.get(c.key || c.id);
        send(c, { t: "np.state", total: N.total, chanters: N.active.size, top, today: mine ? mine.c : 0 });
      }
    }, 1200);
  }
  function chant(c, m) {
    if (m.t === "np.get") { npPub(); return; }
    if (m.t !== "np.add") return;
    const now = Date.now();
    if (dayKey() !== N.day) { N.day = dayKey(); N.total = 0; N.by.clear(); }
    // tối đa ~6 câu mỗi giây
    c.npTok = Math.min(12, (c.npTok ?? 12) + (now - (c.npAt || now)) / 1000 * 6); c.npAt = now;
    const n = Math.min(Math.floor(+m.n || 0), 12, Math.floor(c.npTok)); if (n <= 0) return;
    c.npTok -= n; N.total += n;
    const k = c.key || c.id, row = N.by.get(k) || { name: nameOf(c.id), c: 0 };
    row.c += n; row.name = nameOf(c.id); N.by.set(k, row);
    N.active.set(c.id, now); npPub();
  }

  return {
    onMessage(c, m) { if (m.t.startsWith("k.")) karaoke(c, m); else if (m.t.startsWith("np.")) chant(c, m); },
    drop(id) {
      K.here.delete(id); K.skips.delete(id); N.active.delete(id);
      const before = K.q.length; K.q = K.q.filter(s => s.by !== id);
      if (before !== K.q.length || (K.cur && K.cur.by === id)) pub();
    }
  };
};
