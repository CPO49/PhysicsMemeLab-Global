อ่าน AGENTS.md และเอกสารทั้งหมดใน docs/, design/ และ tasks/ ก่อนแก้โค้ด

ให้เอกสารในชุด 67HACK Game System V2 เป็น Source of Truth ล่าสุด โดยเฉพาะ:
- docs/GAME_DESIGN_MVP.md
- docs/DEMO_60S_FLOW.md
- docs/GESTURE_SPEC.md
- docs/SKILL_AND_BOSS_SYSTEM.md
- design/SCREEN_BLUEPRINT_V2.md
- design/ASSET_REQUIREMENTS.md
- design/asset-manifest.json
- tasks/02_TEAM_BACKLOG.md

เป้าหมาย:
อัปเดตโปรเจกต์เดิมให้รองรับ Core Loop ใหม่ โดยยังรักษา Route, Physics, Camera, Gesture และ UI ที่ใช้ต่อได้

Core Loop:
World Map
→ Projectile Island
→ Mission Brief
→ Prediction
→ Gesture Tutorial
→ Basic Shot
→ 67 Power Charge
→ Skill Sign
→ Trajectory Vision
→ Retry Shot
→ Concept Check
→ Summary

กติกาหลัก:
- 67 เป็น Core Energy Mechanic: ทำท่า 67 รัว ๆ เพื่อเติมหลอดพลัง
- ท่าง้างยิงควบคุมมุมและความเร็วต้น
- ท่าคาถา Demo ใช้ลำดับง่าย 2 ขั้นเพื่อเรียก Trajectory Vision
- ระบบต้องยืดหยุ่น ห้ามฟิก implementation ของ Computer Vision เกินจำเป็น
- มี Mouse/Keyboard fallback สำหรับทุก Gesture สำคัญ
- MVP เล่นจริง 1 เกาะ 1 Mission 1 Skill
- Boss, Skill Tree, Collection และเกาะอื่นทำเป็น Preview หรือ mock state
- ตัวละครและ Asset ต้องเป็นต้นฉบับ ห้ามใช้ตัวละครมีลิขสิทธิ์ตรง ๆ
- Italian Brainrot ใช้เป็นแรงบันดาลใจด้านความปั่นเท่านั้น

ก่อนเริ่ม:
1. แสดง git status
2. สรุปโครงสร้างปัจจุบันและบอกส่วนที่ reuse ได้
3. ถ้ามี .git ให้ทำ checkpoint commit
4. ถ้าไม่มี .git ให้แจ้งและห้ามลบงานเดิม
5. เสนอแผนสั้น ๆ แล้วเริ่มทำได้

ทำเฉพาะ Milestone A ก่อน:
- เพิ่ม state model สำหรับ energy, skill และ learning session
- เพิ่ม UI slot สำหรับ 67 energy bar
- เพิ่ม UI slot สำหรับ skill sign และ Trajectory Vision
- เตรียม asset paths ตาม design/asset-manifest.json
- รักษา Landing / World Map / Island Hub เดิมไว้
- อย่าเริ่ม Boss fight จริง

เมื่อเสร็จ:
- รัน lint
- รัน test
- รัน build
- สรุปไฟล์ที่แก้
- หยุดรอ review
- ห้าม push อัตโนมัติ
