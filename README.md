# Physics Meme Lab

**Physics Meme Lab** is an interactive, meme-inspired physics learning experience designed to make abstract science concepts easier to understand through play.

Instead of only memorizing formulas, students can experiment with physics concepts through interactive missions, visual feedback, hand gestures, and playful meme-inspired characters.

> **Aligned with UN Sustainable Development Goal 4: Quality Education**

---

## Live Demo

**Play Physics Meme Lab:**  
https://physicsmemelab-global.vercel.app/

**Source Code:**  
https://github.com/CPO49/PhysicsMemeLab-Global

The project runs directly in a modern web browser.

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

Physics itself becomes part of the interaction.

In the projectile mission, students first predict a launch angle, then experiment, observe the trajectory, compare attempts, and answer a concept question.

The learning loop is:

**Predict → Experiment → Observe → Compare → Understand**

Meme-inspired characters and playful scenarios are used as memorable learning cues rather than simple decoration.

Selected activities also use browser-based hand tracking, allowing physical gestures to become part of the experiment — from aiming a projectile to grabbing and throwing objects in the gravity sandbox.

Each mission uses a different interaction model:

- **Projectile Motion:** prediction, aiming, launching, trajectory observation, and reflection
- **Electricity:** short Ohm's Law challenges with immediate feedback
- **Gravity Sandbox:** open-ended experimentation with motion, force, mass, and gravity

---

## How to Play

### 1. Choose a Mission

Start from the world map and select a physics activity.

### 2. Interact and Experiment

Each mission has its own controls and learning style.

- **Projectile Motion:** predict an angle, aim, launch, observe the trajectory, and compare attempts
- **Electricity:** solve short Ohm's Law challenges and receive immediate feedback
- **Gravity Sandbox:** spawn objects, change gravity, inspect physical values, and experiment with motion

### 3. Use Hand Tracking Where Available

Selected activities support camera-based hand gestures.

Alternative controls are available in supported parts of the experience, so the core project does not rely entirely on camera input.

### 4. Observe and Reflect

The experience encourages students to compare what they expected with what actually happened.

The goal is to build understanding through experimentation rather than memorization alone.

---

## UN SDG 4 — Quality Education

Physics Meme Lab supports **UN Sustainable Development Goal 4: Quality Education** by exploring a more engaging and accessible way to learn science.

The project focuses on:

- making abstract physics concepts easier to visualize,
- increasing student engagement through interactive learning,
- encouraging experimentation instead of memorization alone,
- and providing browser-based learning experiences that can be accessed without specialized equipment.

As an educational prototype, Physics Meme Lab explores how interactive, game-like learning can contribute to more engaging and approachable STEM education.

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

The sandbox encourages experimentation and observation instead of requiring a single correct solution.

Sidebar controls can be used to add objects and adjust gravity. Grabbing and throwing objects use camera-based hand tracking.

---

## Interaction

Physics Meme Lab supports multiple interaction methods depending on the activity.

### Hand Tracking

Selected activities use real-time hand tracking through the device camera.

Students can use hand movements to interact with parts of the simulation, including aiming and object manipulation.

### Alternative Controls

Where supported, mouse, keyboard, or on-screen controls are available so the experience does not depend entirely on camera input.

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

Camera frames are processed locally in the browser for interaction purposes. The application does not intentionally record, save, or upload camera footage.

Hand tracking downloads required runtime/model files from external MediaPipe hosting resources, so initial setup requires an internet connection.

Progress and supported preferences are stored locally in the browser.

Users can also use available alternative controls when they do not want to use camera-based interaction.

---

## Run Locally

### Requirements

- Node.js 22.12+ or a newer supported version
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

The project can be checked with:

```bash
npm run lint
npm test -- --run
npm run build
```

For this submission build:

- lint passed,
- **29 automated tests passed**,
- production build passed,
- and manual gameplay smoke testing was completed.

Automated tests cover physics logic, mission and application state, input capability, gravity gestures, electricity answers, and landing layout.

---

## Project History and Submission Note

Physics Meme Lab was originally developed before this event as a student physics-learning hackathon prototype.

This submission adapts that existing project and does not claim that the entire application was created during the current event.

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

The student team's work represented in this repository includes:

- **Project concept & learning experience:** prediction, experimentation, comparison, and concept reflection
- **Frontend & interactions:** React/TypeScript screens, navigation, and supported mouse, keyboard, and on-screen controls
- **Physics gameplay & simulation:** projectile motion, gravity simulation, and the Ohm's Law activity
- **Hand tracking integration:** browser-based MediaPipe detection and gesture controls
- **UI/UX & visual design:** mission interfaces, world map, visual feedback, and character presentation
- **Testing & iteration:** automated checks for physics, state, controls, and layout
- **International adaptation & SDG 4 positioning:** English interface copy and educational submission documentation

---

## Goal

Physics does not have to begin with a formula.

Sometimes it can begin with:

**"What happens if I try this?"**

Physics Meme Lab is built around that question.
