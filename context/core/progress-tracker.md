# Mori — Progress Tracker & Decision Records

## 1. Bảng Tiến Độ Triển Khai (Phase Progress Matrix)

| Phase | Tên Giai Đoạn | Trạng Thái | Test Coverage | Ghi Chú |
|---|---|---|---|---|
| **Phase 0** | Project Bootstrap & Context System Setup | `[x] Hoàn thành` | N/A | Expo SDK 57, TS Strict, Vibe Coding setup |
| **Phase 1** | Pure Timer Engine & Domain Unit Tests | `[x] Hoàn thành` | 100% | Timestamp drift-proof, duplicate completion guard, 12 unit tests |
| **Phase 2** | Timer UI, Circular Progress & Controls | `[x] Hoàn thành` | 100% | CircularTimer SVG r=114, Reanimated, ModeSelector, TimerControls, useTimer hook, 25 tests pass |
| **Phase 3** | Soundscape Audio Engine & Ambient Picker | `[ ] Chưa bắt đầu` | 0% | Sẵn sàng cho lệnh `/architect` |
| **Phase 4** | Settings & Local Persistence (AsyncStorage)| `[ ] Chưa bắt đầu` | 0% | Chờ hoàn thành Phase 3 |
| **Phase 5** | Haptic Feedback, Edge Cases & Polish | `[ ] Chưa bắt đầu` | 0% | Chờ hoàn thành Phase 4 |

---

## 2. Architecture Decision Records (ADR)

### ADR-001: Sử dụng Timestamp-based Timer thay vì Interval Tick Count
- **Ngữ cảnh:** Hệ điều hành di động (iOS/Android) thường hạn chế tài nguyên và bóp nghẹt tần số chạy của `setInterval` khi ứng dụng chạy ngầm hoặc người dùng khóa màn hình. Nếu đếm lùi từng giây bằng `count - 1`, thời gian sẽ bị chậm nghiêm trọng khi quay lại app.
- **Quyết định:** Lưu `targetTimestamp = Date.now() + durationMs`. Mỗi nhịp tick hoặc khi nhận event `AppState === 'active'`, thời gian còn lại được tính lại bằng `Math.max(0, Math.ceil((targetTimestamp - Date.now()) / 1000))`.
- **Hệ quả:** Đảm bảo độ chính xác 100% về mặt thời gian, không bị trôi thời gian khi background.

### ADR-002: Đơn kênh âm thanh môi trường (Single-Stream Soundscape)
- **Ngữ cảnh:** Phát nhiều âm thanh môi trường cùng lúc trên thiết bị di động có thể gây tốn pin, xung đột tài nguyên audio native và làm rối trải nghiệm người dùng tối giản.
- **Quyết định:** Giới hạn hệ thống phát tối đa 01 luồng âm thanh môi trường tại một thời điểm (Rain, Ocean, hoặc Coffee Shop). Khi người dùng chọn âm thanh mới, tự động dừng và hủy luồng cũ trước khi phát luồng mới.
- **Hệ quả:** Kiểm soát vòng đời tài nguyên chặt chẽ, tránh rò rỉ bộ nhớ (memory leaks).

### ADR-003: Kiến trúc Client 3 tầng (Layered Client Architecture)
- **Ngữ cảnh:** Đưa logic tính toán thời gian và gọi audio trực tiếp trong các React components khiến code khó bảo trì, khó test và dễ sinh ra re-render thừa.
- **Quyết định:** Tách biệt rõ ràng: Presentation (React Components) -> Application (Custom Hooks & Pure TypeScript Engine) -> Infrastructure (AsyncStorage, Native Audio API).
- **Hệ quả:** Pure logic có thể test unit đạt 100% coverage mà không cần mount component React.

