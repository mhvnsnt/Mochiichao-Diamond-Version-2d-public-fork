import React from 'react';
import type { UiArtSlot } from '../../lib/uiArt';

/**
 * Manifest-driven UI pieces. When the UI Art lane delivers an asset for
 * a slot, it renders as a background image; until then it renders the
 * placeholder UI system (game-panel / game-button classes, non-mono
 * font). Swapping art in is an asset swap in lib/uiArt.ts — no
 * rewrite of the screens that use these components.
 */
export function UiPanel({ slot, className = '', children, style }: {
  slot: UiArtSlot; className?: string; children?: React.ReactNode; style?: React.CSSProperties;
}) {
  return (
    <div
      className={slot.assetUrl ? '' : `game-panel ${className}`}
      style={slot.assetUrl ? { ...style, backgroundImage: `url(${slot.assetUrl})`, backgroundSize: 'cover', backgroundRepeat: 'no-repeat' } : style}
    >
      {children}
    </div>
  );
}

export function UiButton({ slot, className = '', children, ...props }: {
  slot: UiArtSlot; className?: string; children?: React.ReactNode;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={slot.assetUrl ? className : `game-button ${className}`}
      style={slot.assetUrl ? { backgroundImage: `url(${slot.assetUrl})`, backgroundSize: 'cover', backgroundRepeat: 'no-repeat' } : undefined}
      {...props}
    >
      {children}
    </button>
  );
}
