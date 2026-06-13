# 2026-06-10 — Domain update

## Changes
- Updated sitemap base URL in `src/app/sitemap.ts` to `https://wavepeak.app`.
- Updated `metadataBase` in `src/app/layout.tsx` to `https://wavepeak.app`.
- Replaced all remaining old Vercel-domain references with `https://wavepeak.app` across the project, including canonical URLs, Open Graph URLs, `robots.ts`, and project docs.

## Verification
- `rg "wavepeak-iota\\.vercel\\.app"` returns no matches.
- Ran `npm run lint`: no errors, existing 5 warnings remain unrelated to this change.

## Notes
- The active production domain is now `https://wavepeak.app`.
