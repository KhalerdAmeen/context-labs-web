---
# placeholder from the Claude Design export. Hidden in production.
type: context
draft: true
order: 13
title: "Plan Mode Prompt"
desc: "The prompt shape that makes Claude Code plan before it touches a file."
intro: "The prompt shape that makes Claude Code plan before it touches a file."
tools: [claude code]
works: [claude code]
updated: "2026-10"
tryIt: "plan this before you build it"
preview:
  - "Read CONTEXT.md first."
  - "PLAN FIRST. Don't write code until I approve."
  - "Flag conflicts with the stack."
  - "List every file you'll touch, and why."
  - "Stop after the plan. Wait for \"go\"."
  - ""
  - "then: one file per step, run tests"
file: plan-mode-prompt.md
install:
  - key: app
    label: Claude app
    steps:
      - open your Project → Project knowledge
      - add `plan-mode-prompt.md`
      - "ask: `plan this before you build it`"
  - key: code
    label: Claude Code
    steps:
      - save `plan-mode-prompt.md` in your repo root
      - add `@plan-mode-prompt.md` to `CLAUDE.md`
      - "ask: `plan this before you build it`"
---
