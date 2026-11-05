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

## Việc 19: Bàn buffet rau củ quả

Thêm loại mới `"buffet"` vào `window.makeFoodStall(THREE, type)` trong `src/online/scenes.js` (giữ nguyên 5 loại cũ, không đổi API). **Không sửa file nào khác**, kể cả `BANG-PHAN-CONG.md` (Claude cập nhật).

- Một **bàn buffet dài** kiểu tiệc chay: rộng khoảng **4.8 m** (theo trục X), sâu 1.3 m, mặt bàn cao ~0.9 m, khăn trải bàn đỏ hoặc vàng có diềm, phía sau có giá kệ 2 tầng thấp. Mặt trước nhìn hướng **+Z**, gốc ở đất (y = 0), tâm bàn ở x = 0.
- Bày nhiều **trái cây**: dưa hấu bổ đôi ruột đỏ, nải chuối vàng, chùm nho tím, cam, thanh long hồng, xoài. Và **rau củ**: cà rốt, bắp cải, cà chua, dưa leo, bí ngô nhỏ, ngô. Đặt trên khay hoặc đĩa tròn, nhiều màu tươi.
- Bảng hiệu phía trên (CanvasTexture): **BUFFET RAU CỦ QUẢ**, chữ to dễ đọc, có thêm dòng nhỏ "Ăn chay tích phước".
- Chồng đĩa sạch ở một đầu bàn, vài cái muỗng gắp.
- `update(dt, time)`: vài món nhún nhẹ hoặc lấp lánh cho vui mắt.
- Tối đa **90 mesh**; dùng chung geometry/material (nhiều quả giống nhau thì dùng chung). Cập nhật `__scenesSelfTest` thêm dòng `buffet`.

## Việc 20: Trò chơi công viên âm phủ: xích đu, tàu lượn, đu quay (+ cổng công viên)

Bản đồ được mở rộng thêm **Công viên Âm Phủ** phía nam sân Điện Diêm La. Người chơi lại gần trò chơi, bấm E là **lên ngồi**: game đặt nhân vật theo một "ghế" (seat) mà bạn cung cấp, trò chơi chạy thì nhân vật chạy theo. Tạo file mới `src/online/rides.js` (JavaScript thuần, three.js **r128**, không `import`/`export`, không ảnh ngoài; `CanvasTexture` vẽ chữ bằng code được; không `CapsuleGeometry`). **Chỉ tạo/sửa đúng file này**, không sửa `BANG-PHAN-CONG.md` (Claude cập nhật).

### API

```js
window.makeRide = function (THREE, type) {
  // type: "swing" | "wheel" | "coaster"
  return {
    group,                    // THREE.Group, gốc ở mặt đất (y = 0), tâm trò chơi ở x = z = 0
    seats: [THREE.Object3D],  // mỗi ghế là một Object3D con trong group, chuyển động cùng trò chơi
    board: [{ x, z }],        // 1–3 chỗ đứng để lên trò chơi (toạ độ trong group, trên mặt đất, ngoài vật cản)
    solids: [{ x, z, r }],    // vật cản hình tròn trên mặt đất (toạ độ trong group) để người chơi không đi xuyên chân cột
    name,                     // "Xích đu" | "Đu quay" | "Tàu lượn"
    update(dt, time, occupied) // occupied: mảng boolean, ghế i có người ngồi không
  };
};
window.makeParkGate = function (THREE) { return { group, solids: [{x,z,r}], update(dt, time) }; };
window.__ridesSelfTest = function (THREE) { /* tạo 3 trò + cổng, trả { ok, rows: [{name, meshes, tris, seats}] } */ };
```

**Quy ước ghế (seat):** gốc của Object3D là chỗ **bàn chân** nhân vật khi ngồi (nhân vật cao ~1.6, đứng thẳng, không có tư thế ngồi nên đặt gốc sao cho thân người trông như đang ngồi trên ghế, chân hơi lún vào ghế cũng được). Trục **+Z của ghế là hướng mặt nhìn**, trục +Y là phía trên đầu. Game sẽ copy vị trí + hướng toàn cục của ghế cho nhân vật mỗi khung hình.

