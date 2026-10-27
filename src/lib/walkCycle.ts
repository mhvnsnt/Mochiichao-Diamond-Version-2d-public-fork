/**
 * Walk both-sources activation (v2) — Mars confirmed 2026-10-26 ~19:33 CDT.
 *
 * Black 2 model (pokebw2, src/ov036/fldmmdl_drawdata.c, anim set 1): one strip
 * per actor; standing faces 0/3/6/9, one per direction; walk per direction is
 * { step, stand, step, stand }, looped, at waits 16/8/4/2/1 by speed tier.
 * Mochiichao mapping (Mars order 2026-10-26 ~18:29 CDT: walk from BOTH sources):
 * - frames-dir drives the walk CYCLE for 42/51 sets: the step frames come from
 *   the corrected frames-dir sets below; the STAND frame is always the sheet
 *   cell, which the renderer already draws when this resolver returns null.
 * - sheet cells are ALWAYS the standing/side authority and the fallback.
 * - 9/51 sets stay SHEET-ONLY (gap-fill frames staged, NOT confirmed): this
 *   resolver returns null for every phase, so the game keeps rendering the
 *   existing sheet path for them. Their staged frames-dir dirs are NOT wired.
 * - Dorowani + Gabu NEVER resolve to their old live dirs (Mudkip-like /
 *   shell-missing). They resolve to the confirmed rebuilt sets only.
 * - Astroleviathan: down/up from the live dir, left/right from the confirmed
 *   left-right build (Mars confirmed 2026-10-26 ~19:32 CDT).
 *
 * Razorgater caveat, carried from Pass 8: the staged Razorgater down frames
 * carry a grey ellipse ground shadow from the sprite-art cut. Engine shadows
 * are rendered separately; shadow removal for those two down frames is still
 * owed as a sprite-lane cleanup and is NOT hidden by this wiring.
 *
 * WALK_WAIT_TIERS is Black 2's verbatim wait table. The game today ticks the
 * walk cycle once per tile step (CreatureModeView walkStep), not once per
 * animation frame, so per-frame wait application needs a frame clock the game
 * does not have yet — that application is FLAGGED, not faked: the cycle
 * position here is walkStep % 4, the same granularity the game already used
 * (old code: walkStep % 2). No tier is silently assigned to a creature.
 *
 * Variant note: strikechamp, strikechamp_unsuited and strikechamp_unsuited_full
 * share speciesId '030' (creatureAnimation.ts FOLDER_SPECIES), and the walk
 * call site passes speciesId only — so speciesId '030' resolves to the DEFAULT
 * suited strikechamp set. A variant-aware call site is owed before the unsuited
 * set can be selected in game; strikechamp_unsuited_full stays sheet-only per v2.
 *
 * Generated from WALK-GATE-ACTIVATION-V2-20261026.json — NOT hand-written.
 */
import { SPECIES_FOLDER } from './creatureAnimation';

export type WalkDir = 'down' | 'up' | 'left' | 'right';
export type WalkSource = 'frames-dir' | 'sheet-only';

/** Black 2 verbatim wait tiers, slowest to fastest (frames per cycle step). */
export const WALK_WAIT_TIERS = [16, 8, 4, 2, 1] as const;

/** Black 2 walk cycle pattern: step, stand, step, stand, looped. */
export const WALK_CYCLE_PHASES = ['step0', 'stand', 'step1', 'stand'] as const;

