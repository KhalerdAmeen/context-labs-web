# Claude artifact

For a single self-contained page or interactive prototype made in a
Claude chat (a landing page, a clickable prototype of one flow, a tool).

## Include
- Product and Direction sections (short)
- Tokens and type, copied from CONTEXT.md
- The one interaction or flow that matters, described step by step
- Real content
- Constraints: one file, inline CSS and JS, no external assets except
  fonts, works at phone and desktop widths
- Check before accepting

## Leave out
Stack, bugs, commands, build rules, other screens.

## Template

```
Build a single-file <page / prototype> for <project>.

PRODUCT
<what it is> · for <who>

DIRECTION
Feel: <three words> · Refuse: <refused defaults>

TOKENS
<colours, type, radii, spacing copied from CONTEXT.md>

WHAT IT DOES
1. <step>
2. <step>
3. <step>

CONTENT
<real copy and data>

CONSTRAINTS
- One HTML file, inline CSS and JS
- Works at 390px and 1440px wide
- Respects reduced motion

CHECK BEFORE ACCEPTING
- <4–6 visual checks>
```
