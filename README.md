# Physics Meme Lab

**Physics Meme Lab** is an interactive, meme-inspired physics learning experience designed to make abstract science concepts easier to understand through play.

Instead of only memorizing formulas, students can experiment with physics concepts through interactive missions, visual feedback, hand gestures, and playful original characters.

> **Aligned with UN Sustainable Development Goal 4: Quality Education**

---

## Live Demo

🎮 **Play Physics Meme Lab:**  
https://physicsmemelab-global.vercel.app/

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

## UN SDG 4 — Quality Education

Physics Meme Lab supports **UN Sustainable Development Goal 4: Quality Education** by exploring a more engaging and accessible way to learn science.

The project focuses on:

- making abstract physics concepts easier to visualize,
- increasing student engagement through interactive learning,
- encouraging experimentation instead of memorization alone,
- and providing browser-based learning experiences that can be accessed without specialized equipment.

The project is designed as an educational prototype showing how familiar internet-style humor and game-like interactions can be used to make STEM learning more approachable.

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
- Original meme-inspired visual assets
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

Camera frames are processed locally in the browser for interaction purposes and are not intentionally uploaded or stored by the application.

Users can also use available alternative controls when they do not want to use camera-based interaction.

---

## Run Locally

### Requirements

- Node.js
- npm
- A modern web browser

### Installation

```bash
git clone https://github.com/CPO49/PhysicsMemeLab-Global.git
cd PhysicsMemeLab-Global
npm install
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

Before this submission build was prepared, the project was checked through:

- linting,
- automated tests,
- production build verification,
- and manual gameplay smoke testing.

The current submission build successfully completed **29 automated tests** and a production build.

---

## Project History and Submission Note

Physics Meme Lab was originally developed as a student physics-learning project.

For this international SDG-focused submission, the project was further adapted with:

- an English-language interface,
- original visual assets,
- improved international presentation,
- clearer educational positioning,
- and explicit alignment with **UN SDG 4: Quality Education**.

The core purpose remains the same:

**help students experience physics through interaction instead of memorization alone.**

---

## Team

Developed by a student team interested in combining:

- software development,
- interactive learning,
- physics,
- game design,
- and creative technology.

---

## Goal

Physics does not have to begin with a formula.

Sometimes it can begin with:

**"What happens if I try this?"**

Physics Meme Lab is built around that question.
