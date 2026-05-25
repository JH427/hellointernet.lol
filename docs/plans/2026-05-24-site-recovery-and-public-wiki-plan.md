# hellointernet.lol Site Recovery and Public Wiki Implementation Plan

> **For Hermes:** Use subagent-driven-development skill to implement this plan task-by-task.

**Goal:** Turn the current deployed redesign into a stable, intentional personal internet system: fix the broken resume route, remove demo/placeholder content, redesign toward a simpler visual direction, make `wiki.hellointernet.lol` a public-safe projection of Joshua's LLM Wiki, and curate `links.hellointernet.lol` from real sources such as Chromium bookmarks.

**Architecture:** Keep the existing multi-surface repo and Porkbun generated-branch deployment architecture. Treat this as a recovery and planning pass first, then implement in small reviewed workstreams. Avoid changing DNS, Porkbun settings, deploy branch strategy, or secrets handling unless explicitly approved.

**Tech Stack:** Static HTML, Astro, Markdown content collections, Bash deploy script, GitHub Actions, Porkbun Static Hosting generated branch.

---

## Current Findings

1. Resume is broken because the generated deploy tree copies `public-root/dist/` to the root, then copies static `resume/` over `OUT/resume`. That overwrites the real Astro resume route with a static redirect page pointing to `https://hellointernet.lol/resume`, producing a self-referential/empty redirect experience instead of the actual resume content.
2. `links/index.html` contains generic demo links (`youtube.com`, `x.com`, `linkedin.com`, `github.com`) rather than Joshua-specific destinations.
3. `signal/src/content/signal/people.md` and related signal files include placeholder/example content.
4. `public-root/package.json` and `package-lock.json` still use the Astro example package name `@example/basics`.
5. `README.md` still says "Nothing is deployed yet" even though Porkbun deployment is live.
6. `notes/` is currently a tiny placeholder wiki. It should become a public-safe projection of `/home/joshua/Obsidian Vault/LLM Wiki`, not a raw dump of private/raw wiki material.
7. The Command Glass redesign is deployed, but Joshua is not happy with the direction. Treat design as provisional and avoid doubling down before a design review.

---

## Phase 0: Freeze and Recovery Gate

**Objective:** Stop accidental polish on a direction Joshua dislikes and fix live breakage first.

**Files:**
- Inspect: `scripts/build-porkbun-deploy-tree.sh`
- Inspect: `resume/index.html`
- Inspect: `public-root/src/pages/resume.astro`
- Modify: likely `scripts/build-porkbun-deploy-tree.sh`
- Possibly modify/delete later: `resume/index.html`

### Task 0.1: Confirm the resume overwrite bug

Run:

```bash
cd /home/joshua/projects/hellointernet-lol
bash scripts/build-porkbun-deploy-tree.sh
cmp -s public-root/dist/resume/index.html .porkbun-deploy/resume/index.html; echo $?
sed -n '1,40p' .porkbun-deploy/resume/index.html
```

Expected:
- `cmp` returns nonzero.
- `.porkbun-deploy/resume/index.html` contains the static redirect page, not the Astro resume content.

### Task 0.2: Fix resume artifact assembly

Implement the conservative fix:

- Stop copying static `resume/` over `.porkbun-deploy/resume`.
- Let `public-root/dist/resume/index.html` remain in the deploy tree.
- Keep `resume.hellointernet.lol` mapped to `/resume`; it will serve the same canonical resume content as `hellointernet.lol/resume/`.
- Keep `resume/index.html` in source only if it remains useful as a source-side utility stub, but do not publish it over the real resume route.

Likely edit in `scripts/build-porkbun-deploy-tree.sh`:

```bash
copy_tree "$ROOT/links" "$OUT/links"
copy_tree "$ROOT/now" "$OUT/now"
# Do not copy ROOT/resume over OUT/resume. public-root/dist already provides /resume.
copy_tree "$ROOT/store" "$OUT/store"
```

Also adjust static entrypoint checks in `AGENTS.md`, `DEPLOYMENT.md`, and CI if they require `resume/index.html` as a published static surface. The resume surface should be documented as "Astro route from `public-root/`, also mapped as `resume.hellointernet.lol`" rather than a separate static redirect surface.

### Task 0.3: Verify resume locally and live before broader work

Run:

```bash
cd /home/joshua/projects/hellointernet-lol
bash scripts/build-porkbun-deploy-tree.sh
grep -q 'AI Sales Specialist' .porkbun-deploy/resume/index.html
grep -q 'Redirecting to the canonical resume' .porkbun-deploy/resume/index.html && exit 1 || true
```

After deployment, verify:

