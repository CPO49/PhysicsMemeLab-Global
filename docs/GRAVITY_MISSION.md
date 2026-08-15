# Gravity Hand Lab

เกาะที่ 3 เป็นห้องทดลองแรงโน้มถ่วงที่ปลดล็อกหลังจบ Electric Mission

## Learning Goals

- เข้าใจว่ามวลไม่เปลี่ยนความเร่งของการตกในสุญญากาศ
- สังเกตผลของมวล รูปร่าง พื้นที่หน้าตัด และแรงต้านอากาศ
- ทดลองผลของค่า `g` ตั้งแต่ 1.6 ถึง 24.8 m/s²
- เปรียบเทียบการตกและการขว้างวัตถุในสภาพแวดล้อมต่างกัน

## Physics Model

- Vacuum mode: `a = g`
- Air mode: quadratic drag `Fdrag = 0.5 * rho * Cd * A * v^2`
- Motion uses a deterministic timestep capped at 1/30 second per rendered update
- Ground and wall collisions use a restitution coefficient

## Controls

- Camera: pinch thumb and index finger to hold an object
- While pinching: spread the other fingers to increase mass, curl them to decrease mass
- Move and release the pinch to throw
- Mouse/touch: drag and release an object
- Mass buttons provide a fallback for mass adjustment
