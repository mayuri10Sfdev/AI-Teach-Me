# Teach Me

Teach Me is a Phase 1 prototype for an AI-supported learning supervision experience. It helps learners choose a topic, prepare a focused session, ask lesson-related questions, and reflect on their progress.

## Phase 1 experience

- Supabase email authentication, learner profiles, and interest selection
- Personalized learning dashboard and lesson discovery
- Lesson details and focus-session preparation
- Focus timer, gentle distraction reminders, and a contextual Q&A demo
- Session completion report and session history

## Prototype limitations

Authentication, learner interests, learning sessions, and session Q&A messages use Supabase. The Q&A panel still uses sample responses and does not send messages to an AI. Lessons are seeded in Supabase but the lesson catalog shown in the prototype is currently defined in the app. Focus reminders are manually triggered and do not access the camera.

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000. Run `npm run type-check` and `npm run build` to validate the app.

## Supabase setup

The local `.env.local` file needs these browser-safe values:

```text
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
```

Never put a Supabase `service_role` key in a `NEXT_PUBLIC_` variable or in browser code. In the Supabase SQL Editor, run `supabase/migrations/20261010_phase1_app_fields.sql` after creating the Phase 1 tables. Enable Email under **Authentication → Providers**, then set the deployed Vercel domain in **Authentication → URL Configuration**. Add both environment variables to the Vercel project settings for each required environment and redeploy.
