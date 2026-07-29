param(
  [int]$IntervalMinutes = 10,
  [switch]$Once
)

$ErrorActionPreference = "Stop"

if (-not (Test-Path ".git")) {
  throw "Run this script from the repository root after git init."
}

function Save-Checkpoint {
  $status = git status --porcelain
  if ([string]::IsNullOrWhiteSpace($status)) {
    Write-Host "[$(Get-Date -Format T)] No changes."
    return
  }

  # Never push automatically. .gitignore must exclude secrets/build output.
  git add -A
  git diff --cached --quiet
  if ($LASTEXITCODE -eq 0) { return }

  $stamp = Get-Date -Format "yyyy-MM-dd HH:mm"
  git commit -m "chore(checkpoint): autosave $stamp"
  Write-Host "[$(Get-Date -Format T)] Local checkpoint committed."
}

do {
  Save-Checkpoint
  if ($Once) { break }
  Start-Sleep -Seconds ($IntervalMinutes * 60)
} while ($true)
