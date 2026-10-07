# Teach Me

Teach Me is a Phase 1 prototype for an AI-supported learning supervision experience. It helps learners choose a topic, prepare a focused session, ask lesson-related questions, and reflect on their progress.

## Phase 1 experience

- Email-based demo profile and interest selection
- Personalized learning dashboard and lesson discovery
- Lesson details and focus-session preparation
- Focus timer, gentle distraction reminders, and a contextual Q&A demo
- Session completion report and session history

## Prototype limitations

This repository does not include an authentication provider, lesson video hosting, camera-based monitoring, or an AI service. Sign-in and learning data are simulated and stored in the browser's `localStorage`; the Q&A panel uses sample responses and does not send messages to an AI. Focus reminders are manually triggered and do not access the camera.

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000. Run `npm run type-check` and `npm run build` to validate the app.
