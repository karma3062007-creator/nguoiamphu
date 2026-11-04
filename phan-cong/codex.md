# Việc của Codex

File của bạn: `src/online/avatars.js` (và `src/shared/levels.json` nếu cần sửa nội dung).

## Việc 4: Nhân vật 3D và NPC

Viết `src/online/avatars.js` bằng JavaScript thuần (không `import`/`export`), chạy sau khi three.js r128 đã nạp (`THREE` là biến toàn cục). Không dùng `CapsuleGeometry` (r128 chưa có). Phong cách low-poly chibi, `MeshStandardMaterial` với `flatShading: true`.

### `window.makeAvatar(THREE, opts)` → `{ group, update(dt, moving, time), setColors(opts) }`

- `opts = { kind: "ghost" | "tourist" | "taoist" | "monk", gender: "nam" | "nu", skin, robe, hair }` (màu dạng `"#rrggbb"`).
- Gốc ở chân (y = 0), cao khoảng 1.6, mặt nhìn hướng +Z, đầu to cỡ 40% chiều cao.
- `ghost`: tấm vải trắng hơi xanh, đuôi nhọn, lơ lửng, hơi trong suốt.
- `tourist`: mũ rộng vành, balo, áo màu `robe`.
- `taoist`: áo dài màu `robe`, bùa đỏ trước ngực, mũ đạo sĩ.
- `monk`: đầu trọc (nữ đội mũ vải), áo tràng màu `robe`, chuỗi hạt vàng.
- Nữ có tóc dài hoặc búi màu `hair` (trừ ghost và monk nam).
- `update`: đi thì tay chân đung đưa, đứng thì thở nhẹ. Tối đa khoảng 40 mesh.

### `window.makeNPC(THREE, type)` → `{ group, update(dt, time) }`

- `"ox"` Ngưu Đầu (cao ~2.2, đầu trâu có sừng, giáp đỏ sẫm, đinh ba)
- `"horse"` Mã Diện (cao ~2.2, đầu ngựa bờm đen, giáp xanh đen, giáo)
- `"king"` Diêm Vương ngồi ngai (cao ~7 kể cả ngai, mặt đỏ, râu đen, mũ miện có chuỗi hạt, áo bào đỏ viền vàng, bút phán quan)
- `"meng"` Mạnh Bà (cao ~1.5, tóc trắng búi, áo tím, bưng bát canh có khói)

### Kiểm tra trước khi báo xong

```bash
node -e "globalThis.window=globalThis;globalThis.THREE=require('three');require('./src/online/avatars.js');console.log(__avatarSelfTest(THREE))"
```

(cần `npm i three@0.128.0` trong thư mục tạm, không cài vào dự án)

Xong thì sửa trạng thái việc 4 trong `BANG-PHAN-CONG.md` thành `Xong` và ghi một dòng nhật ký.

## Việc 8: Cảnh trang trí thêm

Tạo file `src/online/extras.js` (JavaScript thuần, không `import`/`export`). Game tự gọi hàm sau khi dựng xong thế giới:

```js
window.buildExtras = function (THREE, scene, h) {
  // h.M(color, opts)                  -> MeshStandardMaterial low-poly
  // h.mesh(geo, mat, x, y, z, parent) -> tạo Mesh, thêm vào parent (mặc định scene)
  // h.box(w, h, d, mat, x, y, z, parent)
  // h.labelTex(text)                  -> CanvasTexture bảng chữ vàng nền đỏ
  // h.textSprite(text, opts)          -> Sprite chữ
  // h.solids                          -> mảng {x, z, r}: push vào để người chơi không đi xuyên
  return function update(dt, time) {};  // có thể bỏ
};
```

Bản đồ (mặt đất y = 0):

