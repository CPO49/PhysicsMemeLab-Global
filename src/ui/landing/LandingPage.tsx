import { useEffect, useState } from 'react'
import { LandingRenderer } from './LandingRenderer'
import { loadLandingLayout } from './landingLayout'
import './LandingPage.css'

export function LandingPage({ onStart, onQuickDemo }: { onStart: () => void; onQuickDemo: () => void }) {
  const [layout, setLayout] = useState(loadLandingLayout)
  useEffect(() => {
    const refresh = () => setLayout(loadLandingLayout())
    window.addEventListener('storage', refresh)
    window.addEventListener('landing-layout-updated', refresh)
    return () => {
      window.removeEventListener('storage', refresh)
      window.removeEventListener('landing-layout-updated', refresh)
    }
  }, [])
  return <LandingRenderer layout={layout} onStart={onStart} onQuickDemo={onQuickDemo} />
}
