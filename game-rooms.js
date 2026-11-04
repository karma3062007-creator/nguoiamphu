// Phòng chơi cho trò chơi bàn (Cờ vua, Ô ăn quan, Ma Sói): ghép ngẫu nhiên, phòng riêng có mã, chơi với máy.
// Luật nằm ở src/games/rules-*.js (Codex). Máy chủ chỉ giữ phòng, hẹn giờ, chuyển nước đi và gửi view cho từng người.
"use strict";
const path = require("path");

const GAME_IDS = ["chess", "oanquan", "masoi"];
const RULES = {};
for (const id of GAME_IDS) {
  try { RULES[id] = require(path.join(__dirname, "src/games/rules-" + id + ".js")); }
  catch (e) { console.warn("Chưa có luật cho", id, "-", e.message); }
}
const NAMES = { chess: "Cờ vua", oanquan: "Ô ăn quan", masoi: "Ma Sói" };
const BOT_NAMES = ["Quỷ Sứ (máy)", "Đầu Trâu (máy)", "Mặt Ngựa (máy)"];
const AUTO_START_MS = 20000;   // Ma Sói ghép ngẫu nhiên: đủ người tối thiểu thì đếm ngược rồi tự bắt đầu
const REWARD = { human: 18, bot: 3 };   // công đức cho người thắng