- Người chơi xuất hiện quanh `(0, 0, 13)`, nhìn về phía -Z.
- Sân đá tròn tâm `(0, 0, 4)`, bán kính 17. Vùng đi được: bán kính 31 quanh `(0, 2)`.
- Đỉnh hương `(0, 2)`, mõ `(-7.5, 0)`, chuông `(7.5, -1)`, lò vàng mã `(-6.5, 9)`, bến thả đèn `(7, -8.6)`.
- Sông Huyết Hà nằm ngang, z từ -14.5 đến -9.5. Cầu Nại Hà ở x từ -2 đến 2.
- Điện Diêm La: tâm `(0, -25)`, rộng 26, sâu 15, cột ở x = ±6, ±11 và z = -31, -19.
- 18 bia tầng xếp hình cung bán kính 24 quanh `(0, 4)`.

Cần làm:

1. **Quỷ Môn Quan**: cổng tam quan đen đỏ sau điểm xuất phát, khoảng `(0, 0, 20)`, bảng chữ "QUỶ MÔN QUAN". Chừa lối đi ở giữa rộng ít nhất 4.
2. **Vọng Hương Đài**: đài cao có bậc thang ở `(-18, 0, -4)`, đỉnh có đèn lồng đỏ.
3. **Rừng cây đao**: 8–12 cây thân đen, lá là lưỡi dao kim loại, đặt ngoài vùng đi được (bán kính > 32).
4. **Xích sắt và đèn lồng**: xích treo giữa các cột Điện Diêm La, đèn lồng đỏ đung đưa trong `update`.
5. Thêm vào `h.solids` những vật nằm trong vùng đi được.
6. Tổng không quá ~300 mesh. Dùng chung geometry/material.

Kiểm tra: `node build.js` phải báo ghép xong, không lỗi cú pháp. Xong thì cập nhật việc 8 trong bảng.

## Việc 12: Luật 3 trò chơi bàn (Cờ vua, Ô ăn quan, Ma Sói)

Đọc kỹ `phan-cong/tro-choi-hop-dong.md` phần 1. Viết 3 file:

- `src/games/rules-chess.js`
- `src/games/rules-oanquan.js`
- `src/games/rules-masoi.js`

Đúng API trong hợp đồng (`setup`, `view`, `actions`, `apply`, `tick`, `result`, `bot`, `chatChannel`, `selfTest`), đúng hình dạng `view`. Chỉ tạo/sửa 3 file này (và cập nhật `BANG-PHAN-CONG.md`).

`selfTest()` cần thử ít nhất:

- Cờ vua: số nước đi hợp lệ ở thế đầu = 20; perft độ sâu 3 từ thế đầu = 8902; chiếu hết kiểu "Fool's mate"; nhập thành; bắt tốt qua đường; phong cấp; hòa hết nước đi.
- Ô ăn quan: ván mới tổng 50 dân + 2 quan; rải đúng; ăn liên hoàn; hết quân bên mình thì rải lại; ván kết thúc tính điểm đúng; 2 bot đánh với nhau 200 ván không lỗi, tổng quân luôn bảo toàn.
- Ma Sói: chia vai đúng số lượng với 5, 8, 12 người; `view` không lộ vai người khác; bảo vệ che đúng người bị cắn thì không ai chết; vote treo cổ; điều kiện thắng hai phe; pha tự chuyển khi hết giờ qua `tick`.

Xong thì sửa trạng thái việc 12 trong `BANG-PHAN-CONG.md` thành `Xong` (hoặc `Cần sửa` nếu chưa chạy được kiểm tra) và ghi một dòng nhật ký nêu kết quả `selfTest`.

## Việc 13: Giao diện 3 trò chơi bàn (chuyển từ Antigravity sang)

Đọc `phan-cong/tro-choi-hop-dong.md` phần 2. Viết 3 file:

- `src/games/ui-chess.js`
- `src/games/ui-oanquan.js`
- `src/games/ui-masoi.js`

Mỗi file đăng ký `window.GAME_UI[id] = { mount(el, api) → { update(view, actions), destroy() } }`, đọc đúng hình dạng `view` trong hợp đồng phần 1 (chính là `view()` trong `rules-*.js` bạn đã viết). Thêm `src/games/ui-demo.html` để tự thử: nạp `rules-*.js` + `ui-*.js` qua thẻ `<script src>`, tự chơi 2 bên bằng `GAME_RULES` (không cần máy chủ).

