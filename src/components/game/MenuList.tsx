import React from 'react';

/**
 * Vertical menu list, translated from the decomp start-menu structure
 * (structure/rules only, no Pokemon code, art, text, or names copied):
 * one item per row, ~15px row spacing, a distinct cursor/selected row,
 * and a bottom help line describing the selected item. Used by the
 * pause/overlay menu; full-screen screens keep their own layout and
 * only gain a help line where they already have a list selection.
 */
export interface MenuListItem {
  label: string;
  help: string;
  action: () => void;
}

export function MenuList({ items, selected, onSelect, gapPx }: {
  items: MenuListItem[];
  selected: number;
  onSelect: (index: number) => void;
  gapPx?: number;
}) {
  return (
    <div className="flex flex-col" style={{ gap: `${gapPx ?? 15}px` }}>
      {items.map((item, i) => (
        <button
          key={item.label}
          onClick={item.action}
          onMouseEnter={() => onSelect(i)}
          onFocus={() => onSelect(i)}
          className={`game-button px-4 py-2.5 font-bold text-left flex items-center gap-2 ${
            i === selected ? 'ring-2 ring-yellow-300 brightness-125' : 'opacity-90'
          }`}
        >
          <span aria-hidden="true">{i === selected ? '►' : '·'}</span>
          <span className="flex-1">{item.label}</span>
        </button>
      ))}
    </div>
  );
}

/** Bottom help line: describes the selected item, nothing more. */
export function MenuHelpLine({ text }: { text: string }) {
  return (
    <div className="game-panel px-3 py-2 text-sm text-slate-200 shrink-0" role="note">
      {text}
    </div>
  );
}
