# Sitewide Command Glass Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restyle every current public `hellointernet.lol` surface into one uniform Gruvbox Command Glass command shell while preserving the existing multi-surface repo architecture.

**Architecture:** Use one canonical shared stylesheet in `shared/command-glass.css`, then copy that exact file into each deployable surface so Astro builds and static folders can serve it without new tooling. Update each Astro layout to load `/command-glass.css` and use common shell markup; update page-level CSS to use shared component classes and tokens. Static utility pages link to local `command-glass.css` and use the same shell structure.

**Tech Stack:** Astro 5, static HTML, CSS custom properties, IBM Plex Sans, IBM Plex Mono, existing Porkbun deploy-tree script.

---

## File Structure

- Create `shared/command-glass.css`: canonical design-system source.
- Create `public-root/public/command-glass.css`: root Astro deployed copy.
- Create `lab/public/command-glass.css`: lab Astro deployed copy.
- Create `notes/public/command-glass.css`: wiki Astro deployed copy.
- Create `signal/public/command-glass.css`: signal Astro deployed copy.
- Create `links/command-glass.css`, `now/command-glass.css`, `resume/command-glass.css`, `store/command-glass.css`: static utility deployed copies.
- Modify `public-root/src/layouts/BaseLayout.astro`: root shell, nav, global reset, stylesheet link.
- Modify `public-root/src/pages/index.astro`: homepage command panel and route pills.
- Modify `public-root/src/pages/work/index.astro` and `public-root/src/pages/work/[id].astro`: artifact cards/detail shell classes.
- Modify `public-root/src/pages/hire.astro`, `public-root/src/pages/resume.astro`, `public-root/src/pages/about/faq.astro`, `public-root/src/pages/about/no.astro`: text-slab and command-section styling.
- Modify `lab/src/layouts/BaseLayout.astro`, `lab/src/pages/index.astro`, `lab/src/pages/experiments/[id].astro`: lab shell and experiment cards.
- Modify `notes/src/layouts/BaseLayout.astro`, `notes/src/pages/index.astro`, `notes/src/pages/[slug].astro`: wiki shell and note slabs.
- Modify `signal/src/layouts/BaseLayout.astro`, `signal/src/pages/index.astro`: signal shell and list blocks.
- Modify `links/index.html`, `now/index.html`, `resume/index.html`, `store/index.html`: static command shell pages.
- Modify `scripts/build-porkbun-deploy-tree.sh`: copy root `command-glass.css` into `/artifacts` redirect output so that generated redirect can use the same visible fallback shell.
- Modify `~/Obsidian Vault/Titan Setup/12 - Ultimate Ricing Guide.md` or the most directly relevant note under `~/Obsidian Vault/Titan Setup/`: record that `hellointernet.lol` now uses the Gruvbox Command Glass design system.

## Task 1: Shared CSS Distribution

**Files:**
- Create: `shared/command-glass.css`
- Create: `public-root/public/command-glass.css`
- Create: `lab/public/command-glass.css`
- Create: `notes/public/command-glass.css`
- Create: `signal/public/command-glass.css`
- Create: `links/command-glass.css`
- Create: `now/command-glass.css`
- Create: `resume/command-glass.css`
- Create: `store/command-glass.css`

- [ ] **Step 1: Create canonical shared CSS**

Create `shared/command-glass.css` with this content:

