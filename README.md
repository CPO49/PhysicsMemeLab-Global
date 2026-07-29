# 67HACK Game System V2

ชุดอัปเดตนี้ใช้ต่อจากโปรเจกต์ Codex เดิม โดยไม่สร้างโปรเจกต์ใหม่

## สิ่งที่เพิ่ม
- Game Design MVP แบบยืดหยุ่นสำหรับส่งต่อทีม
- Flow เดโม 60 วินาที
- Gesture Specification แบบไม่ฟิก implementation
- ระบบพลัง 67, Skill และ Boss
- Screen Blueprint
- Asset Requirements + Asset Manifest
- Backlog แบ่งงานให้ทีม
- Prompt สำหรับ Codex

## วิธีติดตั้ง
1. แตก ZIP
2. คัดลอกทุกอย่างด้านในไปวางที่ root ของโปรเจกต์เดิม
3. Merge/Replace เฉพาะไฟล์เอกสารที่ซ้ำ
4. ห้ามลบ `src/`, `package.json`, `node_modules/` หรือระบบเดิม
5. เปิดโปรเจกต์ใน Codex แล้วใช้ `CODEX_UPDATE_PROMPT.md`

## หมายเหตุ
ระบบ Gesture และ Camera ในเอกสารนี้เป็น behavioral contract ไม่บังคับ library หรือค่าทางเทคนิคตายตัว
เพื่อนในทีมสามารถเปลี่ยน implementation ได้ ตราบใดที่ UX และผลลัพธ์หลักยังตรงกัน