import aquariios_down_0 from '../assets/walk-frames/aquariios/aquariios_walk_down_0.png';
import aquariios_down_1 from '../assets/walk-frames/aquariios/aquariios_walk_down_1.png';
import aquariios_up_0 from '../assets/walk-frames/aquariios/aquariios_walk_up_0.png';
import aquariios_up_1 from '../assets/walk-frames/aquariios/aquariios_walk_up_1.png';
import aquariios_left_0 from '../assets/walk-frames/aquariios/aquariios_walk_left_0.png';
import aquariios_left_1 from '../assets/walk-frames/aquariios/aquariios_walk_left_1.png';
import aquariios_right_0 from '../assets/walk-frames/aquariios/aquariios_walk_right_0.png';
import aquariios_right_1 from '../assets/walk-frames/aquariios/aquariios_walk_right_1.png';
import ashemit_down_0 from '../assets/walk-frames/ashemit/ashemit_walk_down_0.png';
import ashemit_down_1 from '../assets/walk-frames/ashemit/ashemit_walk_down_1.png';
import ashemit_up_0 from '../assets/walk-frames/ashemit/ashemit_walk_up_0.png';
import ashemit_up_1 from '../assets/walk-frames/ashemit/ashemit_walk_up_1.png';
import ashemit_left_0 from '../assets/walk-frames/ashemit/ashemit_walk_left_0.png';
import ashemit_left_1 from '../assets/walk-frames/ashemit/ashemit_walk_left_1.png';
import ashemit_right_0 from '../assets/walk-frames/ashemit/ashemit_walk_right_0.png';
import ashemit_right_1 from '../assets/walk-frames/ashemit/ashemit_walk_right_1.png';
import astroleviathan_down_0 from '../assets/walk-frames/astroleviathan/astroleviathan_walk_down_0.png';
import astroleviathan_down_1 from '../assets/walk-frames/astroleviathan/astroleviathan_walk_down_1.png';
import astroleviathan_up_0 from '../assets/walk-frames/astroleviathan/astroleviathan_walk_up_0.png';
import astroleviathan_up_1 from '../assets/walk-frames/astroleviathan/astroleviathan_walk_up_1.png';
import astroleviathan_left_0 from '../assets/walk-frames/astroleviathan-left-right-20261026/astroleviathan_walk_left_0_20261026.png';
import astroleviathan_left_1 from '../assets/walk-frames/astroleviathan-left-right-20261026/astroleviathan_walk_left_1_20261026.png';
import astroleviathan_right_0 from '../assets/walk-frames/astroleviathan-left-right-20261026/astroleviathan_walk_right_0_20261026.png';
import astroleviathan_right_1 from '../assets/walk-frames/astroleviathan-left-right-20261026/astroleviathan_walk_right_1_20261026.png';
import chromejaww_down_0 from '../assets/walk-frames/chromejaww/chromejaww_walk_down_0.png';
import chromejaww_down_1 from '../assets/walk-frames/chromejaww/chromejaww_walk_down_1.png';
import chromejaww_up_0 from '../assets/walk-frames/chromejaww/chromejaww_walk_up_0.png';
import chromejaww_up_1 from '../assets/walk-frames/chromejaww/chromejaww_walk_up_1.png';
import chromejaww_left_0 from '../assets/walk-frames/chromejaww/chromejaww_walk_left_0.png';
import chromejaww_left_1 from '../assets/walk-frames/chromejaww/chromejaww_walk_left_1.png';
import chromejaww_right_0 from '../assets/walk-frames/chromejaww/chromejaww_walk_right_0.png';
import chromejaww_right_1 from '../assets/walk-frames/chromejaww/chromejaww_walk_right_1.png';
import cocoonode_down_0 from '../assets/walk-frames/cocoonode/cocoonode_walk_down_0.png';
import cocoonode_down_1 from '../assets/walk-frames/cocoonode/cocoonode_walk_down_1.png';
import cocoonode_up_0 from '../assets/walk-frames/cocoonode/cocoonode_walk_up_0.png';
import cocoonode_up_1 from '../assets/walk-frames/cocoonode/cocoonode_walk_up_1.png';
import cocoonode_left_0 from '../assets/walk-frames/cocoonode/cocoonode_walk_left_0.png';
import cocoonode_left_1 from '../assets/walk-frames/cocoonode/cocoonode_walk_left_1.png';
import cocoonode_right_0 from '../assets/walk-frames/cocoonode/cocoonode_walk_right_0.png';
import cocoonode_right_1 from '../assets/walk-frames/cocoonode/cocoonode_walk_right_1.png';
import cragarm_down_0 from '../assets/walk-frames/cragarm/cragarm_walk_down_0.png';
import cragarm_down_1 from '../assets/walk-frames/cragarm/cragarm_walk_down_1.png';
import cragarm_up_0 from '../assets/walk-frames/cragarm/cragarm_walk_up_0.png';
import cragarm_up_1 from '../assets/walk-frames/cragarm/cragarm_walk_up_1.png';
import cragarm_left_0 from '../assets/walk-frames/cragarm/cragarm_walk_left_0.png';
import cragarm_left_1 from '../assets/walk-frames/cragarm/cragarm_walk_left_1.png';
import cragarm_right_0 from '../assets/walk-frames/cragarm/cragarm_walk_right_0.png';
import cragarm_right_1 from '../assets/walk-frames/cragarm/cragarm_walk_right_1.png';
import dorowani_down_0 from '../assets/walk-frames/dorowani-walkfix-20261026/dorowani_walk_down_0_downgap-20261026.png';
import dorowani_down_1 from '../assets/walk-frames/dorowani-walkfix-20261026/dorowani_walk_down_1_downgap-20261026.png';
import dorowani_up_0 from '../assets/walk-frames/dorowani-walkfix-20261026/dorowani_walk_up_0_rebuilt-20261026.png';
import dorowani_up_1 from '../assets/walk-frames/dorowani-walkfix-20261026/dorowani_walk_up_1_rebuilt-20261026.png';
import dorowani_left_0 from '../assets/walk-frames/dorowani-walkfix-20261026/dorowani_walk_left_0_rebuilt-20261026.png';
import dorowani_left_1 from '../assets/walk-frames/dorowani-walkfix-20261026/dorowani_walk_left_1_rebuilt-20261026.png';
import dorowani_right_0 from '../assets/walk-frames/dorowani-walkfix-20261026/dorowani_walk_right_0_rebuilt-20261026.png';
import dorowani_right_1 from '../assets/walk-frames/dorowani-walkfix-20261026/dorowani_walk_right_1_rebuilt-20261026.png';
import dreadtoise_down_0 from '../assets/walk-frames/dreadtoise/dreadtoise_walk_down_0.png';
import dreadtoise_down_1 from '../assets/walk-frames/dreadtoise/dreadtoise_walk_down_1.png';
import dreadtoise_up_0 from '../assets/walk-frames/dreadtoise/dreadtoise_walk_up_0.png';
import dreadtoise_up_1 from '../assets/walk-frames/dreadtoise/dreadtoise_walk_up_1.png';
import dreadtoise_left_0 from '../assets/walk-frames/dreadtoise/dreadtoise_walk_left_0.png';
import dreadtoise_left_1 from '../assets/walk-frames/dreadtoise/dreadtoise_walk_left_1.png';
import dreadtoise_right_0 from '../assets/walk-frames/dreadtoise/dreadtoise_walk_right_0.png';
import dreadtoise_right_1 from '../assets/walk-frames/dreadtoise/dreadtoise_walk_right_1.png';
import duneclaw_down_0 from '../assets/walk-frames/duneclaw/duneclaw_walk_down_0.png';
import duneclaw_down_1 from '../assets/walk-frames/duneclaw/duneclaw_walk_down_1.png';
import duneclaw_up_0 from '../assets/walk-frames/duneclaw/duneclaw_walk_up_0.png';
import duneclaw_up_1 from '../assets/walk-frames/duneclaw/duneclaw_walk_up_1.png';
import duneclaw_left_0 from '../assets/walk-frames/duneclaw/duneclaw_walk_left_0.png';
import duneclaw_left_1 from '../assets/walk-frames/duneclaw/duneclaw_walk_left_1.png';
import duneclaw_right_0 from '../assets/walk-frames/duneclaw/duneclaw_walk_right_0.png';
import duneclaw_right_1 from '../assets/walk-frames/duneclaw/duneclaw_walk_right_1.png';
import duskfiend_down_0 from '../assets/walk-frames/duskfiend/duskfiend_walk_down_0.png';
import duskfiend_down_1 from '../assets/walk-frames/duskfiend/duskfiend_walk_down_1.png';
import duskfiend_up_0 from '../assets/walk-frames/duskfiend/duskfiend_walk_up_0.png';
import duskfiend_up_1 from '../assets/walk-frames/duskfiend/duskfiend_walk_up_1.png';
import duskfiend_left_0 from '../assets/walk-frames/duskfiend/duskfiend_walk_left_0.png';
import duskfiend_left_1 from '../assets/walk-frames/duskfiend/duskfiend_walk_left_1.png';
import duskfiend_right_0 from '../assets/walk-frames/duskfiend/duskfiend_walk_right_0.png';
import duskfiend_right_1 from '../assets/walk-frames/duskfiend/duskfiend_walk_right_1.png';
import gabu_down_0 from '../assets/walk-frames/gabu-walkfix-20261026/gabu_walk_down_0.png';
import gabu_down_1 from '../assets/walk-frames/gabu-walkfix-20261026/gabu_walk_down_1.png';
import gabu_up_0 from '../assets/walk-frames/gabu-walkfix-20261026/gabu_walk_up_0.png';
import gabu_up_1 from '../assets/walk-frames/gabu-walkfix-20261026/gabu_walk_up_1.png';
import gabu_left_0 from '../assets/walk-frames/gabu-walkfix-20261026/gabu_walk_left_0.png';
import gabu_left_1 from '../assets/walk-frames/gabu-walkfix-20261026/gabu_walk_left_1.png';
import gabu_right_0 from '../assets/walk-frames/gabu-walkfix-20261026/gabu_walk_right_0.png';
import gabu_right_1 from '../assets/walk-frames/gabu-walkfix-20261026/gabu_walk_right_1.png';
import gearkid_down_0 from '../assets/walk-frames/gearkid/gearkid_walk_down_0.png';
import gearkid_down_1 from '../assets/walk-frames/gearkid/gearkid_walk_down_1.png';
import gearkid_up_0 from '../assets/walk-frames/gearkid/gearkid_walk_up_0.png';
import gearkid_up_1 from '../assets/walk-frames/gearkid/gearkid_walk_up_1.png';
import gearkid_left_0 from '../assets/walk-frames/gearkid/gearkid_walk_left_0.png';
import gearkid_left_1 from '../assets/walk-frames/gearkid/gearkid_walk_left_1.png';
import gearkid_right_0 from '../assets/walk-frames/gearkid/gearkid_walk_right_0.png';
import gearkid_right_1 from '../assets/walk-frames/gearkid/gearkid_walk_right_1.png';
import gorokappa_down_0 from '../assets/walk-frames/gorokappa/gorokappa_walk_down_0.png';
import gorokappa_down_1 from '../assets/walk-frames/gorokappa/gorokappa_walk_down_1.png';
import gorokappa_up_0 from '../assets/walk-frames/gorokappa/gorokappa_walk_up_0.png';
import gorokappa_up_1 from '../assets/walk-frames/gorokappa/gorokappa_walk_up_1.png';
import gorokappa_left_0 from '../assets/walk-frames/gorokappa/gorokappa_walk_left_0.png';
import gorokappa_left_1 from '../assets/walk-frames/gorokappa/gorokappa_walk_left_1.png';
import gorokappa_right_0 from '../assets/walk-frames/gorokappa/gorokappa_walk_right_0.png';
import gorokappa_right_1 from '../assets/walk-frames/gorokappa/gorokappa_walk_right_1.png';
import inklet_down_0 from '../assets/walk-frames/inklet/inklet_walk_down_0.png';
import inklet_down_1 from '../assets/walk-frames/inklet/inklet_walk_down_1.png';
import inklet_up_0 from '../assets/walk-frames/inklet/inklet_walk_up_0.png';
import inklet_up_1 from '../assets/walk-frames/inklet/inklet_walk_up_1.png';
import inklet_left_0 from '../assets/walk-frames/inklet/inklet_walk_left_0.png';
import inklet_left_1 from '../assets/walk-frames/inklet/inklet_walk_left_1.png';
import inklet_right_0 from '../assets/walk-frames/inklet/inklet_walk_right_0.png';
import inklet_right_1 from '../assets/walk-frames/inklet/inklet_walk_right_1.png';
import kickmaster_down_0 from '../assets/walk-frames/kickmaster/kickmaster_walk_down_0.png';
import kickmaster_down_1 from '../assets/walk-frames/kickmaster/kickmaster_walk_down_1.png';
import kickmaster_up_0 from '../assets/walk-frames/kickmaster/kickmaster_walk_up_0.png';
import kickmaster_up_1 from '../assets/walk-frames/kickmaster/kickmaster_walk_up_1.png';
import kickmaster_left_0 from '../assets/walk-frames/kickmaster/kickmaster_walk_left_0.png';
import kickmaster_left_1 from '../assets/walk-frames/kickmaster/kickmaster_walk_left_1.png';
import kickmaster_right_0 from '../assets/walk-frames/kickmaster/kickmaster_walk_right_0.png';
import kickmaster_right_1 from '../assets/walk-frames/kickmaster/kickmaster_walk_right_1.png';
import kittember_down_0 from '../assets/walk-frames/kittember/kittember_walk_down_0.png';
import kittember_down_1 from '../assets/walk-frames/kittember/kittember_walk_down_1.png';
import kittember_up_0 from '../assets/walk-frames/kittember/kittember_walk_up_0.png';
import kittember_up_1 from '../assets/walk-frames/kittember/kittember_walk_up_1.png';
import kittember_left_0 from '../assets/walk-frames/kittember/kittember_walk_left_0.png';
import kittember_left_1 from '../assets/walk-frames/kittember/kittember_walk_left_1.png';
import kittember_right_0 from '../assets/walk-frames/kittember/kittember_walk_right_0.png';
import kittember_right_1 from '../assets/walk-frames/kittember/kittember_walk_right_1.png';
import krakenox_down_0 from '../assets/walk-frames/krakenox/krakenox_walk_down_0.png';
import krakenox_down_1 from '../assets/walk-frames/krakenox/krakenox_walk_down_1.png';
import krakenox_up_0 from '../assets/walk-frames/krakenox/krakenox_walk_up_0.png';
import krakenox_up_1 from '../assets/walk-frames/krakenox/krakenox_walk_up_1.png';
import krakenox_left_0 from '../assets/walk-frames/krakenox/krakenox_walk_left_0.png';
import krakenox_left_1 from '../assets/walk-frames/krakenox/krakenox_walk_left_1.png';
import krakenox_right_0 from '../assets/walk-frames/krakenox/krakenox_walk_right_0.png';
import krakenox_right_1 from '../assets/walk-frames/krakenox/krakenox_walk_right_1.png';
import manticlaw_down_0 from '../assets/walk-frames/manticlaw/manticlaw_walk_down_0.png';
import manticlaw_down_1 from '../assets/walk-frames/manticlaw/manticlaw_walk_down_1.png';
import manticlaw_up_0 from '../assets/walk-frames/manticlaw/manticlaw_walk_up_0.png';
import manticlaw_up_1 from '../assets/walk-frames/manticlaw/manticlaw_walk_up_1.png';
import manticlaw_left_0 from '../assets/walk-frames/manticlaw/manticlaw_walk_left_0.png';
import manticlaw_left_1 from '../assets/walk-frames/manticlaw/manticlaw_walk_left_1.png';
import manticlaw_right_0 from '../assets/walk-frames/manticlaw/manticlaw_walk_right_0.png';
import manticlaw_right_1 from '../assets/walk-frames/manticlaw/manticlaw_walk_right_1.png';
import mechapion_down_0 from '../assets/walk-frames/mechapion/mechapion_walk_down_0.png';
import mechapion_down_1 from '../assets/walk-frames/mechapion/mechapion_walk_down_1.png';
import mechapion_up_0 from '../assets/walk-frames/mechapion/mechapion_walk_up_0.png';
import mechapion_up_1 from '../assets/walk-frames/mechapion/mechapion_walk_up_1.png';
import mechapion_left_0 from '../assets/walk-frames/mechapion/mechapion_walk_left_0.png';
import mechapion_left_1 from '../assets/walk-frames/mechapion/mechapion_walk_left_1.png';
import mechapion_right_0 from '../assets/walk-frames/mechapion/mechapion_walk_right_0.png';
import mechapion_right_1 from '../assets/walk-frames/mechapion/mechapion_walk_right_1.png';
import mochii_down_0 from '../assets/walk-frames/mochii/mochii_walk_down_0.png';
import mochii_down_1 from '../assets/walk-frames/mochii/mochii_walk_down_1.png';
import mochii_up_0 from '../assets/walk-frames/mochii/mochii_walk_up_0.png';
import mochii_up_1 from '../assets/walk-frames/mochii/mochii_walk_up_1.png';
import mochii_left_0 from '../assets/walk-frames/mochii/mochii_walk_left_0.png';
import mochii_left_1 from '../assets/walk-frames/mochii/mochii_walk_left_1.png';
import mochii_right_0 from '../assets/walk-frames/mochii/mochii_walk_right_0.png';
import mochii_right_1 from '../assets/walk-frames/mochii/mochii_walk_right_1.png';
import mythar_down_0 from '../assets/walk-frames/mythar/mythar_walk_down_0.png';
import mythar_down_1 from '../assets/walk-frames/mythar/mythar_walk_down_1.png';
import mythar_up_0 from '../assets/walk-frames/mythar/mythar_walk_up_0.png';
import mythar_up_1 from '../assets/walk-frames/mythar/mythar_walk_up_1.png';
import mythar_left_0 from '../assets/walk-frames/mythar/mythar_walk_left_0.png';
import mythar_left_1 from '../assets/walk-frames/mythar/mythar_walk_left_1.png';
import mythar_right_0 from '../assets/walk-frames/mythar/mythar_walk_right_0.png';
import mythar_right_1 from '../assets/walk-frames/mythar/mythar_walk_right_1.png';
import oblivirex_down_0 from '../assets/walk-frames/oblivirex/oblivirex_walk_down_0.png';
import oblivirex_down_1 from '../assets/walk-frames/oblivirex/oblivirex_walk_down_1.png';
import oblivirex_up_0 from '../assets/walk-frames/oblivirex/oblivirex_walk_up_0.png';
import oblivirex_up_1 from '../assets/walk-frames/oblivirex/oblivirex_walk_up_1.png';
import oblivirex_left_0 from '../assets/walk-frames/oblivirex/oblivirex_walk_left_0.png';
import oblivirex_left_1 from '../assets/walk-frames/oblivirex/oblivirex_walk_left_1.png';
import oblivirex_right_0 from '../assets/walk-frames/oblivirex/oblivirex_walk_right_0.png';
import oblivirex_right_1 from '../assets/walk-frames/oblivirex/oblivirex_walk_right_1.png';
import pebblefist_down_0 from '../assets/walk-frames/pebblefist/pebblefist_walk_down_0.png';
import pebblefist_down_1 from '../assets/walk-frames/pebblefist/pebblefist_walk_down_1.png';
import pebblefist_up_0 from '../assets/walk-frames/pebblefist/pebblefist_walk_up_0.png';
import pebblefist_up_1 from '../assets/walk-frames/pebblefist/pebblefist_walk_up_1.png';
import pebblefist_left_0 from '../assets/walk-frames/pebblefist/pebblefist_walk_left_0.png';
import pebblefist_left_1 from '../assets/walk-frames/pebblefist/pebblefist_walk_left_1.png';
import pebblefist_right_0 from '../assets/walk-frames/pebblefist/pebblefist_walk_right_0.png';
import pebblefist_right_1 from '../assets/walk-frames/pebblefist/pebblefist_walk_right_1.png';
import pixilite_down_0 from '../assets/walk-frames/pixilite/pixilite_walk_down_0.png';
import pixilite_down_1 from '../assets/walk-frames/pixilite/pixilite_walk_down_1.png';
import pixilite_up_0 from '../assets/walk-frames/pixilite/pixilite_walk_up_0.png';
import pixilite_up_1 from '../assets/walk-frames/pixilite/pixilite_walk_up_1.png';
import pixilite_left_0 from '../assets/walk-frames/pixilite/pixilite_walk_left_0.png';
import pixilite_left_1 from '../assets/walk-frames/pixilite/pixilite_walk_left_1.png';
import pixilite_right_0 from '../assets/walk-frames/pixilite/pixilite_walk_right_0.png';
import pixilite_right_1 from '../assets/walk-frames/pixilite/pixilite_walk_right_1.png';
import punchkid_down_0 from '../assets/walk-frames/punchkid/punchkid_walk_down_0.png';
import punchkid_down_1 from '../assets/walk-frames/punchkid/punchkid_walk_down_1.png';
import punchkid_up_0 from '../assets/walk-frames/punchkid/punchkid_walk_up_0.png';
import punchkid_up_1 from '../assets/walk-frames/punchkid/punchkid_walk_up_1.png';
import punchkid_left_0 from '../assets/walk-frames/punchkid/punchkid_walk_left_0.png';
import punchkid_left_1 from '../assets/walk-frames/punchkid/punchkid_walk_left_1.png';
import punchkid_right_0 from '../assets/walk-frames/punchkid/punchkid_walk_right_0.png';
import punchkid_right_1 from '../assets/walk-frames/punchkid/punchkid_walk_right_1.png';
import pupbble_down_0 from '../assets/walk-frames/pupbble/pupbble_walk_down_0.png';
import pupbble_down_1 from '../assets/walk-frames/pupbble/pupbble_walk_down_1.png';
import pupbble_up_0 from '../assets/walk-frames/pupbble/pupbble_walk_up_0.png';
import pupbble_up_1 from '../assets/walk-frames/pupbble/pupbble_walk_up_1.png';
import pupbble_left_0 from '../assets/walk-frames/pupbble/pupbble_walk_left_0.png';
import pupbble_left_1 from '../assets/walk-frames/pupbble/pupbble_walk_left_1.png';
import pupbble_right_0 from '../assets/walk-frames/pupbble/pupbble_walk_right_0.png';
import pupbble_right_1 from '../assets/walk-frames/pupbble/pupbble_walk_right_1.png';
import pyromonk_down_0 from '../assets/walk-frames/pyromonk/pyromonk_walk_down_0.png';
import pyromonk_down_1 from '../assets/walk-frames/pyromonk/pyromonk_walk_down_1.png';
import pyromonk_up_0 from '../assets/walk-frames/pyromonk/pyromonk_walk_up_0.png';
import pyromonk_up_1 from '../assets/walk-frames/pyromonk/pyromonk_walk_up_1.png';
import pyromonk_left_0 from '../assets/walk-frames/pyromonk/pyromonk_walk_left_0.png';
import pyromonk_left_1 from '../assets/walk-frames/pyromonk/pyromonk_walk_left_1.png';
import pyromonk_right_0 from '../assets/walk-frames/pyromonk/pyromonk_walk_right_0.png';
import pyromonk_right_1 from '../assets/walk-frames/pyromonk/pyromonk_walk_right_1.png';
import pyropaw_down_0 from '../assets/walk-frames/pyropaw/pyropaw_walk_down_0.png';
import pyropaw_down_1 from '../assets/walk-frames/pyropaw/pyropaw_walk_down_1.png';
import pyropaw_up_0 from '../assets/walk-frames/pyropaw/pyropaw_walk_up_0.png';
import pyropaw_up_1 from '../assets/walk-frames/pyropaw/pyropaw_walk_up_1.png';
import pyropaw_left_0 from '../assets/walk-frames/pyropaw/pyropaw_walk_left_0.png';
import pyropaw_left_1 from '../assets/walk-frames/pyropaw/pyropaw_walk_left_1.png';
import pyropaw_right_0 from '../assets/walk-frames/pyropaw/pyropaw_walk_right_0.png';
import pyropaw_right_1 from '../assets/walk-frames/pyropaw/pyropaw_walk_right_1.png';
import quakehound_down_0 from '../assets/walk-frames/quakehound/quakehound_walk_down_0.png';
import quakehound_down_1 from '../assets/walk-frames/quakehound/quakehound_walk_down_1.png';
import quakehound_up_0 from '../assets/walk-frames/quakehound/quakehound_walk_up_0.png';
import quakehound_up_1 from '../assets/walk-frames/quakehound/quakehound_walk_up_1.png';
import quakehound_left_0 from '../assets/walk-frames/quakehound/quakehound_walk_left_0.png';
import quakehound_left_1 from '../assets/walk-frames/quakehound/quakehound_walk_left_1.png';
import quakehound_right_0 from '../assets/walk-frames/quakehound/quakehound_walk_right_0.png';
import quakehound_right_1 from '../assets/walk-frames/quakehound/quakehound_walk_right_1.png';
import razorgater_down_0 from '../assets/walk-frames/razorgater/razorgater_walk_down_0.png';
import razorgater_down_1 from '../assets/walk-frames/razorgater/razorgater_walk_down_1.png';
import razorgater_up_0 from '../assets/walk-frames/razorgater/razorgater_walk_up_0.png';
import razorgater_up_1 from '../assets/walk-frames/razorgater/razorgater_walk_up_1.png';
import razorgater_left_0 from '../assets/walk-frames/razorgater/razorgater_walk_left_0.png';
import razorgater_left_1 from '../assets/walk-frames/razorgater/razorgater_walk_left_1.png';
import razorgater_right_0 from '../assets/walk-frames/razorgater/razorgater_walk_right_0.png';
import razorgater_right_1 from '../assets/walk-frames/razorgater/razorgater_walk_right_1.png';
import reaperdile_down_0 from '../assets/walk-frames/reaperdile/reaperdile_walk_down_0.png';
import reaperdile_down_1 from '../assets/walk-frames/reaperdile/reaperdile_walk_down_1.png';
import reaperdile_up_0 from '../assets/walk-frames/reaperdile/reaperdile_walk_up_0.png';
import reaperdile_up_1 from '../assets/walk-frames/reaperdile/reaperdile_walk_up_1.png';
import reaperdile_left_0 from '../assets/walk-frames/reaperdile/reaperdile_walk_left_0.png';
import reaperdile_left_1 from '../assets/walk-frames/reaperdile/reaperdile_walk_left_1.png';
import reaperdile_right_0 from '../assets/walk-frames/reaperdile/reaperdile_walk_right_0.png';
import reaperdile_right_1 from '../assets/walk-frames/reaperdile/reaperdile_walk_right_1.png';
import shellguard_down_0 from '../assets/walk-frames/shellguard/shellguard_walk_down_0.png';
import shellguard_down_1 from '../assets/walk-frames/shellguard/shellguard_walk_down_1.png';
import shellguard_up_0 from '../assets/walk-frames/shellguard/shellguard_walk_up_0.png';
import shellguard_up_1 from '../assets/walk-frames/shellguard/shellguard_walk_up_1.png';
import shellguard_left_0 from '../assets/walk-frames/shellguard/shellguard_walk_left_0.png';
import shellguard_left_1 from '../assets/walk-frames/shellguard/shellguard_walk_left_1.png';
import shellguard_right_0 from '../assets/walk-frames/shellguard/shellguard_walk_right_0.png';
import shellguard_right_1 from '../assets/walk-frames/shellguard/shellguard_walk_right_1.png';
import sproutle_down_0 from '../assets/walk-frames/sproutle/sproutle_walk_down_0.png';
import sproutle_down_1 from '../assets/walk-frames/sproutle/sproutle_walk_down_1.png';
import sproutle_up_0 from '../assets/walk-frames/sproutle/sproutle_walk_up_0.png';
import sproutle_up_1 from '../assets/walk-frames/sproutle/sproutle_walk_up_1.png';
import sproutle_left_0 from '../assets/walk-frames/sproutle/sproutle_walk_left_0.png';
import sproutle_left_1 from '../assets/walk-frames/sproutle/sproutle_walk_left_1.png';
import sproutle_right_0 from '../assets/walk-frames/sproutle/sproutle_walk_right_0.png';
import sproutle_right_1 from '../assets/walk-frames/sproutle/sproutle_walk_right_1.png';
import strikechamp_down_0 from '../assets/walk-frames/strikechamp/strikechamp_walk_down_0.png';
import strikechamp_down_1 from '../assets/walk-frames/strikechamp/strikechamp_walk_down_1.png';
import strikechamp_up_0 from '../assets/walk-frames/strikechamp/strikechamp_walk_up_0.png';
import strikechamp_up_1 from '../assets/walk-frames/strikechamp/strikechamp_walk_up_1.png';
import strikechamp_left_0 from '../assets/walk-frames/strikechamp/strikechamp_walk_left_0.png';
import strikechamp_left_1 from '../assets/walk-frames/strikechamp/strikechamp_walk_left_1.png';
import strikechamp_right_0 from '../assets/walk-frames/strikechamp/strikechamp_walk_right_0.png';
import strikechamp_right_1 from '../assets/walk-frames/strikechamp/strikechamp_walk_right_1.png';
import strikechamp_unsuited_down_0 from '../assets/walk-frames/strikechamp_unsuited/strikechamp_unsuited_walk_down_0.png';
import strikechamp_unsuited_down_1 from '../assets/walk-frames/strikechamp_unsuited/strikechamp_unsuited_walk_down_1.png';
import strikechamp_unsuited_up_0 from '../assets/walk-frames/strikechamp_unsuited/strikechamp_unsuited_walk_up_0.png';
import strikechamp_unsuited_up_1 from '../assets/walk-frames/strikechamp_unsuited/strikechamp_unsuited_walk_up_1.png';
import strikechamp_unsuited_left_0 from '../assets/walk-frames/strikechamp_unsuited/strikechamp_unsuited_walk_left_0.png';
import strikechamp_unsuited_left_1 from '../assets/walk-frames/strikechamp_unsuited/strikechamp_unsuited_walk_left_1.png';
import strikechamp_unsuited_right_0 from '../assets/walk-frames/strikechamp_unsuited/strikechamp_unsuited_walk_right_0.png';
import strikechamp_unsuited_right_1 from '../assets/walk-frames/strikechamp_unsuited/strikechamp_unsuited_walk_right_1.png';
import terradog_down_0 from '../assets/walk-frames/terradog/terradog_walk_down_0.png';
import terradog_down_1 from '../assets/walk-frames/terradog/terradog_walk_down_1.png';
import terradog_up_0 from '../assets/walk-frames/terradog/terradog_walk_up_0.png';
import terradog_up_1 from '../assets/walk-frames/terradog/terradog_walk_up_1.png';
import terradog_left_0 from '../assets/walk-frames/terradog/terradog_walk_left_0.png';
import terradog_left_1 from '../assets/walk-frames/terradog/terradog_walk_left_1.png';
import terradog_right_0 from '../assets/walk-frames/terradog/terradog_walk_right_0.png';
import terradog_right_1 from '../assets/walk-frames/terradog/terradog_walk_right_1.png';
import terrapod_down_0 from '../assets/walk-frames/terrapod/terrapod_walk_down_0.png';
import terrapod_down_1 from '../assets/walk-frames/terrapod/terrapod_walk_down_1.png';
import terrapod_up_0 from '../assets/walk-frames/terrapod/terrapod_walk_up_0.png';
import terrapod_up_1 from '../assets/walk-frames/terrapod/terrapod_walk_up_1.png';
import terrapod_left_0 from '../assets/walk-frames/terrapod/terrapod_walk_left_0.png';
import terrapod_left_1 from '../assets/walk-frames/terrapod/terrapod_walk_left_1.png';
import terrapod_right_0 from '../assets/walk-frames/terrapod/terrapod_walk_right_0.png';
import terrapod_right_1 from '../assets/walk-frames/terrapod/terrapod_walk_right_1.png';
import tiidebiite_down_0 from '../assets/walk-frames/tiidebiite/tiidebiite_walk_down_0.png';
import tiidebiite_down_1 from '../assets/walk-frames/tiidebiite/tiidebiite_walk_down_1.png';
import tiidebiite_up_0 from '../assets/walk-frames/tiidebiite/tiidebiite_walk_up_0.png';
import tiidebiite_up_1 from '../assets/walk-frames/tiidebiite/tiidebiite_walk_up_1.png';
import tiidebiite_left_0 from '../assets/walk-frames/tiidebiite/tiidebiite_walk_left_0.png';
import tiidebiite_left_1 from '../assets/walk-frames/tiidebiite/tiidebiite_walk_left_1.png';
import tiidebiite_right_0 from '../assets/walk-frames/tiidebiite/tiidebiite_walk_right_0.png';
import tiidebiite_right_1 from '../assets/walk-frames/tiidebiite/tiidebiite_walk_right_1.png';
import toxitacle_down_0 from '../assets/walk-frames/toxitacle/toxitacle_walk_down_0.png';
import toxitacle_down_1 from '../assets/walk-frames/toxitacle/toxitacle_walk_down_1.png';
import toxitacle_up_0 from '../assets/walk-frames/toxitacle/toxitacle_walk_up_0.png';
import toxitacle_up_1 from '../assets/walk-frames/toxitacle/toxitacle_walk_up_1.png';
import toxitacle_left_0 from '../assets/walk-frames/toxitacle/toxitacle_walk_left_0.png';
import toxitacle_left_1 from '../assets/walk-frames/toxitacle/toxitacle_walk_left_1.png';
import toxitacle_right_0 from '../assets/walk-frames/toxitacle/toxitacle_walk_right_0.png';
import toxitacle_right_1 from '../assets/walk-frames/toxitacle/toxitacle_walk_right_1.png';
import tyrage_down_0 from '../assets/walk-frames/tyrage/tyrage_walk_down_0.png';
import tyrage_down_1 from '../assets/walk-frames/tyrage/tyrage_walk_down_1.png';
import tyrage_up_0 from '../assets/walk-frames/tyrage/tyrage_walk_up_0.png';
import tyrage_up_1 from '../assets/walk-frames/tyrage/tyrage_walk_up_1.png';
import tyrage_left_0 from '../assets/walk-frames/tyrage/tyrage_walk_left_0.png';
import tyrage_left_1 from '../assets/walk-frames/tyrage/tyrage_walk_left_1.png';
import tyrage_right_0 from '../assets/walk-frames/tyrage/tyrage_walk_right_0.png';
import tyrage_right_1 from '../assets/walk-frames/tyrage/tyrage_walk_right_1.png';
import wispkin_down_0 from '../assets/walk-frames/wispkin/wispkin_walk_down_0.png';
import wispkin_down_1 from '../assets/walk-frames/wispkin/wispkin_walk_down_1.png';
import wispkin_up_0 from '../assets/walk-frames/wispkin/wispkin_walk_up_0.png';
import wispkin_up_1 from '../assets/walk-frames/wispkin/wispkin_walk_up_1.png';
import wispkin_left_0 from '../assets/walk-frames/wispkin/wispkin_walk_left_0.png';
import wispkin_left_1 from '../assets/walk-frames/wispkin/wispkin_walk_left_1.png';
import wispkin_right_0 from '../assets/walk-frames/wispkin/wispkin_walk_right_0.png';
import wispkin_right_1 from '../assets/walk-frames/wispkin/wispkin_walk_right_1.png';
import yogiferno_down_0 from '../assets/walk-frames/yogiferno/yogiferno_walk_down_0.png';
import yogiferno_down_1 from '../assets/walk-frames/yogiferno/yogiferno_walk_down_1.png';
import yogiferno_up_0 from '../assets/walk-frames/yogiferno/yogiferno_walk_up_0.png';
import yogiferno_up_1 from '../assets/walk-frames/yogiferno/yogiferno_walk_up_1.png';
import yogiferno_left_0 from '../assets/walk-frames/yogiferno/yogiferno_walk_left_0.png';
import yogiferno_left_1 from '../assets/walk-frames/yogiferno/yogiferno_walk_left_1.png';
import yogiferno_right_0 from '../assets/walk-frames/yogiferno/yogiferno_walk_right_0.png';
import yogiferno_right_1 from '../assets/walk-frames/yogiferno/yogiferno_walk_right_1.png';

