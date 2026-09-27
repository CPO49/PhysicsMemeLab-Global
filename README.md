# Physics Meme Lab

A student physics-learning project that uses meme-inspired play and hands-on experiments to make abstract ideas easier to explore.

Originally developed as a student hackathon prototype for 67HACK, this project has been adapted for the **Acodemic × G.I.R.L.S. Global SDG Hackathon** international/SDG submission. The adaptation includes English interface copy, refreshed character presentation, and documentation; it retains the existing physics and gameplay.

## UN SDG 4: Quality Education

The project aims to support engaging physics practice through prediction, experimentation, comparison, and explanation. Browser-based activities and alternative controls in the projectile mission can lower some participation barriers. This is an educational prototype: improved learning outcomes, accessibility across all devices, and classroom impact have not been validated. No UN affiliation or endorsement is claimed.

## Live demo

The updated submission build has **passed local lint, 29 unit tests, production build, and a brief landing → world map → projectile mission smoke check**. Deployment is pending. A verified public demo URL has not yet been supplied. Add the approved public URL here before submitting; localhost is only for local testing.

Local preview: [http://localhost:5173](http://localhost:5173) after starting the development server below.

## Features

- **Projectile mission:** predict a launch angle, practice controls, launch twice, activate a trajectory preview, compare attempts, answer a concept question, and view a learning summary.
- **Electric mission:** read an Ohm’s law lesson and calculate voltage using V = I × R in three timed questions, with retry and completion feedback.
- **Gravity sandbox:** spawn objects and obstacles, change gravity, inspect mass/force/speed, and use camera hand gestures to grab and throw objects. This is the gravity screen currently connected to the world map; the separate guided gravity lesson component is not connected to the main navigation.
- **World map:** mission progression and unlocks, with local progress storage. Some islands and statistics/collection panels are placeholders.
- **Settings:** sound, volume, and animation controls.

## Controls

**Projectile:** make a fist to grab, move to aim, and open your hand to launch. Mouse dragging and an on-screen launch button are available. Use the displayed Space/Pump 67 and Enter/Skill Sign controls for the energy and trajectory stages.

**Gravity sandbox:** enable the camera, pinch thumb and index finger to grab, move your hand, then release the pinch to drop or throw. Extend/curl your other fingers while holding to change mass. Sidebar controls add objects and adjust gravity. Direct mouse/touch dragging is not implemented in this connected sandbox.

**Electric:** type the voltage answer and submit it. Each question has a 20-second timer.

## Tech stack

React, TypeScript, Vite, browser-rendered SVG/DOM simulation, MediaPipe Tasks Vision for hand tracking, localStorage for local preferences/progress, and Vitest for unit tests. No application backend or account system is included.

## Privacy

Camera access requires browser permission. The application processes camera frames locally for hand tracking; it does not record, save, or upload camera footage, faces, or biometric templates. Progress, audio settings, and optional landing-layout preferences are stored in this browser’s localStorage. Session reflections are held in application memory.

Hand tracking downloads runtime/model files from jsDelivr and Google-hosted MediaPipe resources, so initial camera setup needs internet access. Those requests expose ordinary connection metadata to the hosting providers; local camera processing does not mean the application makes no network requests. Clear this site’s browser data to remove stored preferences and progress.

## How to run

Use Node.js 22.12+ (or a newer supported version) and npm.

```bash
npm ci
npm run dev -- --host 127.0.0.1 --port 5173
```

Open the URL printed by Vite. If port 5173 is occupied, Vite may choose another port. Camera access works on localhost or HTTPS and depends on browser/device support.

```bash
npm run lint
npm test -- --run
npm run build
```

The production build is written to `dist/`. Deployment is a separate, approval-dependent step.

## Assets and submission disclosure

The three replacement images supplied by the student are used under neutral filenames in `public/assets/submission/`. Unused superseded images, the import archive, and an obsolete source backup have been removed after checking runtime references. This presentation update is not an independent verification of ownership or licensing of every image or sound. Review asset provenance before the final submission.

Keep the project name **Physics Meme Lab** and its core concept: playful, meme-inspired physics learning. This prototype is not a validated curriculum or a finished platform. Camera gesture reliability, smaller screens, and the complete judging flow still require device testing.