### 1. `"swing"`: Xích đu

- Khung xích đu gỗ đỏ son hoặc sắt đen viền vàng, cao ~3.4 m, rộng ~7 m, có **3 ghế** treo bằng xích (hai sợi xích mỗi ghế, có thể là các mắt xích nhỏ hoặc thanh mảnh).
- Ghế có người (`occupied[i]`) thì đung đưa mạnh (biên độ ~0.9 rad, chu kỳ ~2.6 s). Không ai ngồi thì gần như đứng yên, chỉ khẽ lắc. Chuyển đổi mượt (biên độ tăng/giảm dần).
- Trang trí: đầu lâu nhỏ dễ thương ở hai đỉnh cột, dây đèn lồng.
- `board`: 1 chỗ phía trước giữa khung.

### 2. `"wheel"`: Đu quay

- Vòng quay lớn **bán kính ~8 m**, trục cao ~9.5 m trên hai chân chữ A, tổng cao ~18 m. Nan hoa và vành có **bóng đèn phát sáng** (MeshBasicMaterial màu vàng cam, thưa thôi để nhẹ), giữa trục có mặt quỷ hoặc đầu lâu cười.
- **8 cabin** treo ở vành, luôn **thẳng đứng** khi vòng quay (bù góc quay). Mỗi cabin 1 ghế, ghế nhìn ra ngoài phía +Z của trò chơi.
- Quay chậm liên tục (~1 vòng / 50 giây).
- Có bục lên xuống ở đáy. `board`: 1 chỗ trước bục.

### 3. `"coaster"`: Tàu lượn

- Đường ray khép kín (dùng `CatmullRomCurve3` closed), có dốc cao ~8 m, đổ dốc, một đoạn lượn sóng và cua nghiêng; chiếm khoảng **34 m × 16 m** (trục X dài), trụ đỡ đen thưa. Ray: 2 ống (`TubeGeometry`) + vài thanh ngang thưa.
- **Đoàn tàu 3 toa**, mỗi toa 2 ghế (tổng **6 ghế**), đầu toa trước hình đầu rồng hoặc đầu quỷ. Toa nghiêng theo đường ray (hướng theo tiếp tuyến).
- Chạy liên tục quanh đường ray; tốc độ nhanh khi xuống dốc, chậm khi lên dốc (ví dụ v = sqrt(v0² + 2g(hMax − h)) với v0 nhỏ), có một đoạn ga bằng phẳng chạy chậm.
- Ga có mái che nhỏ + bảng "TÀU LƯỢN ĐỊA PHỦ". `board`: 1 chỗ cạnh ga.

### 4. `makeParkGate`

- Cổng chào **"CÔNG VIÊN ÂM PHỦ"** (bảng chữ CanvasTexture), rộng ~9 m, cao ~6 m, cột đỏ, đèn lồng, bóng đèn chạy. Lối đi ở giữa rộng ≥ 4.5 m, mặt cổng nhìn **−Z** và **+Z** đều được (chữ hai mặt hoặc mặt −Z).
- `solids`: chân cột.

### Yêu cầu chung

- Phong cách hội chợ âm phủ vui nhộn: đỏ son, đen, vàng kim, đèn lồng, đầu lâu chibi, không ghê rợn.
- Nhẹ cho điện thoại: swing ≤ 45 mesh, wheel ≤ 150 mesh, coaster ≤ 220 mesh, cổng ≤ 40 mesh; dùng chung geometry/material; hạn chế `PointLight` (tối đa 2 mỗi trò).
- `update` không được tạo object mới mỗi khung hình (tái sử dụng vector).

## Việc 22: Quầy bắn súng hội chợ (bắn trúng tâm)

Thêm một **quầy bắn súng kiểu hội chợ** vào Công viên Âm Phủ: người chơi đứng trước quầy, bấm E là vào chế độ bắn, camera đặt sau khẩu súng nhìn vào vách bia, người chơi bấm chuột / chạm màn hình vào bia để bắn. Claude lo phần chơi (ngắm, đạn, điểm, công đức, camera). Bạn lo **hình và chuyển động** của quầy, bia và súng.