```css
:root {
  --cg-bg: #0B0C0B;
  --cg-bg-2: #11120F;
  --cg-panel: rgba(18, 18, 15, 0.78);
  --cg-panel-strong: rgba(18, 18, 15, 0.9);
  --cg-text: #EBDBB2;
  --cg-text-2: #D5C4A1;
  --cg-muted: #928374;
  --cg-border: rgba(235, 219, 178, 0.16);
  --cg-border-strong: rgba(250, 189, 47, 0.35);
  --cg-yellow: #FABD2F;
  --cg-orange: #FE8019;
  --cg-green: #B8BB26;
  --cg-aqua: #8EC07C;
  --cg-purple: #D3869B;
  --cg-red: #FB4934;
  --cg-blue: #83A598;
  --cg-radius: 18px;
  --cg-radius-sm: 12px;
  --cg-shadow: 0 24px 80px rgba(0, 0, 0, 0.42);
  --bg: var(--cg-bg);
  --text: var(--cg-text);
  --text-dim: var(--cg-muted);
  --text-dimmer: rgba(146, 131, 116, 0.62);
  --accent: var(--cg-yellow);
  --border: var(--cg-border);
  --surface: var(--cg-panel);
}

* {
  box-sizing: border-box;
}

html {
  min-height: 100%;
  background: var(--cg-bg);
}

body {
  min-height: 100vh;
  margin: 0;
  background:
    radial-gradient(circle at 42% 18%, rgba(250, 189, 47, 0.13), transparent 32rem),
    radial-gradient(circle at 82% 34%, rgba(211, 134, 155, 0.09), transparent 30rem),
    linear-gradient(180deg, var(--cg-bg) 0%, var(--cg-bg-2) 100%);
  color: var(--cg-text);
  font-family: 'IBM Plex Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
}

body::before {
  content: "";
  position: fixed;
  inset: 0;
  pointer-events: none;
  background-image: linear-gradient(rgba(235, 219, 178, 0.025) 1px, transparent 1px);
  background-size: 100% 4px;
  mask-image: linear-gradient(to bottom, rgba(0, 0, 0, 0.55), transparent 72%);
}

a {
  color: var(--cg-yellow);
  text-decoration-thickness: 1px;
  text-underline-offset: 0.18em;
}

a:hover {
  color: var(--cg-orange);
}

a:focus-visible,
button:focus-visible,
summary:focus-visible {
  outline: 2px solid var(--cg-yellow);
  outline-offset: 3px;
}

h1,
h2,
h3 {
  color: var(--cg-text);
  font-weight: 600;
  line-height: 1.18;
  letter-spacing: 0;
  margin: 0 0 1rem;
}

p {
  margin: 0 0 1rem;
  color: var(--cg-text-2);
}

ul,
ol {
  color: var(--cg-text-2);
}

code,
pre,
.mono,
.cg-kicker,
.cg-meta,
.cg-nav,
.cg-pill,
.cg-command,
.site-version {
  font-family: 'IBM Plex Mono', 'SFMono-Regular', Consolas, monospace;
}

.cg-shell {
  width: min(1180px, calc(100% - 32px));
  min-height: calc(100vh - 32px);
  margin: 16px auto;
  display: grid;
  grid-template-columns: minmax(220px, 260px) minmax(0, 1fr);
  border: 1px solid var(--cg-border);
  border-radius: 24px;
  background: rgba(18, 18, 15, 0.48);
  box-shadow: var(--cg-shadow);
  overflow: hidden;
  backdrop-filter: blur(22px);
}

.cg-nav {
  border-right: 1px solid var(--cg-border);
  background: rgba(11, 12, 11, 0.58);
  padding: 24px;
}

.cg-brand {
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
  color: var(--cg-text);
  font-weight: 600;
  text-decoration: none;
}

.cg-brand::before {
  content: "";
  width: 0.58rem;
  height: 0.58rem;
  border-radius: 50%;
  background: var(--cg-green);
  box-shadow: 0 0 18px rgba(184, 187, 38, 0.5);
}

.cg-nav-group {
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
  margin-top: 1.6rem;
}

.cg-nav-label,
.cg-kicker {
  color: var(--cg-muted);
  font-size: 0.74rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.cg-nav-link {
  color: var(--cg-text-2);
  text-decoration: none;
  border: 1px solid transparent;
  border-radius: 999px;
  padding: 0.42rem 0.68rem;
}

.cg-nav-link:hover,
.cg-nav-link.active {
  color: var(--cg-yellow);
  border-color: var(--cg-border-strong);
  background: rgba(250, 189, 47, 0.06);
}

.cg-main {
  min-width: 0;
  padding: clamp(24px, 5vw, 56px);
}

.cg-panel,
.cg-card,
.cg-text-slab {
  border: 1px solid var(--cg-border);
  border-radius: var(--cg-radius);
  background: var(--cg-panel);
  box-shadow: 0 18px 52px rgba(0, 0, 0, 0.28);
}

.cg-panel {
  padding: clamp(22px, 4vw, 42px);
}

.cg-card,
.cg-text-slab {
  padding: 1.25rem;
}

.cg-text-slab {
  max-width: 74ch;
}

.cg-stack {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.cg-meta {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.65rem;
  color: var(--cg-muted);
  font-size: 0.82rem;
}

.cg-status,
.cg-pill {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  border: 1px solid var(--cg-border);
  border-radius: 999px;
  padding: 0.28rem 0.62rem;
  color: var(--cg-text-2);
  text-decoration: none;
  background: rgba(11, 12, 11, 0.36);
}

.cg-pill:hover {
  border-color: var(--cg-border-strong);
  background: rgba(250, 189, 47, 0.07);
}

.cg-status.active,
.cg-status.published {
  color: var(--cg-green);
  border-color: rgba(184, 187, 38, 0.35);
}

.cg-status.in-progress,
.cg-status.draft {
  color: var(--cg-yellow);
  border-color: rgba(250, 189, 47, 0.35);
}

.cg-status.paused,
.cg-status.archived {
  color: var(--cg-muted);
}

.cg-command {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  border: 1px solid var(--cg-border);
  border-radius: 999px;
  padding: 0.85rem 1rem;
  background: rgba(11, 12, 11, 0.62);
  color: var(--cg-text-2);
  text-decoration: none;
}

.cg-command:hover {
  border-color: var(--cg-border-strong);
  color: var(--cg-yellow);
}

.cg-list {
  display: grid;
  gap: 0.9rem;
}

.cg-card-link {
  display: block;
  color: inherit;
  text-decoration: none;
}

.cg-card-link:hover {
  border-color: var(--cg-border-strong);
}

.cg-root-link {
  color: var(--cg-muted);
  text-decoration: none;
}

.cg-root-link:hover {
  color: var(--cg-yellow);
}

@media (max-width: 820px) {
  .cg-shell {
    grid-template-columns: 1fr;
    width: min(100% - 20px, 720px);
    margin: 10px auto;
    border-radius: 18px;
  }

  .cg-nav {
    border-right: none;
    border-bottom: 1px solid var(--cg-border);
    padding: 18px;
  }

  .cg-nav-group {
    flex-direction: row;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-top: 1rem;
  }

  .cg-main {
    padding: 22px;
  }
}
```

