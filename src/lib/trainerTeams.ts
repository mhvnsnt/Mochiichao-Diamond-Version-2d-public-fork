/**
 * Trainer teams — all regions, generated from the goal-file trainer
 * table (trainer-teams-all-regions.md, JSON appendix, 265 rows).
 * No move was invented here: a team member is speciesId + level only.
 * Stats come from species base stats at that level via the existing
 * battle code; AI profiles are the 6 profiles from the batch-2
 * Pokemon battle-AI conversion (Novice/Balanced/Type-aware/Defensive/
 * Aggressive/Elite). Trainer names are as written in the source file
 * (dialogue rule: Muse-written, locked once written); any NAME GAP
 * marker in the source is preserved, not filled by guessing.
 * Species set is exactly the 49 in species.ts (001-046 + 147 + 148 + 331),
 * so every row is buildable now that 147/148 have stats (PR #287).
 */
export type TrainerTeamMember = { speciesId: string; level: number };
export type TrainerRow = {
  id: string;
  trainer: string;
  location: string;
  ai: "Novice" | "Balanced" | "Type-aware" | "Defensive" | "Aggressive" | "Elite";
  team: TrainerTeamMember[];
  reward: number;
};
export const TRAINER_TEAMS: TrainerRow[] = [
  {
    "id": "R1-001",
    "trainer": "Youngster \u2014 Jay (KEEP)",
    "location": "Route 1.0",
    "ai": "Novice",
    "team": [
      {
        "speciesId": "038",
        "level": 5
      }
    ],
    "reward": 120
  },
  {
    "id": "R1-002",
    "trainer": "Lass \u2014 Amy (KEEP)",
    "location": "Route 1.0",
    "ai": "Novice",
    "team": [
      {
        "speciesId": "001",
        "level": 4
      }
    ],
    "reward": 100
  },
  {
    "id": "R1-003",
    "trainer": "Hiker \u2014 Dan (KEEP)",
    "location": "Route 1.0",
    "ai": "Novice",
    "team": [
      {
        "speciesId": "007",
        "level": 6
      }
    ],
    "reward": 180
  },
  {
    "id": "R1-004",
    "trainer": "Bug Catcher \u2014 Rick (KEEP)",
    "location": "Route 1.0",
    "ai": "Novice",
    "team": [
      {
        "speciesId": "016",
        "level": 3
      }
    ],
    "reward": 80
  },
  {
    "id": "R1-005",
    "trainer": "Bug Catcher \u2014 Mira",
    "location": "Binary Woods",
    "ai": "Novice",
    "team": [
      {
        "speciesId": "016",
        "level": 10
      },
      {
        "speciesId": "017",
        "level": 11
      }
    ],
    "reward": 220
  },
  {
    "id": "R1-006",
    "trainer": "Woods Walker \u2014 Tess",
    "location": "Binary Woods",
    "ai": "Balanced",
    "team": [
      {
        "speciesId": "038",
        "level": 11
      },
      {
        "speciesId": "041",
        "level": 11
      }
    ],
    "reward": 280
  },
  {
    "id": "R1-007",
    "trainer": "Hacker Grunt (KEEP)",
    "location": "Binary Woods",
    "ai": "Balanced",
    "team": [
      {
        "speciesId": "010",
        "level": 12
      }
    ],
    "reward": 350
  },
  {
    "id": "R1-008",
    "trainer": "Dockhand \u2014 Juno",
    "location": "Stoneport City",
    "ai": "Balanced",
    "team": [
      {
        "speciesId": "022",
        "level": 16
      },
      {
        "speciesId": "001",
        "level": 16
      }
    ],
    "reward": 360
  },
  {
    "id": "R1-009",
    "trainer": "Hacker Grunt \u2014 Vex",
    "location": "Stoneport Docks",
    "ai": "Balanced",
    "team": [
      {
        "speciesId": "032",
        "level": 17
      },
      {
        "speciesId": "010",
        "level": 17
      }
    ],
    "reward": 400
  },
  {
    "id": "R1-010",
    "trainer": "Miner \u2014 Cleff",
    "location": "Cave of Echoes",
    "ai": "Balanced",
    "team": [
      {
        "speciesId": "035",
        "level": 15
      },
      {
        "speciesId": "007",
        "level": 16
      }
    ],
    "reward": 340
  },
  {
    "id": "R1-011",
    "trainer": "Cave Runner \u2014 Pike",
    "location": "Cave of Echoes",
    "ai": "Balanced",
    "team": [
      {
        "speciesId": "013",
        "level": 16
      },
      {
        "speciesId": "036",
        "level": 17
      }
    ],
    "reward": 380
  },
  {
    "id": "R1-012",
    "trainer": "Tunnel Guard \u2014 Mara",
    "location": "Signal Tunnel",
    "ai": "Balanced",
    "team": [
      {
        "speciesId": "032",
        "level": 20
      },
      {
        "speciesId": "035",
        "level": 21
      }
    ],
    "reward": 440
  },
  {
    "id": "R1-013",
    "trainer": "Tunnel Runner \u2014 Sol",
    "location": "Signal Tunnel",
    "ai": "Balanced",
    "team": [
      {
        "speciesId": "019",
        "level": 20
      },
      {
        "speciesId": "013",
        "level": 21
      }
    ],
    "reward": 440
  },
  {
    "id": "R1-014",
    "trainer": "Tower Keeper \u2014 Ivo",
    "location": "Pale Town Tower",
    "ai": "Type-aware",
    "team": [
      {
        "speciesId": "042",
        "level": 24
      },
      {
        "speciesId": "043",
        "level": 25
      }
    ],
    "reward": 560
  },
  {
    "id": "R1-015",
    "trainer": "Syndicate Operative \u2014 Rook",
    "location": "Pale Town Tower",
    "ai": "Type-aware",
    "team": [
      {
        "speciesId": "027",
        "level": 25
      },
      {
        "speciesId": "008",
        "level": 25
      }
    ],
    "reward": 600
  },
  {
    "id": "R1-016",
    "trainer": "Market Vendor \u2014 Bex",
    "location": "Market City",
    "ai": "Balanced",
    "team": [
      {
        "speciesId": "029",
        "level": 27
      },
      {
        "speciesId": "013",
        "level": 27
      }
    ],
    "reward": 580
  },
  {
    "id": "R1-017",
    "trainer": "Arcade Runner \u2014 Kit",
    "location": "Market City",
    "ai": "Balanced",
    "team": [
      {
        "speciesId": "010",
        "level": 28
      },
      {
        "speciesId": "030",
        "level": 28
      }
    ],
    "reward": 620
  },
  {
    "id": "R1-018",
    "trainer": "Syndicate Operative \u2014 Slate",
    "location": "Market Hideout",
    "ai": "Type-aware",
    "team": [
      {
        "speciesId": "032",
        "level": 29
      },
      {
        "speciesId": "027",
        "level": 29
      }
    ],
    "reward": 700
  },
  {
    "id": "R1-019",
    "trainer": "Syndicate Operative \u2014 Onyx",
    "location": "Market Hideout",
    "ai": "Type-aware",
    "team": [
      {
        "speciesId": "005",
        "level": 30
      },
      {
        "speciesId": "042",
        "level": 30
      }
    ],
    "reward": 720
  },
  {
    "id": "R1-020",
    "trainer": "HQ Guard \u2014 Ferrin",
    "location": "Central HQ Floor 1",
    "ai": "Type-aware",
    "team": [
      {
        "speciesId": "033",
        "level": 31
      },
      {
        "speciesId": "026",
        "level": 31
      }
    ],
    "reward": 740
  },
  {
    "id": "R1-021",
    "trainer": "HQ Guard \u2014 Vanna",
    "location": "Central HQ Floor 2",
    "ai": "Type-aware",
    "team": [
      {
        "speciesId": "043",
        "level": 32
      },
      {
        "speciesId": "005",
        "level": 32
      }
    ],
    "reward": 780
  },
  {
    "id": "R1-022",
    "trainer": "HQ Commander \u2014 [NAME GAP]",
    "location": "Central HQ Top",
    "ai": "Aggressive",
    "team": [
      {
        "speciesId": "006",
        "level": 34
      },
      {
        "speciesId": "043",
        "level": 34
      },
      {
        "speciesId": "027",
        "level": 34
      }
    ],
    "reward": 1200
  },
  {
    "id": "R1-023",
    "trainer": "Preserve Ranger \u2014 Wren",
    "location": "Harbor Preserve",
    "ai": "Balanced",
    "team": [
      {
        "speciesId": "024",
        "level": 35
      },
      {
        "speciesId": "038",
        "level": 35
      }
    ],
    "reward": 800
  },
  {
    "id": "R1-024",
    "trainer": "Preserve Ranger \u2014 Ash",
    "location": "Harbor Preserve",
    "ai": "Balanced",
    "team": [
      {
        "speciesId": "022",
        "level": 36
      },
      {
        "speciesId": "041",
        "level": 36
      }
    ],
    "reward": 820
  },
  {
    "id": "R1-025",
    "trainer": "Lab Guard \u2014 Ember",
    "location": "Ember Island Ruins",
    "ai": "Type-aware",
    "team": [
      {
        "speciesId": "044",
        "level": 39
      },
      {
        "speciesId": "010",
        "level": 39
      }
    ],
    "reward": 900
  },
  {
    "id": "R1-026",
    "trainer": "Ruins Runner \u2014 Cade",
    "location": "Ember Island Ruins",
    "ai": "Type-aware",
    "team": [
      {
        "speciesId": "011",
        "level": 40
      },
      {
        "speciesId": "045",
        "level": 40
      }
    ],
    "reward": 940
  },
  {
    "id": "R1-027",
    "trainer": "Veteran \u2014 Hana",
    "location": "Victory Route",
    "ai": "Aggressive",
    "team": [
      {
        "speciesId": "009",
        "level": 46
      },
      {
        "speciesId": "006",
        "level": 46
      }
    ],
    "reward": 1100
  },
  {
    "id": "R1-028",
    "trainer": "Veteran \u2014 Doru",
    "location": "Victory Route",
    "ai": "Aggressive",
    "team": [
      {
        "speciesId": "003",
        "level": 47
      },
      {
        "speciesId": "012",
        "level": 47
      }
    ],
    "reward": 1150
  },
  {
    "id": "R1-029",
    "trainer": "Veteran \u2014 Sable",
    "location": "Victory Route",
    "ai": "Aggressive",
    "team": [
      {
        "speciesId": "015",
        "level": 48
      },
      {
        "speciesId": "028",
        "level": 48
      }
    ],
    "reward": 1200
  },
  {
    "id": "R1-030",
    "trainer": "Veteran \u2014 Quinn",
    "location": "Victory Route",
    "ai": "Aggressive",
    "team": [
      {
        "speciesId": "021",
        "level": 49
      },
      {
        "speciesId": "046",
        "level": 49
      }
    ],
    "reward": 1250
  },
  {
    "id": "R1-031",
    "trainer": "Acolyte \u2014 Ken (KEEP)",
    "location": "Dojo 1 Core",
    "ai": "Type-aware",
    "team": [
      {
        "speciesId": "007",
        "level": 8
      }
    ],
    "reward": 300
  },
  {
    "id": "R1-032",
    "trainer": "Acolyte \u2014 Ren (KEEP)",
    "location": "Dojo 1 Core",
    "ai": "Type-aware",
    "team": [
      {
        "speciesId": "004",
        "level": 9
      }
    ],
    "reward": 350
  },
  {
    "id": "R1-033",
    "trainer": "Acolyte \u2014 Shin (KEEP)",
    "location": "Dojo 1 Core",
    "ai": "Type-aware",
    "team": [
      {
        "speciesId": "001",
        "level": 10
      }
    ],
    "reward": 400
  },
  {
    "id": "R1-034",
    "trainer": "Acolyte \u2014 Ryu (KEEP)",
    "location": "Dojo 1 Core",
    "ai": "Type-aware",
    "team": [
      {
        "speciesId": "038",
        "level": 11
      }
    ],
    "reward": 450
  },
  {
    "id": "R1-035",
    "trainer": "Master Lin (KEEP)",
    "location": "Dojo 1 Core, badge Core Fragment, tech Heavy-Lift",
    "ai": "Defensive",
    "team": [
      {
        "speciesId": "039",
        "level": 14
      }
    ],
    "reward": 1500
  },
  {
    "id": "R1-036",
    "trainer": "Acolyte \u2014 Gale",
    "location": "Dojo 2 Aero",
    "ai": "Type-aware",
    "team": [
      {
        "speciesId": "019",
        "level": 17
      }
    ],
    "reward": 500
  },
  {
    "id": "R1-037",
    "trainer": "Acolyte \u2014 Skye",
    "location": "Dojo 2 Aero",
    "ai": "Type-aware",
    "team": [
      {
        "speciesId": "019",
        "level": 18
      },
      {
        "speciesId": "020",
        "level": 18
      }
    ],
    "reward": 600
  },
  {
    "id": "R1-038",
    "trainer": "Master Falk (REPLACE placeholder)",
    "location": "Dojo 2 Aero, badge Wind Fragment, tech Data-Cut NOT here (ferry beat)",
    "ai": "Type-aware",
    "team": [
      {
        "speciesId": "019",
        "level": 18
      },
      {
        "speciesId": "020",
        "level": 19
      },
      {
        "speciesId": "021",
        "level": 20
      }
    ],
    "reward": 1500
  },
  {
    "id": "R1-039",
    "trainer": "Acolyte \u2014 Volt",
    "location": "Dojo 3 Chrome",
    "ai": "Type-aware",
    "team": [
      {
        "speciesId": "004",
        "level": 21
      },
      {
        "speciesId": "032",
        "level": 21
      }
    ],
    "reward": 650
  },
  {
    "id": "R1-040",
    "trainer": "Acolyte \u2014 Alloy",
    "location": "Dojo 3 Chrome",
    "ai": "Type-aware",
    "team": [
      {
        "speciesId": "033",
        "level": 22
      },
      {
        "speciesId": "005",
        "level": 22
      }
    ],
    "reward": 700
  },
  {
    "id": "R1-041",
    "trainer": "Dojo Leader \u2014 [NAME GAP: Neon]",
    "location": "Dojo 3 Chrome, badge Neon Fragment",
    "ai": "Defensive",
    "team": [
      {
        "speciesId": "005",
        "level": 23
      },
      {
        "speciesId": "033",
        "level": 23
      },
      {
        "speciesId": "034",
        "level": 24
      }
    ],
    "reward": 2000
  },
  {
    "id": "R1-042",
    "trainer": "Acolyte \u2014 Jab",
    "location": "Dojo 4 Strike",
    "ai": "Type-aware",
    "team": [
      {
        "speciesId": "029",
        "level": 27
      },
      {
        "speciesId": "030",
        "level": 27
      }
    ],
    "reward": 750
  },
  {
    "id": "R1-043",
    "trainer": "Acolyte \u2014 Kick",
    "location": "Dojo 4 Strike",
    "ai": "Type-aware",
    "team": [
      {
        "speciesId": "030",
        "level": 28
      },
      {
        "speciesId": "031",
        "level": 28
      }
    ],
    "reward": 800
  },
  {
    "id": "R1-044",
    "trainer": "Dojo Leader \u2014 [NAME GAP: Market]",
    "location": "Dojo 4 Strike, badge Strike Fragment",
    "ai": "Aggressive",
    "team": [
      {
        "speciesId": "029",
        "level": 29
      },
      {
        "speciesId": "030",
        "level": 30
      },
      {
        "speciesId": "031",
        "level": 30
      }
    ],
    "reward": 2200
  },
  {
    "id": "R1-045",
    "trainer": "Acolyte \u2014 Shade",
    "location": "Dojo 5 Umbral",
    "ai": "Type-aware",
    "team": [
      {
        "speciesId": "042",
        "level": 31
      },
      {
        "speciesId": "008",
        "level": 31
      }
    ],
    "reward": 850
  },
  {
    "id": "R1-046",
    "trainer": "Acolyte \u2014 Dusk",
    "location": "Dojo 5 Umbral",
    "ai": "Type-aware",
    "team": [
      {
        "speciesId": "043",
        "level": 32
      },
      {
        "speciesId": "027",
        "level": 32
      }
    ],
    "reward": 900
  },
  {
    "id": "R1-047",
    "trainer": "Dojo Leader \u2014 [NAME GAP: Central]",
    "location": "Dojo 5 Umbral, badge Umbral Fragment",
    "ai": "Defensive",
    "team": [
      {
        "speciesId": "043",
        "level": 33
      },
      {
        "speciesId": "028",
        "level": 33
      },
      {
        "speciesId": "009",
        "level": 34
      }
    ],
    "reward": 2400
  },
  {
    "id": "R1-048",
    "trainer": "Acolyte \u2014 Tide",
    "location": "Dojo 6 Water",
    "ai": "Type-aware",
    "team": [
      {
        "speciesId": "001",
        "level": 35
      },
      {
        "speciesId": "022",
        "level": 35
      }
    ],
    "reward": 950
  },
  {
    "id": "R1-049",
    "trainer": "Acolyte \u2014 Surf",
    "location": "Dojo 6 Water",
    "ai": "Type-aware",
    "team": [
      {
        "speciesId": "023",
        "level": 36
      },
      {
        "speciesId": "024",
        "level": 36
      }
    ],
    "reward": 1000
  },
  {
    "id": "R1-050",
    "trainer": "Dojo Leader \u2014 [NAME GAP: Harbor]",
    "location": "Dojo 6 Water, badge Water Fragment, tech Wave-Ride",
    "ai": "Defensive",
    "team": [
      {
        "speciesId": "023",
        "level": 37
      },
      {
        "speciesId": "025",
        "level": 37
      },
      {
        "speciesId": "003",
        "level": 38
      }
    ],
    "reward": 2600
  },
  {
    "id": "R1-051",
    "trainer": "Acolyte \u2014 Cinder",
    "location": "Dojo 7 Flame",
    "ai": "Type-aware",
    "team": [
      {
        "speciesId": "010",
        "level": 39
      },
      {
        "speciesId": "011",
        "level": 39
      }
    ],
    "reward": 1050
  },
  {
    "id": "R1-052",
    "trainer": "Acolyte \u2014 Blaze",
    "location": "Dojo 7 Flame",
    "ai": "Type-aware",
    "team": [
      {
        "speciesId": "044",
        "level": 40
      },
      {
        "speciesId": "011",
        "level": 40
      }
    ],
    "reward": 1100
  },
  {
    "id": "R1-053",
    "trainer": "Dojo Leader \u2014 [NAME GAP: Ember]",
    "location": "Dojo 7 Flame, badge Flame Fragment",
    "ai": "Aggressive",
    "team": [
      {
        "speciesId": "012",
        "level": 41
      },
      {
        "speciesId": "045",
        "level": 41
      },
      {
        "speciesId": "046",
        "level": 42
      }
    ],
    "reward": 2800
  },
  {
    "id": "R1-054",
    "trainer": "Acolyte \u2014 Cipher",
    "location": "Dojo 8 Mythic",
    "ai": "Type-aware",
    "team": [
      {
        "speciesId": "044",
        "level": 43
      },
      {
        "speciesId": "002",
        "level": 43
      }
    ],
    "reward": 1150
  },
  {
    "id": "R1-055",
    "trainer": "Acolyte \u2014 Rune",
    "location": "Dojo 8 Mythic",
    "ai": "Type-aware",
    "team": [
      {
        "speciesId": "045",
        "level": 44
      },
      {
        "speciesId": "003",
        "level": 44
      }
    ],
    "reward": 1200
  },
  {
    "id": "R1-056",
    "trainer": "Syndicate Boss \u2014 [NAME GAP: Silicon return]",
    "location": "Dojo 8 Mythic, badge Final Fragment, opens Victory Route",
    "ai": "Aggressive",
    "team": [
      {
        "speciesId": "046",
        "level": 45
      },
      {
        "speciesId": "003",
        "level": 46
      },
      {
        "speciesId": "002",
        "level": 46
      },
      {
        "speciesId": "028",
        "level": 47
      }
    ],
    "reward": 4000
  },
  {
    "id": "R1-057",
    "trainer": "Elite Four 1 \u2014 [NAME GAP] Water",
    "location": "Mainframe Plateau",
    "ai": "Elite",
    "team": [
      {
        "speciesId": "003",
        "level": 50
      },
      {
        "speciesId": "025",
        "level": 50
      },
      {
        "speciesId": "028",
        "level": 51
      }
    ],
    "reward": 5000
  },
  {
    "id": "R1-058",
    "trainer": "Elite Four 2 \u2014 [NAME GAP] Chrome",
    "location": "Mainframe Plateau",
    "ai": "Elite",
    "team": [
      {
        "speciesId": "006",
        "level": 51
      },
      {
        "speciesId": "034",
        "level": 51
      },
      {
        "speciesId": "023",
        "level": 52
      }
    ],
    "reward": 5500
  },
  {
    "id": "R1-059",
    "trainer": "Elite Four 3 \u2014 [NAME GAP] Flame",
    "location": "Mainframe Plateau",
    "ai": "Elite",
    "team": [
      {
        "speciesId": "012",
        "level": 52
      },
      {
        "speciesId": "046",
        "level": 52
      },
      {
        "speciesId": "045",
        "level": 53
      }
    ],
    "reward": 6000
  },
  {
    "id": "R1-060",
    "trainer": "Elite Four 4 \u2014 [NAME GAP] Umbral",
    "location": "Mainframe Plateau",
    "ai": "Elite",
    "team": [
      {
        "speciesId": "009",
        "level": 53
      },
      {
        "speciesId": "043",
        "level": 53
      },
      {
        "speciesId": "028",
        "level": 54
      }
    ],
    "reward": 6500
  },
  {
    "id": "R1-061",
    "trainer": "Champion Hex",
    "location": "Mainframe Plateau",
    "ai": "Elite",
    "team": [
      {
        "speciesId": "006",
        "level": 55
      },
      {
        "speciesId": "009",
        "level": 55
      },
      {
        "speciesId": "003",
        "level": 56
      },
      {
        "speciesId": "012",
        "level": 56
      },
      {
        "speciesId": "021",
        "level": 57
      },
      {
        "speciesId": "046",
        "level": 57
      }
    ],
    "reward": 10000
  },
  {
    "id": "R1-062",
    "trainer": "Syndicate Remnant \u2014 Isle 1",
    "location": "Data Isle 1",
    "ai": "Aggressive",
    "team": [
      {
        "speciesId": "027",
        "level": 55
      },
      {
        "speciesId": "005",
        "level": 55
      }
    ],
    "reward": 1300
  },
  {
    "id": "R1-063",
    "trainer": "Syndicate Remnant \u2014 Isle 2",
    "location": "Data Isle 2",
    "ai": "Aggressive",
    "team": [
      {
        "speciesId": "033",
        "level": 56
      },
      {
        "speciesId": "043",
        "level": 56
      }
    ],
    "reward": 1350
  },
  {
    "id": "R1-064",
    "trainer": "Syndicate Remnant \u2014 Isle 3",
    "location": "Data Isle 3",
    "ai": "Aggressive",
    "team": [
      {
        "speciesId": "015",
        "level": 57
      },
      {
        "speciesId": "023",
        "level": 57
      }
    ],
    "reward": 1400
  },
  {
    "id": "R1-065",
    "trainer": "Syndicate Remnant \u2014 Isle 4",
    "location": "Data Isle 4",
    "ai": "Aggressive",
    "team": [
      {
        "speciesId": "021",
        "level": 58
      },
      {
        "speciesId": "046",
        "level": 58
      }
    ],
    "reward": 1450
  },
  {
    "id": "R1-066",
    "trainer": "Syndicate Remnant \u2014 Isle 5",
    "location": "Data Isle 5",
    "ai": "Aggressive",
    "team": [
      {
        "speciesId": "034",
        "level": 59
      },
      {
        "speciesId": "003",
        "level": 59
      }
    ],
    "reward": 1500
  },
  {
    "id": "R1-067",
    "trainer": "Syndicate Remnant \u2014 Isle 6",
    "location": "Data Isle 6",
    "ai": "Aggressive",
    "team": [
      {
        "speciesId": "009",
        "level": 60
      },
      {
        "speciesId": "028",
        "level": 60
      }
    ],
    "reward": 1550
  },
  {
    "id": "R1-068",
    "trainer": "Syndicate Remnant \u2014 Isle 7",
    "location": "Data Isle 7",
    "ai": "Aggressive",
    "team": [
      {
        "speciesId": "006",
        "level": 61
      },
      {
        "speciesId": "012",
        "level": 61
      },
      {
        "speciesId": "046",
        "level": 61
      }
    ],
    "reward": 2000
  },
  {
    "id": "R1-069",
    "trainer": "Dojo 1 Rematch \u2014 Master Lin",
    "location": "Silicon Town, post-game",
    "ai": "Elite",
    "team": [
      {
        "speciesId": "035",
        "level": 60
      },
      {
        "speciesId": "037",
        "level": 60
      },
      {
        "speciesId": "040",
        "level": 61
      }
    ],
    "reward": 3000
  },
  {
    "id": "R1-070",
    "trainer": "Dojo 2 Rematch \u2014 Master Falk",
    "location": "Stoneport, post-game",
    "ai": "Elite",
    "team": [
      {
        "speciesId": "020",
        "level": 61
      },
      {
        "speciesId": "021",
        "level": 61
      },
      {
        "speciesId": "003",
        "level": 62
      }
    ],
    "reward": 3200
  },
  {
    "id": "R1-071",
    "trainer": "Dojo 3 Rematch \u2014 [NAME GAP: Neon]",
    "location": "Neon City, post-game",
    "ai": "Elite",
    "team": [
      {
        "speciesId": "006",
        "level": 62
      },
      {
        "speciesId": "034",
        "level": 62
      },
      {
        "speciesId": "023",
        "level": 63
      }
    ],
    "reward": 3400
  },
  {
    "id": "R1-072",
    "trainer": "Dojo 4 Rematch \u2014 [NAME GAP: Market]",
    "location": "Market City, post-game",
    "ai": "Elite",
    "team": [
      {
        "speciesId": "031",
        "level": 63
      },
      {
        "speciesId": "015",
        "level": 63
      },
      {
        "speciesId": "030",
        "level": 64
      }
    ],
    "reward": 3600
  },
  {
    "id": "R1-073",
    "trainer": "Dojo 5 Rematch \u2014 [NAME GAP: Central]",
    "location": "Central City, post-game",
    "ai": "Elite",
    "team": [
      {
        "speciesId": "043",
        "level": 64
      },
      {
        "speciesId": "028",
        "level": 64
      },
      {
        "speciesId": "009",
        "level": 65
      }
    ],
    "reward": 3800
  },
  {
    "id": "R1-074",
    "trainer": "Dojo 6 Rematch \u2014 [NAME GAP: Harbor]",
    "location": "Harbor City, post-game",
    "ai": "Elite",
    "team": [
      {
        "speciesId": "025",
        "level": 65
      },
      {
        "speciesId": "003",
        "level": 65
      },
      {
        "speciesId": "028",
        "level": 66
      }
    ],
    "reward": 4000
  },
  {
    "id": "R1-075",
    "trainer": "Dojo 7 Rematch \u2014 [NAME GAP: Ember]",
    "location": "Ember Island, post-game",
    "ai": "Elite",
    "team": [
      {
        "speciesId": "046",
        "level": 66
      },
      {
        "speciesId": "012",
        "level": 66
      },
      {
        "speciesId": "045",
        "level": 67
      }
    ],
    "reward": 4200
  },
  {
    "id": "R1-076",
    "trainer": "Dojo 8 Rematch \u2014 [NAME GAP: Silicon return]",
    "location": "Silicon Town, post-game",
    "ai": "Elite",
    "team": [
      {
        "speciesId": "003",
        "level": 67
      },
      {
        "speciesId": "046",
        "level": 67
      },
      {
        "speciesId": "002",
        "level": 68
      }
    ],
    "reward": 4500
  },
  {
    "id": "R2-001",
    "trainer": "Ferry Walker \u2014 Nia",
    "location": "Dawnfield Route",
    "ai": "Novice",
    "team": [
      {
        "speciesId": "147",
        "level": 10
      }
    ],
    "reward": 200
  },
  {
    "id": "R2-002",
    "trainer": "Ferry Walker \u2014 Pim",
    "location": "Dawnfield Route",
    "ai": "Novice",
    "team": [
      {
        "speciesId": "148",
        "level": 10
      },
      {
        "speciesId": "016",
        "level": 11
      }
    ],
    "reward": 220
  },
  {
    "id": "R2-003",
    "trainer": "Route Trainer \u2014 Oda",
    "location": "Cherryport Route",
    "ai": "Novice",
    "team": [
      {
        "speciesId": "041",
        "level": 12
      },
      {
        "speciesId": "147",
        "level": 12
      }
    ],
    "reward": 260
  },
  {
    "id": "R2-004",
    "trainer": "Route Trainer \u2014 Ren",
    "location": "Cherryport Route",
    "ai": "Balanced",
    "team": [
      {
        "speciesId": "019",
        "level": 13
      },
      {
        "speciesId": "148",
        "level": 13
      }
    ],
    "reward": 280
  },
  {
    "id": "R2-005",
    "trainer": "Forest Walker \u2014 Faye",
    "location": "Ilex Forest",
    "ai": "Balanced",
    "team": [
      {
        "speciesId": "017",
        "level": 20
      },
      {
        "speciesId": "041",
        "level": 20
      }
    ],
    "reward": 480
  },
  {
    "id": "R2-006",
    "trainer": "Shrine Keeper \u2014 Lorn",
    "location": "Ilex Forest",
    "ai": "Balanced",
    "team": [
      {
        "speciesId": "042",
        "level": 21
      },
      {
        "speciesId": "018",
        "level": 21
      }
    ],
    "reward": 500
  },
  {
    "id": "R2-007",
    "trainer": "Radio Runner \u2014 Dex",
    "location": "Goldenrod Radio Tower",
    "ai": "Type-aware",
    "team": [
      {
        "speciesId": "032",
        "level": 28
      },
      {
        "speciesId": "026",
        "level": 28
      }
    ],
    "reward": 700
  },
  {
    "id": "R2-008",
    "trainer": "Radio Runner \u2014 Vee",
    "location": "Goldenrod Radio Tower",
    "ai": "Type-aware",
    "team": [
      {
        "speciesId": "033",
        "level": 29
      },
      {
        "speciesId": "019",
        "level": 29
      }
    ],
    "reward": 720
  },
  {
    "id": "R2-009",
    "trainer": "Lake Watcher \u2014 Bryn",
    "location": "Mahogany Lake",
    "ai": "Type-aware",
    "team": [
      {
        "speciesId": "028",
        "level": 44
      },
      {
        "speciesId": "024",
        "level": 44
      }
    ],
    "reward": 1100
  },
  {
    "id": "R2-010",
    "trainer": "Syndicate Operative \u2014 Kest",
    "location": "Mahogany Hideout",
    "ai": "Type-aware",
    "team": [
      {
        "speciesId": "027",
        "level": 45
      },
      {
        "speciesId": "008",
        "level": 45
      }
    ],
    "reward": 1150
  },
  {
    "id": "R2-011",
    "trainer": "Syndicate Operative \u2014 Nyx",
    "location": "Mahogany Hideout",
    "ai": "Aggressive",
    "team": [
      {
        "speciesId": "043",
        "level": 46
      },
      {
        "speciesId": "006",
        "level": 46
      }
    ],
    "reward": 1200
  },
  {
    "id": "R2-012",
    "trainer": "Veteran \u2014 Taro",
    "location": "Victory Route R2",
    "ai": "Aggressive",
    "team": [
      {
        "speciesId": "009",
        "level": 56
      },
      {
        "speciesId": "015",
        "level": 56
      }
    ],
    "reward": 1400
  },
  {
    "id": "R2-013",
    "trainer": "Veteran \u2014 Iska",
    "location": "Victory Route R2",
    "ai": "Aggressive",
    "team": [
      {
        "speciesId": "021",
        "level": 57
      },
      {
        "speciesId": "046",
        "level": 57
      }
    ],
    "reward": 1450
  },
  {
    "id": "R2-014",
    "trainer": "Veteran \u2014 Ruel",
    "location": "Victory Route R2",
    "ai": "Aggressive",
    "team": [
      {
        "speciesId": "003",
        "level": 58
      },
      {
        "speciesId": "034",
        "level": 58
      }
    ],
    "reward": 1500
  },
  {
    "id": "R2-015",
    "trainer": "Veteran \u2014 Miri",
    "location": "Victory Route R2",
    "ai": "Aggressive",
    "team": [
      {
        "speciesId": "012",
        "level": 59
      },
      {
        "speciesId": "028",
        "level": 59
      }
    ],
    "reward": 1550
  },
  {
    "id": "R2-016",
    "trainer": "Acolyte \u2014 Leaf",
    "location": "Dojo 1 Flora, Violet",
    "ai": "Type-aware",
    "team": [
      {
        "speciesId": "038",
        "level": 14
      }
    ],
    "reward": 400
  },
  {
    "id": "R2-017",
    "trainer": "Acolyte \u2014 Moss",
    "location": "Dojo 1 Flora, Violet",
    "ai": "Type-aware",
    "team": [
      {
        "speciesId": "041",
        "level": 15
      },
      {
        "speciesId": "038",
        "level": 15
      }
    ],
    "reward": 450
  },
  {
    "id": "R2-018",
    "trainer": "Dojo Leader \u2014 [NAME GAP: Violet]",
    "location": "Dojo 1 Flora, badge Flora Fragment",
    "ai": "Defensive",
    "team": [
      {
        "speciesId": "039",
        "level": 16
      },
      {
        "speciesId": "040",
        "level": 16
      },
      {
        "speciesId": "041",
        "level": 17
      }
    ],
    "reward": 1800
  },
  {
    "id": "R2-019",
    "trainer": "Acolyte \u2014 Web",
    "location": "Dojo 2 Bug, Azalea",
    "ai": "Type-aware",
    "team": [
      {
        "speciesId": "016",
        "level": 18
      }
    ],
    "reward": 500
  },
  {
    "id": "R2-020",
    "trainer": "Acolyte \u2014 Silk",
    "location": "Dojo 2 Bug, Azalea",
    "ai": "Type-aware",
    "team": [
      {
        "speciesId": "017",
        "level": 19
      },
      {
        "speciesId": "016",
        "level": 19
      }
    ],
    "reward": 550
  },
  {
    "id": "R2-021",
    "trainer": "Dojo Leader \u2014 [NAME GAP: Azalea]",
    "location": "Dojo 2 Bug, badge Bug Fragment",
    "ai": "Type-aware",
    "team": [
      {
        "speciesId": "017",
        "level": 20
      },
      {
        "speciesId": "018",
        "level": 20
      },
      {
        "speciesId": "017",
        "level": 21
      }
    ],
    "reward": 2000
  },
  {
    "id": "R2-022",
    "trainer": "Acolyte \u2014 Wire",
    "location": "Dojo 3 Chrome, Goldenrod",
    "ai": "Type-aware",
    "team": [
      {
        "speciesId": "032",
        "level": 25
      }
    ],
    "reward": 650
  },
  {
    "id": "R2-023",
    "trainer": "Acolyte \u2014 Bolt",
    "location": "Dojo 3 Chrome, Goldenrod",
    "ai": "Type-aware",
    "team": [
      {
        "speciesId": "033",
        "level": 26
      },
      {
        "speciesId": "004",
        "level": 26
      }
    ],
    "reward": 700
  },
  {
    "id": "R2-024",
    "trainer": "Dojo Leader \u2014 [NAME GAP: Goldenrod]",
    "location": "Dojo 3 Chrome, badge Chrome Fragment",
    "ai": "Defensive",
    "team": [
      {
        "speciesId": "034",
        "level": 27
      },
      {
        "speciesId": "005",
        "level": 27
      },
      {
        "speciesId": "033",
        "level": 28
      }
    ],
    "reward": 2300
  },
  {
    "id": "R2-025",
    "trainer": "Acolyte \u2014 Ember",
    "location": "Dojo 4 Umbral, Ecruteak",
    "ai": "Type-aware",
    "team": [
      {
        "speciesId": "042",
        "level": 31
      }
    ],
    "reward": 800
  },
  {
    "id": "R2-026",
    "trainer": "Acolyte \u2014 Night",
    "location": "Dojo 4 Umbral, Ecruteak",
    "ai": "Type-aware",
    "team": [
      {
        "speciesId": "043",
        "level": 32
      },
      {
        "speciesId": "026",
        "level": 32
      }
    ],
    "reward": 850
  },
  {
    "id": "R2-027",
    "trainer": "Dojo Leader \u2014 [NAME GAP: Ecruteak]",
    "location": "Dojo 4 Umbral, badge Umbral Fragment",
    "ai": "Defensive",
    "team": [
      {
        "speciesId": "043",
        "level": 33
      },
      {
        "speciesId": "028",
        "level": 33
      },
      {
        "speciesId": "009",
        "level": 34
      }
    ],
    "reward": 2500
  },
  {
    "id": "R2-028",
    "trainer": "Acolyte \u2014 Foam",
    "location": "Dojo 5 Water, Olivine",
    "ai": "Type-aware",
    "team": [
      {
        "speciesId": "022",
        "level": 37
      }
    ],
    "reward": 950
  },
  {
    "id": "R2-029",
    "trainer": "Acolyte \u2014 Wave",
    "location": "Dojo 5 Water, Olivine",
    "ai": "Type-aware",
    "team": [
      {
        "speciesId": "023",
        "level": 38
      },
      {
        "speciesId": "001",
        "level": 38
      }
    ],
    "reward": 1000
  },
  {
    "id": "R2-030",
    "trainer": "Dojo Leader \u2014 [NAME GAP: Olivine]",
    "location": "Dojo 5 Water, badge Water Fragment",
    "ai": "Defensive",
    "team": [
      {
        "speciesId": "025",
        "level": 39
      },
      {
        "speciesId": "003",
        "level": 39
      },
      {
        "speciesId": "023",
        "level": 40
      }
    ],
    "reward": 2700
  },
  {
    "id": "R2-031",
    "trainer": "Acolyte \u2014 Fist",
    "location": "Dojo 6 Strike, Cianwood",
    "ai": "Type-aware",
    "team": [
      {
        "speciesId": "029",
        "level": 41
      }
    ],
    "reward": 1050
  },
  {
    "id": "R2-032",
    "trainer": "Acolyte \u2014 Spar",
    "location": "Dojo 6 Strike, Cianwood",
    "ai": "Type-aware",
    "team": [
      {
        "speciesId": "030",
        "level": 42
      },
      {
        "speciesId": "029",
        "level": 42
      }
    ],
    "reward": 1100
  },
  {
    "id": "R2-033",
    "trainer": "Dojo Leader \u2014 [NAME GAP: Cianwood]",
    "location": "Dojo 6 Strike, badge Strike Fragment",
    "ai": "Aggressive",
    "team": [
      {
        "speciesId": "031",
        "level": 43
      },
      {
        "speciesId": "015",
        "level": 43
      },
      {
        "speciesId": "030",
        "level": 44
      }
    ],
    "reward": 2900
  },
  {
    "id": "R2-034",
    "trainer": "Acolyte \u2014 Kindling",
    "location": "Dojo 7 Flame, Mahogany",
    "ai": "Type-aware",
    "team": [
      {
        "speciesId": "011",
        "level": 46
      }
    ],
    "reward": 1150
  },
  {
    "id": "R2-035",
    "trainer": "Acolyte \u2014 Flare",
    "location": "Dojo 7 Flame, Mahogany",
    "ai": "Type-aware",
    "team": [
      {
        "speciesId": "044",
        "level": 47
      },
      {
        "speciesId": "011",
        "level": 47
      }
    ],
    "reward": 1200
  },
  {
    "id": "R2-036",
    "trainer": "Dojo Leader \u2014 [NAME GAP: Mahogany]",
    "location": "Dojo 7 Flame, badge Flame Fragment",
    "ai": "Aggressive",
    "team": [
      {
        "speciesId": "012",
        "level": 48
      },
      {
        "speciesId": "045",
        "level": 48
      },
      {
        "speciesId": "046",
        "level": 49
      }
    ],
    "reward": 3100
  },
  {
    "id": "R2-037",
    "trainer": "Acolyte \u2014 Myth",
    "location": "Dojo 8 Mythic, Blackthorn",
    "ai": "Type-aware",
    "team": [
      {
        "speciesId": "002",
        "level": 52
      }
    ],
    "reward": 1250
  },
  {
    "id": "R2-038",
    "trainer": "Acolyte \u2014 Legend",
    "location": "Dojo 8 Mythic, Blackthorn",
    "ai": "Type-aware",
    "team": [
      {
        "speciesId": "044",
        "level": 53
      },
      {
        "speciesId": "002",
        "level": 53
      }
    ],
    "reward": 1300
  },
  {
    "id": "R2-039",
    "trainer": "Dojo Leader \u2014 [NAME GAP: Blackthorn]",
    "location": "Dojo 8 Mythic, badge Mythic Fragment",
    "ai": "Elite",
    "team": [
      {
        "speciesId": "003",
        "level": 54
      },
      {
        "speciesId": "046",
        "level": 54
      },
      {
        "speciesId": "002",
        "level": 55
      }
    ],
    "reward": 4200
  },
  {
    "id": "R2-040",
    "trainer": "Elite Four 1 \u2014 [NAME GAP] Flora",
    "location": "Plateau, 2nd ascent",
    "ai": "Elite",
    "team": [
      {
        "speciesId": "040",
        "level": 58
      },
      {
        "speciesId": "041",
        "level": 58
      },
      {
        "speciesId": "039",
        "level": 59
      }
    ],
    "reward": 5500
  },
  {
    "id": "R2-041",
    "trainer": "Elite Four 2 \u2014 [NAME GAP] Aero",
    "location": "Plateau, 2nd ascent",
    "ai": "Elite",
    "team": [
      {
        "speciesId": "021",
        "level": 59
      },
      {
        "speciesId": "020",
        "level": 59
      },
      {
        "speciesId": "003",
        "level": 60
      }
    ],
    "reward": 6000
  },
  {
    "id": "R2-042",
    "trainer": "Elite Four 3 \u2014 [NAME GAP] Strike",
    "location": "Plateau, 2nd ascent",
    "ai": "Elite",
    "team": [
      {
        "speciesId": "031",
        "level": 60
      },
      {
        "speciesId": "015",
        "level": 60
      },
      {
        "speciesId": "006",
        "level": 61
      }
    ],
    "reward": 6500
  },
  {
    "id": "R2-043",
    "trainer": "Elite Four 4 \u2014 [NAME GAP] Mythic",
    "location": "Plateau, 2nd ascent",
    "ai": "Elite",
    "team": [
      {
        "speciesId": "046",
        "level": 61
      },
      {
        "speciesId": "002",
        "level": 61
      },
      {
        "speciesId": "043",
        "level": 62
      }
    ],
    "reward": 7000
  },
  {
    "id": "R2-044",
    "trainer": "Champion \u2014 [NAME GAP: Region 2]",
    "location": "Plateau, 2nd ascent",
    "ai": "Elite",
    "team": [
      {
        "speciesId": "003",
        "level": 63
      },
      {
        "speciesId": "006",
        "level": 63
      },
      {
        "speciesId": "012",
        "level": 64
      },
      {
        "speciesId": "009",
        "level": 64
      },
      {
        "speciesId": "021",
        "level": 65
      },
      {
        "speciesId": "046",
        "level": 65
      }
    ],
    "reward": 11000
  },
  {
    "id": "R2-045",
    "trainer": "Dojo 1 Rematch \u2014 [NAME GAP: Violet]",
    "location": "Violet, post-game",
    "ai": "Elite",
    "team": [
      {
        "speciesId": "040",
        "level": 64
      },
      {
        "speciesId": "039",
        "level": 64
      },
      {
        "speciesId": "041",
        "level": 65
      }
    ],
    "reward": 3400
  },
  {
    "id": "R2-046",
    "trainer": "Dojo 2 Rematch \u2014 [NAME GAP: Azalea]",
    "location": "Azalea, post-game",
    "ai": "Elite",
    "team": [
      {
        "speciesId": "018",
        "level": 65
      },
      {
        "speciesId": "017",
        "level": 65
      },
      {
        "speciesId": "042",
        "level": 66
      }
    ],
    "reward": 3600
  },
  {
    "id": "R2-047",
    "trainer": "Dojo 3 Rematch \u2014 [NAME GAP: Goldenrod]",
    "location": "Goldenrod, post-game",
    "ai": "Elite",
    "team": [
      {
        "speciesId": "034",
        "level": 66
      },
      {
        "speciesId": "006",
        "level": 66
      },
      {
        "speciesId": "023",
        "level": 67
      }
    ],
    "reward": 3800
  },
  {
    "id": "R2-048",
    "trainer": "Dojo 4 Rematch \u2014 [NAME GAP: Ecruteak]",
    "location": "Ecruteak, post-game",
    "ai": "Elite",
    "team": [
      {
        "speciesId": "043",
        "level": 67
      },
      {
        "speciesId": "028",
        "level": 67
      },
      {
        "speciesId": "009",
        "level": 68
      }
    ],
    "reward": 4000
  },
  {
    "id": "R2-049",
    "trainer": "Dojo 5 Rematch \u2014 [NAME GAP: Olivine]",
    "location": "Olivine, post-game",
    "ai": "Elite",
    "team": [
      {
        "speciesId": "025",
        "level": 68
      },
      {
        "speciesId": "003",
        "level": 68
      },
      {
        "speciesId": "028",
        "level": 69
      }
    ],
    "reward": 4200
  },
  {
    "id": "R2-050",
    "trainer": "Dojo 6 Rematch \u2014 [NAME GAP: Cianwood]",
    "location": "Cianwood, post-game",
    "ai": "Elite",
    "team": [
      {
        "speciesId": "031",
        "level": 69
      },
      {
        "speciesId": "015",
        "level": 69
      },
      {
        "speciesId": "030",
        "level": 70
      }
    ],
    "reward": 4400
  },
  {
    "id": "R2-051",
    "trainer": "Dojo 7 Rematch \u2014 [NAME GAP: Mahogany]",
    "location": "Mahogany, post-game",
    "ai": "Elite",
    "team": [
      {
        "speciesId": "046",
        "level": 70
      },
      {
        "speciesId": "012",
        "level": 70
      },
      {
        "speciesId": "045",
        "level": 71
      }
    ],
    "reward": 4600
  },
  {
    "id": "R2-052",
    "trainer": "Dojo 8 Rematch \u2014 [NAME GAP: Blackthorn]",
    "location": "Blackthorn, post-game",
    "ai": "Elite",
    "team": [
      {
        "speciesId": "003",
        "level": 71
      },
      {
        "speciesId": "046",
        "level": 71
      },
      {
        "speciesId": "002",
        "level": 72
      }
    ],
    "reward": 4800
  },
  {
    "id": "R2-053",
    "trainer": "First Champion \u2014 [NAME GAP: Frost Peak]",
    "location": "Frost Peak, post-game final",
    "ai": "Elite",
    "team": [
      {
        "speciesId": "006",
        "level": 72
      },
      {
        "speciesId": "009",
        "level": 72
      },
      {
        "speciesId": "003",
        "level": 73
      },
      {
        "speciesId": "012",
        "level": 73
      },
      {
        "speciesId": "021",
        "level": 74
      },
      {
        "speciesId": "046",
        "level": 74
      }
    ],
    "reward": 15000
  },
  {
    "id": "R3-001",
    "trainer": "Hex \u2014 lab-exit battle",
    "location": "Root Hamlet Lab",
    "ai": "Aggressive",
    "team": [
      {
        "speciesId": "006",
        "level": 62
      },
      {
        "speciesId": "009",
        "level": 62
      },
      {
        "speciesId": "003",
        "level": 63
      }
    ],
    "reward": 2000
  },
  {
    "id": "R3-002",
    "trainer": "Route Trainer \u2014 Sela",
    "location": "Oldale Road",
    "ai": "Balanced",
    "team": [
      {
        "speciesId": "013",
        "level": 60
      },
      {
        "speciesId": "038",
        "level": 60
      }
    ],
    "reward": 1300
  },
  {
    "id": "R3-003",
    "trainer": "Route Trainer \u2014 Corin",
    "location": "Oldale Road",
    "ai": "Balanced",
    "team": [
      {
        "speciesId": "019",
        "level": 61
      },
      {
        "speciesId": "022",
        "level": 61
      }
    ],
    "reward": 1350
  },
  {
    "id": "R3-004",
    "trainer": "Arena Runner \u2014 Pax",
    "location": "Mauville Arena",
    "ai": "Type-aware",
    "team": [
      {
        "speciesId": "030",
        "level": 66
      },
      {
        "speciesId": "005",
        "level": 66
      }
    ],
    "reward": 1500
  },
  {
    "id": "R3-005",
    "trainer": "Arena Runner \u2014 Lux",
    "location": "Mauville Arena",
    "ai": "Type-aware",
    "team": [
      {
        "speciesId": "033",
        "level": 67
      },
      {
        "speciesId": "011",
        "level": 67
      }
    ],
    "reward": 1550
  },
  {
    "id": "R3-006",
    "trainer": "Land Faction \u2014 Terra",
    "location": "Lilycove Hideout",
    "ai": "Type-aware",
    "team": [
      {
        "speciesId": "035",
        "level": 70
      },
      {
        "speciesId": "015",
        "level": 70
      }
    ],
    "reward": 1700
  },
  {
    "id": "R3-007",
    "trainer": "Sea Faction \u2014 Marina",
    "location": "Lilycove Hideout",
    "ai": "Type-aware",
    "team": [
      {
        "speciesId": "027",
        "level": 70
      },
      {
        "speciesId": "025",
        "level": 70
      }
    ],
    "reward": 1700
  },
  {
    "id": "R3-008",
    "trainer": "Land Faction Leader \u2014 [NAME GAP: Land]",
    "location": "Lilycove Hideout",
    "ai": "Aggressive",
    "team": [
      {
        "speciesId": "036",
        "level": 71
      },
      {
        "speciesId": "009",
        "level": 71
      },
      {
        "speciesId": "015",
        "level": 72
      }
    ],
    "reward": 3000
  },
  {
    "id": "R3-009",
    "trainer": "Sea Faction Leader \u2014 [NAME GAP: Sea]",
    "location": "Lilycove Hideout",
    "ai": "Aggressive",
    "team": [
      {
        "speciesId": "028",
        "level": 71
      },
      {
        "speciesId": "003",
        "level": 71
      },
      {
        "speciesId": "025",
        "level": 72
      }
    ],
    "reward": 3000
  },
  {
    "id": "R3-010",
    "trainer": "Veteran \u2014 Joss",
    "location": "Victory Route R3",
    "ai": "Aggressive",
    "team": [
      {
        "speciesId": "021",
        "level": 74
      },
      {
        "speciesId": "046",
        "level": 74
      }
    ],
    "reward": 1800
  },
  {
    "id": "R3-011",
    "trainer": "Veteran \u2014 Kira",
    "location": "Victory Route R3",
    "ai": "Aggressive",
    "team": [
      {
        "speciesId": "006",
        "level": 75
      },
      {
        "speciesId": "003",
        "level": 75
      }
    ],
    "reward": 1850
  },
  {
    "id": "R3-012",
    "trainer": "Veteran \u2014 Voss",
    "location": "Victory Route R3",
    "ai": "Aggressive",
    "team": [
      {
        "speciesId": "012",
        "level": 76
      },
      {
        "speciesId": "028",
        "level": 76
      }
    ],
    "reward": 1900
  },
  {
    "id": "R3-013",
    "trainer": "Veteran \u2014 Elara",
    "location": "Victory Route R3",
    "ai": "Aggressive",
    "team": [
      {
        "speciesId": "009",
        "level": 77
      },
      {
        "speciesId": "046",
        "level": 77
      }
    ],
    "reward": 1950
  },
  {
    "id": "R3-014",
    "trainer": "Acolyte \u2014 Stone",
    "location": "Dojo 1 Core, Rustboro",
    "ai": "Type-aware",
    "team": [
      {
        "speciesId": "007",
        "level": 62
      }
    ],
    "reward": 1300
  },
  {
    "id": "R3-015",
    "trainer": "Acolyte \u2014 Boulder",
    "location": "Dojo 1 Core, Rustboro",
    "ai": "Type-aware",
    "team": [
      {
        "speciesId": "035",
        "level": 63
      },
      {
        "speciesId": "013",
        "level": 63
      }
    ],
    "reward": 1350
  },
  {
    "id": "R3-016",
    "trainer": "Dojo Leader \u2014 [NAME GAP: Rustboro]",
    "location": "Dojo 1 Core, badge Core Fragment",
    "ai": "Defensive",
    "team": [
      {
        "speciesId": "036",
        "level": 64
      },
      {
        "speciesId": "015",
        "level": 64
      },
      {
        "speciesId": "009",
        "level": 65
      }
    ],
    "reward": 2800
  },
  {
    "id": "R3-017",
    "trainer": "Acolyte \u2014 Grapple",
    "location": "Dojo 2 Strike, Dewford",
    "ai": "Type-aware",
    "team": [
      {
        "speciesId": "029",
        "level": 65
      }
    ],
    "reward": 1400
  },
  {
    "id": "R3-018",
    "trainer": "Acolyte \u2014 Tumble",
    "location": "Dojo 2 Strike, Dewford",
    "ai": "Type-aware",
    "team": [
      {
        "speciesId": "030",
        "level": 66
      },
      {
        "speciesId": "029",
        "level": 66
      }
    ],
    "reward": 1450
  },
  {
    "id": "R3-019",
    "trainer": "Dojo Leader \u2014 [NAME GAP: Dewford]",
    "location": "Dojo 2 Strike, badge Strike Fragment",
    "ai": "Aggressive",
    "team": [
      {
        "speciesId": "031",
        "level": 67
      },
      {
        "speciesId": "015",
        "level": 67
      },
      {
        "speciesId": "030",
        "level": 68
      }
    ],
    "reward": 3000
  },
  {
    "id": "R3-020",
    "trainer": "Acolyte \u2014 Circuit",
    "location": "Dojo 3 Chrome, Mauville",
    "ai": "Type-aware",
    "team": [
      {
        "speciesId": "032",
        "level": 68
      }
    ],
    "reward": 1500
  },
  {
    "id": "R3-021",
    "trainer": "Acolyte \u2014 Dynamo",
    "location": "Dojo 3 Chrome, Mauville",
    "ai": "Type-aware",
    "team": [
      {
        "speciesId": "033",
        "level": 69
      },
      {
        "speciesId": "005",
        "level": 69
      }
    ],
    "reward": 1550
  },
  {
    "id": "R3-022",
    "trainer": "Dojo Leader \u2014 [NAME GAP: Mauville]",
    "location": "Dojo 3 Chrome, badge Chrome Fragment",
    "ai": "Defensive",
    "team": [
      {
        "speciesId": "034",
        "level": 70
      },
      {
        "speciesId": "006",
        "level": 70
      },
      {
        "speciesId": "023",
        "level": 71
      }
    ],
    "reward": 3200
  },
  {
    "id": "R3-023",
    "trainer": "Acolyte \u2014 Ash",
    "location": "Dojo 4 Flame, Lavaridge",
    "ai": "Type-aware",
    "team": [
      {
        "speciesId": "011",
        "level": 70
      }
    ],
    "reward": 1600
  },
  {
    "id": "R3-024",
    "trainer": "Acolyte \u2014 Coal",
    "location": "Dojo 4 Flame, Lavaridge",
    "ai": "Type-aware",
    "team": [
      {
        "speciesId": "044",
        "level": 71
      },
      {
        "speciesId": "010",
        "level": 71
      }
    ],
    "reward": 1650
  },
  {
    "id": "R3-025",
    "trainer": "Dojo Leader \u2014 [NAME GAP: Lavaridge]",
    "location": "Dojo 4 Flame, badge Flame Fragment",
    "ai": "Aggressive",
    "team": [
      {
        "speciesId": "012",
        "level": 72
      },
      {
        "speciesId": "045",
        "level": 72
      },
      {
        "speciesId": "046",
        "level": 73
      }
    ],
    "reward": 3400
  },
  {
    "id": "R3-026",
    "trainer": "Acolyte \u2014 Pup",
    "location": "Dojo 5 Beast, Petalburg",
    "ai": "Type-aware",
    "team": [
      {
        "speciesId": "013",
        "level": 72
      }
    ],
    "reward": 1700
  },
  {
    "id": "R3-027",
    "trainer": "Acolyte \u2014 Howl",
    "location": "Dojo 5 Beast, Petalburg",
    "ai": "Type-aware",
    "team": [
      {
        "speciesId": "014",
        "level": 73
      },
      {
        "speciesId": "010",
        "level": 73
      }
    ],
    "reward": 1750
  },
  {
    "id": "R3-028",
    "trainer": "Dojo Leader \u2014 [NAME GAP: Petalburg]",
    "location": "Dojo 5 Beast, badge Beast Fragment",
    "ai": "Balanced",
    "team": [
      {
        "speciesId": "015",
        "level": 74
      },
      {
        "speciesId": "012",
        "level": 74
      },
      {
        "speciesId": "011",
        "level": 75
      }
    ],
    "reward": 3600
  },
  {
    "id": "R3-029",
    "trainer": "Acolyte \u2014 Feather",
    "location": "Dojo 6 Aero, Fortree",
    "ai": "Type-aware",
    "team": [
      {
        "speciesId": "019",
        "level": 74
      }
    ],
    "reward": 1800
  },
  {
    "id": "R3-030",
    "trainer": "Acolyte \u2014 Gale",
    "location": "Dojo 6 Aero, Fortree",
    "ai": "Type-aware",
    "team": [
      {
        "speciesId": "020",
        "level": 75
      },
      {
        "speciesId": "019",
        "level": 75
      }
    ],
    "reward": 1850
  },
  {
    "id": "R3-031",
    "trainer": "Dojo Leader \u2014 [NAME GAP: Fortree]",
    "location": "Dojo 6 Aero, badge Aero Fragment",
    "ai": "Type-aware",
    "team": [
      {
        "speciesId": "021",
        "level": 76
      },
      {
        "speciesId": "020",
        "level": 76
      },
      {
        "speciesId": "003",
        "level": 77
      }
    ],
    "reward": 3800
  },
  {
    "id": "R3-032",
    "trainer": "Acolyte \u2014 Star",
    "location": "Dojo 7 Mythic, Mossdeep",
    "ai": "Type-aware",
    "team": [
      {
        "speciesId": "002",
        "level": 76
      }
    ],
    "reward": 1900
  },
  {
    "id": "R3-033",
    "trainer": "Acolyte \u2014 Comet",
    "location": "Dojo 7 Mythic, Mossdeep",
    "ai": "Type-aware",
    "team": [
      {
        "speciesId": "044",
        "level": 77
      },
      {
        "speciesId": "002",
        "level": 77
      }
    ],
    "reward": 1950
  },
  {
    "id": "R3-034",
    "trainer": "Dojo Leader \u2014 [NAME GAP: Mossdeep]",
    "location": "Dojo 7 Mythic, badge Mythic Fragment",
    "ai": "Elite",
    "team": [
      {
        "speciesId": "003",
        "level": 78
      },
      {
        "speciesId": "046",
        "level": 78
      },
      {
        "speciesId": "002",
        "level": 79
      }
    ],
    "reward": 4500
  },
  {
    "id": "R3-035",
    "trainer": "Acolyte \u2014 Deep",
    "location": "Dojo 8 Water, Sootopolis",
    "ai": "Type-aware",
    "team": [
      {
        "speciesId": "022",
        "level": 78
      }
    ],
    "reward": 2000
  },
  {
    "id": "R3-036",
    "trainer": "Acolyte \u2014 Tide",
    "location": "Dojo 8 Water, Sootopolis",
    "ai": "Type-aware",
    "team": [
      {
        "speciesId": "023",
        "level": 79
      },
      {
        "speciesId": "026",
        "level": 79
      }
    ],
    "reward": 2050
  },
  {
    "id": "R3-037",
    "trainer": "Dojo Leader \u2014 [NAME GAP: Sootopolis]",
    "location": "Dojo 8 Water, badge Water Fragment, tech Deep-Dive",
    "ai": "Defensive",
    "team": [
      {
        "speciesId": "025",
        "level": 80
      },
      {
        "speciesId": "028",
        "level": 80
      },
      {
        "speciesId": "003",
        "level": 81
      }
    ],
    "reward": 4700
  },
  {
    "id": "R3-038",
    "trainer": "Elite Four 1 \u2014 [NAME GAP] Water",
    "location": "League R3",
    "ai": "Elite",
    "team": [
      {
        "speciesId": "025",
        "level": 81
      },
      {
        "speciesId": "028",
        "level": 81
      },
      {
        "speciesId": "003",
        "level": 82
      }
    ],
    "reward": 6000
  },
  {
    "id": "R3-039",
    "trainer": "Elite Four 2 \u2014 [NAME GAP] Core",
    "location": "League R3",
    "ai": "Elite",
    "team": [
      {
        "speciesId": "009",
        "level": 82
      },
      {
        "speciesId": "036",
        "level": 82
      },
      {
        "speciesId": "015",
        "level": 83
      }
    ],
    "reward": 6500
  },
  {
    "id": "R3-040",
    "trainer": "Elite Four 3 \u2014 [NAME GAP] Flame",
    "location": "League R3",
    "ai": "Elite",
    "team": [
      {
        "speciesId": "046",
        "level": 83
      },
      {
        "speciesId": "012",
        "level": 83
      },
      {
        "speciesId": "045",
        "level": 84
      }
    ],
    "reward": 7000
  },
  {
    "id": "R3-041",
    "trainer": "Elite Four 4 \u2014 [NAME GAP] Umbral",
    "location": "League R3",
    "ai": "Elite",
    "team": [
      {
        "speciesId": "043",
        "level": 84
      },
      {
        "speciesId": "028",
        "level": 84
      },
      {
        "speciesId": "009",
        "level": 85
      }
    ],
    "reward": 7500
  },
  {
    "id": "R3-042",
    "trainer": "Champion \u2014 [NAME GAP: Region 3]",
    "location": "League R3",
    "ai": "Elite",
    "team": [
      {
        "speciesId": "003",
        "level": 86
      },
      {
        "speciesId": "006",
        "level": 86
      },
      {
        "speciesId": "012",
        "level": 86
      },
      {
        "speciesId": "009",
        "level": 87
      },
      {
        "speciesId": "021",
        "level": 87
      },
      {
        "speciesId": "046",
        "level": 87
      }
    ],
    "reward": 12000
  },
  {
    "id": "R3-043",
    "trainer": "Frontier Brain \u2014 Singles",
    "location": "Frontier Arena 1",
    "ai": "Elite",
    "team": [
      {
        "speciesId": "006",
        "level": 85
      },
      {
        "speciesId": "003",
        "level": 85
      },
      {
        "speciesId": "012",
        "level": 86
      }
    ],
    "reward": 4000
  },
  {
    "id": "R3-044",
    "trainer": "Frontier Brain \u2014 Doubles",
    "location": "Frontier Arena 2",
    "ai": "Elite",
    "team": [
      {
        "speciesId": "021",
        "level": 86
      },
      {
        "speciesId": "028",
        "level": 86
      },
      {
        "speciesId": "015",
        "level": 87
      }
    ],
    "reward": 4200
  },
  {
    "id": "R3-045",
    "trainer": "Frontier Brain \u2014 Rental",
    "location": "Frontier Arena 3",
    "ai": "Elite",
    "team": [
      {
        "speciesId": "009",
        "level": 87
      },
      {
        "speciesId": "046",
        "level": 87
      },
      {
        "speciesId": "002",
        "level": 88
      }
    ],
    "reward": 4400
  },
  {
    "id": "R3-046",
    "trainer": "Frontier Brain \u2014 Streak",
    "location": "Frontier Arena 4",
    "ai": "Elite",
    "team": [
      {
        "speciesId": "003",
        "level": 88
      },
      {
        "speciesId": "006",
        "level": 88
      },
      {
        "speciesId": "012",
        "level": 89
      }
    ],
    "reward": 4600
  },
  {
    "id": "R4-001",
    "trainer": "Route Trainer \u2014 Wren",
    "location": "Sandgem Route",
    "ai": "Balanced",
    "team": [
      {
        "speciesId": "041",
        "level": 78
      },
      {
        "speciesId": "019",
        "level": 78
      }
    ],
    "reward": 1900
  },
  {
    "id": "R4-002",
    "trainer": "Route Trainer \u2014 Holt",
    "location": "Sandgem Route",
    "ai": "Balanced",
    "team": [
      {
        "speciesId": "013",
        "level": 79
      },
      {
        "speciesId": "022",
        "level": 79
      }
    ],
    "reward": 1950
  },
  {
    "id": "R4-003",
    "trainer": "Flower Walker \u2014 Petal",
    "location": "Floaroma Valley",
    "ai": "Balanced",
    "team": [
      {
        "speciesId": "038",
        "level": 80
      },
      {
        "speciesId": "041",
        "level": 80
      }
    ],
    "reward": 2000
  },
  {
    "id": "R4-004",
    "trainer": "Rift Watcher \u2014 Crag",
    "location": "Floaroma Valley",
    "ai": "Type-aware",
    "team": [
      {
        "speciesId": "042",
        "level": 81
      },
      {
        "speciesId": "035",
        "level": 81
      }
    ],
    "reward": 2050
  },
  {
    "id": "R4-005",
    "trainer": "Lore Keeper \u2014 Ora",
    "location": "Celestic Town",
    "ai": "Type-aware",
    "team": [
      {
        "speciesId": "043",
        "level": 84
      },
      {
        "speciesId": "002",
        "level": 84
      }
    ],
    "reward": 2200
  },
  {
    "id": "R4-006",
    "trainer": "Cave Painter \u2014 Rune",
    "location": "Celestic Town",
    "ai": "Type-aware",
    "team": [
      {
        "speciesId": "009",
        "level": 85
      },
      {
        "speciesId": "042",
        "level": 85
      }
    ],
    "reward": 2250
  },
  {
    "id": "R4-007",
    "trainer": "Veteran \u2014 Slate",
    "location": "Victory Route R4",
    "ai": "Aggressive",
    "team": [
      {
        "speciesId": "006",
        "level": 88
      },
      {
        "speciesId": "015",
        "level": 88
      }
    ],
    "reward": 2300
  },
  {
    "id": "R4-008",
    "trainer": "Veteran \u2014 Tempest",
    "location": "Victory Route R4",
    "ai": "Aggressive",
    "team": [
      {
        "speciesId": "021",
        "level": 89
      },
      {
        "speciesId": "028",
        "level": 89
      }
    ],
    "reward": 2350
  },
  {
    "id": "R4-009",
    "trainer": "Veteran \u2014 Onyx",
    "location": "Victory Route R4",
    "ai": "Aggressive",
    "team": [
      {
        "speciesId": "003",
        "level": 90
      },
      {
        "speciesId": "046",
        "level": 90
      }
    ],
    "reward": 2400
  },
  {
    "id": "R4-010",
    "trainer": "Veteran \u2014 Fable",
    "location": "Victory Route R4",
    "ai": "Aggressive",
    "team": [
      {
        "speciesId": "012",
        "level": 91
      },
      {
        "speciesId": "009",
        "level": 91
      }
    ],
    "reward": 2450
  },
  {
    "id": "R4-011",
    "trainer": "Battle Zone \u2014 [NAME GAP]",
    "location": "Battle Zone 1",
    "ai": "Elite",
    "team": [
      {
        "speciesId": "015",
        "level": 98
      },
      {
        "speciesId": "006",
        "level": 98
      },
      {
        "speciesId": "003",
        "level": 99
      }
    ],
    "reward": 4500
  },
  {
    "id": "R4-012",
    "trainer": "Battle Zone \u2014 [NAME GAP]",
    "location": "Battle Zone 2",
    "ai": "Elite",
    "team": [
      {
        "speciesId": "028",
        "level": 99
      },
      {
        "speciesId": "046",
        "level": 99
      },
      {
        "speciesId": "021",
        "level": 100
      }
    ],
    "reward": 4700
  },
  {
    "id": "R4-013",
    "trainer": "Battle Zone \u2014 [NAME GAP]",
    "location": "Battle Zone 3",
    "ai": "Elite",
    "team": [
      {
        "speciesId": "009",
        "level": 100
      },
      {
        "speciesId": "012",
        "level": 100
      },
      {
        "speciesId": "002",
        "level": 100
      }
    ],
    "reward": 4900
  },
  {
    "id": "R4-014",
    "trainer": "Rift Warden \u2014 [NAME GAP]",
    "location": "Umbral Rift Dungeon",
    "ai": "Elite",
    "team": [
      {
        "speciesId": "043",
        "level": 100
      },
      {
        "speciesId": "028",
        "level": 100
      },
      {
        "speciesId": "009",
        "level": 100
      },
      {
        "speciesId": "042",
        "level": 100
      }
    ],
    "reward": 6000
  },
  {
    "id": "R4-015",
    "trainer": "Acolyte \u2014 Pick",
    "location": "Dojo 1 Core, Oreburgh",
    "ai": "Type-aware",
    "team": [
      {
        "speciesId": "007",
        "level": 80
      }
    ],
    "reward": 2000
  },
  {
    "id": "R4-016",
    "trainer": "Acolyte \u2014 Shaft",
    "location": "Dojo 1 Core, Oreburgh",
    "ai": "Type-aware",
    "team": [
      {
        "speciesId": "035",
        "level": 81
      },
      {
        "speciesId": "013",
        "level": 81
      }
    ],
    "reward": 2050
  },
  {
    "id": "R4-017",
    "trainer": "Dojo Leader \u2014 [NAME GAP: Oreburgh]",
    "location": "Dojo 1 Core, badge Core Fragment",
    "ai": "Defensive",
    "team": [
      {
        "speciesId": "036",
        "level": 82
      },
      {
        "speciesId": "015",
        "level": 82
      },
      {
        "speciesId": "009",
        "level": 83
      }
    ],
    "reward": 3500
  },
  {
    "id": "R4-018",
    "trainer": "Acolyte \u2014 Bloom",
    "location": "Dojo 2 Flora, Eterna",
    "ai": "Type-aware",
    "team": [
      {
        "speciesId": "038",
        "level": 82
      }
    ],
    "reward": 2100
  },
  {
    "id": "R4-019",
    "trainer": "Acolyte \u2014 Vine",
    "location": "Dojo 2 Flora, Eterna",
    "ai": "Type-aware",
    "team": [
      {
        "speciesId": "041",
        "level": 83
      },
      {
        "speciesId": "039",
        "level": 83
      }
    ],
    "reward": 2150
  },
  {
    "id": "R4-020",
    "trainer": "Dojo Leader \u2014 [NAME GAP: Eterna]",
    "location": "Dojo 2 Flora, badge Flora Fragment",
    "ai": "Defensive",
    "team": [
      {
        "speciesId": "040",
        "level": 84
      },
      {
        "speciesId": "039",
        "level": 84
      },
      {
        "speciesId": "041",
        "level": 85
      }
    ],
    "reward": 3700
  },
  {
    "id": "R4-021",
    "trainer": "Acolyte \u2014 Veil",
    "location": "Dojo 3 Umbral, Hearthome",
    "ai": "Type-aware",
    "team": [
      {
        "speciesId": "042",
        "level": 84
      }
    ],
    "reward": 2200
  },
  {
    "id": "R4-022",
    "trainer": "Acolyte \u2014 Gloom",
    "location": "Dojo 3 Umbral, Hearthome",
    "ai": "Type-aware",
    "team": [
      {
        "speciesId": "043",
        "level": 85
      },
      {
        "speciesId": "026",
        "level": 85
      }
    ],
    "reward": 2250
  },
  {
    "id": "R4-023",
    "trainer": "Dojo Leader \u2014 [NAME GAP: Hearthome]",
    "location": "Dojo 3 Umbral, badge Umbral Fragment",
    "ai": "Defensive",
    "team": [
      {
        "speciesId": "043",
        "level": 86
      },
      {
        "speciesId": "028",
        "level": 86
      },
      {
        "speciesId": "009",
        "level": 87
      }
    ],
    "reward": 3900
  },
  {
    "id": "R4-024",
    "trainer": "Acolyte \u2014 Jab",
    "location": "Dojo 4 Strike, Veilstone",
    "ai": "Type-aware",
    "team": [
      {
        "speciesId": "029",
        "level": 86
      }
    ],
    "reward": 2300
  },
  {
    "id": "R4-025",
    "trainer": "Acolyte \u2014 Cross",
    "location": "Dojo 4 Strike, Veilstone",
    "ai": "Type-aware",
    "team": [
      {
        "speciesId": "030",
        "level": 87
      },
      {
        "speciesId": "029",
        "level": 87
      }
    ],
    "reward": 2350
  },
  {
    "id": "R4-026",
    "trainer": "Dojo Leader \u2014 [NAME GAP: Veilstone]",
    "location": "Dojo 4 Strike, badge Strike Fragment",
    "ai": "Aggressive",
    "team": [
      {
        "speciesId": "031",
        "level": 88
      },
      {
        "speciesId": "015",
        "level": 88
      },
      {
        "speciesId": "030",
        "level": 89
      }
    ],
    "reward": 4100
  },
  {
    "id": "R4-027",
    "trainer": "Acolyte \u2014 Brook",
    "location": "Dojo 5 Water, Pastoria",
    "ai": "Type-aware",
    "team": [
      {
        "speciesId": "022",
        "level": 88
      }
    ],
    "reward": 2400
  },
  {
    "id": "R4-028",
    "trainer": "Acolyte \u2014 Marsh",
    "location": "Dojo 5 Water, Pastoria",
    "ai": "Type-aware",
    "team": [
      {
        "speciesId": "023",
        "level": 89
      },
      {
        "speciesId": "024",
        "level": 89
      }
    ],
    "reward": 2450
  },
  {
    "id": "R4-029",
    "trainer": "Dojo Leader \u2014 [NAME GAP: Pastoria]",
    "location": "Dojo 5 Water, badge Water Fragment",
    "ai": "Defensive",
    "team": [
      {
        "speciesId": "025",
        "level": 90
      },
      {
        "speciesId": "003",
        "level": 90
      },
      {
        "speciesId": "028",
        "level": 91
      }
    ],
    "reward": 4300
  },
  {
    "id": "R4-030",
    "trainer": "Acolyte \u2014 Gear",
    "location": "Dojo 6 Chrome, Canalave",
    "ai": "Type-aware",
    "team": [
      {
        "speciesId": "032",
        "level": 90
      }
    ],
    "reward": 2500
  },
  {
    "id": "R4-031",
    "trainer": "Acolyte \u2014 Plate",
    "location": "Dojo 6 Chrome, Canalave",
    "ai": "Type-aware",
    "team": [
      {
        "speciesId": "033",
        "level": 91
      },
      {
        "speciesId": "005",
        "level": 91
      }
    ],
    "reward": 2550
  },
  {
    "id": "R4-032",
    "trainer": "Dojo Leader \u2014 [NAME GAP: Canalave]",
    "location": "Dojo 6 Chrome, badge Chrome Fragment",
    "ai": "Defensive",
    "team": [
      {
        "speciesId": "034",
        "level": 92
      },
      {
        "speciesId": "006",
        "level": 92
      },
      {
        "speciesId": "023",
        "level": 93
      }
    ],
    "reward": 4500
  },
  {
    "id": "R4-033",
    "trainer": "Acolyte \u2014 Frost",
    "location": "Dojo 7 Water-ice, Snowpoint",
    "ai": "Type-aware",
    "team": [
      {
        "speciesId": "024",
        "level": 92
      }
    ],
    "reward": 2600
  },
  {
    "id": "R4-034",
    "trainer": "Acolyte \u2014 Glace",
    "location": "Dojo 7 Water-ice, Snowpoint",
    "ai": "Type-aware",
    "team": [
      {
        "speciesId": "025",
        "level": 93
      },
      {
        "speciesId": "022",
        "level": 93
      }
    ],
    "reward": 2650
  },
  {
    "id": "R4-035",
    "trainer": "Dojo Leader \u2014 [NAME GAP: Snowpoint]",
    "location": "Dojo 7 Water-ice, badge Ice Fragment (Water theme)",
    "ai": "Defensive",
    "team": [
      {
        "speciesId": "025",
        "level": 94
      },
      {
        "speciesId": "003",
        "level": 94
      },
      {
        "speciesId": "028",
        "level": 95
      }
    ],
    "reward": 4700
  },
  {
    "id": "R4-036",
    "trainer": "Acolyte \u2014 Solar",
    "location": "Dojo 8 Chrome, Sunyshore",
    "ai": "Type-aware",
    "team": [
      {
        "speciesId": "033",
        "level": 94
      }
    ],
    "reward": 2700
  },
  {
    "id": "R4-037",
    "trainer": "Acolyte \u2014 Volt",
    "location": "Dojo 8 Chrome, Sunyshore",
    "ai": "Type-aware",
    "team": [
      {
        "speciesId": "034",
        "level": 95
      },
      {
        "speciesId": "006",
        "level": 95
      }
    ],
    "reward": 2750
  },
  {
    "id": "R4-038",
    "trainer": "Dojo Leader \u2014 [NAME GAP: Sunyshore]",
    "location": "Dojo 8 Chrome, badge Solar Fragment",
    "ai": "Aggressive",
    "team": [
      {
        "speciesId": "034",
        "level": 96
      },
      {
        "speciesId": "006",
        "level": 96
      },
      {
        "speciesId": "023",
        "level": 97
      }
    ],
    "reward": 4900
  },
  {
    "id": "R4-039",
    "trainer": "Elite Four 1 \u2014 [NAME GAP] Chrome",
    "location": "League R4",
    "ai": "Elite",
    "team": [
      {
        "speciesId": "006",
        "level": 96
      },
      {
        "speciesId": "034",
        "level": 96
      },
      {
        "speciesId": "023",
        "level": 97
      }
    ],
    "reward": 7000
  },
  {
    "id": "R4-040",
    "trainer": "Elite Four 2 \u2014 [NAME GAP] Water",
    "location": "League R4",
    "ai": "Elite",
    "team": [
      {
        "speciesId": "025",
        "level": 97
      },
      {
        "speciesId": "028",
        "level": 97
      },
      {
        "speciesId": "003",
        "level": 98
      }
    ],
    "reward": 7500
  },
  {
    "id": "R4-041",
    "trainer": "Elite Four 3 \u2014 [NAME GAP] Umbral",
    "location": "League R4",
    "ai": "Elite",
    "team": [
      {
        "speciesId": "043",
        "level": 98
      },
      {
        "speciesId": "028",
        "level": 98
      },
      {
        "speciesId": "009",
        "level": 99
      }
    ],
    "reward": 8000
  },
  {
    "id": "R4-042",
    "trainer": "Elite Four 4 \u2014 [NAME GAP] Mythic",
    "location": "League R4",
    "ai": "Elite",
    "team": [
      {
        "speciesId": "046",
        "level": 99
      },
      {
        "speciesId": "002",
        "level": 99
      },
      {
        "speciesId": "003",
        "level": 99
      }
    ],
    "reward": 8500
  },
  {
    "id": "R4-043",
    "trainer": "Champion \u2014 [NAME GAP: Region 4]",
    "location": "League R4",
    "ai": "Elite",
    "team": [
      {
        "speciesId": "003",
        "level": 99
      },
      {
        "speciesId": "006",
        "level": 99
      },
      {
        "speciesId": "012",
        "level": 99
      },
      {
        "speciesId": "009",
        "level": 100
      },
      {
        "speciesId": "021",
        "level": 100
      },
      {
        "speciesId": "046",
        "level": 100
      }
    ],
    "reward": 13000
  },
  {
    "id": "R5-001",
    "trainer": "Route Trainer \u2014 Vale",
    "location": "Start City Route",
    "ai": "Balanced",
    "team": [
      {
        "speciesId": "013",
        "level": 88
      },
      {
        "speciesId": "038",
        "level": 88
      }
    ],
    "reward": 2200
  },
  {
    "id": "R5-002",
    "trainer": "Route Trainer \u2014 Noa",
    "location": "Start City Route",
    "ai": "Balanced",
    "team": [
      {
        "speciesId": "019",
        "level": 89
      },
      {
        "speciesId": "022",
        "level": 89
      }
    ],
    "reward": 2250
  },
  {
    "id": "R5-003",
    "trainer": "Front Recruit \u2014 Lumen",
    "location": "Castelia Rally",
    "ai": "Type-aware",
    "team": [
      {
        "speciesId": "042",
        "level": 92
      },
      {
        "speciesId": "010",
        "level": 92
      }
    ],
    "reward": 2400
  },
  {
    "id": "R5-004",
    "trainer": "Front Recruit \u2014 Shade",
    "location": "Castelia Rally",
    "ai": "Type-aware",
    "team": [
      {
        "speciesId": "043",
        "level": 93
      },
      {
        "speciesId": "026",
        "level": 93
      }
    ],
    "reward": 2450
  },
  {
    "id": "R5-005",
    "trainer": "Veteran \u2014 Rook",
    "location": "Victory Route R5",
    "ai": "Aggressive",
    "team": [
      {
        "speciesId": "006",
        "level": 96
      },
      {
        "speciesId": "015",
        "level": 96
      }
    ],
    "reward": 2600
  },
  {
    "id": "R5-006",
    "trainer": "Veteran \u2014 Storm",
    "location": "Victory Route R5",
    "ai": "Aggressive",
    "team": [
      {
        "speciesId": "021",
        "level": 97
      },
      {
        "speciesId": "028",
        "level": 97
      }
    ],
    "reward": 2650
  },
  {
    "id": "R5-007",
    "trainer": "Veteran \u2014 Ash",
    "location": "Victory Route R5",
    "ai": "Aggressive",
    "team": [
      {
        "speciesId": "012",
        "level": 97
      },
      {
        "speciesId": "046",
        "level": 97
      }
    ],
    "reward": 2700
  },
  {
    "id": "R5-008",
    "trainer": "Veteran \u2014 Terra",
    "location": "Victory Route R5",
    "ai": "Aggressive",
    "team": [
      {
        "speciesId": "009",
        "level": 98
      },
      {
        "speciesId": "003",
        "level": 98
      }
    ],
    "reward": 2750
  },
  {
    "id": "R5-009",
    "trainer": "Veteran \u2014 Myth",
    "location": "Victory Route R5",
    "ai": "Aggressive",
    "team": [
      {
        "speciesId": "002",
        "level": 98
      },
      {
        "speciesId": "043",
        "level": 98
      }
    ],
    "reward": 2800
  },
  {
    "id": "R5-010",
    "trainer": "Acolyte \u2014 Pup",
    "location": "Dojo 1 Beast, Floccesy",
    "ai": "Type-aware",
    "team": [
      {
        "speciesId": "013",
        "level": 89
      }
    ],
    "reward": 2300
  },
  {
    "id": "R5-011",
    "trainer": "Acolyte \u2014 Cub",
    "location": "Dojo 1 Beast, Floccesy",
    "ai": "Type-aware",
    "team": [
      {
        "speciesId": "014",
        "level": 90
      },
      {
        "speciesId": "010",
        "level": 90
      }
    ],
    "reward": 2350
  },
  {
    "id": "R5-012",
    "trainer": "Hex \u2014 Dojo Leader",
    "location": "Dojo 1 Beast, Floccesy, badge Beast Fragment",
    "ai": "Elite",
    "team": [
      {
        "speciesId": "006",
        "level": 91
      },
      {
        "speciesId": "009",
        "level": 91
      },
      {
        "speciesId": "012",
        "level": 91
      },
      {
        "speciesId": "015",
        "level": 92
      }
    ],
    "reward": 5000
  },
  {
    "id": "R5-013",
    "trainer": "Acolyte \u2014 Spark",
    "location": "Dojo 2 Flame, Virbank",
    "ai": "Type-aware",
    "team": [
      {
        "speciesId": "010",
        "level": 91
      }
    ],
    "reward": 2400
  },
  {
    "id": "R5-014",
    "trainer": "Acolyte \u2014 Reel",
    "location": "Dojo 2 Flame, Virbank",
    "ai": "Type-aware",
    "team": [
      {
        "speciesId": "011",
        "level": 92
      },
      {
        "speciesId": "044",
        "level": 92
      }
    ],
    "reward": 2450
  },
  {
    "id": "R5-015",
    "trainer": "Dojo Leader \u2014 [NAME GAP: Virbank]",
    "location": "Dojo 2 Flame, badge Flame Fragment",
    "ai": "Aggressive",
    "team": [
      {
        "speciesId": "012",
        "level": 93
      },
      {
        "speciesId": "045",
        "level": 93
      },
      {
        "speciesId": "046",
        "level": 94
      }
    ],
    "reward": 5200
  },
  {
    "id": "R5-016",
    "trainer": "Acolyte \u2014 Wire",
    "location": "Dojo 3 Chrome, Castelia",
    "ai": "Type-aware",
    "team": [
      {
        "speciesId": "032",
        "level": 93
      }
    ],
    "reward": 2500
  },
  {
    "id": "R5-017",
    "trainer": "Acolyte \u2014 Mesh",
    "location": "Dojo 3 Chrome, Castelia",
    "ai": "Type-aware",
    "team": [
      {
        "speciesId": "033",
        "level": 94
      },
      {
        "speciesId": "005",
        "level": 94
      }
    ],
    "reward": 2550
  },
  {
    "id": "R5-018",
    "trainer": "Dojo Leader \u2014 [NAME GAP: Castelia]",
    "location": "Dojo 3 Chrome, badge Chrome Fragment",
    "ai": "Defensive",
    "team": [
      {
        "speciesId": "034",
        "level": 95
      },
      {
        "speciesId": "006",
        "level": 95
      },
      {
        "speciesId": "023",
        "level": 96
      }
    ],
    "reward": 5400
  },
  {
    "id": "R5-019",
    "trainer": "Acolyte \u2014 Sprint",
    "location": "Dojo 4 Strike, Nimbasa",
    "ai": "Type-aware",
    "team": [
      {
        "speciesId": "029",
        "level": 95
      }
    ],
    "reward": 2600
  },
  {
    "id": "R5-020",
    "trainer": "Acolyte \u2014 Vault",
    "location": "Dojo 4 Strike, Nimbasa",
    "ai": "Type-aware",
    "team": [
      {
        "speciesId": "030",
        "level": 96
      },
      {
        "speciesId": "029",
        "level": 96
      }
    ],
    "reward": 2650
  },
  {
    "id": "R5-021",
    "trainer": "Dojo Leader \u2014 [NAME GAP: Nimbasa]",
    "location": "Dojo 4 Strike, badge Strike Fragment",
    "ai": "Aggressive",
    "team": [
      {
        "speciesId": "031",
        "level": 97
      },
      {
        "speciesId": "015",
        "level": 97
      },
      {
        "speciesId": "030",
        "level": 98
      }
    ],
    "reward": 5600
  },
  {
    "id": "R5-022",
    "trainer": "Acolyte \u2014 Ore",
    "location": "Dojo 5 Core, Driftveil",
    "ai": "Type-aware",
    "team": [
      {
        "speciesId": "007",
        "level": 96
      }
    ],
    "reward": 2700
  },
  {
    "id": "R5-023",
    "trainer": "Acolyte \u2014 Vein",
    "location": "Dojo 5 Core, Driftveil",
    "ai": "Type-aware",
    "team": [
      {
        "speciesId": "035",
        "level": 97
      },
      {
        "speciesId": "013",
        "level": 97
      }
    ],
    "reward": 2750
  },
  {
    "id": "R5-024",
    "trainer": "Dojo Leader \u2014 [NAME GAP: Driftveil]",
    "location": "Dojo 5 Core, badge Core Fragment",
    "ai": "Defensive",
    "team": [
      {
        "speciesId": "036",
        "level": 98
      },
      {
        "speciesId": "015",
        "level": 98
      },
      {
        "speciesId": "009",
        "level": 99
      }
    ],
    "reward": 5800
  },
  {
    "id": "R5-025",
    "trainer": "Acolyte \u2014 Wind",
    "location": "Dojo 6 Aero, Mistralton",
    "ai": "Type-aware",
    "team": [
      {
        "speciesId": "019",
        "level": 97
      }
    ],
    "reward": 2800
  },
  {
    "id": "R5-026",
    "trainer": "Acolyte \u2014 Cloud",
    "location": "Dojo 6 Aero, Mistralton",
    "ai": "Type-aware",
    "team": [
      {
        "speciesId": "020",
        "level": 98
      },
      {
        "speciesId": "019",
        "level": 98
      }
    ],
    "reward": 2850
  },
  {
    "id": "R5-027",
    "trainer": "Dojo Leader \u2014 [NAME GAP: Mistralton]",
    "location": "Dojo 6 Aero, badge Aero Fragment",
    "ai": "Type-aware",
    "team": [
      {
        "speciesId": "021",
        "level": 99
      },
      {
        "speciesId": "020",
        "level": 99
      },
      {
        "speciesId": "003",
        "level": 100
      }
    ],
    "reward": 6000
  },
  {
    "id": "R5-028",
    "trainer": "Acolyte \u2014 Chill",
    "location": "Dojo 7 Water-ice, Icirrus",
    "ai": "Type-aware",
    "team": [
      {
        "speciesId": "024",
        "level": 98
      }
    ],
    "reward": 2900
  },
  {
    "id": "R5-029",
    "trainer": "Acolyte \u2014 Frost",
    "location": "Dojo 7 Water-ice, Icirrus",
    "ai": "Type-aware",
    "team": [
      {
        "speciesId": "025",
        "level": 99
      },
      {
        "speciesId": "022",
        "level": 99
      }
    ],
    "reward": 2950
  },
  {
    "id": "R5-030",
    "trainer": "Dojo Leader \u2014 [NAME GAP: Icirrus]",
    "location": "Dojo 7 Water-ice, badge Ice Fragment (Water theme)",
    "ai": "Defensive",
    "team": [
      {
        "speciesId": "025",
        "level": 100
      },
      {
        "speciesId": "003",
        "level": 100
      },
      {
        "speciesId": "028",
        "level": 100
      }
    ],
    "reward": 6200
  },
  {
    "id": "R5-031",
    "trainer": "Acolyte \u2014 Rune",
    "location": "Dojo 8 Mythic, Opelucid",
    "ai": "Type-aware",
    "team": [
      {
        "speciesId": "002",
        "level": 99
      }
    ],
    "reward": 3000
  },
  {
    "id": "R5-032",
    "trainer": "Acolyte \u2014 Saga",
    "location": "Dojo 8 Mythic, Opelucid",
    "ai": "Type-aware",
    "team": [
      {
        "speciesId": "044",
        "level": 100
      },
      {
        "speciesId": "002",
        "level": 100
      }
    ],
    "reward": 3050
  },
  {
    "id": "R5-033",
    "trainer": "Dojo Leader \u2014 [NAME GAP: Opelucid]",
    "location": "Dojo 8 Mythic, badge Mythic Fragment",
    "ai": "Elite",
    "team": [
      {
        "speciesId": "003",
        "level": 100
      },
      {
        "speciesId": "046",
        "level": 100
      },
      {
        "speciesId": "002",
        "level": 100
      },
      {
        "speciesId": "043",
        "level": 100
      }
    ],
    "reward": 6500
  },
  {
    "id": "R5-034",
    "trainer": "Elite Four 1 \u2014 [NAME GAP] Aero",
    "location": "League R5",
    "ai": "Elite",
    "team": [
      {
        "speciesId": "021",
        "level": 100
      },
      {
        "speciesId": "020",
        "level": 100
      },
      {
        "speciesId": "003",
        "level": 100
      }
    ],
    "reward": 8000
  },
  {
    "id": "R5-035",
    "trainer": "Elite Four 2 \u2014 [NAME GAP] Core",
    "location": "League R5",
    "ai": "Elite",
    "team": [
      {
        "speciesId": "009",
        "level": 100
      },
      {
        "speciesId": "036",
        "level": 100
      },
      {
        "speciesId": "015",
        "level": 100
      }
    ],
    "reward": 8500
  },
  {
    "id": "R5-036",
    "trainer": "Elite Four 3 \u2014 [NAME GAP] Flame",
    "location": "League R5",
    "ai": "Elite",
    "team": [
      {
        "speciesId": "046",
        "level": 100
      },
      {
        "speciesId": "012",
        "level": 100
      },
      {
        "speciesId": "045",
        "level": 100
      }
    ],
    "reward": 9000
  },
  {
    "id": "R5-037",
    "trainer": "Elite Four 4 \u2014 [NAME GAP] Mythic",
    "location": "League R5",
    "ai": "Elite",
    "team": [
      {
        "speciesId": "003",
        "level": 100
      },
      {
        "speciesId": "002",
        "level": 100
      },
      {
        "speciesId": "043",
        "level": 100
      }
    ],
    "reward": 9500
  },
  {
    "id": "R5-038",
    "trainer": "Champion \u2014 [NAME GAP: Region 5]",
    "location": "League R5",
    "ai": "Elite",
    "team": [
      {
        "speciesId": "003",
        "level": 100
      },
      {
        "speciesId": "006",
        "level": 100
      },
      {
        "speciesId": "012",
        "level": 100
      },
      {
        "speciesId": "009",
        "level": 100
      },
      {
        "speciesId": "021",
        "level": 100
      },
      {
        "speciesId": "046",
        "level": 100
      }
    ],
    "reward": 14000
  },
  {
    "id": "R5-039",
    "trainer": "Tournament Round 1 \u2014 [NAME GAP]",
    "location": "Grand Tournament",
    "ai": "Elite",
    "team": [
      {
        "speciesId": "006",
        "level": 100
      },
      {
        "speciesId": "021",
        "level": 100
      },
      {
        "speciesId": "003",
        "level": 100
      }
    ],
    "reward": 5000
  },
  {
    "id": "R5-040",
    "trainer": "Tournament Round 2 \u2014 [NAME GAP]",
    "location": "Grand Tournament",
    "ai": "Elite",
    "team": [
      {
        "speciesId": "009",
        "level": 100
      },
      {
        "speciesId": "012",
        "level": 100
      },
      {
        "speciesId": "028",
        "level": 100
      }
    ],
    "reward": 5500
  },
  {
    "id": "R5-041",
    "trainer": "Tournament Round 3 \u2014 [NAME GAP]",
    "location": "Grand Tournament",
    "ai": "Elite",
    "team": [
      {
        "speciesId": "003",
        "level": 100
      },
      {
        "speciesId": "046",
        "level": 100
      },
      {
        "speciesId": "015",
        "level": 100
      }
    ],
    "reward": 6000
  },
  {
    "id": "R5-042",
    "trainer": "Tournament Quarter \u2014 [NAME GAP]",
    "location": "Grand Tournament",
    "ai": "Elite",
    "team": [
      {
        "speciesId": "006",
        "level": 100
      },
      {
        "speciesId": "003",
        "level": 100
      },
      {
        "speciesId": "012",
        "level": 100
      },
      {
        "speciesId": "021",
        "level": 100
      }
    ],
    "reward": 6500
  },
  {
    "id": "R5-043",
    "trainer": "Tournament Semi \u2014 [NAME GAP]",
    "location": "Grand Tournament",
    "ai": "Elite",
    "team": [
      {
        "speciesId": "009",
        "level": 100
      },
      {
        "speciesId": "046",
        "level": 100
      },
      {
        "speciesId": "002",
        "level": 100
      },
      {
        "speciesId": "043",
        "level": 100
      }
    ],
    "reward": 7000
  },
  {
    "id": "R5-044",
    "trainer": "Tournament Final \u2014 [NAME GAP]",
    "location": "Grand Tournament",
    "ai": "Elite",
    "team": [
      {
        "speciesId": "003",
        "level": 100
      },
      {
        "speciesId": "006",
        "level": 100
      },
      {
        "speciesId": "012",
        "level": 100
      },
      {
        "speciesId": "009",
        "level": 100
      },
      {
        "speciesId": "021",
        "level": 100
      },
      {
        "speciesId": "046",
        "level": 100
      }
    ],
    "reward": 8000
  },
  {
    "id": "R5-045",
    "trainer": "Tower Climber \u2014 Bright Tower",
    "location": "Bright Tower, post-game",
    "ai": "Elite",
    "team": [
      {
        "speciesId": "002",
        "level": 100
      },
      {
        "speciesId": "044",
        "level": 100
      },
      {
        "speciesId": "003",
        "level": 100
      }
    ],
    "reward": 5000
  },
  {
    "id": "R5-046",
    "trainer": "Tower Climber \u2014 Umbral Tower",
    "location": "Umbral Tower, post-game",
    "ai": "Elite",
    "team": [
      {
        "speciesId": "043",
        "level": 100
      },
      {
        "speciesId": "028",
        "level": 100
      },
      {
        "speciesId": "009",
        "level": 100
      }
    ],
    "reward": 5000
  },
  {
    "id": "R5-047",
    "trainer": "Grand Champion Mythar",
    "location": "Mainframe Plateau, final ascent",
    "ai": "Elite",
    "team": [
      {
        "speciesId": "331",
        "level": 100
      },
      {
        "speciesId": "003",
        "level": 100
      },
      {
        "speciesId": "046",
        "level": 100
      },
      {
        "speciesId": "043",
        "level": 100
      },
      {
        "speciesId": "028",
        "level": 100
      },
      {
        "speciesId": "021",
        "level": 100
      }
    ],
    "reward": 20000
  }
];

export function trainerTeamsByRegion(region: string): TrainerRow[] {
  return TRAINER_TEAMS.filter((r) => r.id.startsWith(region + "-"));
}
