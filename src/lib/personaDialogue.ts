/**
 * Persona-mode dialogue presentation, Tier 1 — PRESENTATION ONLY.
 *
 * What this is: a framing mode for dialogue scenes. Same characters,
 * same dialogue text, same typewriter / paging / choice behaviour —
 * only the framing changes while the scene runs, and it reverts when
 * the scene ends (the bars and emphasis live inside DialogueBox, so
 * unmounting the box removes them). Style principles only (framing,
 * letterboxing-style presentation, emphasis treatment), built from
 * the repo's own components and palette (StdWindow gold #fbbf24) —
 * no Persona art, fonts, or music copied, no shroud, no nameplate work.
 *
 * Opt-in / non-default: DialogueBox defaults to 'default'. A scene
 * gets persona framing ONLY when its caller explicitly passes
 * presentationMode="persona". Nothing in this file changes the locked
 * default title, the v32 main menu, or any default dialogue look.
 *
 * Tier 1 scope — WHO may receive this mode, and only these:
 * - Luigi Castagnoli: WIRED. Canonical hooks already in the repo:
 *   FullWorldMaps CASTAGNOLI_ISLAND NPC id "luigi_castagnoli",
 *   name "Luigi Castagnoli", and humanSheets slotForNpc routing
 *   id/name containing "castagnoli" to HUMAN_SLOTS.castagnoli.
 *   WorldEngine passes presentationMode="persona" for exactly this
 *   speaker; every other speaker keeps the default.
 * - Mysterious Figure: NOT WIRED — no hook exists to wire. Searched
 *   src + docs on 2026-10-26: no Mysterious Figure NPC, no human
 *   slot, no dialogue scene in the repo. The human-lane workspace
 *   research docs (human-characters/mysterious-figure/) are not game
 *   code and are not repo canon, so this file deliberately has NO
 *   mysterious-figure branch — inventing an id/name here would be
 *   guessing a hook. When the human lane lands a real Mysterious
 *   Figure NPC/slot/scene in the repo, add its canonical id/name
 *   here in the same castagnoli pattern and that scene gets the
 *   mode; DialogueBox itself needs no change.
 *
 * Tier 2 (light touches on other important beats) is queued, NOT
 * this file's scope — do not extend the list below for Tier 2.
 */
export type DialoguePresentationMode = 'default' | 'persona';

/** Height of each letterbox bar while persona framing is active. */
export const PERSONA_LETTERBOX_PX = 48;

/**
 * True only for a Tier 1 persona speaker with a canonical repo hook
 * today: Luigi Castagnoli. Everything else — including any future
 * speaker without a landed hook — returns false and keeps the
 * default dialogue look.
 */
export function personaPresentationForNpc(npc: unknown): boolean {
  if (!npc || typeof npc !== 'object') return false;
  const id = String((npc as { id?: unknown }).id ?? '').toLowerCase();
  const name = String((npc as { name?: unknown }).name ?? '').toLowerCase();
  return id.includes('castagnoli') || name.includes('castagnoli');
}