Yêu cầu:

- Phong cách trang chủ Địa Ngục Online: thẻ kem `#fdebc8`/`#f6d49a`, viền `#e8b765`, nâu đỏ `#6a1414`, đỏ `#d63a1f`, vàng `#f7c24a`, font `"Baloo 2"` (trang đã nạp sẵn). Dễ thương, hoạt hình nhẹ.
- CSS tự chèn một thẻ `<style>` với tiền tố riêng (`.gui-chess`, `.gui-oq`, `.gui-ms`). Không ảnh/font ngoài; vẽ bằng SVG/CSS.
- Chạy bằng chuột và chạm; điện thoại dọc 360px chơi được không cuộn ngang (bàn co theo bề rộng `el`).
- Không tự mở mạng, không đọc `localStorage`. Nút "Đầu hàng" trang ngoài đã có, không cần vẽ.
- **Cờ vua**: bàn 8×8 (ô sáng `#f6d49a`, ô tối `#b5653a` hoặc tương tự), quân là SVG tự vẽ hoặc ký tự ♔♕♖♗♘♙/♚♛♜♝♞♟ cỡ lớn có viền để thấy rõ trên cả hai màu ô; xoay bàn theo `view.you` (đen ở dưới nếu mình cầm đen); bấm quân → sáng ô đi được (lọc từ `actions`), bấm ô đích → `api.act(action)`; phong cấp hiện bảng chọn 4 quân; tô nước vừa đi (`view.last`) và vua đang bị chiếu; dòng trạng thái "Lượt của bạn / Đối thủ đang nghĩ…"; hai dải quân đã ăn; danh sách nước đi `view.moves` gọn.
- **Ô ăn quan**: bàn 2 hàng × 5 ô, hai đầu 2 ô quan hình bán nguyệt; dân là hạt sỏi tròn nhỏ (vẽ tối đa ~12 hạt rồi hiện số), quan là viên to; hàng của mình luôn ở dưới (nếu `view.you === 1` thì đảo hiển thị); bấm ô bên mình → hiện 2 mũi tên trái/phải để chọn `dir` (nhớ quy đổi đúng chiều khi bàn bị đảo) → `api.act`; chạy hoạt ảnh lần lượt theo `view.last.steps` (~180ms mỗi bước, gọi `api.sfx("move")`, ăn thì `api.sfx("capture")`); bảng điểm hai bên, nợ dân nếu có.
- **Ma Sói**: các lá bài người chơi xếp lưới/vòng (tên, còn sống/đã chết, vai nếu được thấy); thẻ vai của mình to ở trên kèm mô tả ngắn vai làm gì; đồng hồ đếm ngược theo `view.deadline` (tự chạy mỗi giây); nền đổi đêm (xanh tím đậm, trăng) / ngày (vàng cam); bấm lá bài để chọn mục tiêu khi có action tương ứng (`kill`/`see`/`guard`/`vote`), nút "Bỏ qua" (`skip`) và "Sẵn sàng" (`ready`) khi có; hiện `myPick`, `wolfPicks` cho sói, `seen` cho tiên tri, phiếu bầu `votes`; khung `log` các thông báo; hết ván lật hết bài.

Xong thì sửa trạng thái việc 13 trong `BANG-PHAN-CONG.md` và ghi nhật ký. Claude sẽ ghép và thử trên trình duyệt.

## Việc 15: Hình nhân vật sau khi đầu thai (người, 12 con giáp, tiên)

Khi người chơi đủ công đức và uống canh Mạnh Bà, game quay ngẫu nhiên một kiếp mới. Viết file mới `src/online/reborn.js` (JavaScript thuần, không `import`/`export`, three.js **r128**, không `CapsuleGeometry`, không ảnh ngoài; `CanvasTexture` vẽ bằng code thì được). `build.js` tự nhúng file này sau `avatars-gen.js`.

