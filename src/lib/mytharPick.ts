// Mythar's picked four — champion fight, confirmed by Mars 2026-10-26 ~18:39 CDT
// as presented: Lv65, single #331, reward 15000, Origin Verdict in place of
// Dragon Claw. The other three picked moves are unchanged.
// Origin Verdict is data-only here: its form/Facet type lookup (form/Facet ->
// battle type, default MYTHIC in mochi form with no Facet held) is NOT built
// in battle code by this PR and is NOT claimed as wired. DRAGON_CLAW itself
// is NOT deleted from MOVES_DB — it simply leaves Mythar's picked four.
export const MYTHAR_PICK = {
  speciesId: "331",
  level: 65,
  reward: 15000,
  moves: ["MIND_BLAST", "ORIGIN_VERDICT", "SHADOW_PULSE", "SOLAR_BLAST"] as const,
  replaced: "DRAGON_CLAW" as const,
  originVerdict: {
    moveId: "ORIGIN_VERDICT",
    type: "MYTHIC" as const,
    defaultForm: "mochi" as const,
    typeRule: "FORM_TYPE" as const,
    formFacetLookupImplemented: false,
  },
};
