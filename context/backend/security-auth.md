# Mori — Security & Native Permissions

Vì Mori là ứng dụng mobile local-first không thu thập dữ liệu nhạy cảm hay kết nối server bên ngoài ở bản MVP, các yếu tố an toàn tập trung vào **Tính toàn vẹn dữ liệu cục bộ** và **Quyền truy cập phần cứng thiết bị**.

## 1. Tính toàn vẹn Dữ liệu Cục bộ (Local Data Integrity)
- **Sanitization & Type-Guard:** Dữ liệu đọc từ `AsyncStorage` được coi là không đáng tin cậy (untrusted input). Phải luôn qua bộ lọc xác thực kiểu dữ liệu trước khi nạp vào bộ nhớ ứng dụng.
- **Giới hạn giá trị (Boundary Clamping):**
  - Thời lượng Focus bị chặn trong khoảng: `[1, 120]` phút.
  - Thời lượng Break bị chặn trong khoảng: `[1, 60]` phút.
  - Âm lượng bị chặn trong khoảng: `[0.0, 1.0]`.
- **Ngăn chặn lỗi tràn dữ liệu (Storage Quota):** Chỉ lưu các thông tin cài đặt tinh gọn dạng JSON dung lượng nhỏ (< 10 KB), không lưu chuỗi base64 hoặc file lớn vào `AsyncStorage`.

## 2. Quản lý Quyền Truy cập Thiết bị (Native Permissions)

### Audio Mode Configuration (`expo-audio`)
- Thiết lập cấu hình Audio Mode phù hợp trên iOS và Android để:
  - Cho phép phát âm thanh khi máy đang ở chế độ im lặng nếu người dùng chủ động bật âm thanh môi trường.
  - Không chặn các luồng âm thanh khác khi ứng dụng tắt âm thanh môi trường.

### Haptic Feedback (`expo-haptics`)
- Không yêu cầu cấp quyền runtime đặc biệt nhưng phải tôn trọng tùy chọn tắt/bật Haptic của người dùng trong ứng dụng.
- Bọc các lệnh gọi `Haptics.impactAsync` trong khối `try/catch` để không crash trên các thiết bị hoặc giả lập không hỗ trợ motor rung.

### Notifications (`expo-notifications` — Dự phòng tương lai)
- Trong phạm vi MVP, ứng dụng ưu tiên kiểm soát thời gian trong Foreground.
- Khi cần kích hoạt thông báo hết phiên Pomodoro ở giai đoạn tiếp theo, quyền `requestPermissionsAsync()` phải được hỏi một cách tự nhiên kèm giải thích lý do rõ ràng cho người dùng.
