# Security Policy

## Supported Versions

This service is currently pre-1.0 and tracks `main` only. There are no maintained release branches yet — please always run the latest commit on `main`.

| Version | Supported |
|---|---|
| `main` | ✅ |

## Reporting a Vulnerability

If you discover a security vulnerability in the DLS AI Chatbot — for example, a JWT validation bypass, rate-limit bypass, prompt-injection path that leaks system-prompt internals, or an issue in how user context is passed to Groq — please **do not open a public issue**.

Instead, report it privately as described in [`SUPPORT.md`](./SUPPORT.md), including:

1. A description of the vulnerability and its potential impact.
2. Steps to reproduce (a minimal `curl` request is ideal).
3. The affected file(s)/endpoint(s), if known.

We aim to acknowledge reports within **5 business days** and to ship a fix or mitigation within **30 days**, depending on severity.

## Security Considerations Specific to This Service

- **JWT secret sharing:** This service trusts any token signed with `JWT_SECRET`. That value **must** be kept identical to, and as protected as, the main `DigitalLogicsStudio-Backend`'s secret. Never log it, commit it, or expose it via error messages.
- **No server-side conversation history:** This service is intentionally stateless — it does not persist chat messages. If you add persistence in a fork or extension, ensure stored messages are scoped per-user and access-controlled.
- **Rate limiting:** `RATE_LIMIT_MAX` / `RATE_LIMIT_WINDOW_MS` protect the shared Groq quota, not just the user experience. Don't disable rate limiting in production.
- **Groq API key:** Treat `GROQ_API_KEY` as a production secret. It is never sent to the client and should only live in `.env` (git-ignored) or your deployment platform's secret manager.
- **CORS:** `CLIENT_URL` should be set to the exact Boolforge frontend origin in production — avoid wildcard origins when `credentials: true` is set.
- **Input limits:** User messages are capped (see `chatController.js`) to reduce abuse surface and runaway token costs; please keep equivalent guards in place if you modify request handling.

## Disclosure

Once a fix is released, we will credit reporters (with permission) in the relevant PR/release notes.
