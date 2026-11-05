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
| Antigravity | `src/online/avatars-gen.js`, `phan-cong/kiem-thu.md`, `src/online/chant-ui.js`, `src/online/chant-demo.html` | `avatars.js`, `extras.js`, mọi file `*.template.html` |

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
| 19 | Bàn buffet rau củ quả (`makeFoodStall("buffet")`) | Codex | Xong | [codex.md](codex.md) |
| 20 | Trò chơi công viên: xích đu, đu quay, tàu lượn + cổng (`src/online/rides.js`) | Codex | Xong | [codex.md](codex.md) |
| 21 | Mở rộng bản đồ: Công viên Âm Phủ phía nam, lên/xuống trò chơi, camera, đồng bộ người ngồi | Claude | Xong | |
| 22 | Quầy bắn súng hội chợ: quầy, bia di động, súng (`src/online/booth.js`) | Codex | Xong | [codex.md](codex.md) |
| 23 | Chơi bắn súng: ngắm, bắn, tính điểm, cộng công đức | Claude | Xong | |
| 24 | Hai tòa nhà: Phòng Karaoke Âm Phủ + Chùa Niệm Phật (`src/online/rooms.js`) | Codex | Xong | [codex.md](codex.md) |
| 25 | Giao diện niệm Phật + tụng kinh (`src/online/chant-ui.js`) | Antigravity | Xong | [antigravity.md](antigravity.md) |
| 26 | Máy chủ karaoke (hàng chờ YouTube, đồng bộ, chấm điểm) + niệm Phật chung, ghép 2 phòng vào game | Claude | Xong | |
| 27 | Mở rộng bảng chùa của Antigravity: tự niệm, giọng đọc, thiền, dâng lễ, lạy Phật, đèn nguyện (`src/online/chant-ui.js`) | Codex | Xong | [codex.md](codex.md) |
| 28 | Máy chủ đèn nguyện, công đức các việc trong chùa, hiệu ứng 3D (lạy, dâng lễ, đèn bay) | Claude | Xong | |
| 29 | Rạp phim Âm Phủ (`makeCinemaRoom` trong `rooms.js`) | Codex | Xong | [codex.md](codex.md) |
| 30 | Rạp phim (gửi video, bình chọn, chiếu đồng bộ), video chiếu thẳng lên màn 3D, camera nhìn màn khi ngồi, góc nhìn rộng trong nhà | Claude | Xong | |
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
- 2026-11-04 · Claude · Ghép bàn buffet của Codex (việc 19, 88 mesh): đặt cạnh Vọng Hương Đài, ăn +8 công đức, chờ 8 giây. Thêm ảnh `14-kiep-dau-thai.jpg` để xem trước 14 hình đầu thai.
- 2026-11-04 · Claude · Ghép `rides.js` của Codex (việc 20): self-test r128 đạt (xích đu 41, đu quay 121, tàu lượn 138, cổng 28 mesh). Xong việc 21: khu Công viên Âm Phủ 60×47 m phía nam (san phẳng đất, dọn dung nham/núi đao, lối đi qua Quỷ Môn Quan), bấm E để lên/xuống trò, +2 công đức mỗi lần lên (chờ 8 giây), camera đi theo, người khác thấy mình ngồi đúng ghế.
- 2026-11-05 · Codex · Xong việc 22: `booth.js` quầy bắn súng hội chợ (14 bia: 5 bia tròn, 5 vịt chạy ngang, 4 đầu lâu nhô lên), súng ngắm theo chuột, 104 mesh.
- 2026-11-05 · Claude · Ghép `booth.js` (self-test đạt, 104 mesh, 4.570 tam giác). Xong việc 23: quầy đặt giữa công viên, bấm E cầm súng, 12 viên / 30 giây, bấm hoặc chạm vào bia để bắn, hồng tâm ×3, vòng giữa ×2; hết đạn/giờ được +1 công đức mỗi 25 điểm (tối đa 15), lưu kỷ lục. Đã thử bắn trúng hồng tâm +90, kết thúc được +7.
- 2026-11-06 · Codex · Xong việc 24: `rooms.js` Phòng Karaoke Âm Phủ (sân khấu, micro, màn hình 16:9, 20 ghế, 117 mesh) và Chùa Niệm Phật (tượng A Di Đà, bàn thờ, mõ, 20 bồ đoàn, 157 mesh).
- 2026-11-06 · Claude · Xong việc 26: `halls.js` trên máy chủ (hàng chờ YouTube mỗi người 2 bài, lấy tên bài, đồng bộ giờ phát, qua bài khi đủ nửa phòng, chấm 1–5★ người hát được tối đa +10 công đức; đếm câu niệm cả chùa theo ngày, chặn bấm quá 6 câu/giây). Ghép 2 tòa nhà hai bên công viên, cửa nhìn ra công viên, mái ẩn và camera giữ trong phòng khi vào. Niệm 108 câu được +3 công đức. Đang dùng giao diện niệm tạm, chờ `chant-ui.js` của Antigravity (việc 25). Sửa lỗi cũ: vị trí người khác bị cắt ở ±60 m. Đã thử 2 tab: video lệch < 1 giây, chấm 5★ được +10.
- 2026-11-06 · Antigravity · Xong việc 25: tạo `src/online/chant-ui.js` và `src/online/chant-demo.html`. Tràng hạt 108 hạt xoay một nấc mỗi câu với hạt mẫu và hạt phát sáng, nút niệm lớn kasaya tròn; chế độ tụng Bát Nhã Ba La Mật Đa Tâm Kinh tô sáng từng chữ theo nhịp mõ, đổi tốc độ chậm/vừa/nhanh, hồi hướng khi hoàn thành; bộ đếm lượt này, hôm nay, cả chùa và top 5 công đức; thông báo người khác đang niệm không spam; phím Space/Enter/Esc; giao diện kem/vàng đồng trang nghiêm, tối đa 42% chiều cao màn hình điện thoại dọc và dạt phải khi màn hình ngang; đã kiểm tra cú pháp và build sạch vào dist/am-phu-online.html.
- 2026-11-06 · Codex · Xong việc 27: mở rộng `chant-ui.js` của Antigravity thành bảng chùa 5 thẻ (Niệm Phật + tự niệm có nhịp, Tụng kinh + mõ tự động + giọng đọc, Thiền hẹn giờ có nhịp thở, Dâng lễ + Lạy Phật, Đèn nguyện).
- 2026-11-06 · Claude · Xong việc 28: công đức trong chùa (tự tay 108 câu +3, tự niệm +1, tụng trọn Tâm Kinh +5/+2, dâng lễ/lạy +1, thiền +1/phút, đèn nguyện +2), nhân vật lạy 3 lạy người khác thấy, đèn bay lên trong chánh điện, máy chủ giữ 30 đèn nguyện gần nhất.
- 2026-11-06 · Codex · Xong việc 29: Rạp phim Âm Phủ (32 ghế, màn 16:9, rèm, poster, quầy bắp, bảng marquee; 218 mesh).
- 2026-11-06 · Claude · Xong việc 30: `halls.js` gộp karaoke và rạp phim vào một khuôn phòng xem chung (bình chọn ▲ video muốn xem trước). Rạp đặt phía nam công viên. Video YouTube đặt khớp lên màn chiếu 3D bằng biến đổi phối cảnh; ngồi ghế thì camera ngang tầm mắt nhìn thẳng màn, bảng tự thu nhỏ. Trong nhà camera lùi xa, tường phía camera tự ẩn. Đã thử: video chạy trên màn rạp và màn karaoke, bình chọn, tự niệm.
- 2026-11-06 · Claude · Ngồi ghế xem (rạp phim, karaoke): kéo chuột / vuốt để nhìn quanh, lăn chuột phóng to màn chiếu, nhấp đúp nhìn thẳng màn lại; đi bộ thì kéo chuột xoay camera như cũ. Giữ góc nhìn rộng 72° khi điện thoại dựng dọc.
- 2026-11-06 · Claude · Màn tạo nhân vật có 2 nút: Vào thẳng (mặc định, Enter) hoặc Xem giới thiệu (cảnh bàn thờ). Trong cảnh bàn thờ có nút Bỏ qua giới thiệu; menu trong game có nút Xem giới thiệu để xem lại, xem xong về đúng chỗ đang đứng. Sửa nhân vật giữa chừng thì nút thành Lưu nhân vật.
