# Kaggle GPU endpoint — how it fits the pipeline

Settled 2026-10-27: Kaggle (account "Mars FMMG", signed in via
Google) is the show's GPU endpoint. T4 x2 live; ~22h03m of the 30h
weekly GPU quota remained at wiring time. Session options on
Kaggle showed exactly: None / GPU T4 x2 / TPU v5e-8.

- Notebook: mochiichao-comfyui-wan.ipynb (this folder) — ComfyUI
  headless API + Wan 2.2 (Apache-2.0, the house base per
  FULLSTACK-WIRING) + the triple-lock nodes (IP-Adapter,
  ControlNet aux, Manager). Character LoRAs are trained ONLY on
  the owner's own art (Likeness Law) and dropped in per batch.
- Quota discipline: batch per scene, kill idle sessions, prefer
  the 5B TI2V for drafts and reserve the 14B for finals.
- Staging rule applies: weight MASTERS live on TeraBox; Kaggle
  pulls a working set per session (or reads a private Kaggle
  Dataset snapshot for speed — dataset is a cache, TeraBox is the
  warehouse). Outputs download per batch into the workspace and
  ration into the repo via manifests (SHA-256), never bulk media
  into git.
- The notebook is authored + versioned here; running it happens
  in the owner's Kaggle (import the .ipynb, set Accelerator =
  GPU T4 x2, Run All). First live run = first generative scene
  batch, gated by the automated likeness gate before anything
  ships (UNIFIED-PIPELINE).
