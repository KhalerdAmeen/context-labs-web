---
# placeholder from the Claude Design export (design/EntryPage.dc.html, slug "kit"). Hidden in production.
type: kit
draft: true
order: 5
title: Mobile App Kit
desc: Scans your app or interviews you, then writes the CONTEXT.md every design and build prompt reads from.
intro: Scans your app or interviews you, then writes the CONTEXT.md every design and build prompt reads from. You answer pop-ups. You never edit a file.
tools: [claude code, claude app]
works: [claude code, claude app, claude design]
updated: "2026-10"
tryIt: set up context for my app
facts:
  - { k: time to run, v: ~5 min }
  - { k: questions, v: ~15 clicks }
  - { k: modes, v: new idea · existing app }
  - { k: output, v: CONTEXT.md }
related: [setup, handoff, review]
preview:
  - '## Tokens'
  - '| Accent | #FFC400 | #FFC400 | Exactly one accent; the next / current block fill only | …'
  - '## Rules'
  - '- One accent colour only, used to mark the current/next block [you]'
  - '- Start block stays pinned in the lower third in every Today state… [you]'
  - '- Touch targets at least 44×44pt… [rule]'
  - '- Falling behind: when blocks are missed, show what would move and ask before re-planning… [you]'
how:
  - { t: scan, d: "reads your code, theme, screens and docs. or researches your category if you're starting fresh." }
  - { t: ask, d: "pop-up questions built from what it found. click, don't type." }
  - { t: write, d: CONTEXT.md with every line tagged by source. }
  - { t: hand off, d: loads in every Claude Code session. feeds Claude Design passes. }
see:
  header: claude is asking · 2 questions
  note: options come from what it found, not a template.
  source: setup's questions · options and answers from a real run on Cram, a study planner (test project)
  questions:
    - q: Who is Cram for first?
      options:
        - { a: Exam-season students, b: '— the 2–6 weeks before finals', on: true }
        - { a: All students, b: '— all semester' }
        - { a: Other, b: type your own }
    - q: Which parts of the category default should Cram refuse?
      multi: true
      options:
        - { a: 'Streak flames, mascots and guilt mechanics', on: true }
        - { a: 'Pastel, emoji-coded task cards', on: true }
        - { a: 'A "Good evening" greeting header', on: true }
        - { a: 'The week strip with a "0/3 complete" counter', on: true }
        - { a: Other }
get:
  prompt: set up context for my app
  label: the context.md it writes
  source: from a real run · Cram, a study planner (test project)
  lines:
    - '## Product'
    - "- What it is: an iPhone app that turns a student's lecture notes into a day-by-day study plan running up to their exams [you]"
    - '## Tokens'
    - '| Accent | #FFC400 | #FFC400 | Exactly one accent; the next / current block fill only | …'
    - '## Rules'
    - '- Start block stays pinned in the lower third in every Today state… [you]'
    - '## Decisions log'
    - '- 2026-10-19: Re-planning asks first and shows what moved [you]'
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
      - Settings → Features → Skills → upload the .zip
      - "in a Project, type: `set up context for my app`"
  - key: other
    label: Other
    steps:
      - open `SKILL.md`
      - paste it as instructions in your tool
      - answer the questions in chat
---
