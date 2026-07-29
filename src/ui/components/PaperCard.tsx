import type { PropsWithChildren } from 'react'

export function PaperCard({ children }: PropsWithChildren) {
  return <article className="paper-card">{children}</article>
}
