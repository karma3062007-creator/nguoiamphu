# Game 18 tầng địa ngục

Hai trang web vui về Thập Bát Tầng Địa Ngục:

- **Âm Phủ Travel**: trang tour du lịch xuống 18 tầng, có thang máy chọn tầng, đặt vé một chiều, mini game bản đồ 2D và điện thắp hương.
- **Âm Phủ Online**: game 3D nhiều người chơi. Chọn cõi (máy chủ), tạo vong hồn, cùng đi lại trong sân Điện Diêm La, gõ mõ, thắp hương, đốt vàng mã, thả đèn để giảm án từ B18 đến lúc được đầu thai.

## Web chính thức (Render)

- Trang chủ Địa Ngục Online (6 ô chức năng, 18 tầng, bảng công đức): https://nguoiamphu.onrender.com
- Game 3D nhiều người chơi: https://nguoiamphu.onrender.com/choi
- Trò chơi bàn (Cờ vua, Ô ăn quan, Ma Sói): https://nguoiamphu.onrender.com/tro-choi
- Trang tour Âm Phủ Travel: https://nguoiamphu.onrender.com/tour
- Khi máy chủ đầy (mặc định 60 người, đổi bằng biến MAX_CLIENTS) người mới thấy màn "Địa ngục đang quá tải".

## Bản trên Claude (người chơi ở đây không thấy người chơi trên web chính thức)

- Âm Phủ Online: https://claude.ai/artifact/3jJa8PZs8gm5b3dCYNiiKD
- Âm Phủ Travel: https://claude.ai/artifact/JqKw7Tud5jqAoA7cbrTnEX

## Ai làm gì

Xem [phan-cong/BANG-PHAN-CONG.md](phan-cong/BANG-PHAN-CONG.md).

## Cấu trúc

```
src/home/home.template.html       trang chủ + màn quá tải (Claude)
src/games/hub.template.html       trang trò chơi bàn, ghép cặp (Claude)
src/games/rules-*.js              luật Cờ vua, Ô ăn quan, Ma Sói (Codex)
src/games/ui-*.js                 bàn cờ, bàn ô ăn quan, lá bài Ma Sói (Antigravity)
game-rooms.js                     phòng chơi trên máy chủ (Claude)
src/shared/logo.svg               logo Địa Ngục Online
src/shared/levels.json            nội dung 18 tầng (Codex)
src/tour/tour.template.html       trang tour (Claude)
src/online/online.template.html   thế giới 3D + nhiều người chơi (Claude)
src/online/avatars.js             nhân vật 3D + NPC (Codex)
src/online/extras.js              cảnh trang trí thêm (Antigravity)
build.js                          ghép thành dist/
dist/                             trang hoàn chỉnh, đừng sửa tay
phan-cong/                        bảng phân công và việc của từng bên
```

## Ghép trang

```bash
node build.js
```

Mở các file trong `dist/` bằng trình duyệt để xem. Phần nhiều người chơi, bảng công đức và sớ chung chỉ chạy khi trang được xuất bản trên Claude.
