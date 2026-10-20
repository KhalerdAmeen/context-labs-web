---
# placeholder from the Claude Design export. Hidden in production.
type: context
draft: true
order: 11
title: "Pitch Deck"
desc: "Story, proof and numbers rules for a deck investors actually finish."
intro: "Story, proof and numbers rules for a deck investors actually finish."
tools: [claude app]
works: [claude app]
updated: "2026-10"
tryIt: "outline my pitch deck"
preview:
  - "## Claims"
  - "- only numbers you can source"
  - "## Slide 1"
  - "The problem in one sentence a stranger gets"
  - "## Slide 2"
  - "Who has it, how often, what it costs them"
  - "## Ask"
file: pitch-deck.md
install:
  - key: app
    label: Claude app
    steps:
      - open your Project → Project knowledge
      - add `pitch-deck.md`
      - "ask: `outline my pitch deck`"
  - key: code
    label: Claude Code
    steps:
      - save `pitch-deck.md` in your repo root
      - add `@pitch-deck.md` to `CLAUDE.md`
      - "ask: `outline my pitch deck`"
---
