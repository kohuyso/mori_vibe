# Mori — Testing Standards

## 1. Triết lý Kiểm thử (Testing Philosophy)
- **Behavior & User Journey First:** Viết test tập trung vào hành vi người dùng và tính toàn vẹn của kết quả, không kiểm tra chi tiết cài đặt nội bộ (implementation details).
- **Spec-First (Test-Driven):** Trong mỗi Phase, định nghĩa các ca kiểm thử dựa trên Acceptance Criteria trước khi triển khai mã nguồn.

## 2. Các tầng Kiểm thử bắt buộc

### Tầng 1: Unit Tests cho Domain Logic thuần túy (100% Coverage)
- `timerEngine.test.ts`:
  - Khởi tạo session với thời lượng focus và break.
  - Tính toán thời gian còn lại chính xác khi chạy (`calculateRemainingTime`).
  - Xử lý hành vi Pause: lưu giữ khoảng thời gian đã trôi qua.
  - Xử lý hành vi Resume: tạo mốc `targetTimestamp` mới chính xác.
  - Xử lý quay lại sau background: mô phỏng thời gian trôi qua `Date.now() + 60000` -> giảm đúng 60 giây.
  - Chặn phát sinh duplicate completion event khi hết giờ.
- `settingsStorage.test.ts`:
  - Lưu và đọc cấu hình thành công.
  - Nhận diện dữ liệu rác/hỏng trong storage và tự động khôi phục về `DEFAULT_SETTINGS`.
  - Validate giá trị biên (ví dụ: thời lượng focus không được < 1 hoặc > 120 phút).

### Tầng 2: Hook & Component Integration Tests
- `useTimer.test.ts`:
  - Render hook, gọi `start()`, kiểm tra cập nhật snapshot sau các nhịp thời gian giả lập (`jest.useFakeTimers()`).
  - Chuyển đổi trạng thái từ Focus (25m) sang Break (5m) khi hoàn thành.
- `CircularTimer.test.tsx`:
  - Hiển thị đúng định dạng chuỗi `MM:SS` (ví dụ: `25:00`, `04:59`).
  - Kiểm tra khả năng hiển thị accessible label cho người dùng khiếm thị.
- `SoundscapePicker.test.tsx`:
  - Chọn một âm thanh mới -> đảm bảo âm thanh cũ được yêu cầu dừng và giải phóng.

## 3. Quy tắc Mocking & Giả lập môi trường
- Sử dụng Fake Timers (`jest.useFakeTimers()`) cho các bài test liên quan đến thời gian của Timer.
- Mock các module Native của Expo (`expo-audio`, `expo-haptics`, `@react-native-async-storage/async-storage`) thông qua các mock helper chuẩn được cung cấp trong thư mục `src/test/mocks/`.
- Không mock logic nội bộ của `TimerEngine` khi test tích hợp.
