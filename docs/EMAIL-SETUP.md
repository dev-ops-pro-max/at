# Email setup and verification guide

This record uses placeholders for personal addresses, domains, service names and identifiers. No credentials, tokens, DNS verification values or customer details are included.

## Status
- Sending-domain verification was confirmed by the owner.
- Incoming forwarding was configured and receipt confirmed by the owner.
- Website notification code was deployed.
- Syntax checks, 13 existing automated tests and mocked notification checks passed.
- A real website enquiry and inbox delivery confirmation remain pending. Mocked tests did not send email.

## Configuration pattern
- Sender: `help@<BUSINESS_DOMAIN>`.
- Destination: `<BUSINESS_INBOX>`.
- Store the provider API key only as an encrypted server-side secret. Never commit its value or expose it to browser code.
- Use a sending-only key restricted to the verified domain.
- Preserve the sending provider's verification records when enabling inbound forwarding.

## Behaviour
After a new enquiry is saved, the application attempts a staff notification. Rental, corporate and driver-partner enquiries are covered. Enquiry details stay in the database if email fails. Email content includes the reference and submitted contact/travel details; those values are not included in this document or notification logs.

Duplicate enquiry retries do not trigger another notification. Provider requests use an idempotency key and a bounded timeout. Provider API acceptance is not proof of inbox delivery. Failed notifications have no durable retry queue; staff should continue checking the administrative enquiry view.

## Verification checklist
1. Submit an enquiry through the public form labelled `TEST — ignore`, using contact information you control.
2. Confirm the website displays a reference number.
3. Confirm the enquiry appears in the administrative view.
4. Confirm the notification arrives in the business inbox and matches that reference.
5. Check the sending provider's delivery status if it does not arrive; do not paste API keys, customer data or full message bodies into tickets or source control.

Mocked checks covered the notification payload, HTML escaping, idempotency header, missing-key handling and email-failure isolation. Full production delivery is still awaiting the owner's test.

## Search indexing
The website has a sitemap and robots file. Search Console domain ownership verification and sitemap submission remain pending.
