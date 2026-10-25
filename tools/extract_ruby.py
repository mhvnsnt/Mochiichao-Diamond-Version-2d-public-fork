#!/usr/bin/env python3
"""Extract pret/pokeruby data shapes into neutral JSON (local only).
Source clone: ~/workspace/mochiichao-work/decomps/pokeruby.
Output: ~/workspace/mochiichao-work/extractions/ruby/*.json (not in repo yet).
Ruby differences vs Emerald: species in base_stats.h with type1/type2,
ability1/2, eggGroup1/2; moves in battle_moves.c with TARGET_ and F_ flags;
TM/HM as TMHM(TMxx_NAME) bit list; learnsets named gXLevelUpLearnset;
parties named gTrainerParty_X with .level; trainers in trainers_en.h;
NO per-species tutor table exists in Ruby (recorded as none, not a failure).
No pret code/text/music/sprites vendored, no ROM built here.
"""
import json, re
from pathlib import Path
RB = Path.home()/"workspace/mochiichao-work/decomps/pokeruby"
FR = Path.home()/"workspace/mochiichao-work/fresh-start/src/lib/generated"
OUT = Path.home()/"workspace/mochiichao-work/extractions/ruby"; OUT.mkdir(parents=True, exist_ok=True)
SPECIAL = {"FIRE","WATER","GRASS","ELECTRIC","PSYCHIC","ICE","DRAGON","DARK"}
def dump(n,p): (OUT/n).write_text(json.dumps(p,indent=2)+"\n")
def camel(name):
    s=re.sub(r"(?<=[a-z])(?=[A-Z])","_",name); s=re.sub(r"(?<=[A-Z])(?=[A-Z][a-z])","_",s); return s.upper()
# species
text=(RB/"src/data/pokemon/base_stats.h").read_text(errors="replace")
starts=list(re.finditer(r"\[SPECIES_([A-Z0-9_]+)\]\s*=\s*\{",text)); species=[]
for i,m in enumerate(starts):
    if m.group(1)=="NONE": continue
    end=starts[i+1].start() if i+1<len(starts) else len(text); block=text[m.end():end]
    e={"sourceConstant":f"SPECIES_{m.group(1)}"}
    for f in ["baseHP","baseAttack","baseDefense","baseSpeed","baseSpAttack","baseSpDefense","catchRate","expYield"]:
        mm=re.search(rf"\.{f}\s*=\s*(\d+)",block)
        if mm: e[f]=int(mm.group(1))
    t1=re.search(r"\.type1\s*=\s*TYPE_([A-Z]+)",block); t2=re.search(r"\.type2\s*=\s*TYPE_([A-Z]+)",block)
    e["types"]=[t for t in [t1.group(1) if t1 else None, t2.group(1) if t2 else None] if t]
    a1=re.search(r"\.ability1\s*=\s*ABILITY_([A-Z0-9_]+)",block); a2=re.search(r"\.ability2\s*=\s*ABILITY_([A-Z0-9_]+)",block)
    e["abilities"]=[a for a in [a1.group(1) if a1 else None, a2.group(1) if a2 else None] if a]
    g1=re.search(r"\.eggGroup1\s*=\s*EGG_GROUP_([A-Z0-9_]+)",block); g2=re.search(r"\.eggGroup2\s*=\s*EGG_GROUP_([A-Z0-9_]+)",block)
    e["eggGroups"]=[g for g in [g1.group(1) if g1 else None, g2.group(1) if g2 else None] if g]
    gr=re.search(r"\.growthRate\s*=\s*([A-Z0-9_]+)",block)
    if gr: e["growthRate"]=gr.group(1)
    species.append(e)
