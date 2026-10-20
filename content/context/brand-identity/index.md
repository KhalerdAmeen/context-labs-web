---
# placeholder from the Claude Design export. Hidden in production.
type: context
draft: true
order: 12
title: "Brand Identity"
desc: "Mark, type and colour decisions with the reasons written down."
intro: "Mark, type and colour decisions with the reasons written down."
tools: [claude design, claude app]
works: [claude design, claude app]
updated: "2026-10"
tryIt: "check this against my brand"
preview:
  - "## Mark"
  - "- must survive 16px"
  - "## Refused"
  - "- the category's default colour"
  - "## Type"
  - "- one family, two weights"
  - "- reason: reads at 11px on a receipt"
file: brand-identity.md
install:
  - key: app
    label: Claude app
    steps:
      - open your Project → Project knowledge
      - add `brand-identity.md`
      - "ask: `check this against my brand`"
  - key: code
    label: Claude Code
    steps:
      - save `brand-identity.md` in your repo root
      - add `@brand-identity.md` to `CLAUDE.md`
      - "ask: `check this against my brand`"
---
