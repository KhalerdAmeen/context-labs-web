---
name: phase-commit-push-workflow
description: "context-labs-web build runs in review-gated phases; commit and push after each phase, never merge to main myself"
metadata:
  node_type: memory
  type: feedback
  originSessionId: 352b43ed-94b6-4ae4-a9c6-e63e1d6cc49c
  modified: 2026-10-21T16:53:02.782Z
---

The context-labs-web site is built in phases (plan: ~/.claude/plans/system-instruction-the-user-has-tidy-clover.md). At the end of each phase: commit ("phase N: …"), push the feature branch, then stop and report for Khalid's review before starting the next phase.

**Why:** Khalid wants a Vercel preview per phase and reviews each one before approving the next. He merges to main himself (after Phase 6).

**How to apply:** never merge or open-and-merge into main unprompted; only open a PR when asked. Push every phase commit to the current feature branch.
