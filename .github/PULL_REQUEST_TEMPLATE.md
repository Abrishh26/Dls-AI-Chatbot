## Summary

Briefly describe what this PR changes and why.

## Type of Change

- [ ] Bug fix
- [ ] New feature
- [ ] Documentation
- [ ] Refactor / internal
- [ ] Curriculum / prompt content change

## Related Issue

Closes #

## Changes

-
-

## How Has This Been Tested?

- [ ] `GET /health` returns `200`
- [ ] `POST /api/ai/chat` returns a sensible `reply` with a valid JWT
- [ ] `POST /api/ai/chat/stream` streams `data:` events and ends with `{"done": true}`
- [ ] Rate limiting still triggers a `429` after `RATE_LIMIT_MAX` requests
- [ ] Invalid/missing JWT correctly returns `401`

## Checklist

- [ ] No secrets (`.env`, API keys, JWT secret) committed
- [ ] Updated `README.md` if behavior or env vars changed
- [ ] Updated `CURRICULUM` in `systemPrompt.js` if topic scope changed
