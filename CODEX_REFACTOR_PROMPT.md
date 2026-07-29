Read `AGENTS.md` and all documents in `docs/`, `design/`, and `tasks/` before editing code.

The product direction has been updated. Treat the following as the new source of truth:

- `docs/PROJECT_BRIEF.md`
- `docs/MVP_SPEC.md`
- `design/DESIGN_SYSTEM.md`
- `design/tokens.json`
- `design/SCREEN_BLUEPRINT.md`
- `design/VISUAL_REFERENCE.md`
- `design/references/meme-physics-archipelago.png`
- `tasks/01_UI_REFACTOR_PLAN.md`

Goal: refactor the current UI into the approved **Bright Meme Physics Archipelago** direction while preserving reusable Camera, Gesture, Physics, and learning-state logic.

Do not create a new project and do not delete working core systems.

Before editing:
1. Show `git status`.
2. Summarize the current architecture and routes.
3. Identify reusable files, files that need refactoring, and obsolete UI files.
4. Create a checkpoint commit if there are uncommitted changes that belong to the project. Never overwrite another contributor's uncommitted work.
5. Give a concise milestone plan, then begin.

Approved flow:
Landing → World Map → Projectile Island Hub → Mission Brief → Prediction → Camera Gameplay → Compare Attempts → Concept Check → Learning Summary → World Map

Scope rules:
- Only Projectile Island is playable.
- Only one projectile mission is fully functional.
- Momentum, Balance 67, Friction, and Energy islands are preview/locked.
- No real login or production database.
- No shop, economy, ranking, or multiplayer.
- Camera is primary; mouse/touch fallback is mandatory.
- Use original or neutral placeholder assets only. Do not use Angry Birds assets.
- Do not return to a full dark sci-fi dashboard.

Work in milestones and stop for review after each milestone:

Milestone 1:
- Design tokens
- Shared layout and components
- Landing
- World Map
- Projectile Island Hub

Milestone 2:
- Mission Brief
- Prediction
- Learning-session state

Milestone 3:
- Gameplay shell
- Camera and gesture status UI
- Physics integration
- Mouse/touch fallback

Milestone 4:
- Compare Attempts
- Concept Check
- Learning Summary
- Responsive and accessibility polish

At the end of every milestone:
- Run lint
- Run tests
- Run the production build
- Summarize changed files and known risks
- Commit with a clear message
- Never push automatically

Begin with Milestone 1 only. Do not continue to Milestone 2 until the first milestone has passed checks and been visually reviewed.
