# Việc của Claude

File của Claude: `src/tour/*`, `src/online/online.template.html`, `build.js`, `README.md`.

## Đã xong

- Trang tour "Âm Phủ Travel": thang máy B1→B18, thẻ từng tầng, form đặt vé một chiều.
- Mini game bản đồ 2D 18 phòng, NPC, nhặt vàng mã.
- Điện Diêm La 2D: gõ mõ, thắp hương, thỉnh chuông, đốt vàng mã, thả đèn, sớ cầu nguyện chung.
- Thế giới 3D "Âm Phủ Online": sân, đỉnh hương, mõ, chuông, lò vàng mã, sông Huyết Hà, cầu Nại Hà, Điện Diêm La, 18 bia tầng, dung nham, núi đao, tàn lửa bay.
- Nhiều người chơi: chọn cõi (4 máy chủ, đếm người online), tạo nhân vật, thấy nhau di chuyển, chat bong bóng, hiệu ứng hành động đồng bộ.
- Công đức, giảm án 108 công đức/tầng, bảng xếp hạng, đầu thai qua Mạnh Bà.
- `build.js` ghép nguồn thành `dist/`.

## Đang làm

- Việc 10: ghép `avatars.js` của Codex và `extras.js` của Antigravity khi có, xuất bản bản mới, sửa lỗi trong `kiem-thu.md`.

## Ghi chú kỹ thuật

- Nhiều người chơi dùng `room` presence của Claude Artifact: mỗi người gửi vị trí, hình dạng, hành động và câu chat gần nhất (tối đa ~8 lần/giây).
- Công đức lưu ở `db` (`merit/<id người dùng>`), mỗi người chỉ sửa được dòng của mình.
- Mở file trong `dist/` trực tiếp trên máy thì chỉ chơi một mình được.
