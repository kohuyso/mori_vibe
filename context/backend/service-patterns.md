# Mori — Client Service Patterns & Architecture

## 1. Mẫu Thiết kế Dịch vụ 3 Lớp (3-Tier Client Pattern)

Mori áp dụng mô hình phân tách tầng nghiêm ngặt nhằm đảm bảo tính độc lập, dễ kiểm thử và không phụ thuộc chéo:

```
[ Lớp 1: Presentation & Custom Hooks ]
  - Ví dụ: useTimer, useSoundscape, useSettings
  - Trách nhiệm: Quản lý React re-render, cung cấp state phản ứng (reactive state) và handlers cho UI.
       │
       ▼
[ Lớp 2: Domain Services & Pure Engines ]
  - Ví dụ: TimerEngine, SoundscapeService, SettingsRepository
  - Trách nhiệm: Thực thi nghiệp vụ tính toán logic thời gian, điều phối âm thanh, validate dữ liệu.
       │
       ▼
[ Lớp 3: Infrastructure / Storage & Native Adapters ]
  - Ví dụ: AsyncStorageAdapter, ExpoAudioAdapter, ExpoHapticsAdapter
  - Trách nhiệm: Giao tiếp trực tiếp với native modules của Expo và hệ điều hành.
```

---

## 2. Nguyên tắc Quản lý Vòng đời Tài nguyên (Lifecycle Management)
- **Lazy Initialization:** Chỉ nạp và khởi tạo AudioPlayer khi người dùng thực sự chọn phát một âm thanh môi trường.
- **Deterministic Teardown:** Dịch vụ `SoundscapeService` cung cấp phương thức `destroy()`. Khi component cha unmount hoặc ứng dụng đóng, toàn bộ bộ đệm âm thanh native phải được giải phóng qua `unloadAsync()`.
- **Chống Trôi Timer (Drift Prevention):** `TimerEngine` không sử dụng tích lũy số giây bằng `counter++`. Thay vào đó, thời gian luôn được tính bằng công thức vi sai:
  $$\Delta t = \text{TargetTimestamp} - \text{CurrentTimestamp}$$
  Cách tiếp cận này miễn nhiễm hoàn toàn với độ trễ của JavaScript event loop và hiện tượng throttling khi ứng dụng chạy nền.

---

## 3. Mẫu Xử lý Ngoại lệ Dịch vụ (Service Error Patterns)
Mọi ngoại lệ sinh ra từ tầng Infrastructure phải được bắt (catch) và chuyển đổi thành Domain Error trước khi tới tầng Presentation:

```typescript
export class MoriServiceError extends Error {
  constructor(message: string, public readonly code: string, public readonly originalError?: unknown) {
    super(message);
    this.name = 'MoriServiceError';
  }
}

export class StorageError extends MoriServiceError {
  constructor(message: string, originalError?: unknown) {
    super(message, 'ERR_STORAGE_FAILURE', originalError);
  }
}

export class AudioEngineError extends MoriServiceError {
  constructor(message: string, originalError?: unknown) {
    super(message, 'ERR_AUDIO_PLAYBACK_FAILURE', originalError);
  }
}
```
Tầng UI hoặc Hook sẽ bắt các lỗi này và hiển thị thông báo nhẹ nhàng cho người dùng thay vì làm crash app.
