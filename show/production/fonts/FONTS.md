# Show brand fonts (pull-in programme, 2026-10-28)

The show's two identity fonts, staged in-repo so no seat ever
re-downloads them. Neither font existed anywhere in this repo or
on the production VM before this staging (checked 2026-10-28).

| Font | Role | File | Bytes | sha256 |
|---|---|---|---:|---|
| Bungee (Regular) | display / titles | `Bungee-Regular.ttf` | 118,996 | `c4f5361ce120af3e6b9156d0bf379fa19cda2ea0cd18ac01fd99596c6bf66e3f` |
| Fredoka (variable, wdth+wght) | rounded body / cards | `Fredoka[wdth,wght].ttf` | 159,184 | `2ba02e68b152868aef9ba28e24b3648c7d457fe6f25c761f2c2c53fb61a73fc8` |

Licence: **SIL Open Font License 1.1** (open source) for both —
verified at source 2026-10-28: the OFL.txt files shipped in the
google/fonts repository beside each font (staged here as
`OFL-Bungee.txt`, © The Bungee Project Authors, and
`OFL-Fredoka.txt`). Source:
`github.com/google/fonts` → `ofl/bungee/`, `ofl/fredoka/`.
OFL permits commercial use, embedding and redistribution with
the licence text — both conditions satisfied by staging the
licence files alongside.
