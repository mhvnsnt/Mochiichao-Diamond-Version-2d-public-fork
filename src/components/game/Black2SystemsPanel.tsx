import React from 'react';
import {
  BLACK2_ITEM_COUNT,
  BLACK2_ABILITY_COUNT,
  BLACK2_NATURE_COUNT,
  BLACK2_TYPE_COUNT,
  BLACK2_LIGHTING_SETS,
  BLACK2_LIGHTING_PERIODS_PER_SET,
  BLACK2_ZONE_COUNT,
  BLACK2_ENCOUNTER_SET_COUNT,
  BLACK2_ENCOUNTER_SLOT_COUNT,
  BLACK2_FACILITY_COUNT,
  BLACK2_FACILITY_TRAINER_COUNT,
  BLACK2_FACILITY_SET_COUNT,
  BLACK2_KEPT_CLASS_COUNT,
  BLACK2_WIRED_CLASS_COUNT,
  BLACK2_DROPPED_CLASS_COUNT,
  BLACK2_AI_STRATEGY_COUNT,
  BLACK2_AI_WIREABLE_COUNT,
  BLACK2_NATURE_MODIFIERS,
  BLACK2_TYPE_EFFECTIVENESS_CHART,
  BLACK2_ABILITY_LOGIC,
  BLACK2_FACILITY_LEVEL_RANGE,
  BLACK2_FACILITY_SUMMARIES,
  BLACK2_SRC_SYSTEM_MAP,
  wireableAiStrategies,
} from '../../lib/black2Systems';

/**
 * Black 2 reference systems panel — DISPLAY ONLY, rendered in DexView.
 *
 * This panel shows counts and mapping status from black2Systems.ts
 * (embedded lists + constants only). It does NOT import any
 * src/lib/generated/ JSON, does NOT change battle math, save shape,
 * shop prices, roster numbers, or canon numbers, and does NOT invent:
 * nature modifiers (null), type-effectiveness chart (null), ability
 * logic (null), Black 2 types -> 12 True Elements mapping, zone /
 * lighting / encounter -> Mochiichao map assignments, facility venue
 * mapping or facility level rule, or Mochiichao-original item
 * descriptions. Every such gap is flagged NEED below, in the UI.
 * Full item / lighting / zone / encounter / facility-set data lives
 * in src/lib/generated/decomp_black2_*.json as reference data only
 * (validate:reference parses it, game code never imports it).
 */
