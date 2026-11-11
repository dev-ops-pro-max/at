# PageSpeed release review — 2026-11-11

Status: staged for review, not deployed. No new Lighthouse score is verified.

## Report evidence
Desktop: performance 100, accessibility 97, best practices 92, SEO 100.
Low contrast affected booking labels, section eyebrows, secondary heading text and package tags.
Both scored browser errors refer to the Cloudflare analytics beacon blocked by script-src.
Cloudflare challenges account for approximately 5,061 KiB of the 5,412 KiB network payload.

## Prepared changes
Already committed to main: darker purple labels (#71528d), and Turnstile initialization on form focus rather than initializing every desktop form on load.
New JavaScript syntax validation passed. The replacement purple has approximately 6.38:1 contrast against white; this is not a complete accessibility audit.
The staged script adds only the two specific Cloudflare analytics origins; no wildcard, unsafe-inline or unsafe-eval.
It defaults to dry-run and refuses unexpected source changes.
Admin access, notification recipients, secrets, database and submission validation are unchanged.

## Review and release
1. Run node scripts/prepare-pagespeed-csp.mjs (dry-run).
2. Review both origin additions, then run node scripts/prepare-pagespeed-csp.mjs --write.
3. Inspect git diff -- src/worker.js locally; do not paste personal configuration into reports.
4. Run npm run check, npm test and npm run build.
5. Deploy through the existing reviewed release workflow after checking production bindings are preserved.
6. Verify initial loading produces no analytics CSP error. Focus each enquiry form and verify its Turnstile widget mounts. Test one authorized enquiry end to end, including notification.
7. Rerun PageSpeed mobile and desktop. Old report links retain old results.

Image optimization, cache lifetime and render-blocking suggestions remain pending. A staged release is not a live deployment.

Production deployment and the earlier backend commit were blocked by automatic approval review due to broad bundled replacement risk and existing personal configuration. This branch is a sanitized review artifact, not a deployment workaround.
