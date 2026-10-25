import React from 'react';

/**
 * StdWindow — the ONE frame everywhere (game-flow v4, text_window.c
 * 9-slice structure translated to CSS: corners + edges + fill become
 * one consistent border, radius and shadow).
 *
 * Palette (v4 spec, Mochiichao): panel #16233a at ~92%, border
 * teal/cyan #22d3ee, gold accent #fbbf24 for the selected window,
 * text #f1f5f9, danger #ef4444. Font is the game font from index.css
 * (Trebuchet MS / Segoe UI) — never mono.
 *
 * Use this for new v4 screens (main menu windows, dialogue box) and
 * for any panel that previously used a one-off background. Existing
 * .game-panel panels already share this palette after the v4 CSS
 * unification in index.css, so StdWindow and game-panel look the same
 * — that is the point: one frame, not a different frame per screen.
 */
export default function StdWindow({ children, className = '', selected = false, style, onClick }: {
  children: React.ReactNode;
  className?: string;
  selected?: boolean;
  style?: React.CSSProperties;
  onClick?: () => void;
  // React's JSX key is stripped at runtime, but tsc checks it against
  // this props type when StdWindow is used in a list, so declare it.
  key?: React.Key;
}) {
  return (
    <div
      className={`std-window ${selected ? 'std-window-selected' : ''} ${className}`}
      style={style}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
