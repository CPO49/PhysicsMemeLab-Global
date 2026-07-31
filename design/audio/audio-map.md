# Audio map

| Source input | Copied asset | Used for |
| --- | --- | --- |
| `Sound/หน้าแรก.mp3` | `landing-theme.mp3` | Landing background music |
| `Sound/หน้าเกาะ.mp3` | `world-map-theme.mp3` | World Map background music |
| `Sound/อธิบายวิธีเล่น.mp3` | `projectile-island-ambience.mp3` | Projectile Island / mission ambience |
| `Sound/เล่นเสร็จ.mp3` | `summary-success.mp3` | Summary success cue |

Short interaction effects use the AudioManager's local Web Audio fallback: hover, click, mission start, locked island, 67 charge, skill unlock, projectile launch, hit, miss and success. Audio starts only after an interaction and missing audio never blocks the game.
