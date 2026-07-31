# G.3 Interaction Map

All listed controls use native `<button>` or `<a>` semantics, have an accessible name, retain the global visible `:focus-visible` outline, and receive hover/pressed states through their page CSS.

| Surface/control | State change / destination | Mouse / keyboard behavior | Close / disabled behavior | Test assertion |
| --- | --- | --- | --- | --- |
| Landing: เริ่มการเดินทาง | `screen = map` | Click; Enter/Space on focused link | Never disabled | Map HUD is visible after activation. |
| Landing: โหมดทดลองด่วน | `screen = mission`, `demo = true` | Click; Enter/Space | Never disabled | Mission opens in demo mode. |
| Landing: ใช้กล้อง | `inputMode = camera` | Click; Enter/Space | Shows selected state and camera-readiness notice | `camera` appears in selected/readiness UI. |
| Landing: เล่นด้วยมือ | `inputMode = gesture` | Click; Enter/Space | Shows selected state | `gesture` is selected. |
| Landing: เล่นด้วยเมาส์ (สำรอง) | `inputMode = mouse` | Click; Enter/Space | Shows selected state; fallback remains playable | `mouse` is selected. |
| Map: Energy HUD | Reads `uiState.energy` | Not a button | N/A | Initial value is state-backed `67`. |
| Map: Diamond HUD | Reads `uiState.diamonds` | Not a button | N/A | Initial value is state-backed `670`. |
| Map: Profile | `profileOpen` toggles | Click; Enter/Space | Outside pointer and Escape close it | Dropdown opens, then closes with Escape/outside click. |
| Map: ภารกิจ | `activePanel = missions` | Click; Enter/Space | Modal close/Escape | Mission panel opens. |
| Map: สถิติของฉัน | `activePanel = statistics` | Click; Enter/Space | Modal close/Escape | Statistics panel opens. |
| Map: คอลเลกชัน | `activePanel = collection` | Click; Enter/Space | Modal close/Escape | Collection panel opens. |
| Map: ตั้งค่า | `activePanel = settings` | Click; Enter/Space | Modal close/Escape; sound/animation toggles mutate UI state | Settings panel and toggles work. |
| Map: Projectile Island | `screen = hub` | Click; Enter/Space | Enabled only for active island | Hub title visible. |
| Map: locked islands | `activePanel = locked` with island context | Click; Enter/Space | Modal names unlock condition; close/Escape | Locked modal opens. |
| Map: Mystery Island | `activePanel = comingSoon` with island context | Click; Enter/Space | Close/Escape | Coming Soon modal opens. |

No decorative SVG is interactive. Any visual component without a behavior is rendered as an image, `<span>`, or `<article>`, never as a button.
