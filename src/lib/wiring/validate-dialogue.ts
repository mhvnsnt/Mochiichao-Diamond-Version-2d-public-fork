/**
 * Mochiichao dialogue validator — exit / flag checks for every
 * dialogue JSON on main. Dependency-free so it can run under plain
 * node after a tsc pass as well as from game code / CI.
 *
 * Two shapes are validated (both are read-only inputs here; this
 * file never edits dialogue content):
 *
 * 1. Hand-shaped JSON (src/lib/wiring/dialogue/ink-dialogue-locked-*.json):
 *    { knots: { <knot>: { stitches: { <stitch>: {
 *      lines: [{ speaker, text }], choices?: [{ text, target?, exit? }],
 *      exit?: true, setFlags?: string[] } } } },
 *      flags: string[], superseded_knots?: string[] }
 *    Battle events trigger the event stitches (intro / about_to_win /
 *    defeat / after / mid_battle / first_* / return_* / greeting /
 *    offer / farewell / set_*) directly; the `main` stitch is the
 *    preview/navigation stitch whose choices point at them.
 *
 * 2. Compiled ink JSON (inkVersion + root, e.g. region1-truck-start.json):
 *    knots are the named containers in root; `{"->": name}` diverts
 *    must resolve to a knot (or END); `{"VAR=": name}` writes and
 *    `{"VAR?": name}` reads must be declared in `global decl`.
 *
 * Checks, for every file:
 *  - every exit target resolves (choice target knot+stitch, ink divert)
 *  - every flag read is written somewhere (hand-shaped conditions, ink VAR?)
 *  - every declared flag is written somewhere (no orphan registry entry)
 *  - every stitch/knot is reachable: a `main` stitch, a choice target,
 *    or a known event-stitch name; anything else is reported
 *  - no dead ends: a stitch with neither exit:true nor choices is an error
 *  - no empty lines / choices / missing speakers
 * Superseded knots (file metadata) are WARNINGS, not errors: the old
 * knot is retained for history and its replacement is the live one.
 * Dialogue content itself is never "fixed" here — a locked line is
 * changed only by Mars himself.
 */

export type ValidationIssue = {
  level: "error" | "warning";
  file: string;
  where: string;
  message: string;
};

export type ValidationStats = {
  knots: number;
  stitches: number;
  lines: number;
  choices: number;
  exitChoices: number;
  flagsDeclared: number;
  flagsWritten: number;
  flagsRead: number;
  diverts: number;
  varWrites: number;
  varReads: number;
};

export type ValidationResult = {
  file: string;
  format: "hand-shaped" | "compiled-ink" | "unknown";
  errors: ValidationIssue[];
  warnings: ValidationIssue[];
  stats: ValidationStats;
};

export function emptyStats(): ValidationStats {
  return {
    knots: 0,
    stitches: 0,
    lines: 0,
    choices: 0,
    exitChoices: 0,
    flagsDeclared: 0,
    flagsWritten: 0,
    flagsRead: 0,
    diverts: 0,
    varWrites: 0,
    varReads: 0,
  };
}

/** Event-stitch names the battle / field code triggers directly. */
export const EVENT_STITCH_NAMES = [
  "intro",
  "about_to_win",
  "defeat",
  "after",
  "mid_battle",
  "first_intro",
  "first_about_to_win",
  "first_defeat",
  "first_after",
  "return_intro",
  "return_about_to_win",
  "return_defeat",
  "return_after",
  "greeting",
  "offer",
  "farewell",
] as const;

function isEventStitch(name: string): boolean {
  return (
    (EVENT_STITCH_NAMES as readonly string[]).includes(name) ||
    /^set_\d+$/.test(name)
  );
}

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

