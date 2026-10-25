#!/usr/bin/env python3
"""Extract pret/pokeyellow data shapes into neutral JSON (local only).
Gen 1 notes (scoped baseline, not a Gen 3-style full set):
- Species: data/pokemon/base_stats/*.asm, 151 files. Stats are 5 numbers
  (hp atk def spd spc) — a SINGLE Special stat, not SpAttack/SpDefense.
  Recorded as baseSpecial, with baseSpAttack/baseSpDefense NOT invented.
  No abilities, no egg groups in Gen 1 base stats. Level-1 learnset and
  tmhm line are in the same file.
- Moves: data/moves/moves.asm 6-field macro (no effect-chance field).
  Derived category by Gen 1/2 type rule, labelled derived only.
- Evos/learnsets: data/pokemon/evos_moves.asm. EVOLVE_ITEM has an extra
  min-level field, EVOLVE_TRADE has a min-level field — preserved.
- No egg moves in Gen 1 (no breeding) — recorded as none.
- Trainers: data/trainers/parties.asm is class-grouped; each db row is a
  party (level, species... , 0). Summary + species validation only.
- Wild: summary only from data/wild/*.asm.
No pret code/text/music/sprites vendored, no ROM built here.
"""
import json, re
from pathlib import Path
Y = Path.home()/"workspace/mochiichao-work/decomps/pokeyellow"
OUT = Path.home()/"workspace/mochiichao-work/extractions/yellow"; OUT.mkdir(parents=True, exist_ok=True)
SPECIAL = {"FIRE","WATER","GRASS","ELECTRIC","PSYCHIC","ICE","DRAGON"}
def dump(n,p): (OUT/n).write_text(json.dumps(p,indent=2)+"\n")
base_dir = Y/"data/pokemon/base_stats"
files = sorted(f.stem for f in base_dir.iterdir())
species=[]
for fn in files:
    txt = (base_dir/f"{fn}.asm").read_text(errors="replace")
    stats = re.search(r"db\s+(\d+),\s*(\d+),\s*(\d+),\s*(\d+),\s*(\d+)\n\t;   hp", txt)
    typ = re.search(r"db ([A-Z_]+),\s*([A-Z_]+) ; type", txt)
    catch = re.search(r"db (\d+) ; catch rate", txt)
    exp = re.search(r"db (\d+) ; base exp", txt)
    lvl1 = re.search(r"db ([A-Z0-9_, ]+) ; level 1 learnset", txt)
    growth = re.search(r"db (GROWTH_[A-Z_]+) ; growth rate", txt)
    tmhm_m = re.search(r"tmhm ([^\n]+(?:\\\n[^\n]+)*)", txt)
    tmhm = []
    if tmhm_m:
        tmhm = [x.strip() for x in tmhm_m.group(1).replace("\\"," ").split(",") if x.strip()]
    CANON={"nidoranf":"NIDORAN_F","nidoranm":"NIDORAN_M","mrmime":"MR_MIME","farfetchd":"FARFETCH_D"}
    const = CANON.get(fn, fn.upper())
    e={"sourceConstant":f"SPECIES_{const}"}
    if stats:
        for k,v in zip(["baseHP","baseAttack","baseDefense","baseSpeed","baseSpecial"], stats.groups()): e[k]=int(v)
    if typ: e["types"]=[typ.group(1).replace("_TYPE",""), typ.group(2).replace("_TYPE","")]  # Gen1 spells Psychic as PSYCHIC_TYPE
    if catch: e["catchRate"]=int(catch.group(1))
    if exp: e["expYield"]=int(exp.group(1))
    if lvl1: e["level1Learnset"]=[x.strip() for x in lvl1.group(1).split(",") if x.strip() and x.strip()!="NO_MOVE"]
    if growth: e["growthRate"]=growth.group(1)
    if tmhm: e["tmhmMoves"]=tmhm
    species.append(e)
