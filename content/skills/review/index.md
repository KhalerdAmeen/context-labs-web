---
type: skill
order: 4
title: review
desc: Checks screenshots against your context and writes a narrow fix prompt.
intro: Checks screenshots of a design or build against your CONTEXT.md and the last handoff's checks, marks each check pass or fail with evidence, and writes a fix prompt that changes only what failed.
tools: [claude app, claude code]
works: [claude app, claude code]
updated: "2026-10"
kit: context-labs
tryIt: check this against my context
facts:
  - { k: reads, v: CONTEXT.md + your screenshots }
  - { k: outputs, v: a pass / fail report + a fix prompt }
  - { k: fixes per round, v: 8 at most }
download: kits/context-labs/files/context-labs-review.zip
related: [context-labs, setup, handoff]
preview:
  - '✕ Accent appears 3× on Today (rule: 1)'
  - '✕ Label 9px from pill edge (rule: 14px)'
  - '✓ Timeline density'
  - '✓ Tab bar labels visible'
  - '✕ Card radius 12 (allowed: 8 / 14 / 20)'
  - ''
  - 'fix prompt → 3 changes, 1 screen'
triggers:
  - review these
  - check this against my context
  - is this on brand
  - what's wrong with this design
examples:
  title: what comes back
  note: it fixes only what failed. what works stays exactly as it is.
  panels:
    - label: → the report
      lines:
        - '✕ Accent appears 3× on Today (rule: 1)'
        - '✕ Label 9px from pill edge (rule: 14px)'
        - '✓ Timeline density'
        - '✓ Tab bar labels visible'
        - '✕ Card radius 12 (allowed: 8 / 14 / 20)'
    - label: → the fix prompt
      lines:
        - Round 2 fixes for Today. Change ONLY these.
        - 1. Today — accent on 3 elements → Start only
        - 2. Pills — label 9px from edge → 14px
        - 3. Cards — radius 12 → 14
        - 'KEEP EXACTLY: timeline density, tab labels'
    - label: → back into context
      lines:
        - approved → asks, then logs it
        - '## Decisions log'
        - '- 2026-10-20: accent on primary only  [you]'
install:
  - key: code
    label: Claude Code
    steps:
      - command: /plugin marketplace add KhalerdAmeen/context-labs
      - command: /plugin install context-labs@context-labs
      - "installs the whole kit. then share screenshots and type: `check this against my context`"
  - key: app
    label: Claude app
    steps:
      - Settings → Features → Skills → upload `context-labs-review.zip`
      - "in a Project, attach screenshots and type: `check this against my context`"
  - key: other
    label: Other
    steps:
      - open `SKILL.md`
      - paste it as instructions in your tool
      - attach screenshots and ask for a review
---
