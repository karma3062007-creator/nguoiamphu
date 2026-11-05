// Phòng Karaoke Âm Phủ (cùng xem/hát một video YouTube, chấm điểm người hát)
// và Chùa Niệm Phật (đếm số câu niệm chung của cả chùa trong ngày).
// Máy chủ giữ trạng thái chung; trình duyệt tự phát video theo giờ máy chủ.
const https = require("https");

module.exports = function createHalls({ clients, send, addMerit }) {
  const all = obj => { for (const c of clients.values()) if (c.p && c.p.sv) send(c, obj); };
  const nameOf = id => { const c = clients.get(id); return (c && c.p && c.p.n) || "Vong hồn"; };

  /* ---------- Phòng xem chung: Karaoke (tiền tố "k.") và Rạp phim (tiền tố "c.") ---------- */
  // Hàng chờ video YouTube, phát đồng bộ theo giờ máy chủ, bình chọn video muốn xem trước,
  // qua bài khi đủ nửa phòng. Karaoke có thêm chấm điểm người hát (cộng công đức).
  function makeTheater(P, o) {
    const T = { cur: null, q: [], here: new Set(), skips: new Set(), rates: new Map(), seq: 0 };
    const QMAX = 20, PER_USER = o.perUser, MAX_DUR = o.maxDur;
    const need = () => Math.max(1, Math.ceil(T.here.size / 2));
    function avg() { if (!T.rates.size) return 0; let s = 0; for (const v of T.rates.values()) s += v; return s / T.rates.size; }
    // video nhiều phiếu lên trước, bằng phiếu thì ai gửi trước lên trước
    const sortQ = () => T.q.sort((x, y) => y.votes.size - x.votes.size || x.id - y.id);
    function view(c) {
      const me = c && (c.key || c.id);
      return {
        t: P + ".state", now: Date.now(),
        cur: T.cur && { id: T.cur.id, vid: T.cur.vid, title: T.cur.title, by: T.cur.by, name: T.cur.name, start: T.cur.start, dur: T.cur.dur },
        q: T.q.map(s => ({ id: s.id, vid: s.vid, title: s.title, by: s.by, name: s.name, votes: s.votes.size, mine: me ? s.votes.has(me) : false })),
        here: T.here.size, skips: T.skips.size, need: need(), avg: Math.round(avg() * 10) / 10, nr: T.rates.size
      };
    }
    let pubT = null;
    const pubAll = () => { for (const c of clients.values()) if (c.p && c.p.sv) send(c, view(c)); };
    function pub(now) { if (now) { clearTimeout(pubT); pubT = null; pubAll(); return; } if (!pubT) pubT = setTimeout(() => { pubT = null; pubAll(); }, 400); }
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
      const s = T.cur; if (!s || !o.rate) return;
      const a = avg(), n = T.rates.size;
      let gain = 0;
      if (n) { gain = Math.min(10, Math.round(a * 2)); addMerit(s.by, gain); }
      all({ t: P + ".res", name: s.name, title: s.title, avg: Math.round(a * 10) / 10, nr: n, gain });
    }
    function next() {
      finish();
      T.cur = null; T.skips.clear(); T.rates.clear();
      sortQ(); const s = T.q.shift();
      if (s) { s.start = Date.now() + 2000; s.dur = 0; T.cur = s; }
      pub(true);
    }
    setInterval(() => {
      const s = T.cur; if (!s) return;
      const el = Date.now() - s.start;
      if (s.dur ? el > s.dur * 1000 + 3000 : el > o.noDur) next();
    }, 1000);
    function onMessage(c, m) {
      const id = c.id, now = Date.now(), k = m.t.slice(2);
      if (k === "get") { send(c, view(c)); return; }
      if (k === "here") { if (m.in) T.here.add(id); else { T.here.delete(id); T.skips.delete(id); } pub(); return; }
      if (k === "add") {
        const vid = typeof m.vid === "string" && /^[\w-]{11}$/.test(m.vid) ? m.vid : null;
        if (!vid) return send(c, { t: P + ".err", msg: "Link YouTube không hợp lệ" });
        if (T.q.length >= QMAX) return send(c, { t: P + ".err", msg: "Hàng chờ đã đầy, chờ bớt nhé" });
        if (T.q.filter(s => s.by === id).length >= PER_USER) return send(c, { t: P + ".err", msg: `Mỗi người gửi tối đa ${PER_USER} video trong hàng chờ` });
        if (now - (c[P + "AddAt"] || 0) < 3000) return; c[P + "AddAt"] = now;
        const song = { id: ++T.seq, vid, title: "", by: id, name: nameOf(id), votes: new Set() };
        fetchTitle(song);
        if (!T.cur) { song.start = now + 2000; song.dur = 0; T.cur = song; } else T.q.push(song);
        pub(true); return;
      }
      if (k === "rm") { const i = T.q.findIndex(s => s.id === m.id && s.by === id); if (i >= 0) { T.q.splice(i, 1); pub(); } return; }
      if (k === "vote") { const s = T.q.find(x => x.id === m.id); if (!s) return; const me = c.key || id; if (s.votes.has(me)) s.votes.delete(me); else s.votes.add(me); sortQ(); pub(); return; }
      const s = T.cur; if (!s) return;
      if (k === "dur") { const d = +m.d; if (m.vid === s.vid && !s.dur && d > 5) { s.dur = Math.min(MAX_DUR, d); pub(); } return; }
      if (k === "end") { if (m.vid === s.vid && now - s.start > 15000) next(); return; }
      if (k === "skip") {
        if (s.by === id) { next(); return; }
        T.skips.add(id); if (T.skips.size >= need()) next(); else pub(); return;
      }
      if (k === "rate" && o.rate) {
        const v = Math.floor(+m.s); if (s.by === id || !(v >= 1 && v <= 5)) return;
        T.rates.set(c.key || id, v); pub(); return;
      }
    }
    function drop(id) {
      T.here.delete(id); T.skips.delete(id);
      const before = T.q.length; T.q = T.q.filter(s => s.by !== id);
      if (before !== T.q.length || (T.cur && T.cur.by === id)) pub();
    }
    return { onMessage, drop };
  }
  const theaters = {
    k: makeTheater("k", { rate: true, perUser: 2, maxDur: 900, noDur: 8 * 60000 }),
    c: makeTheater("c", { rate: false, perUser: 3, maxDur: 4 * 3600, noDur: 3 * 3600e3 })
  };

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
  // Đèn nguyện: lời nguyện ngắn mọi người thấy, giữ 30 cái gần nhất
  const wishes = [];
  function chant(c, m) {
    if (m.t === "np.get") { npPub(); send(c, { t: "np.wishes", list: wishes }); return; }
    if (m.t === "np.wish") {
      const now = Date.now();
      const text = typeof m.text === "string" ? m.text.replace(/[\u0000-\u001f\u007f<>]/g, " ").replace(/\s+/g, " ").trim().slice(0, 80) : "";
      if (!text) return;
      if (now - (c.wishAt || 0) < 60000) return send(c, { t: "np.err", msg: "Mỗi phút chỉ thả một đèn nguyện" });
      c.wishAt = now;
      const w = { name: nameOf(c.id), text, at: now };
      wishes.unshift(w); if (wishes.length > 30) wishes.pop();
      all({ t: "np.wish", w }); return;
    }
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
    onMessage(c, m) { if (m.t.startsWith("np.")) chant(c, m); else if (theaters[m.t[0]] && m.t[1] === ".") theaters[m.t[0]].onMessage(c, m); },
    drop(id) {
      N.active.delete(id);
      for (const k in theaters) theaters[k].drop(id);
    }
  };
};
