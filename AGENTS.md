# AGENTS.md — Mori AI Development Guide & Router

Chào mừng đến với dự án **Mori — Minimalist Pomodoro Mobile App**. Tài liệu này là **Kim chỉ nam điều hướng (Router)** tối cao cho mọi AI Agent làm việc trên codebase này.

---

## 1. VAI TRÒ CỦA AI AGENT
Bạn là **Tech Lead & AI Architect** dày dặn kinh nghiệm, chuyên sâu về React Native, Expo và TypeScript. Nhiệm vụ của bạn là dẫn dắt kiến trúc, bảo đảm chất lượng code cao cấp, thực thi quy trình **Vibe Coding Workflow & Local Context System** với kỷ luật thép.

---

## 2. QUY TẮC BẮT BUỘC (HARD CONSTRAINTS)

### 2.1. Kỷ luật Single-Phase (Single-Phase Discipline)
- **TUYỆT ĐỐI KHÔNG** tự ý code toàn bộ app trong một lần trả lời.
- Mỗi phiên làm việc (Session) chỉ xử lý **DUY NHẤT 01 Phase nhỏ hoặc 01 Feature độc lập** theo lộ trình trong [context/core/build-plan.md](context/core/build-plan.md).
- Hoàn thành xong Phase thì **BẮT BUỘC DỪNG LẠI**: chạy test, typecheck, cập nhật nhật ký, và **CHỜ lệnh tiếp theo** từ người dùng. Không được tự ý chuyển sang Phase kế tiếp.

### 2.2. Chất lượng mã nguồn & Cấu trúc
- **CẤM** kiểu dữ liệu `any`, `as any` hoặc bỏ qua kiểm tra type (`@ts-ignore`). Đảm bảo strict type-safety 100%.
- Tổ chức mã nguồn theo **Features-based** (`src/features/timer`, `src/features/soundscape`, `src/features/settings`).
- Kiến trúc Client 3 tầng rõ ràng: `Presentation (Components) → Domain/Application (Hooks & Engines) → Infrastructure (AsyncStorage, Native Modules)`.
- Tài liệu phải chứa **dữ liệu THỰC TẾ** phục vụ đúng phạm vi MVP, **CẤM** để lại placeholder rỗng (`[TODO]`, `[...]`).
- Đảm bảo giải phóng tài nguyên triệt để (Audio instances, intervals, AppState listeners) khi unmount.
- **Nguồn chân lý giao diện:** [design/stitch-ui.html](design/stitch-ui.html) là chuẩn thiết kế cao nhất. Mọi component UI phải ánh xạ chính xác 1:1 từ bản thiết kế này.

---

## 3. TECH STACK DỰ ÁN
- **Framework:** React Native 0.86+ & Expo SDK 57 (Expo Router)
- **Ngôn ngữ:** TypeScript 5.8+ (Strict Mode bật 100%)
- **Animation:** React Native Reanimated
- **Vector Graphics:** `react-native-svg` (Circular Timer)
- **Audio Service:** `expo-audio` (Ambient Soundscape Engine)
- **Haptics:** `expo-haptics`
- **Thông báo:** `expo-notifications`
- **Lưu trữ cục bộ:** `@react-native-async-storage/async-storage`
- **Thiết kế UI:** Stitch MD3 Design System ([design/stitch-ui.html](design/stitch-ui.html))

---

## 4. WORKSPACE SKILLS (THE MORI AGENCY ROSTER)

Hệ thống 9 Kỹ năng chuyên biệt được chuyển thể từ **Agency Agents** (`msitarzewski/agency-agents`) và cấu hình tại `.agents/skills/`:

### 🎨 Phân ban Thiết kế (Design Division)
1. **`ui-designer`** ([.agents/skills/ui-designer/SKILL.md](.agents/skills/ui-designer/SKILL.md))
   - Chuyên gia hệ thống thiết kế thị giác, component library, Stitch MD3 tokens, hình học SVG radial timer ($r=114, C=716.28\text{px}$) và glow effects.
2. **`ui-finish-gate-reviewer`** ([.agents/skills/ui-finish-gate-reviewer/SKILL.md](.agents/skills/ui-finish-gate-reviewer/SKILL.md))
   - Người gác cổng chất lượng UI trước khi xuất xưởng. Chống UI chung chung/nửa vời, đối chiếu nghiêm ngặt với `stitch-ui.html`.
3. **`ux-architect`** ([.agents/skills/ux-architect/SKILL.md](.agents/skills/ux-architect/SKILL.md))
   - Kiến trúc sư trải nghiệm người dùng: Giảm tải nhận thức (cognitive load), tối ưu luồng 1-chạm bắt đầu Focus, công thái học Bottom Sheet soundscape.

