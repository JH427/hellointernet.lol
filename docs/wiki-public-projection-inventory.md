# LLM Wiki Public Projection — Source Inventory

Generated: May 25, 2026
Source: ~/Obsidian Vault/LLM Wiki/

---

## Summary

| Category | Count | Notes |
|---|---|---|
| Concepts (permanent notes) | 23 | Core knowledge docs |
| Entities (project/person) | 8 | hellointernet.lol, Titan, Rick, FAE, etc. |
| Raw articles (ingested) | 27 | Bookmarked web content |
| Raw notes (project/process) | 16 | Project-specific notes |
| Raw references | 1 | Hosting docs |
| Raw transcripts | 5 | User requests/clarifications |
| Queries | 2 | Research outputs |
| Meta | 3 | _meta docs, SCHEMA, AGENTS |
| Other (Titan Setup) | 14 | Separate from LLM Wiki |
| **Total in LLM Wiki** | **~119** | |

---

## Recommended Allowlist for Public Projection

### ✅ Concepts — Safe to publish

```
concepts/agent-managed-websites-workflow.md        (public project knowledge)
concepts/agent-systems-and-tooling.md               (generic agent tooling)
concepts/compiled-knowledge.md                     (knowledge-base theory)
concepts/fae-intelligence-source-stack.md           (public FAE stack)
concepts/frontend-design-systems-and-taste.md       (design taste doc)
concepts/llm-wiki.md                               (about the wiki itself)
concepts/openrouter-free-model-routing.md          (public routing guide)
concepts/personal-ai-operating-stack.md             (general OS stack)
concepts/self-hosting-and-local-infrastructure.md  (self-hosting notes)
concepts/titan-dev-and-codex-workflow.md            (titan dev setup)
concepts/titan-gaming-gpu-policy.md                 (gaming GPU notes)
concepts/titan-rice-customization.md                (rice/customization)
concepts/titan-services-and-troubleshooting.md      (titan services)
concepts/wiki-maintenance-workflow.md               (wiki workflow)
```

### ✅ Entities — Mostly safe, review each

```
entities/andrej-karpathy.md                        (public figure)
entities/fully-automated-enterprises.md             (FAE — public project)
entities/hellointernet-lol.md                       (hellointernet.lol — public)
entities/live-avatar-project.md                    (project overview)
entities/narsil-gregs-api.md                       ⚠️ INTERNAL INFRA
entities/rick-hermes-agent.md                      (about Rick — public)
entities/titan-arch-hyprland-setup.md              ⚠️ INTERNAL SETUP
entities/titan-hermes-discord-gateway.md           ⚠️ DISCORD CREDENTIALS
```

### ✅ Raw Articles — After sanitization (URLs only, no private notes)

```
raw/articles/bookmark-*.md                          (ingested bookmarks)
  → Strip any personal annotations before publishing
  → Likely safe if just URL + title + excerpt
  → Best candidates: a16z, huggingface, design refs
```

### ❌ Exclude — Private/Raw

```
raw/transcripts/user-*.md                           (private user requests)
raw/notes/discord-hermes-setup-titan.md            (credentials)
raw/references/porkbun-static-hosting-github-connect-2026-05-23.md (hosting credentials)
entities/narsil-gregs-api.md                        (internal API keys)
entities/titan-hermes-discord-gateway.md            (Discord tokens)
concepts/liveportrait-nvidia-setup.md               (GPU config — specific machine)
concepts/deep-live-cam-setup.md                     (internal workflow)
concepts/creepy-avatar-bridge.md                    (internal project)
concepts/ghostrigger-ai.md                          (internal project)
concepts/gruvbox-command-glass-design*.md           (design reference — sensitive)
```

### ⚠️ Review — Case by case

```
queries/board-autonomy-blockers-2026-05-12.md       (depends on content)
queries/hellointernet-porkbun-deployment-research-2026-05-23.md (depends on content)
raw/notes/projects-live-avatar-*.md                  (internal project)
raw/notes/titan-setup-*.md                          (titan-specific setup)
```

---

## Next Steps

1. **Joshua reviews this allowlist** — confirms what's public-safe
2. **Create sanitization script** — strip private frontmatter, credentials, internal references
3. **Process in order**: concepts first, then entities, then raw articles
4. **Build and preview** before deploy

---

## Notes

- `raw/` notes include personal annotations from bookmark ingestion — clean before publishing
- `log.md` (33KB) is a raw session log — likely exclude entirely
- `raw/transcripts/` are explicitly user private communications — exclude
- Titan Setup notes (~14 files) are separate from LLM Wiki proper — decide separately