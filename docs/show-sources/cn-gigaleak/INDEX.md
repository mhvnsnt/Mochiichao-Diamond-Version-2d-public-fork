# CN Gigaleak — Show Sources Index (Mochiichao)

Prepared 2026-10-27 (Mars / Doro, main + show lanes). Read-only inventory.
**Metadata only. No leak media, and no download / mirror / magnet links,
are committed to this repo — ever.** Media stays where it already lives
(private `cn-gigaleak-*` repos, TorBox, TeraBox) and is *referenced* here.
Game-ready derivatives made from these sources land in
`sprite-art/animation/` (via `tools/avatar-pipeline/` and the existing
sprite tools) and are cross-referenced from each show's SOURCE.md.

## 1. What the "~350GB CN Giga leak" is

- A single file, `Documents/Documents.zip` (350,016,069,416 bytes),
  sourced from a TorBox cached torrent, per
  `mhvnsnt/cn-gigaleak-documents-archive`.
- Stored as raw 2GB slices in that repo's Release
  `documents-zip-slices-v1` (Release assets, not repo files), each with a
  sha256 companion, for verified reassembly.
- Split per-show into 35 private repos `mhvnsnt/cn-gigaleak-<show>`
  covering 27 distinct properties (§3), plus 3 vault/bonus repos.
- **TorBox (live check, 2026-10-27):** its only download is "Documents" —
  350GB, Cached / Download Ready, one Documents.zip. That is the full
  source. Not airlocked, so cached retention is not guaranteed. Options
  exist in-app (share/quick-add, direct link, magnet, export .torrent) —
  none of those values are recorded here or anywhere in this repo.
- **TeraBox (live check, 2026-10-27):** a `CN-Gigaleak` folder exists and
  opens, but it is a **partial** copy (the whole account uses
  34.2GB/1024GB): subfolders fosters, looney-tunes, robot-chicken,
  powerpuff-girls, adventure-time, grim-adventures, ed-edd-n-eddy,
  scooby-doo, teen-titans, space-ghost, plus Regular Show PDFs and
  Animaniacs split files. Its share dialog shows a Permanent, Public
  share link still present — existence noted, value NOT recorded here.
  TeraBox also holds a `music` folder (74 files, mostly .wav).

## 2. The five-show mix for the game + show

The recipe already documented by Mars in `mhvnsnt/cape-jones`
`docs/SHOW-BIBLE.md` (2026-10-14) + `docs/ASSET-INVENTORY.md` — adopted
here as the Mochiichao show mix. One folder per source:

| # | Source | Feeds (game / show) | Status | Folder |
|---|---|---|---|---|
| 1 | The Amazing World of Gumball | 11-min episode format, tone, mixed-media compositing, rigs | HAVE (~18MB repo, show bibles/palettes) | `gumball/` |
| 2 | Teen Titans (2003) | Action spine, team dynamics, battle staging | **GAP — README-only, biggest hole in the mix** | `teen-titans/` |
| 3 | Superman + public-domain / open hero files | Hero designs, champion-tier characters | HAVE (catalog in cape-jones) | `hero-files/` |
| 4 | Space Ghost Coast to Coast | Source art, character-sheet base, deadpan interview framing for show segments | HAVE-partial (~321MB repo; local staging was EMPTY) | `space-ghost/` |
| 5 | Johnny Bravo | Show bible / comedic engine, episode beats | HAVE starter kit (~18MB repo; staging folder was EMPTY) | `johnny-bravo/` |

Candidate additional mix-ins (study set in
`mhvnsnt/TRIPPEDD-Production-studios-` `production/WIZARD_GANG_EP01/animation-study/`):
Foster's Home, Grim Adventures, Robot Chicken — catalogued there from
public production materials; not mixed into Mochiichao yet.

## 3. Full cn-gigaleak family (35 repos, 27 properties)

With actual production files (GitHub-reported repo size):
The Grim Adventures of Billy & Mandy (~1.29GB, largest; + a ~1KB stub
repo) · My Gym Partner's a Monkey (~1.24GB; + stub) · Scooby-Doo!
Mystery Incorporated (~1.05GB) · Space Ghost (~321MB) · Duck Dodgers
(~212MB) · Robot Chicken (~167MB) · Ed, Edd n Eddy (~159MB) ·
The Powerpuff Girls (~131MB; + special stub) · Looney Tunes (~124MB) ·
Dexter's Laboratory (~81MB) · Camp Lazlo (~56MB) · Gumball (~18MB) ·
Johnny Bravo (~18MB) · Cow and Chicken (~17MB; + stub) · Pink Panther
(~13MB) · Regular Show (~2.8MB) · MGM Shorts (small) · OK K.O. (small)

**⚠ Placeholder / README-only — claimed, files have NOT landed (~12):**
Teen Titans, Foster's Home (both repos), Bakugan, Wabbit, Johnny Test,
Scooby-Doo (general), Adventure Time, Codename: Kids Next Door,
I Am Weasel (empty), plus the duplicate stubs noted above.
**Teen Titans is the gap that matters most** — it is #2 in the mix (§2).

Not shows: `cn-gigaleak-documents-archive` (the 350GB slice vault),
`cn-gigaleak-cartoon-vault` (~7MB), `cn-gigaleak-bonus-non-cn` (metadata
only; description names other studios' properties).

## 4. Where things go in this repo

- This folder (`docs/show-sources/cn-gigaleak/`): index + provenance
  only. **No media, no links.**
- `sprite-art/animation/`, `public/assets/`, `src/assets/`: finished,
  game-ready derivatives, made with the repo's own tools
  (`tools/avatar-pipeline/` for character avatar-style bundles).
- Per-source detail, HAVE/GAP, and derivative cross-references:
  the `SOURCE.md` in each subfolder.

## 5. Link existence (existence only — no values recorded)

- In GitHub leak docs: no magnet link found, no mirror download link
  found (checked: cape-jones cloud/inventory/bible docs, TRIPPEDD's
  three animation-study catalogs, documents-archive README).
- In TorBox: full 350GB Documents.zip present, cached, not airlocked;
  in-app share/magnet options exist (values not recorded).
- In TeraBox: CN-Gigaleak folder present (partial copy); a Permanent,
  Public share link is still present in its share dialog (value not
  recorded). That is the live mirror's location, per the main lane's
  2026-10-27 live check.

Deletions in this change: NONE. New files only.
