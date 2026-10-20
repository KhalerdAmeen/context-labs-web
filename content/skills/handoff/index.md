---
type: skill
order: 3
title: handoff
desc: "Writes the right prompt for the next tool: Claude Design, Claude Code plan mode, or an artifact."
intro: "Writes the right prompt for the next tool: Claude Design, Claude Code plan mode, or an artifact. Each prompt carries only what that tool needs."
tools: [claude design, claude code]
works: [claude design, claude code]
updated: "2026-10"
kit: context-labs
tryIt: send pass 1 to claude design
facts:
  - { k: reads, v: CONTEXT.md }
  - { k: outputs, v: a prompt to paste }
  - { k: targets, v: "claude design, claude code (plan mode), artifact" }
download: kits/context-labs/files/context-labs-handoff.zip
related: [context-labs, setup, review]
# Excerpts from a real run: ~/Downloads/context-labs/tests/sandbox-cram/.context-labs/handoffs/2026-10-19-design-pass-1.md
preview:
  - 'CRAM — DESIGN PASS 1: the three screens that decide the direction…'
  - '## PREAMBLE (paste with every pass of this project)'
  - '## THIS PASS — 3 screens'
  - '## SHOW'
  - '## CHECK BEFORE ACCEPTING'
  - '## DO NOT'
  - '- More than one accent colour'
triggers:
  - send this to claude design
  - write the plan mode prompt
  - hand this off to claude code
examples:
  title: what it writes
  note: what each tool doesn't need is left out on purpose.
  source: from a real run · Cram, a study planner (test project)
  panels:
    - label: → preamble
      lines:
        - '## PREAMBLE (paste with every pass of this project)'
        - 'Feel: calm, sure, quiet. The app''s job is to lower exam panic: one clear next thing, lots of space.'
        - 'Refuse:'
        - '- A "Good evening" greeting header at the top of the screen'
    - label: → this pass
      lines:
        - '## THIS PASS — 3 screens'
        - '### 1. Today (the core screen)'
        - 'Job: see what''s next, and start it.'
        - '### 2. Block (in progress)'
        - '### 3. Notes import → topic list'
    - label: → check before accepting
      lines:
        - '## CHECK BEFORE ACCEPTING'
        - '- Today opens on the next block, not a greeting or a date strip'
        - '- The accent colour appears only on the current/next block, nowhere else'
        - '- Start block and Mark done sit in the lower third, at least 44pt tall'
install:
  - key: code
    label: Claude Code
    steps:
      - command: /plugin marketplace add KhalerdAmeen/context-labs
      - command: /plugin install context-labs@context-labs
      - "installs the whole kit. then type: `send pass 1 to claude design`"
  - key: app
    label: Claude app
    steps:
      - Settings → Features → Skills → upload `context-labs-handoff.zip`
      - "in a Project, type: `send pass 1 to claude design`"
  - key: other
    label: Other
    steps:
      - open `SKILL.md`
      - paste it as instructions in your tool
      - ask for the handoff prompt in chat
---
