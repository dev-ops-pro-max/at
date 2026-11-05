# Security maintenance

## Implemented controls

- Enquiry attempts are limited to 20 per IP per minute at each Cloudflare location. Shared networks share this allowance. A rejected attempt returns 429 with Retry-After: 60. Turnstile, origin and input checks still apply.
- CSV exports quote fields, escape embedded quotes and guard formula prefixes. Spreadsheet behavior differs: treat exported customer text as untrusted when importing into other systems.
- Retention keeps the existing 180-day policy and daily 02:15 UTC schedule. Successful runs record a system audit marker and counts in logs. Failures log an error and propagate to the runtime. Staff see warnings if no successful marker exists after the initial grace period or the latest marker is more than 36 hours old.
- Worker default and preview URLs are disabled. Staff APIs require the approved Cloudflare Access identity and audience.
- Query strings are redacted from Worker invocation logs. Application logs exclude customer form values.
- Deployment metadata preserves the rate-limit binding, secret binding and issue-detection settings.

## Verification on 4 November 2026

Production D1 export restored into an isolated local SQLite database. All three application tables restored, with 6 catalogue rows, 1 enquiry and 0 audit entries. PRAGMA integrity_check returned ok. No production record was changed by this exercise. D1 Time Travel returned a recovery bookmark. This is an export/restore exercise, not a measured disaster-recovery RTO or a long-term offsite backup policy.

All 13 repository tests passed, covering bot validation, origin rejection, staff authorization, concurrent edits, escaping, retention and throttling. A high-confidence credential-pattern scan of 13 reachable commits found no matches. package.json has no external runtime or development dependencies. These checks cannot establish that no secret exists in any external system.

Cloudflare notification policies were configured for Worker issues, certificate events and DDoS events to the verified account-owner email. The Worker issue policy test API returned success; inbox receipt requires owner confirmation.

## Scope decisions and remaining checks

The owner has explicitly excluded MFA and email-related work from this review. Staff sign-in was verified in another conversation; no MFA policy or email configuration change is pending here. The user reported two staff members share access, so this review did not broaden the Access allow policy.

The authenticated staff edit, CSV export and session-expiry workflows were not re-tested in this pass. Do not use production customer records as synthetic test fixtures.

## 5 November 2026 recheck

At the start of this recheck, the production zone still had its minimum TLS version set to 1.0 and the zone-level Always Use HTTPS control off. Both are now enabled: the zone enforces HTTPS and the minimum TLS version is 1.2. The Worker had already been redirecting HTTP requests to HTTPS, so this adds a zone-level safeguard. Current iPhones, including iPhone 14, support TLS 1.2.

The separate Android app Worker had query-string redaction disabled in observability. Redaction is now enabled; this changes logs and traces only, not app request handling.

The Worker-backed apex and app hosts do not require a traditional origin connection; the other proxied hostnames include a Cloudflare Tunnel. The zone SSL mode was Flexible, so that mode was left unchanged until the Tunnel origin path is independently checked. Cloudflare's zone security level was `essentially_off`; WAF was off. These can affect which visitor requests are challenged or blocked, so they remain for a rule-impact review rather than a blind toggle.

Mobile rendering was inspected at an iPhone 14 CSS viewport (390 × 844). Corporate and Driver Partners content now stacks, each form uses the available mobile width, and its fields use one column. The corporate submit label stays on one line. The fixed WhatsApp control becomes a compact, labelled icon so it covers less of the page while scrolling. The Driver Partners badge retains its circular shape and consent checkboxes align beside their text. The Sedan, SUV/MUV and Van/Traveller cards loaded their expected car/interior/Traveller images; no image or request was broken in the inspected cards.

## Recovery and rollback

Restore exports to a separate database first; compare table counts and integrity, then exercise application reads and synthetic updates. Never restore production in place merely to test recovery. Exports contain personal information: keep them out of this public repository and remove temporary copies after the exercise.

For code rollback, redeploy a known-good commit while retaining the database binding and secret. Account for removal of fixes in an old commit. Re-check the current CSV, retention and rate-limit tests on every release. GitHub production environment protection and account recovery should be reviewed by the owner.