- [ ] **Step 2: Copy the canonical CSS to deployable surfaces**

Run:

```bash
cp shared/command-glass.css public-root/public/command-glass.css
cp shared/command-glass.css lab/public/command-glass.css
cp shared/command-glass.css notes/public/command-glass.css
cp shared/command-glass.css signal/public/command-glass.css
cp shared/command-glass.css links/command-glass.css
cp shared/command-glass.css now/command-glass.css
cp shared/command-glass.css resume/command-glass.css
cp shared/command-glass.css store/command-glass.css
```

- [ ] **Step 3: Verify all copies match**

Run:

```bash
cmp shared/command-glass.css public-root/public/command-glass.css
cmp shared/command-glass.css lab/public/command-glass.css
cmp shared/command-glass.css notes/public/command-glass.css
cmp shared/command-glass.css signal/public/command-glass.css
cmp shared/command-glass.css links/command-glass.css
cmp shared/command-glass.css now/command-glass.css
cmp shared/command-glass.css resume/command-glass.css
cmp shared/command-glass.css store/command-glass.css
```

Expected: no output from any `cmp` command.

- [ ] **Step 4: Commit shared CSS**

Run:

```bash
git add shared/command-glass.css public-root/public/command-glass.css lab/public/command-glass.css notes/public/command-glass.css signal/public/command-glass.css links/command-glass.css now/command-glass.css resume/command-glass.css store/command-glass.css
git commit -m "style: add shared command glass design system"
```

## Task 2: Root Astro Shell And Homepage

**Files:**
- Modify: `public-root/src/layouts/BaseLayout.astro`
- Modify: `public-root/src/pages/index.astro`

- [ ] **Step 1: Update root layout head and shell classes**

In `public-root/src/layouts/BaseLayout.astro`, add this stylesheet link after the Google Fonts link:

```astro
<link rel="stylesheet" href="/command-glass.css" />
```

Replace the body markup with:

```astro
<body>
  <div class="cg-shell">
    {showNav && (
      <nav class="cg-nav" aria-label="Primary">
        <a href="/" class="cg-brand">hellointernet.lol</a>

        <div class="cg-nav-group">
          <div class="cg-nav-label">Primary</div>
          <a href="/work" class:list={['cg-nav-link', { active: currentPath.startsWith('/work') }]}>work</a>
          <a href="/hire" class:list={['cg-nav-link', { active: currentPath === '/hire' }]}>work with me</a>
        </div>

        <div class="cg-nav-group">
          <div class="cg-nav-label">Info</div>
          <a href="/resume" class:list={['cg-nav-link', { active: currentPath === '/resume' }]}>resume</a>
          <a href="/about/no" class:list={['cg-nav-link', { active: currentPath === '/about/no' }]}>no list</a>
          <a href="/about/faq" class:list={['cg-nav-link', { active: currentPath === '/about/faq' }]}>faq</a>
        </div>

        <div class="cg-nav-group">
          <div class="cg-nav-label">Surfaces</div>
          <a href="https://links.hellointernet.lol" class="cg-nav-link">links</a>
          <a href="https://now.hellointernet.lol" class="cg-nav-link">now</a>
          <a href="https://lab.hellointernet.lol" class="cg-nav-link">lab</a>
          <a href="https://signal.hellointernet.lol" class="cg-nav-link">signal</a>
          <a href="https://wiki.hellointernet.lol" class="cg-nav-link">wiki</a>
        </div>
      </nav>
    )}

    <main class="cg-main">
      <slot />
    </main>
  </div>

  <footer class="site-version">
    <a href="https://github.com/JH427/hellointernet.lol" target="_blank" rel="noopener noreferrer">v0.1</a>
  </footer>
</body>
```

