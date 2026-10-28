# DATASET-SOURCES — Mochiichao character LoRA training sets

Built by `build_datasets.py` (this folder) on 2026-10-28. **Canon art only** — no donor-production art (construction-kit rule).

## What counts as a source here

- **Canon cutout of record** — the transparent RGBA cutout in `~/workspace/mochiichao-show/canon-cutouts/`.
- **TextRig build frames** — frames rendered by the show's TextRig whole-image deform rig over the canon cutout. The character-sheet manifest states the rig texture md5 equals the canon cutout md5 and 'the rig deforms the canon pixels themselves — no redraw'. These give real pose variation of the same canon pixels.
- **Dorowani only: avatar-stack poster** — the 1600×1600 transparent poster in `bundles/dorowani/`, the high-resolution canon design used for Doro's avatar stack (same character design as the cutout, finer linework).

## wispkin — trigger `wispkin_mochii` — 26 training images

Horizontal flip used: NO — asymmetric cracked mask + smoke plume; a mirror would teach a non-canon mirrored crack

| # | source file | bytes | sha256 |
|---|---|---|---|
| 1 | `/home/hatch/workspace/mochiichao-show/canon-cutouts/wispkin.png` | 129111 | `b9de2318eb399094ad57fb6e21a388b05601a67425f18f49ff6a5b6408da0523` |
| 2 | `/home/hatch/workspace/mochiichao-show/character-sheets/build/wispkin/float_idle/frames/f000.png` | 85488 | `61ec46ba8cd428d62764fcd4d27e358590aaf38d01907caab20409c15732f33d` |
| 3 | `/home/hatch/workspace/mochiichao-show/character-sheets/build/wispkin/float_idle/frames/f030.png` | 86402 | `b568bf930eae6b1a0d2038bdb1723b2f98651aca9f73428eb83b09a0cb84eb71` |
| 4 | `/home/hatch/workspace/mochiichao-show/character-sheets/build/wispkin/float_idle/frames/f060.png` | 86467 | `00c51c41b3c24aca27628eb1bc75dd9950c04f272f1f10490173acb38f24b9a9` |
| 5 | `/home/hatch/workspace/mochiichao-show/character-sheets/build/wispkin/float_idle/frames/f090.png` | 86511 | `7a2eed1566823265fc952bcc654e1bfb05d9c4d83f3b674acfb66a0378f6a607` |
| 6 | `/home/hatch/workspace/mochiichao-show/character-sheets/build/wispkin/float_up/frames/f000.png` | 85488 | `61ec46ba8cd428d62764fcd4d27e358590aaf38d01907caab20409c15732f33d` |
| 7 | `/home/hatch/workspace/mochiichao-show/character-sheets/build/wispkin/float_up/frames/f024.png` | 84515 | `887d7b07f267181beaff4f953ea79468efe771f6e3b1b785bd1e257308849ce8` |
| 8 | `/home/hatch/workspace/mochiichao-show/character-sheets/build/wispkin/float_up/frames/f048.png` | 81489 | `7b6975473b74c568319341ac69bc4cd4d0dfdf31584c82b7d5e555d7fba7c7de` |
| 9 | `/home/hatch/workspace/mochiichao-show/character-sheets/build/wispkin/float_up/frames/f071.png` | 80559 | `9f818e054be5da26958f97753b6f3ed70164d30c4edf68610da3a34231ac0346` |
| 10 | `/home/hatch/workspace/mochiichao-show/character-sheets/build/wispkin/mask_tilt_left/frames/f000.png` | 85487 | `cebf3359cc2d2a62cb65f564d5beb3ccec105e0abbbedede3fea25fd6e2d518f` |
| 11 | `/home/hatch/workspace/mochiichao-show/character-sheets/build/wispkin/mask_tilt_left/frames/f012.png` | 86240 | `12f172ead398284a68bcdf14475d29a099a1643ca507c02c04e36ca175eb75cf` |
| 12 | `/home/hatch/workspace/mochiichao-show/character-sheets/build/wispkin/mask_tilt_left/frames/f024.png` | 86661 | `4139bc900ff6b46ba468b594b36c5eacc6979337f386e3c1737c762e389bbcc1` |
| 13 | `/home/hatch/workspace/mochiichao-show/character-sheets/build/wispkin/mask_tilt_left/frames/f036.png` | 86661 | `4139bc900ff6b46ba468b594b36c5eacc6979337f386e3c1737c762e389bbcc1` |

