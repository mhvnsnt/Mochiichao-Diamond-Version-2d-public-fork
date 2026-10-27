import React from 'react';
import TitleScene from './TitleScene';
import yogifernoWalkCutout from '../../assets/title/yogiferno-walk-cutout.png';

/**
 * Yogiferno title walk — CLEAN CUTOUT version (Mars, 2026-10-25).
 * Replaces the PR #28 Pixi Graphics placeholder figure: the figure
 * is now Yogiferno's own clean walking cutout
 * (sprite-art/2d-sheets/yogiferno/yogiferno-walk-cutout-clean.png,
 * 145x190, transparent, single walking figure, fire halo baked in),
 * shipped here as src/assets/title/yogiferno-walk-cutout.png.
 * He walks through, fire trail behind him (Pixi embers + fading
 * scorch glow, sine sway), white fur + blue markings vs orange/red
 * fire as the intentional contrast. Snow variant: same walk, snow
 * biome, fire trail on snow. No Pokemon creature art, logo, name,
 * dialogue or music. No static Pillow trail — motion is Pixi.
 */
export default function YogifernoTitleWalk({ variant, biome }: { variant: 'walk' | 'snow'; biome?: 'snow' | 'grass' | 'water' | 'sand' | 'stone' | 'forest' | 'rain' | 'night' }) {
  const resolvedBiome = biome || (variant === 'snow' ? 'snow' : 'night');
  return (
    <TitleScene
      biome={resolvedBiome}
      figureUrl={yogifernoWalkCutout}
      figureAlt="Yogiferno walking"
      figureName="Yogiferno"
      // Title card owns the prompt: a press plays Yogiferno's own
      // cry variant (titleCryGate rotation), waits 90 frames, then
      // drives the white fade. Raw TitleScene renders without
      // startPrompt stay prompt-less; only this card wrapper opts in.
      startPrompt
      fireTrail
      caption={`Yogiferno walk — clean cutout (145x190, transparent) + Pixi particles + sine sway, ${resolvedBiome} biome. Fire halo is in the cutout.`}
    />
  );
}