Replace the global `<style is:global>` block with only this local addition:

```astro
<style is:global>
  .site-version {
    position: fixed;
    right: 18px;
    bottom: 14px;
    z-index: 5;
    font-size: 0.75rem;
    opacity: 0.58;
  }

  .site-version a {
    color: var(--cg-muted);
    text-decoration: none;
  }

  .site-version a:hover {
    color: var(--cg-yellow);
  }
</style>
```

- [ ] **Step 2: Update homepage markup**

Replace the contents inside `<BaseLayout title="hellointernet.lol">` in `public-root/src/pages/index.astro` with:

```astro
<section class="home cg-panel">
  <div class="cg-kicker">operator surface / online</div>
  <h1 class="headline">I build small systems that make messy things obvious.</h1>

  <div class="subtext">
    <p>I work in the gaps between ideas, tools, and execution.</p>
    <p>Sometimes this becomes software. Sometimes leverage. Often both.</p>
  </div>

  <div class="route-grid" aria-label="Primary routes">
    <a class="cg-command" href="/work">
      <span>$ open work</span>
      <span>artifacts</span>
    </a>
    <a class="cg-command" href="/hire">
      <span>$ start engagement</span>
      <span>work with me</span>
    </a>
  </div>

  <div class="surface-pills" aria-label="Utility routes">
    <a class="cg-pill" href="/resume">resume</a>
    <a class="cg-pill" href="https://links.hellointernet.lol">links</a>
    <a class="cg-pill" href="https://now.hellointernet.lol">now</a>
    <a class="cg-pill" href="https://lab.hellointernet.lol">lab</a>
    <a class="cg-pill" href="https://signal.hellointernet.lol">signal</a>
    <a class="cg-pill" href="https://wiki.hellointernet.lol">wiki</a>
  </div>

  <footer class="footer">
    <p>No feeds. No funnels. Just artifacts.</p>
  </footer>
</section>
```

- [ ] **Step 3: Replace homepage style block**

Use this style block in `public-root/src/pages/index.astro`:

```astro
<style>
  .home {
    max-width: 780px;
  }

  .headline {
    max-width: 13ch;
    margin-top: 0.8rem;
    font-size: clamp(2.35rem, 8vw, 5.4rem);
    line-height: 0.98;
  }

  .subtext {
    max-width: 56ch;
    margin-top: 1.5rem;
    font-size: 1.08rem;
  }

  .route-grid {
    display: grid;
    gap: 0.8rem;
    margin-top: 2rem;
  }

  .route-grid .cg-command span:last-child {
    color: var(--cg-muted);
    font-size: 0.82rem;
  }

  .surface-pills {
    display: flex;
    flex-wrap: wrap;
    gap: 0.6rem;
    margin-top: 1.2rem;
  }

  .footer {
    margin-top: 3rem;
    padding-top: 1.25rem;
    border-top: 1px solid var(--cg-border);
  }

  .footer p {
    margin: 0;
    color: var(--cg-muted);
    font-family: 'IBM Plex Mono', monospace;
    font-size: 0.88rem;
  }
```

Close the style block with `</style>`.

- [ ] **Step 4: Build root Astro surface**

Run:

```bash
cd public-root && npm run build
```

Expected: Astro build completes and writes `dist/`.

- [ ] **Step 5: Commit root shell and homepage**

Run:

```bash
git add public-root/src/layouts/BaseLayout.astro public-root/src/pages/index.astro
git commit -m "style: apply command shell to root homepage"
```

## Task 3: Root Content Pages

**Files:**
- Modify: `public-root/src/pages/work/index.astro`
- Modify: `public-root/src/pages/work/[id].astro`
- Modify: `public-root/src/pages/hire.astro`
- Modify: `public-root/src/pages/resume.astro`
- Modify: `public-root/src/pages/about/faq.astro`
- Modify: `public-root/src/pages/about/no.astro`

- [ ] **Step 1: Restyle work index**

In `public-root/src/pages/work/index.astro`, change wrapper classes to:

```astro
<div class="work-index cg-stack">
  <header class="cg-panel">
    <div class="cg-kicker">artifact registry</div>
    <h1>Artifacts</h1>
    <p>Proof over posture. Work that made a constraint visible, smaller, or gone.</p>
  </header>

  <div class="artifact-list cg-list">
    {sortedArtifacts.map((artifact) => (
      <a href={`/work/${artifact.data.id}`} class="artifact-item cg-card cg-card-link">
        <div class="artifact-meta cg-meta">
          <span>{artifact.data.id}</span>
          <span class="cg-status">{artifact.data.status}</span>
        </div>
        <h3 class="artifact-title">{artifact.data.title}</h3>
      </a>
    ))}
  </div>
</div>
```

Replace the page style with:

```astro
<style>
  .work-index {
    max-width: 820px;
  }

  .artifact-title {
    margin: 0.7rem 0 0;
    font-size: 1.18rem;
  }
</style>
```

- [ ] **Step 2: Restyle artifact detail**

In `public-root/src/pages/work/[id].astro`, change the article wrapper to:

```astro
<article class="artifact-detail cg-text-slab">
```

Use `class="artifact-meta cg-meta"` on the metadata row and `class="cg-status"` on the status span. Change the external link text to use a command row:

```astro
<div class="artifact-link">
  <a class="cg-command" href={artifact.data.link} target="_blank" rel="noopener noreferrer">
    <span>$ open project</span>
    <span>external</span>
  </a>
</div>
```

Replace the style block with:

```astro
<style>
  .artifact-detail h1 {
    margin-top: 0.75rem;
    font-size: clamp(2rem, 6vw, 3.7rem);
  }

  .artifact-content {
    margin-top: 1.5rem;
  }

  .artifact-content :global(p),
  .artifact-content :global(li) {
    color: var(--cg-text-2);
  }

  .artifact-link,
  .back-link {
    margin-top: 2rem;
    padding-top: 1.5rem;
    border-top: 1px solid var(--cg-border);
  }

  .back-link a {
    color: var(--cg-muted);
    text-decoration: none;
    font-family: 'IBM Plex Mono', monospace;
  }
</style>
```

- [ ] **Step 3: Apply text slab styling to hire, resume, FAQ, and no-list pages**

For each of `public-root/src/pages/hire.astro`, `public-root/src/pages/resume.astro`, `public-root/src/pages/about/faq.astro`, and `public-root/src/pages/about/no.astro`, wrap the main content container with `cg-text-slab`. Example:

```astro
<div class="content-block cg-text-slab">
```

Keep existing page copy intact. Replace old color/border values in these page style blocks with shared variables:

```css
color: var(--cg-text-2);
border-color: var(--cg-border);
font-family: 'IBM Plex Mono', monospace;
```

Use `.cg-command` for prominent email or project action links where the current page has a dedicated call-to-action block.

- [ ] **Step 4: Build root Astro surface**

Run:

```bash
cd public-root && npm run build
```

Expected: Astro build completes and all root pages render.

- [ ] **Step 5: Commit root content pages**

Run:

```bash
git add public-root/src/pages/work/index.astro public-root/src/pages/work/[id].astro public-root/src/pages/hire.astro public-root/src/pages/resume.astro public-root/src/pages/about/faq.astro public-root/src/pages/about/no.astro
git commit -m "style: restyle root content pages"
```

## Task 4: Lab Surface

**Files:**
- Modify: `lab/src/layouts/BaseLayout.astro`
- Modify: `lab/src/pages/index.astro`
- Modify: `lab/src/pages/experiments/[id].astro`

- [ ] **Step 1: Update lab layout**

In `lab/src/layouts/BaseLayout.astro`, add:

```astro
<link rel="stylesheet" href="/command-glass.css" />
```

Replace body markup with:

```astro
<body>
  <div class="cg-shell">
    <nav class="cg-nav" aria-label="Lab">
      <a href="/" class="cg-brand">lab.hellointernet.lol</a>
      <div class="cg-nav-group">
        <div class="cg-nav-label">Surface</div>
        <a href="/" class:list={['cg-nav-link', { active: currentPath === '/' }]}>experiments</a>
        <a href="https://hellointernet.lol" class="cg-nav-link">root</a>
      </div>
    </nav>
    <main class="cg-main">
      <slot />
    </main>
  </div>
</body>
```

Remove the old global CSS except for any required Astro-specific reset that is not already in `command-glass.css`.

- [ ] **Step 2: Update lab index and experiment detail classes**

In `lab/src/pages/index.astro`, wrap the intro with `cg-panel`, the list with `cg-list`, and each experiment link with `cg-card cg-card-link`. Metadata rows use `cg-meta`; statuses use `cg-status`.

In `lab/src/pages/experiments/[id].astro`, use:

```astro
<article class="experiment cg-text-slab">
```

Change the external link to:

```astro
<a class="cg-command" href={experiment.data.link} target="_blank" rel="noopener noreferrer">
  <span>$ open experiment</span>
  <span>external</span>
</a>
```

- [ ] **Step 3: Simplify lab page-level CSS**

Keep only spacing rules that shared CSS does not cover:

```astro
<style>
  .page,
  .experiment {
    max-width: 820px;
  }

  .title {
    margin-top: 0.6rem;
    font-size: 1.12rem;
  }

  .body {
    margin-top: 1.25rem;
  }

  .back {
    margin-top: 2rem;
    font-family: 'IBM Plex Mono', monospace;
  }
</style>
```

