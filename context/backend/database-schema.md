# Mori — Local Storage & Persistence Schema

Do **Mori MVP** là ứng dụng di động hoạt động offline hoàn toàn (Local-First Client App), hệ thống lưu trữ sử dụng `@react-native-async-storage/async-storage` với cấu trúc khóa (Storage Keys) và Schema thực tế sau.

## 1. Danh sách Khóa Lưu trữ (Storage Keys)

| Key | Định dạng | Ý nghĩa & Mục đích |
|---|---|---|
| `@mori/settings_v1` | JSON String | Lưu trữ toàn bộ tùy chọn người dùng (thời lượng, âm lượng, haptics) |
| `@mori/stats_v1` | JSON String | Lưu trữ thống kê số phiên tập trung đã hoàn thành |

## 2. Thực thể & Schema Dữ liệu (TypeScript Entities)

### `MoriSettings` Entity
```typescript
export interface MoriSettings {
  version: 1;
  durations: {
    focusMinutes: number;   // Giá trị từ 1 đến 120 (mặc định: 25)
    breakMinutes: number;   // Giá trị từ 1 đến 60 (mặc định: 5)
  };
  soundscape: {
    selectedSoundId: 'rain' | 'ocean' | 'coffee' | null; // null = Off
    volume: number;          // Giá trị từ 0.0 đến 1.0 (mặc định: 0.8)
    isMuted: boolean;        // mặc định: false
  };
  preferences: {
    enableHaptics: boolean;  // mặc định: true
    autoStartBreak: boolean; // mặc định: false
  };
}
```

### `MoriStats` Entity
```typescript
export interface MoriStats {
  version: 1;
  totalCompletedSessions: number;
  totalFocusMinutes: number;
  lastCompletedDate: string | null; // ISO Date string 'YYYY-MM-DD'
}
```

## 3. Schema Validation & Khôi phục Fallback
- Khi đọc dữ liệu từ `AsyncStorage`, chuỗi JSON sẽ được parse an toàn trong khối `try/catch`.
- Một hàm Type Guard hoặc Zod schema sẽ kiểm tra tính hợp lệ:
  - Kiểm tra `version === 1`.
  - Đảm bảo `focusMinutes` và `breakMinutes` là số nguyên dương trong giới hạn hợp lệ.
  - Đảm bảo `volume` là số thực trong khoảng `[0.0, 1.0]`.
- **Cơ chế Fallback:** Nếu chuỗi JSON bị `null`, không parse được hoặc sai kiểu dữ liệu, hệ thống tự động trả về `DEFAULT_SETTINGS` mà không gây gián đoạn ứng dụng:
  ```typescript
  export const DEFAULT_SETTINGS: MoriSettings = {
    version: 1,
    durations: {
      focusMinutes: 25,
      breakMinutes: 5,
    },
    soundscape: {
      selectedSoundId: null,
      volume: 0.8,
      isMuted: false,
    },
    preferences: {
      enableHaptics: true,
      autoStartBreak: false,
    },
  };
  ```
