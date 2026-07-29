# MVP Specification

## Approved screen flow

Landing
→ World Map
→ Projectile Island Hub
→ Mission Brief
→ Prediction
→ Camera Gameplay
→ Compare Attempts
→ Concept Check
→ Learning Summary
→ World Map

## 1. Landing
Purpose: communicate the product in under 10 seconds and start quickly.

Required:
- Large original mascot
- Bright paper/lab visual identity
- One primary CTA: Start Journey
- Quick demo option
- Short explanation that the learner uses gestures to experiment with physics

Do not require login.

## 2. World Map
Purpose: establish the game world and physics categories.

Required:
- Ocean map with distinct islands
- Projectile Island active
- Momentum, Balance 67, Friction, Energy locked/preview
- Visible route or dotted path
- Compact progress indicator

Do not implement shop, currency economy, or ranking logic. Decorative counters may only appear if clearly marked as mock data.

## 3. Projectile Island Hub
Purpose: show progression inside one topic.

Required:
- Island theme and mascot guide
- One playable mission: Basic Shot
- Optional visual cards for future missions such as Angle Master, Wall Challenge, Boss
- Progress tied to learning completion

## 4. Mission Brief
Required:
- Mission goal
- Gesture instructions: fist to grab, move to aim/pull, open hand to release
- Learning objective
- Start button

## 5. Prediction
Required:
- One concept question before the experiment
- Visual answer choices where possible
- Store the answer locally for later comparison
- This is not a high-pressure timed quiz

## 6. Gameplay
Required:
- Large camera/simulation area
- Hand landmark or clear gesture-state feedback
- Projectile launcher, wall, target
- Current angle and pull strength
- Trajectory after release
- Reset and retry
- Mouse/touch fallback
- No video recording or upload

Gesture state machine:
1. Idle
2. Hand detected
3. Grabbed
4. Aiming/pulling
5. Released
6. Simulation running
7. Result

## 7. Compare Attempts
Required:
- Compare at least two attempts
- Show trajectories together or side by side
- Show angle, pull strength/initial-speed proxy, height, and range
- Plain-language observation prompt

Do not label pull strength as newtons unless calibrated.

## 8. Concept Check
Required:
- One short explanation or selected-response concept check
- Connect the learner's attempts to the physics idea
- Store the response locally

## 9. Learning Summary
Required:
- Prediction result
- Experiment count
- Concept-check result
- What the learner understood
- One recommended next step
- Badge or playful reaction
- Return to map and replay buttons

## Acceptance criteria
- Full flow works without login or backend
- User can complete the mission with camera or fallback input
- Same input produces consistent simulation output
- UI follows the new design system
- `lint`, tests, and production build pass
