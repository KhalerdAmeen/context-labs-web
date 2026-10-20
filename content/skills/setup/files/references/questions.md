# Questions

## Contents
1. The rules
2. Building options from findings
3. Extract mode rounds
4. Create mode rounds
5. Update mode
6. Fallback without the question tool

## 1. The rules

- Use the AskUserQuestion tool. Per call: 1–4 questions. Per question:
  2–4 options, a header of 12 characters or fewer, option labels of 1–5
  words, and a one-line description on each option.
- The user can always pick "Other" and type, so never add an "Other"
  option yourself.
- Use multi-select only when choices aren't exclusive ("where may the
  accent appear?").
- Put your recommended option first and add "(Recommended)" to its label
  only when you have evidence for it.
- Never ask what the code or docs answer. If a doc states it, it's a fact
  with a `[doc: …]` tag, not a question.
- 3–5 rounds. Stop when every remaining unknown is minor; list minor ones
  under Open questions in CONTEXT.md instead of asking.

## 2. Building options from findings

Options carry the evidence, so the user decides in one click.

Weak: "What's your accent colour?" → Red / Blue / Green
Strong: "3 reds are used. Which is the accent?" →
- `#C41E3A` — 47 uses: buttons, stars
- `#8B1A1A` — 12 uses: badges
- `#E63946` — 3 uses: looks like a leftover

Weak: "How should the app feel?" → Modern / Clean / Fun
Strong (after reading the PRD): "The PRD says calm, premium, quiet. Keep
that as the direction?" → Yes, exactly / Calm but warmer / It changed

## 3. Extract mode rounds

Pick the rounds that the findings call for; skip any already answered.

**Round 1 — Current state:** which copy of the project is current (if
several), which plans still hold, whether the docs are still true.

**Round 2 — Tensions:** one question per top tension from the scan, each
with the evidence in the question and 2–4 resolutions as options.

**Round 3 — Design rules:** where the accent may appear, how many radii
or font families are allowed, the one rule the user would fire someone
for breaking.

**Round 4 — Direction (never skip in design-heavy projects):** confirm the
feel (quote the doc if one exists), 2–3 reference apps or non-app
references (offer what the inspiration folder suggests as options), and
the category default to refuse.

**Round 5 — Wiring:** load CONTEXT.md in every session (SKILL.md Step 6).

## 4. Create mode rounds

**Round 1 — Who and what:** who exactly (options from research: the
2–3 segments competitors target, plus a narrower one), what they use
today, the core action in the first 10 seconds.

**Round 2 — Feel:** three words (offer 3 sets of three, each a different
direction), references from outside apps (a place, an object, a film, a
magazine).

**Round 3 — Refuse:** multi-select of the category default's features
found in research ("pastel cards", "mascot streaks", "greeting header").

**Round 4 — Stack:** what they'll build with, including "Not sure —
recommend one".

## 5. Update mode

One question per change that affects a decision. Each names the change,
where it is, and 2–3 ways to treat it. Changes that don't affect a
decision (a bug fix, a copy tweak) are logged without asking.

## 6. Fallback without the question tool

Ask the same questions as a numbered list with lettered options:

```
1. 3 reds are used. Which is the accent?
   a) #C41E3A — 47 uses: buttons, stars
   b) #8B1A1A — 12 uses: badges
   c) #E63946 — 3 uses: looks like a leftover
```

Then wait for the answer ("1a, 2c") before writing.
