import React, { useEffect, useMemo, useRef, useState } from 'react';
import HumanPortrait from './HumanPortrait';
import StdWindow from './StdWindow';
import { useGameStore } from '../../store/gameStore';
import { TEXT_SPEED_MS } from '../../lib/gameSettings';
import { messageWindowStyle } from '../../lib/hudCustom';
import type { MessageWindowStyle } from '../../lib/hudCustom';
import type { HumanSlot } from '../../lib/humanSheets';

/**
 * DialogueBox — game-flow v4 dialogue system (field_message_box.c
 * structure only: NORMAL message box, one message at a time, continue
 * arrow; AUTO_SCROLL / HIDDEN are not used here).
 *
 * Rules, v4 spec:
 * - Bottom, full width (within safe margins), over the world canvas.
 * - 2 lines max per page: a long line is split at word boundaries
 *   into pages of at most ~85 characters, so no text is ever hidden
 *   by clamping. Empty lines are dropped (starter NPC dialogues carry
 *   a trailing empty line; dropping it is not a content change).
 * - Typewriter print: characters reveal over time; pressing advance
 *   while typing finishes the page instantly, pressing again moves on.
 * - Continue arrow (▼) while more pages remain; on the last page the
 *   arrow is hidden and advance completes the dialogue — unless this
 *   is a choice dialogue, in which case YES / NO buttons appear
 *   instead and advance does nothing (the player must choose).
 * - Portrait on the left: the speaker's human slot when it has art,
 *   otherwise HumanPortrait's silhouette placeholder — never emoji,
 *   never a text-only floating box. Speakers with no sheet yet
 *   (Aeon, Mochiko, Hex, Mom) therefore show the silhouette, which
 *   is the spec's placeholder, not a bug.
 * - Keyboard: Enter / Space advance (same as click / A button via
 *   registerAdvance). The caller must NOT also advance on those keys
 *   while this box is mounted, or a press would advance twice.
 */
export function chunkDialogueLines(lines: string[]): string[] {
  const pages: string[] = [];
  for (const raw of lines || []) {
    const line = (raw || '').trim();
    if (!line) continue;
    if (line.length <= 85) { pages.push(line); continue; }
    const words = line.split(/\s+/);
    let cur = '';
    for (const w of words) {
      if (!cur) { cur = w; continue; }
      if ((cur + ' ' + w).length > 85) { pages.push(cur); cur = w; }
      else cur += ' ' + w;
    }
    if (cur) pages.push(cur);
  }
  return pages.length > 0 ? pages : ['...'];
}

