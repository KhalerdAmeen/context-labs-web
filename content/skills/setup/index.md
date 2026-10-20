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
  - 'description: Builds and maintains'
  - '  CONTEXT.md. Use when someone says "set up context"…'
  - '---'
  - '1. Scan the repo for tokens, components, copy'
  - "2. Ask only what the code can't answer"
triggers:
  - set up context
  - write my brief
  - update my context
  - my app looks generic
examples:
  title: what it asks, what it writes
  note: options come from your own code, not a template.
  panels:
    - label: → it asks
      lines:
        - I found 3 reds in your code. Which is the accent?
        - '› #C41E3A — used 47× (buttons, stars)'
        - '  #8B1A1A — used 12× (badges)'
        - '  #E63946 — used 3× (looks like a leftover)'
        - ''
        - Where should the accent be allowed?
        - '› primary action · ratings · active nav'
    - label: → it writes
      lines:
        - '## Tokens'
        - '| Accent | #C41E3A | 1 primary | code (47×) + you |'
        - '## Rules'
        - '- Radius: 8 / 14 / 20. Nothing else.  [you]'
        - '- Touch targets ≥ 44pt.              [iOS rule]'
    - label: → after a big change
      lines:
        - '› update my context'
        - ''
        - 'changed since 2026-09-12:'
        - '- new colour #46C18A in 3 files'
        - '- screen removed: Settings/Legacy'
        - ''
        - asks before writing a line
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