```js
window.makeRebornAvatar = function (THREE, opts) { ... return { group, update(dt, moving, time), setColors(opts) }; };
// opts = { form, gender: "nam"|"nu", skin, robe, hair }   (màu "#rrggbb"; robe dùng làm màu điểm nhấn: áo, yếm, khăn, dải lụa)
window.__rebornSelfTest = function (THREE) { ... };   // tạo thử mọi form × 2 giới tính, trả { ok, rows: [{form, meshes, tris}] }
```

`form` là một trong 14 mã:

| Mã | Kiếp | Gợi ý hình |
|---|---|---|
| `nguoi` | Người | Thanh niên Việt hiện đại: áo phông màu `robe`, quần jean, giày thể thao; nữ tóc dài màu `hair`, nam tóc ngắn. Mặt chibi giống phong cách `avatars-gen.js`. |
| `ty` | Chuột (Tý) | xám, tai tròn to, đuôi dài mảnh, răng cửa |
| `suu` | Trâu (Sửu) | nâu đen, sừng cong, mũi to có khoen |
| `dan` | Hổ (Dần) | cam sọc đen, chữ "王" trên trán (vẽ bằng khối mảnh), đuôi sọc |
| `mao` | Mèo (Mão, Việt Nam dùng mèo thay thỏ) | mèo tam thể, tai nhọn, ria |
| `thin` | Rồng (Thìn) | xanh lục, sừng, râu dài, vây lưng, đuôi |
| `ti` | Rắn (Tỵ) | không chân: thân cuộn vòng, đầu ngẩng cao, lưỡi chẻ đỏ |
| `ngo` | Ngựa (Ngọ) | nâu, bờm đen, mõm dài |
| `mui` | Dê (Mùi) | trắng kem, sừng xoắn, chòm râu |
| `than` | Khỉ (Thân) | nâu, mặt và tai hồng, đuôi cong |
| `dau` | Gà (Dậu) | mào đỏ, mỏ vàng, cánh, đuôi lông nhiều màu |
| `tuat` | Chó (Tuất) | vàng, tai cụp, lưỡi thè |
| `hoi` | Lợn (Hợi) | hồng, mũi tròn to, tai lật, đuôi xoắn |
| `tien` | Tiên | nữ: tiên nữ; nam: tiên ông râu bạc. Áo trắng ánh vàng bay bay, dải lụa màu `robe` uốn lượn, vầng hào quang vàng sau đầu (xoay chậm), đứng trên một đám mây nhỏ lơ lửng, vài đốm sáng bay quanh. |

Yêu cầu chung:

- 12 con giáp theo kiểu **linh vật chibi đứng hai chân** (trừ rắn): đầu to, mắt to có điểm sáng, má hồng, dễ thương, nhận ra ngay từ xa. Mỗi con đeo một **yếm hoặc khăn quàng màu `robe`** để người chơi vẫn đổi màu được. `skin` có thể bỏ qua với con giáp.
- Gốc ở chân (y = 0), mặt nhìn hướng **+Z**. Cao: người và tiên ~1.6 (tiên tính cả mây); con giáp 1.2–1.5.
- `update(dt, moving, time)`: đi thì vung tay chân (rắn thì uốn thân, tiên lướt nhẹ không bước), đứng thì thở, chớp mắt; đuôi, tai, dải lụa, hào quang có chuyển động nhỏ.
- Tối đa **35 mesh** và **3.000 tam giác** mỗi nhân vật. Dùng chung geometry và material giữa các lần tạo (cache theo màu) để điện thoại chạy nổi 15 người.
- `form` lạ hoặc thiếu thì trả về hình `nguoi`.

Chỉ tạo/sửa `src/online/reborn.js` và `BANG-PHAN-CONG.md` (việc 15). Claude sẽ chạy self-test trong trình duyệt với three r128 và ghép vào game.

## Việc 17: Phòng thờ (cảnh mở đầu) và quầy đồ ăn tích phước

Tạo file mới `src/online/scenes.js` (JavaScript thuần, three.js **r128**, không `import`/`export`, không ảnh ngoài; `CanvasTexture` vẽ chữ bằng code thì được). `build.js` tự nhúng file này. **Không sửa `BANG-PHAN-CONG.md`** trong việc này (một phiên Codex khác đang sửa nó), Claude sẽ cập nhật giúp.

