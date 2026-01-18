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

## Subdomains

This project is structured as a set of **independent static surfaces**, each mapped to a subdomain.
Each surface has a single purpose and is deployed separately.

Subdomains are treated as **interfaces**, not features.

---

### `hellointernet.lol` (root)
**Role:** Authority surface  
**Purpose:** First impression, proof of competence, orientation

- Homepage
- Artifacts (work)
- No List
- FAQ
- Hire
- Resume (canonical)

This is the only surface that should feel “finished.”

---

### `lab.hellointernet.lol`
**Role:** Work surface  
**Purpose:** Experiments, half-built tools, prototypes

- Rough edges allowed
- Status and timestamps visible
- Not linked prominently from the root

This is where things are tried, not sold.

---

### `signal.hellointernet.lol`
**Role:** Curation surface  
**Purpose:** Taste, filtering, pointing at things worth attention

- People worth following
- Tools
- Writing
- Watching / listening / visuals
- Opinionated, low-frequency updates

This is not a feed or a blog.

---

### `scratch.hellointernet.lol`
**Role:** Thinking surface  
**Purpose:** Working notes and internal structure made public

- Assumptions
- Questions
- Models
- References
- Versions / changes

This surface is allowed to be incomplete.

---

### `links.hellointernet.lol`
**Role:** Utility surface  
**Purpose:** Social routing / link-in-bio

- Single static page
- Updated frequently
- No build step

Not part of site navigation.

---

### `store.hellointernet.lol`
**Role:** Utility surface  
**Purpose:** Ownership-preserving redirect to products (Gumroad)

- Redirect-only
- No UI

---

### `contact.hellointernet.lol`
**Role:** Action surface  
**Purpose:** Fulfill intent once someone decides to act

- Pay
- Donate
- Meet
- Email

This consolidates all “do something” actions into one place.

---

### `now.hellointernet.lol`
**Role:** Signal / operator surface  
**Purpose:** What I’m focused on right now

- Changes occasionally
- Signals momentum and scarcity

Optional, but powerful.

---

### `this.hellointernet.lol` (optional)
**Role:** Meta surface  
**Purpose:** Explain the system itself

- Why this exists
- How it’s structured
- What it’s for

Only exists if it adds clarity.

---

### `ops.hellointernet.lol` (optional)
**Role:** Operator surface  
**Purpose:** Internal tools, playbooks, and runbooks

- Playbook
- Checklists
- Admin links

May remain obscure or private.

---

## Guiding Rules

- Subdomains are **surfaces**, not categories
- Each subdomain does **one thing**
- Sections live *inside* subdomains, not alongside them
- If editing a surface feels heavy, it should not exist

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

## TODO

### Core (before anything goes live)
- [x] Decide which subdomains are discoverable vs hidden
- [x] Finish editing content in `public-root/`
  - [x] Artifacts copy pass
  - [x] No List tone check
  - [x] FAQ final trim
- [x] Decide homepage utility nav (what links appear, if any)
- [x] Add version marker (v0.1)

### Build / Test
- [x] Run `npm run build` in:
  - [x] public-root
  - [ ] lab
  - [ ] signal
- [x] Smoke-test `npm run preview` where applicable
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
