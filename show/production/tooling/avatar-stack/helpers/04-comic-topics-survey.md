# 04 — GitHub topics survey: `comic-generator` + `ai-comic-creator`

**Survey only**, 2026-10-28, via GitHub topic search (PAT connector).
Licences below are the GitHub API's per-repo licence field — a glance,
not a LICENSE-file read; nothing here is wired, so no repo needed the
full verification pass. **Use boundary (owner addendum): comic-panel
output is storyboard / marketing material, never episode footage.**

## `topic:comic-generator` — 22 repos

Top by stars (licence at a glance):

| Repo | Stars | Licence (API) | What it is, one line |
|---|---|---|---|
| stockedge/manga-generator | 122 | MIT | Script→image→layout→PDF manga tool (Codex-oriented) |
| kianaliang-dev/drama-director-skill | 34 | MIT | Comic-drama skill on GPT Image + Seedance 2.0 (paid APIs) |
| remsky/comic-chat-web | 18 | AGPL-3.0 | Microsoft Comic Chat port — chat strips, not story comics |
| RemiPelloux/agent-mangaka-forge | 17 | MIT | Manga page skill pack, persistent character image memory |
| RobinaMirbahar/Comic-Studio-Ai | 16 | Apache-2.0 | Multi-agent comic generator on the Gemini API (paid slot) |
| phaethix/inkstone | 12 | MIT | Local-first novel-to-comic, "free, no GPU, pluggable providers" |
| CallmeTruong/Comic_Studio | 11 | none listed | LangGraph + local SD 1.5 comic books |
| kdjfs/plot2panel | 2 | MIT | Four-panel comics, DeepSeek + pluggable image providers |
| Saeyeon-developer/agent-comic-kit | 2 | Apache-2.0 | Agent comic kit: storyboard, lettering, SNS formats (GPT Image relay) |

The remaining 13 are ≤5 stars, several with no licence listed at all.

## `topic:ai-comic-creator` — 2 repos

| Repo | Stars | Licence (API) | What it is |
|---|---|---|---|
| gzxx-2025/aid-studio | 1,158 | MIT | AI comic/short-drama/film platform: script, characters/scenes, storyboard, image+video generation, dubbing, preview; multi-model, self-deployable |
| Guido1Alessandro1Trevisan/oniichan-ai | 4 | none listed | Manga generator web app |

## Verdict

- **No wiring.** The survey's job was discovery; two repos pass a
  first-glance screen for a FUTURE full verification if a storyboard
  tool is ever wanted: `phaethix/inkstone` (local-first, MIT, no GPU —
  the only one whose shape matches our free rule) and
  `gzxx-2025/aid-studio` (MIT, large, but multi-model hosted-API
  shaped like AIComicBuilder — its free layer would need the same
  paid-slot surgery as item 01). Naming them here is a pointer, not
  an adoption: neither has had its LICENSE file or code read.
- Everything else is either paid-API-fronted, unlicenced, a chat/
  layout toy, or redundant with item 01's adapter, which already
  produces storyboard-shaped output (scene-job + SRT) from our own
  stack.