Tạo file mới `src/online/booth.js` (JavaScript thuần, three.js **r128**, không `import`/`export`, không ảnh ngoài; `CanvasTexture` vẽ chữ/vòng bia bằng code được; không `CapsuleGeometry`). **Chỉ tạo/sửa đúng file này** (Claude cập nhật bảng phân công).

### API

```js
window.makeShootingBooth = function (THREE) {
  return {
    group,          // THREE.Group, gốc ở mặt đất (y = 0). Mặt trước quầy (chỗ người đứng bắn) nhìn về +Z, vách bia ở phía -Z.
    name,           // "Bắn súng hội chợ"
    board: [{ x, z }],      // chỗ đứng bấm E, trước quầy (ví dụ { x: 0, z: 2.4 }), ngoài vật cản
    solids: [{ x, z, r }],  // vật cản tròn (quầy, cột) để người chơi không đi xuyên
    view: { pos: { x, y, z }, look: { x, y, z } }, // camera khi bắn: ngay sau súng, ngang tầm mắt, nhìn vào giữa vách bia (toạ độ trong group)
    gun,            // Object3D khẩu súng trường đặt trên quầy; game gọi aim(...) để xoay nòng theo điểm ngắm
    targets: [ { obj, kind, points, r } ],
      // obj: Object3D của bia (game raycast vào các mesh con của obj; tâm bia là gốc obj, mặt bia nhìn +Z)
      // kind: "ring" (bia tròn nhiều vòng) | "duck" (vịt/đèn lồng chạy ngang) | "skull" (đầu lâu chibi bật lên)
      // points: điểm cơ bản; r: bán kính mặt bia (để tính bắn gần tâm)
    aim(x, y, z),   // điểm ngắm toàn cục (THREE world): xoay súng nhìn về điểm đó (chỉ xoay, không tạo object mới)
    shoot(),        // hiệu ứng bắn: giật súng + chớp lửa đầu nòng ngắn (~0.08 s)
    hit(i, local),  // bia i bị trúng: bia đổ / lật ra sau, ~1.2 s sau dựng lại. local = điểm trúng trong toạ độ obj (có thể bỏ qua)
    isUp(i),        // bia i đang dựng (bắn được) hay không
    update(dt, time, active) // active: có người đang bắn → đèn quầy nhấp nháy, bia chạy nhanh hơn chút
  };
};
window.__boothSelfTest = function (THREE) { /* trả { ok, meshes, tris, targets } , kiểm tra hit/isUp/update không lỗi */ };
```

### Hình dáng

- Quầy rộng **~7 m** (trục X), sâu **~4.5 m**, cao **~4 m**: mái che sọc **đỏ son – vàng kim**, diềm tam giác rủ, bảng hiệu lớn **"BẮN SÚNG TRÚNG TÂM"** (dòng nhỏ "Trúng hồng tâm, tích công đức") trên đỉnh, dây bóng đèn quanh mép mái.
- Mặt quầy gỗ ở phía trước (cao ~1.1 m), 1–2 khẩu súng trường gỗ đặt trên quầy (khẩu chính là `gun`, đặt giữa, gần mép trước, nòng hướng -Z).
- Vách bia ở sâu bên trong (cách mặt quầy ~3.5 m), nền tối có hoa văn, gồm 3 tầng:
  - Tầng trên: **4–5 bia tròn** ("ring") trắng đỏ nhiều vòng, hồng tâm vàng, một số bia **xoay tròn chậm** hoặc lắc qua lại.
  - Tầng giữa: **hàng vịt / đèn lồng** ("duck") chạy ngang trên ray rồi quay lại (băng chuyền), 5–6 con.
  - Tầng dưới: **3–4 đầu lâu chibi** ("skull") lúc nhô lên lúc thụt xuống (ẩn thì `isUp` = false).
- Hai bên vách treo **giải thưởng**: gấu bông, đèn lồng, bình vàng mã… cho vui mắt.
- Điểm gợi ý: ring 30, duck 20, skull 50.
- Phong cách giống các trò công viên đã làm: vui nhộn, đỏ son, đen, vàng kim, không ghê rợn.
- `view.pos` để camera thấy trọn vách bia (khoảng FOV dọc 55°); bia không bị mái hay cột che.