export const WALK_CYCLE_V2: Record<string, { source: WalkSource; speciesId: string }> = {
  'aerobeak': { source: 'sheet-only', speciesId: '020' },
  'aquariios': { source: 'frames-dir', speciesId: '003' },
  'ashemit': { source: 'frames-dir', speciesId: '044' },
  'astroleviathan': { source: 'frames-dir', speciesId: '025' },
  'chromejaww': { source: 'frames-dir', speciesId: '005' },
  'cocoonode': { source: 'frames-dir', speciesId: '017' },
  'cragarm': { source: 'frames-dir', speciesId: '036' },
  'dorowani': { source: 'frames-dir', speciesId: '147' },
  'dreadtoise': { source: 'frames-dir', speciesId: '040' },
  'duneclaw': { source: 'frames-dir', speciesId: '008' },
  'duskfiend': { source: 'frames-dir', speciesId: '043' },
  'finblade': { source: 'sheet-only', speciesId: '022' },
  'floatcalf': { source: 'sheet-only', speciesId: '024' },
  'gabu': { source: 'frames-dir', speciesId: '148' },
  'gearkid': { source: 'frames-dir', speciesId: '032' },
  'gorokappa': { source: 'frames-dir', speciesId: '034' },
  'inklet': { source: 'frames-dir', speciesId: '026' },
  'kickmaster': { source: 'frames-dir', speciesId: '031' },
  'kittember': { source: 'frames-dir', speciesId: '010' },
  'krakenox': { source: 'frames-dir', speciesId: '028' },
  'manticlaw': { source: 'frames-dir', speciesId: '012' },
  'mechapion': { source: 'frames-dir', speciesId: '033' },
  'megalochrome': { source: 'sheet-only', speciesId: '023' },
  'mochii': { source: 'frames-dir', speciesId: '001' },
  'mothrix': { source: 'sheet-only', speciesId: '018' },
  'mythar': { source: 'frames-dir', speciesId: '331' },
  'oblivirex': { source: 'frames-dir', speciesId: '009' },
  'pebblefist': { source: 'frames-dir', speciesId: '035' },
  'pixilite': { source: 'frames-dir', speciesId: '041' },
  'punchkid': { source: 'frames-dir', speciesId: '029' },
  'pupbble': { source: 'frames-dir', speciesId: '013' },
  'pyromonk': { source: 'frames-dir', speciesId: '045' },
  'pyropaw': { source: 'frames-dir', speciesId: '011' },
  'quakehound': { source: 'frames-dir', speciesId: '015' },
  'razorgater': { source: 'frames-dir', speciesId: '004' },
  'reaperdile': { source: 'frames-dir', speciesId: '006' },
  'shellguard': { source: 'frames-dir', speciesId: '039' },
  'sproutle': { source: 'frames-dir', speciesId: '038' },
  'squirmite': { source: 'sheet-only', speciesId: '016' },
  'stormtalon': { source: 'sheet-only', speciesId: '021' },
  'strikechamp': { source: 'frames-dir', speciesId: '030' },
  'strikechamp_unsuited': { source: 'frames-dir', speciesId: '030' },
  'strikechamp_unsuited_full': { source: 'sheet-only', speciesId: '030' },
  'terradog': { source: 'frames-dir', speciesId: '014' },
  'terrapod': { source: 'frames-dir', speciesId: '037' },
  'tiidebiite': { source: 'frames-dir', speciesId: '002' },
  'toxitacle': { source: 'frames-dir', speciesId: '027' },
  'tyrage': { source: 'frames-dir', speciesId: '007' },
  'wispkin': { source: 'frames-dir', speciesId: '042' },
  'yogiferno': { source: 'frames-dir', speciesId: '046' },
  'zephling': { source: 'sheet-only', speciesId: '019' },
};

