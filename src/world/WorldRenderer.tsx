import React from "react";
import { TILE_STYLE, TILE, NPC_SPRITES } from "./WorldConstants";
import { TILE_IMAGE } from "./tileAtlas";

export function renderTile({ tile, vx, vy, viewH, TILE_SIZE, isPlayer, npc, isNight, playerDir, isDefeated, hasStarter, animWalk }: any) {
  const ts = TILE_STYLE[tile] ?? TILE_STYLE[0];
  const perspScale = 0.88 + (vy / viewH) * 0.12;
  const tileH = Math.round(TILE_SIZE * perspScale);

  let bg = ts.bg;
  let extraStyle: React.CSSProperties = {};
  let overlay = null;

  // Step 1 environment tiles: a verified Kenney tile image replaces the
  // flat colour + gradient for mapped tiles. The flat colour stays as
  // `background` underneath, so a missing image falls back to the old
  // look instead of a blank tile. Unmapped tiles keep flat colours.
  const tileImage = TILE_IMAGE[tile];
  if (tileImage) {
    extraStyle = {
      backgroundImage: `url(${tileImage})`,
      backgroundSize: "100% 100%",
      imageRendering: "pixelated",
    };
  }

  if (tile === TILE.WATER) {
    bg = "#1a5aae";
    extraStyle = { backgroundImage:"repeating-linear-gradient(135deg,#1a5aae,#2272cc 5px,#1a5aae 10px)", animation:"waterflow 2.5s linear infinite" };
  }
  if (tile === TILE.TALL_GRASS && !tileImage) {
    bg = "#2a6a15";
    extraStyle = { backgroundImage:"repeating-linear-gradient(90deg,#2a6a15,#3d8a22 3px,#2a6a15 6px)" };
  }
  if (tile === TILE.PATH && !tileImage) {
    bg = "#c0986a";
    extraStyle = { backgroundImage:"repeating-linear-gradient(45deg,#c0986a,#c8a870 4px,#b89060 4px,#c0986a 8px)" };
  }
  if (tile === TILE.LEDGE) {
    bg = "#2d6a1a";
    extraStyle = { borderBottom:"3px solid #8b6a30" };
  }
  if (tile === TILE.BUILDING) {
    bg = "#6a4a2a";
    extraStyle = {
      background:"linear-gradient(180deg,#7a5a3a 0%,#5a3a1a 100%)",
      borderTop:"2px solid #9a7a5a",
      borderLeft:"1px solid #8a6a4a",
    };
  }

  let labelStr = ts.label;

  // React nodes
  let node = null;
  const scaleTr = `scale(${0.85 + (vy / viewH) * 0.15})`;

  if (tile === TILE.BUILDING && vy > 0) {
     node = <div style={{ position:"absolute", bottom:0, left:0, right:0, height: TILE_SIZE * 0.35, background:"linear-gradient(180deg,rgba(0,0,0,0) 0%,rgba(0,0,0,0.5) 100%)", pointerEvents:"none" }} />;
  }
  
  if (tile === TILE.DOOR) {
     node = <div style={{ position:"absolute", inset:0, background:"radial-gradient(ellipse at 50% 80%,rgba(255,200,100,0.4) 0%,transparent 70%)", pointerEvents:"none" }} />;
  }

  if (npc && !isPlayer) {
    const shadow = "rgba(0,0,0,0.3)";
    node = (
      <div style={{ position:"absolute", inset:0, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"flex-end", paddingBottom:2, zIndex:5, filter: isDefeated ? "grayscale(0.8) brightness(0.5)" : "none" }}>
         <div style={{ width: TILE_SIZE*0.7, height: 4, background: shadow, borderRadius:"50%", position:"absolute", bottom:2, filter:"blur(2px)" }} />
         <span style={{ fontSize: TILE_SIZE * 0.65, lineHeight:1, filter:"drop-shadow(0 -1px 1px rgba(0,0,0,0.4))", transform: scaleTr, zIndex:2 }}>
           {npc.sprite}
         </span>
         {!isDefeated && npc.battle && <div className="animate-bounce" style={{ position:"absolute", top:-6, color:"#ff4444", fontSize:16, fontWeight:"bold", textShadow:"0 0 4px #ff0000" }}>!</div>}
      </div>
    );
  }

  if (isPlayer) {
    const sprite = hasStarter ? "🧑" : "👤";
    node = (
      <div style={{ position:"absolute", inset:0, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"flex-end", paddingBottom:1, zIndex:10 }}>
         <div style={{ width: TILE_SIZE*0.6, height:5, background:"rgba(0,0,0,0.35)", borderRadius:"50%", position:"absolute", bottom:2, filter:"blur(2px)" }} />
         <span style={{
           fontSize: TILE_SIZE * 0.7, lineHeight:1,
           filter:"drop-shadow(0 0 6px rgba(0,220,255,0.8)) drop-shadow(0 -2px 2px rgba(0,0,0,0.5))",
           transform: scaleTr, zIndex:2,
           animation: animWalk % 2 === 0 ? "walkbob 0.5s ease-in-out infinite" : "none"
         }}>
           {sprite}
         </span>
         <div style={{ position:"absolute", bottom:-2, color:"rgba(0,220,255,0.7)", fontSize:10, lineHeight:1 }}>
           {{ "down":"▼", "up":"▲", "left":"◄", "right":"►" }[playerDir as string]}
         </div>
      </div>
    );
  }

  const baseStyle: React.CSSProperties = {
    position:"absolute",
    left: vx * TILE_SIZE, top: vy * TILE_SIZE,
    width: TILE_SIZE, height: TILE_SIZE,
    background: bg,
    ...extraStyle,
    display:"flex", alignItems:"center", justifyContent:"center",
    fontSize: TILE_SIZE * 0.45,
    overflow:"hidden", transition:"background 0.3s",
    transformStyle: "preserve-3d"
  };

  return (
    <div key={`${vx}-${vy}`} style={baseStyle}>
      {labelStr && !npc && !isPlayer && (
        <span style={{ fontSize: TILE_SIZE * 0.55, filter: "drop-shadow(0 2px 2px rgba(0,0,0,0.5))", lineHeight:1, transform: scaleTr }}>
          {labelStr}
        </span>
      )}
      {overlay}
      {node}
      {tile === TILE.TALL_GRASS && isPlayer && (
         <div style={{ position:"absolute", bottom:0, left:0, right:0, height: TILE_SIZE * 0.4, background:"#2a6a15", backgroundImage:"repeating-linear-gradient(90deg,#2a6a15,#3d8a22 3px,#2a6a15 6px)", zIndex:11, pointerEvents:"none" }} />
      )}
    </div>
  );
}