### Yêu cầu chung

- Nhẹ cho điện thoại: tối đa **110 mesh**, tối đa 2 `PointLight`; dùng chung geometry/material.
- `update`/`aim`/`hit` không tạo object mới mỗi khung hình (tái sử dụng vector).
- Bia ngã thì vẫn ở trong `obj` (game kiểm `isUp(i)` trước khi tính trúng).
- `__boothSelfTest`: đếm mesh/tam giác, kiểm số hữu hạn, gọi `hit(0)`, `update` 2 giây, kiểm `isUp(0)` false rồi true lại, `targets.length >= 12`.

## Việc 24: Hai tòa nhà mới: Phòng Karaoke Âm Phủ và Chùa Niệm Phật

Công viên Âm Phủ có thêm hai tòa nhà **đi vào được** (học theo rạp xem chung wetube ciné và chùa 3D niemphat.online): bên đông là **Phòng Karaoke Âm Phủ** (cùng xem/hát một video YouTube, chấm điểm người hát), bên tây là **Chùa Niệm Phật** (ngồi bồ đoàn niệm Phật, tụng kinh cùng nhau). Claude lo máy chủ, video, đồng bộ, ngồi ghế, camera. Bạn lo **hình 3D** của hai tòa nhà, cả ngoài lẫn trong.

Tạo file mới `src/online/rooms.js` (JavaScript thuần, three.js **r128**, không `import`/`export`, không ảnh ngoài; `CanvasTexture` vẽ chữ bằng code được; không `CapsuleGeometry`). **Chỉ tạo/sửa đúng file này.** Theo phong cách và cách tổ chức code của `src/online/rides.js` và `src/online/booth.js`.

### Quy ước chung cho cả hai phòng

- `group` gốc ở **sàn trong phòng (y = 0)**, tâm phòng ở x = z = 0. Trong lòng phòng (chỗ đi được) là **x ∈ [-12, 12], z ∈ [-10, 10]**; tường dày ~0.3 nằm ngay ngoài ranh này.
- **Cửa ra vào** ở giữa tường **+Z**, lỗ cửa rộng **3 m** (|x| < 1.5), cao ≥ 3 m. Phía trong là chỗ quay mặt về **-Z** (sân khấu / tượng Phật ở phía -Z).
- `roof`: một Object3D chứa **mái + trần** (game ẩn nó khi người chơi ở trong để camera nhìn từ trên xuống thấy được). Không được để tường cao quá **4.2 m** che camera: tường trong thấp hơn mái, hoặc phần tường cao trên 4.2 m đưa vào `roof`.
- `seats`: các Object3D ghế, **quy ước giống rides.js**: gốc = bàn chân nhân vật khi ngồi (nhân vật cao 1.6, đứng thẳng, không có tư thế ngồi, nên đặt gốc thấp cho thân trông như đang ngồi, chân lún vào ghế được), **+Z của ghế = hướng mặt nhìn**, +Y lên trên.
- `solids: [{x, z, r}]` vật cản tròn (cột, chậu cây…) và `blocked: [{x0, x1, z0, z1}]` các ô chữ nhật **không đi được** (sân khấu, bệ thờ, hàng ghế sofa nếu cần). Ghế phải ngồi được: game đứng cạnh ghế bấm E, nên chừa lối đi giữa các hàng ghế.
- `update(dt, time, info)`: không tạo object mới mỗi khung hình.
- Ngoại thất nhìn từ công viên phải đẹp và nhận ra ngay; lỗ cửa thông suốt.
- Nhẹ cho điện thoại: **mỗi phòng ≤ 220 mesh**, ≤ 3 `PointLight`; dùng chung geometry/material.

### 1. `window.makeKaraokeRoom(THREE)`

