# Autonomous Editorial Loop for hellointernet.lol + fullyautomated.enterprises

Date: 2026-05-26
Status: active operating plan

## Why this exists

Both sites are now being managed by AI agents, so the failure mode is no longer "nothing gets updated." The new failure mode is drift: too many surfaces, inconsistent tone, synthetic filler, or updates landing without a clear standard.

This plan keeps the sites coherent while still letting Rick and Greg operate autonomously.

## Surface decisions made in this pass

### hellointernet.lol
- `contact.hellointernet.lol` should exist as a real action surface.
- `this.hellointernet.lol` should exist as a real explainer for the multi-surface model.
- `scratch.hellointernet.lol` is intentionally deferred; `wiki.hellointernet.lol` remains the canonical public notes surface.
- `ops.hellointernet.lol` is a public boundary page only, not a public runbook dump.
- `artifacts.hellointernet.lol` remains a redirect to `/work/` until `/work/` meaningfully outgrows the root site.

### fullyautomated.enterprises
- treat the site as a publication surface for real bounded experiments, not a product-marketing shell
- every new claim should point at an experiment, method note, artifact, or explicit limitation
- Greg supplies research/context; Rick ships artifacts, updates copy, and maintains structure

## Current quality assessment

### hellointernet.lol
Strong now:
- root homepage visual language
- work/hire/resume utility
- links/now/store coherence
- contact/this scaffolding after this pass

Still thin:
- `lab`: structure is fine, but entries need stronger writeups and clearer "why this matters"
- `signal`: useful shape, but curation quality depends entirely on disciplined pruning
- `wiki`: useful as public memory, but needs a stricter allowlist and fewer low-value fragments

### fullyautomated.enterprises
Strong now:
- methodology anchor
- first real experiment-backed lab entries
- more honest product framing

Still thin:
- homepage can get more specific as real work accumulates
- some older demo-origin content still needs retirement or rewrite
- product pages should graduate only when artifacts make them real

## Weekly loop

### Rick
1. Check both repos for stale or weak copy.
2. Publish one concrete update only if it improves clarity, evidence, or navigation.
3. Verify builds locally.
4. Verify live routes after deploy-significant changes.
5. Update this plan if a surface changes role.

### Greg
1. Produce a compact research/context memo when Rick is about to publish a new experiment or claim.
2. Flag contradictions, overclaims, and missing evidence.
3. Suggest 1-3 worthwhile additions to `signal` or candidate real experiments for FAE.

## Publishing lanes

### Safe to autopublish after build verification
- typo fixes
- navigation fixes
- footer/header consistency
- markdown/content edits that reduce exaggeration
- adding real artifact links
- updating `now`, `signal`, and `wiki` within established editorial rules

### Review-gated
- new public claims about capabilities or business status
- payment/donation/scheduling links
- DNS/hosting changes
- secrets/deploy wiring
- changing the role of a surface
- deleting a public surface

## Editorial rules

### hellointernet.lol
- keep pages sparse, legible, and slightly strange
- do not add a surface unless it has a distinct job
- if a page is unfinished, say so plainly
- prefer routing, evidence, and constraint language over biography copy

### fullyautomated.enterprises
- every page should answer: what was tried, what was learned, what exists now
- avoid startup theater, fake metrics, waitlist posture, and product certainty without artifacts
- if something is still a hypothesis, label it that way

## Next recommended content work

1. strengthen each `lab` entry with outcome + limitation language
2. prune and tighten `signal` so every bullet earns its slot
3. review `wiki` for low-value fragments and public-safety drift
4. publish one more real FAE experiment tied to actual autonomous maintenance or coordination work
5. decide later whether `artifacts` deserves its own surface or should stay a redirect permanently

## Verification commands

```bash
cd /home/joshua/projects/hellointernet-lol && bash scripts/build-porkbun-deploy-tree.sh
cd /home/joshua/projects/fullyautomated-enterprises && npm run build
```

Live checks after deploy-significant changes:
- root + representative inner pages
- `contact`, `this`, `scratch`, `ops`
- `lab`, `signal`, `wiki`, `links`, `now`, `store`
- FAE homepage, methodology, labs, products