```bash
curl -L -s https://hellointernet.lol/resume/ | grep -q 'AI Sales Specialist'
curl -L -s https://resume.hellointernet.lol/ | grep -q 'AI Sales Specialist'
```

Commit:

```bash
git add scripts/build-porkbun-deploy-tree.sh AGENTS.md DEPLOYMENT.md .github/workflows || true
git commit -m "fix: publish canonical resume route"
```

---

## Phase 1: Content Audit and Demo Content Removal

**Objective:** Produce a factual inventory of all placeholder, stale, and demo content before rewriting pages.

**Files:**
- Inspect all top-level surfaces.
- Create: `docs/audits/2026-05-24-content-audit.md`

### Task 1.1: Search for placeholder/stale markers

Run:

```bash
cd /home/joshua/projects/hellointernet-lol
rg -n "demo|placeholder|lorem|example|TODO|Nothing is deployed|January 2026|@example|Author B|Author C|youtube.com|linkedin.com|github.com|hello@hellointernet.lol" . \
  --glob '!**/node_modules/**' \
  --glob '!**/dist/**' \
  --glob '!**/.porkbun-deploy/**'
```

Record findings in `docs/audits/2026-05-24-content-audit.md` grouped by:

- Broken / must fix before deploy
- Demo content visible publicly
- Stale docs only
- Needs Joshua decision

### Task 1.2: Remove or hide obvious public demo content

Conservative default:

- Replace `signal` placeholder people/writing/tools entries with either:
  - "coming soon" copy that is honest, or
  - no section until Joshua approves real items.
- Replace `links` generic destinations with a temporary minimal real set only if known from repo/profile:
  - GitHub: `https://github.com/JH427`
  - Email: `mailto:joshua@fullyautomated.enterprises`
  - Root: `https://hellointernet.lol`
- Do not invent LinkedIn, YouTube, X, Gumroad, scheduling, donation, or product links.

### Task 1.3: Fix stale docs that cause operational confusion

Update:

- `README.md` status section: deployment is live, active construction continues.
- `README.md` notes language: `notes/` currently maps to `wiki.hellointernet.lol`; future goal is public-safe LLM Wiki projection.
- `public-root/package.json` and lockfile package name from `@example/basics` to a repo-specific name, e.g. `hellointernet-root`.

Run builds after package rename.

---

## Phase 2: Design Reassessment Before Redesign

**Objective:** Decide the next visual direction before further implementation.

**Files:**
- Existing: `docs/superpowers/specs/2026-05-23-sitewide-command-glass-design.md`
- Create: `docs/design/2026-05-24-design-retrospective.md`
- Create: `docs/design/2026-05-24-design-options.md`

### Task 2.1: Capture what is not working

Create `docs/design/2026-05-24-design-retrospective.md` with these prompts and fill from Joshua feedback:

```markdown
# hellointernet.lol Design Retrospective

## What feels wrong about the current design?
- Too terminal/HUD?
- Too dark?
- Too uniform across surfaces?
- Too much glass?
- Too little personal warmth?
- Too corporate?
- Poor readability?
- Weak mobile layout?
- Navigation too heavy?

## What should stay?

## What should change immediately?

## What should never appear on the site?

## Reference sites / vibes Joshua likes
```

Do not implement major visual changes until this is filled.

### Task 2.2: Prepare three visual directions for review

Create `docs/design/2026-05-24-design-options.md` with three options:

1. **Plaintext Internet / Garden**
   - More readable, less shell.
   - Warm paper/dark hybrid possible.
   - Navigation behaves like a personal index.
   - Best if wiki/notes becomes central.

2. **Command Glass Lite**
   - Keep Gruvbox palette and some command affordances.
   - Reduce borders, blur, glow, terminal labels, and sidebar weight.
   - Best if current implementation has usable pieces but too much theme.

3. **Artifact Portfolio / Editorial**
   - Root feels finished and editorial.
   - Lab/wiki/signal can be rougher but share typography and spacing.
   - Less OS metaphor, more proof-of-work.

Recommendation for now: Command Glass Lite as the fastest recovery path, unless Joshua's critique points strongly toward Plaintext Internet.

### Task 2.3: Prototype before replacing the live site

Create 2-3 static HTML prototypes under `docs/design/prototypes/` or a non-deployed `prototype/` folder. Do not wire into deployment until Joshua picks one.

Prototype pages:

- home
- resume
- wiki index
- links

Verification:

- Open locally in browser or serve with `python -m http.server`.
- Compare screenshots or browser views before touching production surfaces.

---

## Phase 3: Public-Safe LLM Wiki Projection

**Objective:** Make `wiki.hellointernet.lol` a curated public projection of `/home/joshua/Obsidian Vault/LLM Wiki`, not a wholesale publication of private/raw notes.

