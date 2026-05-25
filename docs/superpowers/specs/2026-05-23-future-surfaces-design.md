# Future hellointernet.lol Surfaces Design

Date: 2026-05-23
Status: Planning, not implementation

## Goal

Plan the public and hidden surfaces that are not fully built yet, using the sitewide Gruvbox Command Glass shell as the required design system.

## Candidate Surfaces

### contact.hellointernet.lol

Purpose: action surface for people who already decided to act.

Initial routes:

- Email Joshua
- Schedule a conversation
- Pay or donate if those links exist
- Return to root

Public posture: public, but not necessarily prominent in root navigation until the links are real.

Build recommendation: static HTML first. Promote to Astro only if content grows.

### this.hellointernet.lol

Purpose: meta surface explaining why the website exists and how the subdomains work.

Initial sections:

- What this system is
- How surfaces map to intent
- Why static-first
- How to navigate

Public posture: public and linkable from root footer or FAQ.

Build recommendation: static HTML first.

### ops.hellointernet.lol

Purpose: operator runbook surface for playbooks, admin routes, and maintenance checklists.

Public posture: private, unlisted, or not deployed until access expectations are clear.

Build recommendation: do not build publicly in the first pass. Keep operational runbooks in the vault or a private repo unless public exposure is intentional.

### scratch.hellointernet.lol

Purpose: public thinking surface if scratch needs to diverge from the current wiki surface.

Public posture: unresolved. The current `wiki.hellointernet.lol` already covers public working notes, so scratch should not be added unless it has a distinct job.

Build recommendation: defer.

### artifacts.hellointernet.lol

Purpose: dedicated artifact browsing surface if `/work/` outgrows the root site.

Public posture: public.

Build recommendation: defer until artifact count or filtering needs justify a separate surface. Current redirect to `/work/` remains correct.

## Recommended Build Order

1. `contact.hellointernet.lol`, because it gives the site a clear action endpoint.
2. `this.hellointernet.lol`, because it explains the multi-surface model.
3. Decide whether `artifacts.hellointernet.lol` should remain a redirect after the work index has more content.
4. Revisit `scratch.hellointernet.lol` only if wiki and scratch develop different audiences.
5. Keep `ops.hellointernet.lol` private or unbuilt unless there is a strong reason to publish it.

## Required Decisions Before Implementation

- Which contact actions are real and safe to publish.
- Whether any payment/donation links exist.
- Whether `this` should be a subdomain or a page under root.
- Whether `ops` is public, hidden, private, or not deployed.
- Whether Porkbun's 10-subdomain limit leaves room for all candidates.
