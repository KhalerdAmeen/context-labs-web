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
# Excerpts from a real run: ~/Downloads/context-labs/tests/sandbox-cram/.context-labs/reviews/2026-10-19-design-pass-1-r2.md
# Works (keep) rows are shown as ✓, Fails rows as ✕ (check · screen · kind), as the skill reports them.
preview:
  - '✓ One accent (#FFC400) only on next/current block'
  - '✓ Re-plan panel: "BEHIND · 2 BLOCKS MISSED YESTERDAY" in words…'
  - '✕ Nothing clipped at the bottom · Today, behind'
  - '✕ Start block in lower third · Today, behind'
  - '✕ Content matches samples · Today'
  - ''
  - 'fix prompt → 6 fixes, round 3'
triggers:
  - review these
  - check this against my context
  - is this on brand
  - what's wrong with this design
examples:
  title: what comes back
  note: it fixes only what failed. what works stays exactly as it is.
  source: from a real run · Cram, a study planner (test project)
  panels:
    - label: → the report
      lines:
        - '✓ One accent (#FFC400) only on next/current block; text on accent 11.7:1'
        - '✓ Re-plan panel: "BEHIND · 2 BLOCKS MISSED YESTERDAY" in words…'
        - '✕ Nothing clipped at the bottom · Today, behind · defect'
        - '✕ Start block in lower third · Today, behind · direction'
        - '✕ Content matches samples · Today · defect (minor)'
    - label: → the fix prompt
      lines:
        - 'Round 3 fixes for Cram design pass 1. Change ONLY these. Keep everything else exactly as it is.'
        - '1. Today, behind (light + dark): Start block is missing → pin the same Start block button as normal Today…'
        - '4. Today (light + dark): "Reliability vs validity" → 40 min…'
        - 'KEEP EXACTLY:'
        - '- The yellow next-block band on Today and the NOW band on Block; accent nowhere else'
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
