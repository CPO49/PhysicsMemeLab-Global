import { useCallback, useEffect, useRef, useState } from 'react'
import { audioManager } from '../../audio/audioManager'
import { getGravityHandIntent, type MassGesture } from '../../gestures/gravityHandControl'
import { useCameraGesture } from '../../hooks/useCameraGesture'
import {
  clampGravity,
  clampMass,
  createGravityBody,
  defaultGravityEnvironment,
  releaseGravityBody,
  stepGravityBody,
  type GravityBody,
  type GravityMode,
  type GravityObjectKind,
} from '../../physics/gravity'
import './GravityMission.css'

type Phase = 'lesson' | 'lab' | 'summary'
type ExperimentProgress = { vacuum: boolean; air: boolean; gravity: boolean; mass: boolean }

const WORLD_WIDTH = defaultGravityEnvironment.width
const WORLD_HEIGHT = defaultGravityEnvironment.height
const objectAssets: Record<GravityObjectKind, string> = {
  ball: '/assets/generated/gravity/ball.svg',
  paper: '/assets/generated/gravity/paper.svg',
  feather: '/assets/generated/gravity/feather.svg',
}
const objectNames: Record<GravityObjectKind, string> = { ball: 'ลูกบอล', paper: 'กระดาษ', feather: 'ขนนก' }

type DragState = { id: string; pointerId: number; x: number; y: number; time: number } | null
type HandState = { heldId: string | null; x: number; y: number; time: number; vx: number; vy: number }

