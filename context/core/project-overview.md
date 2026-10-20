# Mori — Project Overview

## 1. Bài toán kinh doanh & Giá trị cốt lõi
Trong môi trường làm việc hiện đại, người dùng thường xuyên bị phân tâm bởi vô số thông báo và áp lực công việc. Các ứng dụng Pomodoro hiện có trên thị trường thường quá phức tạp, chứa nhiều tính năng rườm rà, quảng cáo gây gián đoạn hoặc màu sắc quá kích thích thị giác.

**Mori** ra đời như một ứng dụng Pomodoro tối giản, mang lại không gian tập trung tĩnh lặng, thanh lọc và tinh tế thông qua sự kết hợp giữa:
1. Chu trình thời gian Pomodoro kinh điển (25 phút tập trung - 5 phút nghỉ ngơi).
2. Âm thanh môi trường tự nhiên tĩnh tâm (Mưa rơi, Sóng biển, Quán cà phê).
3. Giao diện tối giản mang tông màu xanh biển êm dịu, không rườm rà, tập trung trọn vẹn vào trải nghiệm người dùng.

## 2. Chân dung người dùng (User Personas)
- **Kiến trúc sư / Lập trình viên / Nhà văn:** Cần những khoảng thời gian tập trung sâu (Deep Work), thích không gian tối giản, không bị làm phiền.
- **Sinh viên / Học sinh:** Cần phân chia thời gian ôn thi hiệu quả, kết hợp âm thanh tự nhiên để giảm căng thẳng và tăng khả năng ghi nhớ.
- **Người làm việc từ xa (Remote Workers):** Cần duy trì kỷ luật thời gian làm việc - nghỉ ngơi để tránh kiệt sức (burnout).

## 3. Các luồng người dùng chính (Core User Flows)

### Flow 1: Chu trình Pomodoro tiêu chuẩn (Standard Focus Session)
1. Người dùng mở ứng dụng, màn hình chính hiển thị đồng hồ đếm ngược tròn ở trạng thái sẵn sàng (mặc định 25:00 cho Focus Mode).
2. Người dùng nhấn nút **Start**. Đồng hồ bắt đầu đếm ngược dựa trên timestamp, vòng tròn tiến độ co lại mượt mà.
3. Người dùng có thể nhấn **Pause** để tạm dừng, **Resume** để tiếp tục, hoặc **Reset** để quay về thời gian ban đầu.
4. Khi hết 25 phút, timer hoàn thành: kích hoạt haptic feedback, thông báo hoàn thành phiên tập trung, tự động chuyển sang chế độ **Break Mode** (5:00) và chờ người dùng bắt đầu phiên nghỉ.

### Flow 2: Trải nghiệm Âm thanh môi trường (Ambient Soundscape Flow)
1. Trên màn hình chính, người dùng thấy phần điều khiển Soundscape nhanh hoặc mở Bottom Sheet âm thanh.
2. Danh sách âm thanh gồm: **Rain (Mưa)**, **Ocean Waves (Sóng biển)**, **Coffee Shop (Quán cà phê)**, và **Off (Tắt)**.
3. Người dùng chọn 1 âm thanh: hệ thống dừng âm thanh hiện tại (nếu có), phát âm thanh mới theo chế độ lặp vô tận (loop).
4. Người dùng điều chỉnh thanh trượt Volume (0% - 100%) hoặc bấm nút Mute nhanh.
5. Khi đóng bottom sheet hoặc tạm dừng timer, âm thanh tiếp tục phát hoặc dừng theo cài đặt người dùng.

### Flow 3: Chuyển đổi trạng thái ứng dụng (Foreground/Background Lifecycle)
1. Người dùng bấm Start và khóa màn hình điện thoại hoặc chuyển sang ứng dụng khác.
2. Hệ thống ghi nhận mốc thời gian bắt đầu (`startTimestamp`) và thời điểm dự kiến kết thúc (`targetTimestamp`).
3. Khi người dùng mở lại app (Foreground), Timer Engine tự động tính toán lại thời gian còn lại chính xác dựa trên chênh lệch `targetTimestamp - Date.now()`, hoàn toàn không bị trôi thời gian do `setInterval` của hệ điều hành bị bóp nghẹt.

### Flow 4: Tùy chỉnh cấu hình (Settings & Preferences Flow)
1. Người dùng bấm biểu tượng Settings trên Header màn hình chính.
2. Màn hình hoặc Modal cài đặt mở ra cho phép:
   - Thay đổi thời lượng Focus (10 - 60 phút).
   - Thay đổi thời lượng Break (1 - 30 phút).
   - Bật/tắt Haptic Feedback khi bấm nút hoặc hoàn thành phiên.
   - Nút khôi phục cài đặt gốc (Reset to Defaults: Focus 25m, Break 5m, Volume 80%, Haptics On).
3. Khi người dùng xác nhận, dữ liệu được validate chặt chẽ và lưu tức thì vào `AsyncStorage`.
