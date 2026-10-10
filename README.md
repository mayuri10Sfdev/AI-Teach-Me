# Teach Me

Teach Me is a Phase 1 prototype for an AI-supported learning supervision experience. It helps learners choose a topic, prepare a focused session, ask lesson-related questions, and reflect on their progress.

## Phase 1 experience

- Supabase email authentication, learner profiles, and interest selection
- Personalized learning dashboard and lesson discovery
- Lesson details and focus-session preparation
- Focus timer, gentle distraction reminders, and a contextual Q&A demo
- Session completion report and session history

## Prototype limitations

Authentication, learner interests, learning sessions, and session Q&A messages use Supabase. The AI Tutor uses a server-side OpenAI request and lesson metadata; transcripts, video playback, and camera supervision are not connected. Lessons are seeded in Supabase but the lesson catalog shown in the prototype is currently defined in the app. Focus reminders are manually triggered and do not access the camera.

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
OPENAI_API_KEY=your-server-side-openai-key
```

Never put `OPENAI_API_KEY` or a Supabase `service_role` key in a `NEXT_PUBLIC_` variable or browser code. The `/api/ai-tutor` route requires a valid Supabase access token and uses `OPENAI_MODEL` if set, defaulting to `gpt-4o-mini`. Tutor replies use the in-app lesson metadata only; do not present them as transcript-grounded. In the Supabase SQL Editor, run `supabase/migrations/20261010_phase1_app_fields.sql` after creating the Phase 1 tables. Enable Email under **Authentication → Providers**, then set the deployed Vercel domain in **Authentication → URL Configuration**. Add the Supabase variables and `OPENAI_API_KEY` to Vercel project settings for each required environment and redeploy.
