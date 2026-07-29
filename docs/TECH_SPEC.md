# Technical Specification

## Recommended architecture
- `camera/`: permission, video stream, hand landmarks
- `gestures/`: fist/open detection, grab state machine, smoothing
- `physics/`: projectile model, collision, trajectory sampling
- `missions/`: mission configuration and win conditions
- `learning/`: prediction, attempts, concept check, summary
- `ui/`: screens and reusable components
- `storage/`: LocalStorage session adapter

## Gesture state machine
`IDLE → HOVER → GRABBED → AIMING → RELEASED → IDLE`

Guardrails:
- Require confidence threshold for several consecutive frames
- Add hysteresis so fist/open states do not flicker
- Freeze the aim briefly if landmarks disappear
- Provide visible hand tracking feedback

## Physics model
For MVP, use ideal projectile motion with configurable gravity and deterministic fixed timestep. The game may use a simplified relative power scale, but the UI must not label an arbitrary value as newtons unless calibrated.

## Collision
Use swept or sufficiently small fixed-step collision checks for wall and target. Do not depend only on visual-frame rate.

## Local data schema
```ts
type Attempt = {
  id: string;
  launchedAt: string;
  angleDeg: number;
  relativePower: number;
  maxHeight: number;
  range: number;
  hitTarget: boolean;
};

type LearningSession = {
  missionId: string;
  predictionAnswer: string;
  attempts: Attempt[];
  conceptCheckAnswer?: string;
};
```

## Failure fallback
- Camera unavailable → mouse/touch control
- Gesture unstable → click/press to grab and release while hand controls aim
- Low performance → reduce camera processing resolution/frequency, not physics accuracy

## Security/privacy
- Camera processing stays client-side
- No analytics that collect images or identity
- `.env*` excluded except `.env.example`
