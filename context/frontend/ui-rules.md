# Mori — UI Rules & Stitch Layout Guidelines

Tài liệu này quy định các tiêu chuẩn triển khai giao diện người dùng dựa trên bản thiết kế thực tế [design/stitch-ui.html](file:///Users/justhuy/.gemini/antigravity-ide/scratch/mori/design/stitch-ui.html).

---

## 1. Hình Học & Toán Học Của Vòng Tròn Đếm Ngược (Radial Timer Geometry)

Vòng tròn đồng hồ là trung tâm thị giác (Hero Element) của Mori. Các thông số kỹ thuật được cố định:

- **Khung chứa (Container):** Chiều rộng `260px`, chiều cao `260px`.
- **Lớp Vầng sáng Mờ (Glow Layer):**
  - Đặt phía sau SVG (`absolute inset-2 -z-10`).
  - Màu nền: `surface-container-low` (`#f2f3ff`), bo tròn `rounded-full`, làm mờ `blur-xl` với độ trong suốt `opacity-70`.
- **Thông số SVG:**
  - `viewBox="0 0 260 260"`, xoay góc `-90deg` để điểm bắt đầu chạy từ đỉnh 12 giờ.
  - Tọa độ tâm: `cx = 130`, `cy = 130`.
  - Bán kính: `r = 114`.
  - Độ dày nét vẽ: `strokeWidth = 5`.
  - Chu vi đường tròn:
    $$C = 2 \times \pi \times 114 \approx 716.28\text{ px}$$
- **Vòng rãnh nền (Background Track):**
  - Màu nét: `surface-container-high` (`#e2e7ff`).
  - `fill="none"`.
- **Cung tiến độ hoạt động (Active Progress Arc):**
  - Màu nét: `primary` (`#004ac6`) khi ở Focus Mode; `tertiary` (`#006329`) khi ở Break Mode.
  - `strokeLinecap="round"`.
  - `strokeDasharray = 716.28`.
  - Công thức tính độ lệch (Dashoffset) theo tiến độ $p \in [0.0, 1.0]$:
    $$\text{strokeDashoffset} = 716.28 \times (1 - p)$$
  - Chuyển động mượt mà với Reanimated `withTiming(..., { duration: 1000, easing: Easing.linear })`.

---

## 2. Quy Tắc Bố Cục Màn Hình Chính (Main Screen Layout)

Theo cấu trúc từ trên xuống của [stitch-ui.html](file:///Users/justhuy/.gemini/antigravity-ide/scratch/mori/design/stitch-ui.html):

1. **Header & Context Bar:**
   - Trái: Số phiên hiện tại (`"SESSION 2 OF 4"`, nhãn `label-caps` chữ hoa, màu `on-surface-variant`).
   - Phải: Nút mở Settings dạng icon tròn 40x40 pt.
2. **Thanh Chuyển Chế Độ (Mode Selector Pill):**
   - Container dạng viên thuốc (`rounded-full`), nền `surface-container` (`#eaedff`), padding `4px`.
   - Tab kích hoạt: Nền `primary` (`#004ac6`), chữ trắng `on-primary`, bóng nhẹ `shadow-sm`, padding ngang `24px`, cao `32px`.
   - Tab không kích hoạt: Chữ `on-surface-variant` (`#434655`), nền trong suốt.
3. **Cụm Đồng Hồ Tròn:**
   - Nhãn trên: `"TIME TO FOCUS"` hoặc `"REST YOUR MIND"` (`label-caps`, uppercase, tracking rộng).
   - Số đếm ngược: `display-timer-compact` (56px) hoặc `display-timer` (76px), font-weight 300, bắt buộc bật `tabular-nums`.
   - Phụ đề dưới: Câu châm ngôn ngắn gọn dạng in nghiêng (`italic`, cỡ 13px, ví dụ: `"One thing at a time."`).
4. **Nút Điều Khiển Chính (Primary Action Button):**
   - Kích thước: Rộng `240px`, cao `56px` (`h-14`), bo tròn `rounded-full`.
   - Nền: `primary` (`#004ac6`), icon play/pause trắng, chữ `"Start Focus"` / `"Pause"`.
   - Hiệu ứng bấm: `active:scale-[0.98]`, rung haptic nhẹ.
   - Bên dưới có nút phụ Reset nhỏ hoặc phụ đề hướng dẫn `"Tap to pause or adjust"`.
5. **Thanh Chọn Nhanh Âm Thanh Môi Trường (Ambient Quick Row):**
   - Tiêu đề hàng: `"Ambient sounds"` và link `"Soundscapes >"`.
   - Lưới 3 cột gồm: Rain, Ocean Waves, Cafe. Card đang chọn có viền hoặc nền `surface-container-high` nổi bật.

---

## 3. Quy Tắc Bottom Sheet Âm Thanh (Ambient Sound Picker)

1. **Backdrop & Khung Chứa:**
   - Lớp mờ nền (Overlay): `bg-black/30` với hiệu ứng làm mờ nhẹ.
   - Thân sheet: Nền trắng `surface-container-lowest`, bo góc trên `rounded-t-[28px]`.
   - Grab Bar: Rộng `48px` (`w-12`), cao `4px`, bo tròn `rounded-full`, màu `outline-variant` (`#c3c6d7`).
2. **Danh Sách Track Âm Thanh:**
   - Mỗi hàng có icon tròn, tên track, mô tả phụ, chỉ báo sóng âm mini đang chuyển động (animated wave bars) và icon checkmark xanh khi được chọn.
3. **Thanh Trượt Âm Lượng Cảm Ứng (Tactile Volume Slider):**
   - Chiều cao rãnh: `8px`, bo tròn `full`, nền `surface-container-high`.
   - Phần màu đã lấp đầy: Nền `primary`.
   - Con trượt (Thumb): Hình tròn `20px × 20px`, nền trắng, có bóng đổ nổi bật và viền mỏng màu primary.
4. **Công Tắc "Mute during breaks":**
   - Phong cách iOS Switch mượt mà, kích thước chuẩn 51×31 pt.

---

## 4. Tiêu Chuẩn Tiếp Cận & Cảm Ứng (Accessibility & Touch Targets)
- Vùng chạm tương tác tối thiểu: **44×44 pt** cho tất cả các nút bấm, stepper `+`/`-`, và switch.
- Độ tương phản chữ: Toàn bộ chữ chính (`#131b2e`) trên nền (`#faf8ff`) đạt chuẩn **WCAG AAA** (> 7:1).
- Tránh số bị nhảy vị trí: Bắt buộc cấu hình `fontVariant: ['tabular-nums']` trong StyleSheet cho text thời gian.
