import { useState } from 'react'
import type { AssetPath } from '../assets'

type IllustratedAssetProps = {
  src: AssetPath
  debugSrc?: AssetPath
  alt: string
  className?: string
}

export function IllustratedAsset({
  src,
  debugSrc,
  alt,
  className = '',
}: IllustratedAssetProps) {
  const candidates = [src, debugSrc].filter(Boolean) as AssetPath[]
  const [candidateIndex, setCandidateIndex] = useState(0)
  const activeSrc = candidates[candidateIndex]

  if (!activeSrc) {
    return (
      <span
        className={`${className} neutral-asset-fallback`}
        role="img"
        aria-label={alt}
        data-asset-path="neutral-css-fallback"
      />
    )
  }

  return (
    <img
      className={className}
      src={activeSrc}
      alt={alt}
      data-asset-path={activeSrc}
      onError={() => setCandidateIndex((index) => index + 1)}
    />
  )
}
