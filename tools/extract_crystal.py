#!/usr/bin/env python3
"""Extract pret/pokecrystal data shapes into neutral JSON (local only).
Source clone: ~/workspace/mochiichao-work/decomps/pokecrystal (Gen 2 assembly).
Output: ~/workspace/mochiichao-work/extractions/crystal/*.json (not in repo yet).
Gen 2 notes:
- Species: data/pokemon/base_stats/<name>.asm, 251 files. Order from
  constants/pokemon_constants.asm (278 consts = 251 species + EGG + 26
  Unown letter forms, which share Unown's base stats and have no own file).
  Crystal base stats have NO abilities field (abilities are Gen 3+).
  The tmhm line in each file is the TM/HM/tutor combined list for Gen 2.
- Moves: data/moves/moves.asm macro lines: move NAME, EFFECT, power, TYPE,
  accuracy, pp, chance. No target/priority field in this table.
  Gen 2 move names are recorded as-is (e.g. DOUBLESLAP, POISONPOWDER,
  SOLARBEAM) — they differ from Gen 3 names; a name map is NOT invented.
  Derived category uses the Gen 2/3 type rule, labelled derived only.
- Evolutions + level-up: data/pokemon/evos_attacks.asm sections
  <Name>EvosAttacks: db EVOLVE_*, db 0, then db level, MOVE, db 0.
- Egg moves: data/pokemon/egg_moves.asm <Name>EggMoves: db MOVE, db -1.
- Trainers: data/trainers/parties.asm groups; each db "NAME@", TYPE line
  starts a trainer, party rows follow until db -1.
- Wild: data/wild/*.asm def_*_wildmons blocks; summary + validation only.
No pret code/text/music/sprites vendored, no ROM built here.
"""
import json, re
from pathlib import Path
CR = Path.home()/"workspace/mochiichao-work/decomps/pokecrystal"
OUT = Path.home()/"workspace/mochiichao-work/extractions/crystal"; OUT.mkdir(parents=True, exist_ok=True)
SPECIAL = {"FIRE","WATER","GRASS","ELECTRIC","PSYCHIC","ICE","DRAGON","DARK"}
def dump(n,p): (OUT/n).write_text(json.dumps(p,indent=2)+"\n")
def title(name):
    # BULBASAUR -> Bulbasaur, MR__MIME -> Mr__Mime (handled by file map below)
    return name.title().replace("_","")
# species constants in order
consts=[]
for line in (CR/"constants/pokemon_constants.asm").read_text(errors="replace").splitlines():
    m=re.match(r"\tconst ([A-Z0-9_]+)", line)
    if m: consts.append(m.group(1))
base_dir = CR/"data/pokemon/base_stats"
files = {f.stem for f in base_dir.iterdir()}
species=[]
for c in consts:
    fn = c.lower()
    if fn not in files: continue
    txt = (base_dir/f"{fn}.asm").read_text(errors="replace")
    stats = re.search(r"db\s+(\d+),\s*(\d+),\s*(\d+),\s*(\d+),\s*(\d+),\s*(\d+)", txt)
    typ = re.search(r"db ([A-Z_]+),\s*([A-Z_]+) ; type", txt)
    catch = re.search(r"db (\d+) ; catch rate", txt)
    exp = re.search(r"db (\d+) ; base exp", txt)
    growth = re.search(r"db (GROWTH_[A-Z_]+) ; growth rate", txt)
    eggs = re.search(r"dn (EGG_[A-Z_]+),\s*(EGG_[A-Z_]+) ; egg groups", txt)
    tmhm = re.search(r"tmhm ([^\n]+)", txt)
    e={"sourceConstant":f"SPECIES_{c}"}
    if stats:
        keys=["baseHP","baseAttack","baseDefense","baseSpeed","baseSpAttack","baseSpDefense"]
        for k,v in zip(keys, stats.groups()): e[k]=int(v)
    if typ: e["types"]=[typ.group(1), typ.group(2)]
    if catch: e["catchRate"]=int(catch.group(1))
    if exp: e["expYield"]=int(exp.group(1))
    if growth: e["growthRate"]=growth.group(1)
    if eggs: e["eggGroups"]=[eggs.group(1).replace("EGG_",""), eggs.group(2).replace("EGG_","")]
    if tmhm: e["tmhmMoves"]=[x.strip() for x in tmhm.group(1).split(",")]
    species.append(e)
