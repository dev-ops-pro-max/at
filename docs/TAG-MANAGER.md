# Google Tag Manager installation — 2026-11-11

Container: GTM-T8V2Q4L3 (public identifier, not a secret).

The gtag initialization and a deferred /tag-manager.js bootstrap are injected by scripts/build.mjs into the homepage, contact, privacy and terms pages. The bootstrap loads the same asynchronous container once after page load and two animation frames, during browser idle time (1500ms timeout), or earlier on pointer/keyboard interaction. Very brief visits may exit before analytics loads. The staff dashboard is excluded. The exact inline initialization is allowed by its SHA-256 CSP hash; the www.googletagmanager.com host is allowed for scripts and connections. No unsafe-inline or unsafe-eval was added. Existing bindings, database and enquiry handling are unchanged.

The privacy notice now describes Tag Manager loading and possible configured tag processing. The website code does not push enquiry names, phone numbers or trip details into the data layer. Tags later published in the container must be reviewed separately.

Validation: fresh build and syntax checks passed, all 13 existing tests passed, and a packaging check confirmed exactly one installation and matching script hash on each of the four public pages, with none in admin. Live browser inspection confirmed the asynchronous container script is present, the hero photo renders, and no GTM CSP error was logged during the check.

This installs the container; it does not establish that a GA4 destination, conversion tags or consent settings have been configured or that Analytics is receiving events. Container publishing and Tag Assistant/GA4 Realtime verification are separate steps. No form submission was made for this installation test.

References:
- https://support.google.com/tagmanager/answer/14847097
- https://developers.google.com/tag-platform/security/guides/csp

Follow-up verification: published container includes GA4 destination G-52HC0G57EP. Browser errors in a mobile audit identified blocked GA collection. CSP now permits the path-limited /g/collect endpoints on www.google-analytics.com, region1.google-analytics.com and www.google.com. This does not confirm receipt in GA4 Realtime. The earlier automatic user-provided-data configuration warning still requires account-side verification.

The loader was tested with mocked idle and early-interaction paths: the container is appended exactly once. Live browser inspection confirmed the container eventually loads and reported no site/GA CSP errors in that check.
