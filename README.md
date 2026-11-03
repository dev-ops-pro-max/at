# Amaravathi Travels · Chennai

Dynamic Chennai rental, package, corporate transport and driver-partner enquiries, hosted on Cloudflare Workers with D1. Public site: https://amaravathitravels.com · Staff: /admin · Android support remains independently hosted at https://app.amaravathitravels.com.

## Implemented
- Chennai-inspired mobile UI with original SVG illustrations; no competitor photography or unapproved rates.
- Server-rendered fleet and packages from D1; staff can add, edit, publish or hide items.
- Validated rental, corporate and partner forms, Turnstile verification, durable enquiry references and idempotent inserts.
- Access OTP authentication restricted to amaravathitravelsavr@gmail.com, plus Worker authorization through trusted ctx.access (never user-supplied email headers).
- Staff search, status updates, quotes, vehicle assignment, internal notes, optimistic edit conflict detection, audit records and displayed-page CSV export.
- Structured logs without form contents, liveness/readiness endpoints, security headers and 180-day enquiry retention.

## Stack decision
This first release uses native Worker ES modules and server-rendered HTML rather than Astro/Hono. The same dynamic behavior is delivered with no runtime package dependencies or framework adapter, retaining a small deployable artifact and direct Access context. Static CSS/JS are embedded at build time; public catalogue HTML is rendered from D1 on each request. This keeps the deployment directly inspectable for the SRE portfolio. Framework migration can be a later architecture decision.

## Local development
Node 24+. No dependency installation required.
```
npm run build
npm run check
npm test
npm run dev
```
Local development uses an in-memory SQLite database and a test widget. It deliberately does not bypass staff authentication or accept real enquiries. Automated tests use synthetic Access contexts and mocked Siteverify; they do not prove production login or CAPTCHA success.

## Delivery
See docs/OPERATIONS.md and docs/ARCHITECTURE.md. CI runs on pushes and PRs. The deploy workflow is manual and requires a production-scoped CLOUDFLARE_API_TOKEN GitHub environment secret. No credentials belong in this repository. The initial deployment can be performed through the connected Cloudflare integration; Actions deployment requires that secret to be configured by the owner.

## Business content
Rates remain “Quote on request”; category illustrations are explicitly labelled. No claimed customer logos, testimonials, fleet counts, instant availability, GPS tracking or online payment. Confirm business tariffs, actual service coverage, fleet photographs and booking terms before publishing those details. The Android privacy policy remains separate and needs the app's actual data practices.
