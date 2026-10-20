---
# placeholder from the Claude Design export. Hidden in production.
type: context
draft: true
order: 10
title: "Claude Design Pass Plan"
desc: "How to feed a big design to Claude Design in passes instead of all at once."
intro: "How to feed a big design to Claude Design in passes instead of all at once."
tools: [claude design]
works: [claude design]
updated: "2026-10"
tryIt: "plan my design passes"
preview:
  - "Pass 1: the 3 screens that decide the direction"
  - "Pass 2–6: one screen group each, same preamble"
  - ""
  - "every pass:"
  - "  preamble (verbatim) + this pass + checks"
  - "  approve before sending the next"
  - "  never fix two screens in one prompt"
file: claude-design-pass-plan.md
install:
  - key: app
    label: Claude app
    steps:
      - open your Project → Project knowledge
      - add `claude-design-pass-plan.md`
      - "ask: `plan my design passes`"
  - key: code
    label: Claude Code
    steps:
      - save `claude-design-pass-plan.md` in your repo root
      - add `@claude-design-pass-plan.md` to `CLAUDE.md`
      - "ask: `plan my design passes`"
---
