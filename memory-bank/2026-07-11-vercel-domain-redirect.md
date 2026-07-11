# 2026-07-11 — Vercel domain 301 redirect

## Changes
- Added `async redirects()` to `next.config.ts`.
- Redirects any path from host `wavepeak-iota.vercel.app` to the same path on `https://wavepeak.app` with `permanent: true` (HTTP 301).
- Host matching uses `has: [{ type: "host", value: "wavepeak-iota.vercel.app" }]`; path preserved via `source: "/:path*"` → `destination: "https://wavepeak.app/:path*"`.
- Existing `headers()` block left unchanged.

## Why
Old Vercel domain still resolves to the app, creating duplicate URLs for SEO. A 301 consolidates all traffic and link equity onto the canonical `wavepeak.app`.

## Verification
- `next.config.ts` parses fine — config keys: `redirects`, `headers`.
- Cannot be tested on localhost (redirect fires only for the `wavepeak-iota.vercel.app` host).
- After deploy: `curl -I https://wavepeak-iota.vercel.app/audio-cutter` should return `301` with `location: https://wavepeak.app/audio-cutter`.

## Notes
- Config file is `next.config.ts` (TypeScript), not `next.config.js`.
- Redirect is effective only after Vercel deploy where both domains point at the app.
