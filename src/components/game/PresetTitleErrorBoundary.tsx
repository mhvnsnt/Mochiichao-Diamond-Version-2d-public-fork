import React, { type ReactNode } from "react";

/**
 * PresetTitleErrorBoundary — failure shell for the interchangeable
 * start screens (trap-fix round 2, 2026-10-27).
 *
 * WHY A CLASS BOUNDARY, AND WHY IT TYPE-CHECKS NOWHERE HERE:
 * React error boundaries must be class components — there is no
 * function-component equivalent. This repo ships no @types/react,
 * so `tsc --noEmit` already fails on main for unrelated missing
 * modules and cannot type-check a class component either; the
 * repo's real build gate is `vite build` (esbuild strips types
 * without checking them), and this file passes that gate. The
 * boundary is therefore judged by the vite build + runtime
 * behaviour, not by tsc — same standard as every other file on
 * main right now.
 *
 * WHY IT EXISTS: PR #270's recovery lived INSIDE TitleStartScreen
 * (its painted fallback, its RESET button, its R listener). Live
 * playtest 2026-10-27 on the verified #270 build showed ALL of
 * those absent at once (black title, 0 interactive elements, R
 * dead) — which means the preset subtree never mounted or its
 * render/effect failed before any of its own recovery could run.
 * A fix inside the failing component cannot recover from the
 * component failing. This boundary sits ABOVE TitleStartScreen in
 * IntroSequence's TITLE branch: if anything in the preset subtree
 * throws during render or commit, the boundary swaps in the
 * fallback (painted background + locked overlay + RESET button)
 * instead of a black screen. The fallback's RESET button and
 * IntroSequence's parent-level R listener (same branch) clear the
 * stored preset back to the locked default, so the game is never
 * trapped by a preset again. The locked default never mounts this
 * boundary and is untouched.
 *
 * NOTE ON COVERAGE, STATED HONESTLY: boundaries catch render and
 * commit-phase errors in their subtree. They do NOT catch errors
 * in event handlers or in async code outside the commit — which is
 * why the Pixi init chain in TitleScene also gets a .catch (same
 * PR) and why the R listener lives in IntroSequence itself. If a
 * future browser console capture shows an error this boundary did
 * NOT catch, that console line — not a guess — names the next fix.
 */
type PresetTitleErrorBoundaryProps = {
  fallback: ReactNode;
  children: ReactNode;
};

type PresetTitleErrorBoundaryState = {
  hasError: boolean;
};

export default class PresetTitleErrorBoundary extends React.Component<
  PresetTitleErrorBoundaryProps,
  PresetTitleErrorBoundaryState
> {
  state: PresetTitleErrorBoundaryState = { hasError: false };

  // Type-only: the repo ships no @types/react, so tsc cannot see the
  // inherited `props` member from React.Component (TS2339, lines 70-71).
  // `declare` adds the type without emitting anything (useDefineForClassFields
  // is false), so runtime behaviour is byte-identical.
  declare props: PresetTitleErrorBoundaryProps;

  static getDerivedStateFromError(): PresetTitleErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: unknown): void {
    // Logged (not swallowed) so a browser console capture during
    // the next live playtest shows the real preset error, if any.
    // eslint-disable-next-line no-console
    console.error("[PresetTitle] preset title failed, showing fallback:", error);
  }

  render(): ReactNode {
    if (this.state.hasError) return this.props.fallback;
    return this.props.children;
  }
}
