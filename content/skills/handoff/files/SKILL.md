---
name: context-labs-handoff
description: Writes a ready-to-paste prompt for the next tool from the project's CONTEXT.md, carrying only what that tool needs — a Claude Design pass, a Claude Code plan-mode build prompt, or a Claude artifact. Use when the user says "send this to claude design", "next design pass", "write the plan mode prompt", "hand this off to claude code", "prompt for an artifact", or when an approved design needs building.
allowed-tools:
  - Read
  - Grep
  - Glob
  - Write
  - AskUserQuestion
---

# Context Labs: Handoff

Every tool in the loop needs a different slice of the same project.
Claude Design needs the direction, tokens and real content, never the
bugs or the stack. Claude Code needs the approved design, the scope and
the hard rules, never another round of exploration. Dumping everything
into every tool is the most common reason output drifts. This skill
writes one prompt shaped for one tool, from CONTEXT.md.

## References

| File | Read before |
|---|---|
| [design.md](references/design.md) | a Claude Design pass |
| [plan-mode.md](references/plan-mode.md) | a Claude Code build |
| [artifact.md](references/artifact.md) | a Claude artifact |

## Step 1: Read the context

Read `CONTEXT.md` in the project root. If it doesn't exist, stop and say:
"There's no CONTEXT.md yet. Run: set up context for this app — then I can
write the handoff." Don't write a prompt from guesses.

If the user attached screenshots or a design export, look at them: they
are the approved design for a build handoff, or the current state for a
design handoff.

## Step 2: Target and scope

- **Target** from the user's words: Claude Design, Claude Code (plan
  mode), or artifact. If unclear, ask with the question tool.
- **Scope:** which screens, flow or feature. If the user didn't say, ask
  with options built from CONTEXT.md (screens listed under Product or
  Build, open questions, known issues). One handoff = one coherent chunk:
  at most 3–4 screens for a design pass, one feature for a build.
- For a first design pass on a project, recommend the 3 screens that
  decide the direction (the core screen, one detail screen, one creation
  or list screen) before everything else.

## Step 3: Write the prompt

Follow the reference for the target exactly. Rules for every target:

- **Only what this tool needs.** Each reference lists what to include and
  what to leave out. Leaving things out is the point.
- **Copy, don't paraphrase,** the decisions: token values, rules and
  refused defaults go in as written in CONTEXT.md.
- **Real content.** Use real names, data and copy from CONTEXT.md. When a
  screen needs content CONTEXT.md doesn't have, write believable sample
  content and mark it `(sample)` in the prompt.
- **Checks the user can see.** The "check before accepting" list holds
  5–8 items a person can verify by looking at the result, taken from the
  Rules and Refused defaults.
- **No secrets,** keys or internal URLs.
- **Tight.** A design pass prompt is usually 60–150 lines; a plan-mode
  prompt 30–80.

## Step 4: Deliver

1. Show the prompt in one fenced code block, ready to copy.
2. Under it, two or three lines on how to use it: where to paste it, and
   for Claude Code, "switch to plan mode first (Shift+Tab)".
3. Save a copy to `.context-labs/handoffs/<YYYY-MM-DD>-<target>-<slug>.md`
   so the project keeps a history of what was sent where.
4. Say what happens next: for design, "send me screenshots of the result
   and I'll review them against CONTEXT.md"; for a build, "after it's
   built, say: update my context".

## Hard rules

| Never | Instead |
|---|---|
| Write a prompt without CONTEXT.md | Ask the user to run setup first |
| Send bugs, stack or file paths to Claude Design | Direction, tokens, rules, real content only |
| Ask Claude Code to explore or redesign | Approved design + scope + "plan first" |
| More than 4 screens in one design pass | Split into passes; pass 1 decides direction |
| Paraphrase token values or rules | Copy them as written in CONTEXT.md |
| Lorem ipsum or "Title here" | Real content, or believable content marked (sample) |
| Checks nobody can verify by looking | Concrete visual checks from the Rules |