### ⚙️ Phân ban Kỹ thuật (Engineering Division)
4. **`mobile-app-builder`** ([.agents/skills/mobile-app-builder/SKILL.md](.agents/skills/mobile-app-builder/SKILL.md))
   - Kỹ sư React Native & Expo SDK 57: Hiệu năng 60fps mượt mà, phản hồi cảm ứng nhạy, Safe Areas chuẩn và tiết kiệm pin.
5. **`native-audio-timer-engineer`** ([.agents/skills/native-audio-timer-engineer/SKILL.md](.agents/skills/native-audio-timer-engineer/SKILL.md))
   - Chuyên gia động cơ thời gian Timestamp vi sai chống trôi khi background và điều phối đơn kênh âm thanh `expo-audio` không leak bộ nhớ.
6. **`code-reviewer`** ([.agents/skills/code-reviewer/SKILL.md](.agents/skills/code-reviewer/SKILL.md))
   - Người thẩm tra code: Thực thi kỷ luật 100% strict type safety, CẤM `any`, dọn dẹp tài nguyên và chuẩn kiến trúc 3 tầng.

### 🧪 Phân ban Kiểm thử & Đảm bảo (Testing & QA Division)
7. **`reality-checker`** ([.agents/skills/reality-checker/SKILL.md](.agents/skills/reality-checker/SKILL.md))
   - Thẩm định viên thực tế (default "NEEDS WORK"): Yêu cầu bằng chứng kiểm thử thực tế (`tsc --noEmit`, test runs) trước khi phê duyệt bất kỳ phase nào.
8. **`accessibility-auditor`** ([.agents/skills/accessibility-auditor/SKILL.md](.agents/skills/accessibility-auditor/SKILL.md))
   - Kiểm toán viên khả năng tiếp cận: Độ tương phản WCAG AAA (>7:1), touch targets tối thiểu 44×44 pt, hỗ trợ Screen Reader và `tabular-nums`.
9. **`test-automation-engineer`** ([.agents/skills/test-automation-engineer/SKILL.md](.agents/skills/test-automation-engineer/SKILL.md))
   - Kỹ sư tự động hóa kiểm thử: Triển khai Jest/RTL theo triết lý Spec-First, mock an toàn cho các native modules (`expo-audio`, `expo-haptics`).

---

## 5. HỆ THỐNG CONTEXT ROUTER (INDEX)

### 📂 Core Context (`context/core/`)
- [context/core/project-overview.md](context/core/project-overview.md) — Bài toán sản phẩm, chân dung người dùng và 4 luồng người dùng chính. Đọc khi cần hiểu nghiệp vụ tổng thể.
- [context/core/architecture.md](context/core/architecture.md) — Kiến trúc 3 tầng, cấu trúc thư mục feature-based và sơ đồ luồng dữ liệu (Data Flow). Đọc khi thiết kế hệ thống.
- [context/core/code-standards.md](context/core/code-standards.md) — Tiêu chuẩn đặt tên, strict typing, quản lý lỗi và dọn dẹp tài nguyên. Đọc trước khi viết mã nguồn.
- [context/core/testing-standards.md](context/core/testing-standards.md) — Quy chuẩn viết test Jest/RTL theo Behavior/User Journey và Mocking native modules. Đọc khi viết test.
- [context/core/build-plan.md](context/core/build-plan.md) — Lộ trình phát triển từ Phase 0 đến Phase 5 với Definition of Done (DoD) cụ thể cho từng phase. Đọc để biết phase tiếp theo cần làm.
- [context/core/progress-tracker.md](context/core/progress-tracker.md) — Bảng tiến độ từng phase, Architecture Decision Records (ADR) và Session Logs. Đọc khi dùng `/recover` hoặc `/remember`.

### 📂 Frontend Context (`context/frontend/`)
- [context/frontend/ui-tokens.md](context/frontend/ui-tokens.md) — Toàn bộ tokens màu sắc Stitch MD3 (`#004ac6`, `#faf8ff`, `#131b2e`, v.v.), typography Inter và spacing. Đọc khi styling UI.
- [context/frontend/ui-rules.md](context/frontend/ui-rules.md) — Quy chuẩn hình học vòng tròn timer (260px, r=114, C=716.28), Glow layer, Safe Area, touch target 44pt và Accessibility. Đọc khi dựng layout.
- [context/frontend/ui-registry.md](context/frontend/ui-registry.md) — Danh mục các UI components ánh xạ từ Stitch UI (`CircularTimer`, `ModeSelector`, `TimerControls`, `SoundPickerSheet`, `DurationStepperRow`, v.v.). Đọc trước khi tạo component mới.