export function GravityMission({ onExit, onComplete }: { onExit: () => void; onComplete: (stars: number) => void }) {
  const [phase, setPhase] = useState<Phase>('lesson')
  const [mode, setMode] = useState<GravityMode>('vacuum')
  const [gravity, setGravity] = useState(9.81)
  const [bodies, setBodies] = useState<GravityBody[]>(() => [
    createGravityBody('ball', 'gravity-1', 3.7, 1.2),
    createGravityBody('paper', 'gravity-2', 7.4, 1.2),
  ])
  const [selectedId, setSelectedId] = useState('gravity-1')
  const [progress, setProgress] = useState<ExperimentProgress>({ vacuum: false, air: false, gravity: false, mass: false })
  const [handCursor, setHandCursor] = useState<{ x: number; y: number; pinching: boolean; massGesture: MassGesture } | null>(null)
  const sceneRef = useRef<HTMLDivElement>(null)
  const dragRef = useRef<DragState>(null)
  const handRef = useRef<HandState>({ heldId: null, x: 0, y: 0, time: 0, vx: 0, vy: 0 })
  const bodiesRef = useRef(bodies)
  const nextIdRef = useRef(3)
  const {
    videoRef,
    status: cameraStatus,
    error: cameraError,
    landmarks: cameraLandmarks,
    start: startCameraControl,
    stop: stopCameraControl,
  } = useCameraGesture(useCallback(() => undefined, []))
  const selectedBody = bodies.find((body) => body.id === selectedId) ?? bodies[0]
  const completedGoals = Object.values(progress).filter(Boolean).length

  useEffect(() => { bodiesRef.current = bodies }, [bodies])

  useEffect(() => {
    if (phase !== 'lab') return
    let frameId = 0
    let previous = performance.now()
    const tick = (now: number) => {
      const dt = Math.min((now - previous) / 1000, 1 / 30)
      previous = now
      setBodies((current) => current.map((body) => stepGravityBody(body, {
        ...defaultGravityEnvironment,
        mode,
        g: gravity,
      }, dt)))
      frameId = requestAnimationFrame(tick)
    }
    frameId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frameId)
  }, [gravity, mode, phase])

  useEffect(() => {
    if (phase !== 'lab' || !cameraLandmarks) return

    const intent = getGravityHandIntent(cameraLandmarks)
    const x = Math.max(0.3, Math.min(WORLD_WIDTH - 0.3, intent.cursor.x * WORLD_WIDTH))
    const y = Math.max(0.3, Math.min(WORLD_HEIGHT - 0.3, intent.cursor.y * WORLD_HEIGHT))
    const now = performance.now()
    const previous = handRef.current
    const dt = Math.max(0.016, (now - previous.time) / 1000)
    const vx = Math.max(-18, Math.min(18, (x - previous.x) / dt))
    const vy = Math.max(-18, Math.min(18, (y - previous.y) / dt))
    let heldId = previous.heldId

    if (intent.pinching && !heldId) {
      const nearest = bodiesRef.current
        .map((body) => ({ body, distance: Math.hypot(body.x - x, body.y - y) }))
        .filter(({ distance }) => distance < 1.1)
        .sort((a, b) => a.distance - b.distance)[0]
      if (nearest) {
        heldId = nearest.body.id
        setSelectedId(heldId)
        audioManager.play('click')
      }
    }

    if (heldId && intent.pinching) {
      const massDelta = intent.massGesture === 'increase' ? dt * 0.9 : intent.massGesture === 'decrease' ? -dt * 0.9 : 0
      setBodies((current) => current.map((body) => body.id === heldId
        ? { ...body, x, y, vx, vy, held: true, mass: clampMass(body.mass + massDelta) }
        : body))
      if (massDelta !== 0) setProgress((current) => ({ ...current, mass: true }))
    } else if (heldId && !intent.pinching) {
      const releasedId = heldId
      heldId = null
      setBodies((current) => current.map((body) => body.id === releasedId ? releaseGravityBody(body, vx, vy) : body))
      audioManager.play('launch')
    }

    handRef.current = { heldId, x, y, time: now, vx, vy }
    setHandCursor({ x, y, pinching: intent.pinching, massGesture: intent.massGesture })
  }, [cameraLandmarks, phase])

  useEffect(() => () => stopCameraControl(), [stopCameraControl])

  const scenePoint = (clientX: number, clientY: number) => {
    const rect = sceneRef.current?.getBoundingClientRect()
    if (!rect) return { x: 0, y: 0 }
    return {
      x: Math.max(0.3, Math.min(WORLD_WIDTH - 0.3, ((clientX - rect.left) / rect.width) * WORLD_WIDTH)),
      y: Math.max(0.3, Math.min(WORLD_HEIGHT - 0.3, ((clientY - rect.top) / rect.height) * WORLD_HEIGHT)),
    }
  }

  const beginPointerGrab = (event: React.PointerEvent<HTMLButtonElement>, id: string) => {
    const point = scenePoint(event.clientX, event.clientY)
    sceneRef.current?.setPointerCapture(event.pointerId)
    dragRef.current = { id, pointerId: event.pointerId, ...point, time: event.timeStamp }
    setSelectedId(id)
    setBodies((current) => current.map((body) => body.id === id ? { ...body, ...point, vx: 0, vy: 0, held: true } : body))
  }

  const movePointerGrab = (event: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current
    if (!drag || drag.pointerId !== event.pointerId) return
    const point = scenePoint(event.clientX, event.clientY)
    const now = event.timeStamp
    const dt = Math.max(0.016, (now - drag.time) / 1000)
    const vx = Math.max(-18, Math.min(18, (point.x - drag.x) / dt))
    const vy = Math.max(-18, Math.min(18, (point.y - drag.y) / dt))
    dragRef.current = { ...drag, ...point, time: now }
    setBodies((current) => current.map((body) => body.id === drag.id ? { ...body, ...point, vx, vy, held: true } : body))
  }

  const releasePointerGrab = (event: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current
    if (!drag || drag.pointerId !== event.pointerId) return
    if (sceneRef.current?.hasPointerCapture(event.pointerId)) {
      sceneRef.current.releasePointerCapture(event.pointerId)
    }
    setBodies((current) => current.map((body) => body.id === drag.id ? { ...body, held: false } : body))
    dragRef.current = null
    audioManager.play('launch')
  }

  const addObject = (kind: GravityObjectKind) => {
    if (bodies.length >= 6) return
    const id = `gravity-${nextIdRef.current++}`
    const x = 2 + ((bodies.length * 1.8) % 8)
    setBodies((current) => [...current, createGravityBody(kind, id, x, 1)])
    setSelectedId(id)
    audioManager.play('click')
  }

  const changeMass = (delta: number) => {
    if (!selectedBody) return
    setBodies((current) => current.map((body) => body.id === selectedBody.id ? { ...body, mass: clampMass(body.mass + delta) } : body))
    setProgress((current) => ({ ...current, mass: true }))
  }

  const dropAll = () => {
    setBodies((current) => current.map((body, index) => ({ ...body, x: 2 + index * (8 / Math.max(1, current.length - 1)), y: 0.85, vx: 0, vy: 0, held: false })))
    setProgress((current) => ({ ...current, [mode]: true }))
    audioManager.play('launch')
  }

  const resetLab = () => {
    const activeDrag = dragRef.current
    if (activeDrag && sceneRef.current?.hasPointerCapture(activeDrag.pointerId)) {
      sceneRef.current.releasePointerCapture(activeDrag.pointerId)
    }
    setBodies([
      createGravityBody('ball', 'gravity-1', 3.7, 1.2),
      createGravityBody('paper', 'gravity-2', 7.4, 1.2),
    ])
    setSelectedId('gravity-1')
    dragRef.current = null
    handRef.current.heldId = null
  }

  const setGravityValue = (value: number) => {
    const next = clampGravity(value)
    setGravity(next)
    if (Math.abs(next - 9.81) > 0.1) setProgress((current) => ({ ...current, gravity: true }))
  }

  const finishMission = () => {
    stopCameraControl()
    setHandCursor(null)
    setPhase('summary')
  }

  const toggleCameraControl = () => {
    if (cameraStatus === 'ready') {
      stopCameraControl()
      setHandCursor(null)
      handRef.current.heldId = null
      setBodies((current) => current.map((body) => ({ ...body, held: false })))
      return
    }
    startCameraControl()
  }

  if (phase === 'lesson') return <GravityLesson onStart={() => setPhase('lab')} onExit={onExit} />
  if (phase === 'summary') return <GravitySummary progress={progress} onReplay={() => setPhase('lab')} onComplete={() => { onComplete(3); onExit() }} />

  return (
    <section className="gravity-mission" aria-labelledby="gravity-title">
      <header className="gravity-mission__topbar">
        <div><span>เกาะที่ 3</span><h1 id="gravity-title">Gravity Hand Lab</h1></div>
        <div className="gravity-mission__goal-count" aria-label={`ทำภารกิจแล้ว ${completedGoals} จาก 4`}>{completedGoals}/4 ภารกิจ</div>
      </header>

      <div className="gravity-mission__workspace">
        <main className="gravity-mission__stage-wrap">
          <div className="gravity-mission__stage-toolbar">
            <div className="gravity-mission__mode" aria-label="โหมดสภาพแวดล้อม">
              <button type="button" className={mode === 'vacuum' ? 'is-active' : ''} onClick={() => setMode('vacuum')}>สุญญากาศ</button>
              <button type="button" className={mode === 'air' ? 'is-active' : ''} onClick={() => setMode('air')}>มีแรงต้านอากาศ</button>
            </div>
            <span className="gravity-mission__equation">{mode === 'vacuum' ? 'a = g' : 'Fdrag = ½ρCdAv²'}</span>
          </div>

          <div
            ref={sceneRef}
            className={`gravity-mission__scene gravity-mission__scene--${mode}`}
            onPointerMove={movePointerGrab}
            onPointerUp={releasePointerGrab}
            onPointerCancel={releasePointerGrab}
          >
            <div className="gravity-mission__height-scale" aria-hidden="true"><span>0 m</span><span>3.5 m</span><span>7 m</span></div>
            <div className="gravity-mission__air-lines" aria-hidden="true" />
            {bodies.map((body) => (
              <button
                key={body.id}
                type="button"
                className={`gravity-object gravity-object--${body.kind}${body.id === selectedId ? ' is-selected' : ''}${body.held ? ' is-held' : ''}`}
                style={{ left: `${(body.x / WORLD_WIDTH) * 100}%`, top: `${(body.y / WORLD_HEIGHT) * 100}%`, '--gravity-object-size': `${Math.max(7, body.radius * 22)}%` } as React.CSSProperties}
                onPointerDown={(event) => beginPointerGrab(event, body.id)}
                aria-label={`${objectNames[body.kind]} มวล ${body.mass.toFixed(2)} กิโลกรัม`}
              >
                <img src={objectAssets[body.kind]} alt="" />
                <span>{body.mass.toFixed(2)} kg</span>
              </button>
            ))}
            {handCursor && cameraLandmarks && (
              <div className={`gravity-hand-cursor${handCursor.pinching ? ' is-pinching' : ''}`} style={{ left: `${(handCursor.x / WORLD_WIDTH) * 100}%`, top: `${(handCursor.y / WORLD_HEIGHT) * 100}%` }} aria-hidden="true">
                <span />
                <b>{handCursor.pinching ? handCursor.massGesture === 'increase' ? '+ มวล' : handCursor.massGesture === 'decrease' ? '− มวล' : 'จับอยู่' : 'หนีบเพื่อจับ'}</b>
              </div>
            )}
            <div className="gravity-mission__ground"><span>พื้นทดลอง</span></div>
          </div>

          <div className="gravity-mission__actions">
            <button type="button" onClick={dropAll}>ปล่อยพร้อมกัน</button>
            <button type="button" onClick={resetLab}>รีเซ็ตฉาก</button>
            <button type="button" disabled={completedGoals < 4} onClick={finishMission}>สรุปผลการทดลอง</button>
          </div>
        </main>

        <aside className="gravity-mission__controls">
          <section className="gravity-control gravity-control--gravity">
            <div className="gravity-control__heading"><h2>ค่าแรงโน้มถ่วง</h2><output>{gravity.toFixed(2)} m/s²</output></div>
            <input type="range" min="1.6" max="24.8" step="0.1" value={gravity} onInput={(event) => setGravityValue(event.currentTarget.valueAsNumber)} aria-label={`ค่าแรงโน้มถ่วง ${gravity.toFixed(2)} เมตรต่อวินาทีกำลังสอง`} />
            <div className="gravity-control__presets">
              <button type="button" onClick={() => setGravityValue(1.62)}>ดวงจันทร์</button>
              <button type="button" onClick={() => setGravityValue(9.81)}>โลก</button>
              <button type="button" onClick={() => setGravityValue(24.79)}>ดาวพฤหัส</button>
            </div>
          </section>

          <section className="gravity-control">
            <h2>เพิ่มวัตถุ</h2>
            <div className="gravity-control__objects">
              {(Object.keys(objectAssets) as GravityObjectKind[]).map((kind) => <button type="button" key={kind} disabled={bodies.length >= 6} onClick={() => addObject(kind)}><img src={objectAssets[kind]} alt="" /><span>{objectNames[kind]}</span></button>)}
            </div>
          </section>

          <section className="gravity-control gravity-control--selected">
            <div><h2>วัตถุที่เลือก</h2><strong>{selectedBody ? objectNames[selectedBody.kind] : '-'}</strong></div>
            {selectedBody && <><p>มวล <b>{selectedBody.mass.toFixed(2)} kg</b></p><div className="gravity-control__mass-buttons"><button type="button" onClick={() => changeMass(-0.1)} aria-label="ลดมวล">−</button><button type="button" onClick={() => changeMass(0.1)} aria-label="เพิ่มมวล">+</button></div><small>กล้อง: หนีบนิ้วเพื่อจับ กางนิ้วเพิ่มมวล งอนิ้วลดมวล</small></>}
          </section>

          <section className="gravity-control gravity-control--camera">
            <div className="gravity-control__heading"><h2>เซนเซอร์มือ</h2><span className={`gravity-camera-status gravity-camera-status--${cameraStatus}`}>{cameraStatus === 'ready' ? 'พร้อม' : cameraStatus === 'loading' ? 'กำลังเปิด' : 'ปิดอยู่'}</span></div>
            <div className="gravity-camera-view">
              <video ref={videoRef} muted playsInline />
              {cameraLandmarks?.map((point, index) => <i key={index} style={{ left: `${(1 - point.x) * 100}%`, top: `${point.y * 100}%` }} />)}
              {cameraStatus !== 'ready' && <p>ภาพกล้องประมวลผลในเครื่องเท่านั้น</p>}
            </div>
            {cameraError && <p className="gravity-camera-error">เปิดกล้องไม่สำเร็จ ใช้เมาส์หรือนิ้วลากแทนได้</p>}
            <button type="button" disabled={cameraStatus === 'loading'} onClick={toggleCameraControl}>{cameraStatus === 'ready' ? 'ปิดกล้อง' : cameraStatus === 'loading' ? 'กำลังเปิดกล้อง...' : 'เปิดกล้องและเซนเซอร์มือ'}</button>
          </section>

          <section className="gravity-control gravity-control--tasks">
            <h2>ภารกิจทดลอง</h2>
            <Task done={progress.vacuum}>ปล่อยวัตถุในสุญญากาศ</Task>
            <Task done={progress.air}>ทดลองในโหมดอากาศ</Task>
            <Task done={progress.gravity}>เปลี่ยนค่า g จากโลก</Task>
            <Task done={progress.mass}>เพิ่มหรือลดมวลวัตถุ</Task>
          </section>
        </aside>
      </div>
    </section>
  )
}

