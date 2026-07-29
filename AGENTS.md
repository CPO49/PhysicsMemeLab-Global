# AGENTS.md — 67HACK Physics Meme Lab

## Mission
Build a polished web prototype for Track 3 (Applied Meme Engineering): a camera-controlled physics learning experience where learners use hand gestures to run a projectile-motion experiment, then predict, compare, and explain the result.

## Product rule
This is not “a meme skin on a physics game.” The product loop is:
1. Predict
2. Gesture experiment
3. Observe simulation
4. Compare attempts
5. Explain
6. Summarize learning data

## MVP scope — locked
Implement only one fully working mission:
- Topic: projectile motion
- Camera hand tracking
- Closed fist = grab
- Hand movement = aim/pull
- Open hand = release
- Obstacle wall + target
- Show launch angle, relative launch power, trajectory, max height, range
- Keep at least the latest 2 trajectories for comparison
- One prediction question before the lab
- One concept-check/reflection after the lab
- Local-only session summary

Do not add unless all MVP acceptance tests pass:
- Login/database
- Multiplayer
- Mission creator
- Rankings/shop/currency
- More physics chapters
- Generative AI tutor
- Full teacher dashboard

## Tech direction
Default stack unless repository already specifies otherwise:
- Vite + React + TypeScript
- Canvas or lightweight 2D renderer for simulation
- MediaPipe Tasks Vision or an equivalent browser-side hand-landmark library
- Vitest for unit tests
- Playwright for one smoke test
- LocalStorage only; no backend for MVP

## Privacy and safety
- Process camera frames locally in the browser.
- Never upload, record, or save camera images/video.
- Show camera permission rationale before requesting access.
- Provide mouse/touch fallback.
- Do not store names, faces, or biometric templates.

## Design lock
Follow `design/DESIGN_SYSTEM.md` and `design/tokens.json`.
- Do not redesign navigation, colors, typography, spacing, or mascot placement without updating the design docs first.
- Use the original team mascot/IP, not Angry Birds assets, names, sounds, or logos.
- Thai text must be reviewed for spelling before merge.
- Avoid AI-looking over-decoration, excessive glow, and crowded dashboards.

## Engineering rules
- TypeScript strict mode.
- Keep physics calculations pure and tested.
- Separate camera input, gesture state, physics engine, UI, and learning-data modules.
- Never hardcode secrets.
- Never silently delete working features.
- Prefer small reversible changes.
- After every task: run lint, unit tests, and build.

## Git workflow
- Work on feature branches: `feat/...`, `fix/...`, `design/...`, `docs/...`.
- Commit after each stable milestone, not after every line.
- Commit format: `type(scope): concise summary`.
- Never auto-push. Human reviews before push/merge.
- Before editing, check `git status` and do not overwrite uncommitted human work.

## Required task report
At the end of each Codex task, report:
- What changed
- Files changed
- Tests/build run and result
- Known risks or incomplete items
- Suggested next task (one only)

## Definition of done
A task is done only when:
- Acceptance criteria are met
- Relevant tests pass
- App builds
- No console errors in the tested flow
- Thai copy is readable
- Documentation is updated when behavior/design changes
