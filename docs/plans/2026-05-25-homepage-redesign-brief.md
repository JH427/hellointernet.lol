# hellointernet.lol Homepage Redesign Brief

> For Hermes: this is a design brief, not implementation approval. Do not replace the homepage without explicit go-ahead. Use this brief to keep future agent work coherent.

Status: draft
Updated: 2026-05-25
Recommended direction: Option A — Ambient Geometry Field

## Problem

The current homepage has technical atmosphere and motion, but it behaves like a sitemap visualizer instead of a landing page.

Current issues observed in `public-root/src/pages/index.astro`:
- the page is effectively canvas-only
- navigation and footer are hidden
- there is no readable foreground message in the DOM
- the user has to infer what the site is and where to go
- the literal node graph makes the information architecture feel over-explained and slightly game-like

The concept is pointed in the right direction — dark, spatial, technical, alive — but it needs to feel more like a strong front door and less like a route diagram.

## Design goal

Keep the mood:
- dark
- technical
- spatial
- animated
- slightly weird

Change the interaction model:
- abstract background, not explicit sitemap
- clear foreground copy
- obvious paths into the site
- strong consistency with `work`, `hire`, `resume`, `lab`, `signal`, `wiki`, `links`, and `now`

## Non-negotiables

- Keep the command-glass visual system as the baseline language.
- Preserve dark palette, restrained accent color, and mono/sans typography.
- Homepage must include real DOM content visible without relying on WebGL.
- Homepage must remain useful if JS fails or WebGL is unavailable.
- Primary routes must remain obvious: `work`, `hire`, `lab`, `signal`, `wiki`.
- Visual language must feel consistent with every subdomain and route.
- Do not make the homepage look like a startup hero, SaaS landing page, or portfolio template.

## Recommended information hierarchy

Above the fold:
1. short identity line
2. one-sentence positioning
3. 4-6 route cards
4. optional small status strip
5. ambient geometric 3D background behind all of it

Suggested content shape:
- eyebrow: `hellointernet.lol`
- headline: concise, declarative, slightly strange
- subhead: what this place is in one sentence
- route cards: `work`, `hire`, `lab`, `signal`, `wiki`, `links`
- optional meta strip: `current focus`, `recent artifact`, or `managed by AI agents`

## Visual options

### Option A — Ambient Geometry Field

Recommendation: strongest fit.

Concept:
- Replace the literal graph with a drifting field of abstract 3D geometry.
- Use repeated simple forms: wireframe polyhedra, line lattices, floating planes, sparse particles.
- Motion should be slow and atmospheric, not interactive-first.
- Foreground content sits on top in a left-anchored or center-left composition.

Why it fits:
- keeps the depth and technical energy
- removes the “site map as homepage” problem
- feels more intentional and editorial
- gives subdomains a visual anchor without forcing all of them into 3D

Implementation notes:
- consider low-density wireframe tetrahedra/octahedra plus faint connecting lines
- subtle parallax from pointer movement is acceptable
- full orbit controls are not recommended
- use fog, blur, depth falloff, and sparse accent highlights rather than busy object counts

Risk:
- can become generic sci-fi if geometry is too symmetrical or too glossy

### Option B — Monolith + Signal Planes

Concept:
- One dominant central abstract structure, like a dark shard/monolith or segmented column, surrounded by thin floating annotation planes.
- The background acts like a machine/object under observation rather than a field.

Why it fits:
- more iconic and memorable than the node graph
- gives the site a stronger silhouette
- works well with minimal copy

Risk:
- easier to over-style
- could feel too “art project” if the content layer is too sparse

### Option C — Data Weather / Topographic Volume

Concept:
- Use layered point clouds, contour ribbons, or volumetric bands that move like a synthetic weather system.
- The motion should feel like scanning, interference, or topographic computation.

Why it fits:
- more abstract than graph nodes
- can feel computational without being literal
- good bridge between personal site and experimental lab identity

Risk:
- easiest to make visually muddy
- weaker affordance for route cards unless the layout is disciplined

## Recommendation

Choose Option A.

It best preserves what is working in the current direction:
- depth
- motion
- technical atmosphere
- ambiguity without confusion

It also gives the cleanest path to a durable cross-site system:
- homepage uses animated geometry
- subpages use static glass/command surfaces derived from the same palette and spatial cues
- lab/signal/wiki inherit the same “instrument panel in dark space” feel without needing heavy animation

## Foreground copy direction

Tone targets:
- concise
- severe but not hostile
- intelligent without performance
- specific enough to orient, not verbose enough to explain everything

Copy should feel adjacent to `hire.astro` and `work/index.astro`.

Suggested copy directions to test:

Direction 1:
- headline: `Systems, artifacts, and controlled weirdness.`
- subhead: `A personal surface for work, experiments, notes, and live signals.`

Direction 2:
- headline: `Proof over posture.`
- subhead: `Work, experiments, and public traces from an ongoing systems practice.`

Direction 3:
- headline: `Built things. Strange tools. Real constraints.`
- subhead: `A dark little network of artifacts, experiments, references, and current work.`

Recommendation: start from Direction 2 because it matches the strongest existing line on `/work`.

## Route-card structure

Homepage route cards should not just be plain nav links. Each should have:
- label
- one short descriptor
- clear destination

Recommended set:
- `work` — artifacts and proof
- `hire` — scope, fit, contact
- `lab` — prototypes and experiments
- `signal` — curated inputs and references
- `wiki` — notes and knowledge surface
- `links` — public identity router

Optional secondary row:
- `resume`
- `now`

## Layout recommendation

Desktop:
- foreground content block anchored left or center-left
- 50–60% width max for content region
- route cards in two rows or dense single column
- background geometry occupying full viewport

Mobile:
- collapse to static hero + stacked route cards
- reduce or simplify animation aggressively
- no tiny hover-dependent behaviors

## Technical recommendations

Target file:
- `public-root/src/pages/index.astro`

Likely supporting touchpoints:
- `public-root/src/layouts/BaseLayout.astro`
- `public-root/public/command-glass.css` or equivalent shared stylesheets/assets

Implementation posture:
- keep WebGL optional enhancement
- retain meaningful semantic HTML in the foreground
- do not hide nav/footer unless the replacement fully covers their role
- prefer subtle pointer-reactive motion over free-orbit controls
- treat performance as part of design quality

## Consistency rules for all surfaces

To keep subdomains aligned with the homepage, every surface should share:
- the same base palette
- the same font stack
- the same border and panel language
- the same restraint around accent colors
- the same terse microcopy style

Surface-specific expressions:
- `work` = evidence cards
- `hire` = direct service filter
- `lab` = experiment index
- `signal` = curated feed
- `wiki` = notes system
- `links` = command palette / identity switchboard
- `now` = current state bulletin

## Anti-patterns to avoid

- literal 3D sitemap as the main concept
- a fake startup hero with CTA buttons
- glossy neon cyberpunk styling
- over-dense particle effects
- motion that competes with reading
- hiding all navigation without replacing it with a readable structure
- abstract visuals so dominant that the page stops saying anything

## Approval threshold before implementation

Safe to implement without extra strategy work only after these decisions are confirmed:
1. Option A is accepted
2. chosen headline/subhead direction is accepted
3. route-card set is accepted
4. whether the homepage keeps a small `now`/status strip is accepted

## Suggested next step

Produce 2-3 static mockup variants from Option A before touching the live homepage implementation.