sp_set={e["sourceConstant"] for e in species}
dump("decomp_ruby_species.json",{"source":"pokeruby/src/data/pokemon/base_stats.h","sourceRepo":"pret/pokeruby","count":len(species),"notes":"Neutral intermediate JSON. Ruby uses type1/type2, ability1/2, eggGroup1/2.","species":species})
print("species:",len(species)); bulba=next(e for e in species if e["sourceConstant"]=="SPECIES_BULBASAUR"); print("BULBASAUR:",bulba); assert bulba["baseHP"]==45
# moves
text=(RB/"src/data/battle_moves.c").read_text(errors="replace")
starts=list(re.finditer(r"\[MOVE_([A-Z0-9_]+)\]\s*=\s*\{",text)); moves=[]
for i,m in enumerate(starts):
    if m.group(1)=="NONE": continue
    end=starts[i+1].start() if i+1<len(starts) else len(text); block=text[m.end():end]
    e={"sourceConstant":f"MOVE_{m.group(1)}"}
    for f in ["power","accuracy","pp","secondaryEffectChance","priority"]:
        mm=re.search(rf"\.{f}\s*=\s*(-?\d+)",block)
        if mm: e[f]=int(mm.group(1))
    mm=re.search(r"\.effect\s*=\s*EFFECT_([A-Z0-9_]+)",block)
    if mm: e["effect"]=mm.group(1)
    mm=re.search(r"\.type\s*=\s*TYPE_([A-Z]+)",block)
    if mm: e["type"]=mm.group(1)
    mm=re.search(r"\.target\s*=\s*TARGET_([A-Z0-9_]+)",block)
    if mm: e["target"]=mm.group(1)
    mm=re.search(r"\.flags\s*=\s*([^,\n]+)",block)
    if mm:
        fl=mm.group(1).strip(); e["flags"]=[] if fl=="0" else [x.strip().replace("F_","") for x in fl.split("|")]
    e["derivedCategory"]="Status" if e.get("power",0)==0 else ("Special" if e.get("type") in SPECIAL else "Physical")
    moves.append(e)
mv_set={m["sourceConstant"] for m in moves}
dump("decomp_ruby_moves.json",{"source":"pokeruby/src/data/battle_moves.c","sourceRepo":"pret/pokeruby","count":len(moves),"categoryDerivation":"Gen 3 has no category field. power 0 = Status; FIRE/WATER/GRASS/ELECTRIC/PSYCHIC/ICE/DRAGON/DARK = Special; otherwise Physical. Recorded as derivedCategory only.","moves":moves})
print("moves:",len(moves)); pound=next(m for m in moves if m["sourceConstant"]=="MOVE_POUND"); print("POUND:",pound); assert pound["power"]==40
# level-up
text=(RB/"src/data/pokemon/level_up_learnsets.h").read_text(errors="replace")
learnsets,un_sp,un_mv,total={},set(),set(),0
for name,block in re.findall(r"const u16 g(\w+)LevelUpLearnset\[\] = \{(.*?)\n\};",text,re.S):
    const=f"SPECIES_{camel(name)}"
    if const=="SPECIES_MRMIME": const="SPECIES_MR_MIME"  # Ruby spells it gMrmime; species constant is MR_MIME
    entries=[]
    for lvl,mv in re.findall(r"LEVEL_UP_MOVE\(\s*(\d+),\s*(MOVE_[A-Z0-9_]+)\)",block):
        total+=1
        if mv not in mv_set: un_mv.add(mv)
        entries.append({"level":int(lvl),"move":mv})
    if const not in sp_set: un_sp.add(const)
    learnsets[const]=entries
dump("decomp_ruby_learnsets.json",{"source":"pokeruby/src/data/pokemon/level_up_learnsets.h","sourceRepo":"pret/pokeruby","speciesWithLearnsets":len(learnsets),"totalLevelUpMoves":total,"unresolvedSpecies":sorted(un_sp),"unresolvedMoves":sorted(un_mv),"learnsets":learnsets})
print("level-up:",len(learnsets),total,"unresolved species:",sorted(un_sp),"moves:",sorted(un_mv)); print("BULBASAUR:",learnsets.get("SPECIES_BULBASAUR"))
# TMHM
text=(RB/"src/data/pokemon/tmhm_learnsets.h").read_text(errors="replace")
tmhm,un_tm,total_tm={},set(),0
for name,block in re.findall(r"\[SPECIES_([A-Z0-9_]+)\]\s*=\s*TMHM_LEARNSET\((.*?)\)\s*,",text,re.S):
    const=f"SPECIES_{name}"; entries=[]
    for mach in re.findall(r"TMHM\((TM\d+_[A-Z0-9_]+|HM\d+_[A-Z0-9_]+)\)",block):
        total_tm+=1; mv=f"MOVE_{re.sub(r'^(TM\d+|HM\d+)_','',mach)}"
        if mv=="MOVE_SOLARBEAM": mv="MOVE_SOLAR_BEAM"  # Ruby TM22 name vs move constant
        if mv not in mv_set: un_tm.add(mv)
        entries.append({"machine":mach,"move":mv})
    if entries: tmhm[const]=entries
