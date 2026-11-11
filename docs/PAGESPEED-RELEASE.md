# PageSpeed release review — 2026-11-11

Status: deployed and verified on 2026-11-11. Fresh Lighthouse results are recorded below.

## Report evidence
Desktop: performance 100, accessibility 97, best practices 92, SEO 100.
Low contrast affected booking labels, section eyebrows, secondary heading text and package tags.
Both scored browser errors refer to the Cloudflare analytics beacon blocked by script-src.
Cloudflare challenges account for approximately 5,061 KiB of the 5,412 KiB network payload.

## Prepared changes
Already committed to main: darker purple labels (#71528d), and Turnstile initialization on form focus rather than initializing every desktop form on load.
Fresh build, JavaScript syntax validation and all 13 existing tests passed. The replacement purple has approximately 6.38:1 contrast against white; this is not a complete accessibility audit.
The policy correction adds only the two specific Cloudflare analytics origins; no wildcard, unsafe-inline or unsafe-eval.
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

Live checks confirmed corrected label colours, the analytics script loading without its earlier CSP violation, no form widget markup initially, and a widget response field appearing only in the interacted form. A 390px mobile screenshot showed a readable single-column booking form. Existing Worker binding names and types were preserved. No real enquiry was submitted in this verification.

Image optimization, cache lifetime and render-blocking suggestions remain pending. Fresh Lighthouse results are recorded below.

Production deployment and the earlier backend commit were blocked by automatic approval review due to broad bundled replacement risk and existing personal configuration. After fresh build/tests and guarded verification that only two assets and two exact CSP directives changed, the content-only production deployment was approved and succeeded. No personal configuration was committed or changed. The build now includes the targeted CSP correction to preserve it on future releases.

## WebP deployment and fresh Lighthouse run — 2026-11-11 10:43 UTC

Five photo assets were converted to WebP at unchanged dimensions (quality 72). Original JPEGs remain available. Total file bytes: 571294 → 293634, a reduction of 277660 bytes (48.6%). Main two photos: 306428 → 170466 bytes. The build rewrites only the five named photo references in HTML and Worker-generated fleet markup.

Fresh build, syntax checks and all 13 tests passed. Live asset checks returned HTTP 200 and image/webp for each optimized image. Production asset inspection confirmed hero and fleet references use WebP.

| Category | Mobile | Desktop |
| --- | ---: | ---: |
| Performance | 97 | 100 |
| Accessibility | 100 | 100 |
| Best practices | 100 | 100 |
| SEO | 100 | 100 |

Mobile FCP 0.9s, LCP 2.1s, TBT 0ms, CLS 0, Speed Index 4.0s. Desktop FCP 0.2s, LCP 0.5s, TBT 0ms, CLS 0.032, Speed Index 1.0s. These are lab results with normal run-to-run variation; field data remains unavailable. Mobile Speed Index was slower than the earlier supplied run despite improved FCP/LCP.

Report: https://pagespeed.web.dev/analysis/https-amaravathitravels-com/8cqqyin6aq?form_factor=desktop

Remaining suggestions: responsive image sizing/compression (estimated 75 KiB mobile, 126 KiB desktop), render-blocking CSS, and cache lifetimes (estimated 33 KiB). No claim of complete security or manual accessibility coverage follows from Lighthouse scores.

## Mobile follow-up release — 2026-11-11 11:14 UTC

Deployed responsive hero variants (480px: 22,656 bytes; 720px: 45,144 bytes; original 1100px: 91,536 bytes), with srcset/sizes and responsive high-priority preload. High-density screens can still choose the original. Consolidated the four homepage CSS files into one content-named bundle, preserving their exact cascade order. Existing individual styles remain available.

Mobile service-card content is hidden during JavaScript startup only in scripting-enabled small viewports. Booking initialization then adds panels-ready after setting the correct panel state. Server markup remains open for desktop and non-JavaScript fallback; desktop initialization continues opening all five panels. This avoids mobile startup collapse shifts without introducing desktop opening shifts.

The published GA4 tag added startup work and attempted collection through blocked CSP endpoints. Path-limited GA collection endpoints were added to connect-src. Tag Manager now loads once after page load/two animation frames at browser idle, or earlier on pointer/keyboard interaction. Very brief visits may not be counted. No enquiry handling, database or authentication logic was changed.

Validation:
- Build and syntax checks passed; all 13 existing tests passed.
- Idle-loader mocked execution passed both idle and early-interaction paths with one container insertion.
- New photo and CSS asset HTTP checks passed, with correct content types.
- Package checks verified identical CSS rule content/order, responsive photo references and analytics policy.
- 390x844 mobile screenshots inspected for hero, booking and corporate form layout.
- Desktop runtime check showed all five service panels open and the Google container eventually loaded.
- An intermediate audit failed to load the new stylesheet and was not accepted as final evidence. Current CSS was independently confirmed HTTP 200/text-css, and a subsequent completed audit below verifies both views.

| Category | Mobile | Desktop |
| --- | ---: | ---: |
| Performance | 98 | 100 |
| Accessibility | 100 | 100 |
| Best practices | 100 | 100 |
| SEO | 100 | 100 |

Mobile FCP 0.9s, LCP 2.4s, TBT rounded 10ms, CLS 0, Speed Index 0.9s.
Desktop FCP 0.2s, LCP 0.5s, TBT rounded 10ms, CLS 0.032, Speed Index 0.4s.
These are lab measurements, not field data or a promise of identical scores on every run. The earlier 97 mobile result preceded GA4 installation and is not an identical analytics configuration.

Final report:
https://pagespeed.web.dev/analysis/https-amaravathitravels-com/rjrebm7kd5?form_factor=mobile
https://pagespeed.web.dev/analysis/https-amaravathitravels-com/rjrebm7kd5?form_factor=desktop

Further cache policy work, responsive sizing for secondary fleet photos, and CSS removal remain optional optimizations. No new real enquiry was submitted during this follow-up. GA4 Realtime receipt and account-side user-provided-data settings remain unverified.
