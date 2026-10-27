/**
 * Dialogue attribution — Region 1, 2026-10-27.
 *
 * The regions 1-5 dialogue JSONs (src/lib/wiring/dialogue/
 * region1-dialogue.json etc., PR #279) are beat entries, not an
 * NPC-keyed dialog table: each entry lists speakers by role
 * ("Young trainer Jay", "Cave guide") with no NPC id and no map
 * NPC id. Wiring them into DialogueBox by speaker name alone
 * would misattribute lines, and overwriting a map NPC's existing
 * dialog with a JSON line would break the locked-dialogue rule
 * (dialogue already drafted is locked unless Mars changes a line).
 *
 * This module is therefore the attribution step, not a display
 * step: for every Region 1 speaker it records which map NPC (or
 * sign) already carries that line, or why it does not. Nothing
 * here changes WorldEngine dialog; a future call-site must use
 * this table, not a speaker-name guess.
 *
 * Counted 2026-10-27 against live FullWorldMaps.ts (48 keys) and
 * region1-dialogue.json (8 entries, 13 speakers):
 * - exact: 9/13 — the JSON line is byte-identical to a line in
 *   that NPC's dialog array in the map. (Was 8/13; Cave guide was
 *   added to cave_of_echoes in the same PR that updated this
 *   table, so it moved from missing to exact.)
 * - sign: 1/13 — the Mansion log line is in the game as the
 *   Ember Island LOG 7 sign, not as spoken dialog.
 * - divergent: 2/13 — the NPC exists (Youngster Jay, Lass Amy)
 *   but its map dialog and post-battle dialog differ from the
 *   JSON pre/post lines. Do NOT overwrite either draft; Mars
 *   picks the line if he wants them reconciled.
 * - missing: 1/13 — Mochiko at a garden gate (Assistant Mochiko
 *   exists in the lab with different dialog; the garden gate
 *   belongs to GardenView, not a world map, so this line is not
 *   wired from a world-map edit).
 * In-game in some form: 10/13 = 77%. Not wired as written: 3/13.
 * Regions 2-5 attribution (102 speakers) is the same pass, not
 * claimed here — their maps do not exist yet in FULL_WORLD.
 */

export type DialogueAttributionStatus = 'exact' | 'sign' | 'divergent' | 'missing';

export type DialogueAttribution = {
  entryId: string;
  speaker: string;
  /** Map NPC id, or null when no NPC carries the line. */
  npcId: string | null;
  /** FULL_WORLD map key for the NPC/sign, or null when missing. */
  mapKey: string | null;
  status: DialogueAttributionStatus;
  note: string;
};

export const REGION1_DIALOGUE_ATTRIBUTION: DialogueAttribution[] = [
  { entryId: 'R1-BEAT2', speaker: 'Young trainer Jay', npcId: 'trainer_youngster', mapKey: 'route_1', status: 'divergent', note: 'NPC exists; map dialog and postBattleDialog differ from the JSON pre/post lines.' },
  { entryId: 'R1-BEAT2', speaker: 'Young trainer Amy', npcId: 'trainer_lass', mapKey: 'route_1', status: 'divergent', note: 'NPC exists; map dialog and postBattleDialog differ from the JSON pre/post lines.' },
  { entryId: 'R1-BEAT3', speaker: 'MochiiPlex nurse', npcId: 'healer_1', mapKey: 'mochiiplex_1', status: 'exact', note: 'JSON line is byte-identical to the Center Nurse dialog line.' },
  { entryId: 'R1-BEAT3', speaker: 'MochiiPlex clerk', npcId: 'shop_1', mapKey: 'mochiiplex_1', status: 'exact', note: 'JSON line is byte-identical to the Clerk dialog line.' },
  { entryId: 'R1-BEAT3', speaker: 'Dojo 1 acolyte 1 (Core theme)', npcId: 'dojo_acolyte_1', mapKey: 'dojo_1', status: 'exact', note: 'JSON line is byte-identical to the Acolyte Ken dialog line.' },
  { entryId: 'R1-BEAT3', speaker: 'Mochiko, garden gate', npcId: null, mapKey: null, status: 'missing', note: 'Assistant Mochiko exists in the lab with different dialog; the garden gate belongs to GardenView, not a world map, so no world-map NPC carries this line.' },
  { entryId: 'R1-BEAT4', speaker: 'Woods trainer, bug theme', npcId: 'trainer_bugcatcher_mira', mapKey: 'binary_woods', status: 'exact', note: 'JSON line is byte-identical to the Bug Catcher Mira dialog line.' },
  { entryId: 'R1-BEAT5', speaker: 'Cave guide', npcId: 'cave_guide', mapKey: 'cave_of_echoes', status: 'exact', note: 'Added to cave_of_echoes at (4,2) on a CAVE tile by the entrance; JSON line verbatim, no battle.' },
  { entryId: 'R1-BEAT6', speaker: 'Tower keeper', npcId: 'pale_tower_keeper', mapKey: 'pale_town', status: 'exact', note: 'JSON line is byte-identical to the Tower Keeper dialog line.' },
  { entryId: 'R1-BEAT6', speaker: 'Central citizen, after freeing', npcId: 'central_citizen', mapKey: 'central_city', status: 'exact', note: 'JSON line is byte-identical to the Central Citizen dialog line.' },
  { entryId: 'R1-BEAT7', speaker: 'Preserve keeper', npcId: 'harbor_preserve_keeper', mapKey: 'harbor_city', status: 'exact', note: 'JSON line is byte-identical to the Preserve Keeper dialog line.' },
  { entryId: 'R1-BEAT7', speaker: 'Mansion log (readable, not spoken)', npcId: null, mapKey: 'ember_island', status: 'sign', note: 'In the game as the Ember Island LOG 7 sign, not as spoken dialog.' },
  { entryId: 'R1-BEAT9', speaker: 'Prof. Aeon, on the last isle', npcId: 'isle7_aeon', mapKey: 'data_isle_7', status: 'exact', note: 'JSON line is byte-identical to the Prof. Aeon dialog line on Data Isle 7.' },
];

export function attributionForSpeaker(speaker: string): DialogueAttribution | null {
  return REGION1_DIALOGUE_ATTRIBUTION.find((a) => a.speaker === speaker) ?? null;
}