export default function DialogueBox({ lines, speakerName, speakerSlot, choice, onComplete, onChoice, registerAdvance }: {
  lines: string[];
  speakerName?: string;
  speakerSlot?: HumanSlot | null;
  /** When set, YES/NO buttons appear on the last page instead of advancing. */
  choice?: boolean;
  onComplete: () => void;
  onChoice?: (yes: boolean) => void;
  registerAdvance?: (fn: (() => void) | null) => void;
}) {
  const pages = useMemo(() => chunkDialogueLines(lines), [lines]);
  const [pageIdx, setPageIdx] = useState(0);
  // v5.1: reset paging when the dialogue CONTENT changes. Before
  // v5.1 pageIdx persisted across dialogues while the box stayed
  // mounted (screen stays "dialog" when handleChoice replaces the
  // choice dialogue with the gift dialogue), so the gift dialogue
  // started at page 1 and its first line ("You chose your
  // partner!") was never shown in the v5 playtest. Resetting on
  // content (not array identity) avoids resetting on every render.
  const pagesKey = pages.join('\n');
  useEffect(() => { setPageIdx(0); setShown(0); }, [pagesKey]);
  const [shown, setShown] = useState(0);
  // Settings wiring: TEXT SPEED row controls this interval.
  // MID 18ms is the pre-existing interval, kept exactly.
  const textSpeed = useGameStore(s => s.settings.textSpeed);
  const typeInterval = TEXT_SPEED_MS[textSpeed] ?? 18;
  // Batch A: message window style + border opacity / shadow rows.
  const hudSettings = useGameStore(s => s.settings);
  const msgStyle = messageWindowStyle(hudSettings.hudMessageStyle as MessageWindowStyle, hudSettings.panelOpacity || 100);
  const page = pages[Math.min(pageIdx, pages.length - 1)];
  const typingDone = shown >= page.length;
  const isLast = pageIdx >= pages.length - 1;
  const stateRef = useRef({ pageIdx, shown, typingDone, isLast });
  stateRef.current = { pageIdx, shown, typingDone, isLast };

  // Typewriter: reveal ~1 char per typeInterval, where typeInterval
  // is the Settings TEXT SPEED row (SLOW 45 / MID 18 / FAST 6 ms).
  useEffect(() => {
    setShown(0);
    if (page.length === 0) return;
    const iv = setInterval(() => {
      setShown(s => {
        if (s >= page.length) { clearInterval(iv); return s; }
        return s + 1;
      });
    }, typeInterval);
    return () => clearInterval(iv);
  }, [page, pageIdx, typeInterval]);

  const advance = React.useCallback(() => {
    const st = stateRef.current;
    if (!st.typingDone) { setShown(page.length); return; }
    if (!st.isLast) { setPageIdx(i => i + 1); return; }
    if (choice) return; // must click YES / NO
    onComplete();
  }, [choice, onComplete, page.length]);

  useEffect(() => {
    if (registerAdvance) {
      registerAdvance(advance);
      return () => registerAdvance(null);
    }
  }, [advance, registerAdvance]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // v5.2: a choice dialogue must be keyboard-selectable too.
      // Before v5.2 Enter/Space called advance(), which returns
      // early for choice dialogues ("must click YES / NO"), so
      // keyboard users could not answer YES/NO at all — part of
      // the v5.1 playtest blocker (the other part was the A/B
      // cluster covering the YES/NO buttons; see WorldEngine).
      // Y/N now answer directly; Enter/Space are left alone for
      // choice dialogues so a focused YES/NO button can activate.
      if (choice && onChoice) {
        if (e.key === 'y' || e.key === 'Y') { onChoice(true); return; }
        if (e.key === 'n' || e.key === 'N') { onChoice(false); return; }
        return;
      }
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        advance();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [advance, choice, onChoice]);

  return (
    <StdWindow
      style={{
        position: 'absolute', left: '0.75rem', right: '0.75rem', zIndex: 50,
        padding: '16px', cursor: 'pointer',
        bottom: 'max(1rem, env(safe-area-inset-bottom))',
        ...msgStyle,
        // Batch B radius row wins on DialogueBox only (its dedicated
        // row claims DialogueBox radius via this var); Batch A style
        // background / shadow / opacity above still apply, and Batch A
        // radii still apply fully on BattleView's message panel.
        borderRadius: 'var(--menu-dialogue-radius, 14px)',
        boxShadow: hudSettings.panelShadow
          ? '0 10px 30px rgba(0,0,0,0.65)'
          : msgStyle.boxShadow,
      }}
      onClick={advance}
    >
      <div className="flex gap-3 items-start">
        {speakerSlot && (
          <div className="shrink-0">
            <HumanPortrait slot={speakerSlot} view="front" size={56} />
          </div>
        )}
        <div className="flex-1 min-w-0">
          {speakerName && (
            <div className="text-teal-300 text-xs font-bold tracking-widest mb-2 uppercase" style={{ fontFamily: 'var(--small-font, "Trebuchet MS", sans-serif)' }}>{speakerName}</div>
          )}
          {/* Dialogue text uses the DIALOGUE FONT placement
              (--dialogue-font, default 01 Digitall); the speaker
              name above uses the MAIN FONT via the body stack. */}
          <div className="text-white text-base leading-relaxed min-h-[3rem] whitespace-pre-wrap" style={{ fontFamily: 'var(--dialogue-font, "Trebuchet MS", "Segoe UI", system-ui, sans-serif)', fontSize: 'var(--menu-text-size, 16px)', lineHeight: 'var(--menu-line-height, 1.625)', color: 'var(--menu-text-color, #ffffff)', textShadow: 'var(--menu-text-shadow, none)' }}>
            {page.slice(0, shown)}
          </div>
          {!isLast && typingDone && (
            <div className="text-teal-300 text-xs text-right mt-2 animate-pulse">▼</div>
          )}
          {isLast && typingDone && !choice && (
            <div className="text-teal-300 text-xs text-right mt-2 animate-pulse">▼</div>
          )}
          {isLast && typingDone && choice && onChoice && (
            <div className="flex gap-3 mt-3 justify-end">
              <button onClick={(e) => { e.stopPropagation(); onChoice(true); }} className="game-button px-6 py-2 font-bold min-h-[48px]">YES</button>
              <button onClick={(e) => { e.stopPropagation(); onChoice(false); }} className="game-button px-6 py-2 font-bold min-h-[48px]">NO</button>
            </div>
          )}
        </div>
      </div>
    </StdWindow>
  );
}
