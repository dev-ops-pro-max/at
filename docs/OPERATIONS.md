# Operations runbook

## Targets, not measured guarantees
Proposed public availability SLO: 99.5% successful home-page responses monthly. Proposed enquiry SLO: 99% valid, verified enquiries stored without server error. Exclude user validation failures; report authentication and provider failures separately. No achieved availability or alert coverage is claimed until measurements exist.

## Health and observability
GET /healthz: liveness and release SHA. GET /readyz: D1 table read (503 on failure). Workers logs record request ID, route path, response status and duration; never query strings, phone numbers or form contents. Public /api/catalog exposes only published catalogue fields. Review free-tier account usage and database query counts in Cloudflare. Every homepage currently executes one indexed-small catalogue read; cache after measuring if traffic needs it.

## Deploy
GitHub workflow deploy.yml is workflow_dispatch only; type DEPLOY and choose a commit/ref. Production environment secret CLOUDFLARE_API_TOKEN needs Workers Scripts Edit for account 8548ec7dd05cba8419249225afcf7817. The initial D1 schema is already provisioned through the Cloudflare integration. Apply future migrations separately and review them before deployment. This workflow builds and checks, uploads the Worker while preserving TURNSTILE_SECRET, and runs smoke checks. GitHub environment protections, if desired, must be configured by the repository owner; a workflow environment name alone is not a protection rule.

Public business domain is attached directly to amaravathi-travels-platform. Original icy-resonance-334e Worker is retained, so remapping the domain is the initial release rollback. Android Worker is separate.

## Rollback
For the initial release: attach amaravathitravels.com back to icy-resonance-334e using Workers custom domains; verify homepage. For a later code rollback, run manual deployment against a previously tested commit. Do not automatically revert D1 schema; use additive migrations and backward-compatible changes. Verify /healthz, /readyz, homepage, /admin redirect, unauthorized /admin/api/enquiries, and a test enquiry after every release. Capture request IDs when investigating a failure.

## Backups and recovery
D1 Time Travel/exports are managed via Cloudflare. Before schema changes, export D1 with your authenticated tooling and store the export privately outside GitHub (it contains customer data). Record export time and schema version. Restore into a new database first, verify catalogue and synthetic enquiries, then bind the Worker to the restored database. A successful backup is not proof of a successful restore: conduct and record a restore exercise before claiming an RTO/RPO. None is claimed in this initial release.

## Retention
A daily 02:15 UTC cron deletes enquiries and audit logs older than 180 days by last-update/creation time. Admin updates extend enquiry retention. Follow up deletion requests via the published support email and verify requester identity. Backups may retain older data according to their own retention; do not publish backup copies. Confirm the policy with the business as operations evolve.

## Incident response
1. Check /healthz and /readyz, Cloudflare status, Workers errors and D1 quotas.
2. Correlate X-Request-ID; never paste customer data into public issues.
3. For bot verification failures check widget domain, action, current secret and provider response; never disable verification as an emergency shortcut.
4. For login failures check Access policy, OTP provider, allowed email and application audience. Never add a public bypass or trust client headers.
5. For a faulty release redeploy a tested commit or restore the previous domain mapping. Document trigger, impact, timeline and corrective changes in an incident report.

## Smoke monitoring
CI can run scripts/smoke.mjs manually or after deployment. Cloudflare Worker issue, certificate and DDoS email notifications are configured; the Worker issue delivery test returned success. No recurring external uptime probe has been activated. To add it, select the monitoring cadence and notification destination; account for GitHub Actions allowance. Keep admin data out of uptime probes.

## Link previews and www
Both public sites expose Open Graph metadata and a 1200 × 630 JPEG without authentication. Run `node scripts/check-social.mjs` after changing sharing metadata. This checks the public server response, not the state of WhatsApp's cache or a user's preview privacy settings.

The `www.amaravathitravels.com/*` zone route invokes Worker `amaravathi-www-redirect`, whose source is `src/www-redirect.js`. It returns a 308 redirect to the HTTPS apex, preserving path and query. The existing proxied www CNAME remains in place. This small Worker is independent from the main deployment workflow. Restore/delete its zone route to roll back the www behavior without affecting apex or app routing.

Security controls, recovery exercise evidence and remaining owner prerequisites are recorded in SECURITY-CHECKS.md.
