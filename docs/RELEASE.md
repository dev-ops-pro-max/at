# Initial release review

## Validation performed
- 8 Node tests covering server validation, admin denial/spoofed headers, Turnstile action/hostname/replay contract with mocks, idempotent saves, same-origin mutations, optimistic updates/audit, escaping and retention.
- Syntax checks and deterministic dependency-free build.
- Native SQLite used for migration and D1 query compatibility tests.

## Limitations
Managed preview daemon was unavailable (`sites-previewd mailbox is unavailable`), so local browser layout QA could not run. CSS includes mobile breakpoints and semantic controls, but screenshots and real device checks remain pending. Production inbox OTP login requires the owner's mailbox. Real CAPTCHA success/replay must be verified in-browser; mocked tests prove contract behavior only. No claim of measured SLO, restoration time, or 24/7 alerting is made.

## Release acceptance checklist
- [ ] Live homepage, assets, privacy, terms, catalogue and health endpoints verified.
- [ ] Staff root and API redirect through Access; forged email header cannot reveal data.
- [ ] Owner signs in with the approved email and reviews the dashboard.
- [ ] Complete one real enquiry, confirm its reference in D1/admin, replay token rejected, delete test data.
- [ ] Check mobile view and keyboard use.
- [ ] Configure GitHub production deployment secret if Actions deployment is desired.

## Content boundaries
All prices are quotation-only; photographs are original SVG illustrations of vehicle categories. No competing operator's images, rates or reviews have been copied. Published suggested package routes are subject to discussion and availability. The 180-day retention job is part of this release; review this operational policy before collecting longer-term business records.
