# Contributing to DLS AI Chatbot

Thanks for your interest in improving the DLS AI Chatbot — the Groq-powered teaching assistant microservice for Digital Logics Studio (Boolforge). This document covers how to get set up and how to submit changes.

## Getting Started

1. **Clone alongside the rest of the monorepo.** This service expects to run next to `DigitalLogicsStudio` (frontend) and `DigitalLogicsStudio-Backend`, sharing only the `JWT_SECRET` value.
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Configure your environment:**
   ```bash
   cp .env.example .env
   ```
   Fill in `GROQ_API_KEY` and make sure `JWT_SECRET` matches the main backend exactly — auth will fail otherwise.
4. **Run in dev mode:**
   ```bash
   npm run dev
   ```

## Project Layout

| Path | Purpose |
|---|---|
| `src/config/groq.js` | Groq client + default model/temperature config |
| `src/controllers/chatController.js` | Request handling for `/chat` and `/chat/stream` |
| `src/middleware/auth.js` | JWT verification shared with the main backend |
| `src/middleware/rateLimit.js` | Per-user request throttling |
| `src/prompts/systemPrompt.js` | Curriculum-aware system prompt builder |
| `src/routes/chat.js` | Route wiring |

## Making Changes

- **Branch naming:** `feature/<short-description>`, `fix/<short-description>`, or `docs/<short-description>`.
- **Commits:** Keep them focused; write descriptive messages (imperative mood, e.g. `Add difficulty-aware prompt tuning`).
- **Curriculum changes:** If you add/modify topics in `systemPrompt.js`, update the `CURRICULUM` array and keep slugs consistent with what the frontend sends in `context.currentTopic` / `context.recentTopics`.
- **No secrets in commits:** Never commit `.env`, API keys, or JWT secrets. `.env` is git-ignored — keep it that way.

## Testing Your Changes

There's no test suite yet (contributions welcome here!). At minimum, before opening a PR:

1. Hit `GET /health` and confirm `{ "status": "ok" }`.
2. Send a request to `POST /api/ai/chat` with a valid JWT and confirm a sensible `reply`.
3. If you touched streaming, confirm `POST /api/ai/chat/stream` emits incremental `data:` events and a final `{"done": true}`.
4. Confirm rate limiting kicks in after `RATE_LIMIT_MAX` requests within `RATE_LIMIT_WINDOW_MS`.

## Submitting a Pull Request

1. Fork or branch, make your changes, and ensure the service still boots cleanly (`npm start`).
2. Fill out the PR template completely, including what curriculum/persona behavior (if any) changed.
3. Link any related issue.
4. A maintainer will review and may request changes before merging.

## Reporting Bugs / Requesting Features

Please use the issue templates under `.github/ISSUE_TEMPLATE/` — they ask for the context needed to reproduce or evaluate the request quickly.

## Code of Conduct

By participating, you agree to uphold the standards in [`CODE_OF_CONDUCT.md`](./CODE_OF_CONDUCT.md).
