#!/usr/bin/env bash
#
# resilient-gh-upload.sh — stall-proof GitHub release asset uploader for lanes
#
# STATUS (2026-10-22, friction-research task A): quick-win wire-up.
# Replaces bare `gh release upload` for lane store-off uploads.
#
# WHY: `gh release upload` does ONE http POST per asset with only 3 retries at
# a constant 200ms backoff (cli/cli pkg/cmd/release/shared/upload.go) and NO
# low-speed stall detection. Against a congested egress proxy, a stalled POST
# hangs forever; when it finally fails, the lane has lost the whole file.
# (2026-10-20..22: longtail lane lost 1981-1985.zips repeatedly — "FAILED after
# 4 retries (TimeoutError)", one 400MB file at a time, no resume.)
#
# WHAT THIS DOES (stdlib/bash only — lane-vendorable, no CloudDog import):
#   1. Splits the file into exactly-100MB parts (owner law: 100MB single
#      standard; PART_SIZE is overridable via RU_PART_SIZE for tests only).
#   2. Writes a sha256 manifest ({name,size,sha256,part_size,parts[]}) and
#      uploads it as its own asset LAST — a present manifest implies all parts.
#   3. Uploads each part with curl directly against uploads.github.com with
#      --speed-limit/--speed-time stall-kill (stall -> exit 28 -> retry, never
#      a multi-day hang), streaming (-T, no RAM buffering), sequential parts.
#   4. Bounded exponential backoff + jitter; retries only transient failures
#      (curl 7/28/52/55/56, HTTP 5xx/429); aborts on 401/403/404/422.
#   5. Idempotent resume: parts already on the release with matching size are
#      SKIPPED; size-mismatched parts are DELETE-then-reuploaded (worst case
#      re-sends 100MB, never the whole file).
#   6. Per-part verify against the API-returned size + digest field, then a
#      final whole-manifest asset-list check.
#
# USAGE:
#   resilient-gh-upload.sh OWNER/REPO TAG FILE [--dry-run]
#
# ENV: GH_TOKEN (or `gh auth token`), RU_PART_SIZE (tests only),
#      RU_MAX_ATTEMPTS (default 8), RU_DRY_RUN=1.
#
# Pattern credit: ading2210/gh-large-releases (LGPL-3.0 — pattern adopted,
# code NOT vendored): {name}.{index:04d} naming + manifest schema +
# delete_matching_assets idempotent-retry precedent.
#
set -u
export LC_ALL=C

PART_SIZE="${RU_PART_SIZE:-104857600}"   # 100MB exactly — the owner standard
MAX_ATTEMPTS="${RU_MAX_ATTEMPTS:-8}"
SPEED_LIMIT="${RU_SPEED_LIMIT:-1000}"    # bytes/sec floor
SPEED_TIME="${RU_SPEED_TIME:-60}"       # seconds below floor before abort
CONNECT_TIMEOUT="${RU_CONNECT_TIMEOUT:-30}"
MAX_TIME="${RU_MAX_TIME:-1800}"          # 30 min per part attempt

die() { printf 'resilient-gh-upload: FATAL: %s\n' "$*" >&2; exit 2; }
log() { printf 'resilient-gh-upload: %s\n' "$*" >&2; }

# ---- curl/gh indirection so tests can stub them ---------------------------
# shellcheck disable=SC2317
do_curl() { curl "$@"; }
# shellcheck disable=SC2317
do_gh()   { gh   "$@"; }

gh_token() {
    if [[ -n "${GH_TOKEN:-}" ]]; then printf '%s' "$GH_TOKEN"; return 0; fi
    do_gh auth token 2>/dev/null || die "no GH_TOKEN and 'gh auth token' failed"
}

urlenc() { python3 -c 'import sys,urllib.parse; print(urllib.parse.quote(sys.argv[1], safe=""))' "$1"; }

release_id() {
    local repo="$1" tag="$2"
    do_gh api "repos/$repo/releases/tags/$(urlenc "$tag")" --jq '.id' \
        || die "cannot resolve release id for tag '$tag' in $repo"
}

# list_assets <repo> <rid> -> lines: id \t name \t size \t state
list_assets() {
    do_gh api "repos/$1/releases/$2/assets?per_page=100" \
        --jq '.[] | "\(.id)\t\(.name)\t\(.size)\t\(.state)"'
}

delete_asset() { do_gh api -X DELETE "repos/$1/releases/assets/$2" --silent >/dev/null; }

sha256_file() { sha256sum "$1" | awk '{print $1}'; }