sp_set={e["sourceConstant"] for e in species}
# Gen2 name set for wild/trainer validation (without SPECIES_ prefix)
gen2_names={c for c in consts}
dump("decomp_crystal_species.json",{"source":"pokecrystal/data/pokemon/base_stats/*.asm + constants/pokemon_constants.asm","sourceRepo":"pret/pokecrystal","count":len(species),"notes":"Neutral intermediate JSON. Gen 2 has no abilities field. tmhmMoves in each file is the Gen 2 TM/HM/tutor combined list, kept as a species field and also summarised in the tmhm file.","species":species})
print("species:",len(species))
bulba=next(e for e in species if e["sourceConstant"]=="SPECIES_BULBASAUR"); print("BULBASAUR:",bulba)
assert bulba["baseHP"]==45 and bulba["baseAttack"]==49 and bulba["baseSpAttack"]==65
# moves
text=(CR/"data/moves/moves.asm").read_text(errors="replace")
moves=[]
for m in re.finditer(r"^\tmove ([A-Z0-9_]+),\s*([A-Z0-9_]+),\s*(\d+),\s*([A-Z]+)(?:_TYPE)?,\s*(\d+),\s*(\d+),\s*(\d+)", text, re.M):
    name,eff,power,typ,acc,pp,chance=m.groups()
    e={"sourceConstant":f"MOVE_{name}","effect":eff,"power":int(power),"type":typ,"accuracy":int(acc),"pp":int(pp),"secondaryEffectChance":int(chance)}
    e["derivedCategory"]="Status" if e["power"]==0 else ("Special" if typ in SPECIAL else "Physical")
    moves.append(e)
mv_set={m["sourceConstant"] for m in moves}
mv_names={m["sourceConstant"][5:] for m in moves}  # Gen2 names as-is
dump("decomp_crystal_moves.json",{"source":"pokecrystal/data/moves/moves.asm","sourceRepo":"pret/pokecrystal","count":len(moves),"categoryDerivation":"Gen 2 has no category field in this table. power 0 = Status; FIRE/WATER/GRASS/ELECTRIC/PSYCHIC/ICE/DRAGON/DARK = Special; otherwise Physical. Recorded as derivedCategory only. Move names recorded as-is (Gen 2 spellings differ from Gen 3, e.g. DOUBLESLAP, POISONPOWDER).","moves":moves})
print("moves:",len(moves)); pound=next(m for m in moves if m["sourceConstant"]=="MOVE_POUND"); print("POUND:",pound); assert pound["power"]==40
# evos + learnsets
text=(CR/"data/pokemon/evos_attacks.asm").read_text(errors="replace")
sections=re.findall(r"^([A-Za-z0-9_]+)EvosAttacks:\n(.*?)(?=^[A-Za-z0-9_]+EvosAttacks:|\Z)", text, re.M|re.S)
# map section name -> species constant: section names are CamelCase; match by uppercasing with underscores is ambiguous, so use constants list order via names.asm? Instead: build map from file stems: section name lower vs base file stem
file_by_lower={f.lower():f for f in files}
evos={}; learnsets={}; un_ev=set(); un_mv=set(); total_ev=0; total_lu=0
for sec, block in sections:
    low=sec.lower()
    aliases={"nidoranf":"nidoran_f","nidoranm":"nidoran_m","farfetchd":"farfetch_d","mrmime":"mr__mime","hooh":"ho_oh"}
    low=aliases.get(low, low)
    if low not in file_by_lower:
        continue
    const=f"SPECIES_{file_by_lower[low].upper()}"
    # evolution part: up to first 'db 0 ; no more evolutions'
    evo_part, _, rest = block.partition("db 0 ; no more evolutions")
    entries=[]
    for lvl, cond, target in re.findall(r"db EVOLVE_STAT,\s*(\d+),\s*(ATK_[A-Z_]+),\s*([A-Z0-9_]+)", evo_part):
        total_ev+=1
        if target not in gen2_names: un_ev.add(target)
        entries.append({"method":"STAT","param":f"{lvl}:{cond}","target":f"SPECIES_{target}"})
    evo_part_nostat = re.sub(r"db EVOLVE_STAT,[^\n]+", "", evo_part)
    for method, param, target in re.findall(r"db EVOLVE_([A-Z_]+),\s*([^,]+),\s*([A-Z0-9_]+)", evo_part_nostat):
        total_ev+=1
        if target not in gen2_names and target!="UNOWN": un_ev.add(target)
        entries.append({"method":method,"param":param.strip(),"target":f"SPECIES_{target}"})
    if entries: evos[const]=entries
    # learnset part: db level, MOVE lines after the evo terminator, until db 0 ; no more level-up moves
    lu_part = rest.split("db 0 ; no more level-up moves")[0]
    lentries=[]
    for lvl, mv in re.findall(r"db (\d+),\s*([A-Z0-9_]+)", lu_part):
        total_lu+=1
        if mv not in mv_names: un_mv.add(mv)
        lentries.append({"level":int(lvl),"move":f"MOVE_{mv}"})
    learnsets[const]=lentries