dump("decomp_ruby_tmhm_learnsets.json",{"source":"pokeruby/src/data/pokemon/tmhm_learnsets.h","sourceRepo":"pret/pokeruby","speciesWithTMHM":len(tmhm),"totalTMHMEntries":total_tm,"unresolvedMoves":sorted(un_tm),"learnsets":tmhm})
print("TM/HM:",len(tmhm),total_tm,"unresolved:",sorted(un_tm))
# tutor: none in Ruby
dump("decomp_ruby_tutor_learnsets.json",{"source":"pokeruby (no per-species tutor table found)","sourceRepo":"pret/pokeruby","note":"No per-species tutor learnset table exists in pokeruby as searched (tutor mentions are UI/menu only). Recorded as none, not as a failed extraction.","speciesWithTutor":0,"totalTutorEntries":0,"unresolvedMoves":[],"learnsets":{}})
print("tutor: none (no table in Ruby)")
# egg
text=(RB/"src/data/pokemon/egg_moves.h").read_text(errors="replace")
egg,total_eg={},0
for sp,block in re.findall(r"egg_moves\(([A-Z0-9_]+),\s*(.*?)\)\s*,",text,re.S):
    entries=[{"move":mv} for mv in re.findall(r"(MOVE_[A-Z0-9_]+)",block)]; total_eg+=len(entries); egg[f"SPECIES_{sp}"]=entries
un_eg_sp=sorted({c for c in egg if c not in sp_set}); un_eg_mv=sorted({e["move"] for v in egg.values() for e in v if e["move"] not in mv_set})
dump("decomp_ruby_egg_learnsets.json",{"source":"pokeruby/src/data/pokemon/egg_moves.h","sourceRepo":"pret/pokeruby","speciesWithEggMoves":len(egg),"totalEggMoves":total_eg,"unresolvedSpecies":un_eg_sp,"unresolvedMoves":un_eg_mv,"learnsets":egg})
print("egg:",len(egg),total_eg,"unresolved species:",un_eg_sp,"moves:",un_eg_mv)
# evolutions
text=(RB/"src/data/pokemon/evolution.h").read_text(errors="replace")
evos,un_ev,total_ev={},set(),0
for name,inner in re.findall(r"\[SPECIES_([A-Z0-9_]+)\]\s*=\s*\{\{(.*?)\}\},?",text,re.S):
    const=f"SPECIES_{name}"; entries=[]
    for method,param,target in re.findall(r"EVO_([A-Z_]+),\s*([^,]+),\s*(SPECIES_[A-Z0-9_]+)",inner):
        total_ev+=1
        if target not in sp_set: un_ev.add(target)
        entries.append({"method":method,"param":param.strip(),"target":target})
    if entries: evos[const]=entries
dump("decomp_ruby_evolutions.json",{"source":"pokeruby/src/data/pokemon/evolution.h","sourceRepo":"pret/pokeruby","speciesWithEvolutions":len(evos),"totalEvolutions":total_ev,"unresolvedTargets":sorted(un_ev),"note":"Methods preserved exactly.","evolutions":evos})
print("evolutions:",len(evos),total_ev,"unresolved:",sorted(un_ev)); print("BULBASAUR evo:",evos.get("SPECIES_BULBASAUR")); assert evos["SPECIES_BULBASAUR"]==[{"method":"LEVEL","param":"16","target":"SPECIES_IVYSAUR"}]
# trainers
parties_text=(RB/"src/data/trainer_parties.h").read_text(errors="replace"); parties={}
for pname,block in re.findall(r"const struct TrainerMon\w+ (gTrainerParty_\w+)\[\] = \{(.*?)\n\};",parties_text,re.S):
    mons=[]
    for mon in re.findall(r"\{\s*(.*?)\s*\}",block,re.S):
        sp=re.search(r"\.species\s*=\s*(SPECIES_[A-Z0-9_]+)",mon); lvl=re.search(r"\.level\s*=\s*(\d+)",mon); iv=re.search(r"\.iv\s*=\s*(\d+)",mon); held=re.search(r"\.heldItem\s*=\s*(ITEM_[A-Z0-9_]+)",mon)
        mons.append({"species":sp.group(1) if sp else None,"level":int(lvl.group(1)) if lvl else None,"iv":int(iv.group(1)) if iv else None,"heldItem":held.group(1) if held else None,"moves":re.findall(r"MOVE_[A-Z0-9_]+",mon)})
    parties[pname]=mons