### 1. `window.makeAltarRoom(THREE)` → `{ group, update(dt, time), seat, cam }`

Cảnh mở đầu: vong hồn mới chết ngồi trên bàn thờ nhà mình, nhìn con cháu khấn vái, rồi mới xuống âm phủ.

- Phòng khách nhà Việt, ấm cúng, ánh sáng ban ngày vàng nhẹ (phòng tự mang đèn: `PointLight`/`HemisphereLight` đặt trong `group`, vì cảnh chính là địa ngục tối đỏ). Khoảng 8 × 8 m, có sàn gạch, tường sau, cửa sổ sáng, hai bên tường thấp để camera nhìn vào.
- Tường sau (phía −Z) có **bàn thờ** gỗ đỏ son viền vàng: khung ảnh thờ (ảnh vẽ bằng CanvasTexture một gương mặt chibi đơn giản, viền đen, dải băng đen), bát hương có 3 nén nhang cháy đỏ đầu và **khói bay lên** (vài mảnh mờ bay lên rồi tan, lặp lại), mâm ngũ quả, hai đèn dầu hoặc nến lung linh, bình hoa cúc vàng, câu đối đỏ hai bên.
- **Con cháu**: 3–4 người quỳ trước bàn thờ, quay mặt về phía bàn thờ (−Z), cầm nhang và **vái lạy** liên tục lệch nhịp nhau (gập người xuống rồi lên). Kiểu chibi giống `avatars-gen.js`, nhiều lứa tuổi (bố, mẹ, con nhỏ…). Có thể dùng `window.makeAvatar(THREE, {kind:"tourist", ...})` nếu có, nhưng cần tư thế quỳ, nên tự dựng chibi riêng cũng được.
- `seat`: `THREE.Vector3` toạ độ (trong `group`) chỗ vong hồn ngồi: **trên mặt bàn thờ**, cạnh bát hương, nhìn ra phía +Z (về phía con cháu).
- `cam`: `{ pos: THREE.Vector3, look: THREE.Vector3 }` góc máy đẹp: hơi cao, chếch sau lưng con cháu, thấy cả bàn thờ, vong hồn và con cháu.
- `update(dt, time)`: khói nhang, lửa đèn, con cháu vái.
- Tối đa khoảng 150 mesh cho cả phòng.

### 2. `window.makeFoodStall(THREE, type)` → `{ group, update(dt, time) }`

Quầy đồ ăn đặt trong sân Điện Diêm La. Ăn ở đây được tích phước (game tự cộng công đức). Kiểu sạp chợ quê vui mắt: mái vải sọc hoặc mái lá, quầy gỗ, bảng hiệu chữ (CanvasTexture), đèn lồng nhỏ, đồ ăn bày trên quầy, hơi nóng bốc lên nếu là món nóng. Mặt quầy nhìn hướng **+Z**, gốc ở đất (y = 0), rộng khoảng 2.4 m, sâu 1.4 m, cao 2.6 m. Tối đa 60 mesh mỗi quầy; dùng chung geometry/material.

| `type` | Bảng hiệu | Đồ ăn trên quầy |
|---|---|---|
| `xoi` | XÔI CÚNG | mâm xôi gấc đỏ, xôi đậu xanh vàng, lá chuối |
| `banhbao` | BÁNH BAO | xửng hấp tre chồng lên nhau, bánh bao trắng, hơi nóng |
| `comchay` | CƠM CHAY | nồi cơm, đĩa rau củ, đậu phụ, bát đũa |
| `che` | CHÈ NGỌT | cốc chè nhiều lớp màu, nồi chè, đá |
| `trasua` | TRÀ SỮA ÂM PHỦ | cốc trà sữa có trân châu đen, ống hút to |

`update`: hơi nóng bay, đèn lồng đung đưa nhẹ.

Thêm `window.__scenesSelfTest(THREE)` tạo thử phòng thờ và 5 quầy, trả `{ ok, rows: [{name, meshes, tris}] }`.
