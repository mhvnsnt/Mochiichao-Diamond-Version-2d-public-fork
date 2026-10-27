# Howler.js — tool note (Step 4, VFX + sound support) — NEW this pass
Source: howler.js, JavaScript audio library for the modern web.
Licence: MIT (per its own licence header, as reported in search results).
What it is: defaults to Web Audio API, falls back to HTML5 Audio; one API
for volume / fade / rate / seek / mute; sound sprites (one audio file,
named regions — e.g. impact regions cut by start/end ms) so many short
battle sounds share one download; 3D / stereo panning support; no
dependencies, ~7 kb gzipped as reported.
What it is NOT: not a synthesiser and not a music sequencer — Tone.js
(already pulled by the world lane) keeps owning music/sequencing; Howler
owns short SFX playback. Do NOT vendor howler source into the repo
without the Step 4 agent's dependency decision; it is an npm candidate.
Wiring target: Step 4 agent — SFX playback layer behind the battle
timeline's contact event (impact sound fires on the contact frame, see
step1 hit-stop spec) and the VFX cue bus; the existing title-music files
are untouched (title/intro v1 are drafts, boot chime M3 is the only chosen
track — that decision lives in the Title Music lane, not here).
Gate: 20 rapid impact sounds in a row play without drop-out, clipping, or
a late first frame; muted state silences SFX without stopping the timeline.