sp_set={e["sourceConstant"] for e in species}
gen1_names={e["sourceConstant"][8:] for e in species}
dump("decomp_yellow_species.json",{"source":"pokeyellow/data/pokemon/base_stats/*.asm","sourceRepo":"pret/pokeyellow","count":len(species),"notes":"Gen 1: single baseSpecial stat, not SpAttack/SpDefense split. No abilities/egg groups in Gen 1 base stats.","species":species})
print("species:",len(species))
bulba=next(e for e in species if e["sourceConstant"]=="SPECIES_BULBASAUR"); print("BULBASAUR:",bulba); assert bulba["baseHP"]==45 and bulba["baseSpecial"]==65
# moves
text=(Y/"data/moves/moves.asm").read_text(errors="replace")
moves=[]
for m in re.finditer(r"^\tmove ([A-Z0-9_]+),\s*([A-Z0-9_]+),\s*(\d+),\s*([A-Z]+)(?:_TYPE)?,\s*(\d+),\s*(\d+)", text, re.M):
    name,eff,power,typ,acc,pp=m.groups()
    e={"sourceConstant":f"MOVE_{name}","effect":eff,"power":int(power),"type":typ,"accuracy":int(acc),"pp":int(pp)}
    e["derivedCategory"]="Status" if e["power"]==0 else ("Special" if typ in SPECIAL else "Physical")
    moves.append(e)
mv_names={m["sourceConstant"][5:] for m in moves}
dump("decomp_yellow_moves.json",{"source":"pokeyellow/data/moves/moves.asm","sourceRepo":"pret/pokeyellow","count":len(moves),"categoryDerivation":"Gen 1 has no category field. power 0 = Status; FIRE/WATER/GRASS/ELECTRIC/PSYCHIC/ICE/DRAGON = Special; otherwise Physical. Recorded as derivedCategory only. No effect-chance field in Gen 1 move table.","moves":moves})
print("moves:",len(moves)); pound=next(m for m in moves if m["sourceConstant"]=="MOVE_POUND"); print("POUND:",pound); assert pound["power"]==40
# evos + learnsets
text=(Y/"data/pokemon/evos_moves.asm").read_text(errors="replace")
sections=re.findall(r"^([A-Za-z0-9_]+)EvosMoves:\n(.*?)(?=^[A-Za-z0-9_]+EvosMoves:|\Z)", text, re.M|re.S)
file_by_lower={f.lower():f for f in files}
aliases={}  # Yellow section names already match file stems
evos={}; learnsets={}; un_ev=set(); un_mv=set(); total_ev=0; total_lu=0; unmatched=[]
for sec, block in sections:
    low=aliases.get(sec.lower(), sec.lower())
    if low not in file_by_lower: unmatched.append(sec); continue
    CANON2={"nidoranf":"NIDORAN_F","nidoranm":"NIDORAN_M","mrmime":"MR_MIME","farfetchd":"FARFETCH_D"}
    const=f"SPECIES_{CANON2.get(low, low.upper())}"
    evo_part, _, rest = block.partition("; Learnset")
    entries=[]
    for method, param, target in re.findall(r"db EVOLVE_([A-Z_]+),\s*([^,]+),\s*(?:1,\s*)?([A-Z0-9_]+)", evo_part):
        total_ev+=1
        if target not in gen1_names: un_ev.add(target)
        entries.append({"method":method,"param":param.strip(),"target":f"SPECIES_{target}"})
    if entries: evos[const]=entries
    lentries=[]
    for lvl, mv in re.findall(r"db (\d+),\s*([A-Z0-9_]+)", rest):
        total_lu+=1
        if mv not in mv_names: un_mv.add(mv)
        lentries.append({"level":int(lvl),"move":f"MOVE_{mv}"})
    learnsets[const]=lentries
