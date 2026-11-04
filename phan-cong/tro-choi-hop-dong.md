# Hợp đồng chung: Trò chơi bàn (Cờ vua, Ô ăn quan, Ma Sói)

Ba bên làm song song, nối với nhau đúng theo file này. Muốn đổi gì trong hợp đồng thì ghi vào **Yêu cầu qua lại** của `BANG-PHAN-CONG.md`, đừng tự đổi.

```
Người chơi (trình duyệt, trang /tro-choi)
   │  WebSocket /ws  (Claude: server.js + src/games/hub.template.html)
   ▼
server.js  ── giữ phòng, ghép cặp, hẹn giờ ── gọi luật ──►  src/games/rules-*.js   (Codex)
   │  gửi view + actions cho từng người
   ▼
src/games/ui-*.js  (Antigravity)  vẽ bàn, bấm nước đi → api.act(action)
```

- **Luật chạy trên máy chủ** (Node). Trình duyệt không cần file luật: máy chủ gửi sẵn danh sách nước đi hợp lệ.
- Người chơi là chuỗi `id` (ví dụ `"p1a2b3c"`), kèm tên `n`.
- Mọi chữ hiển thị là tiếng Việt, giọng hài hước nhẹ, hợp chủ đề địa ngục.

---

## 1. Module luật (Codex): `src/games/rules-chess.js`, `rules-oanquan.js`, `rules-masoi.js`

Mỗi file là JavaScript thuần, chạy được cả Node (`module.exports`) lẫn trình duyệt (`window.GAME_RULES[id]`), không `import`, không thư viện ngoài:

```js
(function (root, factory) {
  const mod = factory();
  if (typeof module === "object" && module.exports) module.exports = mod;
  else (root.GAME_RULES = root.GAME_RULES || {})[mod.id] = mod;
})(typeof self !== "undefined" ? self : this, function () {
  return { id, name, minPlayers, maxPlayers, setup, view, actions, apply, tick, result, bot, chatChannel, selfTest };
});
```

| Hàm | Ý nghĩa |
|---|---|
| `id` | `"chess"` / `"oanquan"` / `"masoi"` |
| `name` | tên hiển thị: `"Cờ vua"`, `"Ô ăn quan"`, `"Ma Sói"` |
| `minPlayers`, `maxPlayers` | Cờ vua 2–2, Ô ăn quan 2–2, Ma Sói 5–12 |
| `setup(players, opts)` → `state` | `players = [{id, n}]` theo thứ tự ngồi; `opts = {seed, now}` (seed là số nguyên, dùng để xáo ngẫu nhiên cố định, ví dụ chia vai Ma Sói, ai cầm trắng). Không dùng `Math.random` trong luật. |
| `view(state, playerId)` → object | Thứ người đó **được phép thấy**. `playerId = null` là người xem. Không lộ bí mật (vai Ma Sói của người khác). Kết quả phải `JSON.stringify` được. |
| `actions(state, playerId)` → `[action]` | Các nước hợp lệ **ngay lúc này** của người đó (mảng rỗng nếu không tới lượt). Mỗi action có thêm `label` tiếng Việt ngắn để giao diện dự phòng hiện thành nút. |
| `apply(state, playerId, action, now)` → `{ state, error? }` | Kiểm tra hợp lệ (đừng tin trình duyệt). Sai thì trả `error` (tiếng Việt) và giữ nguyên state. Không sửa trực tiếp state cũ (trả state mới hoặc bản sao). Bỏ qua trường `label`. |
| `tick(state, now)` → `state` | Gọi mỗi giây. Dùng cho pha có hẹn giờ (Ma Sói). Trò không cần thì trả nguyên state. |
| `result(state)` → `null` hoặc `{ winners: [id], draw?: true, reason }` | `null` khi chưa xong. |
| `bot(state, playerId)` → `action` hoặc `null` | Máy chơi thay người. Cờ vua và Ô ăn quan bắt buộc có (đủ để chơi vui: ưu tiên ăn quân, chiếu hết nếu có). Ma Sói trả `null` cũng được. |
| `chatChannel(state, playerId)` → `"all"` / `"wolves"` / `null` | Người đó đang được chat ở kênh nào. Cờ vua, Ô ăn quan luôn `"all"`. |
| `selfTest()` → `{ ok: boolean, passed: number, failed: [string] }` | Tự kiểm tra luật, chạy bằng `node -e "console.log(require('./src/games/rules-chess.js').selfTest())"` |

Mọi action đều có `type`. Mọi trò đều nhận `{type: "resign", label: "Đầu hàng"}` (Ma Sói thì không).

### 1a. Cờ vua `chess`

