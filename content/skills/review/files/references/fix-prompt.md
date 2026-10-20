# Fix prompt

Narrow on purpose. A fix prompt that re-describes the whole design makes
the tool redesign things that were already right.

## Template — Claude Design

```
Round <n> fixes for <pass / screens>. Change ONLY these. Keep everything
else exactly as it is.

1. <screen> — <what's wrong, in one line> → <the exact change>
2. ...

KEEP EXACTLY:
- <the things that work, named specifically>

Then re-check:
- <the failed checks, restated as checks>
```

## Template — Claude Code

```
Fix these in <files / screens>. Don't change anything else.

1. <screen> — <what's wrong> → <the exact change> (rule: <CONTEXT.md rule>)
2. ...

Keep: <what works>
Verify: <type-check + lint commands>, then screenshots of <screens>,
<themes>.
Plan first if any fix touches more than <2> files.
```

## Writing each fix
- Name the screen and the element.
- Say the change as a value where possible ("padding 14px", "accent only
  on the next block", "countdown 64pt") rather than an adjective.
- Tie it to the rule it restores.
- One line per fix. If a fix needs a paragraph, it's a direction
  question: ask the user instead.
