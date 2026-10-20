# Claude Design pass

## Include
- Product: what it is, who it's for, core action (3 lines)
- Direction: feel, references (incl. inspiration folder summary), refused defaults
- Tokens and type, copied from CONTEXT.md
- Design rules, copied from CONTEXT.md
- The screens for this pass, with real content
- States to show
- Check before accepting
- Do not

## Leave out
Stack, file paths, bugs, commands, "rules that have bitten before",
launch details. They distract the designer and pull the output toward
implementation detail.

## Template

```
<PROJECT> — DESIGN PASS <N>: <what this pass covers>

## PREAMBLE (paste with every pass of this project)

### Product
<what it is> · for <who> · core action: <first 10 seconds>

### Direction
Feel: <three words>
References: <each reference + what it contributes>
Refuse: <refused defaults, one per line>

### Tokens
<colour table copied from CONTEXT.md>
Type: <families + roles + scale>
<radii, spacing base, motion style>

### Rules
<design rules copied from CONTEXT.md, one per line>

---

## THIS PASS — <N> screens
For each screen:
### <Screen name>
Job: <what the user does here, one line>
Content (real data):
- <every label, value, name, date that appears>
Notes: <anything specific to this screen>

## SHOW
- <state 1: realistic mid-use state>
- <state 2: empty or first-run, if it exists>
- <light and dark, if the project has both>
- Device: <e.g. iPhone 17 Pro, 402×874>

## CHECK BEFORE ACCEPTING
- <5–8 visual checks from the Rules and Refused defaults>

## DO NOT
- <refused defaults and banned patterns, one per line>
```

## Planning passes
- Pass 1 = the 3 screens that decide the direction. Judge it before
  designing anything else.
- Later passes = one screen group each (e.g. onboarding, settings),
  always with the same preamble.
- A redesign of part of an existing app: the preamble plus the affected
  screens only, and say what must stay unchanged.
