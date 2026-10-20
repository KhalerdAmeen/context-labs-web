---
# placeholder from the Claude Design export. Hidden in production.
type: context
draft: true
order: 9
title: "iOS App Review"
desc: "What gets apps rejected, as rules your agent checks before you submit."
intro: "What gets apps rejected, as rules your agent checks before you submit."
tools: [claude code]
works: [claude app, claude code, claude design, cursor]
updated: "2026-10"
tryIt: "check my app against ios app review"
preview:
  - "- Sign in with Apple equal to Google if any social login"
  - "- Account deletion reachable in-app"
  - "- Purpose string for every permission"
  - "- Restore purchases visible on the paywall"
  - "- No placeholder content in the review build"
  - "- Privacy manifest lists every tracking domain"
  - "- Demo account in review notes if login is required"
file: ios-app-review.md
install:
  - key: app
    label: Claude app
    steps:
      - open your Project → Project knowledge
      - add `ios-app-review.md`
      - "ask: `check my app against ios app review`"
  - key: code
    label: Claude Code
    steps:
      - save `ios-app-review.md` in your repo root
      - add `@ios-app-review.md` to `CLAUDE.md`
      - "ask: `check my app against ios app review`"
facts:
  - { k: type, v: domain rules (same for every iOS app) }
  - { k: length, v: 13 lines }
  - { k: checked, v: oct 2026 }
related: [mobile-app-kit, review, plan-mode-prompt]
rules:
  - "# iOS App Review — rules"
  - "## Sign-in"
  - "- Any social login → Sign in with Apple, visually equal"
  - "## Accounts"
  - "- Account deletion reachable in-app, not just by email"
  - "## Permissions"
  - "- A purpose string for every permission you request"
  - "## Purchases"
  - "- Restore Purchases visible next to any paywall"
applied:
  - "✓ Sign in with Apple equal to Google        [code: sign-in.tsx]"
  - "✕ Account deletion only via email           [code: settings/account]"
  - "✓ Purpose strings: camera, photos, location [app.json]"
generate:
  text: want this checked against your app automatically? the mobile app kit does it.
  href: /kits/mobile-app-kit
---
