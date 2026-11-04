# Bảng phân công: Game 18 tầng địa ngục

Ba "người" cùng làm một dự án: **Claude**, **Codex** và **Antigravity**. Mỗi bên chỉ sửa đúng các file của mình để không giẫm chân nhau. Khi làm xong một việc, sửa cột **Trạng thái** trong bảng dưới đây và ghi một dòng vào phần **Nhật ký** cuối file.

Trạng thái dùng: `Chưa làm` · `Đang làm` · `Xong` · `Cần sửa`

## Sản phẩm

| Trang | File nguồn chính | Kết quả sau khi ghép |
|---|---|---|
| Trang tour "Âm Phủ Travel" | `src/tour/tour.template.html` | `dist/am-phu-travel.html` |
| Game nhiều người chơi "Âm Phủ Online" | `src/online/online.template.html` | `dist/am-phu-online.html` |

Ghép bằng lệnh `node build.js` ở thư mục gốc (xem `README.md`).

## Ai sở hữu file nào

| Bên | File được sửa | Không được sửa |
|---|---|---|
| Claude | `src/tour/*`, `src/online/online.template.html`, `build.js`, `README.md` | `avatars.js`, `extras.js` |
| Codex | `src/online/avatars.js`, `src/online/extras.js`, `src/shared/levels.json` | mọi file `*.template.html`, `avatars-gen.js` |
| Antigravity | `src/online/avatars-gen.js`, `phan-cong/kiem-thu.md` | `avatars.js`, `extras.js`, mọi file `*.template.html` |

Ai cũng được sửa file này (`BANG-PHAN-CONG.md`) để cập nhật trạng thái.

## Việc cần làm

| # | Việc | Người làm | Trạng thái | Chi tiết |
|---|---|---|---|---|
| 1 | Nội dung 18 tầng (tên, tội, quảng cáo, giá, mẹo) | Codex | Xong | `src/shared/levels.json` |
| 2 | Trang tour, thang máy chọn tầng, đặt vé | Claude | Xong | `src/tour/tour.template.html` |
| 3 | Mini game bản đồ 2D + Điện Diêm La thắp hương | Claude | Xong | trong trang tour |
| 4 | Nhân vật 3D người chơi (4 dạng, nam/nữ, đổi màu) + NPC Ngưu Đầu, Mã Diện, Diêm Vương, Mạnh Bà | Codex | Xong | [codex.md](codex.md) |
| 5 | Thế giới 3D: sân, đỉnh hương, mõ, chuông, lò vàng mã, sông Huyết Hà, cầu Nại Hà, Điện Diêm La, 18 bia tầng | Claude | Xong | `src/online/online.template.html` |
| 6 | Nhiều người chơi: chọn cõi (máy chủ), thấy nhau đi lại, chat, hiệu ứng hành động của người khác | Claude | Xong | như trên |
| 7 | Công đức, giảm án, bảng xếp hạng công đức, đầu thai qua Mạnh Bà | Claude | Xong | như trên |
| 4b | Nhân vật 3D bản đẹp (thay bản của Codex), cùng API | Antigravity | Xong | [antigravity.md](antigravity.md) |
| 8 | Cảnh trang trí thêm: Quỷ Môn Quan ở chỗ xuất phát, Vọng Hương Đài, cây đao, xích sắt, đèn lồng | Codex | Xong | [codex.md](codex.md) |
| 9 | Kiểm thử trên máy tính + điện thoại, ghi lỗi | Antigravity | Chưa làm | [antigravity.md](antigravity.md) |
| 10 | Ghép bản cuối, xuất bản, sửa lỗi từ kiểm thử | Claude | Đang làm | [claude.md](claude.md) |
| 11 | Máy chủ riêng (server.js) để đưa lên web ngoài Claude, giao diện điện thoại dọc/ngang | Claude | Xong | [../DUA-LEN-WEB.md](../DUA-LEN-WEB.md) |

## Quy tắc chung

1. Mỗi bên chỉ sửa file mình sở hữu. Cần đổi chỗ khác thì ghi yêu cầu vào phần **Yêu cầu qua lại** dưới đây.
2. JavaScript thuần, không `import`/`export`. Thư viện 3D là three.js bản **r128** (biến toàn cục `THREE`).
3. Không dùng ảnh, âm thanh hay font tải từ trang khác. Hình vẽ bằng code, âm thanh tạo bằng Web Audio.
4. Chữ hiển thị cho người chơi viết bằng tiếng Việt, giọng hài hước nhẹ, không ghê rợn.
5. Không chép code, hình ảnh hay tên thương hiệu của trang khác (ví dụ trang niệm Phật online chỉ để tham khảo ý tưởng).

## Yêu cầu qua lại

- (trống)

## Nhật ký

- 2026-11-04 · Claude · Tạo thư mục dự án và bảng phân công. Trang tour và game online bản đầu đã chạy.
- 2026-11-04 · Codex · Viết `levels.json` (18 tầng).
- 2026-11-04 · Claude · Đổi việc: Antigravity làm nhân vật bản đẹp (`avatars-gen.js`), Codex chuyển sang cảnh trang trí (`extras.js`). Bản nhân vật của Codex giữ làm dự phòng.
- 2026-11-04 · Codex · Viết `avatars.js` (4 dạng nam/nữ, đổi màu, hoạt ảnh, 4 NPC và self-test); kiểm tra cú pháp đạt. Chưa chạy được self-test r128 vì npm không có trong PATH và kết nối tải gói bị chặn; đã xoá `_codex_tmp`, giữ Việc 4 ở trạng thái Đang làm chờ kiểm tra.
- 2026-11-04 · Claude · Chạy self-test `avatars.js` trong trình duyệt với three r128: 8 kiểu người chơi + 4 NPC đều tạo được, cao đúng. Việc 4 chuyển sang Xong. Đã ghép vào game và xuất bản.
- 2026-11-04 · Codex · Viết `extras.js` cho Việc 8: cổng tam quan, Vọng Hương Đài, 10 cây đao, xích và 9 đèn lồng đung đưa; dùng chung geometry/material, thêm vật cản. Chưa xác nhận build: `node build.js` không chạy vì node không có trong PATH, gọi trực tiếp node.exe đã cài bị báo Access is denied; để Cần sửa chờ chạy kiểm tra đạt.
- 2026-11-04 · Claude · Ghép `extras.js` của Codex, chạy thử trong trình duyệt không lỗi, việc 8 chuyển sang Xong. Thêm camera tự tiến lại khi bị cổng/tường che.
- 2026-11-04 · Claude · Thêm `server.js` (WebSocket viết tay, không cần gói), `package.json`, `chay-tren-may.bat`, `DUA-LEN-WEB.md`. Đã thử 2 người chơi qua máy chủ riêng: thấy nhau, chat được. Sửa giao diện điện thoại dọc (camera lùi xa, góc rộng hơn) và ngang (nút gọn vào góc, có nút toàn màn hình).
- 2026-11-04 · Claude · Ghép `avatars-gen.js` của Antigravity (giờ là bản nhân vật chính). Chạy thử: 8 kiểu người chơi 16–32 mesh, dưới 2.000 tam giác, 4 NPC đúng chiều cao, không lỗi. Thêm camera xoay quanh nhân vật ở màn tạo nhân vật. Thêm `render.yaml` để đưa lên Render.
