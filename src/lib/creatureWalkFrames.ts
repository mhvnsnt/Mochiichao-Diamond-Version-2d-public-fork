/**
 * Creature Mode Pass 8 — walk-frame wiring for the four wild species.
 *
 * Correction to earlier lane counts: walk frames for Mochii (001),
 * Razorgater (004), and Kittember (010) were ALREADY in the repo
 * under src/assets/walk-frames/ (PR #91 walk batch, byte-identical
 * to the sprite-art staged files). They were never wired into
 * Creature Mode rendering — Creature Mode only bobbed the static
 * sheet cells. Tyrage (007) was the one missing set, and is added
 * in this pass from sprite-art/walk-frames/tyrage (8 frames, 2 per
 * direction, manifest eye_check staged).
 *
 * Razorgater caveat, stated plainly: the staged Razorgater down
 * frames carry a grey ellipse ground shadow from the sprite-art
 * cut (manifest caveat). Engine shadows are rendered separately;
 * shadow removal for those two down frames is still owed as a
 * sprite-lane cleanup, and is NOT hidden by this wiring — the
 * frames are shipped as staged, with this caveat in the doc.
 */
import mochii_down_0 from '../assets/walk-frames/mochii/mochii_walk_down_0.png';
import mochii_down_1 from '../assets/walk-frames/mochii/mochii_walk_down_1.png';
import mochii_up_0 from '../assets/walk-frames/mochii/mochii_walk_up_0.png';
import mochii_up_1 from '../assets/walk-frames/mochii/mochii_walk_up_1.png';
import mochii_left_0 from '../assets/walk-frames/mochii/mochii_walk_left_0.png';
import mochii_left_1 from '../assets/walk-frames/mochii/mochii_walk_left_1.png';
import mochii_right_0 from '../assets/walk-frames/mochii/mochii_walk_right_0.png';
import mochii_right_1 from '../assets/walk-frames/mochii/mochii_walk_right_1.png';
import razorgater_down_0 from '../assets/walk-frames/razorgater/razorgater_walk_down_0.png';
import razorgater_down_1 from '../assets/walk-frames/razorgater/razorgater_walk_down_1.png';
import razorgater_up_0 from '../assets/walk-frames/razorgater/razorgater_walk_up_0.png';
import razorgater_up_1 from '../assets/walk-frames/razorgater/razorgater_walk_up_1.png';
import razorgater_left_0 from '../assets/walk-frames/razorgater/razorgater_walk_left_0.png';
import razorgater_left_1 from '../assets/walk-frames/razorgater/razorgater_walk_left_1.png';
import razorgater_right_0 from '../assets/walk-frames/razorgater/razorgater_walk_right_0.png';
import razorgater_right_1 from '../assets/walk-frames/razorgater/razorgater_walk_right_1.png';
import tyrage_down_0 from '../assets/walk-frames/tyrage/tyrage_walk_down_0.png';
import tyrage_down_1 from '../assets/walk-frames/tyrage/tyrage_walk_down_1.png';
import tyrage_up_0 from '../assets/walk-frames/tyrage/tyrage_walk_up_0.png';
import tyrage_up_1 from '../assets/walk-frames/tyrage/tyrage_walk_up_1.png';
import tyrage_left_0 from '../assets/walk-frames/tyrage/tyrage_walk_left_0.png';
import tyrage_left_1 from '../assets/walk-frames/tyrage/tyrage_walk_left_1.png';
import tyrage_right_0 from '../assets/walk-frames/tyrage/tyrage_walk_right_0.png';
import tyrage_right_1 from '../assets/walk-frames/tyrage/tyrage_walk_right_1.png';
import kittember_down_0 from '../assets/walk-frames/kittember/kittember_walk_down_0.png';
import kittember_down_1 from '../assets/walk-frames/kittember/kittember_walk_down_1.png';
import kittember_up_0 from '../assets/walk-frames/kittember/kittember_walk_up_0.png';
import kittember_up_1 from '../assets/walk-frames/kittember/kittember_walk_up_1.png';
import kittember_left_0 from '../assets/walk-frames/kittember/kittember_walk_left_0.png';
import kittember_left_1 from '../assets/walk-frames/kittember/kittember_walk_left_1.png';
import kittember_right_0 from '../assets/walk-frames/kittember/kittember_walk_right_0.png';
import kittember_right_1 from '../assets/walk-frames/kittember/kittember_walk_right_1.png';

export type WalkDir = 'down' | 'up' | 'left' | 'right';

const WALK_FRAMES: Record<string, Record<WalkDir, [string, string]>> = {
  '001': { down: [mochii_down_0, mochii_down_1], up: [mochii_up_0, mochii_up_1], left: [mochii_left_0, mochii_left_1], right: [mochii_right_0, mochii_right_1] },
  '004': { down: [razorgater_down_0, razorgater_down_1], up: [razorgater_up_0, razorgater_up_1], left: [razorgater_left_0, razorgater_left_1], right: [razorgater_right_0, razorgater_right_1] },
  '007': { down: [tyrage_down_0, tyrage_down_1], up: [tyrage_up_0, tyrage_up_1], left: [tyrage_left_0, tyrage_left_1], right: [tyrage_right_0, tyrage_right_1] },
  '010': { down: [kittember_down_0, kittember_down_1], up: [kittember_up_0, kittember_up_1], left: [kittember_left_0, kittember_left_1], right: [kittember_right_0, kittember_right_1] },
};

export function creatureWalkFrameUrl(speciesId: string, dir: string, phase: number): string | null {
  const entry = WALK_FRAMES[speciesId];
  if (!entry) return null;
  const frames = entry[(dir as WalkDir) in entry ? (dir as WalkDir) : 'down'];
  return frames[phase % 2];
}
