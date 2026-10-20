---
# placeholder from the Claude Design export. Hidden in production.
type: context
draft: true
order: 8
title: "About Me"
desc: "Who you are, how you work, your standards. Set it once, every chat starts knowing you."
intro: "Who you are, how you work, your standards. Set it once, every chat starts knowing you."
tools: [claude app]
works: [claude app, claude code]
updated: "2026-10"
tryIt: "write in my voice"
preview:
  - "## Voice"
  - "- lowercase, no emojis, short declaratives"
  - "## Standards"
  - "- one primary action per screen"
  - "- ship the small version first"
  - "## Stack"
  - "- next.js, tailwind, claude code"
file: about-me.md
install:
  - key: app
    label: Claude app
    steps:
      - open your Project → Project knowledge
      - add `about-me.md`
      - "ask: `write in my voice`"
  - key: code
    label: Claude Code
    steps:
      - save `about-me.md` in your repo root
      - add `@about-me.md` to `CLAUDE.md`
      - "ask: `write in my voice`"
---
