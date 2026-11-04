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

## Owner actions still required

Cloudflare reports the owner has no MFA enrolled. Enroll a passkey or authenticator and securely retain recovery codes before enforcing account-wide MFA. Staff currently authenticate by emailed one-time PIN; an independent MFA method/identity provider must be enrolled before changing the Access requirement. Do not enable an unsupported requirement that locks out the only staff identity.

An authenticated browser session is required to finish live dashboard sign-in, edit, export and session-expiry checks. Never add a bypass or use production customer records as synthetic test fixtures.

## Recovery and rollback

Restore exports to a separate database first; compare table counts and integrity, then exercise application reads and synthetic updates. Never restore production in place merely to test recovery. Exports contain personal information: keep them out of this public repository and remove temporary copies after the exercise.

For code rollback, redeploy a known-good commit while retaining the database binding and secret. Account for removal of fixes in an old commit. Re-check the current CSV, retention and rate-limit tests on every release. GitHub production environment protection and account recovery should be reviewed by the owner.
