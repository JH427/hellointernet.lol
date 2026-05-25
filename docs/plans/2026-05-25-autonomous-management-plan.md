# hellointernet.lol Autonomous Management Plan

Status: active
Updated: 2026-05-25

## What changed today

- Canonical source repo is now `/home/joshua/projects/hellointernet-lol`.
- Previous artifact-style checkout was preserved at `/home/joshua/projects/hellointernet-lol-artifact-checkout-20260525-150149`.
- Canonical source repo is the real multi-surface source tree (`public-root/`, `lab/`, `notes/`, `signal/`, `links/`, `now/`, `resume/`, `store/`).
- All Astro surfaces build successfully from the canonical source repo.
- Footer wording was normalized to `Managed by AI Agents | Fully Automated Enterprises LLC 2026`.

## Editorial role of each surface

- `public-root/` = personal landing surface, work, hire, resume, positioning
- `lab/` = experiments and prototypes
- `notes/` = public-safe wiki projection / concise notes
- `signal/` = curated inputs and references
- `links/` = public identity/action router
- `now/` = current focus snapshot
- `store/` = commerce redirect
- `resume/` = utility/static surface only if still needed; canonical public resume content should stay in `public-root/src/pages/resume.astro`

## Near-term priorities

### 1. Homepage redesign brief

Do not keep iterating the current sitemap-style 3D graph as the main concept.

Target direction:
- preserve depth, motion, dark palette, and technical atmosphere
- replace explicit route graph with a more abstract geometric 3D field
- add readable foreground content in the DOM
- keep primary entry points visible: `work`, `hire`, `lab`, `signal`, `wiki`

Recommended structure:
- short headline
- one-sentence positioning
- 4-6 route cards
- optional current-focus strip
- ambient abstract 3D background, not interactive sitemap as the sole interface

### 2. Finish placeholder surfaces

`links/` and `now/` should be upgraded from placeholder copy first.

Minimum content for `links/`:
- GitHub
- email
- root site
- resume
- any approved public profiles

Minimum content for `now/`:
- what Joshua is focused on
- what is actively being built
- what is paused/deprioritized
- last updated date

### 3. Deepen living surfaces

- expand `signal` with real curated entries
- expand `notes` with short, public-safe notes
- expand `lab` with real experiment/prototype deltas
- expand `work` artifacts with more context and proof

## Operating rules for agent management

Safe autonomous lanes:
- copy edits to existing surface content
- new markdown/content entries for `lab`, `notes`, `signal`
- link curation on `links/`
- `now` updates
- footer wording / low-risk consistency work
- build verification and deploy-tree validation

Review-gated lanes:
- homepage design replacement
- navigation model changes
- new public claims about work or products
- legal/biographical positioning
- DNS/hosting/deploy strategy changes

## Verification commands

```bash
cd /home/joshua/projects/hellointernet-lol
for surface in public-root lab notes signal; do
  (cd "$surface" && npm ci && npm run build)
done
for surface in links now resume store; do
  test -f "$surface/index.html"
done
```

## Next implementation steps

1. Write a concrete homepage redesign brief with 2-3 visual options.
2. Replace placeholder `links/` content with approved real destinations.
3. Replace placeholder `now/` content with current-state copy.
4. Audit `signal/` and `notes/` for thin/placeholder entries and expand them.
5. Rebuild and verify live routes after each deploy-significant change.
