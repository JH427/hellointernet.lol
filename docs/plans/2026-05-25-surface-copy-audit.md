# hellointernet.lol Surface Copy Audit

Status: draft
Updated: 2026-05-25

## Purpose

Audit the low-context support surfaces and determine which ones need substantive content, which ones can stay redirect/simple utility pages, and what should change next.

Audited files:
- `links/index.html`
- `now/index.html`
- `store/index.html`
- `resume/index.html`

## Summary

### Keep simple utility posture
- `store/`
- `resume/`

These are doing a clear job already: redirecting to canonical destinations. They should be polished, but they do not need deep standalone content.

### Upgrade next
- `links/`
- `now/`

These are currently thin enough to feel unfinished rather than minimal.

## File-by-file notes

### `links/index.html`

Current state:
- has the right general shell
- includes GitHub, email, and root site
- still says “Being curated”
- too sparse to function as a true identity/action router

What it should become:
- concise public switchboard
- one-line purpose statement
- grouped links, not just three rows

Recommended content blocks:
- primary: GitHub, email, root site
- secondary: resume, lab, wiki, signal, now
- optional: one sentence explaining what each surface is

Suggested tone:
- direct
- low-drama
- useful in 10 seconds

Suggested opening copy:
- `Public entry points.`
- `The shortest path to the relevant surface.`

### `now/index.html`

Current state:
- placeholder only
- no date, no focus, no signal of what is active

What it should become:
- a lightweight operational bulletin
- not a blog post
- not a life update page
- a short list of active focus areas and deprioritized items

Minimum required fields:
- last updated date
- current focus
- active builds/workstreams
- paused or deprioritized items
- pointer to root/lab/wiki if relevant

Important constraint:
- do not invent Joshua’s current priorities
- this page needs real operator input or a source-of-truth workflow before publication-quality content can be added

Recommended temporary improvement if no live facts are available:
- replace “Being curated” with honest scaffold copy that says this page tracks current work and will update when the operating loop is wired

### `store/index.html`

Current state:
- immediate redirect to Gumroad
- canonical and redirect behavior are clear
- fallback link exists

Recommendation:
- keep it thin
- optionally improve wording from `Opening store` / `Redirecting to Gumroad` to something slightly cleaner

Suggested copy:
- `Store`
- `Forwarding to the current storefront.`

This is optional, not urgent.

### `resume/index.html`

Current state:
- immediate redirect to canonical resume page
- fallback link exists
- utility behavior is clear

Recommendation:
- keep it thin
- optionally align wording with store redirect language for consistency

Suggested copy:
- `Resume`
- `Forwarding to the canonical resume.`

## Priority order

1. `now/`
2. `links/`
3. optional polish to `store/` and `resume/`

## Agent-management implication

For autonomous upkeep:
- `links/` can be maintained directly by agents once approved public destinations are known
- `now/` should only be updated from an explicit source of truth, not guessed from vibes
- `store/` and `resume/` can stay simple redirect surfaces unless routing changes

## Suggested next step

Create a durable `now` workflow before rewriting `now/index.html` in earnest. Without a real source of truth, the page will either drift or become placeholder theater.