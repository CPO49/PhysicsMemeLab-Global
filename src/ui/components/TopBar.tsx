type TopBarProps = {
  onMap: () => void
  title?: string
}

export function TopBar({ onMap, title = 'Meme Physics Archipelago' }: TopBarProps) {
  return (
    <header className="app-topbar">
      <button className="app-brand" type="button" onClick={onMap} aria-label="กลับไปยังแผนที่โลก">
        <span className="app-brand__mark" aria-hidden="true">67</span>
        <span>{title}</span>
      </button>
      <div className="app-topbar__tools" aria-label="สถานะภารกิจ">
        <span className="progress-badge">ภารกิจ 0/1</span>
        <button className="icon-button" type="button" aria-label="ช่วยเหลือ">?</button>
      </div>
    </header>
  )
}
