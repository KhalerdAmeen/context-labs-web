---
type: skill
order: 2
title: setup
desc: Create, extract or update your project's CONTEXT.md with pop-up questions. No file editing.
intro: Scans your codebase, or researches your category if you're starting fresh, then asks short pop-up questions built from what it found and writes CONTEXT.md with every line tagged by its source.
tools: [claude code, claude app]
works: [claude code, claude app]
updated: "2026-10"
kit: context-labs
tryIt: set up context for my app
facts:
  - { k: reads, v: "your code, docs and screenshots" }
  - { k: asks, v: "pop-up questions, 4 per round at most" }
  - { k: writes, v: "CONTEXT.md, every line tagged" }
download: kits/context-labs/files/context-labs-setup.zip
related: [context-labs, handoff, review]
preview:
  - '---'
  - 'name: context-labs-setup'
  - "description: Builds and maintains a project's CONTEXT.md, the single file every future Claude session…"
  - '---'
  - '# Context Labs: Setup'
  - '## Step 1: Pick the mode'
  - '## Step 2: Scan (silent)'
triggers:
  - set up context
  - write my brief
  - update my context
  - my app looks generic
# Excerpts from a real run: ~/Downloads/context-labs/tests/sandbox-cram/CONTEXT.md. Verbatim; "…" marks a cut.
examples:
  title: what it writes
  source: from a real run · Cram, a study planner (test project)
  panels:
    - label: → product
      lines:
        - '## Product'
        - "- What it is: an iPhone app that turns a student's lecture notes into a day-by-day study plan running up to their exams [you]"
        - "- Core action: open the app and see today's plan, which is already built… [you]"
        - '- Gap in the market: … None of them plan from the lecture notes themselves [research]'
    - label: → palette
      wrap: false
      lines:
        - '| Role | Light | Dark | Where it''s allowed | …'
        - '|---|---|---|---|'
        - '| Background | #F3F2EE | #0F0F0E | Screen ground | …'
        - '| Text | #121211 | #F3F2EE | Titles, body, heavy rules | …'
        - '| Muted | #62615C | #9C9A94 | Times, metadata, done rows… | …'
        - '| Accent | #FFC400 | #FFC400 | Exactly one accent; the next / current block fill only | …'
    - label: → decisions log
      lines:
        - '## Decisions log'
        - '- 2026-10-19: Re-planning asks first and shows what moved [you]'
install:
  - key: code
    label: Claude Code
    steps:
      - command: /plugin marketplace add KhalerdAmeen/context-labs
      - command: /plugin install context-labs@context-labs
      - "installs the whole kit. then type: `set up context for my app`"
  - key: app
    label: Claude app
    steps:
      - Settings → Features → Skills → upload `context-labs-setup.zip`
      - "in a Project, type: `set up context for my app`"
  - key: other
    label: Other
    steps:
      - open `SKILL.md`
      - paste it as instructions in your tool
      - answer the questions in chat
---