**Source:** `/home/joshua/Obsidian Vault/LLM Wiki`

**Important source rules:** Before editing the LLM Wiki itself, read its `AGENTS.md`, `SCHEMA.md`, `index.md`, and recent `log.md`. Raw files under `raw/` are immutable once ingested. For this project, prefer reading/exporting from the wiki, not altering the source wiki.

**Files:**
- Modify: `notes/src/content/config.ts`
- Modify: `notes/src/pages/index.astro`
- Modify: `notes/src/pages/[slug].astro`
- Create: `notes/src/content/notes/*.md` generated/curated public pages
- Create: `scripts/export-public-wiki.mjs` or `scripts/export-public-wiki.py`
- Create: `docs/wiki-publication-policy.md`

### Task 3.1: Define public-safety policy

Create `docs/wiki-publication-policy.md` with allowed and forbidden categories.

Default forbidden:

- Secrets, tokens, hostnames, usernames, private deployment targets, Cloudflare Access details, internal API endpoints.
- Private raw transcripts.
- Personal data about third parties that is not already public and appropriate.
- Unverified claims that could create reputational/legal risk.
- Work-in-progress operational notes that reveal security posture.

Default allowed:

- Synthesized concepts.
- Public entities and public project descriptions.
- Public-safe architecture explanations.
- Curated references and links.
- Sanitized summaries of already-public work.

### Task 3.2: Build a public candidate inventory

Use a script to scan the LLM Wiki for markdown files excluding `raw/` by default.

Candidate directories:

- `concepts/`
- `entities/`
- `comparisons/`
- selected `queries/`

Initial likely candidates from inspection:

- `concepts/agent-managed-websites-workflow.md`
- `entities/hellointernet-lol.md`
- `concepts/personal-ai-operating-stack.md`
- `concepts/agent-systems-and-tooling.md`
- `concepts/frontend-design-systems-and-taste.md`
- `concepts/llm-wiki.md`

Create an allowlist file:

```text
notes/public-wiki-allowlist.txt
```

Do not auto-publish everything.

### Task 3.3: Implement sanitized export

Create a script that:

1. Reads allowlisted source markdown files from `/home/joshua/Obsidian Vault/LLM Wiki`.
2. Strips Obsidian-only syntax that does not render safely.
3. Removes or flags lines matching sensitive patterns.
4. Emits markdown files into `notes/src/content/notes/` with Astro frontmatter.
5. Adds a banner/frontmatter field like `source: "LLM Wiki public projection"` and `publicReviewed: true/false`.
6. Fails closed: files with suspicious terms are not exported unless explicitly reviewed.

Suggested sensitive regex categories:

```text
(?i)(token|secret|api[_-]?key|password|credential|private key)
(?i)(cloudflare access|tailscale ssh|ssh user|document root|rsync|deploy target)
(?i)(DISCORD_HOME_CHANNEL|XAI_API_KEY|OPENAI_API_KEY)
```

### Task 3.4: Update wiki UX for public projection

Update `notes` copy from placeholder "Working notes, not a blog" to something clearer:

- "Public-safe notes from Joshua's LLM Wiki. Curated, partial, and intentionally sanitized."

Add metadata per note:

- source area
- last reviewed date
- status: `public`, `draft`, `needs-review`

Do not publish `needs-review` pages unless linked only in local preview.

### Task 3.5: Verification

Run:

```bash
cd notes && npm run build
python scripts/export-public-wiki.py --check
rg -n "token|secret|api_key|password|credential|document root|rsync|Cloudflare Access|DISCORD_HOME_CHANNEL" notes/src/content/notes
```

Expected:

- Build passes.
- Export check passes.
- Sensitive search has no public-risk hits, or each hit is manually justified in `docs/wiki-publication-policy.md`.

---

## Phase 4: Links Curation from Chromium Bookmarks

**Objective:** Build `links.hellointernet.lol` from real curated destinations rather than generic demo links.

**Source found:** `/home/joshua/.config/chromium/Default/Bookmarks`

**Files:**
- Create: `scripts/extract-bookmarks-for-links.py`
- Create: `docs/links/2026-05-24-bookmark-candidates.md`
- Modify: `links/index.html`
- Optional later: `links/links.json` as structured source

### Task 4.1: Extract candidates without publishing

Create a script that parses Chromium bookmarks JSON and writes a candidate markdown file. It should not modify `links/index.html` directly.

Candidate grouping:

- Joshua / identity
- Projects
- Social profiles
- Writing / publishing
- Work tools
- Design references
- AI / agents
- Infrastructure / self-hosting
- Maybe/private/do-not-publish

Run:

