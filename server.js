// Máy chủ riêng cho Âm Phủ Online: phục vụ trang web + WebSocket cho nhiều người chơi.
// Không cần cài gói nào. Chạy: node server.js   (cổng mặc định 8080, đổi bằng biến PORT)
"use strict";
const http = require("http");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const PORT = +process.env.PORT || 8080;
const ROOT = __dirname;
const DATA_DIR = process.env.DATA_DIR || path.join(ROOT, "data");
const MERIT_FILE = path.join(DATA_DIR, "merit.json");
const MAX_CLIENTS = 300;      // tối đa số người cùng lúc trên cả máy chủ
const MAX_MSG = 4096;         // byte mỗi tin
const RATE = 30;              // tin tối đa mỗi giây mỗi người

/* ---------- trang tĩnh ---------- */
const PAGES = {
  "/": "dist/am-phu-online.html",
  "/am-phu-online.html": "dist/am-phu-online.html",
  "/tour": "dist/am-phu-travel.html",
  "/am-phu-travel.html": "dist/am-phu-travel.html"
};
const server = http.createServer((req, res) => {
  const url = req.url.split("?")[0];
  if (url === "/health") { res.writeHead(200, { "content-type": "text/plain" }); res.end("ok " + clients.size); return; }
  const file = PAGES[url];
  if (!file) { res.writeHead(404, { "content-type": "text/plain; charset=utf-8" }); res.end("Không tìm thấy trang"); return; }
  fs.readFile(path.join(ROOT, file), (err, buf) => {
    if (err) { res.writeHead(500, { "content-type": "text/plain; charset=utf-8" }); res.end("Chưa có trang. Hãy chạy: node build.js"); return; }
    res.writeHead(200, { "content-type": "text/html; charset=utf-8", "cache-control": "no-cache" });
    res.end(buf);
  });
});

/* ---------- công đức (lưu vào file JSON) ---------- */
let merits = {};
try { merits = JSON.parse(fs.readFileSync(MERIT_FILE, "utf8")); } catch (e) {}
let saveTimer = null;
function saveMerits() {
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    fs.mkdirSync(DATA_DIR, { recursive: true });
    fs.writeFile(MERIT_FILE + ".tmp", JSON.stringify(merits), err => { if (!err) fs.rename(MERIT_FILE + ".tmp", MERIT_FILE, () => {}); });
  }, 2000);
}
function topRows() {
  return Object.entries(merits).sort((a, b) => b[1].m - a[1].m).slice(0, 10);
}
let boardTimer = null;
function broadcastBoard() {
  if (boardTimer) return;
  boardTimer = setTimeout(() => {
    boardTimer = null;
    const top = topRows();
    for (const c of clients.values()) sendBoard(c, top);
  }, 1500);
}
function sendBoard(c, top = topRows()) {
  send(c, { t: "board", rows: top.map(([k, v]) => ({ n: v.n, m: v.m, mine: k === c.key })) });
}

/* ---------- WebSocket (viết tay, không cần thư viện) ---------- */
const clients = new Map(); // id -> client
let nextId = 1;

server.on("upgrade", (req, socket) => {
  if (req.url.split("?")[0] !== "/ws" || clients.size >= MAX_CLIENTS) { socket.destroy(); return; }
  const key = req.headers["sec-websocket-key"];
  if (!key) { socket.destroy(); return; }
  const accept = crypto.createHash("sha1").update(key + "258EAFA5-E914-47DA-95CA-C5AB0DC85B11").digest("base64");
  socket.write("HTTP/1.1 101 Switching Protocols\r\nUpgrade: websocket\r\nConnection: Upgrade\r\nSec-WebSocket-Accept: " + accept + "\r\n\r\n");
  socket.setNoDelay(true);

  const c = { id: "p" + (nextId++).toString(36) + crypto.randomBytes(3).toString("hex"), socket, buf: Buffer.alloc(0), p: null, key: null, tokens: RATE, last: Date.now(), alive: true };
  clients.set(c.id, c);
  send(c, { t: "hello", id: c.id, peers: [...clients.values()].filter(o => o !== c && o.p).map(o => ({ id: o.id, p: o.p })) });

  socket.on("data", chunk => {
    c.buf = Buffer.concat([c.buf, chunk]);
    if (c.buf.length > MAX_MSG * 4) return drop(c);
    let frame;
    while ((frame = readFrame(c))) {
      if (frame.op === 8) return drop(c);                       // close
      if (frame.op === 9) { writeFrame(c.socket, frame.data, 10); continue; } // ping -> pong
      if (frame.op === 10) { c.alive = true; continue; }        // pong
      if (frame.op === 1) onMessage(c, frame.data.toString("utf8"));
    }
  });
  socket.on("close", () => drop(c));
  socket.on("error", () => drop(c));
});

