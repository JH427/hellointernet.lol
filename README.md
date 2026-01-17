# hellointernet.lol

This repository contains the source for my personal internet root.

Each folder represents an **independent static surface** (site or utility),
built and deployed separately, usually to its own subdomain.

This is not a product repo.
This is an operating system.

---

## Structure

- `public-root/`  
  Canonical site. First impression, authority surface.
  Homepage, artifacts, No List, FAQ, hire page, resume.

- `lab/`  
  Experiments and half-built things. Rough edges allowed.

- `signal/`  
  Curated links, people, tools, writing worth attention.
  Opinionated, low-frequency, high-signal.

- `links/`  
  Link-in-bio / social routing. One static HTML page.

- `store/`  
  Redirect-only subdomain (Gumroad).

- `resume/`  
  Redirect-only subdomain pointing to `/resume` on the root site.

- `notes/`  
  (Planned) Lightweight notes / fieldnotes. Not finalized.

- `now/`  
  (Planned) What I’m focused on right now. Changes occasionally.

---

## Philosophy

- Static first
- Git is the CMS
- Artifacts > posts
- Taste > completeness
- If editing feels heavy, something is wrong

---

## Development

Each folder is independent.

For Astro-based sites:

```
npm install
npm run dev
npm run build
```

Deploy the dist/ output for that folder to its corresponding subdomain.

Redirect-only folders (links, store, resume) require no build step.

---

## Status

Nothing is deployed yet.
This repo is under active construction.

See TODO below.


---

# 2. TODO (this matches your current state)

You can append this directly under the README or keep it as a separate section.

```md
## TODO

### Core (before anything goes live)
- [ ] Decide which subdomains are discoverable vs hidden
- [ ] Finish editing content in `public-root/`
  - [ ] Artifacts copy pass
  - [ ] No List tone check
  - [ ] FAQ final trim
- [ ] Decide homepage utility nav (what links appear, if any)
- [ ] Add version marker (v0.1)

### Build / Test
- [ ] Run `npm run build` in:
  - [ ] public-root
  - [ ] lab
  - [ ] signal
- [ ] Smoke-test `npm run preview` where applicable
- [ ] Confirm no generated files are tracked in git

### Deployment Planning
- [ ] Decide hosting target for each surface
  - [ ] root
  - [ ] lab
  - [ ] signal
- [ ] Decide which subdomains launch in v0.1
- [ ] Configure redirects for store / resume

### Later (do not rush)
- [ ] Flesh out `signal` content (initial curation)
- [ ] Decide if `notes` becomes public
- [ ] Implement `now` page
- [ ] Add optional redirect subdomains (meet, pay, email)
