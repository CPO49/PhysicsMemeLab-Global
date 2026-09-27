# UI Refactor Plan

## Phase 0 — Safety and audit
- Read all project docs
- Check git status
- Create checkpoint commit if needed
- Audit reusable camera, gesture, physics, and learning logic
- Do not rewrite working core logic

## Phase 1 — Foundation
- Replace old theme tokens
- Add paper, sticker, map, and game panel primitives
- Build shared responsive layout
- Add route skeleton for approved screen flow
- Verify lint/test/build
- Commit: `chore(ui): establish archipelago design foundation`

## Phase 2 — Entry and world
- Landing
- World Map
- Projectile Island Hub
- Locked island preview behavior
- Visual QA against reference
- Commit: `feat(ui): add archipelago landing and world navigation`

## Phase 3 — Mission setup
- Mission Brief
- Prediction
- Local learning-session state
- Commit: `feat(learning): add mission briefing and prediction flow`

## Phase 4 — Gameplay integration
- Preserve existing physics and camera modules
- Apply new gameplay shell and HUD
- Add gesture-state feedback
- Verify mouse/touch fallback
- Commit: `feat(gameplay): integrate gesture lab with new mission ui`

## Phase 5 — Learning evidence
- Compare Attempts
- Concept Check
- Learning Summary
- Return-to-map state
- Commit: `feat(assessment): add comparison and learning report`

## Phase 6 — Polish
- Responsive QA
- Accessibility
- Reduced motion
- Camera privacy text
- Empty/error/loading states
- Final tests and build
- Commit: `fix(ui): polish responsive and accessible demo flow`

## Out of scope
- Real login
- Production database
- Shop or economy
- Ranking
- Multiplayer
- Multiple playable islands
- AI-generated missions