### ADR-004: Chốt Chặn Bắn Lặp Hoàn Thành (Completion Latch Guard)
- **Ngữ cảnh:** Khi bộ đếm về 0, các nhịp tick tiếp theo hoặc sự kiện foreground resume có thể kích hoạt callback `onComplete` nhiều lần trước khi người dùng thao tác tiếp.
- **Quyết định:** Sử dụng cờ boolean latch `hasCompletedDispatched` nội bộ. Khi `remainingSec <= 0` và `!hasCompletedDispatched`, kích hoạt `onComplete(mode)` và đánh dấu `hasCompletedDispatched = true`. Cờ chỉ được reset khi bắt đầu chu kỳ mới (`start()`, `reset()`, hoặc `switchMode()`).
- **Hệ quả:** Đảm bảo các tác vụ tốn tài nguyên (thông báo, haptic) chỉ được kích hoạt duy nhất một lần.

### ADR-005: Hoạt họa Tiến độ SVG qua StrokeDashoffset và Tabular Numbers
- **Ngữ cảnh:** Vòng tròn tiến độ SVG chạy ở 60fps nếu re-render toàn bộ SVG element sẽ gây tốn pin và sinh frame drops; con số thời gian đếm lùi nếu sử dụng font chữ tỷ lệ (proportional) sẽ bị co giật chiều rộng giữa các giây.
- **Quyết định:** Sử dụng Reanimated `withTiming` trên thuộc tính `strokeDashoffset` của `AnimatedCircle` ($C = 716.28\text{px}$) và áp dụng bắt buộc `fontVariant: ['tabular-nums']` cho text số đồng hồ 56px.
- **Hệ quả:** Hoạt họa êm dịu, hoàn toàn không giật lag và chữ số cố định chiều ngang vững chắc.

---

## 3. Nhật ký Phiên Làm việc (Session Logs)

### Session 0 (2026-10-15)
- **Nội dung:** Khởi tạo dự án Expo SDK 57 với Expo Router và TypeScript Strict Mode. Cài đặt các dependencies tương thích: `react-native-reanimated`, `react-native-svg`, `expo-audio`, `expo-haptics`, `expo-notifications`, `@react-native-async-storage/async-storage`.
- **Kết quả:** Kiểm tra `tsc --noEmit` thành công (0 lỗi). Thiết lập toàn bộ hệ thống file Context và file cấu hình điều hướng `AGENTS.md`.
- **Bước tiếp theo:** Chờ lệnh từ người dùng để bắt đầu Phase 1 (bắt đầu bằng lệnh `/architect` cho Phase 1).

### Session 1 (2026-10-17)
- **Nội dung:** Triển khai **Phase 1: Pure Timer Engine & Domain Unit Tests**. Cấu hình test runner Jest với `ts-jest`, định nghĩa `TimerSnapshot`, `TimerMode`, `TimerStatus` trong `src/features/timer/types.ts`. Triển khai `TimerEngine` trong `src/features/timer/engine.ts` với thuật toán vi sai timestamp và duplicate completion guard.
- **Kết quả:** `tsc --noEmit` 0 lỗi. 12/12 unit tests pass (100% statement, 100% line coverage). Thẩm tra `/review` đạt chứng chỉ PASS.
- **Bước tiếp theo:** Bắt đầu Phase 2 (Timer UI, Circular Progress & Controls) bằng lệnh `/architect`.

### Session 2 (2026-10-17)
- **Nội dung:** Triển khai **Phase 2: Timer UI, Circular Progress & Controls**. Xây dựng helper `formatTime`, hook `useTimer` kết nối AppState native và interval 250ms, các UI components chuẩn Stitch MD3: `CircularTimer`, `ModeSelector`, `TimerControls`, `SessionHeaderBar`, và tích hợp màn hình chính `src/app/index.tsx`.
- **Kết quả:** `tsc --noEmit` 0 lỗi. 25/25 unit & integration tests pass (100%). Thẩm định `/review` đạt chứng chỉ PASS (WCAG AAA, touch targets $\ge 44\text{pt}$, zero `any`).
- **Bước tiếp theo:** Bắt đầu Phase 3 (Soundscape Audio Engine & Ambient Picker) bằng lệnh `/architect`.
