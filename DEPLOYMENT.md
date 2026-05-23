# hellointernet.lol deployment runbook

Current status: deployment automation is not configured yet. GitHub is the source of truth; Porkbun Static Hosting / GitHub Connect is the first host path to evaluate.

## Repository shape

This is a multi-surface repo. Do not deploy the repository root as a single app.

Astro surfaces:

| Surface | Source path | Expected host |
| --- | --- | --- |
| Root | `public-root/` | `hellointernet.lol` |
| Lab | `lab/` | `lab.hellointernet.lol` |
| Notes/Scratch | `notes/` | notes/scratch subdomain, exact mapping TBD |
| Signal | `signal/` | `signal.hellointernet.lol` |

Static/redirect surfaces:

| Surface | Source path | Build step |
| --- | --- | --- |
| Links | `links/` | none |
| Now | `now/` | none |
| Resume | `resume/` | none |
| Store | `store/` | none |

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

## Preferred Porkbun/GitHub Connect experiment

Because Porkbun Static Hosting's GitHub behavior is not yet proven for this repo, assume it may publish branch contents directly until verified.

Safe experiment path:

1. Keep `main` as source.
2. Build each Astro surface in CI/local automation.
3. Assemble a static artifact tree matching Porkbun's domain/subdomain mapping.
4. Push artifacts to a dedicated deploy branch, such as `porkbun-deploy`.
5. Connect Porkbun GitHub Connect to the deploy branch, not source `main`, unless Porkbun proves it can install/build from subdirectories and publish `dist/` outputs.
6. Verify live routes before treating the deployment path as stable.

## Manual artifact layout concept

A future deploy branch may need a layout like:

```text
/
  index.html                 # from public-root/dist
  assets/                    # from public-root/dist
  lab/ or subdomain artifact # depends on Porkbun mapping
```

Do not finalize this layout until Porkbun's static hosting domain/subdomain mapping is verified.

## Verification after deploy

At minimum check:

- `https://hellointernet.lol/`
- representative root pages/artifacts
- `https://lab.hellointernet.lol/`
- `https://signal.hellointernet.lol/`
- any enabled notes/scratch surface
- redirect/utility surfaces once mapped
- CSS/JS assets for each Astro surface

## Open questions before automation

- Whether Porkbun GitHub Connect can build from source or only publish branch contents.
- Whether it supports multiple subdomains from one repo/branch.
- Exact notes/scratch domain mapping.
- Which subdomains launch in v0.1.
- Whether redirect-only surfaces are served by Porkbun static files, DNS redirects, or another mechanism.