Training images: `{name}_001.png` … `{name}_{info['count']:03d}.png`, each with a same-stem `.txt` caption starting with the trigger token. Per-image view/caption list is in `datasets/dataset-build.json`.

## dorowani — trigger `dorowani_mochii` — 28 training images

Horizontal flip used: yes (near-symmetric design)

| # | source file | bytes | sha256 |
|---|---|---|---|
| 1 | `/home/hatch/workspace/mochiichao-show/canon-cutouts/dorowani.png` | 123418 | `a255fbb00af9c0eda45fb28aee1251302968d88f4b89f19f84b173f93b536cbf` |
| 2 | `/home/hatch/workspace/mochiichao-show/bundles/dorowani/dorowani.transparent.png` | 948171 | `2de3ec92e32572ad211812733587786742c59165d46966c5f3880ac56ca04fac` |
| 3 | `/home/hatch/workspace/mochiichao-show/character-sheets/build/dorowani/idle_breathe/frames/f000.png` | 149066 | `f138d057f0e98e6ef232e83c7e1c4ef0168419608c726afbabf154a9463e1397` |
| 4 | `/home/hatch/workspace/mochiichao-show/character-sheets/build/dorowani/idle_breathe/frames/f030.png` | 151150 | `adcf0f4da5ea39f4179078194ee92c57b73e75de469364136bf788e2d6f977e4` |
| 5 | `/home/hatch/workspace/mochiichao-show/character-sheets/build/dorowani/idle_breathe/frames/f060.png` | 152924 | `a2885ff4749479cbd9f6eebf75e8da77da88a9b24c670f2ab466198e32ed9375` |
| 6 | `/home/hatch/workspace/mochiichao-show/character-sheets/build/dorowani/idle_breathe/frames/f090.png` | 151350 | `83880876f46fd8434765fabd340d89ddc7e3feb7329dc163efd11cc20679c78d` |
| 7 | `/home/hatch/workspace/mochiichao-show/character-sheets/build/dorowani/water_orb_charge/frames/f000.png` | 149066 | `f138d057f0e98e6ef232e83c7e1c4ef0168419608c726afbabf154a9463e1397` |
| 8 | `/home/hatch/workspace/mochiichao-show/character-sheets/build/dorowani/water_orb_charge/frames/f026.png` | 143501 | `7502ccd0ef80f82898639a3e5a8f65a852248c42714a21805bb4e247dfc77d51` |
| 9 | `/home/hatch/workspace/mochiichao-show/character-sheets/build/dorowani/water_orb_charge/frames/f052.png` | 143413 | `a769f65750d1ee9e71dfc138437ece58d8fb0c4d0b5ed031ed5b7a0c0ac93bbf` |
| 10 | `/home/hatch/workspace/mochiichao-show/character-sheets/build/dorowani/water_orb_charge/frames/f077.png` | 149343 | `6efcd22c5089d8b630c0686cd66a5119d57e24e3562a71473d0bdff115172cdb` |
| 11 | `/home/hatch/workspace/mochiichao-show/character-sheets/build/dorowani/fin_flick/frames/f000.png` | 149086 | `08061f7cd9e7cde8d28a7e169dd8800271a91f08bce33c0869da047fcc2bd76d` |
| 12 | `/home/hatch/workspace/mochiichao-show/character-sheets/build/dorowani/fin_flick/frames/f012.png` | 149899 | `0a10fcbc57a90030d51469591bb30d154ac6bdfef0f544aaa2f2afcc2882e92e` |
| 13 | `/home/hatch/workspace/mochiichao-show/character-sheets/build/dorowani/fin_flick/frames/f024.png` | 149884 | `2a12eee75a4e0c456edbf85c6288d6f13d88b8c733e2d17fa7ee77d6213f04d4` |
| 14 | `/home/hatch/workspace/mochiichao-show/character-sheets/build/dorowani/fin_flick/frames/f035.png` | 149109 | `9dec140cad51ded19fc824cf7d0125feb6f4bd089ca3d9e05d8f559301d784a9` |

Training images: `{name}_001.png` … `{name}_{info['count']:03d}.png`, each with a same-stem `.txt` caption starting with the trigger token. Per-image view/caption list is in `datasets/dataset-build.json`.