function readFrame(c) {
  const b = c.buf;
  if (b.length < 2) return null;
  const op = b[0] & 0x0f, masked = b[1] & 0x80;
  let len = b[1] & 0x7f, off = 2;
  if (len === 126) { if (b.length < 4) return null; len = b.readUInt16BE(2); off = 4; }
  else if (len === 127) { drop(c); return null; }
  if (len > MAX_MSG) { drop(c); return null; }
  if (!masked) { drop(c); return null; }                        // trình duyệt luôn gửi có mask
  if (b.length < off + 4 + len) return null;
  const mask = b.slice(off, off + 4); off += 4;
  const data = Buffer.alloc(len);
  for (let i = 0; i < len; i++) data[i] = b[off + i] ^ mask[i & 3];
  c.buf = b.slice(off + len);
  return { op, data };
}
function writeFrame(socket, data, op = 1) {
  const len = data.length;
  const head = len < 126 ? Buffer.from([0x80 | op, len]) : len < 65536 ? Buffer.from([0x80 | op, 126, len >> 8, len & 255]) : null;
  if (!head || socket.destroyed) return;
  socket.write(Buffer.concat([head, data]));
}
function send(c, obj) { writeFrame(c.socket, Buffer.from(JSON.stringify(obj))); }
function broadcast(obj, except) {
  const buf = Buffer.from(JSON.stringify(obj));
  for (const o of clients.values()) if (o !== except) writeFrame(o.socket, buf);
}
function drop(c) {
  if (!clients.has(c.id)) return;
  clients.delete(c.id);
  try { c.socket.destroy(); } catch (e) {}
  if (c.p) broadcast({ t: "leave", id: c.id });
}

/* ---------- xử lý tin ---------- */
function clean(p) {
  // Chỉ giữ các trường game dùng, giới hạn độ dài
  if (!p || typeof p !== "object") return null;
  const num = v => (typeof v === "number" && isFinite(v) ? Math.max(-100, Math.min(100, v)) : 0);
  const str = (v, n) => (typeof v === "string" ? v.slice(0, n) : undefined);
  const out = { sv: str(p.sv, 20) || null };
  if (p.browsing) out.browsing = 1;
  if (out.sv) {
    Object.assign(out, { n: str(p.n, 24) || "Vong hồn", k: str(p.k, 10), g: str(p.g, 4), x: num(p.x), z: num(p.z), r: num(p.r), mv: p.mv ? 1 : 0, m: Math.max(0, Math.floor(+p.m || 0)) });
    if (Array.isArray(p.c)) out.c = p.c.slice(0, 3).map(v => str(v, 7));
    if (Array.isArray(p.a)) out.a = [str(p.a[0], 10), Math.floor(+p.a[1] || 0)];
    if (Array.isArray(p.s)) out.s = [str(p.s[0], 100), Math.floor(+p.s[1] || 0)];
  }
  return out;
}
function onMessage(c, text) {
  const now = Date.now();
  c.tokens = Math.min(RATE, c.tokens + (now - c.last) / 1000 * RATE); c.last = now;
  if (c.tokens < 1) return; c.tokens--;
  let m; try { m = JSON.parse(text); } catch (e) { return; }
  if (m.t === "hi" && typeof m.key === "string" && /^[0-9a-f]{16,64}$/.test(m.key)) {
    c.key = m.key;
    const mine = merits[c.key];
    send(c, { t: "me", m: mine ? mine.m : 0 });
    sendBoard(c);
  } else if (m.t === "p") {
    const p = clean(m.p); if (!p) return;
    c.p = p; broadcast({ t: "p", id: c.id, p }, c);
  } else if (m.t === "m" && c.key) {
    const old = merits[c.key] || { m: 0, n: "Vong hồn" };
    let v = Math.max(0, Math.floor(+m.m || 0));
    // chặn nhảy công đức vô lý: mỗi lần lưu tăng tối đa 400
    if (v > old.m + 400) v = old.m + 400;
    merits[c.key] = { m: v, n: (typeof m.n === "string" && m.n.trim().slice(0, 24)) || old.n, at: now };
    saveMerits(); broadcastBoard();
  }
}

// Giữ kết nối sống (nhiều nhà cung cấp cắt kết nối im lặng sau ~60 giây)
setInterval(() => {
  for (const c of clients.values()) {
    if (!c.alive) { drop(c); continue; }
    c.alive = false; writeFrame(c.socket, Buffer.alloc(0), 9);
  }
}, 25000);

server.listen(PORT, () => console.log(`Âm Phủ Online đang chạy ở http://localhost:${PORT}`));