const WALK_FRAMES: Record<string, Record<WalkDir, [string, string]>> = {
  'aquariios': { down: [aquariios_down_0, aquariios_down_1], up: [aquariios_up_0, aquariios_up_1], left: [aquariios_left_0, aquariios_left_1], right: [aquariios_right_0, aquariios_right_1] },
  'ashemit': { down: [ashemit_down_0, ashemit_down_1], up: [ashemit_up_0, ashemit_up_1], left: [ashemit_left_0, ashemit_left_1], right: [ashemit_right_0, ashemit_right_1] },
  'astroleviathan': { down: [astroleviathan_down_0, astroleviathan_down_1], up: [astroleviathan_up_0, astroleviathan_up_1], left: [astroleviathan_left_0, astroleviathan_left_1], right: [astroleviathan_right_0, astroleviathan_right_1] },
  'chromejaww': { down: [chromejaww_down_0, chromejaww_down_1], up: [chromejaww_up_0, chromejaww_up_1], left: [chromejaww_left_0, chromejaww_left_1], right: [chromejaww_right_0, chromejaww_right_1] },
  'cocoonode': { down: [cocoonode_down_0, cocoonode_down_1], up: [cocoonode_up_0, cocoonode_up_1], left: [cocoonode_left_0, cocoonode_left_1], right: [cocoonode_right_0, cocoonode_right_1] },
  'cragarm': { down: [cragarm_down_0, cragarm_down_1], up: [cragarm_up_0, cragarm_up_1], left: [cragarm_left_0, cragarm_left_1], right: [cragarm_right_0, cragarm_right_1] },
  'dorowani': { down: [dorowani_down_0, dorowani_down_1], up: [dorowani_up_0, dorowani_up_1], left: [dorowani_left_0, dorowani_left_1], right: [dorowani_right_0, dorowani_right_1] },
  'dreadtoise': { down: [dreadtoise_down_0, dreadtoise_down_1], up: [dreadtoise_up_0, dreadtoise_up_1], left: [dreadtoise_left_0, dreadtoise_left_1], right: [dreadtoise_right_0, dreadtoise_right_1] },
  'duneclaw': { down: [duneclaw_down_0, duneclaw_down_1], up: [duneclaw_up_0, duneclaw_up_1], left: [duneclaw_left_0, duneclaw_left_1], right: [duneclaw_right_0, duneclaw_right_1] },
  'duskfiend': { down: [duskfiend_down_0, duskfiend_down_1], up: [duskfiend_up_0, duskfiend_up_1], left: [duskfiend_left_0, duskfiend_left_1], right: [duskfiend_right_0, duskfiend_right_1] },
  'gabu': { down: [gabu_down_0, gabu_down_1], up: [gabu_up_0, gabu_up_1], left: [gabu_left_0, gabu_left_1], right: [gabu_right_0, gabu_right_1] },
  'gearkid': { down: [gearkid_down_0, gearkid_down_1], up: [gearkid_up_0, gearkid_up_1], left: [gearkid_left_0, gearkid_left_1], right: [gearkid_right_0, gearkid_right_1] },
  'gorokappa': { down: [gorokappa_down_0, gorokappa_down_1], up: [gorokappa_up_0, gorokappa_up_1], left: [gorokappa_left_0, gorokappa_left_1], right: [gorokappa_right_0, gorokappa_right_1] },
  'inklet': { down: [inklet_down_0, inklet_down_1], up: [inklet_up_0, inklet_up_1], left: [inklet_left_0, inklet_left_1], right: [inklet_right_0, inklet_right_1] },
  'kickmaster': { down: [kickmaster_down_0, kickmaster_down_1], up: [kickmaster_up_0, kickmaster_up_1], left: [kickmaster_left_0, kickmaster_left_1], right: [kickmaster_right_0, kickmaster_right_1] },
  'kittember': { down: [kittember_down_0, kittember_down_1], up: [kittember_up_0, kittember_up_1], left: [kittember_left_0, kittember_left_1], right: [kittember_right_0, kittember_right_1] },
  'krakenox': { down: [krakenox_down_0, krakenox_down_1], up: [krakenox_up_0, krakenox_up_1], left: [krakenox_left_0, krakenox_left_1], right: [krakenox_right_0, krakenox_right_1] },
  'manticlaw': { down: [manticlaw_down_0, manticlaw_down_1], up: [manticlaw_up_0, manticlaw_up_1], left: [manticlaw_left_0, manticlaw_left_1], right: [manticlaw_right_0, manticlaw_right_1] },
  'mechapion': { down: [mechapion_down_0, mechapion_down_1], up: [mechapion_up_0, mechapion_up_1], left: [mechapion_left_0, mechapion_left_1], right: [mechapion_right_0, mechapion_right_1] },
  'mochii': { down: [mochii_down_0, mochii_down_1], up: [mochii_up_0, mochii_up_1], left: [mochii_left_0, mochii_left_1], right: [mochii_right_0, mochii_right_1] },
  'mythar': { down: [mythar_down_0, mythar_down_1], up: [mythar_up_0, mythar_up_1], left: [mythar_left_0, mythar_left_1], right: [mythar_right_0, mythar_right_1] },
  'oblivirex': { down: [oblivirex_down_0, oblivirex_down_1], up: [oblivirex_up_0, oblivirex_up_1], left: [oblivirex_left_0, oblivirex_left_1], right: [oblivirex_right_0, oblivirex_right_1] },
  'pebblefist': { down: [pebblefist_down_0, pebblefist_down_1], up: [pebblefist_up_0, pebblefist_up_1], left: [pebblefist_left_0, pebblefist_left_1], right: [pebblefist_right_0, pebblefist_right_1] },
  'pixilite': { down: [pixilite_down_0, pixilite_down_1], up: [pixilite_up_0, pixilite_up_1], left: [pixilite_left_0, pixilite_left_1], right: [pixilite_right_0, pixilite_right_1] },
  'punchkid': { down: [punchkid_down_0, punchkid_down_1], up: [punchkid_up_0, punchkid_up_1], left: [punchkid_left_0, punchkid_left_1], right: [punchkid_right_0, punchkid_right_1] },
  'pupbble': { down: [pupbble_down_0, pupbble_down_1], up: [pupbble_up_0, pupbble_up_1], left: [pupbble_left_0, pupbble_left_1], right: [pupbble_right_0, pupbble_right_1] },
  'pyromonk': { down: [pyromonk_down_0, pyromonk_down_1], up: [pyromonk_up_0, pyromonk_up_1], left: [pyromonk_left_0, pyromonk_left_1], right: [pyromonk_right_0, pyromonk_right_1] },
  'pyropaw': { down: [pyropaw_down_0, pyropaw_down_1], up: [pyropaw_up_0, pyropaw_up_1], left: [pyropaw_left_0, pyropaw_left_1], right: [pyropaw_right_0, pyropaw_right_1] },
  'quakehound': { down: [quakehound_down_0, quakehound_down_1], up: [quakehound_up_0, quakehound_up_1], left: [quakehound_left_0, quakehound_left_1], right: [quakehound_right_0, quakehound_right_1] },
  'razorgater': { down: [razorgater_down_0, razorgater_down_1], up: [razorgater_up_0, razorgater_up_1], left: [razorgater_left_0, razorgater_left_1], right: [razorgater_right_0, razorgater_right_1] },
  'reaperdile': { down: [reaperdile_down_0, reaperdile_down_1], up: [reaperdile_up_0, reaperdile_up_1], left: [reaperdile_left_0, reaperdile_left_1], right: [reaperdile_right_0, reaperdile_right_1] },
  'shellguard': { down: [shellguard_down_0, shellguard_down_1], up: [shellguard_up_0, shellguard_up_1], left: [shellguard_left_0, shellguard_left_1], right: [shellguard_right_0, shellguard_right_1] },
  'sproutle': { down: [sproutle_down_0, sproutle_down_1], up: [sproutle_up_0, sproutle_up_1], left: [sproutle_left_0, sproutle_left_1], right: [sproutle_right_0, sproutle_right_1] },
  'strikechamp': { down: [strikechamp_down_0, strikechamp_down_1], up: [strikechamp_up_0, strikechamp_up_1], left: [strikechamp_left_0, strikechamp_left_1], right: [strikechamp_right_0, strikechamp_right_1] },
  'strikechamp_unsuited': { down: [strikechamp_unsuited_down_0, strikechamp_unsuited_down_1], up: [strikechamp_unsuited_up_0, strikechamp_unsuited_up_1], left: [strikechamp_unsuited_left_0, strikechamp_unsuited_left_1], right: [strikechamp_unsuited_right_0, strikechamp_unsuited_right_1] },
  'terradog': { down: [terradog_down_0, terradog_down_1], up: [terradog_up_0, terradog_up_1], left: [terradog_left_0, terradog_left_1], right: [terradog_right_0, terradog_right_1] },
  'terrapod': { down: [terrapod_down_0, terrapod_down_1], up: [terrapod_up_0, terrapod_up_1], left: [terrapod_left_0, terrapod_left_1], right: [terrapod_right_0, terrapod_right_1] },
  'tiidebiite': { down: [tiidebiite_down_0, tiidebiite_down_1], up: [tiidebiite_up_0, tiidebiite_up_1], left: [tiidebiite_left_0, tiidebiite_left_1], right: [tiidebiite_right_0, tiidebiite_right_1] },
  'toxitacle': { down: [toxitacle_down_0, toxitacle_down_1], up: [toxitacle_up_0, toxitacle_up_1], left: [toxitacle_left_0, toxitacle_left_1], right: [toxitacle_right_0, toxitacle_right_1] },
  'tyrage': { down: [tyrage_down_0, tyrage_down_1], up: [tyrage_up_0, tyrage_up_1], left: [tyrage_left_0, tyrage_left_1], right: [tyrage_right_0, tyrage_right_1] },
  'wispkin': { down: [wispkin_down_0, wispkin_down_1], up: [wispkin_up_0, wispkin_up_1], left: [wispkin_left_0, wispkin_left_1], right: [wispkin_right_0, wispkin_right_1] },
  'yogiferno': { down: [yogiferno_down_0, yogiferno_down_1], up: [yogiferno_up_0, yogiferno_up_1], left: [yogiferno_left_0, yogiferno_left_1], right: [yogiferno_right_0, yogiferno_right_1] },
};