/** Collect flag names read by a hand-shaped choice condition, any shape. */
export function flagsReadByCondition(condition: unknown): string[] {
  const out: string[] = [];
  // Only flag-named keys count as reads; other condition payload
  // (e.g. a comparison value) must not false-positive as a flag.
  const FLAG_KEYS = new Set([
    "flag",
    "flags",
    "requiredFlags",
    "requires",
    "all",
    "any",
  ]);
  const walk = (v: unknown): void => {
    if (typeof v === "string") {
      out.push(v);
      return;
    }
    if (Array.isArray(v)) {
      v.forEach(walk);
      return;
    }
    if (isRecord(v)) {
      for (const [k, val] of Object.entries(v)) {
        if (FLAG_KEYS.has(k)) walk(val);
      }
    }
  };
  walk(condition);
  return [...new Set(out)];
}

function validateHandShaped(
  file: string,
  doc: Record<string, unknown>,
): ValidationResult {
  const errors: ValidationIssue[] = [];
  const warnings: ValidationIssue[] = [];
  const stats = emptyStats();
  const err = (where: string, message: string) =>
    errors.push({ level: "error", file, where, message });
  const warn = (where: string, message: string) =>
    warnings.push({ level: "warning", file, where, message });

  const knotsRaw = doc["knots"];
  if (!isRecord(knotsRaw)) {
    err("$", "hand-shaped file has no `knots` object");
    return { file, format: "hand-shaped", errors, warnings, stats };
  }
  const knots = knotsRaw as Record<string, Record<string, unknown>>;
  const knotNames = Object.keys(knots);
  stats.knots = knotNames.length;
  if (knotNames.length === 0) err("$", "no knots defined");

  const declared: string[] = Array.isArray(doc["flags"])
    ? (doc["flags"] as unknown[]).filter(
        (f): f is string => typeof f === "string",
      )
    : [];
  stats.flagsDeclared = declared.length;
  const declaredSet = new Set(declared);

  const superseded: string[] = Array.isArray(doc["superseded_knots"])
    ? (doc["superseded_knots"] as unknown[]).filter(
        (f): f is string => typeof f === "string",
      )
    : [];
  const supersededSet = new Set(superseded);

  const written = new Set<string>();
  const read = new Set<string>();
  const targetedStitches = new Set<string>(); // "knot/stitch"

  for (const knotName of knotNames) {
    const knot = knots[knotName];
    if (!isRecord(knot)) {
      err(knotName, "knot is not an object");
      continue;
    }
    if (supersededSet.has(knotName)) {
      warn(
        knotName,
        "superseded knot retained for history; use its replacement, not this knot, for live play",
      );
    }
    const stitchesRaw = knot["stitches"];
    if (!isRecord(stitchesRaw)) {
      err(`${knotName}`, "knot has no `stitches` object");
      continue;
    }
    const stitches = stitchesRaw as Record<string, Record<string, unknown>>;
    const stitchNames = Object.keys(stitches);
    if (stitchNames.length === 0) err(`${knotName}`, "knot has no stitches");
    for (const stitchName of stitchNames) {
      stats.stitches += 1;
      const where = `${knotName}/${stitchName}`;
      const stitch = stitches[stitchName];
      if (!isRecord(stitch)) {
        err(where, "stitch is not an object");
        continue;
      }
      const lines = stitch["lines"];
      if (!Array.isArray(lines)) {
        err(where, "stitch has no `lines` array");
      } else {
        for (let i = 0; i < lines.length; i++) {
          const line = lines[i];
          if (!isRecord(line)) {
            err(`${where}#${i}`, "line is not a { speaker, text } object");
            continue;
          }
          stats.lines += 1;
          if (typeof line["speaker"] !== "string" || !line["speaker"]) {
            err(`${where}#${i}`, "line has no speaker");
          }
          if (typeof line["text"] !== "string" || !line["text"]) {
            err(`${where}#${i}`, "line has no text");
          }
        }
      }
      const setFlags = stitch["setFlags"];
      if (setFlags !== undefined) {
        if (!Array.isArray(setFlags)) {
          err(where, "`setFlags` is not an array");
        } else {
          for (const f of setFlags) {
            if (typeof f !== "string" || !f) {
              err(where, "`setFlags` contains a non-string entry");
              continue;
            }
            written.add(f);
            if (!declaredSet.has(f)) {
              err(where, `writes undeclared flag "${f}" (not in top-level flags)`);
            }
          }
        }
      }
      const choices = stitch["choices"];
      if (choices !== undefined) {
        if (!Array.isArray(choices)) {
          err(where, "`choices` is not an array");
        } else {
          for (let i = 0; i < choices.length; i++) {
            const choice = choices[i];
            const cwhere = `${where} choice#${i}`;
            if (!isRecord(choice)) {
              err(cwhere, "choice is not an object");
              continue;
            }
            stats.choices += 1;
            if (typeof choice["text"] !== "string" || !choice["text"]) {
              err(cwhere, "choice has no text");
            }
            const target = choice["target"];
            const isExit = choice["exit"] === true;
            if (isExit) {
              stats.exitChoices += 1;
              if (target !== undefined) {
                err(cwhere, "exit choice also carries a target");
              }
            } else if (isRecord(target)) {
              const tk = target["knot"];
              const ts = target["stitch"];
              if (typeof tk !== "string" || typeof ts !== "string") {
                err(cwhere, "choice target is not a { knot, stitch } pair");
              } else {
                targetedStitches.add(`${tk}/${ts}`);
                if (!knotNames.includes(tk)) {
                  err(cwhere, `choice target knot "${tk}" does not exist`);
                } else {
                  const tkStitches = knots[tk]?.["stitches"];
                  if (
                    !isRecord(tkStitches) ||
                    !Object.prototype.hasOwnProperty.call(tkStitches, ts)
                  ) {
                    err(
                      cwhere,
                      `choice target stitch "${tk}/${ts}" does not exist`,
                    );
                  }
                }
              }
            } else if (target !== undefined) {
              err(cwhere, "choice target is not an object");
            } else {
              err(cwhere, "choice has neither target nor exit:true");
            }
            if (choice["condition"] !== undefined) {
              for (const f of flagsReadByCondition(choice["condition"])) {
                read.add(f);
              }
            }
          }
        }
      }
      // Dead-end rule: a stitch must end the conversation (exit:true)
      // or offer a way onward (choices). Anything else strands the player.
      const hasChoices =
        Array.isArray(choices) && (choices as unknown[]).length > 0;
      if (stitch["exit"] !== true && !hasChoices) {
        err(where, "dead end: stitch has neither exit:true nor choices");
      }
      if (stitch["exit"] !== true && stitch["exit"] !== undefined) {
        err(where, "`exit` is present but not true");
      }
    }
  }

  stats.flagsWritten = written.size;
  stats.flagsRead = read.size;

  // Flag accounting: every read must be written somewhere, every
  // declared flag must be written somewhere.
  for (const f of read) {
    if (!written.has(f)) {
      err("$", `flag "${f}" is read by a choice condition but never written`);
    }
    if (!declaredSet.has(f)) {
      warn("$", `flag "${f}" is read but not in the declared flags list`);
    }
  }
  for (const f of declared) {
    if (!written.has(f)) {
      err("$", `declared flag "${f}" is never written by any stitch`);
    }
  }

  // Reachability: every stitch must be a `main` nav stitch, a choice
  // target, or a known event stitch triggered by battle/field code.
  // (Event stitches are NOT choice targets by design — the battle
  // flow calls them directly — so "never choice-targeted" alone is
  // not deadness for them.)
  for (const knotName of knotNames) {
    const stitches = knots[knotName]?.["stitches"];
    if (!isRecord(stitches)) continue;
    for (const stitchName of Object.keys(stitches)) {
      const key = `${knotName}/${stitchName}`;
      if (stitchName === "main") continue;
      if (targetedStitches.has(key)) continue;
      if (isEventStitch(stitchName)) continue;
      warn(key, "stitch is never targeted by a choice and is not a known event stitch");
    }
  }
  // Knots: every knot's `main` is a nav entry, so a knot is dead only
  // if it has no `main` stitch at all (its event stitches would then
  // have no preview path and no documented entry).
  for (const knotName of knotNames) {
    const stitches = knots[knotName]?.["stitches"];
    if (isRecord(stitches) && !("main" in stitches)) {
      warn(knotName, "knot has no `main` navigation stitch");
    }
  }

  return { file, format: "hand-shaped", errors, warnings, stats };
}

