# Mori — API & Storage Contracts

Mặc dù Mori MVP không phụ thuộc vào REST/GraphQL backend bên ngoài, toàn bộ giao tiếp giữa tầng **Application Hooks** và các dịch vụ Native/Storage tuân theo các Contracts nghiêm ngặt được mô tả dưới đây.

## 1. Storage Repository Contract (`ISettingsRepository`)

Giao diện trừu tượng hóa việc đọc/ghi cấu hình người dùng vào local storage:

```typescript
export interface ISettingsRepository {
  /** Đọc cấu hình người dùng hiện tại, tự động fallback về DEFAULT_SETTINGS nếu rỗng hoặc lỗi */
  getSettings(): Promise<MoriSettings>;

  /** Ghi đè toàn bộ cấu hình mới sau khi đã validate hợp lệ */
  saveSettings(settings: MoriSettings): Promise<void>;

  /** Cập nhật một phần cấu hình (partial update) */
  updateSettings(partial: Partial<MoriSettings>): Promise<MoriSettings>;

  /** Khôi phục cấu hình về giá trị mặc định */
  resetToDefaults(): Promise<MoriSettings>;
}
```

---

## 2. Audio Engine Service Contract (`ISoundscapeService`)

Giao diện điều khiển luồng phát âm thanh Native thông qua `expo-audio`:

```typescript
export type AmbientSoundId = 'rain' | 'ocean' | 'coffee';

export interface SoundTrackMeta {
  id: AmbientSoundId;
  title: string;
  sourceUri: number | string; // Local require() asset hoặc local URI
  author: string;
  license: string;
}

export interface ISoundscapeService {
  /** Phát âm thanh môi trường theo id, nếu đang có bài khác phát thì tự động dừng bài cũ */
  play(soundId: AmbientSoundId, volume: number): Promise<void>;

  /** Tạm dừng phát âm thanh hiện tại */
  pause(): Promise<void>;

  /** Dừng hẳn và giải phóng tài nguyên phát */
  stop(): Promise<void>;

  /** Điều chỉnh âm lượng từ 0.0 đến 1.0 */
  setVolume(volume: number): Promise<void>;

  /** Tắt/bật âm thanh nhanh (Mute) */
  setMuted(muted: boolean): Promise<void>;

  /** Giải phóng toàn bộ tài nguyên audio khi thoát ứng dụng */
  destroy(): Promise<void>;
}
```

---

## 3. Danh mục Tài nguyên Âm thanh (Audio Assets Registry)

| Track ID | Tên hiển thị | Tệp tin cục bộ | Tác giả & Giấy phép |
|---|---|---|---|
| `rain` | Mưa Rơi (Gentle Rain) | `src/features/soundscape/assets/rain.mp3` | Public Domain / CC0 |
| `ocean` | Sóng Biển (Ocean Waves) | `src/features/soundscape/assets/ocean.mp3` | Public Domain / CC0 |
| `coffee` | Quán Cà Phê (Coffee Shop) | `src/features/soundscape/assets/coffee.mp3` | Public Domain / CC0 |
