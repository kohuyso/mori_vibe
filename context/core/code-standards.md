# Mori — Coding & Type Standards

## 1. Nguyên tắc Bất biến (Hard Constraints)
1. **100% Strict Type-Safety:**
   - **Tuyệt đối CẤM** sử dụng `any`, `as any`, hoặc `// @ts-ignore`.
   - Sử dụng `unknown` kết hợp type guard (`is`, Zod, hoặc type narrowing) khi xử lý dữ liệu ngoại vi (như `AsyncStorage` hoặc input người dùng).
   - Mọi interfaces/types phải được định nghĩa rõ ràng trong file `types.ts` của feature hoặc `src/types/`.

2. **Dọn dẹp tài nguyên (Resource Cleanup Mandatory):**
   - Mọi subscription (AppState listener, interval, audio instance) **BẮT BUỘC** phải có hàm cleanup trả về trong `useEffect` hoặc hàm `destroy()`.
   - Audio resource phải được release sạch sẽ khi chuyển bài hoặc unmount component để tránh memory leak native module.

3. **Không để placeholder:**
   - Không commit code chứa `TODO`, `FIXME`, hoặc code giả định chưa hoàn thiện trong phạm vi phase đã cam kết.

## 2. Quy chuẩn đặt tên (Naming Conventions)
- **Tập tin & Thư mục:**
  - Components: `PascalCase.tsx` (ví dụ: `CircularTimer.tsx`, `ModeSelector.tsx`) hoặc `kebab-case.tsx` nếu theo chuẩn template. Ưu tiên nhất quán theo cấu trúc feature: `FeatureComponent.tsx`.
  - Hooks: `camelCase.ts` bắt đầu bằng `use` (ví dụ: `useTimer.ts`, `useSoundscape.ts`).
  - Services/Utilities/Engines: `camelCase.ts` (ví dụ: `timerEngine.ts`, `settingsStorage.ts`).
  - Constants & Types: `types.ts`, `theme.ts`.
- **Variables & Functions:**
  - Biến & hàm: `camelCase` (ví dụ: `timeRemainingSec`, `startTimer()`, `handleVolumeChange()`).
  - Boolean: Tiền tố `is`, `has`, `should`, `can` (ví dụ: `isRunning`, `isMuted`, `hasCompleted`).
  - Constants / Enum values: `UPPER_SNAKE_CASE` hoặc object `as const` (ví dụ: `DEFAULT_FOCUS_MINUTES = 25`).

## 3. Quản lý Lỗi (Error Handling Strategy)
- Tạo các Custom Error class có định danh rõ ràng thay vì ném ra `Error` generic:
  - `StorageValidationError`: Khi dữ liệu trong `AsyncStorage` bị hỏng hoặc sai schema.
  - `AudioPlaybackError`: Khi `expo-audio` gặp lỗi tải file âm thanh hoặc giải mã.
- Tầng UI luôn có fallback nhẹ nhàng (Graceful Degradation):
  - Khi `AsyncStorage` lỗi -> Tự động fallback về cấu hình mặc định an toàn (`DEFAULT_SETTINGS`), ghi log cảnh báo, không làm crash app.
  - Khi Audio không phát được -> Tắt chế độ soundscape, hiển thị toast/cảnh báo nhẹ, không làm gián đoạn bộ đếm Timer.

## 4. Quy tắc React & State Management
- Giữ State ở mức thấp nhất có thể. Không đưa dữ liệu tính toán được (derived state) vào `useState`.
  - Ví dụ: `progress` tính từ `timeRemainingSec / totalDurationSec`, không tạo state riêng cho `progress`.
- Sử dụng Custom Hooks để đóng gói logic:
  - Screen component chỉ giữ nhiệm vụ bố cục layout, gọi `useTimer()` để lấy state hiển thị.
