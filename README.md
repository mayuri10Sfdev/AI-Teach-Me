# Teach Me

Teach Me is a Phase 1 prototype for an AI-supported learning supervision experience. It helps learners choose a topic, prepare a focused session, ask lesson-related questions, and reflect on their progress.

## Phase 1 experience

- Supabase email/phone OTP authentication, learner profiles, and interest selection
- Personalized learning dashboard and lesson discovery
- Lesson details and focus-session preparation
- Focus timer, optional local camera-based face-direction check-ins, and a contextual AI Tutor
- Session completion report and session history

## Prototype limitations

Authentication, learner interests, learning sessions, and session Q&A messages use Supabase. Lesson videos are public YouTube embeds and require internet access; availability and playback controls are provided by YouTube. The optional camera check uses MediaPipe Face Landmarker in the browser to estimate face visibility and significant side-to-side head turns. Camera frames are processed locally and are not recorded or uploaded. This is a rough signal, not a reliable measure of attention, comprehension, or identity. The AI Tutor uses a server-side OpenAI request and lesson metadata; it does not receive video frames, playback timestamps, or a transcript. The lesson catalog shown in the prototype is defined in the app.

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

Never put `OPENAI_API_KEY` or a Supabase `service_role` key in a `NEXT_PUBLIC_` variable or browser code. The `/api/ai-tutor` route requires a valid Supabase access token and uses `OPENAI_MODEL` if set, defaulting to `gpt-4o-mini`. Tutor replies use the in-app lesson metadata only; do not present them as transcript-grounded. In the Supabase SQL Editor, run `supabase/migrations/20261010_phase1_app_fields.sql` and `supabase/migrations/20261010_profile_names.sql` after creating the Phase 1 tables. Enable Email and Phone under **Authentication → Providers**, configure an SMS provider for phone OTP, and use an email OTP template that displays `{{ .Token }}`. Set the deployed Vercel domain in **Authentication → URL Configuration**. Add the Supabase variables and `OPENAI_API_KEY` to Vercel project settings for each required environment and redeploy.

To try the camera check, sign in with OTP, open a lesson, and enable **Camera-based focus check-ins (optional)** on the preparation screen. The browser asks for camera permission when the session starts. The face-landmark model and WebAssembly runtime are loaded from public CDNs; camera frames are analyzed in the browser only. Use HTTPS (including localhost) and a camera-capable browser. You can stop the camera check at any time during the session.
