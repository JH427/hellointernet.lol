# Passage — distant ASCII exterior / remote records connection

The root imports this project-owned authoring directory directly. `aperture` remains in paths to avoid import churn. Latest brief: **more distant, cold and space-like**. This supersedes the earlier close, busy green/amber terminal composition.

## Composition

- Pull the full formation back into a small off-center silhouette in a vast black field. No cropped near slabs, foreground debris, viewport frame, oversized masthead, glowing panel or threatening headline.
- Cold neutral/icy grey-white text; no green/amber phosphor or blue neon. A small lower-right connection has a single top rule rather than a boxed dashboard. Its actual input/output remain readable.
- Mobile gets separate camera framing and full-size 12px glyphs, 12px output and a 16px native command input; it is not a shrunken desktop UI.
- Twenty-seven fixed authored points at three remote depths, with slow differential drift and no random twinkle. No near ASCII debris.

## Real Anatomy and character compositing

Unmodified installed `kit/iso-kit.mjs`, `kit/audit.mjs`, `kit/lathe.mjs`, `kit/tube.mjs` (MIT, Ryan / wheresryan22; `kit/LICENSE.txt`) retain exact hashes checked by `tests/aperture-model.mjs`.

`model.mjs` still builds the same 64 true Anatomy slabs using `slabOf`, `sideSeam`, `iso` and `depthOf`: two 24-part strata and sixteen further fragments. The historical `near.*` source identifiers are retained; they are now viewed from far away. The source model and its settled depth keys are unchanged by the distance revision. Directory opening slightly separates the two groups within the audited interval.

`characters.mjs` directly scan-converts the kit M/L/Z face polygons into ASCII cells. Facing chooses density and edges choose directional glyphs. Filled faces erase background points. `layout` supplies the pulled-back desktop and phone camera; its optional zoom produces a centered detail for `map` from the very same geometry. `space.mjs` seeds the point buffer before solids, preventing stars leaking through their faces. There is no image conversion, WebGL or drawing canvas; a tiny canvas only measures font cell width.

## Audit scope

`A.settle` generates `order.json`, consumed by static and live rendering, from the 64 true slabs and five depth poses. Exact AABB collision checking samples 201 drift poses. Diagnostics stay outside public/build trees. Suspended fictional fragments are explicitly marked `ground` to opt out of physical support-chain proof. Support-zero does **not** certify buildable architecture. True coverage, depth and collision checks remain active. Source line checks certify source SVG seam endpoints, not character-cell junctions or every continuous animation frame.

At remote scale, individual thin terraces collapse into grouped stepped contours. This is deliberately ambiguous architecture, not a detailed spacecraft illustration. The geometry audit does not certify artistic success.

## Working terminal and access

`terminal.mjs` is a pure allowlisted parser: no shell, eval, arbitrary URLs, markup interpretation, machine telemetry or external data. Native input and `textContent` output.

- `help`, `?`: available commands.
- `work`, `notes`, `about`, `contact`: existing site routes, including forgiving case/whitespace and `OPEN /work/` / `cd work` forms.
- `dir`, `ls`, `directory`: native directory.
- `inspect`: truthful model facts, explicitly fictional setting.
- `map`: real centered 60×20 source cross-section.
- `log`: explicitly fictional recovered notice.
- `hold`, `pause`, `resume`, `continue`: exterior controls.
- `clear`: clears display only.

Native caret editing, input-scoped 32-command history with draft retention, maximum six output blocks. Touch shortcuts and real directory anchors avoid command memorization. Escape restores the actual opener. No-JS has static ASCII and native disclosure/navigation; command controls are hidden and the fallback explanation is fully visible. No boot delay, puzzle, flashing, autoplay audio or copied film branding.

## Motion and measurement

One foreground timer attempts a scene render at most four times per second (250ms plus work), not a 60Hz draw loop. Identical grids do not rewrite the DOM. `data-frame` counts render attempts, `data-writes` counts changed-grid text writes, and draw-duration attributes report actual cumulative/max work. Browser tests independently check the write counter with MutationObserver, actual changed glyph text over six seconds, and clock/render suspension under Hold, initial/live reduced motion, hidden tabs and offscreen state. Resuming does not include hidden elapsed time.

A separate faint, finite 2.2-second read scan is confined to the connection. It pauses hidden/offscreen/Hold and is disabled under reduced motion. No perpetual CSS animation.

Final local sample: 24 render attempts / 14 actual DOM writes / 47.9ms draw work over six seconds; max observed draw 3.4ms. These are software Chromium observations, not hardware-wide performance guarantees.

## Reproduce from repository root

```sh
node authoring/aperture/audit.mjs --audit
node tests/aperture-model.mjs
node tests/passage-terminal.mjs
SHARP_IGNORE_GLOBAL_LIBVIPS=1 bash scripts/build-porkbun-deploy-tree.sh
node tests/built-output.mjs
node tests/built-output.mjs .porkbun-deploy
node tests/browser-smoke.mjs .porkbun-deploy
SCREENSHOT_DIR=docs/review/passage-distant node tests/entrance-browser.mjs .porkbun-deploy
python3 tests/check-links.py .porkbun-deploy
```

Installed Anatomy `scripts/lines.mjs` checks `output/source.html` and `output/source-open.html`. Screenshots/logs: `docs/review/passage-distant/`. Full results: `docs/plans/2026-10-15-passage-distant-verification.md`.

## Recovery / scope

`docs/archive/passage-moving/` preserves the preceding close moving scene's page, CSS, JS and model/renderer/space/parser/audit/order outside public output. Earlier `character-aperture`, `interval` and `passage-static` archives remain intact. No reset, dependency/lockfile change, commit, push, publication or deployment. Deeper pages and the pre-existing Contact assembly fix are unchanged.
