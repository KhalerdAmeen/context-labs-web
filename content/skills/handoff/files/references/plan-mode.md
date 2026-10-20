# Claude Code plan-mode build

## Include
- A pointer to CONTEXT.md (it already loads via CLAUDE.md; say "read it first" anyway)
- The goal in one sentence
- Scope: what to build, and what is explicitly out of scope
- The approved design: screenshot or export paths, and "approved — don't re-decide"
- The constraints that apply to this area: hard rules + the relevant
  "rules that have bitten before" from CONTEXT.md (only the relevant ones)
- Acceptance criteria: behaviour + visual
- How to verify: the project's own commands from CONTEXT.md (type-check,
  lint, tests, simulator/browser screenshots)
- "Plan first. Don't write code until I approve."
- "After building, run: update my context"

## Leave out
Design exploration, alternative directions, mood words, the full token
table (the code already has the tokens — name the token file instead).

## Template

```
Read CONTEXT.md first.

GOAL
<one sentence>

SCOPE
Build:
- <screen / component / behaviour>
Out of scope:
- <what must not change>

DESIGN (approved — don't re-decide)
- <paths to screenshots / export, or a short description of each screen>

CONSTRAINTS
- <hard rules that apply>
- <relevant rules that have bitten before>
- Tokens only from <theme file>; no raw colours or spacing.

ACCEPTANCE
- <behaviour that must work>
- <visual result that must match>
- <states: empty, loading, error, light/dark if applicable>

VERIFY
- <type-check command> and <lint command> clean
- <tests, if any>
- Screenshots of <screens> in <simulator/browser>, <themes>

PLAN FIRST. Don't write code until I approve the plan. Flag anything in
the design that conflicts with the code, the data model or CONTEXT.md.
After building, run: update my context
```
