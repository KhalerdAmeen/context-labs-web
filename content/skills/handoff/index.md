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
preview:
  - '[PREAMBLE — Product, Direction, Tokens, Rules]'
  - '[THIS PASS — 3 screens]'
  - '[CHECK BEFORE ACCEPTING — 7 rules]'
  - ''
  - 'target: claude design'
  - 'pass: 1 of 6'
  - 'preamble: repeated verbatim every pass'
triggers:
  - send this to claude design
  - write the plan mode prompt
  - hand this off to claude code
examples:
  title: one context, three prompts
  note: what each tool doesn't need is left out on purpose.
  panels:
    - label: → claude design
      lines:
        - '[PREAMBLE — Product, Direction, Tokens, Rules]'
        - '[THIS PASS — 3 screens]'
        - '[CHECK BEFORE ACCEPTING — 7 rules]'
        - '[DO NOT — pastel cards, greeting header]'
    - label: → claude code (plan mode)
      lines:
        - Read CONTEXT.md first.
        - 'Build: Today, Add lecture, Plan detail.'
        - "PLAN FIRST. Don't write code until I approve."
        - Flag conflicts with the stack.
    - label: → artifact
      lines:
        - Product + Design sections
        - single file, inline CSS + JS
        - the one interaction that matters
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
