import { th } from '../../content/th'

type TopBarProps = {
  onMap: () => void
  title?: string
}

export function TopBar({
  onMap,
  title = 'Meme Physics Archipelago',
}: TopBarProps) {
  return (
    <header className="app-topbar">
      <button
        className="app-brand"
        type="button"
        onClick={onMap}
        aria-label={th.mapBack}
      >
        <span className="app-brand__mark" aria-hidden="true">
          67
        </span>
        <span>{title}</span>
      </button>
      <div className="app-topbar__tools" aria-label="Mission status">
        <span className="progress-badge">Mission 0/1</span>
        <button className="icon-button" type="button" aria-label="Help">
          ?
        </button>
      </div>
    </header>
  )
}
