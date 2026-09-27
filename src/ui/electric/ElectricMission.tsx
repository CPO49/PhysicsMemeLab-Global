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
      setInputError('Enter a number, such as 8 or 8V')
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
        <span>Electric Island</span>
        <strong>Mission 2 / Ohm’s law</strong>
      </header>

      {phase === 'lesson' && (
        <article className="electric-mission__lesson">
          <div className="electric-mission__lesson-heading">
            <p className="electric-mission__lesson-label">Before you begin</p>
            <h1 id="electric-title">Meet Ohm’s law</h1>
            <p>Ohm’s law describes the relationship between voltage, current, and resistance.</p>
          </div>

          <div className="electric-mission__lesson-grid">
            <section className="electric-mission__variable-panel" aria-labelledby="electric-variables-title">
              <h2 id="electric-variables-title">Key variables</h2>
              <dl className="electric-mission__variable-list">
                <div>
                  <dt><span>V</span> Voltage</dt>
                  <dd>Electric potential difference that drives current, measured in volts (V).</dd>
                </div>
                <div>
                  <dt><span>I</span> Current</dt>
                  <dd>The rate of electric charge flow, measured in amperes (A).</dd>
                </div>
                <div>
                  <dt><span>R</span> Resistance</dt>
                  <dd>Opposition to current flow, measured in ohms (Ω).</dd>
                </div>
              </dl>
            </section>

            <section className="electric-mission__example-panel" aria-labelledby="electric-example-title">
              <p className="electric-mission__formula-card" aria-label="V equals I times R">
                <span>V</span><b>=</b><span>I</span><b>x</b><span>R</span>
              </p>
              <h2 id="electric-example-title">Worked example</h2>
              <p className="electric-mission__example-question">If R = 4 Ω and I = 2 A, what voltage is needed?</p>
              <ol className="electric-mission__calculation-steps">
                <li>Choose the formula <strong>V = I x R</strong></li>
                <li>Substitute values <strong>V = 2 x 4</strong></li>
                <li>Calculate <strong>V = 8V</strong></li>
              </ol>
              <p className="electric-mission__lesson-tip">Tip: when I and R are given, multiply them to find V.</p>
            </section>
          </div>

          <button className="electric-mission__lesson-start" type="button" onClick={finishLesson}>
            Got it — start mission 2
          </button>
        </article>
      )}

      {phase === 'intro' && (
        <div className="electric-mission__intro">
          <div className="electric-mission__intro-copy">
            <p className="electric-mission__eyebrow">V = I x R</p>
            <h1 id="electric-title">Catch the electric mascot</h1>
            <p>Answer 3 voltage questions correctly. You have 20 seconds per question.</p>
          </div>
          <div className="electric-mission__hero" aria-hidden="true">
            <span className="electric-mission__hero-glow" />
            <img className="electric-mission__mascot" src={assets.final.electric.mascot} alt="" />
          </div>
          <button className="electric-mission__capture" type="button" onClick={beginQuiz}>
            <span className="electric-mission__ball-crop" aria-hidden="true">
              <img src={assets.final.electric.energyOrb} alt="" />
            </span>
            <span>Throw to catch the mascot</span>
          </button>
        </div>
      )}

      {phase === 'throwing' && (
        <div className="electric-mission__throwing" role="status">
          <img className="electric-mission__throw-target" src={assets.final.electric.mascot} alt="Electric mascot" />
          <span className="electric-mission__thrown-ball electric-mission__ball-crop" aria-hidden="true">
            <img src={assets.final.electric.energyOrb} alt="" />
          </span>
          <p>Calculate the voltage before the mascot zaps!</p>
        </div>
      )}

      {phase === 'quiz' && (
        <div className="electric-mission__quiz">
          <div className="electric-mission__quiz-character" aria-hidden="true">
            <img src={assets.final.electric.mascot} alt="" />
          </div>
          <div className="electric-mission__problem">
            <div className={`electric-mission__timer${remaining <= 5 ? ' is-urgent' : ''}`} role="timer" aria-live="polite" aria-label={`Remaining: ${remaining} seconds`}>
              <span>Time</span><strong>{remaining}</strong><small>seconds</small>
            </div>
            <p className="electric-mission__progress">Question {questionIndex + 1} / {electricQuestions.length}</p>
            <p className="electric-mission__formula">V = I x R</p>
            <h1 id="electric-title">What voltage is needed?</h1>
            <dl className="electric-mission__values">
              <div><dt>Resistance (R)</dt><dd>{question.resistance} Ω</dd></div>
              <div><dt>Current (I)</dt><dd>{question.current} A</dd></div>
            </dl>
            <form onSubmit={submit} noValidate>
              <label htmlFor="voltage-answer">Enter the voltage (V)</label>
              <div className="electric-mission__answer-row">
                <input
                  ref={inputRef}
                  id="voltage-answer"
                  inputMode="decimal"
                  autoComplete="off"
                  placeholder="e.g. 8V"
                  value={answer}
                  onChange={(event) => { setAnswer(event.target.value); setInputError('') }}
                  aria-invalid={Boolean(inputError)}
                  aria-describedby={inputError ? 'voltage-error' : 'voltage-hint'}
                />
                <button type="submit">Submit answer</button>
              </div>
              <p id="voltage-hint" className="electric-mission__hint">Calculate and type your answer. There are no multiple-choice options.</p>
              {inputError && <p id="voltage-error" className="electric-mission__input-error" role="alert">{inputError}</p>}
            </form>
          </div>
        </div>
      )}

      {(phase === 'failed' || phase === 'timeout') && (
        <div className="electric-mission__result electric-mission__result--fail" role="alert">
          <ElectricBurst />
          <img src={assets.final.electric.mascot} alt="Electric mascot releasing sparks" />
          <p className="electric-mission__result-kicker">{phase === 'timeout' ? '20 seconds — time is up!' : 'Incorrect answer!'}</p>
          <h1 id="electric-title">The mascot gave you a zap!</h1>
          <p className="electric-mission__solution">Answer: {formatElectricCalculation(question)}</p>
          <button type="button" onClick={beginQuiz}>Restart from question 1</button>
        </div>
      )}

      {phase === 'complete' && (
        <div className="electric-mission__result electric-mission__result--win" role="status">
          <ElectricBurst />
          <img src={assets.final.electric.mascot} alt="Electric mascot sparking after capture" />
          <p className="electric-mission__result-kicker">All 3 correct — caught it!</p>
          <h1 id="electric-title">Still sparking with energy!</h1>
          <p className="electric-mission__solution">Ohm’s law mission complete: V = I × R</p>
          <button type="button" onClick={leaveCompletedMission}>Claim 3 stars and return to map</button>
        </div>
      )}
    </section>
  )
}

function ElectricBurst() {
  return <span className="electric-mission__burst" aria-hidden="true" />
}
