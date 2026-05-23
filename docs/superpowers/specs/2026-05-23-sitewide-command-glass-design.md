# Sitewide Gruvbox Command Glass Design

Date: 2026-05-23
Status: Approved design direction, pending implementation plan

## Goal

Update `hellointernet.lol` so every public surface shares one coherent Gruvbox Command Glass shell.

The site should feel like a single personal operating console: warm terminal intelligence behind glass command surfaces. It should stay personal, static-first, and artifact-oriented. It should not become generic SaaS marketing, corporate branding, cyberpunk HUD theater, or a single monolithic app.

## Scope

Included surfaces:

- `public-root/` for `hellointernet.lol`
- `lab/` for `lab.hellointernet.lol`
- `notes/` for `wiki.hellointernet.lol`
- `signal/` for `signal.hellointernet.lol`
- Static utility surfaces: `links/`, `now/`, `resume/`, `store/`

Out of scope for this pass:

- Merging surfaces into one Astro app
- Changing Porkbun, DNS, GitHub Actions, or deploy-branch architecture
- Adding new dependencies unless existing tooling requires it
- Rewriting site positioning, resume history, or artifact content beyond small design-supporting labels
- Building new optional subdomains such as `contact`, `this`, `ops`, or `scratch`; those should be planned after this design-system pass

## Design Direction

Use one uniform command shell across all public surfaces.

The selected direction is stricter than role-specific theming. Every surface should look like a route inside the same operator environment. Surface identity comes from page labels, navigation, content, and status/meta rows, not separate color themes or layout families.

## Visual System

Use the LLM Wiki Gruvbox Command Glass design contract:

- Background: near black and warm, primarily `#0B0C0B` and `#11120F`
- Text: Gruvbox cream and muted neutrals, primarily `#EBDBB2`, `#D5C4A1`, and `#928374`
- Accents: amber `#FABD2F`, orange `#FE8019`, green `#B8BB26`, aqua `#8EC07C`, purple `#D3869B`, red `#FB4934`, blue `#83A598`
- Surfaces: glass-like dark panels with thin warm borders and restrained blur
- Typography: readable sans-serif for body, IBM Plex Mono or equivalent for labels, status rows, IDs, terminal blocks, and shell-like controls
- Motion: minimal hover/focus transitions only; no large movement, spinning, dashboards, radar motifs, or decorative HUD clutter

## Layout

The common layout should include:

- A warm ambient page background
- A persistent command-shell frame where appropriate
- A compact navigation surface with command-like labels
- A main panel that uses glass treatment without hiding readability
- A small version/source marker
- Responsive behavior that turns the frame into a compact top section on mobile

The root homepage may use a more prominent command panel, but it must still use the same shell grammar as the sub-surfaces.

## Components

Create or standardize these component patterns across surfaces:

- Command glass panel for page hero and main sections
- Prompt/command row treatment for homepage orientation and utility links
- Suggestion pills for route links and compact choices
- Terminal/status rows for IDs, statuses, timestamps, and metadata
- Sparse cards for artifacts, experiments, and notes
- Text slabs for long-form pages such as resume, FAQ, no list, and note details
- Primary and secondary link-button styles for actions and external links

## Surface Requirements

`public-root/`:

- Preserve existing routes and content.
- Restyle the root layout, homepage, work index/detail pages, hire page, resume page, FAQ, and no-list page.
- Keep the site as the finished authority surface.
- Ensure disabled links either remain clearly unavailable or point to live utility surfaces if already configured.

`lab/`:

- Preserve experiment collection behavior.
- Apply the same shell, card, status, and detail-page treatment.
- Keep rough-edge language but make the surface visually coherent with root.

`notes/` / `wiki`:

- Preserve note collection behavior and wiki mapping.
- Apply the same shell and text-slab treatment.
- Keep reading density comfortable; do not over-card every note body.

`signal/`:

- Preserve curation sections and markdown content.
- Use the same shell and terminal list treatment.
- Keep it simple and low-frequency, not feed-like.

Static utilities:

- `links/` should become a compact command menu.
- `now/` should become a current-status panel.
- `resume/` should visually match the shell, even if it remains a static utility entrypoint.
- `store/` should remain redirect-oriented or minimal, but use the same design language if it has visible UI.

## Implementation Architecture

Keep the multi-surface architecture intact.

Preferred implementation:

- Add a repo-level shared CSS file under a neutral path such as `shared/command-glass.css`.
- For Astro surfaces, import that stylesheet from each surface layout if Astro can resolve it cleanly from the source tree.
- For static HTML surfaces, link to or copy the same generated/static CSS in a simple maintainable way.
- Avoid package changes unless needed to make a shared asset path work reliably.

If cross-surface CSS imports prove awkward in Astro, fall back to copying a small shared CSS file into each surface with a clear note in the implementation plan. The priority is a durable sitewide design system without destabilizing the build or deploy tree.

## Accessibility And Content Rules

- Maintain semantic HTML structure.
- Preserve keyboard focus visibility.
- Keep contrast high on all text, links, and status labels.
- Do not use text as purely decorative terminal noise.
- Do not add fake analytics, fake dashboards, fake logs, or false capability claims.
- Keep copy personal and direct.

## Verification

Run affected and repo-wide checks:

- `npm run build` in `public-root/`
- `npm run build` in `lab/`
- `npm run build` in `notes/`
- `npm run build` in `signal/`
- Verify `links/index.html`, `now/index.html`, `resume/index.html`, and `store/index.html` exist
- Preview visual changes locally for the root Astro surface, and inspect representative pages for each changed surface

Update the relevant Obsidian/Titan setup note after implementation because this is a public website/workflow design-system change.

## Follow-On Planning

After the current surfaces are updated, plan the not-yet-built or incomplete surfaces as a separate workstream. Candidates from the repo README include:

- `contact.hellointernet.lol` as an action surface for email, meeting, payment, and donation routes
- `this.hellointernet.lol` as a meta surface explaining the system
- `ops.hellointernet.lol` as an operator/runbook surface, likely obscure or private
- `scratch.hellointernet.lol` if the public thinking surface should be distinct from the current `wiki` mapping
- A dedicated `artifacts.hellointernet.lol` surface if the current redirect should become a real interface

Those surfaces should reuse the command shell design system, but each needs its own purpose, route mapping, hosting decision, and public/private posture before implementation.
