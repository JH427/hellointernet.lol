# Agent instructions for hellointernet.lol

This repo contains Joshua's personal internet root as a set of independent static surfaces. Treat each top-level folder as a separate site or utility mapped to a domain/subdomain.

## Operating model

- GitHub is the canonical source of truth.
- Each surface should stay small, static-first, and independently deployable.
- Do not collapse this repo into one monolithic Astro app.
- Subdomains are interfaces, not categories.
- Content can be rougher on lab/notes/signal than on the root site.

## Surfaces

Astro build surfaces:

- `public-root/` -> `hellointernet.lol`
- `lab/` -> `lab.hellointernet.lol`
- `notes/` -> `wiki.hellointernet.lol`
- `signal/` -> `signal.hellointernet.lol`

Static/redirect surfaces with no build step:

- `links/`
- `now/`
- `resume/`
- `store/`

Configured Porkbun paths:

- `artifacts` -> `/artifacts`
- `lab` -> `/lab`
- `signal` -> `/signal`
- `wiki` -> `/wiki`
- `links` -> `/links`
- `now` -> `/now`
- `resume` -> `/resume`
- `store` -> `/store`

## Safe edit surfaces

Low-risk content edits, after inspecting current files:

- Markdown/content files under an Astro surface's `src/content/`
- Static HTML copy edits in `links/`, `now/`, `resume/`, and `store/`
- README/runbook docs

Higher-risk surfaces requiring explicit Joshua approval:

- Astro layouts, components, routes, and config
- `package.json` or lockfiles
- GitHub Actions, deployment scripts, DNS, hosting config, redirects, public claims, secrets, credentials, private keys
- Changes that merge, remove, or rename top-level surfaces

## Required checks

For Astro surfaces, run the affected surface build before committing:

```bash
cd public-root && npm ci && npm run build
cd lab && npm ci && npm run build
cd notes && npm ci && npm run build
cd signal && npm ci && npm run build
```

For repo-wide CI parity, all four Astro surfaces must build and the static entrypoints must exist:

```bash
for surface in public-root lab notes signal; do
  (cd "$surface" && npm ci && npm run build)
done
for surface in links now resume store; do
  test -f "$surface/index.html"
done
```

If a visual/layout route changed, also preview the affected Astro surface locally:

```bash
npm run preview -- --host 127.0.0.1
```

## Secrets and generated files

Never commit:

- `.env` or `.env.*`
- hosting credentials
- SSH private keys
- GitHub tokens
- generated `dist/`
- `.astro/`
- `node_modules/`
- local editor/cache directories

## Deployment posture

Deployment automation publishes a generated static artifact tree to `porkbun-deploy`, and Porkbun GitHub Connect is connected to that branch. Do not connect source `main` to Porkbun hosting. Verify live root/subdomain routes after deployment-significant changes.