export default function Black2SystemsPanel() {
  const rows: Array<[string, string, string]> = [
    ['Items', `${BLACK2_ITEM_COUNT} reference items`, 'Display only — item descriptions NEED (Mochiichao-original, 639 owed); 1 town-derived name withheld in the JSON'],
    ['Abilities', `${BLACK2_ABILITY_COUNT} reference abilities`, 'Display only — ability logic NEED (0/165 in source, not copied)'],
    ['Natures', `${BLACK2_NATURE_COUNT} reference natures`, 'Display only — stat modifiers NEED (null, Mars decision: table vs display-only)'],
    ['Types', `${BLACK2_TYPE_COUNT} reference types (+ TYPE_NULL constant)`, 'Display only — 17 -> 12 True Elements mapping NEED; effectiveness chart NEED (null)'],
    ['Lighting', `${BLACK2_LIGHTING_SETS} sets x ${BLACK2_LIGHTING_PERIODS_PER_SET} periods`, 'Display only — set -> Mochiichao location/time assignment NEED'],
    ['Zones', `${BLACK2_ZONE_COUNT} anonymous zones`, 'Display only — zone -> Mochiichao map assignment NEED; weather codes not interpreted'],
    ['Encounters', `${BLACK2_ENCOUNTER_SET_COUNT} sets, ${BLACK2_ENCOUNTER_SLOT_COUNT} slots`, 'Display only — set -> Mochiichao map + roster mapping NEED'],
    ['Facilities', `${BLACK2_FACILITY_COUNT} facilities, ${BLACK2_FACILITY_TRAINER_COUNT} trainers, ${BLACK2_FACILITY_SET_COUNT} sets`, 'Display only — venue mapping + level rule NEED (level range null)'],
    ['Trainer classes', `${BLACK2_WIRED_CLASS_COUNT} wired of ${BLACK2_KEPT_CLASS_COUNT} kept, ${BLACK2_DROPPED_CLASS_COUNT} dropped`, 'Display only — role rename decision NEED; class constants naming a person redacted to WITHHELD'],
    ['Trainer AI', `${BLACK2_AI_WIREABLE_COUNT} wireable of ${BLACK2_AI_STRATEGY_COUNT} strategies`, 'Display only — chooser NEED; assignment beyond 5 story-justified strategies NEED; 1 held-out strategy excluded'],
    ['Src systems', '16 systems mapped', 'Map only — 15 HAVE a Mochiichao file, 1 (network/link) NEED TO MAKE'],
    ['Graphics', '110 dirs, 5,122 files', 'Map only — counts only, art 0% copied, original art NEED'],
    ['Sound', '13,934 files', 'Map only — counts only, audio 0% copied, original audio NEED'],
    ['Text', '1,171 files', 'Map only — counts only, content 0% (dialogue forbidden), original dialogue NEED'],
    ['Town-map', '87 files', 'Structure type only — place list 0% (place names forbidden)'],
  ];
  const gapsOk =
    BLACK2_NATURE_MODIFIERS === null &&
    BLACK2_TYPE_EFFECTIVENESS_CHART === null &&
    BLACK2_ABILITY_LOGIC === null &&
    BLACK2_FACILITY_LEVEL_RANGE === null;
  return (
    <div className="w-full max-w-2xl mt-8 p-4 bg-slate-900 border border-teal-900 rounded-lg text-left">
      <h3 className="font-bold text-teal-100 text-lg mb-1">Reference systems — Black 2 (display only)</h3>
      <p className="text-xs text-slate-400 mb-4">
        Reference counts and mapping status only. Nothing here is playable content, battle math, or a canon number.
        Gaps are flagged NEED, not filled in. Gap-null check: {gapsOk ? 'PASS (all 4 null gaps still null)' : 'FAIL — a gap was filled without a decision'}.
      </p>
      <ul className="space-y-2">
        {rows.map(([name, count, status]) => (
          <li key={name} className="text-sm">
            <span className="font-bold text-teal-100">{name}:</span>{' '}
            <span className="text-slate-300">{count}</span>{' '}
            <span className="text-slate-500">— {status}</span>
          </li>
        ))}
      </ul>
      <h4 className="font-bold text-teal-100 text-sm mt-4 mb-1">Facility summaries (reference only)</h4>
      <ul className="space-y-1">
        {BLACK2_FACILITY_SUMMARIES.map((f) => (
          <li key={f.facility} className="text-xs text-slate-400">
            {f.facility}: {f.trainerFileCount} trainers, {f.setFileCount} sets, {f.totalPoolReferences} pool refs
          </li>
        ))}
      </ul>
      <h4 className="font-bold text-teal-100 text-sm mt-4 mb-1">Wireable AI strategies (reference only, no chooser yet)</h4>
      <p className="text-xs text-slate-400">
        {wireableAiStrategies().map((s) => `${s.file} (flag ${s.flag}, ${s.storyTrainersUsing} story trainers)`).join(' · ')}
      </p>
      <h4 className="font-bold text-teal-100 text-sm mt-4 mb-1">Src system map (Mochiichao file exists = HAVE, not copied values)</h4>
      <ul className="space-y-1">
        {BLACK2_SRC_SYSTEM_MAP.map((s) => (
          <li key={s.system} className="text-xs text-slate-400">
            {s.system}: {s.status} — {s.mochiichaoFile}
          </li>
        ))}
      </ul>
    </div>
  );
}