# upload_one_part <repo> <rid> <token> <part_path> <asset_name>
# -> 0 on verified upload (or verified-skip), 1 on permanent failure
upload_one_part() {
    local repo="$1" rid="$2" token="$3" part="$4" aname="$5"
    local psize; psize="$(stat -c%s "$part")"
    local psha;  psha="$(sha256_file "$part")"
    local attempt=0 delay=10 body http_code curl_rc

    while (( attempt < MAX_ATTEMPTS )); do
        attempt=$((attempt + 1))
        body="$(mktemp)"
        set +e
        do_curl -sS -X POST \
            -H "Authorization: Bearer $token" \
            -H "Accept: application/vnd.github+json" \
            -H "Content-Type: application/octet-stream" \
            -H "Content-Length: $psize" \
            -T "$part" \
            --connect-timeout "$CONNECT_TIMEOUT" --max-time "$MAX_TIME" \
            --speed-limit "$SPEED_LIMIT" --speed-time "$SPEED_TIME" \
            -o "$body" -w '%{http_code}' \
            "https://uploads.github.com/repos/$repo/releases/$rid/assets?name=$(urlenc "$aname")" \
            >"$body.code" 2>"$body.err"
        curl_rc=$?
        set -e
        http_code="$(cat "$body.code" 2>/dev/null || echo 000)"

        if (( curl_rc == 0 )) && [[ "$http_code" == "201" ]]; then
            local rsize rdigest
            rsize="$(python3 -c 'import json,sys; print(json.load(open(sys.argv[1])).get("size",""))' "$body" 2>/dev/null || true)"
            rdigest="$(python3 -c 'import json,sys; print(json.load(open(sys.argv[1])).get("digest",""))' "$body" 2>/dev/null || true)"
            if [[ "$rsize" == "$psize" ]] && { [[ -z "$rdigest" ]] || [[ "$rdigest" == "sha256:$psha" ]]; }; then
                log "OK part $aname (${psize}B) verified (attempt $attempt)"
                rm -f "$body" "$body.code" "$body.err"
                return 0
            fi
            log "WARN part $aname: API 201 but size/digest mismatch (api=$rsize/$rdigest local=$psize/sha256:$psha); retrying"
        elif (( curl_rc == 28 )); then
            log "STALL part $aname (exit 28, attempt $attempt/$MAX_ATTEMPTS)"
        elif (( curl_rc == 7 || curl_rc == 52 || curl_rc == 55 || curl_rc == 56 )); then
            log "TRANSIENT part $aname (curl exit $curl_rc, attempt $attempt/$MAX_ATTEMPTS)"
        elif [[ "$http_code" =~ ^5[0-9][0-9]$ || "$http_code" == "429" ]]; then
            log "TRANSIENT part $aname (HTTP $http_code, attempt $attempt/$MAX_ATTEMPTS)"
        elif [[ "$http_code" == "401" || "$http_code" == "403" || "$http_code" == "404" || "$http_code" == "422" ]]; then
            log "PERMANENT part $aname (HTTP $http_code): $(head -c 300 "$body.err" 2>/dev/null; head -c 300 "$body" 2>/dev/null)"
            rm -f "$body" "$body.code" "$body.err"
            return 1
        elif (( curl_rc != 0 )); then
            log "PERMANENT part $aname (curl exit $curl_rc, HTTP $http_code): $(head -c 300 "$body.err" 2>/dev/null)"
            rm -f "$body" "$body.code" "$body.err"
            return 1
        else
            log "TRANSIENT part $aname (unexpected HTTP $http_code, attempt $attempt/$MAX_ATTEMPTS)"
        fi
        rm -f "$body" "$body.code" "$body.err"

        if (( attempt >= MAX_ATTEMPTS )); then
            log "EXHAUSTED part $aname after $MAX_ATTEMPTS attempts"
            return 1
        fi
        # exponential backoff 10/30/60/120/300/600/600 with +/-25% jitter
        local jitter=$(( RANDOM % (delay / 2 + 1) - delay / 4 ))
        local sleep_s=$(( delay + jitter )); (( sleep_s < 1 )) && sleep_s=1
        log "backing off ${sleep_s}s before retry of $aname"
        sleep "$sleep_s"
        delay=$(( delay * 2 )); (( delay > 600 )) && delay=600
    done
    return 1
}

