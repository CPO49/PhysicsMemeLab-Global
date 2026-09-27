# Physics Meme Lab

**Physics Meme Lab** is an interactive, meme-inspired physics learning experience designed to make abstract science concepts easier to understand through play.

Instead of only memorizing formulas, students can experiment with physics concepts through interactive missions, visual feedback, hand gestures, and playful meme-inspired characters.

> **Aligned with UN Sustainable Development Goal 4: Quality Education**

---

## Live Demo

🎮 **Play Physics Meme Lab:**  
https://physicsmemelab-global.vercel.app/

The project runs directly in a modern web browser.

**Source:** [PhysicsMemeLab-Global](https://github.com/CPO49/PhysicsMemeLab-Global)

Prepared for the **Acodemic × G.I.R.L.S. Global SDG Hackathon**.

Camera access is used only for optional hand-tracking interactions. Alternative controls are available in supported parts of the experience.

---

## The Problem

Physics can feel difficult when students encounter concepts mainly through formulas, diagrams, and written explanations.

Topics such as projectile motion, electricity, and gravity are easier to understand when students can actively experiment with them and immediately see the results of their decisions.

Physics Meme Lab explores a different approach:

**turn physics concepts into interactive, memorable experiences.**

---

## Our Solution

Physics Meme Lab combines physics learning with playful, meme-inspired interactions.

Students move through different physics missions where they can:

- experiment with variables,
- make predictions,
- interact with simulations,
- receive immediate visual feedback,
- answer concept questions,
- and review what they learned.

The goal is not to replace traditional lessons, but to give students another way to explore difficult concepts through interaction.

---

## What Makes It Different

Physics itself is part of the interaction. In the projectile mission, students predict a launch angle, experiment, observe the trajectory, compare attempts, and answer a concept question.

The learning loop is:

**Predict → Experiment → Observe → Compare → Understand**

Meme-inspired characters and playful scenarios serve as memorable learning cues. Selected activities use browser-based hand tracking to make physical gestures part of the experiment, from aiming a projectile to grabbing and throwing objects in the gravity sandbox.

Electricity offers a short Ohm’s law challenge, while gravity supports open-ended exploration; each activity uses its own interaction model.

---

## UN SDG 4 — Quality Education

Physics Meme Lab supports **UN Sustainable Development Goal 4: Quality Education** by exploring a more engaging and accessible way to learn science.

The project focuses on:

- making abstract physics concepts easier to visualize,
- increasing student engagement through interactive learning,
- encouraging experimentation instead of memorization alone,
- and providing browser-based learning experiences that can be accessed without specialized equipment.

The project is designed as an educational prototype showing how familiar internet-style humor and game-like interactions can be used to make STEM learning more approachable. Learning gains and classroom impact have not yet been measured; this is an intended contribution to SDG 4, not a claim of proven outcomes or UN endorsement.

---

## Physics Missions

### Projectile Motion

Students explore projectile motion by predicting a launch angle and controlling a launch through either hand gestures or alternative controls.

The mission includes:

- launch-angle prediction,
- interactive aiming,
- multiple launch attempts,
- trajectory visualization,
- concept questions,
- and a learning summary.

Students can compare their prediction with the actual motion and observe how changing the launch affects the trajectory.

---

### Electricity

The electricity mission introduces basic electrical concepts and **Ohm's Law**.

Students work through short interactive questions involving:

**V = I × R**

The mission provides timed challenges, retry feedback, and completion feedback to reinforce the relationship between voltage, current, and resistance.

---

### Gravity Sandbox

The gravity sandbox allows students to experiment more freely with physical objects.

Students can:

- spawn objects and obstacles,
- change gravity,
- observe movement,
- inspect physical values such as mass, force, and speed,
- and interact with objects using camera-based hand gestures.

The sandbox encourages experimentation and observation instead of requiring a single correct solution. Sidebar controls add objects and adjust gravity; grabbing and throwing require camera hand tracking. Direct mouse/touch dragging is not available in this sandbox.

---

## Interaction

Physics Meme Lab supports multiple interaction methods depending on the activity.

### Hand Tracking

Selected activities use real-time hand tracking through the device camera.

For example, students can use hand movements to interact with objects and control parts of the simulation.

### Alternative Controls

Where supported, alternative mouse, keyboard, or on-screen controls are provided so the core experience does not depend entirely on camera input.

---

## Features

- Interactive physics missions
- Projectile motion simulation
- Electricity and Ohm's Law learning activity
- Gravity experimentation sandbox
- Camera-based hand tracking
- Alternative controls for supported interactions
- World-map style mission progression
- Learning questions and feedback
- Local progress storage
- Meme-inspired characters and visual learning cues
- Browser-based experience
- No account required

---

## Technology

Physics Meme Lab is built with:

- **React**
- **TypeScript**
- **Vite**
- **MediaPipe**
- HTML5 / CSS
- Browser-based physics and interaction logic
- Local browser storage for progress

The project runs primarily on the client side.

---

## Privacy

Physics Meme Lab does not require users to create an account.

Camera access is requested only when a hand-tracking feature requires it.

Camera frames are processed locally in the browser for interaction purposes. The application does not record, save, or upload camera footage.

Hand tracking downloads runtime/model files from jsDelivr and Google-hosted MediaPipe resources, so initial setup needs internet access. These providers receive ordinary connection metadata. Camera access requires HTTPS or localhost and depends on browser/device support.

Progress, audio settings, and optional layout preferences are stored in localStorage. Clear this site’s browser data to remove them. Session reflections remain in application memory.

Users can also use available alternative controls when they do not want to use camera-based interaction.

---

## Run Locally

### Requirements

- Node.js 22.12+ (or a newer supported version)
- npm
- A modern web browser

### Installation

```bash
git clone https://github.com/CPO49/PhysicsMemeLab-Global.git
cd PhysicsMemeLab-Global
npm ci
npm run dev
```

Then open the local development URL shown by Vite in your browser.

---

## Project Structure

The project separates major parts of the experience into dedicated modules for:

- landing and navigation,
- projectile motion,
- electricity,
- gravity simulation,
- hand tracking,
- game state,
- UI,
- and learning content.

This structure allows each physics activity to have its own interaction model while remaining part of the same learning experience.

---

## Development and Testing

Run the repository checks with:

```bash
npm run lint
npm test -- --run
npm run build
```

The submission checks pass lint, **29 automated tests**, and the production build. Tests cover physics, mission and application state, input capability, gravity gestures, electricity answers, and landing layout. The production output is written to `dist/`.

Automated checks do not establish camera reliability or compatibility on every device.

---

## Project History and Submission Note

Physics Meme Lab was developed before this event as a student physics-learning hackathon prototype. This submission adapts that existing project; it does not claim that the entire application was created during the current event. The existing physics and gameplay are retained.

For this international SDG-focused submission, the project was further adapted with:

- an English-language interface,
- refreshed character presentation,
- improved international presentation,
- clearer educational positioning,
- and explicit alignment with **UN SDG 4: Quality Education**.

The core purpose remains the same:

**help students experience physics through interaction instead of memorization alone.**

---

## Team & Contributions

The student team’s work represented in this repository includes:

- **Project concept & learning experience:** prediction, experimentation, comparison, and concept reflection.
- **Frontend & interactions:** React/TypeScript screens, navigation, and supported mouse, keyboard, and on-screen controls.
- **Physics gameplay & simulation:** projectile motion, gravity simulation, and the Ohm’s law activity.
- **Hand tracking integration:** browser-based MediaPipe detection and gesture controls.
- **UI/UX & visual design:** mission interfaces, world map, visual feedback, and character presentation.
- **Testing & iteration:** automated checks for physics, state, controls, and layout.
- **International English adaptation & SDG 4 positioning:** English interface copy and educational submission documentation.

These are project-level contributions; individual member assignments are not specified.

---

## Goal

Physics does not have to begin with a formula.

Sometimes it can begin with:

**"What happens if I try this?"**

Physics Meme Lab is built around that question.
