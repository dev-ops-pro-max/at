# Business email setup

## Confirmed
- Resend domain: amaravathitravels.com, verified by the owner.
- Sender: help@amaravathitravels.com.
- Cloudflare Email Routing forwards help to the existing business Gmail (configured destination); receipt tested and confirmed by the owner.
- Preserve Resend send/rsend CNAMEs and resend._domainkey TXT when managing routing DNS.

## Website integration prepared, activation pending
The Worker source now supports RESEND_API_KEY as an encrypted Worker secret. It sends a staff notification after a new enquiry is committed to the database. Retries with the same enquiry key do not create another notification; Resend requests also use an idempotency key. Messages include the enquiry reference, customer name, phone and requirements. No automatic customer email is sent because forms do not collect customer email addresses.

The database remains authoritative. Email errors do not discard enquiries. Notifications have a 10-second timeout and safe event logs without API keys or message bodies. Delivery failures are not durably retried; staff must check the admin dashboard. API acceptance is not proof of inbox delivery.

## Activate
1. In Resend create a sending-only API key restricted to the verified domain.
2. In Cloudflare Workers & Pages > amaravathi-travels-platform > Settings > Variables and Secrets add a Secret named RESEND_API_KEY. Paste the value there, never in chat, GitHub or frontend code.
3. Deploy the reviewed source using the established deployment procedure, preserving all bindings, Access settings and scheduled jobs.
4. Submit one clearly labelled test enquiry, confirm its reference in admin, then confirm the notification in Resend logs and the business Gmail inbox.
5. Confirm duplicate request handling and simulated email failure in local tests before production rollout.

At this checkpoint: source prepared; production not activated or delivery-tested. Existing production booking behaviour is unchanged.

## Search indexing
A sitemap and robots file already exist in source and the deployed assets. Search Console ownership verification and sitemap submission remain pending the owner's Google account verification token.
