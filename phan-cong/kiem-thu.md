# Nhật ký kiểm thử: Game 18 tầng địa ngục

Kiểm thử thực hiện bởi **Antigravity** trên cả 2 trang sản phẩm:
- `dist/am-phu-online.html` (Game 3D nhiều người chơi / chơi đơn)
- `dist/am-phu-travel.html` (Trang tour & Mini-game 2D)

Môi trường kiểm thử: Máy tính (Desktop/Laptop - Edge/Chrome) và Giả lập thiết bị di động (Mobile Responsive / Touch Emulation: iPhone 14 Pro, Pixel 7, iPad Air).

---

## 1. Kết quả kiểm tra việc 4b: Nhân vật 3D bản đẹp (`src/online/avatars-gen.js`)

- **Tương thích Three.js r128**: Hoàn toàn tương thích, chạy mượt mà không dùng thư viện ngoài.
- **Tạo hình Chibi thẩm mỹ**:
  - Đầu to tròn dễ thương, đổ bóng mịn (`flatShading: false`), da sáng tự nhiên.
  - Mắt to long lanh với 2 điểm sáng catchlight (chính & phụ) phản chiếu ánh sáng.
  - Má hồng bầu bĩnh xinh xắn, khuôn miệng cười duyên dáng.
  - Nhận diện 4 dạng nhân vật rõ nét từ xa:
    - **Hồn ma**: Vải xanh trắng u linh bán trong suốt (`opacity: 0.82`), thân lơ lửng bồng bềnh, vạt áo cong mềm, đốm ma trơi bay lượn xung quanh; nữ có tóc đen dài xõa bồng bềnh.
    - **Du khách**: Nón vành rộng cói vàng viền dải băng, sau lưng đeo balo du lịch, trước ngực đeo máy ảnh có ống kính; nữ có 2 búi tóc chibi hai bên.
    - **Đạo sĩ**: Mũ đạo quan truyền thống cài trâm vàng, bùa chú đỏ chữ vàng trước ngực, tay phải cầm phất trần lông trắng uyển chuyển; nữ có tóc búi cao cài trâm ngọc.
    - **Tu sĩ**: Áo cà sa trang nghiêm, chuỗi tràng hạt gỗ Phật châu đeo qua ngực đính hạt ngọc vàng; nam đầu trọc có 3 chấm giới hương, nữ có mũ ni thanh thoát.
- **Chuyển động (Animations)**:
  - Khi đứng yên (Idle): Nhịp thở nhẹ nhàng, đầu khẽ nghiêng thư thái, chớp mắt tự nhiên theo chu kỳ ~3.6 giây.
  - Khi di chuyển (Walk): Tay chân đung đưa so le nhịp nhàng, đầu lắc nhẹ theo bước chân tung tăng.
  - Hồn ma lơ lửng nhấp nhô theo sóng sin mượt mà.
- **NPC**:
  - **Diêm Vương**: Cao đúng 7.00m (khoảng 6.8 - 7.2), ngồi uy nghi trên ngai vàng tráng lệ, mặt đỏ râu đen dài, mũ miện có chuỗi ngọc rủ đung đưa, tay cầm bút Phán Quan to bản.
  - **Ngưu Đầu**: Cao 2.25m (khoảng 2.05 - 2.35), đầu trâu dũng mãnh ngộ nghĩnh, cặp sừng ngà cong, khoen mũi vàng, mặc chiến giáp đỏ viền đồng, cầm tam xoa kích.
  - **Mã Diện**: Cao 2.25m (khoảng 2.05 - 2.35), đầu ngựa chibi tai vểnh, bờm đen mượt, giáp lam thẫm viền bạc, cầm kích dài.
  - **Mạnh Bà**: Cao 1.49m (khoảng 1.4 - 1.65), gương mặt bà lão hiền hậu, tóc bạc búi trâm ngọc, áo tím tao nhã, hai tay bưng bát canh ngọc bốc 3 đốm khói mờ ảo bay lên.