function Task({ done, children }: { done: boolean; children: React.ReactNode }) {
  return <p className={done ? 'is-done' : ''}><span aria-hidden="true">{done ? '✓' : ''}</span>{children}</p>
}

function GravityLesson({ onStart, onExit }: { onStart: () => void; onExit: () => void }) {
  return <section className="gravity-lesson" aria-labelledby="gravity-lesson-title">
    <button className="gravity-lesson__back" type="button" onClick={onExit}>กลับแผนที่</button>
    <div className="gravity-lesson__content">
      <p className="gravity-lesson__label">เกาะที่ 3 / บทเรียนก่อนทดลอง</p>
      <h1 id="gravity-lesson-title">มวลกับแรงโน้มถ่วง ทำให้ตกต่างกันจริงไหม?</h1>
      <div className="gravity-lesson__modes">
        <article><span>01</span><h2>สุญญากาศ</h2><p>วัตถุทุกมวลตกด้วยความเร่งเท่ากับค่า <b>g</b> มวลไม่ทำให้ตกเร็วขึ้น</p><strong>a = g</strong></article>
        <article><span>02</span><h2>มีอากาศ</h2><p>แรงต้านขึ้นกับรูปร่าง พื้นที่หน้าตัด ความเร็ว และมวล วัตถุจึงตกต่างกันได้</p><strong>Fdrag = ½ρCdAv²</strong></article>
      </div>
      <div className="gravity-lesson__gestures"><h2>ควบคุมด้วยมือ</h2><ol><li><b>หนีบนิ้วโป้งกับนิ้วชี้</b><span>จับและลากวัตถุ</span></li><li><b>กางนิ้วที่เหลือระหว่างจับ</b><span>เพิ่มมวลวัตถุ</span></li><li><b>งอนิ้วเข้าระหว่างจับ</b><span>ลดมวลวัตถุ</span></li><li><b>สะบัดแล้วปล่อยการหนีบ</b><span>ปาวัตถุออกไป</span></li></ol></div>
      <button className="gravity-lesson__start" type="button" onClick={onStart}>เข้าใจแล้ว เข้าห้องทดลอง</button>
    </div>
  </section>
}

