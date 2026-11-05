# Việc của Antigravity

File của bạn: `src/online/avatars-gen.js` và `phan-cong/kiem-thu.md`.

Mở cả thư mục `game 18 tầng` trong Antigravity, đọc `BANG-PHAN-CONG.md` trước, rồi dán đoạn dưới đây vào khung chat của Antigravity.

---

## Việc 4b: Nhân vật 3D bản đẹp

Codex đã có bản nhân vật trong `src/online/avatars.js`. Hãy đọc file đó để hiểu API, rồi viết bản **đẹp hơn** vào file mới `src/online/avatars-gen.js` (không sửa `avatars.js`). Khi có `avatars-gen.js`, lệnh `node build.js` tự dùng bản này thay cho bản của Codex.

Bắt buộc giữ đúng API (game gọi đúng các hàm này):

```js
window.makeAvatar = function (THREE, opts) { ... return { group, update(dt, moving, time), setColors(opts) }; };
// opts = { kind: "ghost" | "tourist" | "taoist" | "monk", gender: "nam" | "nu", skin, robe, hair }  (màu "#rrggbb")
window.makeNPC = function (THREE, type) { ... return { group, update(dt, time) }; };
// type = "ox" (Ngưu Đầu) | "horse" (Mã Diện) | "king" (Diêm Vương ngồi ngai, cao ~7) | "meng" (Mạnh Bà bưng bát canh)
window.__avatarSelfTest = function (THREE) { ... };  // tạo thử mỗi loại, trả về số mesh
```

- `group` có gốc ở chân (y = 0), người chơi cao khoảng 1.6, Ngưu Đầu và Mã Diện ~2.2, Mạnh Bà ~1.5. Mặt nhìn hướng **+Z**.
- JavaScript thuần, không `import`/`export`. three.js bản **r128** (không có `CapsuleGeometry`). Không dùng ảnh hay file tải ngoài, `CanvasTexture` vẽ bằng code thì được.

Hướng thẩm mỹ mong muốn:

- Chibi dễ thương: đầu to tròn, mắt to có điểm sáng, má hồng, viền mềm (dùng `SphereGeometry` nhiều phân đoạn, `flatShading: false` cho mặt, áo có thể low-poly).
- Mỗi dạng nhận ra ngay từ xa: hồn ma (tấm vải trắng xanh, lơ lửng, hơi trong suốt), tu sĩ (đầu trọc/mũ vải, áo tràng, chuỗi hạt), đạo sĩ (mũ đạo sĩ, bùa đỏ, phất trần), du khách (mũ rộng vành, balo, máy ảnh).
- Nam/nữ khác nhau rõ ở tóc và dáng.
- Chuyển động mượt: đi thì tay chân đung đưa, đầu nghiêng nhẹ; đứng yên thì thở, thỉnh thoảng chớp mắt.
- NPC uy nghi nhưng không đáng sợ: Diêm Vương mặt đỏ, râu đen, mũ miện có chuỗi hạt, ngai vàng; Ngưu Đầu, Mã Diện mặc giáp, cầm vũ khí; Mạnh Bà hiền, bát canh bốc khói.

Giới hạn để 10–15 người chơi cùng lúc vẫn mượt trên điện thoại:

- Người chơi: tối đa **35 mesh**, tổng tam giác dưới **3.000**.
- Dùng chung geometry và material giữa các nhân vật cùng loại khi được (tạo một lần, dùng lại).
- NPC: tối đa 60 mesh mỗi con.

Kiểm tra trước khi báo xong:

```bash
npm i --prefix _tmp three@0.128.0
node -e "globalThis.window=globalThis;globalThis.THREE=require('./_tmp/node_modules/three');require('./src/online/avatars-gen.js');console.log(__avatarSelfTest(THREE))"
node build.js
```

Xoá thư mục `_tmp` sau khi kiểm tra. Rồi mở `dist/am-phu-online.html` bằng trình duyệt, chọn cõi và đổi qua lại các dạng nhân vật để xem.

## Việc 9: Kiểm thử

Sau khi ghép, mở `dist/am-phu-online.html` và `dist/am-phu-travel.html` trên máy tính và giả lập điện thoại. Ghi lỗi vào `phan-cong/kiem-thu.md` theo mẫu:

```
- [ ] (mức: nặng/vừa/nhẹ) Mô tả lỗi · cách làm lại · trình duyệt/thiết bị
```

Khi mở file trực tiếp trên máy, phần nhiều người chơi và bảng công đức không chạy (chỉ chạy khi trang được xuất bản trên Claude). Game vẫn chơi một mình được, hãy kiểm thử phần đó.

Xong thì sửa trạng thái việc 4b và 9 trong `BANG-PHAN-CONG.md` và ghi nhật ký.

---

## Việc 13: Giao diện 3 trò chơi bàn (ĐÃ CHUYỂN SANG CODEX, không cần làm)

Dán đoạn này vào Antigravity:

> Đọc `phan-cong/tro-choi-hop-dong.md` (nhất là phần 2). Viết 3 file giao diện `src/games/ui-chess.js`, `src/games/ui-oanquan.js`, `src/games/ui-masoi.js` đăng ký vào `window.GAME_UI` đúng API `mount(el, api)` → `{update(view, actions), destroy()}`, đúng hình dạng `view` trong hợp đồng. Thêm `src/games/ui-demo.html` để tự thử với `view` giả. Phong cách giống trang chủ Địa Ngục Online (thẻ màu kem, viền vàng, chữ nâu đỏ, font Baloo 2, hoạt hình dễ thương). Chạy được trên điện thoại dọc 360px. Chỉ tạo/sửa các file `src/games/ui-*.js`, `src/games/ui-demo.html` và cập nhật `BANG-PHAN-CONG.md` (việc 13 sang Xong, ghi nhật ký).