module.exports = function createRooms({ send, addMerit }) {
  const rooms = new Map();     // code -> room
  const where = new Map();     // clientId -> code
  const names = new Map();     // clientId -> tên
  const queues = { chess: [], oanquan: [] };   // hàng chờ ghép ngẫu nhiên cho trò 2 người

  const nameOf = id => names.get(id) || "Vong hồn";
  const code4 = () => { let c; do { c = Array.from({ length: 4 }, () => "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"[Math.random() * 32 | 0]).join(""); } while (rooms.has(c)); return c; };
  const safe = (fn, fallback) => { try { return fn(); } catch (e) { console.error("Lỗi luật:", e && e.stack || e); return fallback; } };
  const humans = r => r.players.filter(p => !p.bot);

  function gameList() {
    return GAME_IDS.map(id => ({ id, name: NAMES[id], ready: !!RULES[id], min: RULES[id] ? RULES[id].minPlayers : 2, max: RULES[id] ? RULES[id].maxPlayers : 2, bot: !!(RULES[id] && id !== "masoi") }));
  }

  function roomInfo(r, me) {
    return { t: "g.room", room: { code: r.code, game: r.game, name: NAMES[r.game], mode: r.mode, host: r.host, me, status: r.status, min: r.rules.minPlayers, max: r.rules.maxPlayers, startsAt: r.startsAt || 0,
      players: r.players.map(p => ({ id: p.id, n: p.n, bot: !!p.bot, gone: !!p.gone })) } };
  }
  function pushRoom(r) { for (const p of humans(r)) if (!p.gone) send(p.id, roomInfo(r, p.id)); }
  function pushState(r) {
    const result = r.status === "play" || r.status === "end" ? safe(() => r.rules.result(r.state), null) : null;
    for (const p of humans(r)) {
      if (p.gone) continue;
      send(p.id, { t: "g.state", game: r.game, view: safe(() => r.rules.view(r.state, p.id), null), actions: r.status === "play" ? safe(() => r.rules.actions(r.state, p.id), []) : [], result });
    }
  }

  function newRoom(game, mode, hostId) {
    const r = { code: code4(), game, rules: RULES[game], mode, host: hostId, players: [], status: "wait", state: null, seed: Math.random() * 1e9 | 0, startsAt: 0, timer: null, botTimer: null };
    rooms.set(r.code, r);
    return r;
  }
  function addPlayer(r, id) {
    leave(id, true);
    r.players.push({ id, n: nameOf(id) });
    where.set(id, r.code);
  }

  function start(r) {
    if (r.status === "play") return;
    clearTimeout(r.timer); r.startsAt = 0;
    const live = r.players.filter(p => !p.gone);
    if (live.length < r.rules.minPlayers) return;
    r.players = live;
    r.state = safe(() => r.rules.setup(r.players.map(p => ({ id: p.id, n: p.n })), { seed: r.seed++, now: Date.now() }), null);
    if (!r.state) { for (const p of humans(r)) send(p.id, { t: "g.err", msg: "Luật trò này đang lỗi, thử lại sau nhé." }); return; }
    r.status = "play";
    pushRoom(r); pushState(r); scheduleBot(r);
  }

  function finishIfOver(r) {
    const res = safe(() => r.rules.result(r.state), null);
    if (!res || r.status !== "play") return;
    r.status = "end";
    const vsBot = r.players.some(p => p.bot);
    for (const w of res.winners || []) if (!String(w).startsWith("bot:")) addMerit(w, vsBot ? REWARD.bot : REWARD.human);
    pushRoom(r);
  }

  function afterChange(r) { finishIfOver(r); pushState(r); scheduleBot(r); }

  function scheduleBot(r) {
    clearTimeout(r.botTimer);
    if (r.status !== "play" || !r.rules.bot) return;
    const bot = r.players.find(p => p.bot && safe(() => r.rules.actions(r.state, p.id), []).length);
    if (!bot) return;
    r.botTimer = setTimeout(() => {
      if (r.status !== "play") return;
      const a = safe(() => r.rules.bot(r.state, bot.id), null);
      if (!a) return;
      const out = safe(() => r.rules.apply(r.state, bot.id, a, Date.now()), null);
      if (out && !out.error) { r.state = out.state; afterChange(r); }
    }, 700 + Math.random() * 600);
  }

  function leave(id, quiet) {
    for (const q of Object.values(queues)) { const i = q.indexOf(id); if (i >= 0) q.splice(i, 1); }
    const code = where.get(id); where.delete(id);
    const r = code && rooms.get(code); if (!r) return;
    const p = r.players.find(x => x.id === id); if (!p) return;
    if (r.status === "play") {
      // Bỏ ngang trò 2 người = đầu hàng. Ma Sói: người đó ở lại bàn, coi như im lặng tới hết ván.
      p.gone = true;
      if (r.game !== "masoi") {
        const out = safe(() => r.rules.apply(r.state, id, { type: "resign" }, Date.now()), null);
        if (out && !out.error) r.state = out.state;
        finishIfOver(r); pushState(r);
      }
    } else {
      r.players = r.players.filter(x => x.id !== id);
    }
    if (!humans(r).some(x => !x.gone)) { clearTimeout(r.timer); clearTimeout(r.botTimer); rooms.delete(r.code); return; }
    if (r.host === id) r.host = (humans(r).find(x => !x.gone) || {}).id;
    if (!quiet) pushRoom(r);
  }

  function err(id, msg) { send(id, { t: "g.err", msg }); }

  function onMessage(id, m) {
    const rulesOk = g => { if (!RULES[g]) { err(id, "Trò này đang được làm, chưa chơi được."); return false; } return true; };
    if (m.t === "g.hello") {
      if (typeof m.n === "string" && m.n.trim()) names.set(id, m.n.trim().slice(0, 24));
      send(id, { t: "g.games", games: gameList() });
    } else if (m.t === "g.queue") {
      const g = String(m.game || ""); if (!rulesOk(g)) return;
      if (m.mode === "bot") {
        if (g === "masoi") return err(id, "Ma Sói cần người thật, chưa chơi với máy được.");
        const r = newRoom(g, "bot", id); addPlayer(r, id);
        r.players.push({ id: "bot:" + r.code, n: BOT_NAMES[Math.random() * BOT_NAMES.length | 0], bot: true });
        return start(r);
      }
      if (g === "masoi") {
        let r = [...rooms.values()].find(x => x.game === "masoi" && x.mode === "random" && x.status === "wait" && x.players.length < x.rules.maxPlayers);
        if (!r) r = newRoom("masoi", "random", id);
        addPlayer(r, id);
        if (r.players.length >= r.rules.maxPlayers) return start(r);
        if (r.players.length >= r.rules.minPlayers && !r.startsAt) { r.startsAt = Date.now() + AUTO_START_MS; r.timer = setTimeout(() => start(r), AUTO_START_MS); }
        return pushRoom(r);
      }
      leave(id, true);
      const q = queues[g].filter(x => x !== id);
      const other = q.shift(); queues[g] = q;
      if (other) { const r = newRoom(g, "random", other); addPlayer(r, other); addPlayer(r, id); return start(r); }
      queues[g].push(id);
      send(id, { t: "g.waiting", game: g, name: NAMES[g] });
    } else if (m.t === "g.create") {
      const g = String(m.game || ""); if (!rulesOk(g)) return;
      const r = newRoom(g, "private", id); addPlayer(r, id); pushRoom(r);
    } else if (m.t === "g.join") {
      const r = rooms.get(String(m.code || "").toUpperCase().trim());
      if (!r || r.mode !== "private") return err(id, "Không có phòng mã này. Kiểm tra lại mã nhé.");
      if (r.players.some(p => p.id === id)) return pushRoom(r);
      if (r.status !== "wait") return err(id, "Phòng này đang chơi rồi.");
      if (r.players.length >= r.rules.maxPlayers) return err(id, "Phòng đã đủ người.");
      addPlayer(r, id);
      if (r.rules.maxPlayers === 2 && r.players.length === 2) return start(r);
      pushRoom(r);
    } else if (m.t === "g.start") {
      const r = rooms.get(where.get(id)); if (!r) return;
      if (r.host !== id) return err(id, "Chỉ chủ phòng được bắt đầu.");
      if (r.players.length < r.rules.minPlayers) return err(id, `Cần ít nhất ${r.rules.minPlayers} người.`);
      start(r);
    } else if (m.t === "g.again") {
      const r = rooms.get(where.get(id)); if (!r || r.status !== "end") return;
      if (r.players.some(p => p.gone && !p.bot)) return err(id, "Đối thủ đã rời bàn. Ghép người mới nhé.");
      r.status = "wait"; start(r);
    } else if (m.t === "g.act") {
      const r = rooms.get(where.get(id)); if (!r || r.status !== "play") return;
      if (!m.action || typeof m.action !== "object") return;
      const { label, ...action } = m.action;
      const out = safe(() => r.rules.apply(r.state, id, action, Date.now()), { error: "Có lỗi, thử lại nhé." });
      if (!out || out.error) return err(id, (out && out.error) || "Nước này không hợp lệ.");
      r.state = out.state; afterChange(r);
    } else if (m.t === "g.chat") {
      const r = rooms.get(where.get(id)); if (!r) return;
      const text = String(m.text || "").trim().slice(0, 140); if (!text) return;
      const ch = r.status === "play" ? safe(() => r.rules.chatChannel(r.state, id), "all") : "all";
      if (!ch) return err(id, "Lúc này bạn không nói được (đang đêm, hoặc đã chết).");
      for (const p of humans(r)) {
        if (p.gone) continue;
        const theirs = r.status === "play" ? safe(() => r.rules.chatChannel(r.state, p.id), "all") : "all";
        if (ch === "all" || theirs === ch) send(p.id, { t: "g.chat", from: id, n: nameOf(id), text, ch });
      }
    } else if (m.t === "g.leave") {
      leave(id);
      send(id, { t: "g.left" });
    }
  }

  // Pha có hẹn giờ (Ma Sói)
  setInterval(() => {
    const now = Date.now();
    for (const r of rooms.values()) {
      if (r.status !== "play" || !r.rules.tick) continue;
      const next = safe(() => r.rules.tick(r.state, now), r.state);
      if (next && next !== r.state && JSON.stringify(next) !== JSON.stringify(r.state)) { r.state = next; afterChange(r); }
    }
  }, 1000);

  return { onMessage, drop: id => { leave(id); names.delete(id); }, stats: () => ({ rooms: rooms.size }) };
};