- Luật đầy đủ: nhập thành, bắt tốt qua đường, phong cấp (chọn q/r/b/n), chiếu, chiếu hết, hết nước đi (hòa), hòa khi không đủ quân chiếu hết, hòa 50 nước.
- Người thứ nhất trong `players` cầm trắng nếu `seed` chẵn, đen nếu lẻ.
- Action: `{ type: "move", from: "e2", to: "e4", promo?: "q"|"r"|"b"|"n" }`. Nước phong cấp được liệt kê 4 lần (mỗi quân một lần).
- `view`:
```js
{
  board: [64 chuỗi],          // chỉ số 0 = a8, 7 = h8, 56 = a1, 63 = h1. Ô trống "", quân "wK","wQ","wR","wB","wN","wP","bK",...
  turn: "w" | "b",
  you: "w" | "b" | null,       // màu của người xem
  players: { w: {id, n}, b: {id, n} },
  check: boolean,              // bên đang tới lượt có bị chiếu không
  last: { from: "e2", to: "e4" } | null,
  captured: { w: ["bP", ...], b: ["wN", ...] },  // quân mà bên đó đã ăn
  moves: ["e4", "e5", "Nf3"], // lịch sử ký hiệu SAN
  over: null | { winners, draw, reason }
}
```

### 1b. Ô ăn quan `oanquan`

- Bàn 12 ô theo vòng: ô 0 và ô 6 là **ô quan** (mỗi ô 1 quan, 1 quan = 10 điểm, mặc định không có dân); ô 1–5 là của người ngồi 0, ô 7–11 của người ngồi 1; mỗi ô dân có 5 dân (1 dân = 1 điểm).
- Luật phổ biến:
  - Tới lượt, chọn một ô dân **bên mình** còn quân, chọn chiều rải `dir` (`1` là chỉ số tăng, `-1` là giảm, vòng quanh 12 ô), bốc hết rồi rải mỗi ô một viên (rải qua cả ô quan).
  - Rải xong, nhìn ô kế tiếp theo chiều đó:
    - nếu là ô dân còn quân thì bốc ô đó rải tiếp;
    - nếu trống và ô sau nữa có quân thì **ăn** ô sau nữa (cả quan lẫn dân), rồi xét tiếp: nếu ô kế tiếp lại trống và ô sau có quân thì ăn tiếp (ăn liên hoàn);
    - nếu gặp ô quan (còn quân) để bốc, hoặc hai ô trống liền thì hết lượt.
  - Tới lượt mà 5 ô bên mình trống hết: tự động lấy 5 dân từ số đã ăn rải lại mỗi ô 1 viên. Không đủ thì vay của đối thủ, cuối ván trả lại.
  - Hết ván khi cả hai ô quan đã bị ăn sạch: dân còn trên bàn bên ai thuộc người đó. Điểm cao hơn thắng; bằng nhau thì hòa.
  - Bỏ luật "quan non": ô quan còn ít dân vẫn được ăn bình thường.
- Action: `{ type: "sow", cell: 1..5 hoặc 7..11, dir: 1 | -1 }`.
- `view`:
```js
{
  cells: [ { dan: number, quan: 0 | 1 } × 12 ],
  seats: [ {id, n}, {id, n} ],     // người ngồi 0 giữ ô 1–5, người ngồi 1 giữ ô 7–11
  you: 0 | 1 | null,
  turn: 0 | 1,
  score: [ { dan, quan, points }, { dan, quan, points } ],   // đã ăn được
  debt: [number, number],          // dân đang nợ đối thủ (do vay)
  last: null | { seat, cell, dir, steps: [ { cell, kind: "pick" | "drop" | "capture" | "refill" } ] },  // để giao diện chạy hoạt ảnh từng bước
  over: null | { winners, draw, reason }
}
```

### 1c. Ma Sói `masoi`

- 5–12 người. Vai:
  - **Ma Sói**: 1 con khi có 5–7 người, 2 con khi 8–10 người, 3 con khi 11–12 người.
  - **Tiên Tri**: 1, đêm soi một người, biết người đó là sói hay dân.
  - **Bảo Vệ**: 1, đêm che một người, không được che cùng một người hai đêm liền, được tự che mình.
  - **Dân Làng**: phần còn lại.
- Vòng chơi:
  - `night` (40 giây): các vai đêm hành động. Sói bàn nhau qua kênh chat `"wolves"`; mục tiêu là người được nhiều sói chọn nhất, hòa thì lấy người được chọn trước. Hết giờ hoặc mọi vai đêm đã chọn xong thì sang ngày.
  - `day` (90 giây): công bố ai chết đêm qua (hoặc "đêm qua bình yên"). Mọi người còn sống chat kênh `"all"`. Ai cũng có thể bấm `{type:"ready"}` để rút ngắn; đủ quá nửa người sống bấm thì sang `vote`.
  - `vote` (30 giây): mỗi người sống bỏ phiếu treo cổ một người hoặc `skip`. Phiếu cao nhất và hơn hẳn mọi người khác thì người đó bị treo, lộ vai. Hòa hoặc không ai thì không treo. Xong thì lại `night`.