```js
return {
  group, roof, name: "Phòng Karaoke Âm Phủ",
  seats: [Object3D],     // 16–24 chỗ khán giả (sofa nhung đỏ / ghế bành), nhìn về -Z
  stage: Object3D,       // chỗ người hát đứng cạnh micro trên sân khấu, +Z nhìn xuống khán giả (gốc = bàn chân, trên mặt sân khấu)
  screen: THREE.Mesh,    // màn hình lớn 16:9 (PlaneGeometry, rộng ~8 m) sau sân khấu, mặt nhìn +Z, MeshBasicMaterial; game sẽ thay material.map
  solids, blocked,
  update(dt, time, { playing, level })   // playing: đang có bài; level 0..1 độ sôi động (số người / điểm) → đèn sân khấu quét, quả cầu disco quay, viền neon nhấp nháy theo nhịp
};
```

- Sân khấu cao ~0.7 m ở đầu -Z, có micro đứng, loa hai bên, quả cầu disco, đèn quét. Màn hình đặt cao sao cho khán giả ngồi nhìn thấy trọn (đáy màn ~1.6 m trên sàn sân khấu).
- Phong cách: quán karaoke âm phủ vui nhộn: tường tím than, viền neon hồng-tím-vàng, thảm đỏ, đèn lồng giấy, poster "Song ca cùng Diêm Vương" cho vui (CanvasTexture).
- Ngoại thất: khối nhà vuông, biển neon lớn **"KARAOKE ÂM PHỦ"** phía trên cửa (mặt +Z), dải đèn chạy viền cửa.

### 2. `window.makeTempleHall(THREE)`

```js
return {
  group, roof, name: "Chùa Niệm Phật",
  seats: [Object3D],     // 20 bồ đoàn (4 hàng × 5), nhìn về -Z (tượng Phật)
  solids, blocked,
  knock(),               // mõ lớn trên bàn thờ nhún + dùi gõ một cái (game gọi khi có người niệm)
  update(dt, time, { chanting })   // chanting: số người đang niệm → hào quang tượng sáng hơn, khói hương bay, đèn hoa sen lung linh
};
```

- Tượng **Phật A Di Đà** ngồi tòa sen trên bệ (tổng cao ~4.5 m), hào quang tròn sau lưng phát sáng nhẹ (MeshBasicMaterial). Hiền hoà, trang nghiêm, đơn giản khối, không cần chi tiết mặt nhiều.
- Bàn thờ: lư hương có khói (vài sprite/plane mờ bay lên), bình hoa sen, đèn dầu, **mõ lớn** một bên và **chuông gia trì** một bên. Hoành phi chữ **"A DI ĐÀ PHẬT"** và đôi câu đối (CanvasTexture).
- Cột gỗ son, sàn gỗ, bồ đoàn vàng nghệ, ánh sáng ấm vàng, vài phướn treo.
- Ngoại thất: chùa mái cong ngói, đầu đao uốn, cổng tam quan nhỏ hoặc biển **"CHÙA NIỆM PHẬT"** trên cửa (mặt +Z), hai đèn lồng.
- Không ghê rợn, không hài hước (đây là chốn trang nghiêm).

### 3. `window.__roomsSelfTest(THREE)`

Tạo cả hai phòng, đếm mesh/tam giác/PointLight, kiểm số hữu hạn, mọi seat là con của group, seat nằm trong ranh x ∈ [-12, 12], z ∈ [-10, 10], lỗ cửa (|x| < 1.5, z từ 9 đến 11) không bị `solids`/`blocked` chặn, gọi `update` 2 giây, gọi `knock()`. Trả `{ ok, rows: [{ name, meshes, tris, lights, seats }] }`.


## Việc 27: Bảng điều khiển trong Chùa Niệm Phật (học theo niemphat.online)

Học theo niemphat.online (có Tràng hạt, Tụng kinh + Mõ tự động, Thiền, Dâng lễ, Lạy Phật, Đèn nguyện). Khi người chơi ngồi lên bồ đoàn trong **Chùa Niệm Phật** (`rooms.js`, việc 24), game mở **bảng chùa** của bạn ở nửa dưới màn hình (phía trên vẫn thấy chùa 3D và các vong hồn khác). Claude lo máy chủ, công đức, hiệu ứng 3D (lạy Phật, đèn bay, khói hương) và ghép vào game. Bạn làm phần giao diện HTML/CSS/JS này.