main() {
    local repo="${1:?usage: resilient-gh-upload.sh OWNER/REPO TAG FILE [--dry-run]}"
    local tag="${2:?usage: resilient-gh-upload.sh OWNER/REPO TAG FILE [--dry-run]}"
    local file="${3:?usage: resilient-gh-upload.sh OWNER/REPO TAG FILE [--dry-run]}"
    local dry_run=0
    [[ "${4:-}" == "--dry-run" ]] && dry_run=1
    [[ -n "${RU_DRY_RUN:-}" ]] && dry_run=1

    [[ -f "$file" ]] || die "not a file: $file"
    local fname; fname="$(basename "$file")"
    local fsize; fsize="$(stat -c%s "$file")"
    # part size is read here (not at source time) so RU_PART_SIZE can be set
    # by tests or callers any time before main runs.
    local part_size="${RU_PART_SIZE:-104857600}"   # 100MB exactly — the owner standard
    log "file=$fname size=${fsize}B part_size=${part_size}B"

    local token; token="$(gh_token)"
    local rid; rid="$(release_id "$repo" "$tag")"
    log "release id=$rid"

    # existing assets: name -> "id size"
    declare -A have_id have_size
    while IFS=$'\t' read -r aid anm asz _state; do
        [[ -n "$anm" ]] && { have_id["$anm"]="$aid"; have_size["$anm"]="$asz"; }
    done < <(list_assets "$repo" "$rid")

    local tmpd; tmpd="$(mktemp -d)"
    # shellcheck disable=SC2064
    trap "[[ -n \"\${RU_KEEP_TMPD:-}\" ]] || rm -rf '$tmpd'" EXIT
    printf '%s' "$tmpd" >"${RU_TMPD_FILE:-/dev/null}" 2>/dev/null || true

    # split into exactly-part_size parts: {name}.0000, {name}.0001, ...
    split -b "$part_size" -d -a 4 -- "$file" "$tmpd/$fname."
    mapfile -t parts < <(cd "$tmpd" && ls "$fname".???? | sort)
    (( ${#parts[@]} > 0 )) || die "split produced no parts"

    local fsha; fsha="$(sha256_file "$file")"
    local manifest="$tmpd/$fname.manifest.json"
    python3 - "$manifest" "$fname" "$fsize" "$fsha" "$part_size" "${parts[@]}" <<'EOF'
import json,sys
out, fname, fsize, fsha, psize, parts = sys.argv[1], sys.argv[2], int(sys.argv[3]), sys.argv[4], int(sys.argv[5]), sys.argv[6:]
json.dump({"name":fname,"size":fsize,"sha256":fsha,"part_size":psize,
           "parts":[{"name":p} for p in parts],
           "tool":"resilient-gh-upload.sh","standard":"100MB-single-standard"},
          open(out,"w"), indent=2)
EOF
    log "manifest: ${#parts[@]} parts, sha256=$fsha"

    # upload parts (idempotent resume)
    local i p anm
    for i in "${!parts[@]}"; do
        p="${parts[$i]}"; anm="$p"
        if [[ -n "${have_id[$anm]:-}" ]]; then
            if [[ "${have_size[$anm]}" == "$(stat -c%s "$tmpd/$p")" ]]; then
                log "SKIP part $anm (already on release, size matches)"
                continue
            fi
            log "REPLACE part $anm (size mismatch: have ${have_size[$anm]}, want $(stat -c%s "$tmpd/$p")); deleting"
            (( dry_run == 0 )) && delete_asset "$repo" "${have_id[$anm]}"
        fi
        if (( dry_run )); then
            log "DRY-RUN: would upload part $anm"
        else
            upload_one_part "$repo" "$rid" "$token" "$tmpd/$p" "$anm" \
                || die "part $anm failed permanently; rerun to resume (uploaded parts are skipped)"
        fi
    done

    # manifest LAST: its presence implies all parts landed
    local man_name="$fname.manifest.json"
    if [[ -n "${have_id[$man_name]:-}" ]]; then
        log "manifest asset exists; replacing"
        (( dry_run == 0 )) && delete_asset "$repo" "${have_id[$man_name]}"
    fi
    if (( dry_run )); then
        log "DRY-RUN: would upload manifest $man_name"
    else
        upload_one_part "$repo" "$rid" "$token" "$manifest" "$man_name" \
            || die "manifest upload failed"
    fi

    # final verify: asset list vs manifest
    if (( dry_run == 0 )); then
        declare -A v_id v_size
        while IFS=$'\t' read -r aid anm asz _state; do
            [[ -n "$anm" ]] && { v_id["$anm"]="$aid"; v_size["$anm"]="$asz"; }
        done < <(list_assets "$repo" "$rid")
        for p in "${parts[@]}" "$man_name"; do
            [[ -n "${v_id[$p]:-}" ]] || die "final verify: asset missing: $p"
        done
        log "FINAL VERIFY OK: ${#parts[@]} parts + manifest present on release $rid"
    fi
    log "DONE $fname"
}

if [[ "${BASH_SOURCE[0]}" == "$0" ]]; then main "$@"; fi
