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
| Claude | `src/tour/*`, `src/home/*`, `src/online/online.template.html`, `src/games/hub.template.html`, `server.js`, `build.js`, `README.md` | `avatars.js`, `extras.js` |
| Codex | `src/online/avatars.js`, `src/online/extras.js`, `src/shared/levels.json`, `src/games/rules-*.js`, `src/games/ui-*.js`, `src/games/ui-demo.html`, `src/online/reborn.js` | mọi file `*.template.html`, `avatars-gen.js` |
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
| 9 | Kiểm thử trên máy tính + điện thoại, ghi lỗi | Antigravity | Xong | [antigravity.md](antigravity.md) |
| 10 | Ghép bản cuối, xuất bản, sửa lỗi từ kiểm thử | Claude | Đang làm | [claude.md](claude.md) |
| 12 | Luật 3 trò chơi bàn: Cờ vua, Ô ăn quan, Ma Sói (+ máy chơi cùng) | Codex | Xong | [tro-choi-hop-dong.md](tro-choi-hop-dong.md), [codex.md](codex.md) |
| 13 | Giao diện 3 trò chơi bàn (bàn cờ, bàn ô ăn quan, lá bài Ma Sói) | Codex | Xong | [tro-choi-hop-dong.md](tro-choi-hop-dong.md), [codex.md](codex.md) |
| 14 | Máy chủ phòng chơi, ghép cặp ngẫu nhiên / phòng riêng / chơi với máy, trang /tro-choi, nút nhảy trong game 3D | Claude | Xong | [tro-choi-hop-dong.md](tro-choi-hop-dong.md) |
| 15 | Hình nhân vật sau đầu thai: người, 12 con giáp, tiên (`src/online/reborn.js`) | Codex | Xong | [codex.md](codex.md) |
| 16 | Quay ngẫu nhiên kiếp mới khi đầu thai, 3 màn công bố riêng (người / con giáp / tiên), đồng bộ hình cho người khác | Claude | Xong | |
| 17 | Phòng thờ cảnh mở đầu + 5 quầy đồ ăn tích phước (`src/online/scenes.js`) | Codex | Xong | [codex.md](codex.md) |
| 18 | Cảnh mở đầu ngồi bàn thờ → nút "Xuống âm phủ"; đặt 5 quầy ăn trong sân, ăn được cộng công đức | Claude | Xong | |
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
- 2026-11-04 · Antigravity · Hoàn tất việc 4b và việc 9: Tinh chỉnh nhân vật chibi 3D (`avatars-gen.js`) với mắt to điểm sáng catchlight kép, má hồng, chuyển động chớp mắt và nhịp thở, tối ưu hóa geometries/materials dưới 2.000 tam giác/nhân vật; vượt qua toàn bộ self-test. Kiểm thử toàn diện cả hai trang sản phẩm trên máy tính và mô phỏng di động, ghi báo cáo chi tiết vào `phan-cong/kiem-thu.md`. Cập nhật trạng thái hai việc sang Xong.
- 2026-11-04 · Claude · Gộp 4 cõi (bản đồ giống nhau, chỉ khác màu) còn 1 cõi Vô Gián. Thêm gậy gõ đầu: phím G cầm/cất gậy, E gõ người đứng gần (< 2.4), mỗi cú trừ 2 công đức của người bị gõ, chờ 1 giây giữa hai cú, trong Điện Diêm La cấm đánh. Máy chủ kiểm tra khoảng cách và tốc độ gõ. Đã thử 2 người: 2 cú trúng, 50 → 46.
- 2026-11-04 · Claude · Thêm 3 trò chơi bàn. Viết hợp đồng chung `tro-choi-hop-dong.md`; giao Codex việc 12 (luật), Antigravity việc 13 (giao diện), Claude việc 14 (máy chủ, ghép cặp, trang /tro-choi, nút nhảy).
- 2026-11-04 · Codex · Hoàn tất Việc 12: tạo `rules-chess.js`, `rules-oanquan.js`, `rules-masoi.js` đúng API/view phần 1, state bất biến khi apply, bot cờ vua/ô ăn quan và giấu vai Ma Sói. Node.exe cục bộ bị Access is denied; đã chạy JavaScript thực tế bằng phiên Node REPL có sẵn (`node:vm`): selfTest cờ vua 14/14 (perft 3 = 8902), ô ăn quan 7/7 (200 ván hai bot kết thúc, bảo toàn 50 dân + 2 quan), Ma Sói 14/14, tất cả `ok: true`, `failed: []`. Đã thử nhánh đăng ký trình duyệt GAME_RULES và view JSON của cả ba module; chuyển trạng thái Xong.
- 2026-11-04 · Claude · Xong việc 14: `game-rooms.js` (ghép ngẫu nhiên, phòng riêng mã 4 chữ, chơi với máy, Ma Sói tự bắt đầu sau 20 giây khi đủ 5 người, thắng người +18 / thắng máy +3 công đức), trang `/tro-choi` có giao diện dự phòng chờ `ui-*.js` của Antigravity. Kiểm tra lại luật của Codex: perft 3 = 8902, 50 ván Ô ăn quan bot không lỗi, ván Ma Sói 5 người qua máy chủ chạy trọn. Thêm nút nhảy (Space / nút Nhảy), người khác thấy nhảy. Gõ đầu giờ trừ 2 công đức cả người gõ lẫn người bị gõ.
- 2026-11-04 · Claude · Theo yêu cầu người dùng, chuyển việc 13 (giao diện 3 trò chơi bàn) từ Antigravity sang Codex.
- 2026-11-04 · Codex · Xong Việc 13: tạo `ui-chess.js`, `ui-oanquan.js`, `ui-masoi.js` đúng GAME_UI và `ui-demo.html` dùng luật thật, đổi bên/vai, máy đi một nước, tăng tốc pha và các thế thử. Có phong cấp, bàn xoay theo người xem, hoạt ảnh rải 180ms/bước, vai bí mật/lựa chọn/phiếu bầu/đồng hồ Ma Sói; CSS riêng, co bàn theo bề rộng. Kiểm tra cú pháp đạt; Node VM + DOM giả lập đạt 66 kiểm tra tương tác và luồng demo; selfTest luật đạt 35/35 (cờ 14, ô ăn quan 7 gồm 200 ván bot, Ma Sói 14). Chưa kiểm tra trực quan trong trình duyệt vì môi trường không nạp được Playwright; nhờ Claude mở demo ở 360px và ghép trang `/tro-choi`. Không sửa hub hay luật.
- 2026-11-04 · Claude · Ghép giao diện việc 13 của Codex, thử trên khung điện thoại 375px: cờ vua (sửa màu quân trắng/đen bị ngược), ô ăn quan (rải có hoạt ảnh, máy đánh lại), Ma Sói 5 người (đêm cắn, sang ngày lộ vai). Không tràn ngang.
- 2026-11-04 · Claude · Thêm việc 15 (Codex: hình 14 kiếp đầu thai) và việc 16 (Claude: quay kiếp, màn công bố, đồng bộ).
- 2026-11-04 · Codex · Xong mã Việc 15: tạo `reborn.js`, đủ 14 form × 2 giới tính, mắt hai điểm sáng/má hồng, đặc trưng từng con giáp, người hiện đại, tiên nữ/tiên ông râu bạc với mây/dải lụa/hào quang; có hoạt ảnh, đổi màu độc lập và cache geometry/material giữa nhân vật. Node REPL kiểm tra cú pháp đạt; bộ giả lập geometry theo công thức r128 kiểm đếm 28 biến thể: 13–27 mesh, 1.212–2.484 tam giác; 1.369 kiểm tra cache/đổi màu/hoạt ảnh/fallback đạt. Chưa chạy trên Three.js thật hay kiểm tra trực quan vì không có thư viện cục bộ và tải mạng bị chặn; nhờ Claude chạy `__rebornSelfTest(THREE)` (28 dòng, kiểm thêm chiều cao, đỉnh và ma trận hữu hạn) và xem hình khi ghép. Chỉ sửa `reborn.js` và bảng này, không sửa `avatars-gen.js`.
- 2026-11-04 · Claude · Ghép `reborn.js` của Codex: self-test trong trình duyệt 28/28 đạt (tối đa 27 mesh, 2.484 tam giác), xem tận mắt cả 14 hình. Xong việc 16 (quay kiếp 45% người / 45% con giáp / 10% tiên, 3 màn công bố) và việc 18 (cảnh bàn thờ, 5 quầy ăn, đang dùng hình tạm chờ `scenes.js`).
- 2026-11-04 · Claude · Ghép `scenes.js` của Codex (việc 17): self-test trong trình duyệt đạt (phòng 127 mesh, quầy 35–45 mesh), xem tận mắt phòng thờ và quầy ăn. Giảm độ sáng đèn phòng thờ cho màu ấm hơn.