print("evo sections parsed:",len(sections),"species with evos:",len(evos),"learnsets:",len(learnsets))
aliases2={"nidoranf":"nidoran_f","nidoranm":"nidoran_m","farfetchd":"farfetch_d","mrmime":"mr__mime","hooh":"ho_oh"}
print("section names not matched to base file:", [s for s,_ in sections if aliases2.get(s.lower(), s.lower()) not in file_by_lower][:20])
dump("decomp_crystal_evolutions.json",{"source":"pokecrystal/data/pokemon/evos_attacks.asm","sourceRepo":"pret/pokecrystal","speciesWithEvolutions":len(evos),"totalEvolutions":total_ev,"unresolvedTargets":sorted(un_ev),"note":"Methods preserved exactly (EVOLVE_LEVEL/ITEM/TRADE/HAPPINESS/STAT).","evolutions":evos})
dump("decomp_crystal_learnsets.json",{"source":"pokecrystal/data/pokemon/evos_attacks.asm","sourceRepo":"pret/pokecrystal","speciesWithLearnsets":len(learnsets),"totalLevelUpMoves":total_lu,"unresolvedMoves":sorted(un_mv),"note":"Gen 2 move names as-is.","learnsets":learnsets})
print("evolutions:",len(evos),total_ev,"unresolved:",sorted(un_ev)); print("level-up:",len(learnsets),total_lu,"unresolved moves:",sorted(un_mv)); print("BULBASAUR evo:",evos.get("SPECIES_BULBASAUR"),"learnset:",learnsets.get("SPECIES_BULBASAUR"))
assert evos["SPECIES_BULBASAUR"]==[{"method":"LEVEL","param":"16","target":"SPECIES_IVYSAUR"}]
# tmhm (from species files, summarised)
tmhm={}; total_tm=0
for e in species:
    if e.get("tmhmMoves"):
        total_tm+=len(e["tmhmMoves"]); tmhm[e["sourceConstant"]]=[{"move":f"MOVE_{m}"} for m in e["tmhmMoves"]]
dump("decomp_crystal_tmhm_learnsets.json",{"source":"pokecrystal/data/pokemon/base_stats/*.asm tmhm lines","sourceRepo":"pret/pokecrystal","formatNote":"Gen 2 tmhm line is the TM/HM/tutor combined list per species. Move names as-is.","speciesWithTMHM":len(tmhm),"totalTMHMEntries":total_tm,"learnsets":tmhm})
print("tmhm:",len(tmhm),total_tm)
# egg moves
text=(CR/"data/pokemon/egg_moves.asm").read_text(errors="replace")
egg={}; total_eg=0; un_eg=set()
for sec, block in re.findall(r"^([A-Za-z0-9_]+)EggMoves:\n(.*?)\n\tdb -1", text, re.M|re.S):
    low=sec.lower()
    aliases={"nidoranf":"nidoran_f","nidoranm":"nidoran_m","farfetchd":"farfetch_d","mrmime":"mr__mime","hooh":"ho_oh"}
    low=aliases.get(low, low)
    if low not in file_by_lower: continue
    const=f"SPECIES_{file_by_lower[low].upper()}"; entries=[]
    for mv in re.findall(r"db ([A-Z0-9_]+)", block):
        total_eg+=1
        if mv not in mv_names: un_eg.add(mv)
        entries.append({"move":f"MOVE_{mv}"})
    egg[const]=entries
