# Where to look

## Contents
1. Order of the scan
2. Existing context (docs, plans, handoffs)
3. Stack and surface, per framework
4. Design facts: how to count them
5. Tensions worth asking about

## 1. Order of the scan

1. Existing context first (section 2). It tells you what the team already
   decided, so the code scan can check it instead of guessing.
2. Stack and surface (section 3).
3. Design facts (section 4).
4. Compare docs against code (section 5).

Skip `node_modules/`, `Pods/`, `build/`, `dist/`, `.next/`, `.expo/`,
`ios/` and `android/` generated folders, lockfiles and binary assets.

## 2. Existing context

Look for, and note the path of each:

| What | Typical places |
|---|---|
| Agent instructions | `CLAUDE.md`, `AGENTS.md`, `.cursor/rules/`, `.github/copilot-instructions.md` |
| Product docs | `README.md`, `*PRD*.md`, `docs/`, `Md/`, `notes/`, `spec*.md` |
| Design handoffs | folders named `design*`, `handoff*`, `*.dc.html`, Figma links inside docs |
| Plans and history | `.context/plans/`, `plans/`, `.claude/`, `TODO*.md`, `todos.md`, changelogs |
| Inspiration | folders named `Inspo`, `inspiration`, `references`, `moodboard` (count files; don't open images unless asked) |
| Tech notes | `*tech-stack*.md`, `ARCHITECTURE.md`, `SETUP.md` |

Then check what CLAUDE.md actually loads. `@path` lines import files; a
CLAUDE.md that only imports a short AGENTS.md means none of the docs above
reach new sessions. Report this plainly: it is often the single biggest
finding.

**Plans:** read titles and the first lines of each. Sort into still-true
decisions (keep), finished work (summarise as one line), and superseded
plans (ignore, but list so the user can confirm). Newest wins when two
plans disagree; cite both in the question.

## 3. Stack and surface

| Stack | Read | Screens / routes |
|---|---|---|
| Expo / React Native | `package.json`, `app.json` or `app.config.*`, `eas.json` | `app/` or `src/app/` (Expo Router: each `.tsx` is a route; `_layout` files are structure) |
| Next.js | `package.json`, `next.config.*` | `app/**/page.tsx`, `pages/**` |
| SwiftUI | `*.xcodeproj`, `Package.swift`, `Info.plist` | files ending in `View.swift`, `@main` App file |
| Flutter | `pubspec.yaml` | `lib/**/screens/`, `lib/**/pages/`, router config |
| Plain web | `index.html`, `vite.config.*` | HTML files, router config |

From dependencies, name only what shapes decisions: backend (Supabase,
Firebase), payments (RevenueCat, Stripe), analytics (PostHog), error
tracking (Sentry), state (Zustand, Redux), UI kit, animation library.

## 4. Design facts

Find the theme first: `theme/`, `tokens.*`, `colors.*`, `constants/`,
`tailwind.config.*`, `global.css`, Swift `Assets.xcassets` colour sets,
Flutter `ThemeData`.

Then count usage across the source folder (not the theme file alone):

- **Colours:** grep for `#[0-9A-Fa-f]{6}\b` and `rgba?\(`. Report the count
  of unique values and the top values by frequency with where they're used.
  Many unique values with few uses each usually means drift.
- **Fonts:** grep for font family names and imported font packages. More
  installed families than used ones is a tension (or a feature, such as a
  user-selectable font: check for a settings screen before assuming).
- **Radii, spacing:** grep `borderRadius`, `rounded-`, `cornerRadius`,
  `padding`/`gap` values. Count distinct values.
- **Components:** list shared components folders and the 5–10 most used.

Numbers make better questions than adjectives: "45 unique hex values, top
3 are…" not "a lot of colours".

## 5. Tensions worth asking about

- A doc rule the code breaks ("color used tiny" vs 45 hex values).
- A field read in several places and written nowhere.
- A feature in the PRD with no screen, or a screen in no doc.
- Installed packages or fonts that seem unused.
- Placeholder names left in config (`"name": "scaffold"`).
- Plans that contradict each other or the code.
- Several copies of the project (git worktrees) where the newest one isn't
  obvious: ask which is current.

Each tension becomes one question with the evidence in it.
