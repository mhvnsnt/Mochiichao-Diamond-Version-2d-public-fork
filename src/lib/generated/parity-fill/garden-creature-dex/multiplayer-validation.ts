/**
 * STAGED ONLY — Mochi Link / trade VALIDATION shape (extends mochiLinkValidate).
 * NO network code, NO server. Same contract: string[] errors, empty = valid.
 * Species legality: roster 001-046 + 331 only. 147/148 reserved (stats owed).
 * Discoverable slots 047-146 have no species and always fail.
 * Level cap deliberately NOT set: the MAX-LVL cheat clamp (50) is a cheat,
 * not a trade legality cap. Mythic-trade and egg-trade rules are
 * DECISION-OWED (see multiplayer-validation.json) and are NOT silently
 * allowed or blocked here — they return a decision-owed error string so
 * a caller can never mistake an undecided rule for a pass.
 */

export interface TradeOffer {
  instanceId: string;
  speciesId: string;
  level: number;
}

export const ROSTER_SPECIES_IDS: readonly string[] = [
  "001", "002", "003", "004", "005", "006", "007", "008", "009", "010",
  "011", "012", "013", "014", "015", "016", "017", "018", "019", "020",
  "021", "022", "023", "024", "025", "026", "027", "028", "029", "030",
  "031", "032", "033", "034", "035", "036", "037", "038", "039", "040",
  "041", "042", "043", "044", "045", "046", "331",
];

export const RESERVED_SPECIES_IDS: readonly string[] = ["147", "148"];
export const PARTY_SIZE_MAX = 6; // Pokemon-baseline party shape; confirm against gameStore before wiring.

export function mochiLinkValidateExtended(
  offerA: TradeOffer | null,
  offerB: TradeOffer | null,
  receiverRosterInstanceIds: string[],
  opts?: { isMythicForm?: boolean; isEgg?: boolean },
): string[] {
  const errors: string[] = [];
  if (!offerA || !offerB) {
    errors.push("Both sides must offer a creature.");
    return errors;
  }
  if (offerA.instanceId === offerB.instanceId) {
    errors.push("Both sides offered the same creature instance.");
  }
  for (const offer of [offerA, offerB]) {
    if (RESERVED_SPECIES_IDS.includes(offer.speciesId)) {
      errors.push(`Species ${offer.speciesId} is reserved (Dorowani/Gabu stats owed) and cannot be traded yet.`);
    } else if (!ROSTER_SPECIES_IDS.includes(offer.speciesId)) {
      errors.push(`Species ${offer.speciesId} is not a known Mochiichao roster species.`);
    }
    if (!Number.isInteger(offer.level) || offer.level < 1) {
      errors.push("Offered creature level must be a positive integer.");
    }
  }
  if (receiverRosterInstanceIds.includes(offerA.instanceId)) {
    errors.push("Receiver already owns that creature ID.");
  }
  if (opts?.isMythicForm) {
    errors.push("DECISION-OWED: Mythic Form trade legality is not decided — trade blocked until ruled.");
  }
  if (opts?.isEgg) {
    errors.push("DECISION-OWED: egg trading has no rule until the breeding/egg system lands.");
  }
  return errors;
}
