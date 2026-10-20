---
# placeholder from the Claude Design export. Hidden in production.
type: skill
draft: true
order: 7
title: "Deterministic Motion"
desc: "GSAP timelines that scrub, seek and loop without drifting. For effects that must look the same every frame."
intro: "GSAP timelines that scrub, seek and loop without drifting. For effects that must look the same every frame."
tools: [claude code]
works: [claude code]
updated: "2026-10"
tryIt: "make this animation deterministic"
preview:
  - "timeline.pause().seek(t) // finite, seek-safe"
  - "no Math.random() in render"
  - "duration: fixed, never derived from DOM"
  - "repeat: -1 only with a fixed cycle length"
  - "ease: named, never computed per frame"
  - "seed: passed in, logged with the export"
  - "test: seek(0) → seek(end) → seek(0)"
---