/**
 * Resolve the walk frame for one tile step. Returns a frames-dir step PNG URL
 * on step phases, or null on stand phases — null means 'render the sheet cell'
 * (PixiWorldCanvas already does exactly that when playerWalkFrameUrl is null),
 * which keeps sheet cells as the standing authority. Sheet-only sets and
 * unknown folders always return null (existing sheet path, unchanged).
 */
export function resolveWalkFrameUrl(folder: string, dir: string, walkStep: number): string | null {
  const entry = WALK_CYCLE_V2[folder];
  if (!entry || entry.source !== 'frames-dir') return null;
  const frames = WALK_FRAMES[folder];
  if (!frames) return null;
  const d = (['down', 'up', 'left', 'right'] as WalkDir[]).includes(dir as WalkDir) ? (dir as WalkDir) : 'down';
  const phase = ((walkStep % 4) + 4) % 4;
  if (phase === 0) return frames[d][0];
  if (phase === 2) return frames[d][1];
  return null; // stand phases: sheet cell is the standing authority
}

/** SpeciesId-keyed entry point (CreatureModeView call site). */
export function resolveWalkFrameUrlBySpecies(speciesId: string, dir: string, walkStep: number): string | null {
  const folder = SPECIES_FOLDER[speciesId];
  if (!folder) return null;
  return resolveWalkFrameUrl(folder, dir, walkStep);
}