trainers_text=(RB/"src/data/trainers_en.h").read_text(errors="replace"); trainers=[]; un_tr=set(); total_party=0
for tname,block in re.findall(r"\[TRAINER_([A-Z0-9_]+)\]\s*=\s*\{(.*?)\n    \}",trainers_text,re.S):
    if tname=="NONE": continue
    cls=re.search(r"\.trainerClass\s*=\s*(TRAINER_CLASS_[A-Z0-9_]+)",block); nm=re.search(r"\.trainerName\s*=\s*_\(\"([^\"]*)\"\)",block); party_ref=re.search(r"\.party\s*=\s*\{?\.[A-Za-z]+\s*=\s*(gTrainerParty_\w+)",block)
    party=parties.get(party_ref.group(1),[]) if party_ref else []
    for mon in party:
        total_party+=1
        if mon["species"] not in sp_set: un_tr.add(mon["species"])
        for mv in mon["moves"]:
            if mv not in mv_set and mv!="MOVE_NONE": un_tr.add(mv)
    trainers.append({"sourceConstant":f"TRAINER_{tname}","trainerClass":cls.group(1) if cls else None,"trainerName":nm.group(1) if nm else None,"partyRef":party_ref.group(1) if party_ref else None,"party":party})
dump("decomp_ruby_trainers.json",{"source":"pokeruby/src/data/trainers_en.h + src/data/trainer_parties.h","sourceRepo":"pret/pokeruby","trainerCount":len(trainers),"totalPartyMembers":total_party,"unresolvedPartySpeciesOrMoves":sorted(x for x in un_tr if x),"trainers":trainers})
print("trainers:",len(trainers),total_party,"unresolved:",sorted(un_tr))
# encounters summary
enc=json.load(open(RB/"src/data/wild_encounters.json")); groups=enc.get("wild_encounter_groups",[]); enc_species=set(); entries_total=0; map_count=0
def walk(o):
    global entries_total
    if isinstance(o,dict):
        if "species" in o and isinstance(o["species"],str): enc_species.add(o["species"]); entries_total+=1
        for v in o.values(): walk(v)
    elif isinstance(o,list):
        for v in o: walk(v)
walk(enc)
for g in groups:
    if isinstance(g,dict): map_count+=len(g.get("encounters",[]))
un_enc=sorted({s for s in enc_species if f"SPECIES_{s}" not in sp_set and s not in sp_set})
dump("decomp_ruby_encounters.json",{"source":"pokeruby/src/data/wild_encounters.json","sourceRepo":"pret/pokeruby","note":"Summary + species validation only; full wild_encounters.json remains in the decomp clone.","wildEncounterGroups":len(groups),"mapEncounterEntries":map_count,"encounterSpeciesEntries":entries_total,"distinctEncounterSpecies":len(enc_species),"unresolvedEncounterSpecies":un_enc,"encounterSpecies":sorted(enc_species)})
print("encounters: groups",len(groups),"map entries",map_count,"species entries",entries_total,"distinct",len(enc_species),"unresolved",un_enc)
# cross-checks
fr_sp={e["sourceConstant"]:e for e in json.loads((FR/"decomp_firered_species.json").read_text(errors="replace"))["species"]}
em_sp=json.loads((Path.home()/"workspace/mochiichao-work/extractions/emerald/decomp_emerald_species.json").read_text())["species"]
em_map={e["sourceConstant"]:e for e in em_sp}
same_fr=sum(1 for c in sp_set if c in fr_sp and all(fr_sp[c].get(k)==next(e for e in species if e["sourceConstant"]==c).get(k) for k in ["baseHP","baseAttack","baseDefense","baseSpeed","baseSpAttack","baseSpDefense"]))
same_em=sum(1 for c in sp_set if c in em_map and all(em_map[c].get(k)==next(e for e in species if e["sourceConstant"]==c).get(k) for k in ["baseHP","baseAttack","baseDefense","baseSpeed","baseSpAttack","baseSpDefense"]))
print("cross-check: Ruby species in FireRed:",len(sp_set & set(fr_sp)),"identical 6 stats:",same_fr,"; in Emerald:",len(sp_set & set(em_map)),"identical:",same_em)
print("DONE")
