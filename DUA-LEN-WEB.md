# Đưa Âm Phủ Online lên web riêng

Game có máy chủ riêng (`server.js`) lo việc nhiều người chơi thấy nhau, chat và bảng công đức. Không cần cài thêm gói nào, chỉ cần Node.js 18 trở lên.

Có hai cách, chọn một:

## Cách 1: Chạy trên máy của bạn, có link ngay (miễn phí, tạm thời)

Hợp để chơi thử với bạn bè tối nay.

1. Bấm đúp file `chay-tren-may.bat`.
2. Cửa sổ sẽ hiện một link dạng `https://xxxx-xxxx.trycloudflare.com`. Gửi link đó cho mọi người.
3. Muốn tắt thì đóng các cửa sổ đen.

Lưu ý:

- Máy tính phải bật và cửa sổ phải mở thì mọi người mới vào được.
- Mỗi lần chạy lại sẽ ra **link mới**.
- Bảng công đức lưu trong thư mục `data/` trên máy bạn.

## Cách 2: Đưa lên host cố định (link không đổi)

Gợi ý: **Render.com** (có gói miễn phí, hỗ trợ WebSocket).

1. Tạo tài khoản GitHub (nếu chưa có) và tạo một repository mới, ví dụ `am-phu-online`.
2. Đưa cả thư mục `game 18 tầng` lên repository đó. Cách dễ nhất: trên trang repository bấm **Add file → Upload files**, kéo cả thư mục vào (file `.gitignore` đã loại sẵn những thứ không cần).
3. Vào https://render.com, đăng nhập bằng GitHub, chọn **New → Web Service**, chọn repository vừa tạo.
4. Điền:
   - **Runtime**: Node
   - **Build Command**: `node build.js`
   - **Start Command**: `node server.js`
   - **Instance Type**: Free
5. Bấm **Create Web Service**. Vài phút sau Render cho link dạng `https://am-phu-online.onrender.com`. Đó là web của bạn.

Lưu ý với gói miễn phí của Render:

- Không ai vào trong 15 phút thì máy chủ ngủ, người đầu tiên vào sau đó phải chờ khoảng 30–60 giây.
- Bảng công đức bị xoá mỗi lần máy chủ khởi động lại. Muốn giữ lâu dài thì gắn thêm ổ đĩa (Disk, trả phí) và đặt biến môi trường `DATA_DIR` trỏ tới ổ đó.
- Muốn tên miền riêng (ví dụ `amphu.vn`) thì mua tên miền rồi thêm vào mục **Custom Domains** của Render.

Các host khác cũng chạy được vì chỉ cần lệnh `node server.js`: Railway, Fly.io, một VPS bất kỳ. Cổng lấy từ biến `PORT`.

## Đường dẫn trên web

| Đường dẫn | Trang |
|---|---|
| `/` | Game Âm Phủ Online |
| `/tour` | Trang tour Âm Phủ Travel |
| `/health` | Kiểm tra máy chủ còn sống, kèm số người đang kết nối |

## Sức chứa

- Mỗi máy chủ chịu tối đa 300 kết nối cùng lúc (sửa `MAX_CLIENTS` trong `server.js`). 10–15 người là rất nhẹ.
- Mỗi người gửi tối đa khoảng 8 lần cập nhật mỗi giây. Máy chủ chặn ai gửi quá 30 tin mỗi giây.
- Công đức không thể tăng quá 400 mỗi lần lưu, để tránh sửa số bừa.

## Khi mở trong Claude

Bản trên Claude (link `claude.ai/artifact/...`) vẫn dùng hệ thống nhiều người chơi của Claude. Bản web riêng dùng `server.js`. Người chơi ở hai nơi **không thấy nhau**.