function validateCompiledInk(
  file: string,
  doc: Record<string, unknown>,
): ValidationResult {
  const errors: ValidationIssue[] = [];
  const warnings: ValidationIssue[] = [];
  const stats = emptyStats();
  const err = (where: string, message: string) =>
    errors.push({ level: "error", file, where, message });

  const root = doc["root"];
  if (!Array.isArray(root)) {
    err("$", "compiled ink file has no `root` array");
    return { file, format: "compiled-ink", errors, warnings, stats };
  }
  // Named containers live in the last dict element of root.
  let knotMap: Record<string, unknown> = {};
  for (const el of root) {
    if (isRecord(el)) knotMap = { ...knotMap, ...el };
  }
  const knotNames = Object.keys(knotMap).filter((k) => k !== "global decl");
  stats.knots = knotNames.length;
  if (knotNames.length === 0) err("$", "no knots found in compiled ink root");

  const diverts: string[] = [];
  const varWrites: string[] = [];
  const varReads: string[] = [];
  let lineCount = 0;
  let choiceCount = 0;
  const walk = (v: unknown): void => {
    if (typeof v === "string") {
      // "^" strings are ink text tokens; a bare "^ " token is the
      // compiler's choice-point separator, not a spoken line.
      if (v.startsWith("^") && v.slice(1).trim().length > 0) lineCount += 1;
      return;
    }
    if (Array.isArray(v)) {
      v.forEach(walk);
      return;
    }
    if (isRecord(v)) {
      if (typeof v["->"] === "string") diverts.push(v["->"] as string);
      if (typeof v["VAR="] === "string") varWrites.push(v["VAR="] as string);
      if (typeof v["VAR?"] === "string") varReads.push(v["VAR?"] as string);
      if ("*" in v) choiceCount += 1;
      Object.values(v).forEach(walk);
    }
  };
  walk(doc);
  stats.diverts = diverts.length;
  stats.varWrites = new Set(varWrites).size;
  stats.varReads = new Set(varReads).size;
  stats.lines = lineCount;
  stats.choices = choiceCount;
  stats.flagsDeclared = stats.varWrites;
  stats.flagsWritten = stats.varWrites;

  for (const d of diverts) {
    // Internal paths (".^.c-0" choice points) resolve inside their
    // own container; only plain names are knot diverts.
    if (d.startsWith(".")) continue;
    if (d === "END" || d === "DONE") continue;
    if (!knotNames.includes(d)) {
      err("$", `ink divert "-> ${d}" resolves to no knot`);
    }
  }
  const writtenSet = new Set(varWrites);
  for (const r of new Set(varReads)) {
    if (!writtenSet.has(r)) {
      err("$", `ink variable "${r}" is read but never declared/written`);
    }
  }
  for (const k of knotNames) {
    const body = knotMap[k];
    if (!Array.isArray(body) || body.length === 0) {
      err(k, "knot container is empty");
    }
  }

  return { file, format: "compiled-ink", errors, warnings, stats };
}

export function validateDialogueJson(
  parsed: unknown,
  file: string,
): ValidationResult {
  if (!isRecord(parsed)) {
    const stats = emptyStats();
    return {
      file,
      format: "unknown",
      errors: [
        {
          level: "error",
          file,
          where: "$",
          message: "dialogue JSON is not an object",
        },
      ],
      warnings: [],
      stats,
    };
  }
  if ("knots" in parsed) return validateHandShaped(file, parsed);
  if ("inkVersion" in parsed && "root" in parsed) {
    return validateCompiledInk(file, parsed);
  }
  const stats = emptyStats();
  return {
    file,
    format: "unknown",
    errors: [
      {
        level: "error",
        file,
        where: "$",
        message:
          "unrecognised dialogue format (expected `knots` hand-shaped JSON or inkVersion/root compiled ink JSON)",
      },
    ],
    warnings: [],
    stats,
  };
}