Antigravity đã làm xong bản đầu (việc 25): **`src/online/chant-ui.js`** và **`src/online/chant-demo.html`** (tràng hạt 108 hạt, tụng Tâm Kinh theo mõ, nhịp chậm/vừa/nhanh, bộ đếm, top 5). Việc của bạn là **mở rộng tiếp đúng hai file đó** (giữ phong cách, màu, cách tổ chức code và những gì đang chạy tốt của Antigravity; sửa chỗ nào cần để khớp hợp đồng dưới đây). Không sửa file khác. JavaScript thuần, không `import`/`export`, không thư viện, không ảnh/font/âm thanh tải ngoài. Mọi class CSS bắt đầu bằng `cu-`.

API vẫn là `window.ChantUI` (game đang gọi `ChantUI.mount`), chỉ **thêm** tuỳ chọn mới; tham số mới thiếu thì giao diện vẫn chạy (ẩn nút tương ứng).

### API (game gọi đúng như sau)

```js
window.ChantUI = {
  mount(host, opts) {
    // host: <div> phủ toàn màn hình, pointer-events: none (phần giao diện của bạn tự bật pointer-events: auto)
    // opts = {
    //   name,                                  // tên người chơi
    //   sound(kind),                           // game phát tiếng: "mo" | "chuong" | "khanh" | "huong"
    //   onChant(kind, manual),                 // MỖI câu niệm (kind "niem") / mỗi câu kinh tụng xong (kind "tung"); manual = true nếu tự tay bấm, false nếu do chế độ tự chạy
    //   onSutraDone(manual),                   // tụng trọn bài kinh
    //   onOffer(kind) -> { ok, wait },         // dâng lễ: "huong" | "nen" | "hoa" | "dendang" | "chuong"; ok=false thì wait = số giây còn phải chờ
    //   onBow() -> { ok, wait },               // lạy Phật (game cho nhân vật lạy 3 lạy)
    //   onMeditate(seconds),                   // xả thiền: số giây đã thiền
    //   onWish(text) -> { ok, msg },           // thả đèn nguyện: lời nguyện ≤ 80 ký tự
    //   onLeave()                              // "Đứng dậy" hoặc Esc
    // }
    return {
      setStats({ mine, today, room, chanters }),  // mine: số câu lượt này; today: số câu hôm nay; room: tổng cả chùa hôm nay; chanters: số người đang niệm
      setTop([{ name, c }]),                       // top 5 hôm nay
      setWishes([{ name, text, at }]),             // đèn nguyện gần đây (mới nhất trước, tối đa 30; at = ms)
      toast(text),                                  // game nhắn một dòng ngắn (ví dụ "+3 công đức · viên mãn 1 tràng")
      remote(name),                                 // người khác vừa niệm: dòng nhẹ "… đang niệm" (gộp, không spam)
      unmount()                                     // gỡ sạch DOM, listener, setInterval, speechSynthesis
    };
  }
};
```

### Các thẻ (tab), học theo niemphat.online

