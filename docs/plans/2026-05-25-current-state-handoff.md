# Current State Handoff: hellointernet.lol + fullyautomated.enterprises

Date: 2026-05-25
Reason: pause active work and preserve exact current state while Codex budget is low.

## Repos

### hellointernet.lol
- Canonical source repo: `/home/joshua/projects/hellointernet-lol`
- Branch: `main`
- HEAD: `f901a9d`
- Git status: clean

### fullyautomated.enterprises
- Canonical source repo: `/home/joshua/projects/fullyautomated-enterprises`
- Branch: `main`
- HEAD: `7d59570`
- Git status: clean

## hellointernet.lol: current state

### Design/system state
- Root homepage no longer uses the old literal graph concept; it now uses the ambient geometric command-glass direction.
- Root, resume, hire, links, now, and store were already unified into the shared command-glass visual system.
- This pass added real source surfaces for:
  - `contact/`
  - `this/`
  - `scratch/`
  - `ops/`
- Root nav/secondary routing now expose `contact` and `this`.

### Content/role decisions
- `contact.hellointernet.lol`: real action surface, email-first.
- `this.hellointernet.lol`: real explainer for why the site is split into multiple surfaces.
- `scratch.hellointernet.lol`: intentionally deferred; points to wiki as the canonical public notes lane.
- `ops.hellointernet.lol`: public boundary page only; not a public runbook dump.
- `artifacts.hellointernet.lol`: still intentionally a redirect to `/work/`.

### Deployment state
- Source branch is `main`.
- Generated host-shaped tree is built by:
  - `bash scripts/build-porkbun-deploy-tree.sh`
- Deploy workflow to `porkbun-deploy` passed after commit `f901a9d`.
- Generated deploy tree now includes folders for:
  - `/contact`
  - `/this`
  - `/scratch`
  - `/ops`

### Verified working
Local/generated deploy tree was verified successfully for:
- `/`
- `/contact/`
- `/this/`
- `/scratch/`
- `/ops/`

Live root-domain paths are working:
- `https://hellointernet.lol/contact/`
- `https://hellointernet.lol/this/`
- `https://hellointernet.lol/scratch/`
- `https://hellointernet.lol/ops/`

### Known unresolved hosting issue
The dedicated hostnames still appear to fall through to the root homepage instead of their new folder-backed surfaces:
- `https://contact.hellointernet.lol/`
- `https://this.hellointernet.lol/`
- `https://scratch.hellointernet.lol/`
- `https://ops.hellointernet.lol/`

Interpretation:
- source is ready
- deploy branch is ready
- content is ready
- Porkbun subdomain folder mappings still need to point those hostnames to `/contact`, `/this`, `/scratch`, and `/ops`

### Documentation added/updated
- `docs/plans/2026-05-26-autonomous-editorial-loop.md`
- `DEPLOYMENT.md`
- `README.md`
- `scripts/build-porkbun-deploy-tree.sh`
- `public-root/src/layouts/BaseLayout.astro`
- `public-root/src/pages/index.astro`

## fullyautomated.enterprises: current state

### Content state
- Site is being transitioned from demo/scaffold posture toward real experiment-backed content.
- Methodology page exists and is live.
- Real lab entries now include:
  - `autonomous-website-maintenance-loop`
  - `research-analyst-operator-split`
  - `agent-handoff-reliability-trial`
- Product framing was tightened to be more honest and incubation-based instead of overclaimed.

### Deployment state
- Last pushed/deployed source commit: `7d59570`
- FAE build and deploy succeeded in the previous pass.
- Live verification was completed for representative pages including methodology, labs, and products.

## Editorial posture going forward

### hellointernet.lol
- Sparse, legible, slightly strange.
- Do not create new surfaces unless they have a distinct job.
- If a surface is unfinished, say so plainly instead of faking completeness.

### fullyautomated.enterprises
- Publish real bounded experiments, methods, and lessons.
- Avoid startup theater, fake certainty, fake metrics, and product claims without artifacts.

## Best next actions when work resumes
1. Fix Porkbun subdomain folder mappings for `contact`, `this`, `scratch`, and `ops`.
2. Tighten `lab` entries so each clearly states outcome and limitation.
3. Prune `signal` harder.
4. Audit `wiki` for low-value fragments and public-safety drift.
5. Continue the next real FAE experiment/content pass.