dump("decomp_yellow_evolutions.json",{"source":"pokeyellow/data/pokemon/evos_moves.asm","sourceRepo":"pret/pokeyellow","speciesWithEvolutions":len(evos),"totalEvolutions":total_ev,"unresolvedTargets":sorted(un_ev),"note":"EVOLVE_ITEM/TRADE extra min-level field preserved in param where present. Sections without a base-stats file (e.g. MissingNo) are listed as unmatched, not extracted.","evolutions":evos})
dump("decomp_yellow_learnsets.json",{"source":"pokeyellow/data/pokemon/evos_moves.asm","sourceRepo":"pret/pokeyellow","speciesWithLearnsets":len(learnsets),"totalLevelUpMoves":total_lu,"unresolvedMoves":sorted(un_mv),"unmatchedSections":unmatched,"learnsets":learnsets})
print("evo sections:",len(sections),"unmatched:",unmatched); print("evolutions:",len(evos),total_ev,"unresolved:",sorted(un_ev)); print("level-up:",len(learnsets),total_lu,"unresolved:",sorted(un_mv)); print("BULBASAUR evo:",evos.get("SPECIES_BULBASAUR"))
assert evos["SPECIES_BULBASAUR"]==[{"method":"LEVEL","param":"16","target":"SPECIES_IVYSAUR"}]
# tmhm summary from species
tmhm={}; total_tm=0
for e in species:
    if e.get("tmhmMoves"): total_tm+=len(e["tmhmMoves"]); tmhm[e["sourceConstant"]]=[{"move":f"MOVE_{m}"} for m in e["tmhmMoves"]]
dump("decomp_yellow_tmhm_learnsets.json",{"source":"pokeyellow/data/pokemon/base_stats/*.asm tmhm lines","sourceRepo":"pret/pokeyellow","speciesWithTMHM":len(tmhm),"totalTMHMEntries":total_tm,"learnsets":tmhm})
print("tmhm:",len(tmhm),total_tm)
dump("decomp_yellow_egg_learnsets.json",{"source":"pokeyellow (no breeding in Gen 1)","sourceRepo":"pret/pokeyellow","note":"No egg moves in Gen 1. Recorded as none, not a failed extraction.","speciesWithEggMoves":0,"totalEggMoves":0,"learnsets":{}})
print("egg: none (Gen 1, no breeding)")
# trainers summary
text=(Y/"data/trainers/parties.asm").read_text(errors="replace")
groups=re.findall(r"^([A-Za-z0-9_]+)Data:\n(.*?)(?=^[A-Za-z0-9_]+Data:|\Z)", text, re.M|re.S)
rows=0; party_species=set(); un_tr=set()
for gname, body in groups:
    for row in re.findall(r"db\s+(\d+),\s*([A-Z0-9_, ]+?),\s*0", body):
        rows+=1
        NORM={"FARFETCHD":"FARFETCH_D","MRMIME":"MR_MIME","NIDORANF":"NIDORAN_F","NIDORANM":"NIDORAN_M"}
        for sp in row[1].split(","):
            sp=NORM.get(sp.strip(), sp.strip())
            if sp: party_species.add(sp)
            if sp and sp not in gen1_names: un_tr.add(sp)
dump("decomp_yellow_trainers.json",{"source":"pokeyellow/data/trainers/parties.asm","sourceRepo":"pret/pokeyellow","note":"Summary only: Gen 1 trainers are class-grouped; each db row is a party (level, species..., 0). Individual trainer names are not in this table.","trainerClassGroups":len(groups),"partyRows":rows,"distinctPartySpecies":len(party_species),"unresolvedPartySpecies":sorted(un_tr),"partySpecies":sorted(party_species)})
print("trainers: class groups",len(groups),"party rows",rows,"distinct species",len(party_species),"unresolved",sorted(un_tr))
# wild summary (generic)
wild_species=set(); wild_entries=0
for fp in (Y/"data/wild").rglob("*.asm"):
    txt=fp.read_text(errors="replace")
    NORM={"FARFETCHD":"FARFETCH_D","MRMIME":"MR_MIME","NIDORANF":"NIDORAN_F","NIDORANM":"NIDORAN_M"}
    for lvl, sp in re.findall(r"db\s+(\d+),\s*([A-Z0-9_]+)", txt):
        sp=NORM.get(sp, sp)
        if sp in gen1_names: wild_species.add(sp); wild_entries+=1
dump("decomp_yellow_encounters.json",{"source":"pokeyellow/data/wild/*.asm","sourceRepo":"pret/pokeyellow","note":"Summary + species validation only; Gen 1 wild files use several layouts, so entries are a lower-bound count, not a map-by-map table.","encounterSpeciesEntries":wild_entries,"distinctEncounterSpecies":len(wild_species),"encounterSpecies":sorted(wild_species)})
print("wild: entries (lower bound)",wild_entries,"distinct",len(wild_species))
print("DONE")
