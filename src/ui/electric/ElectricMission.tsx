import { useEffect, useRef, useState } from 'react'
import { audioManager } from '../../audio/audioManager'
import { assets } from '../assets'
import {
  electricQuestions,
  formatElectricCalculation,
  parseVoltage,
} from './electricMissionLogic'
import './ElectricMission.css'

type Phase = 'lesson' | 'intro' | 'throwing' | 'quiz' | 'failed' | 'timeout' | 'complete'

export function ElectricMission({ onExit, onComplete }: { onExit: () => void; onComplete: (stars: number) => void }) {
  const [phase, setPhase] = useState<Phase>('lesson')
  const [questionIndex, setQuestionIndex] = useState(0)
  const [answer, setAnswer] = useState('')
  const [remaining, setRemaining] = useState(20)
  const [inputError, setInputError] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const question = electricQuestions[questionIndex]

  useEffect(() => {
    if (phase !== 'throwing') return
    const timeoutId = window.setTimeout(() => setPhase('quiz'), 650)
    return () => window.clearTimeout(timeoutId)
  }, [phase])

  useEffect(() => {
    if (phase !== 'quiz') return
    inputRef.current?.focus()
    const deadline = Date.now() + 20_000
    const intervalId = window.setInterval(() => {
      setRemaining(Math.max(0, Math.ceil((deadline - Date.now()) / 1000)))
    }, 250)
    const timeoutId = window.setTimeout(() => {
      setRemaining(0)
      audioManager.play('miss')
      setPhase('timeout')
    }, 20_000)
    return () => {
      window.clearInterval(intervalId)
      window.clearTimeout(timeoutId)
    }
  }, [phase, questionIndex])

  const resetQuiz = () => {
    setQuestionIndex(0)
    setAnswer('')
    setInputError('')
    setRemaining(20)
  }

  const beginQuiz = () => {
    audioManager.play('missionStart')
    resetQuiz()
    setPhase('throwing')
  }

  const finishLesson = () => {
    audioManager.play('click')
    setPhase('intro')
  }

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const voltage = parseVoltage(answer)
    if (voltage === null) {
      setInputError('พิมพ์เป็นตัวเลข เช่น 8 หรือ 8V')
      return
    }
    if (voltage !== question.answer) {
      audioManager.play('miss')
      setPhase('failed')
      return
    }

    audioManager.play('hit')
    if (questionIndex === electricQuestions.length - 1) {
      setPhase('complete')
      return
    }
    setQuestionIndex((current) => current + 1)
    setAnswer('')
    setInputError('')
    setRemaining(20)
  }

  const leaveCompletedMission = () => {
    audioManager.play('success')
    onComplete(3)
    onExit()
  }

  return (
    <section className={`electric-mission electric-mission--${phase}`} aria-labelledby="electric-title">
      <header className="electric-mission__header">
        <span>เกาะไฟฟ้า</span>
        <strong>ด่าน 2 / กฎของโอห์ม</strong>
      </header>

      {phase === 'lesson' && (
        <article className="electric-mission__lesson">
          <div className="electric-mission__lesson-heading">
            <p className="electric-mission__lesson-label">บทเรียนก่อนเริ่มภารกิจ</p>
            <h1 id="electric-title">รู้จักกฎของโอห์ม</h1>
            <p>กฎของโอห์มใช้อธิบายความสัมพันธ์ระหว่างแรงดันไฟฟ้า กระแสไฟฟ้า และความต้านทาน</p>
          </div>

          <div className="electric-mission__lesson-grid">
            <section className="electric-mission__variable-panel" aria-labelledby="electric-variables-title">
              <h2 id="electric-variables-title">ตัวแปรที่ต้องรู้</h2>
              <dl className="electric-mission__variable-list">
                <div>
                  <dt><span>V</span> แรงดันไฟฟ้า</dt>
                  <dd>แรงที่ผลักให้กระแสไฟฟ้าไหล หน่วยเป็นโวลต์ (V)</dd>
                </div>
                <div>
                  <dt><span>I</span> กระแสไฟฟ้า</dt>
                  <dd>ปริมาณกระแสที่ไหลในวงจร หน่วยเป็นแอมแปร์ (A)</dd>
                </div>
                <div>
                  <dt><span>R</span> ความต้านทาน</dt>
                  <dd>สิ่งที่ขัดขวางการไหลของกระแส หน่วยเป็นโอห์ม (Ω)</dd>
                </div>
              </dl>
            </section>

            <section className="electric-mission__example-panel" aria-labelledby="electric-example-title">
              <p className="electric-mission__formula-card" aria-label="วี เท่ากับ ไอ คูณ อาร์">
                <span>V</span><b>=</b><span>I</span><b>x</b><span>R</span>
              </p>
              <h2 id="electric-example-title">ตัวอย่างวิธีคำนวณ</h2>
              <p className="electric-mission__example-question">ถ้า R = 4 Ω และ I = 2 A ต้องใช้แรงดันไฟฟ้าเท่าไหร่?</p>
              <ol className="electric-mission__calculation-steps">
                <li>เลือกสูตร <strong>V = I x R</strong></li>
                <li>แทนค่า <strong>V = 2 x 4</strong></li>
                <li>คำนวณได้ <strong>V = 8V</strong></li>
              </ol>
              <p className="electric-mission__lesson-tip">จำง่าย ๆ: ถ้าโจทย์ให้ I และ R ให้นำสองค่านี้มาคูณกัน</p>
            </section>
          </div>

          <button className="electric-mission__lesson-start" type="button" onClick={finishLesson}>
            เข้าใจแล้ว เริ่มด่าน 2
          </button>
        </article>
      )}

      {phase === 'intro' && (
        <div className="electric-mission__intro">
          <div className="electric-mission__intro-copy">
            <p className="electric-mission__eyebrow">V = I x R</p>
            <h1 id="electric-title">จับปิกาจูด้วยพลังไฟฟ้า</h1>
            <p>ตอบค่าแรงดันไฟฟ้าให้ถูก 3 ข้อ ข้อละ 20 วินาที</p>
          </div>
          <div className="electric-mission__hero" aria-hidden="true">
            <span className="electric-mission__hero-glow" />
            <img className="electric-mission__pikachu" src={assets.final.electric.pikachu} alt="" />
          </div>
          <button className="electric-mission__capture" type="button" onClick={beginQuiz}>
            <span className="electric-mission__ball-crop" aria-hidden="true">
              <img src={assets.final.electric.pokeball} alt="" />
            </span>
            <span>โยน = จับปิกาจู</span>
          </button>
        </div>
      )}

      {phase === 'throwing' && (
        <div className="electric-mission__throwing" role="status">
          <img className="electric-mission__throw-target" src={assets.final.electric.pikachu} alt="ปิกาจู" />
          <span className="electric-mission__thrown-ball electric-mission__ball-crop" aria-hidden="true">
            <img src={assets.final.electric.pokeball} alt="" />
          </span>
          <p>คำนวณแรงดันให้ทัน ก่อนปิกาจูจะช็อต!</p>
        </div>
      )}

      {phase === 'quiz' && (
        <div className="electric-mission__quiz">
          <div className="electric-mission__quiz-character" aria-hidden="true">
            <img src={assets.final.electric.pikachu} alt="" />
          </div>
          <div className="electric-mission__problem">
            <div className={`electric-mission__timer${remaining <= 5 ? ' is-urgent' : ''}`} role="timer" aria-live="polite" aria-label={`เหลือ ${remaining} วินาที`}>
              <span>เวลา</span><strong>{remaining}</strong><small>วินาที</small>
            </div>
            <p className="electric-mission__progress">ข้อ {questionIndex + 1} / {electricQuestions.length}</p>
            <p className="electric-mission__formula">V = I x R</p>
            <h1 id="electric-title">ต้องใช้แรงดันไฟฟ้าเท่าไหร่?</h1>
            <dl className="electric-mission__values">
              <div><dt>ความต้านทาน (R)</dt><dd>{question.resistance} Ω</dd></div>
              <div><dt>กระแสไฟฟ้า (I)</dt><dd>{question.current} A</dd></div>
            </dl>
            <form onSubmit={submit} noValidate>
              <label htmlFor="voltage-answer">พิมพ์คำตอบแรงดันไฟฟ้า (V)</label>
              <div className="electric-mission__answer-row">
                <input
                  ref={inputRef}
                  id="voltage-answer"
                  inputMode="decimal"
                  autoComplete="off"
                  placeholder="เช่น 8V"
                  value={answer}
                  onChange={(event) => { setAnswer(event.target.value); setInputError('') }}
                  aria-invalid={Boolean(inputError)}
                  aria-describedby={inputError ? 'voltage-error' : 'voltage-hint'}
                />
                <button type="submit">ยืนยันคำตอบ</button>
              </div>
              <p id="voltage-hint" className="electric-mission__hint">ไม่มีตัวเลือก ต้องคำนวณและพิมพ์คำตอบเอง</p>
              {inputError && <p id="voltage-error" className="electric-mission__input-error" role="alert">{inputError}</p>}
            </form>
          </div>
        </div>
      )}

      {(phase === 'failed' || phase === 'timeout') && (
        <div className="electric-mission__result electric-mission__result--fail" role="alert">
          <ElectricBurst />
          <img src={assets.final.electric.pikachu} alt="ปิกาจูปล่อยไฟฟ้า" />
          <p className="electric-mission__result-kicker">{phase === 'timeout' ? 'หมดเวลา 20 วินาที!' : 'ตอบผิด!'}</p>
          <h1 id="electric-title">โดนปิกาจูช็อตเข้าให้</h1>
          <p className="electric-mission__solution">คำตอบคือ {formatElectricCalculation(question)}</p>
          <button type="button" onClick={beginQuiz}>เริ่มใหม่ตั้งแต่ข้อ 1</button>
        </div>
      )}

      {phase === 'complete' && (
        <div className="electric-mission__result electric-mission__result--win" role="status">
          <ElectricBurst />
          <img src={assets.final.electric.pikachu} alt="ปิกาจูปล่อยไฟฟ้าหลังถูกจับ" />
          <p className="electric-mission__result-kicker">ตอบถูกครบ 3 ข้อ จับได้แล้ว!</p>
          <h1 id="electric-title">แต่ปิกาจูยังช็อตใส่อยู่ดี</h1>
          <p className="electric-mission__solution">ผ่านด่านกฎของโอห์ม V = I x R</p>
          <button type="button" onClick={leaveCompletedMission}>รับ 3 ดาวและกลับแผนที่</button>
        </div>
      )}
    </section>
  )
}

function ElectricBurst() {
  return <span className="electric-mission__burst" aria-hidden="true" />
}
