# Mori — Architecture Specification

## 1. Tech Stack Definition
- **Platform:** React Native (0.86+) & Expo (SDK 57)
- **Navigation & Routing:** Expo Router (File-based routing trong `src/app/`)
- **Language:** TypeScript 5.8+ (Strict Mode bật 100%, cấm `any` / `as any`)
- **Animation:** React Native Reanimated (4.5+)
- **Graphics/Drawing:** `react-native-svg` (dùng để vẽ vòng tròn đếm ngược tương tác cao)
- **Audio Service:** `expo-audio` (phát âm thanh lặp vô tận, volume control, lifecycle cleanup)
- **Haptic Feedback:** `expo-haptics`
- **Notifications:** `expo-notifications` (hỗ trợ nhắc nhở khi hết phiên đếm ngược)
- **Storage/Persistence:** `@react-native-async-storage/async-storage`

## 2. Cấu trúc thư mục Feature-Based
```
src/
├── app/                        # Expo Router routes (CHỈ chứa screen component & layout)
│   ├── _layout.tsx             # Root layout, Stack navigator, Theme Provider
│   ├── index.tsx               # Màn hình chính Focus & Pomodoro Timer
│   └── settings.tsx            # Modal / Screen cài đặt thời lượng và âm thanh
├── features/                   # Từng miền tính năng độc lập (Feature-Sliced)
│   ├── timer/                  # Miền tính năng Đồng hồ Pomodoro
│   │   ├── types.ts            # TimerState, TimerMode, TimerAction, TimerSnapshot
│   │   ├── engine.ts           # Thuần TypeScript: tính toán thời gian, delta timestamp
│   │   ├── useTimer.ts         # Hook kết nối engine với React lifecycle & AppState
│   │   └── components/         # UI riêng của Timer (CircularTimer, TimerControls, ModeSelector, SessionHeaderBar)
│   ├── soundscape/             # Miền tính năng Âm thanh môi trường
│   │   ├── types.ts            # SoundTrack, SoundStatus, SoundscapeConfig
│   │   ├── soundscapeService.ts# Audio engine đóng gói expo-audio (play, stop, volume, unload)
│   │   ├── useSoundscape.ts    # React hook quản lý phát âm thanh, state & lifecycle
│   │   ├── assets/             # Map định danh file âm thanh cục bộ (rain, ocean, coffee)
│   │   └── components/         # SoundPickerSheet, SoundOptionItem, VolumeSlider
│   └── settings/               # Miền tính năng Cấu hình & Lưu trữ
│       ├── types.ts            # UserPreferences, DurationConfig
│       ├── settingsStorage.ts  # Tương tác AsyncStorage + Zod validation/fallback
│       ├── useSettings.ts      # Hook đọc/ghi preferences
│       └── components/         # DurationStepper, ToggleRow, ResetDefaultsButton
├── components/                 # Các component dùng chung (Button, Card, Icon, Modal, Typography)
├── constants/                  # Hằng số toàn cục (theme tokens, colors, default values)
├── hooks/                      # Hooks tiện ích dùng chung (useAppState, useThemeColor)
└── utils/                      # Helper thuần túy (formatTime, clamp, dateUtils)
```

## 3. Kiến trúc 3 Lớp Client (Layered Client Architecture)
Mỗi feature tuân thủ nghiêm ngặt 3 tầng trách nhiệm:

```
[ Tầng 1: Presentation / UI Layer ]
  (React Components: Screen, CircularTimer, SoundPickerSheet)
             │
             ▼
[ Tầng 2: Application / Hooks & Domain Service Layer ]
  (useTimer, useSoundscape, useSettings, TimerEngine)
             │
             ▼
[ Tầng 3: Infrastructure / Storage & Native Hardware APIs ]
  (AsyncStorage, expo-audio, expo-haptics, AppState native events)
```

- **Tầng UI (Presentation):** Chỉ nhận props/state và render, gọi hàm dispatch/action từ Hook. Tuyệt đối không chứa logic tính toán thời gian hay trực tiếp gọi AsyncStorage/Audio API.
- **Tầng Domain/Service (Application Logic):**
  - `TimerEngine`: Module thuần túy (Pure TypeScript class) quản lý trạng thái đếm ngược dựa trên thuật toán timestamp vi sai chống trôi (`targetTimestamp = Date.now() + remainingSec * 1000`), cung cấp `TimerSnapshot` (`mode`, `status`, `timeRemainingSec`, `totalDurationSec`, `progress`, `targetTimestamp`, `hasCompletedDispatched`), chốt chặn duplicate completion (`ADR-004`), và các phương thức `start`, `pause`, `resume`, `reset`, `switchMode`, `updateDurations`, `tick`, `destroy`. Đạt độ bao phủ kiểm thử 100% unit tests độc lập với React.
  - `SoundscapeService`: Điều phối `AudioPlayer` instance, đảm bảo chỉ có tối đa 01 luồng âm thanh được phát tại một thời điểm, giải phóng tài nguyên khi unmount.
  - `SettingsStorage`: Đảm nhận việc serialize/deserialize dữ liệu, validate schema trước khi lưu/đọc từ storage.
- **Tầng Infrastructure:** Đóng gói các thư viện Expo Native (`expo-audio`, `@react-native-async-storage/async-storage`, `expo-haptics`).

## 4. Sơ đồ Luồng Dữ liệu (Data Flow Diagrams)

### Luồng Đếm Thời gian Timestamp-based
```
[User clicks START]
       │
       ▼
Ghi nhận: startTimestamp = Date.now(), targetTimestamp = startTimestamp + durationSec * 1000
       │
       ▼
Loop (100ms hoặc 250ms rAF / setInterval):
  remainingSec = Math.max(0, Math.ceil((targetTimestamp - Date.now()) / 1000))
       │
       ├── App bị background? -> setInterval dừng lại bình thường
       └── App quay lại foreground -> Đọc lại Date.now(), đối chiếu targetTimestamp
                                    -> remainingSec vẫn chính xác tuyệt đối!
       │
       ▼
remainingSec <= 0:
  - Dừng timer
  - Kích hoạt Haptic
  - Bắn event SessionCompleted (chặn duplicate bằng guard flag `hasCompletedDispatched`)
  - Chuyển mode (Focus -> Break)
```

### Luồng Phát Âm thanh An toàn (Single Audio Channel)
```
[User chọn Sound: 'Rain']
       │
       ▼
Kiểm tra player hiện tại có đang phát không?
       ├── CÓ: Gửi lệnh stop() -> giải phóng instance cũ (unloadAsync / release)
       └── KHÔNG: Tiếp tục
       │
       ▼
Khởi tạo AudioPlayer mới với asset 'Rain'
       │
       ▼
Set loop = true, set volume = userVolume
       │
       ▼
Giai đoạn unmount hook hoặc tắt âm:
       - Gọi cleanup/release để tránh leak bộ nhớ âm thanh Native
```
