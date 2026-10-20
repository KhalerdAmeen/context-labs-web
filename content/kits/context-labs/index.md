---
type: kit
order: 1
title: Context Labs Kit
desc: Three skills that write your CONTEXT.md, turn it into the right prompt for each tool, and check what comes back.
intro: Scans your app or interviews you, then writes the CONTEXT.md every design and build prompt reads from. Turns it into the right prompt for each tool, then checks what comes back. You answer pop-ups. You never edit a file.
tools: [claude code, claude app, claude design]
works: [claude code, claude app, claude design]
updated: "2026-10"
tryIt: set up context for my app
facts:
  - { k: skills, v: setup · handoff · review }
  - { k: modes, v: new idea · existing app }
  - { k: output, v: CONTEXT.md + prompts }
  - { k: version, v: v0.1.0 }
download: kits/context-labs/files/context-labs-kit.zip
template: skills/setup/files/references/template.md
skills: [setup, handoff, review]
related: [setup, handoff, review]
preview:
  - '## Tokens'
  - '| Accent | #C41E3A | stars, active nav, 1 primary | code (47×) + you |'
  - '## Rules'
  - '- Radius: 8 / 14 / 20 / 28 / full. Nothing else.   [you]'
  - '- Spacing: 4pt base. Screen margin 20.            [code]'
  - '- One primary action per screen.                  [you]'
  - '- Tab bar: 4 items, labels always visible.        [code]'
how:
  - { t: scan, d: "reads your code, theme, screens and docs. or researches your category if you're starting fresh." }
  - { t: ask, d: "pop-up questions built from what it found. click, don't type." }
  - { t: write, d: CONTEXT.md with every line tagged by source. }
  - { t: hand off, d: handoff writes the prompt for the next tool. review checks what comes back. }
see:
  header: claude is asking · 2 questions
  note: options come from your own code, not a template.
  questions:
    - q: I found 3 reds in your code. Which is the accent?
      options:
        - { a: '#C41E3A', b: '— used 47× (buttons, stars)', swatch: '#C41E3A', on: true }
        - { a: '#8B1A1A', b: '— used 12× (badges)', swatch: '#8B1A1A' }
        - { a: '#E63946', b: '— used 3× (looks like a leftover)', swatch: '#E63946' }
        - { a: Other, b: type your own }
    - q: Where should the accent be allowed?
      multi: true
      options:
        - { a: Primary action, on: true }
        - { a: Ratings, on: true }
        - { a: Active nav, on: true }
        - { a: Earned states }
        - { a: Other }
get:
  prompt: make my app look premium
  label: the context.md it writes
  lines:
    - '## Tokens'
    - '| Accent | #C41E3A | stars, active nav, 1 primary | code (47×) + you |'
    - '| Base   | #0D0D0D | background only              | code: theme.ts:4 |'
    - '## Rules'
    - '- Radius: 8 / 14 / 20 / 28 / full. Nothing else.   [you]'
    - '- Touch targets ≥ 44pt.                            [iOS rule]'
    - '## Known issues'
    - '- avatar_url never written. Avatar upload missing. [code: 5 files]'
keep: "after a big change, type: `update my context`. it reads what changed and asks before writing."
install:
  - key: code
    label: Claude Code
    steps:
      - command: /plugin marketplace add KhalerdAmeen/context-labs
      - command: /plugin install context-labs@context-labs
      - "open your project and type: `set up context for my app`"
  - key: app
    label: Claude app
    steps:
      - unzip `context-labs-kit.zip`
      - Settings → Features → Skills → upload each of the three .zip files
      - "in a Project, type: `set up context for my app`"
  - key: other
    label: Other
    steps:
      - open `SKILL.md` in each skill folder
      - paste it as instructions in your tool
      - answer the questions in chat
---