1. **Niệm Phật / Tràng hạt** (thẻ mặc định)
   - Tràng hạt **108 hạt** (SVG/canvas), hạt mẫu to hơn ở đầu. Bấm nút lớn tròn "Nam mô A Di Đà Phật", **chạm hoặc vuốt xuống** trên tràng hạt, hoặc phím **Space**/**Enter** để lần một hạt: `sound("mo")`, `onChant("niem", true)`, hạt hiện tại sáng lên, tràng xoay một nấc, chữ "Nam mô A Di Đà Phật" bay lên mờ dần. Tối đa ~6 câu/giây.
   - Đếm "12 / 108 · Vòng thứ nhất / thứ hai …"; hết 108 câu: `sound("chuong")`, hào quang nhẹ, sang vòng mới.
   - **Chế độ tự niệm** (công tắc rõ ràng, bấm là chạy ngay): tự lần hạt đều theo **nhịp** chọn được: Chậm (1,6 giây) / Vừa (1,1 giây) / Nhanh (0,75 giây), mỗi nhịp `sound("mo")` và gọi `onChant("niem", false)`. Đang tự niệm thì nút lớn đổi thành "Đang tự niệm… (bấm để dừng)", có hiệu ứng nhịp thở nhẹ. Ghi chú nhỏ dưới công tắc: "Tự tay niệm mới được nhiều công đức".
2. **Tụng kinh**
   - **Bát Nhã Ba La Mật Đa Tâm Kinh** bản phiên âm **Hán-Việt** cổ (văn bản cổ, từ "Quán Tự Tại Bồ Tát hành thâm Bát Nhã Ba La Mật Đa thời…" đến "…Yết đế yết đế, ba la yết đế, ba la tăng yết đế, Bồ đề tát bà ha"). Tách theo câu (dấu phẩy/chấm), tô sáng **từng chữ** như karaoke, tự cuộn.
   - Hai cách: tự tay gõ nút **mõ** (mỗi lần gõ: `sound("mo")`, sáng thêm một chữ) hoặc bật **Mõ tự động** với **Nhịp** chậm/vừa/nhanh (0,9 / 0,7 / 0,5 giây). Hết mỗi câu gọi `onChant("tung", manual)`. Trọn bài: `sound("chuong")`, `onSutraDone(manual)`, hiện lời hồi hướng ngắn "Nguyện đem công đức này, hướng về khắp tất cả…". Có nút tạm dừng và tụng lại từ đầu.
   - **Giọng đọc**: nếu trình duyệt có giọng tiếng Việt (`speechSynthesis.getVoices()` có `lang` bắt đầu "vi"), hiện công tắc "Giọng đọc"; bật thì đọc mỗi câu khi bắt đầu câu (rate ~0.9). Không có giọng Việt thì ẩn công tắc. Unmount thì `speechSynthesis.cancel()`.
   - Ghi chú nhỏ: "Tự tay gõ mới có công đức từng tiếng".
3. **Thiền**
   - Chọn 5 / 10 / 20 / 30 phút / Tự do, nút "Bắt đầu". Vòng tròn nở ra – co lại theo nhịp thở (hít vào 4 giây, thở ra 6 giây) với chữ "Hít vào…" / "Thở ra…", đồng hồ 00:00. Hết giờ: `sound("chuong")`. Nút **Xả thiền** (và khi hết giờ) gọi `onMeditate(giây)`. Dòng hướng dẫn: "Ngồi thẳng lưng, thả lỏng vai, theo dõi hơi thở." Bắt đầu/kết thúc: `sound("khanh")`.
4. **Dâng lễ**
   - Các nút lớn có biểu tượng (CSS/SVG/emoji): **Thắp hương**, **Thắp nến**, **Dâng hoa**, **Thả đèn hoa đăng**, **Thỉnh chuông**, và **Lạy Phật (3 lạy)**. Bấm gọi `onOffer(kind)` / `onBow()`; nếu `ok=false` thì nút hiện đếm ngược `wait` giây (mờ, không bấm được).
5. **Đèn nguyện**
   - Ô viết lời nguyện (≤ 80 ký tự, đếm ký tự) + nút "Thả đèn nguyện" → `onWish(text)`; `ok=false` thì hiện `msg`. Danh sách đèn nguyện gần đây từ `setWishes` (đèn lồng nhỏ, tên, lời nguyện, "x phút trước"). Chữ phải hiện bằng `textContent` (không `innerHTML`) vì là chữ người khác viết.

### Chung

- Luôn hiện: khung nhỏ **Cả chùa** "Hôm nay cả chùa: 12.345 câu · 4 người đang niệm" + top 5 (thu gọn được), dòng `toast`, nút **Đứng dậy** (Esc).
- Chế độ tự chạy (tự niệm, mõ tự động) **vẫn chạy khi đổi thẻ**, chỉ dừng khi bấm tắt hoặc unmount. Không cho tự niệm và mõ tự động chạy cùng lúc (bật cái này tắt cái kia).
- Phong cách: trang nghiêm, ấm: nền kem/giấy dó, viền vàng đồng #e8b765, chữ nâu son, nút chính vàng nghệ như áo cà sa, bo tròn 16px.
- **Điện thoại 375×812**: cao tối đa **45%** màn hình, không tràn ngang, hàng thẻ cuộn ngang được; màn ngang thấp (≤ 500px) thì đặt sang bên phải, rộng ≤ 46%. Nút chính ≥ 88px. Tôn trọng `prefers-reduced-motion`.
- Không để phím Space/Enter lần hạt khi đang gõ trong ô lời nguyện (chặn khi focus ở input/textarea).

### Trang thử `chant-demo.html`

Nền tối giả lập game, nạp `chant-ui.js`, gọi `mount` với `sound` phát tiếng bằng WebAudio đơn giản, `onOffer`/`onBow` giả lập chờ 20 giây, `onWish` thêm vào danh sách, giả lập `setStats`/`setTop`/`remote` tăng dần, nút unmount/mount lại để kiểm tra gỡ sạch.


## Việc 29: Rạp phim Âm Phủ (thêm vào `rooms.js`)

Học theo rạp xem chung **wetube ciné**: một rạp phim, cả hội cùng xem một màn hình, mọi người gửi video và bình chọn. Claude lo máy chủ, video YouTube, đồng bộ, bình chọn, camera. Bạn **thêm** hàm mới vào `src/online/rooms.js` (giữ nguyên hai phòng đã có, không đổi API cũ). **Chỉ sửa đúng file này.**

```js
window.makeCinemaRoom = function (THREE) {
  return {
    group, roof, name: "Rạp phim Âm Phủ",
    seats: [Object3D],     // 28–36 ghế rạp (ghế nệm đỏ có tay vịn, kiểu ghế rạp), nhìn về -Z (màn hình)
    screen: THREE.Mesh,    // màn chiếu lớn 16:9 (PlaneGeometry, rộng ~13 m) ở tường -Z, mặt nhìn +Z, MeshBasicMaterial; game thay material.map
    solids, blocked,
    update(dt, time, { playing, level })   // playing: đang chiếu → đèn trần tối dần, đèn lối đi sáng nhẹ, viền màn hơi sáng; không chiếu → đèn sáng bình thường
  };
};
```

Theo đúng **quy ước chung** của Việc 24: gốc ở sàn (y = 0), trong lòng phòng x ∈ [-12, 12], z ∈ [-10, 10]; cửa 3 m ở giữa tường +Z; `roof` chứa mái + trần (game ẩn khi ở trong); tường trong không cao quá 4.2 m che camera (phần cao hơn đưa vào `roof`); seat: gốc = bàn chân, +Z ghế = hướng nhìn; `solids`/`blocked`.

- Sàn **phẳng** (game chưa đi được trên bậc thang), nhưng các hàng ghế phía sau có thể đặt trên bục thấp riêng từng hàng (bục ≤ 0.45 m, gốc seat nâng theo) để nhìn rõ màn hơn; bục và ghế nằm trong `blocked`, chừa **lối đi giữa** (|x| < 1.3) và **hai lối bên** để đến từng hàng ghế (người chơi đứng cạnh ghế trong ~1.8 m mới bấm E được).
- Màn chiếu đặt cao: đáy màn ~1.4 m, khung viền đen, rèm nhung đỏ hai bên, loa. Khoảng giữa màn và hàng ghế đầu ≥ 3 m.
- Bên trong: thảm đỏ, tường tối có đèn tường vàng, poster phim vui "MA LÀNG CHIẾU BÓNG", "DIÊM VƯƠNG ĐẠI CHIẾN" (CanvasTexture), quầy bắp rang + nước ngọt nhỏ gần cửa.
- Ngoại thất: tòa rạp có **bảng hiệu marquee "RẠP PHIM ÂM PHỦ"** với hàng bóng đèn chạy viền (mặt +Z), poster hai bên cửa, mái nhỏ trên cửa.
- Nhẹ: ≤ 220 mesh, ≤ 3 `PointLight`, dùng chung geometry/material; `update` không tạo object mới mỗi khung hình.
- Cập nhật `__roomsSelfTest` thêm dòng rạp phim (cùng các kiểm tra như hai phòng kia).
