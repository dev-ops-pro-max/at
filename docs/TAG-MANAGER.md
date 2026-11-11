# Google Tag Manager installation — 2026-11-11

Container: GTM-T8V2Q4L3 (public identifier, not a secret).

The requested asynchronous Google script and gtag initialization are injected by scripts/build.mjs into the homepage, contact, privacy and terms pages. The staff dashboard is excluded. The exact inline initialization is allowed by its SHA-256 CSP hash; the www.googletagmanager.com host is allowed for scripts and connections. No unsafe-inline or unsafe-eval was added. Existing bindings, database and enquiry handling are unchanged.

The privacy notice now describes Tag Manager loading and possible configured tag processing. The website code does not push enquiry names, phone numbers or trip details into the data layer. Tags later published in the container must be reviewed separately.

Validation: fresh build and syntax checks passed, all 13 existing tests passed, and a packaging check confirmed exactly one installation and matching script hash on each of the four public pages, with none in admin. Live browser inspection confirmed the asynchronous container script is present, the hero photo renders, and no GTM CSP error was logged during the check.

This installs the container; it does not establish that a GA4 destination, conversion tags or consent settings have been configured or that Analytics is receiving events. Container publishing and Tag Assistant/GA4 Realtime verification are separate steps. No form submission was made for this installation test.

References:
- https://support.google.com/tagmanager/answer/14847097
- https://developers.google.com/tag-platform/security/guides/csp