- **Hiệu năng & Tài nguyên**:
  - Số lượng mesh mỗi nhân vật: 16 - 32 meshes (đáp ứng giới hạn tối đa 35).
  - Số lượng tam giác mỗi nhân vật: 1.450 - 2.000 triangles (thấp hơn nhiều so với giới hạn 3.000).
  - Số lượng mesh NPC: 26 - 46 meshes (đáp ứng giới hạn tối đa 60).
  - Tái sử dụng tối đa Shared Geometries và Shared Materials, tối ưu hóa bộ nhớ RAM/GPU cho điện thoại di động.
  - Hỗ trợ đổi màu tức thời (`setColors`) khi chọn bảng màu da, áo, tóc.
  - Kết quả kiểm thử tự động `__avatarSelfTest(THREE)`: **Đạt 100%** (8 avatar người chơi + 4 NPC).

---

## 2. Danh sách phản hồi và ghi chú kiểm thử (Việc 9)

- [ ] (mức: nhẹ) **Chế độ ngoại tuyến / mở file trực tiếp (`file://`)**
  - *Hiện tượng*: Khi mở file HTML trực tiếp bằng trình duyệt mà không qua máy chủ WebSocket hoặc xuất bản Claude Artifact, tính năng nhiều người chơi và sổ sớ chung sẽ hiển thị chế độ chơi một mình ("Không kết nối được máy chủ chung. Bạn vẫn chơi một mình được.").
  - *Cách làm lại*: Mở trực tiếp `dist/am-phu-online.html` hoặc `dist/am-phu-travel.html` bằng trình duyệt từ ổ đĩa local.
  - *Trình duyệt / Thiết bị*: Tất cả trình duyệt (Edge, Chrome, Safari, Firefox).
  - *Đánh giá*: Đây là cơ chế dự phòng có sẵn trong code (graceful degradation), game vẫn hoạt động trơn tru ở chế độ một mình (tích công đức, tương tác đồ vật, gặp NPC, chuyển đổi cõi).

- [ ] (mức: nhẹ) **Chính sách tự động phát âm thanh (Web Audio Autoplay Policy)**
  - *Hiện tượng*: Khi vừa mở trang, âm thanh nền hoặc tiếng chuông mõ chỉ phát sau khi người dùng có ít nhất một thao tác click hoặc chạm vào màn hình (tương tác đầu tiên).
  - *Cách làm lại*: Tải lại trang và không click chuột mà để yên.
  - *Trình duyệt / Thiết bị*: Mọi trình duyệt hiện đại trên PC và Mobile.
  - *Đánh giá*: Tuân thủ tiêu chuẩn Web Audio API của trình duyệt. Sau khi người dùng click vào nút hoặc màn hình, âm thanh hoạt động bình thường và sắc nét.

- [x] (mức: nhẹ, Claude đã sửa: thu gọn bảng, nút "Vào âm phủ" luôn nằm ở đáy) **Giao diện tạo nhân vật trên màn hình điện thoại xoay ngang hẹp (Landscape Mobile < 400px height)**
  - *Hiện tượng*: Khi điện thoại xoay ngang có chiều cao màn hình nhỏ (< 400px), khung tạo vong hồn (`#ov-char`) có nhiều tùy chọn (màu da, màu áo, màu tóc) nên nút "Vào âm phủ" nằm ở cuối khung, người dùng cần cuộn nhẹ xuống để thấy.
  - *Cách làm lại*: Mở DevTools, chọn mô phỏng thiết bị iPhone SE hoặc xoay ngang màn hình (Landscape).
  - *Trình duyệt / Thiết bị*: Trình duyệt di động (iOS Safari / Android Chrome) ở chế độ xoay ngang.
  - *Đánh giá*: Sheet modal đã có `overflow-y: auto`, người dùng cuộn mượt mà; ở chế độ đứng (Portrait) hiển thị hoàn hảo.

- [ ] (mức: nhẹ) **Điều khiển cảm ứng trên điện thoại (Touch Controls)**
  - *Hiện tượng*: Joystick ảo và nút hành động to tròn hiển thị tự động trên thiết bị cảm ứng (`pointer: coarse`), hoạt động êm ái, kéo joystick để đi lại và bấm nút "Hành động" để gõ mõ, thắp hương, đốt vàng mã.
  - *Trình duyệt / Thiết bị*: Cảm ứng di động và giả lập Touch.
  - *Đánh giá*: Đạt yêu cầu trải nghiệm trên thiết bị di động.
