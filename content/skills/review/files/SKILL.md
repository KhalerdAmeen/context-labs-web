---
name: context-labs-review
description: Reviews screenshots of a design or build against the project's CONTEXT.md and the latest handoff's checks, reports each check as pass or fail with evidence, asks the user's taste where rules can't decide, writes a narrow fix prompt for the tool that made it, and logs approved decisions back into CONTEXT.md. Use when the user shares screenshots and says "review these", "check this against my context", "is this on brand", "what's wrong with this design", or after a Claude Design pass or a build.
allowed-tools:
  - Read
  - Grep
  - Glob
  - Write
  - AskUserQuestion
---

# Context Labs: Review

A design pass or a build is only as good as the check after it. Most
people eyeball the result, say "make it better", and the next round
changes things that were already right. This skill checks the result
against what the project already decided, names exactly what failed with
evidence, protects what works, and turns the failures into one narrow fix
prompt.

## References

| File | Read before |
|---|---|
| [tells.md](references/tells.md) | Step 3 (the common signs of generated UI) |
| [fix-prompt.md](references/fix-prompt.md) | Step 6 |

## Step 1: Gather

- Read `CONTEXT.md`. If it doesn't exist, say so and suggest running
  setup first; you can still review against tells.md alone if the user
  wants.
- Read the newest file in `.context-labs/handoffs/` if one exists: its
  "check before accepting" list and its scope are what this result was
  asked to do.
- Find the images: attached to the message, or in a folder the user
  names. If there are none, ask for them.

## Step 2: Look properly

Open every image at full size, one by one. Name each screen and state
you see ("Today — behind state, light"). Don't review from a summary or a
contact sheet.

## Step 3: Check

Run four sets of checks, in this order:

1. **The handoff's checks**, if there was a handoff.
2. **CONTEXT.md rules and refused defaults.**
3. **Common tells** from [tells.md](references/tells.md). CONTEXT.md wins
   when they conflict (if the project deliberately keeps something on
   that list, it passes).
4. **Content:** real or believable data, no placeholders, nothing clipped.

Every check gets ✓, ✕ or ? (can't tell from the images). Every ✕ gets
evidence: which screen, which element, what you see, and the rule it
breaks. "Accent appears on 3 elements on Today (next block, Start
button, tab icon); rule: one accent, on the current block only."

Separate two kinds of failures:
- **Defects:** clipping, contrast, overlap, touch targets, safe areas,
  inconsistent spacing. Objective; always fix.
- **Direction:** taste, hierarchy, feel. Needs the user.

## Step 4: Report

One short message:

```
Review — <what was reviewed> (<n> screens)

Works (keep):
- <2–4 specific things that are right and must not change>

Fails:
| # | Check | Screen | Evidence | Kind |
|---|---|---|---|---|
| 1 | ... | ... | ... | defect / direction |

Can't tell: <checks marked ?>
```

## Step 5: Ask

With the question tool, one or two rounds, only where rules can't decide:

- "Is this the direction?" (approve / approve with fixes / try again),
  always asked after a first design pass.
- Real taste choices the images raise, with the options drawn from the
  images ("Keep the condensed numerals for countdowns, or switch to the
  regular width?").
- Which failures to fix now, if there are many (multi-select, defects
  pre-selected).

## Step 6: Write the fix prompt

Follow [fix-prompt.md](references/fix-prompt.md). Target the tool that
made the result (Claude Design for a design pass, Claude Code for a
build). The prompt changes only what failed, lists what must stay exactly
as it is, and repeats the checks. Never slip new ideas into a fix prompt
unless the user asked for them. At most 8 fixes per round, defects first.

## Step 7: Save decisions (ask first)

If the user approved something, ask with the question tool whether to
record it in CONTEXT.md, then edit in place:

- An approved palette or type scale → Tokens / Type (fills any
  "propose" placeholders), tagged `[you]` + `[design: pass N]`.
- An approved direction or rule → Rules, and a dated line in the
  Decisions log.
- Update `Last updated`. Leave every other section untouched.

## Step 8: Save the review

Write the report and the fix prompt to
`.context-labs/reviews/<YYYY-MM-DD>-<slug>.md`, then tell the user: paste
the fix prompt into <tool>, and send the new screenshots for round 2.
Two to four rounds is normal; stop when every defect passes and the user
approves the direction.

## Hard rules

| Never | Instead |
|---|---|
| Review from memory or a summary | Open every image at full size |
| A ✕ without evidence | Screen + element + what you see + the rule |
| "Make it more premium" | Name the exact change |
| New ideas in a fix prompt | Only what failed, unless the user asks |
| Mark it passing with a defect left | Defects always fail the round |
| Edit CONTEXT.md without asking | Ask, then edit only what was approved |
| Overrule CONTEXT.md with tells.md | The project's own decisions win |