dump("decomp_crystal_egg_learnsets.json",{"source":"pokecrystal/data/pokemon/egg_moves.asm","sourceRepo":"pret/pokecrystal","speciesWithEggMoves":len(egg),"totalEggMoves":total_eg,"unresolvedMoves":sorted(un_eg),"learnsets":egg})
print("egg:",len(egg),total_eg,"unresolved:",sorted(un_eg))
# trainers
text=(CR/"data/trainers/parties.asm").read_text(errors="replace")
trainers=[]; un_tr=set(); total_party=0
# split on db "NAME@", TYPE lines
parts=re.split(r'\n\tdb "([^"]+)@",\s*(TRAINERTYPE_[A-Z_]+)', text)
# parts[0] header, then triples name,type,body
for i in range(1, len(parts), 3):
    name, ttype, body = parts[i], parts[i+1], parts[i+2]
    if "db -1" in body: body=body.split("db -1")[0]
    party=[]
    for row in re.findall(r"db\s+(\d+),\s*([A-Z0-9_]+)(?:,\s*([^\n]+))?", body):
        lvl, sp, rest = row; total_party+=1
        if sp not in gen2_names: un_tr.add(sp)
        mvs=[]
        if rest:
            for tok in rest.split(","):
                tok=tok.strip()
                if tok and tok!="NO_MOVE" and tok in mv_names: mvs.append(f"MOVE_{tok}")
                elif tok and tok not in ("NO_MOVE",) and tok.startswith(("NO_ITEM","ITEM_")): pass
        party.append({"level":int(lvl),"species":f"SPECIES_{sp}","moves":mvs,"rawTail":rest.strip() if rest else None})
    trainers.append({"trainerName":name,"trainerType":ttype,"party":party})
dump("decomp_crystal_trainers.json",{"source":"pokecrystal/data/trainers/parties.asm","sourceRepo":"pret/pokecrystal","trainerCount":len(trainers),"totalPartyMembers":total_party,"unresolvedPartySpecies":sorted(un_tr),"note":"Trainer groups in parties.asm are class groups; each NAME@ entry is treated as one trainer. Moves recorded where present; item/tail kept in rawTail for audit.","trainers":trainers})
print("trainers:",len(trainers),total_party,"unresolved species:",sorted(un_tr))
# wild summary
wild_species=set(); wild_entries=0; wild_blocks=0
for fp in (CR/"data/wild").glob("*.asm"):
    txt=fp.read_text(errors="replace")
    for block in re.findall(r"def_\w+_wildmons\s+([A-Z0-9_]+)(.*?)(?=def_\w+_wildmons|end_\w+_wildmons|\Z)", txt, re.S):
        wild_blocks+=1
        for lvl, sp in re.findall(r"db\s+(\d+),\s*([A-Z0-9_]+)", block[1]):
            if sp in gen2_names:
                wild_species.add(sp); wild_entries+=1
un_wild=sorted({s for s in wild_species if s not in gen2_names})
dump("decomp_crystal_encounters.json",{"source":"pokecrystal/data/wild/*.asm","sourceRepo":"pret/pokecrystal","note":"Summary + species validation only; full wild files remain in the decomp clone. Grass/water/fish/treemon blocks counted together.","wildBlocks":wild_blocks,"encounterSpeciesEntries":wild_entries,"distinctEncounterSpecies":len(wild_species),"unresolvedEncounterSpecies":un_wild,"encounterSpecies":sorted(wild_species)})
print("wild: blocks",wild_blocks,"entries",wild_entries,"distinct",len(wild_species),"unresolved",un_wild)
print("DONE")
