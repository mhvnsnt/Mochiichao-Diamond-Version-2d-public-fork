# STASH MANIFEST — Wielder's provisioning stash (Addendum 13.4)

The staging law applied to Wielder itself: the packages and installers
Wielder depends on are named here with their source, so a dead apt
mirror or a package-state rollback is an inconvenience Wielder routes
around, not a stop. Rule: every entry lists (a) what, (b) where it
comes from, (c) how Wielder re-provisions it, (d) its state today.

| Piece | Source | Re-provision | State 2026-10-28 |
|---|---|---|---|
| Xvfb (virtual display :99) | distro package `xvfb` (Ubuntu noble) | `apt-get install -y xvfb` + `~/opt/bin/start-virtual-display.sh` | INSTALLED (2:21.1.12-1ubuntu1.9); started by desktop.self_provision |
| dbus-daemon (session bus) | distro package `dbus` | present on the base image; manual-daemon recipe in `wielder/desktop.py` | INSTALLED; bus running on workspace XDG_RUNTIME_DIR |
| x11-utils / x11-apps (xdpyinfo, xclock) | distro packages | `apt-get install -y x11-utils x11-apps` | INSTALLED 2026-10-28 (slow mirror, landed same day); xclock rendered under :99 in the proof smokes (window region YAVG 229.6/255) |
| x11vnc (owner view/takeover seat) | distro package | `apt-get install -y x11vnc`; `wielder desktop vnc` | INSTALLED + SMOKED 2026-10-28: seat listening on 127.0.0.1:5999 attached to :99 |
| xdotool (GUI automation) | distro package | `apt-get install -y xdotool` | INSTALLED 2026-10-28 |
| Google Chrome (headful browser seat) | Google's official .deb (free proprietary browser — not open source) | download `google-chrome-stable_current_amd64.deb` from dl.google.com into workspace scratch, install | **INSTALLED** (Chrome 156.0.8078.73 via dpkg, version-verified). **Startup smoke FAILED with evidence**: the browser process dies with SIGTRAP during startup on this VM across two flag sets (crashpad cannot read /sys cpufreq; zygote broken pipe — logs in `wielder/data/smoke/chrome.log`, `chrome2.log`). The profile dir initializes; the window never stays up. Recorded as a seat gap: Wielder's browser EXECUTION routes through the manager's browser lane (the standing design); the desktop layer itself (display/bus/GUI apps) is proven without it |
| PHP 8.3 + extensions (Kanboard board) | distro packages | the finish-gate's board setup (see PROVENANCE) | INSTALLED and serving (the board runs on it) |
| Python stack | PyPI, pinned in `requirements.txt` | `pip install -r requirements.txt` into the package venv | INSTALLED and running-verified (PROVENANCE.md) |

Staging of the stash itself: this manifest + `requirements.txt` land
in the repo with the package (GitHub). The Chrome .deb and any future
cached .debs are large binaries: they stage to TeraBox under the
staging law at the next staging pass (recorded here as the standing
instruction; the .deb's canonical source remains Google's download,
which is the re-provision path of record).