- Kết thúc: hết sói thì Dân thắng; số sói ≥ số người còn lại thì Sói thắng.
- Người chết vẫn xem được nhưng không chat, không hành động. Hết ván lộ hết vai.
- Action: `{ type: "kill" | "see" | "guard" | "vote", target: id }`, `{ type: "skip" }` (khi vote), `{ type: "ready" }` (khi day).
- `view`:
```js
{
  phase: "night" | "day" | "vote" | "end",
  day: number,                    // đếm từ 1
  deadline: number,               // mốc thời gian (ms, cùng gốc với `now`) hết pha
  you: { id, role: "wolf" | "seer" | "guard" | "villager" | null, alive: boolean } | null,
  players: [ { id, n, alive, role?: string } ],   // role chỉ có khi: là chính mình, đồng đội sói, người đã chết, hoặc ván đã hết
  roleCount: { wolf, seer, guard, villager },
  log: [ string ],                // dòng thông báo công khai: "Đêm 1: ... bị sói tha đi", "Làng treo cổ ... (Dân Làng)"
  votes: { [voterId]: targetId | "skip" },   // công khai trong pha vote
  myPick: id | null,              // lựa chọn đêm nay của chính mình
  wolfPicks: { [wolfId]: targetId } | undefined, // chỉ sói thấy
  seen: { [id]: "wolf" | "village" } | undefined, // chỉ tiên tri thấy
  over: null | { winners, reason, team: "wolf" | "village" }
}
```

---

## 2. Giao diện (Antigravity): `src/games/ui-chess.js`, `ui-oanquan.js`, `ui-masoi.js`

Mỗi file JavaScript thuần, đăng ký vào `window.GAME_UI`:

```js
(window.GAME_UI = window.GAME_UI || {}).chess = {
  mount(el, api) {
    // el: thẻ <div> trống để vẽ vào (rộng tối đa ~720px, trên điện thoại ~360px)
    // api.act(action)  gửi nước đi lên máy chủ (bỏ "label" cũng được)
    // api.me           id của mình
    // api.sfx(name)    phát âm thanh có sẵn: "move", "capture", "win", "lose", "tick"
    return {
      update(view, actions) { /* vẽ lại theo view; actions là nước hợp lệ hiện tại của mình */ },
      destroy() { /* gỡ sự kiện */ }
    };
  }
};
```

- Không tự mở kết nối mạng, không đọc `localStorage`. Chỉ dùng `view` và `actions`.
- CSS: tự chèn một thẻ `<style>` có tiền tố riêng (`.gui-chess ...`) để không phá trang. Dùng màu của trang chủ: kem `#fdebc8`/`#f6d49a`, viền `#e8b765`, nâu đỏ `#6a1414`, đỏ `#d63a1f`, vàng `#f7c24a`, font `"Baloo 2"`.
- Không dùng ảnh hay font tải ngoài: vẽ bằng SVG/CSS/Canvas. Quân cờ có thể dùng ký tự Unicode (♔♕♖♗♘♙) hoặc SVG tự vẽ.
- Chạy được bằng cả chuột và chạm. Trên điện thoại dọc 360px phải chơi được không phải cuộn ngang.
- Gợi ý từng trò:
  - **Cờ vua**: bấm quân, sáng các ô đi được (lấy từ `actions`), bấm ô đích; phong cấp hiện bảng chọn 4 quân; xoay bàn theo `view.you`; đánh dấu nước vừa đi và vua bị chiếu.
  - **Ô ăn quan**: bàn hình chữ nhật 2 hàng 5 ô, hai đầu là 2 ô quan hình bán nguyệt, dân là hạt sỏi, quan là viên to; bấm ô bên mình rồi chọn mũi tên trái/phải; chạy hoạt ảnh rải theo `view.last.steps`.
  - **Ma Sói**: vòng tròn các lá bài người chơi, đồng hồ đếm ngược theo `deadline`, nền đêm/ngày đổi màu, bấm vào người để chọn hành động; lá bài lật khi lộ vai.
- Kiểm thử không cần máy chủ: mở `src/games/ui-demo.html` (Antigravity tự viết, chỉ dùng để thử) với `view` giả lập.

---

## 3. Máy chủ và trang trò chơi (Claude)

- Trang `/tro-choi` (`src/games/hub.template.html`): chọn trò, rồi chọn cách chơi:
  - **Ghép ngẫu nhiên**: vào hàng chờ, đủ người là vào bàn.
  - **Tạo phòng riêng**: có mã 4 chữ, gửi bạn bè nhập mã để vào.
  - **Chơi với máy** (Cờ vua, Ô ăn quan).
- Nếu chưa có `ui-*.js` của trò nào, trang tự dùng giao diện dự phòng (hiện `actions` thành nút).
- `build.js` nhúng các `ui-*.js` vào trang `/tro-choi`. File luật không nhúng vào trang, chỉ máy chủ dùng.
- Tin nhắn WebSocket (cho ai tò mò):
  - Trình duyệt gửi: `g.queue {game, mode}`, `g.create {game}`, `g.join {code}`, `g.start`, `g.act {action}`, `g.chat {text}`, `g.leave`.
  - Máy chủ gửi: `g.room`, `g.state {view, actions, result}`, `g.chat`, `g.err`.
