# CONTEXT.md template

Use this structure exactly. Delete a subsection only if it truly doesn't
apply (say "n/a" in one word rather than inventing). Keep the whole file
between 150 and 300 lines for an existing project, 80–150 lines in Create
mode (there's no code to describe yet).

Source tags, used on every fact line:
`[code: path]` · `[doc: path]` · `[plan: file]` · `[memory]` · `[you]` · `[research]` · `[rule]`

```markdown
# <Project name> — Context

> Read this before any design or build work on this project.
> Last updated: <YYYY-MM-DD> · Mode: <extract | create | update>

## Product
- What it is: <one sentence> [source]
- Who it's for: <specific people, not "everyone"> [source]
- Core action: <what someone does in the first 10 seconds, daily> [source]
- In scope now: <short list> [source]
- Out of scope: <short list> [source]
- Long docs: <path to PRD / spec, one line each> 

## Direction
- Feel: <three words> [source]
- References: <apps or non-app references and what each contributes> [source]
- Inspiration: <folder path, image count, what the images share in one line> [code: path]
- Refused defaults: <what the category usually does that this won't> [source]

## Design
### Tokens
| Role | Value | Where it's allowed | Source |
|---|---|---|---|
| Background | | | |
| Surface | | | |
| Text | | | |
| Muted | | | |
| Accent | | | |

### Type
- Families: <family — role — reason> [source]
- Scale: <sizes in use> [source]

### Rules
- <rule stated as an instruction, e.g. "Accent on primary action and stars only"> [source]
- <radius set, spacing base, motion style> [source]

### Components that set the look
- <component — what makes it distinctive — path> [source]

## Build
- Stack: <framework + version, backend, payments, analytics> [code: …]
- Structure: <where screens, components, theme live> [code: …]
- Conventions: <naming, state, data fetching> [code: …]

### Commands
- <run / type-check / lint / build / ship, one line each with what it's for> [source]

### Rules that have bitten before
Grouped by area (e.g. Glass, Time, Sync, Data, Release). Each rule is an
instruction plus the reason in a few words.
- <"Always map every column in rows.ts — an omitted column is nulled on upsert"> [source]

### Known issues
- <bugs or gaps found during the scan, with paths> [code: …]

## Launch
- Status: <idea | building | TestFlight/beta | live> [source]
- Promises we can prove: <only real numbers or facts> [source]

## Decisions log
- <YYYY-MM-DD>: <decision> [source]

## Open questions
- <unknowns not worth asking now>
```

In Create mode, Build reads `pending — no code yet` and Launch reads
`Status: idea`.

For mobile apps, add the platform rules that apply from mobile-rules.md as
lines under Design → Rules or Build → Known issues, tagged `[rule]`.
