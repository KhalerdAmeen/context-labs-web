# Mobile rules

Platform facts that hold for every app. Add only the ones that apply to
this project to CONTEXT.md, tagged `[rule]`. Check each against the code;
a rule the code breaks goes under Build → Known issues with the path.

## Layout (iOS)
- Respect safe areas: never place content under the status bar or the home
  indicator unless it's a deliberate full-bleed image.
- Touch targets at least 44×44pt, even when the visible icon is smaller.
- Primary actions within thumb reach, in the lower part of the screen.
- Support Dynamic Type for body text; nothing important in fixed tiny text.

## Layout (Android)
- Touch targets at least 48×48dp.
- Handle edge-to-edge insets and the back gesture.

## Accessibility
- Text contrast at least 4.5:1 (3:1 for large text).
- Every icon-only button has an accessibility label.
- Don't carry meaning by colour alone.

## App Review (iOS) — common rejection causes
- Any third-party or social sign-in → offer Sign in with Apple too.
- Account creation in the app → account deletion reachable in the app.
- A purpose string for every permission requested (camera, photos,
  location, contacts, calendars, notifications, microphone).
- In-app purchases or subscriptions → a visible Restore Purchases and clear
  price and renewal terms on the paywall.
- Privacy policy link in the app and in the listing.
- No placeholder text, broken links or debug screens in the review build.
- Features needing an account → a demo account for the reviewer.

## Google Play — common rejection causes
- Data safety form matches what the app actually collects.
- Account deletion available in the app and via a web link.
