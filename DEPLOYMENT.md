# hellointernet.lol deployment runbook

Current status: Porkbun Static Hosting subdomain folder mappings are configured. GitHub remains the source of truth. The preferred deploy path is to publish generated static artifacts to the `porkbun-deploy` branch and connect Porkbun GitHub Connect to that branch.

## Repository shape

This is a multi-surface repo. Do not deploy the repository root as a single app.

Astro surfaces:

| Surface | Source path | Expected host |
| --- | --- | --- |
| Root | `public-root/` | `hellointernet.lol` |
| Lab | `lab/` | `lab.hellointernet.lol` |
| Wiki | `notes/` | `wiki.hellointernet.lol` |
| Signal | `signal/` | `signal.hellointernet.lol` |

Static/redirect surfaces:

| Surface | Source path | Build step |
| --- | --- | --- |
| Links | `links/` | none |
| Now | `now/` | none |
| Resume | `resume/` | none |
| Store | `store/` | none |

Porkbun folder mappings configured by Joshua:

| Subdomain | Porkbun path | Source / behavior |
| --- | --- | --- |
| `artifacts` | `/artifacts` | static redirect to canonical root `/work/` |
| `lab` | `/lab` | `lab/dist/` |
| `signal` | `/signal` | `signal/dist/` |
| `wiki` | `/wiki` | `notes/dist/` |
| `links` | `/links` | `links/` |
| `now` | `/now` | `now/` |
| `resume` | `/resume` | `resume/` |
| `store` | `/store` | `store/` |

## Build checks

Run all Astro builds before publishing generated artifacts:

```bash
for surface in public-root lab notes signal; do
  (cd "$surface" && npm ci && npm run build)
done
for surface in links now resume store; do
  test -f "$surface/index.html"
done
```

GitHub Actions runs the same checks on pushes and pull requests to `main`.

## Preferred Porkbun/GitHub Connect path

Because Porkbun Static Hosting's GitHub behavior appears to publish selected branch contents directly, do not connect Porkbun to source `main`. Connect it to the generated `porkbun-deploy` branch after inspecting the first generated artifact tree.

Safe path:

1. Keep `main` as source.
2. Build each Astro surface in CI/local automation.
3. Assemble a static artifact tree matching Porkbun's domain/subdomain mapping.
4. Push artifacts to the dedicated `porkbun-deploy` branch.
5. Connect Porkbun GitHub Connect to `porkbun-deploy`, not source `main`.
6. Verify live routes before treating the deployment path as stable.

## Artifact layout

The generated branch should use this layout:

```text
/
  index.html                 # from public-root/dist/
  _astro/                    # from public-root/dist/_astro/ if generated
  artifacts/                 # redirect to https://hellointernet.lol/work/
  lab/                       # from lab/dist/
  signal/                    # from signal/dist/
  wiki/                      # from notes/dist/
  links/                     # from links/
  now/                       # from now/
  resume/                    # from resume/
  store/                     # from store/
```

Generate it locally with:

```bash
scripts/build-porkbun-deploy-tree.sh
```

GitHub Actions workflow `.github/workflows/porkbun-deploy.yml` can publish this tree to `porkbun-deploy`.

## Verification after deploy

At minimum check:

- `https://hellointernet.lol/`
- representative root pages/artifacts
- `https://artifacts.hellointernet.lol/`
- `https://lab.hellointernet.lol/`
- `https://signal.hellointernet.lol/`
- `https://wiki.hellointernet.lol/`
- `https://links.hellointernet.lol/`
- `https://now.hellointernet.lol/`
- `https://resume.hellointernet.lol/`
- `https://store.hellointernet.lol/`
- CSS/JS assets for each Astro surface

## Open questions before treating deployment as stable

- Whether Porkbun GitHub Connect reliably syncs from the generated `porkbun-deploy` branch.
- Whether `artifacts.hellointernet.lol` should remain a redirect to `/work/` or become a dedicated surface later.
- Whether redirect-only surfaces are served correctly as Porkbun static files or should move to DNS/hosting redirects.