```bash
python scripts/extract-bookmarks-for-links.py \
  --bookmarks "$HOME/.config/chromium/Default/Bookmarks" \
  --out docs/links/2026-05-24-bookmark-candidates.md
```

### Task 4.2: Curate with Joshua before publishing

Ask Joshua to select a small public set, likely 5-10 links.

Minimum recommended link set:

- Main site
- GitHub profile
- Email
- Resume
- Wiki or signal only if ready
- Any real social/profile links Joshua approves

Do not publish personal/private bookmarks, internal tools, local network URLs, Cloudflare-protected apps, or work-only links.

### Task 4.3: Implement links as data, not hardcoded ad hoc HTML

Preferred small architecture:

- `links/links.json` contains label, URL, category, description.
- `links/index.html` can remain static, but generation script can render it from JSON.
- Alternatively convert `links/` to a tiny Astro surface later if curation becomes frequent.

For now, keep static unless the page grows.

---

## Phase 5: Surface Role Cleanup

**Objective:** Make each surface have one clear job and remove conflicting/dead plans.

### Task 5.1: Reconcile notes/wiki/scratch language

Current conflict:

- Repo maps `notes/` to `wiki.hellointernet.lol`.
- README also discusses future `scratch.hellointernet.lol`.
- Joshua now wants notes to become public-safe LLM Wiki.

Plan:

- Keep `wiki.hellointernet.lol` as the public-safe LLM Wiki projection.
- Treat `scratch.hellointernet.lol` as deferred/unbuilt unless Joshua later wants a more informal thinking stream separate from wiki.
- Update README and docs to avoid implying `notes` may or may not become public; the decision is now yes, but curated/safe.

### Task 5.2: Reconcile resume surface

Plan:

- Resume canonical content lives in `public-root/src/pages/resume.astro`.
- `https://hellointernet.lol/resume/` and `https://resume.hellointernet.lol/` should show the same resume content.
- Remove separate static redirect behavior from deployment.

### Task 5.3: Reconcile signal vs links

Plan:

- `links` = Joshua's public identity/action router.
- `signal` = curated taste/attention surface; not link-in-bio.
- Bookmarks may feed both, but only selected identity/action links go to `links`.
- Reference/taste bookmarks can become `signal` entries after curation.

---

## Phase 6: Deployment and Verification

**Objective:** Deploy only after the recovery/content/design decisions pass local verification.

Required before deploy:

```bash
cd /home/joshua/projects/hellointernet-lol
bash scripts/build-porkbun-deploy-tree.sh
for surface in links now store; do test -f "$surface/index.html"; done
```

If resume static source is removed from static checks, do not include `resume` in the static-entrypoint loop.

Deploy path:

1. Push `main`.
2. Let GitHub Actions publish generated `porkbun-deploy`, or manually publish only if Actions fails and the tree has been locally verified.
3. Verify live routes.

Live verification:

```bash
for url in \
  https://hellointernet.lol/ \
  https://hellointernet.lol/resume/ \
  https://resume.hellointernet.lol/ \
  https://links.hellointernet.lol/ \
  https://wiki.hellointernet.lol/ \
  https://signal.hellointernet.lol/ \
  https://lab.hellointernet.lol/; do
  curl -L -s -o /tmp/hi_body -w "%{http_code} %{url_effective}\n" "$url"
done
```

Content verification:

```bash
curl -L -s https://hellointernet.lol/resume/ | grep -q 'AI Sales Specialist'
curl -L -s https://links.hellointernet.lol/ | grep -viE 'youtube.com|linkedin.com|@example|hello@hellointernet.lol'
curl -L -s https://wiki.hellointernet.lol/ | grep -qi 'public-safe'
```

---

## Decision Points for Joshua

Before implementation beyond the resume fix, Joshua should decide:

1. Design direction:
   - Plaintext Internet / Garden
   - Command Glass Lite
   - Artifact Portfolio / Editorial
2. Links policy:
   - Minimal identity router now, or bookmark-derived curated directory?
3. Public wiki scope:
   - Only polished synthesis pages first, or also some selected query/reference pages?
4. Resume behavior:
   - Same full resume on `resume.hellointernet.lol`, or should the subdomain redirect elsewhere after the deploy conflict is solved?
5. Signal posture:
   - Keep placeholder-empty until curated, or publish a small initial taste list?

---

## Recommended Execution Order

1. Fix resume deployment conflict immediately.
2. Remove public demo content or replace with honest "not curated yet" copy.
3. Update stale README/deployment docs.
4. Do design retrospective and choose direction.
5. Prototype the chosen direction on 3-4 pages.
6. Build public-safe LLM Wiki export policy and allowlist.
7. Extract Chrome bookmark candidates and curate links with Joshua.
8. Implement final content/design pass.
9. Build, deploy, and verify live.
