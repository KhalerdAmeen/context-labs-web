---
type: context
order: 5
title: iOS & Android App Review rules
desc: Layout, accessibility and store-review rules for every iOS and Android app, as checks your agent runs before you submit.
intro: "Platform rules that hold for every app: safe areas, touch targets, Dynamic Type, contrast, and the common App Store and Google Play rejection causes. Give it to your agent before you submit."
tools: [claude code, claude app]
works: [claude app, claude code, cursor]
updated: "2026-10"
tryIt: check my app against the app review rules
# files/mobile-rules.md is a verbatim copy of the setup skill's references/mobile-rules.md (v0.1.0).
file: mobile-rules.md
facts:
  - { k: type, v: platform rules (same for every app) }
  - { k: length, v: 36 lines }
  - { k: from, v: the setup skill · v0.1.0 }
related: [setup, review, context-labs]
preview:
  - '## Layout (iOS)'
  - '- Touch targets at least 44×44pt, even when the visible icon is smaller.'
  - '## App Review (iOS) — common rejection causes'
  - '- Any third-party or social sign-in → offer Sign in with Apple too.'
  - '- Account creation in the app → account deletion reachable in the app.'
  - '## Google Play — common rejection causes'
  - '- Data safety form matches what the app actually collects.'
# "applied": the rules as setup wrote them into Cram's CONTEXT.md
# (~/Downloads/context-labs/tests/sandbox-cram/CONTEXT.md). Verbatim; "…" marks a cut.
source: from a real run · Cram, a study planner (test project)
applied:
  - '- Touch targets at least 44×44pt; primary actions (start block) in the lower, thumb-reachable part of the screen [rule]'
  - '- App Review checklist to plan for [rule]:'
  - '  - If any third-party sign-in is offered, Sign in with Apple must be offered too'
  - '  - Account creation in-app → account deletion reachable in-app'
  - '  - Purpose strings for camera (note photos), photo library, microphone (recordings), notifications'
  - '  - Privacy policy link in app and listing. Student notes go to Supabase and Claude, so say so plainly'
  - '  - Demo account for the reviewer'
generate:
  text: want these checked against your own code? setup reads your app and adds the rules that apply to your CONTEXT.md.
  href: /skills/setup
install:
  - key: app
    label: Claude app
    steps:
      - open your Project → Project knowledge
      - add `mobile-rules.md`
      - "ask: `check my app against the app review rules`"
  - key: code
    label: Claude Code
    steps:
      - save `mobile-rules.md` in your repo root
      - add `@mobile-rules.md` to `CLAUDE.md`
      - "ask: `check this build against the app review rules`"
  - key: cursor
    label: Cursor
    steps:
      - save it as `.cursor/rules/mobile-rules.mdc`
      - it loads in every chat in this project
---