function GravitySummary({ progress, onReplay, onComplete }: { progress: ExperimentProgress; onReplay: () => void; onComplete: () => void }) {
  return <section className="gravity-summary" aria-labelledby="gravity-summary-title"><div className="gravity-summary__report"><p>รายงานการทดลองเกาะที่ 3</p><h1 id="gravity-summary-title">สิ่งที่ค้นพบจาก Gravity Lab</h1><div className="gravity-summary__findings"><article><b>สุญญากาศ</b><p>มวลมากหรือน้อยไม่เปลี่ยนความเร่งจากแรงโน้มถ่วง วัตถุตกพร้อมกันเมื่อปล่อยจากความสูงเดียวกัน</p></article><article><b>แรงต้านอากาศ</b><p>รูปร่าง พื้นที่หน้าตัด และมวลส่งผลต่อแรงต้าน วัตถุจึงตกไม่เหมือนกัน</p></article><article><b>ค่า g</b><p>ค่า g สูงทำให้ความเร็วแนวดิ่งเพิ่มเร็วขึ้น ค่า g ต่ำทำให้วัตถุลอยและตกช้าลง</p></article></div><p className="gravity-summary__score">ทำภารกิจครบ {Object.values(progress).filter(Boolean).length}/4 รับ 3 ดาว</p><div className="gravity-summary__actions"><button type="button" onClick={onReplay}>ทดลองอีกครั้ง</button><button type="button" onClick={onComplete}>รับดาวและกลับแผนที่</button></div></div></section>
}
