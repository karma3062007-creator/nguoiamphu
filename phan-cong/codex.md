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
