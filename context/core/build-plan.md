# Mori — Build Plan & Roadmap

Kế hoạch phát triển được chia nhỏ thành các Phase độc lập. Mỗi phiên làm việc chỉ giải quyết duy nhất 01 Phase, tuân thủ nghiêm ngặt **Single-Phase Discipline**.

---

### Phase 0: Project Bootstrap & Context System Setup (Hoàn thành)
- **Mục tiêu:** Khởi tạo dự án Expo SDK 57, cấu hình TypeScript strict mode, cài đặt đầy đủ dependencies cốt lõi, thiết lập hệ thống tài liệu Context & Vibe Coding Workflow.
- **Definition of Done (DoD):**
  - [x] Dự án biên dịch không lỗi `tsc --noEmit`.
  - [x] Đầy đủ tài liệu `context/core/`, `context/frontend/`, `context/backend/` và file điều hướng `AGENTS.md`.
  - [x] Workspace hoạt động trơn tru trong Antigravity IDE.

---

### Phase 1: Pure Timer Engine & Domain Unit Tests (Hoàn thành)
- **Mục tiêu:** Xây dựng module lõi `TimerEngine` độc lập với giao diện, tính toán thời gian chính xác dựa trên timestamp, chống trôi thời gian khi background, chống duplicate completion.
- **Phạm vi triển khai:**
  - `src/features/timer/types.ts`: Các kiểu dữ liệu trạng thái (`TimerMode`, `TimerStatus`, `TimerSnapshot`).
  - `src/features/timer/engine.ts`: Logic tính toán timestamp, start, pause, resume, reset, switchMode.
  - `src/features/timer/__tests__/engine.test.ts`: 100% test cases bao phủ logic tính toán, delta timestamp, edge cases.
- **Definition of Done (DoD):**
  - [x] Tất cả unit test của TimerEngine pass 100%.
  - [x] Chạy `tsc --noEmit` không có lỗi.

---

### Phase 2: Timer UI, Circular Progress & Controls (Hoàn thành)
- **Mục tiêu:** Xây dựng giao diện đồng hồ tròn tối giản với `react-native-svg` và animations mượt mà bằng React Native Reanimated.
- **Phạm vi triển khai:**
  - `src/features/timer/useTimer.ts`: Hook kết nối TimerEngine với React state & AppState.
  - `src/features/timer/components/CircularTimer.tsx`: Vòng tròn tiến độ SVG hiển thị thời gian `MM:SS`.
  - `src/features/timer/components/ModeSelector.tsx`: Nút chuyển đổi Focus (25m) / Break (5m).
  - `src/features/timer/components/TimerControls.tsx`: Nút Start, Pause, Resume, Reset.
  - `src/app/index.tsx`: Tích hợp các components Timer vào màn hình chính.
- **Definition of Done (DoD):**
  - [x] Đồng hồ đếm ngược mượt mà, hiển thị đúng tiến độ phần trăm.
  - [x] Nút bấm phản hồi tức thì, chuyển đổi chế độ chuẩn xác.
  - [x] `tsc --noEmit` và component test pass.

---

### Phase 3: Soundscape Audio Engine & Ambient Picker
- **Mục tiêu:** Xây dựng hệ thống phát âm thanh môi trường tĩnh lặng (Mưa, Sóng biển, Quán cà phê) sử dụng `expo-audio`.
- **Phạm vi triển khai:**
  - `src/features/soundscape/types.ts`: Định nghĩa danh sách sound tracks, volume, mute state.
  - `src/features/soundscape/soundscapeService.ts`: Lớp dịch vụ điều phối audio player, loop playback, cleanup on switch/unmount.
  - `src/features/soundscape/useSoundscape.ts`: React Hook quản lý trạng thái âm thanh.
  - `src/features/soundscape/components/SoundPickerSheet.tsx`: Bottom sheet chọn âm thanh, chỉnh volume slider và mute.
  - Thêm tài nguyên âm thanh mẫu hoặc synthesizer cục bộ hợp lệ.
- **Definition of Done (DoD):**
  - Chỉ duy nhất 1 âm thanh phát tại một thời điểm, lặp vô tận trơn tru.
  - Điều chỉnh volume và mute hoạt động mượt mà không delay.
  - Khi unmount hoặc đổi bài, tài nguyên cũ được release sạch sẽ.

---

### Phase 4: Settings & Local Persistence (AsyncStorage)
- **Mục tiêu:** Lưu trữ cấu hình người dùng (thời lượng Focus/Break, âm thanh đã chọn, volume, haptic preference) vào `AsyncStorage` với validation schema.
- **Phạm vi triển khai:**
  - `src/features/settings/types.ts`: `MoriPreferences` interface.
  - `src/features/settings/settingsStorage.ts`: Đọc/ghi storage, fallback defaults nếu dữ liệu hỏng.
  - `src/features/settings/useSettings.ts`: Hook cung cấp preferences toàn app.
  - `src/app/settings.tsx`: Màn hình/Modal cài đặt thời lượng và tùy chọn.
- **Definition of Done (DoD):**
  - Cấu hình được lưu và nạp lại chính xác khi khởi động lại ứng dụng.
  - Dữ liệu rác không làm crash app, tự khôi phục defaults.
  - Đạt 100% type safety.

---

### Phase 5: Haptic Feedback, Edge Cases & Polish
- **Mục tiêu:** Tích hợp phản hồi rung xúc giác tinh tế (`expo-haptics`), xử lý kiểm thử toàn diện vòng đời foreground/background và hoàn thiện trải nghiệm thị giác.
- **Phạm vi triển khai:**
  - Tích hợp `expo-haptics` vào các tương tác: Start/Pause/Reset, hoàn thành session.
  - Tinh chỉnh micro-animations và typography.
  - Kiểm tra end-to-end user flows trên thiết bị.
- **Definition of Done (DoD):**
  - Rung phản hồi mượt mà, đúng ngữ cảnh (nếu người dùng bật haptics).
  - Không có giật lag, memory leak hoặc cảnh báo trong console.
  - Toàn bộ test suite pass.
