# Mori — UI Component Registry (Stitch UI Implementation)

Danh mục các components giao diện người dùng được chuẩn hóa theo bản thiết kế thực tế [design/stitch-ui.html](file:///Users/justhuy/.gemini/antigravity-ide/scratch/mori/design/stitch-ui.html):

---

## 1. Feature: Timer (`src/features/timer/components/`)

### `CircularTimer.tsx`
- **Mục đích:** Vòng tròn đếm ngược chuẩn SVG theo Stitch UI với lớp vầng sáng mờ (Glow Layer) và số hiển thị trung tâm.
- **Kích thước & Hình học:** Khung 260×260px, bán kính $r=114$, chu vi $716.28\text{px}$, nét vẽ $5\text{px}$.
- **Props:**
  - `progress: number` (0.0 đến 1.0)
  - `formattedTime: string` (chuỗi dạng `MM:SS` với `tabular-nums`)
  - `mode: 'focus' | 'break'`
  - `status: 'idle' | 'running' | 'paused' | 'completed'`
  - `quoteText?: string` (Mặc định: "One thing at a time." hoặc "Breathe and recharge.")
- **Accessibility:** `accessible={true}`, `accessibilityRole="timer"`, `accessibilityLiveRegion="polite"`, `accessibilityLabel`.
- **Dependencies:** `react-native-svg` (`Svg`, `Circle`), `react-native-reanimated`.

### `ModeSelector.tsx`
- **Mục đích:** Thanh chuyển đổi Focus và Break dạng viên thuốc (Segmented Pill).
- **Styling:** Nền `surface-container` (`#eaedff`), tab active có nền `primary` (`#004ac6`) hoặc `tertiary` (`#006329`), bo tròn `rounded-full`.
- **Props:**
  - `activeMode: 'focus' | 'break'`
  - `onSelectMode: (mode: 'focus' | 'break') => void`
  - `disabled?: boolean`

### `TimerControls.tsx`
- **Mục đích:** Cụm nút điều khiển chính gồm nút bấm lớn 240×56px Start/Pause/Resume/Restart và nút phụ Reset độc lập.
- **Props:**
  - `status: 'idle' | 'running' | 'paused' | 'completed'`
  - `mode: 'focus' | 'break'`
  - `onStart: () => void`
  - `onPause: () => void`
  - `onResume: () => void`
  - `onReset: () => void`

### `SessionHeaderBar.tsx`
- **Mục đích:** Thanh ngữ cảnh đầu trang hiển thị thương hiệu `"Still •"`, nhãn phiên (`"Session 1 of 4"`) và nút mở Settings 44×44pt.
- **Props:**
  - `title?: string` (mặc định: "Still")
  - `sessionLabel?: string`
  - `onOpenSettings?: () => void`

---

## 2. Feature: Soundscape (`src/features/soundscape/components/`)

### `AmbientQuickRow.tsx`
- **Mục đích:** Lưới 3 card âm thanh nhanh (Rain, Ocean, Cafe) nằm ở cuối màn hình chính cho phép chọn nhanh hoặc mở sheet chi tiết.
- **Props:**
  - `selectedSoundId: string | null`
  - `onSelectSound: (id: string | null) => void`
  - `onOpenFullPicker: () => void`

### `SoundPickerSheet.tsx`
- **Mục đích:** Bottom Sheet toàn diện chứa danh sách âm thanh, điều khiển volume và tùy chọn ngắt âm khi nghỉ.
- **Styling:** Bo góc trên 28px, Grab Bar 48×4px, backdrop mờ nhẹ.
- **Props:**
  - `isOpen: boolean`
  - `onClose: () => void`
  - `activeSoundId: string | null`
  - `volume: number` (0.0 đến 1.0)
  - `muteDuringBreaks: boolean`
  - `onSelectSound: (id: string | null) => void`
  - `onChangeVolume: (volume: number) => void`
  - `onToggleMuteDuringBreaks: () => void`

### `SoundTrackItem.tsx`
- **Mục đích:** Hàng hiển thị chi tiết từng track âm thanh kèm icon, mô tả, chỉ báo sóng âm mini (`SoundwaveIndicator`) và dấu check xanh khi được chọn.
- **Props:**
  - `soundId: string`
  - `title: string`
  - `description: string`
  - `iconName: string`
  - `isSelected: boolean`
  - `isPlaying: boolean`
  - `onPress: () => void`

### `SoundwaveIndicator.tsx`
- **Mục đích:** Hiệu ứng 3 cột sóng âm thanh mini nhấp nhô sống động khi track đang phát.
- **Dependencies:** `react-native-reanimated`.

### `TactileVolumeSlider.tsx`
- **Mục đích:** Thanh trượt âm lượng xúc giác với rãnh 8px và con trượt tròn 20px có bóng đổ.
- **Props:**
  - `value: number` (0.0 đến 1.0)
  - `onChange: (value: number) => void`
  - `disabled?: boolean`

---

## 3. Feature: Settings (`src/features/settings/components/`)

### `DurationStepperRow.tsx`
- **Mục đích:** Hàng điều chỉnh thời lượng (Focus, Short Break, Long Break) với con số phút lớn và cặp nút tròn `-` và `+` đạt chuẩn 44×44 pt touch target.
- **Props:**
  - `label: string`
  - `minutes: number`
  - `minMinutes: number`
  - `maxMinutes: number`
  - `step?: number`
  - `onChange: (minutes: number) => void`

### `SettingToggleRow.tsx`
- **Mục đích:** Hàng công tắc tùy chọn dạng iOS Switch (Haptics, Keep Screen Awake, v.v.).
- **Props:**
  - `label: string`
  - `description?: string`
  - `value: boolean`
  - `onValueChange: (val: boolean) => void`

### `ZenQuoteCard.tsx`
- **Mục đích:** Thẻ câu châm ngôn tĩnh tâm nằm ở cuối màn hình Cài đặt, mang lại cảm giác thư thái cho người dùng.
- **Props:**
  - `quote?: string`
  - `author?: string`
