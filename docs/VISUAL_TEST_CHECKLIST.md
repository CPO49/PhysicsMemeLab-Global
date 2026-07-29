# Visual Test Checklist — Milestone F.1

Use the local development server at:

- Normal mode: `http://127.0.0.1:5173/`
- Visual debug mode: `http://127.0.0.1:5173/?visualDebug=1`

Review both viewports at browser zoom 100%:

- 1366 × 768
- 1920 × 1080

## Global checks

- [ ] Normal mode does not show the Visual Debug panel or its controls.
- [ ] Visual debug mode shows the current step, aim, energy, skill, attempts, result, and asset paths.
- [ ] Thai copy is readable and contains no mojibake.
- [ ] No content overlaps or leaves the viewport.
- [ ] Keyboard focus is visible.
- [ ] Final asset paths fall back to debug assets without showing an “asset required” card.

## Landing

- [ ] The mascot uses the original debug mascot when the final mascot is unavailable.
- [ ] The hero composition remains readable at both viewports.
- [ ] The primary call to action opens World Map.

## World Map

- [ ] Projectile Island uses `island-projectile-debug.svg` when its final asset is unavailable.
- [ ] Locked islands use `island-locked-debug.svg` when final assets are unavailable.
- [ ] All five islands are separated and their labels do not overlap the art.
- [ ] Projectile Island opens the hub.
- [ ] Locked island modal still works.

## Projectile Hub

- [ ] Mission information, energy bar, skill slot, mascot, and primary action are visible.
- [ ] The primary action opens Mission Brief.

## Mission Brief

- [ ] Goal, three gesture steps, learning goal, and one primary action are visible.
- [ ] Visual Debug shows `brief`.

## Prediction

- [ ] Three visual answer choices are available.
- [ ] Next Step is disabled until a prediction is selected.

## Basic Shot

- [ ] Launcher, projectile, wall, and target are immediately recognizable.
- [ ] Angle, speed, energy, and skill state remain readable.
- [ ] Dragging inside the field updates angle and speed.
- [ ] Firing records Attempt 1 without changing physics behavior.
- [ ] Trajectory and hit/miss feedback are visible after a shot.

## 67 Power Charge

- [ ] The energy bar fills with the Pump button and Space key.
- [ ] Holding Space does not generate uncontrolled repeat pumps.
- [ ] Space does not scroll the page.
- [ ] Energy debug effect is visible.
- [ ] Fill Energy works only as a visual debug control.

## Skill Sign

- [ ] Enter advances one sign step per key press.
- [ ] Skill Sign progress moves from 0/2 to 1/2 to 2/2.
- [ ] Activate Skill is disabled unless the step and energy state are safe.

## Trajectory Vision

- [ ] The vision effect and trajectory asset are visible.
- [ ] The player still fires Attempt 2 manually.
- [ ] Attempt 1 and Attempt 2 remain separate.

## Compare

- [ ] Both attempts show angle, speed, range, and hit/miss.
- [ ] The human-readable learning prompt is visible.

## Summary

- [ ] Prediction, Attempt 1, Attempt 2, and learning result are visible.
- [ ] Reset Mission returns to Mission Brief with cleared attempts and energy.
- [ ] Back to World Map returns to the map.

## Asset fallback paths

- `/assets/debug/launcher-debug.svg`
- `/assets/debug/projectile-debug.svg`
- `/assets/debug/wall-debug.svg`
- `/assets/debug/target-debug.svg`
- `/assets/debug/trajectory-debug.svg`
- `/assets/debug/energy-effect-debug.svg`
- `/assets/debug/skill-vision-debug.svg`
- `/assets/debug/island-projectile-debug.svg`
- `/assets/debug/island-locked-debug.svg`
- `/assets/debug/mascot-debug.svg`
