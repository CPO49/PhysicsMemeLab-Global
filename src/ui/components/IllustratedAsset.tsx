import { useState } from 'react'
import { assets, type AssetPath } from '../assets'

type IllustratedAssetProps = {
  src: AssetPath
  alt: string
  className?: string
}

export function IllustratedAsset({ src, alt, className = '' }: IllustratedAssetProps) {
  const [failed, setFailed] = useState(false)
  return <img className={className} src={failed ? assets.ui.placeholder : src} alt={failed ? `${alt} (รอ asset illustration)` : alt} onError={() => setFailed(true)} />
}
