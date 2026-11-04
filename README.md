# Game 18 tầng địa ngục

Hai trang web vui về Thập Bát Tầng Địa Ngục:

- **Âm Phủ Travel**: trang tour du lịch xuống 18 tầng, có thang máy chọn tầng, đặt vé một chiều, mini game bản đồ 2D và điện thắp hương.
- **Âm Phủ Online**: game 3D nhiều người chơi. Chọn cõi (máy chủ), tạo vong hồn, cùng đi lại trong sân Điện Diêm La, gõ mõ, thắp hương, đốt vàng mã, thả đèn để giảm án từ B18 đến lúc được đầu thai.

## Web chính thức (Render)

- Game Âm Phủ Online: https://nguoiamphu.onrender.com
- Trang tour Âm Phủ Travel: https://nguoiamphu.onrender.com/tour

## Bản trên Claude (người chơi ở đây không thấy người chơi trên web chính thức)

- Âm Phủ Online: https://claude.ai/artifact/3jJa8PZs8gm5b3dCYNiiKD
- Âm Phủ Travel: https://claude.ai/artifact/JqKw7Tud5jqAoA7cbrTnEX

## Ai làm gì

Xem [phan-cong/BANG-PHAN-CONG.md](phan-cong/BANG-PHAN-CONG.md).

## Cấu trúc

```
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