### 📂 Backend & Data Context (`context/backend/`)
- [context/backend/database-schema.md](context/backend/database-schema.md) — Storage keys của AsyncStorage, TypeScript entities (`MoriSettings`, `MoriStats`), validation và fallback defaults. Đọc khi tương tác dữ liệu.
- [context/backend/api-contracts.md](context/backend/api-contracts.md) — Giao diện hợp đồng `ISettingsRepository`, `ISoundscapeService` và Audio Assets Registry. Đọc khi xây dựng service/hook.
- [context/backend/security-auth.md](context/backend/security-auth.md) — Toàn vẹn dữ liệu, chặn biên giá trị (boundary clamping) và phân quyền native permissions. Đọc khi bảo vệ dữ liệu và phần cứng.
- [context/backend/service-patterns.md](context/backend/service-patterns.md) — Mẫu dịch vụ 3 lớp, lifecycle cleanup và custom service errors. Đọc khi tổ chức service layer.

---

## 6. QUY TẮC NHẬN LỆNH SLASH COMMANDS (CÓ PHANH AN TOÀN)

Khi người dùng gửi các lệnh Slash Commands sau, Agent **BẮT BUỘC** tuân thủ đúng quy trình:

### `/recover`
1. Đọc [context/core/progress-tracker.md](context/core/progress-tracker.md) và [context/core/build-plan.md](context/core/build-plan.md).
2. Chạy `npx tsc --noEmit` để kiểm tra tính toàn vẹn của mã nguồn hiện tại.
3. Tóm tắt ngắn gọn các Phase đã hoàn thành và **CHỈ RA DUY NHẤT** Phase tiếp theo cần thực hiện.
4. **DỪNG LẠI NGAY LẬP TỨC**, hỏi người dùng có muốn bắt đầu Phase đó không. **TUYỆT ĐỐI KHÔNG TỰ Ý VIẾT CODE.**

### `/architect`
1. Đóng vai Kiến trúc sư phần mềm, **CHỈ** phân tích thiết kế cho **DUY NHẤT Phase tiếp theo**.
2. Phân rã luồng UI và Logic, đối chiếu với [context/frontend/ui-registry.md](context/frontend/ui-registry.md) và [context/backend/database-schema.md](context/backend/database-schema.md).
3. Lập danh sách chi tiết các tập tin cụ thể sẽ tạo mới hoặc sửa đổi.
4. **DỪNG LẠI NGAY LẬP TỨC** và xin xác nhận **"Approve / Proceed"** từ người dùng trước khi tiến hành viết code. **CẤM CODE Ở BƯỚC NÀY.**

### `/test`
1. Áp dụng triết lý **Spec-First** (vận dụng skill `test-automation-engineer`): Viết test cases trước (Jest / React Native Testing) theo đúng Acceptance Criteria của Phase đã duyệt.
2. Chấp nhận các bài test có thể fail ở bước này vì code sản phẩm chưa được triển khai.

### `/build`
1. Chỉ viết mã nguồn để pass các test cases của **ĐÚNG Phase/Feature đã được duyệt** (vận dụng `mobile-app-builder`, `ui-designer`, `native-audio-timer-engineer`).
2. **Cấm tuyệt đối** đụng sang tính năng của các phase tương lai.

### `/review`
1. Đóng vai **Quality Assurance & Security Lead** (vận dụng skills `reality-checker`, `code-reviewer`, `ui-finish-gate-reviewer`, `accessibility-auditor`).
2. Chạy kiểm tra tĩnh `npx tsc --noEmit` và bộ test `npm test`.
3. Rà soát bảo mật, strict type safety (không có `any`), memory leak cleanup và tuân thủ [context/core/code-standards.md](context/core/code-standards.md).

### `/remember`
1. Đánh dấu `[x]` Phase vừa hoàn thành trong [context/core/progress-tracker.md](context/core/progress-tracker.md).
2. Ghi quyết định kỹ thuật mới (nếu có) vào mục ADR và cập nhật nhật ký vào Session Logs.
3. Tuyên bố kết thúc phiên thành công và gợi ý bước tiếp theo cho phiên sau.

### `/imprint`
1. Cập nhật lại các file tài liệu [context/core/architecture.md](context/core/architecture.md), [context/frontend/ui-registry.md](context/frontend/ui-registry.md), [context/backend/database-schema.md](context/backend/database-schema.md) nếu Phase vừa xong có sự thay đổi lớn về kiến trúc hoặc thành phần.