Máy chủ và luật do Claude và Codex làm song song, bạn không cần đợi: cứ làm theo hợp đồng.

---

## Việc 25: Giao diện niệm Phật và tụng kinh (Chùa Niệm Phật)

Công viên Âm Phủ có thêm **Chùa Niệm Phật** (học theo niemphat.online). Người chơi vào chùa, ngồi lên bồ đoàn, lúc đó game mở **giao diện niệm Phật** của bạn ở nửa dưới màn hình (phía trên vẫn thấy chùa 3D và các vong hồn khác đang niệm). Codex làm hình chùa 3D, Claude làm máy chủ và ghép vào game. Bạn chỉ làm phần giao diện HTML/CSS/JS này.

File của bạn: **`src/online/chant-ui.js`** (mới) và **`src/online/chant-demo.html`** (trang thử, mở thẳng bằng trình duyệt). Không sửa file khác. JavaScript thuần, không `import`/`export`, không thư viện, không ảnh/font/âm thanh tải ngoài (vẽ bằng CSS/SVG/canvas). CSS tự chèn bằng JS, mọi class bắt đầu bằng `cu-` để không đụng CSS của game.

### API (game gọi đúng như sau)

```js
window.ChantUI = {
  mount(host, opts) {
    // host: một <div> game đưa (phủ toàn màn hình, pointer-events: none; phần giao diện của bạn tự bật pointer-events: auto)
    // opts = {
    //   name: "Kẻ gõ A",                  // tên người chơi
    //   onChant(kind),                     // gọi MỖI câu: kind "niem" (bấm niệm 1 câu) | "tung" (tụng xong 1 câu kinh)
    //   onLeave(),                         // người chơi bấm "Đứng dậy" hoặc Esc
    //   sound(kind)                        // game phát tiếng: "mo" (mõ), "chuong" (chuông), "khanh" (khánh nhỏ)
    // }
    return {
      setStats({ mine, today, room, chanters }), // mine: số câu lượt này; today: số câu hôm nay của mình; room: tổng cả chùa hôm nay; chanters: số người đang niệm
      setTop([{ name, c }]),                     // top người niệm nhiều nhất hôm nay (tối đa 5)
      remote(name),                              // một người khác vừa niệm: hiện dòng nhẹ "… đang niệm" (gộp, không spam)
      unmount()                                  // gỡ sạch DOM + listener
    };
  }
};
```

### Giao diện

- **Nút niệm lớn tròn** "Nam mô A Di Đà Phật": bấm/chạm, hoặc phím **Space**/**Enter**, mỗi lần là 1 câu: gọi `opts.sound("mo")` và `opts.onChant("niem")`, chữ "Nam mô A Di Đà Phật" bay lên mờ dần. Giới hạn tối đa ~6 câu/giây (bấm nhanh hơn thì bỏ qua).
- **Tràng hạt 108 hạt** (SVG hoặc canvas): vòng hạt gỗ, hạt hiện tại sáng lên và tràng hạt xoay một nấc mỗi câu, hạt "mẫu" to hơn ở đầu tràng. Đủ 108 câu: `sound("chuong")`, hiệu ứng hào quang nhẹ, dòng "Viên mãn 1 tràng · +3 công đức" (game tự cộng công đức, bạn chỉ hiện chữ).
- Bộ đếm: "Lượt này: 37 câu · Hôm nay: 324 câu (3 tràng)".
- Khung nhỏ **Cả chùa**: "Hôm nay cả chùa: 12.345 câu · 4 người đang niệm" + top 5 từ `setTop`.
- Hai thẻ: **Niệm Phật** | **Tụng kinh**.
  - **Tụng kinh**: hiện **Bát Nhã Ba La Mật Đa Tâm Kinh** bản phiên âm **Hán-Việt** cổ (văn bản cổ, ví dụ mở đầu "Quán Tự Tại Bồ Tát, hành thâm Bát Nhã Ba La Mật Đa thời…", kết "…Yết đế yết đế, ba la yết đế, ba la tăng yết đế, Bồ đề tát bà ha"). Bấm "Bắt đầu tụng": mõ tự gõ đều (~1 tiếng mỗi 0,7 giây, có nút chậm/vừa/nhanh), mỗi tiếng mõ tô sáng **một chữ** (kiểu karaoke), tự cuộn; hết một câu (dấu phẩy/chấm) gọi `onChant("tung")`. Có nút tạm dừng. Tụng xong cả bài: `sound("chuong")` và lời hồi hướng ngắn.
- Nút **"Đứng dậy"** (và Esc) → `onLeave()`.
- Phong cách: trang nghiêm, ấm: nền kem/giấy dó, viền vàng đồng, chữ nâu son, nút niệm màu vàng nghệ như áo cà sa. Hợp với các thẻ kem `.card` của game (bo tròn 16px, viền vàng #e8b765).
- **Điện thoại**: tối đa **42% chiều cao** màn 375×812, không tràn ngang; màn ngang (thấp ≤ 500px) thì đặt sang bên phải, rộng ≤ 46%. Nút niệm ≥ 88px. Tôn trọng `prefers-reduced-motion`.

### Trang thử `chant-demo.html`

Mở thẳng bằng trình duyệt (file://): nền tối giả lập game, nạp `chant-ui.js`, gọi `mount` với `sound` tự phát tiếng bằng WebAudio đơn giản, giả lập `setStats`/`setTop`/`remote` tăng dần mỗi vài giây, có nút unmount/mount lại để kiểm tra gỡ sạch.

Xong thì ghi một dòng vào cuối `phan-cong/BANG-PHAN-CONG.md` (phần nhật ký) và đổi trạng thái việc 25 sang Xong.