- [ ] **Step 4: Build lab surface**

Run:

```bash
cd lab && npm run build
```

Expected: Astro build completes and writes `dist/`.

- [ ] **Step 5: Commit lab changes**

Run:

```bash
git add lab/src/layouts/BaseLayout.astro lab/src/pages/index.astro lab/src/pages/experiments/[id].astro
git commit -m "style: apply command shell to lab"
```

## Task 5: Wiki And Signal Surfaces

**Files:**
- Modify: `notes/src/layouts/BaseLayout.astro`
- Modify: `notes/src/pages/index.astro`
- Modify: `notes/src/pages/[slug].astro`
- Modify: `signal/src/layouts/BaseLayout.astro`
- Modify: `signal/src/pages/index.astro`

- [ ] **Step 1: Update wiki layout**

In `notes/src/layouts/BaseLayout.astro`, add `/command-glass.css` in the head and replace body markup with:

```astro
<body>
  <div class="cg-shell">
    <nav class="cg-nav" aria-label="Wiki">
      <a href="/" class="cg-brand">wiki.hellointernet.lol</a>
      <div class="cg-nav-group">
        <div class="cg-nav-label">Surface</div>
        <a href="/" class:list={['cg-nav-link', { active: currentPath === '/' }]}>index</a>
        <a href="https://hellointernet.lol" class="cg-nav-link">root</a>
      </div>
    </nav>
    <main class="cg-main">
      <slot />
    </main>
  </div>
</body>
```

- [ ] **Step 2: Update wiki pages**

In `notes/src/pages/index.astro`, use `cg-panel` for the intro, `cg-list` for the list, and `cg-card cg-card-link` for note links. In `notes/src/pages/[slug].astro`, use `cg-text-slab` on the article, `cg-meta` for metadata, and `cg-status` for draft/archived badges.

Use this compact CSS for wiki pages:

```astro
<style>
  .index,
  .note {
    max-width: 820px;
  }

  .title {
    font-weight: 600;
  }

  .body {
    margin-top: 1.25rem;
  }

  .body :global(p),
  .body :global(li) {
    color: var(--cg-text-2);
  }
</style>
```

- [ ] **Step 3: Update signal layout**

In `signal/src/layouts/BaseLayout.astro`, add `/command-glass.css` in the head and replace body markup with:

```astro
<body>
  <div class="cg-shell">
    <nav class="cg-nav" aria-label="Signal">
      <a href="/" class="cg-brand">signal.hellointernet.lol</a>
      <div class="cg-nav-group">
        <div class="cg-nav-label">Surface</div>
        <a href="/" class="cg-nav-link active">index</a>
        <a href="https://hellointernet.lol" class="cg-nav-link">root</a>
      </div>
    </nav>
    <main class="cg-main">
      <slot />
    </main>
  </div>
</body>
```

- [ ] **Step 4: Update signal index**

Use a `cg-panel` intro and `cg-card` section blocks:

```astro
<div class="stack cg-stack">
  <header class="intro cg-panel">
    <div class="cg-kicker">curation surface</div>
    <h1>Signal</h1>
    <p>Curation, not feed. Manual order. Add a bullet, ship.</p>
  </header>

  {rendered.map((section) => (
    <section class="block cg-card">
      <h2>{section.data.title}</h2>
      <div class="list">
        <section.Content />
      </div>
    </section>
  ))}
</div>
```

- [ ] **Step 5: Build wiki and signal surfaces**

Run:

```bash
cd notes && npm run build
cd ../signal && npm run build
```

Expected: both Astro builds complete.

- [ ] **Step 6: Commit wiki and signal changes**

Run:

```bash
git add notes/src/layouts/BaseLayout.astro notes/src/pages/index.astro notes/src/pages/[slug].astro signal/src/layouts/BaseLayout.astro signal/src/pages/index.astro
git commit -m "style: apply command shell to wiki and signal"
```

## Task 6: Static Utility Surfaces

**Files:**
- Modify: `links/index.html`
- Modify: `now/index.html`
- Modify: `resume/index.html`
- Modify: `store/index.html`

- [ ] **Step 1: Update static page heads**

For each static page, keep the existing metadata and add:

```html
<link rel="stylesheet" href="/command-glass.css">
```

For `resume/index.html` and `store/index.html`, keep the meta refresh and script redirects.

- [ ] **Step 2: Restyle `links/index.html` visible body**

Use:

```html
<body>
  <main class="cg-shell utility-shell">
    <section class="cg-main">
      <div class="cg-panel utility-panel">
        <div class="cg-kicker">link router / online</div>
        <h1>hellointernet</h1>
        <p>Links to the things that are live right now.</p>

        <div class="cg-list">
          <a class="cg-command" href="https://youtube.com" target="_blank" rel="noopener noreferrer"><span>$ open YouTube</span><span>video</span></a>
          <a class="cg-command" href="https://x.com" target="_blank" rel="noopener noreferrer"><span>$ open X</span><span>short</span></a>
          <a class="cg-command" href="https://linkedin.com" target="_blank" rel="noopener noreferrer"><span>$ open LinkedIn</span><span>profile</span></a>
          <a class="cg-command" href="https://github.com" target="_blank" rel="noopener noreferrer"><span>$ open GitHub</span><span>repos</span></a>
          <a class="cg-command" href="mailto:hello@hellointernet.lol"><span>$ compose email</span><span>hello@hellointernet.lol</span></a>
          <a class="cg-command" href="https://store.hellointernet.lol"><span>$ open store</span><span>gumroad</span></a>
        </div>

        <footer class="cg-meta">Last updated: January 2026</footer>
      </div>
    </section>
  </main>
</body>
```

- [ ] **Step 3: Restyle `now/index.html` visible body**

Use:

```html
<body>
  <main class="cg-shell utility-shell">
    <section class="cg-main">
      <article class="cg-text-slab utility-panel">
        <div class="cg-kicker">current status / manual</div>
        <h1>Now</h1>
        <h2>Now</h2>
        <ul>
          <li>Example: shipping small utilities for hellointernet</li>
          <li>Example: refining lab experiments 001-002</li>
          <li>Example: keeping meetings to a minimum</li>
        </ul>
        <h2>Not now</h2>
        <ul>
          <li>Example: no new integrations until current stack is stable</li>
          <li>Example: ignoring cosmetic polish in favor of utility</li>
        </ul>
        <h2>Direction</h2>
        <ul>
          <li>Example: converge on one dependable delivery pipeline</li>
          <li>Example: ship or archive experiments quickly</li>
        </ul>
        <p><a class="cg-root-link" href="https://hellointernet.lol">back to root</a></p>
      </article>
    </section>
  </main>
</body>
```

- [ ] **Step 4: Restyle redirect pages**

For `resume/index.html`, keep redirect behavior and use:

```html
<body>
  <main class="cg-shell utility-shell">
    <section class="cg-main">
      <div class="cg-panel utility-panel">
        <div class="cg-kicker">redirect / canonical resume</div>
        <h1>Opening resume</h1>
        <p>Redirecting to the canonical resume.</p>
        <a class="cg-command" href="https://hellointernet.lol/resume"><span>$ continue</span><span>hellointernet.lol/resume</span></a>
      </div>
    </section>
  </main>
</body>
```

For `store/index.html`, keep redirect behavior and use:

```html
<body>
  <main class="cg-shell utility-shell">
    <section class="cg-main">
      <div class="cg-panel utility-panel">
        <div class="cg-kicker">redirect / store</div>
        <h1>Opening store</h1>
        <p>Redirecting to Gumroad.</p>
        <a class="cg-command" href="https://gumroad.com/hellointernet"><span>$ continue</span><span>gumroad</span></a>
      </div>
    </section>
  </main>
</body>
```

- [ ] **Step 5: Add static-only utility CSS**

Add this inline page-local style to each static page after the shared stylesheet link:

```html
<style>
  .utility-shell {
    display: block;
    max-width: 760px;
  }

  .utility-panel {
    margin: 0 auto;
  }
</style>
```

- [ ] **Step 6: Verify static entrypoints**

Run:

```bash
test -f links/index.html
test -f now/index.html
test -f resume/index.html
test -f store/index.html
```

Expected: no output and exit code 0.

- [ ] **Step 7: Commit static utility changes**

Run:

```bash
git add links/index.html now/index.html resume/index.html store/index.html links/command-glass.css now/command-glass.css resume/command-glass.css store/command-glass.css
git commit -m "style: apply command shell to static utilities"
```

## Task 7: Deploy Tree Redirect Styling And Full Verification

**Files:**
- Modify: `scripts/build-porkbun-deploy-tree.sh`

- [ ] **Step 1: Update generated artifacts redirect**

In `scripts/build-porkbun-deploy-tree.sh`, update `write_redirect()` so the generated redirect page includes `command-glass.css`:

```bash
write_redirect() {
  local dest="$1"
  local target="$2"
  local title="$3"
  mkdir -p "$dest"
  cp "$ROOT/shared/command-glass.css" "$dest/command-glass.css"
  cat > "$dest/index.html" <<HTML
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta http-equiv="refresh" content="0; url=$target">
    <link rel="canonical" href="$target">
    <link rel="stylesheet" href="/command-glass.css">
    <title>$title</title>
  </head>
  <body>
    <main class="cg-shell utility-shell">
      <section class="cg-main">
        <div class="cg-panel utility-panel">
          <div class="cg-kicker">redirect / artifacts</div>
          <h1>Opening artifacts</h1>
          <p>Redirecting to the canonical work index.</p>
          <a class="cg-command" href="$target"><span>\$ continue</span><span>$target</span></a>
        </div>
      </section>
    </main>
  </body>
</html>
HTML
}
```

