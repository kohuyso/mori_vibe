# Mori — UI Design Tokens (Stitch UI Reference)

Hệ thống token thiết kế của Mori được đồng bộ hóa chuẩn xác 1:1 từ bản thiết kế [design/stitch-ui.html](file:///Users/justhuy/.gemini/antigravity-ide/scratch/mori/design/stitch-ui.html), mang phong cách Material Design 3 hiện đại, tối giản và êm dịu.

---

## 1. Bảng màu Chuẩn (Stitch MD3 Palette)

| Token Key | Mã Hex | Giá trị HSL / RGB | Ứng Dụng |
|---|---|---|---|
| `primary` | `#004ac6` | `rgb(0, 74, 198)` | Màu chủ đạo chính, thanh tiến độ đếm ngược, nút Start chính |
| `primary-container` | `#2563eb` | `rgb(37, 99, 235)` | Container chính, nút CTA nổi bật |
| `secondary` | `#1d4ed8` | `rgb(29, 78, 216)` | Trạng thái active/hover của nút chính |
| `secondary-container` | `#4069f2` | `rgb(64, 105, 242)` | Nền phụ của các card nổi bật |
| `on-primary` | `#ffffff` | `rgb(255, 255, 255)` | Chữ và icon trên nền màu primary |
| `surface` | `#faf8ff` | `rgb(250, 248, 255)` | Nền toàn ứng dụng chế độ sáng |
| `surface-container-lowest` | `#ffffff` | `rgb(255, 255, 255)` | Nền thẻ (cards), thumb trượt volume, bottom sheet modal |
| `surface-container-low` | `#f2f3ff` | `rgb(242, 243, 255)` | Hiệu ứng vầng sáng mờ (glow layer) sau vòng tròn timer |
| `surface-container` | `#eaedff` | `rgb(234, 237, 255)` | Nền container của Mode Selector (Focus/Break pill) |
| `surface-container-high` | `#e2e7ff` | `rgb(226, 231, 255)` | Vòng tròn rãnh nền của timer (background track), card âm thanh |
| `surface-container-highest` | `#dae2fd` | `rgb(218, 226, 253)` | Trạng thái hover/pressed của các nút phụ |
| `on-surface` | `#131b2e` | `rgb(19, 27, 46)` | Màu chữ chính, con số đồng hồ 25:00 |
| `on-surface-variant` | `#434655` | `rgb(67, 70, 85)` | Màu chữ phụ, nhãn trạng thái, câu châm ngôn |
| `outline` | `#737686` | `rgb(115, 118, 134)` | Đường viền các nút bấm phụ |
| `outline-variant` | `#c3c6d7` | `rgb(195, 198, 215)` | Thanh kéo Grab Bar của Bottom Sheet |
| `tertiary` (Break Mode) | `#006329` | `rgb(0, 99, 41)` | Màu xanh lục êm dịu khi chuyển sang chế độ Break |
| `tertiary-container` | `#007f36` | `rgb(0, 127, 54)` | Nền container khi ở chế độ Break |
| `on-tertiary-container` | `#c7ffca` | `rgb(199, 255, 202)` | Màu chữ nổi bật trên nền Break container |
| `error` | `#ba1a1a` | `rgb(186, 26, 26)` | Màu cảnh báo, nút reset cấu hình gốc |

---

## 2. Hệ Thống Chữ (Stitch Typography Scale)

Toàn bộ sử dụng font chữ **Inter** (với số hiển thị dạng `tabular-nums`):

| Tên Style | Cỡ chữ / Line Height | Trọng số (Weight) | Letter Spacing | Mục Đích Sử Dụng |
|---|---|---|---|---|
| `display-timer` | 76px / 84px | Light (300) | `-0.04em` | Hiển thị số đồng hồ `25:00` màn hình lớn |
| `display-timer-compact` | 56px / 64px | Light (300) | `-0.03em` | Hiển thị số đồng hồ trên màn hình vừa |
| `headline-lg` | 28px / 34px | SemiBold (600) | `-0.02em` | Tiêu đề lớn (Settings, Sheet title) |
| `headline-md` | 22px / 28px | SemiBold (600) | `-0.015em` | Tiêu đề phụ của các nhóm cài đặt |
| `title-sm` | 16px / 22px | SemiBold (600) | `-0.01em` | Tên các track âm thanh, tên mục cấu hình |
| `body-lg` | 17px / 24px | Regular (400) | `-0.005em` | Văn bản chính |
| `body-md` | 15px / 22px | Regular (400) | `normal` | Mô tả phụ trong Settings |
| `body-sm` | 13px / 18px | Regular / Italic | `normal` | Câu châm ngôn ("One thing at a time.") |
| `label-md` | 14px / 18px | Medium (500) | `normal` | Nhãn nút bấm ("Start Focus", "Break") |
| `label-caps` | 11px / 14px | SemiBold (600) | `0.12em` | Nhãn chữ hoa nhỏ ("TIME TO FOCUS") |

---

## 3. Thang Khoảng Cách (Spacing) & Lề Mobile
- `space-xs`: `4px`
- `space-sm`: `8px`
- `space-md`: `16px`
- `space-lg`: `24px`
- `space-xl`: `32px`
- `margin-mobile`: `20px` (Lề 2 bên mép màn hình di động)

---

## 4. Bán Kính Bo Góc (Border Radius)
- `sm`: `4px`
- `md`: `8px`
- `lg`: `12px`
- `xl`: `16px`
- `full`: `9999px` (Nút tròn, pill tab, slider thumb)
