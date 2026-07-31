import { useRef, useState, type ChangeEvent, type PointerEvent as ReactPointerEvent } from 'react'
import { LandingRenderer } from './LandingRenderer'
import {
  cloneLandingLayout,
  defaultLandingLayout,
  isLandingLayout,
  landingElementIds,
  loadLandingLayout,
  resetLandingLayout,
  saveLandingLayout,
  updateLandingElement,
  type LandingElementId,
  type LandingLayout,
  type LandingLayoutElement,
} from './landingLayout'
import './LandingLayoutStudio.css'

const labels: Record<LandingElementId, string> = {
  logo: 'Logo',
  mascot: 'Mascot',
  headline: 'Headline',
  support: 'Supporting copy',
  actions: 'Action buttons',
  infoCards: 'Information cards',
}

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value))
const snapValue = (value: number, enabled: boolean) => enabled ? Math.round(value) : Math.round(value * 10) / 10

export function LandingLayoutStudio({ onExit, onApply }: { onExit: () => void; onApply: () => void }) {
  const [layout, setLayout] = useState(loadLandingLayout)
  const [selectedId, setSelectedId] = useState<LandingElementId>('headline')
  const [history, setHistory] = useState<LandingLayout[]>([])
  const [future, setFuture] = useState<LandingLayout[]>([])
  const [snap, setSnap] = useState(true)
  const [grid, setGrid] = useState(true)
  const [preview, setPreview] = useState(false)
  const [zoom, setZoom] = useState(1)
  const canvasRef = useRef<HTMLDivElement | null>(null)
  const importRef = useRef<HTMLInputElement | null>(null)

  const commitDraft = (next: LandingLayout) => {
    setHistory((items) => [...items.slice(-39), cloneLandingLayout(layout)])
    setFuture([])
    setLayout(next)
  }

  const patchSelected = (patch: Partial<LandingLayoutElement>) => {
    commitDraft(updateLandingElement(layout, selectedId, patch))
  }

  const beginPointer = (id: LandingElementId, event: ReactPointerEvent<HTMLElement>, resize: boolean) => {
    event.preventDefault()
    const canvas = canvasRef.current
    const item = layout.elements[id]
    if (!canvas || item.locked) return
    setSelectedId(id)
    setHistory((items) => [...items.slice(-39), cloneLandingLayout(layout)])
    setFuture([])
    const startX = event.clientX
    const startY = event.clientY
    const start = { ...item }
    const move = (pointer: PointerEvent) => {
      const rect = canvas.getBoundingClientRect()
      const dx = ((pointer.clientX - startX) / rect.width) * 100
      const dy = ((pointer.clientY - startY) / rect.height) * 100
      const patch = resize
        ? { width: clamp(snapValue(start.width + dx, snap), 2, 100 - start.x), height: clamp(snapValue(start.height + dy, snap), 2, 100 - start.y) }
        : { x: clamp(snapValue(start.x + dx, snap), 0, 100 - start.width), y: clamp(snapValue(start.y + dy, snap), 0, 100 - start.height) }
      setLayout((current) => updateLandingElement(current, id, patch))
    }
    const up = () => {
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', up)
    }
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', up, { once: true })
  }

  const undo = () => {
    const previous = history.at(-1)
    if (!previous) return
    setFuture((items) => [cloneLandingLayout(layout), ...items])
    setLayout(previous)
    setHistory((items) => items.slice(0, -1))
  }
  const redo = () => {
    const next = future[0]
    if (!next) return
    setHistory((items) => [...items, cloneLandingLayout(layout)])
    setLayout(next)
    setFuture((items) => items.slice(1))
  }
  const save = () => {
    saveLandingLayout(layout)
    window.dispatchEvent(new Event('landing-layout-updated'))
  }
  const apply = () => { save(); onApply() }
  const reset = () => {
    if (!window.confirm('Reset Landing layout to the approved default?')) return
    commitDraft(cloneLandingLayout(defaultLandingLayout))
    resetLandingLayout()
  }
  const exportLayout = () => {
    const blob = new Blob([JSON.stringify(layout, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = 'meme-physics-landing-layout.json'
    anchor.click()
    URL.revokeObjectURL(url)
  }
  const importLayout = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    try {
      const parsed: unknown = JSON.parse(await file.text())
      if (!isLandingLayout(parsed)) throw new Error('Invalid layout schema')
      commitDraft(parsed)
    } catch (error) {
      window.alert(error instanceof Error ? error.message : 'Cannot import layout')
    } finally {
      event.target.value = ''
    }
  }
  const selected = layout.elements[selectedId]

  return <main className="layout-studio">
    <header className="layout-studio__topbar">
      <div><strong>Landing Layout Studio</strong><small>Changes use the same renderer as the live Landing page.</small></div>
      <div className="layout-studio__toolbar">
        <button type="button" onClick={undo} disabled={!history.length}>Undo</button>
        <button type="button" onClick={redo} disabled={!future.length}>Redo</button>
        <button type="button" className={grid ? 'is-active' : ''} onClick={() => setGrid((value) => !value)}>Grid</button>
        <button type="button" className={snap ? 'is-active' : ''} onClick={() => setSnap((value) => !value)}>Snap</button>
        <button type="button" onClick={() => setZoom((value) => clamp(value - .1, .5, 1.4))}>−</button>
        <span>{Math.round(zoom * 100)}%</span>
        <button type="button" onClick={() => setZoom((value) => clamp(value + .1, .5, 1.4))}>+</button>
        <button type="button" onClick={() => setZoom(1)}>Fit</button>
        <button type="button" className={preview ? 'is-active' : ''} onClick={() => setPreview((value) => !value)}>Preview</button>
      </div>
    </header>
    <aside className={`layout-studio__layers${preview ? ' is-hidden' : ''}`}>
      <h2>Layers</h2>
      {[...landingElementIds].sort((a, b) => layout.elements[b].zIndex - layout.elements[a].zIndex).map((id) => <button type="button" className={selectedId === id ? 'is-selected' : ''} key={id} onClick={() => setSelectedId(id)}>
        <span>{layout.elements[id].visible ? '●' : '○'}</span>{labels[id]}{layout.elements[id].locked ? ' 🔒' : ''}
      </button>)}
    </aside>
    <section className="layout-studio__workspace">
      <div className="layout-studio__scale" style={{ transform: `scale(${zoom})` }}>
        <div ref={canvasRef} className={`layout-studio__canvas${grid && !preview ? ' has-grid' : ''}`}>
          <LandingRenderer layout={layout} onStart={() => undefined} onQuickDemo={() => undefined} editor={!preview} selectedId={preview ? null : selectedId} onElementPointerDown={beginPointer} />
        </div>
      </div>
    </section>
    <aside className={`layout-studio__properties${preview ? ' is-hidden' : ''}`}>
      <h2>{labels[selectedId]}</h2>
      <div className="layout-studio__property-grid">
        {(['x', 'y', 'width', 'height', 'rotation', 'zIndex'] as const).map((key) => <label key={key}>{key}<input type="number" step={key === 'rotation' || key === 'zIndex' ? 1 : .1} value={selected[key]} onChange={(event) => patchSelected({ [key]: Number(event.target.value) })} /></label>)}
      </div>
      <label className="layout-studio__check"><input type="checkbox" checked={selected.visible} onChange={(event) => patchSelected({ visible: event.target.checked })} /> Visible</label>
      <label className="layout-studio__check"><input type="checkbox" checked={selected.locked} onChange={(event) => patchSelected({ locked: event.target.checked })} /> Locked</label>
      {selected.text !== undefined && <>
        <label>Text<textarea rows={selectedId === 'headline' ? 4 : 3} value={selected.text} onChange={(event) => patchSelected({ text: event.target.value })} /></label>
        <div className="layout-studio__property-grid">
          <label>fontSize<input type="number" value={selected.fontSize} onChange={(event) => patchSelected({ fontSize: Number(event.target.value) })} /></label>
          <label>fontWeight<input type="number" step="100" value={selected.fontWeight} onChange={(event) => patchSelected({ fontWeight: Number(event.target.value) })} /></label>
          <label>lineHeight<input type="number" step=".05" value={selected.lineHeight} onChange={(event) => patchSelected({ lineHeight: Number(event.target.value) })} /></label>
          <label>color<input type="color" value={selected.color} onChange={(event) => patchSelected({ color: event.target.value })} /></label>
        </div>
      </>}
    </aside>
    <footer className="layout-studio__footer">
      <button type="button" onClick={onExit}>Cancel</button>
      <button type="button" onClick={reset}>Reset default</button>
      <button type="button" onClick={exportLayout}>Export JSON</button>
      <button type="button" onClick={() => importRef.current?.click()}>Import JSON</button>
      <input ref={importRef} type="file" accept="application/json" hidden onChange={importLayout} />
      <button type="button" onClick={save}>Save draft</button>
      <button type="button" className="layout-studio__apply" onClick={apply}>Save &amp; Apply</button>
    </footer>
  </main>
}