- [ ] **Step 2: Build all Astro surfaces**

Run:

```bash
cd public-root && npm run build
cd ../lab && npm run build
cd ../notes && npm run build
cd ../signal && npm run build
```

Expected: all four builds complete.

- [ ] **Step 3: Build the Porkbun deploy tree**

Run:

```bash
bash scripts/build-porkbun-deploy-tree.sh
```

Expected: command completes and reports required entrypoints including `index.html`, `lab/index.html`, `signal/index.html`, `wiki/index.html`, `links/index.html`, `now/index.html`, `resume/index.html`, `store/index.html`, and `artifacts/index.html`.

- [ ] **Step 4: Verify shared CSS exists in deploy outputs**

Run:

```bash
test -f .porkbun-deploy/command-glass.css
test -f .porkbun-deploy/lab/command-glass.css
test -f .porkbun-deploy/wiki/command-glass.css
test -f .porkbun-deploy/signal/command-glass.css
test -f .porkbun-deploy/links/command-glass.css
test -f .porkbun-deploy/now/command-glass.css
test -f .porkbun-deploy/resume/command-glass.css
test -f .porkbun-deploy/store/command-glass.css
test -f .porkbun-deploy/artifacts/command-glass.css
```

Expected: no output and exit code 0.

- [ ] **Step 5: Commit deploy script change**

Run:

```bash
git add scripts/build-porkbun-deploy-tree.sh
git commit -m "deploy: style generated artifacts redirect"
```

## Task 8: Local Preview And Visual Checks

**Files:**
- No source files unless visual inspection finds a defect.

- [ ] **Step 1: Preview root surface**

Run:

```bash
cd public-root && npm run preview -- --host 127.0.0.1
```

Expected: Astro preview starts and prints a local URL.

- [ ] **Step 2: Inspect representative routes**

Open these pages in the preview or browser:

```text
/
/work
/work/005
/hire
/resume
/about/faq
/about/no
```

Expected:

- No horizontal overflow on mobile width.
- Navigation remains usable.
- Text contrast is readable.
- Cards and command rows have visible focus states.
- No text overlaps or clipped controls.

- [ ] **Step 3: Stop preview server**

Stop the `npm run preview` process with `Ctrl-C`.

- [ ] **Step 4: Commit any visual fixes**

If source changes were made during inspection:

```bash
git add public-root/src lab/src notes/src signal/src links now resume store shared
git commit -m "fix: polish command glass responsive layout"
```

If no fixes were needed, skip this commit.

## Task 9: Notes Update

**Files:**
- Modify: `/home/joshua/Obsidian Vault/Titan Setup/12 - Ultimate Ricing Guide.md`

- [ ] **Step 1: Add website design-system note**

Add a short bullet near the existing `gruvbox-command-glass-design` reference:

```markdown
- `hellointernet.lol` uses the [[gruvbox-command-glass-design]] system across root, lab, wiki, signal, links, now, resume, and store surfaces. Keep future public surfaces visually aligned with this command shell unless a new design spec explicitly changes it.
```

- [ ] **Step 2: Commit notes update if the vault is tracked**

Check whether the vault file is in a git repo:

```bash
git -C "/home/joshua/Obsidian Vault" status --short
```

If it is tracked and the repo is usable, commit:

```bash
git -C "/home/joshua/Obsidian Vault" add "Titan Setup/12 - Ultimate Ricing Guide.md"
git -C "/home/joshua/Obsidian Vault" commit -m "docs: note hellointernet command glass design"
```

If the vault is not a git repo, leave the edited note uncommitted and mention that in the final handoff.

## Task 10: Follow-On Surface Planning

**Files:**
- Create: `docs/superpowers/specs/2026-05-23-future-surfaces-design.md`

- [ ] **Step 1: Create future-surfaces planning spec**

Create `docs/superpowers/specs/2026-05-23-future-surfaces-design.md` with:

```markdown
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
```

- [ ] **Step 2: Commit future-surfaces spec**

Run:

```bash
git add docs/superpowers/specs/2026-05-23-future-surfaces-design.md
git commit -m "docs: plan future site surfaces"
```

## Final Verification

- [ ] Run:

```bash
git status --short
```

Expected: no uncommitted source changes except generated ignored output such as `.porkbun-deploy/`, `dist/`, `.astro/`, or untracked local preview artifacts.

- [ ] Summarize:

```text
- Commits created
- Builds run
- Preview routes inspected
- Obsidian note update status
- Future surfaces planning spec path
```
