# hellointernet.lol deployment runbook

Current status: Porkbun Static Hosting subdomain folder mappings are configured and Porkbun GitHub Connect is connected to the generated `porkbun-deploy` branch. GitHub remains the source of truth.

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
| Contact | `public-root/src/pages/contact.astro` (canonical); `contact/` retained as legacy source | root Astro build |
| Resume | `resume/` | none |
| This | `this/` | none |
| Scratch | `scratch/` | none |
| Ops | `ops/` | none |
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
| `contact` | `/contact` | root Astro `/contact/`; legacy `contact/` is not copied over it |
| `resume` | `/resume` | `resume/` |
| `this` | `/this` | `this/` |
| `scratch` | `/scratch` | `scratch/` |
| `ops` | `/ops` | `ops/` |
| `store` | `/store` | `store/` |

## Build checks

Run all Astro builds before publishing generated artifacts:

```bash
for surface in public-root lab notes signal; do
  (cd "$surface" && npm ci && npm run build)
done
for surface in links now contact resume this scratch ops store; do
  test -f "$surface/index.html"
done
```

GitHub Actions runs the same checks on pushes and pull requests to `main`.

## Porkbun/GitHub Connect path

Because Porkbun Static Hosting publishes selected branch contents directly, do not connect Porkbun to source `main`. Porkbun GitHub Connect is connected to the generated `porkbun-deploy` branch.

Safe path:

1. Keep `main` as source.
2. Build each Astro surface in CI/local automation.
3. Assemble a static artifact tree matching Porkbun's domain/subdomain mapping.
4. Push artifacts to the dedicated `porkbun-deploy` branch.
5. Porkbun GitHub Connect publishes `porkbun-deploy`, not source `main`.
6. Verify live routes after every deployment-significant change.

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
  contact/                   # canonical route from public-root/dist/contact/
  resume/                    # from resume/
  this/                      # from this/
  scratch/                   # from scratch/
  ops/                       # from ops/
  store/                     # from store/
```

Generate it locally with:

```bash
scripts/build-porkbun-deploy-tree.sh
```

GitHub Actions workflow `.github/workflows/porkbun-deploy.yml` can publish this tree to `porkbun-deploy`.

## Multiplexer root and required third-party assets

The approved root is a full-width responsive terminal-only fictional multiplexer.
All visible text uses the original Accelerando-8192 font and real 8,192-token
vocabulary; English accessibility equivalents remain visually clipped. The
native input uses a glyph mirror; token boundaries do not map to the native caret.
Deeper Work/About/Contact and historical routes remain independently reachable.

Publication was explicitly authorized after disclosure that the font's
redistribution license is **UNKNOWN / UNRESOLVED**. This is not license clearance.
The three required files in `public-root/public/local-glyph/` are committed so
clean-clone builds require no withheld local assets. `THIRD_PARTY_NOTICES.txt`
records upstream source, inspected revision and hashes, and separates the
original font (no license grant found) from OpenAI tiktoken's MIT notice.
No upstream song, images or specimen package is included. Do not apply the
MIT notice to the original font or claim that rights have been cleared.

Current acceptance commands (after assembling the tree):

```sh
node tests/multiplex-model.mjs
node tests/built-output.mjs .porkbun-deploy
python3 tests/check-links.py .porkbun-deploy
node tests/multiplex-browser.mjs .porkbun-deploy
# Fresh Chromium against actual public HTTPS, without starting a local server:
TEST_BASE_URL=https://hellointernet.lol node tests/multiplex-browser.mjs
```

The browser-smoke, entrance-browser and passage-terminal entrypoints delegate to
the current multiplexer suite, including responsive deeper-route checks. Use
`SHARP_IGNORE_GLOBAL_LIBVIPS=1` on hosts whose system libvips conflicts with Sharp;
keep the existing lockfiles and dependencies unchanged.

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
- `https://contact.hellointernet.lol/`
- `https://resume.hellointernet.lol/`
- `https://this.hellointernet.lol/`
- `https://scratch.hellointernet.lol/`
- `https://ops.hellointernet.lol/`
- `https://store.hellointernet.lol/`
- CSS/JS assets for each Astro surface

## Open questions before treating deployment as stable

- Whether Porkbun GitHub Connect reliably syncs from the generated `porkbun-deploy` branch.
- Whether `artifacts.hellointernet.lol` should remain a redirect to `/work/` or become a dedicated surface later.
- Whether `contact`, `this`, `scratch`, and `ops` are all mapped in Porkbun yet; if not, the generated folders are ready but live DNS/hosting still needs to point at them.
- Whether redirect-only surfaces are served correctly as Porkbun static files or should move to DNS/hosting redirects.
