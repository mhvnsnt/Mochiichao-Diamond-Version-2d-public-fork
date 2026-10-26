// followerWalk.js — party-creature follower prototype (HANDOFF, 2026-10-25).
//
// Party creatures follow the player in the overworld (see
// FOLLOWER-SPEC.md). This module is the trail rule only: followers
// target points along the player's recent path, step toward them, face
// travel direction while moving and face the player while idle.
// NOT wired into the game or the overworld; the Step 3 overworld agent
// owns wiring. Pure, no DOM, no game imports.
// Node-testable: node --test followerWalk.test.js
'use strict';

const DIRS = Object.freeze(['up', 'down', 'left', 'right']);

function facingFromDelta(dx, dy) {
  if (dx === 0 && dy === 0) return null;
  if (Math.abs(dx) >= Math.abs(dy)) return dx > 0 ? 'right' : 'left';
  return dy > 0 ? 'down' : 'up';
}
// Facing from follower position toward the player (idle facing).
function facingTowardPlayer(fx, fy, px, py) {
  return facingFromDelta(px - fx, py - fy) || 'down';
}

function createFollowerState(count, spacing) {
  const n = Math.max(0, Math.floor(typeof count === 'number' ? count : 0));
  const sp = typeof spacing === 'number' && spacing > 0 ? spacing : 1;
  const followers = [];
  for (let i = 0; i < n; i++) followers.push({ x: 0, y: 0, facing: 'down', placed: false });
  return { spacing: sp, path: [], followers };
}

function recordPlayerStep(state, x, y) {
  if (!state) return state;
  const last = state.path[state.path.length - 1];
  if (!last || last.x !== x || last.y !== y) state.path.push({ x, y });
  if (state.path.length > 256) state.path.splice(0, state.path.length - 256);
  return state;
}

// Trail target for follower i: the path point spacing*(i+1) steps
// back from the player's current position, counting path points as
// unit steps. Returns null when the path is too short (follower
// stays unplaced until the player has walked far enough).
function trailTarget(state, index) {
  const stepsBack = Math.max(1, Math.round(state.spacing * (index + 1)));
  const at = state.path.length - 1 - stepsBack;
  if (at < 0) return null;
  return state.path[at];
}

// Advance each follower at most one unit step toward its trail target.
// A follower already on its target goes idle and faces the player.
// A follower whose step tile is occupied (player or a follower ahead)
// waits this tick and faces the player. Returns the follower array.
function updateFollowers(state, playerX, playerY, playerFacing) {
  if (!state) return [];
  const occupied = new Set([playerX + ',' + playerY]);
  for (let i = 0; i < state.followers.length; i++) {
    const f = state.followers[i];
    const target = trailTarget(state, i);
    if (!target) {
      f.facing = playerFacing && DIRS.includes(playerFacing) ? playerFacing : 'down';
      continue;
    }
    const dx = target.x - f.x;
    const dy = target.y - f.y;
    if (dx === 0 && dy === 0) {
      f.placed = true;
      f.facing = facingTowardPlayer(f.x, f.y, playerX, playerY);
      occupied.add(f.x + ',' + f.y);
      continue;
    }
    // One step, dominant axis first, so followers walk the trail
    // rather than cutting diagonally across corners.
    const prevX = f.x;
    const prevY = f.y;
    let nx = f.x;
    let ny = f.y;
    if (Math.abs(dx) >= Math.abs(dy)) nx += Math.sign(dx);
    else ny += Math.sign(dy);
    if (occupied.has(nx + ',' + ny)) {
      f.facing = facingTowardPlayer(f.x, f.y, playerX, playerY);
      occupied.add(f.x + ',' + f.y);
      continue;
    }
    f.x = nx; f.y = ny; f.placed = true;
    f.facing = facingFromDelta(nx - prevX, ny - prevY) || f.facing;
    occupied.add(f.x + ',' + f.y);
  }
  return state.followers;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    DIRS, facingFromDelta, facingTowardPlayer,
    createFollowerState, recordPlayerStep, trailTarget, updateFollowers,
  };
}
