# Providers — RunPod vs Vast.ai for this seat

Checked 2026-10-28 against the providers' published rate cards as
reported by multiple public pricing trackers the same day. **Market
rates move** — every figure here is a snapshot; the number that
matters is the one on the checkout screen on the day of rental.
Structural facts (billing model, storage behaviour, interruption
mechanics) were consistent across every source checked. Anything
that rests on a single third-party report is labelled as such.
No affiliate links. No accounts were created for this note.

## At a glance

| | RunPod | Vast.ai |
|---|---|---|
| Model | Pod rental, two clouds: **Community** (partner hosts) and **Secure** (RunPod datacenters, SLA) | Marketplace — independent hosts set their own prices |
| RTX 4090 24 GB | Community ≈ **$0.34/hr**; Secure ≈ **$0.69–0.89/hr** (trackers' snapshots of the rate card differ by date within this range); spot, where offered, ≈ $0.32–0.44/hr | On-demand ≈ **$0.29–0.50/hr**; interruptible ≈ **$0.08–0.59/hr**, median ≈ $0.21/hr |
| Billing | **Per second** for pods; quoted per hour | **Per second**, no minimums; minimum top-up $5 |
| Spot / interruption | Spot pods exist on some GPUs at a discount | **Interruptible** instances can be reclaimed by the host with ~15 seconds' notice; 30–50% cheaper than on-demand |
| Disk persistence | **Network volumes persist** independently of pods and reattach to a new pod in the same datacenter — weights download once, ever | The instance's disk is all there is; it dies with the instance. **Disk size is fixed at creation and cannot be resized** |
| Storage billing | Separate: container disk ≈ $0.10/GB-month; volume ≈ $0.10/GB-month running, $0.20 idle; network storage ≈ $0.05–0.07/GB-month. **A stopped pod still bills its storage** | Separate meter: storage billed per GB/hour **from creation until the instance is destroyed — stopping does not stop it**. Bandwidth is a third meter, billed per TB at a host-set rate, both directions |
| Templates | Official ComfyUI template exists | Community ComfyUI templates exist |
| Free tier | None — card on file required | $5 minimum top-up; spent credits are not refundable |

## What this means for our stack specifically

**The 57 GB question decides most of it.** Our weights total
56,893,101,135 B (see `README.md`). Every fresh box pays one
download of that before it generates anything.

- **RunPod + network volume** is the only shape where that download
  happens **once**: put `STACK_ROOT` on a 150 GB network volume
  (≈ $7.50–10.50/month at the tracked rates), terminate pods freely,
  and the next session starts at `RUNBOOK.md` step 2. The volume's
  idle billing is the price of that convenience — about the cost of
  one GPU-hour per month.
- **Vast.ai** is cheaper per GPU-hour at the interruptible end, and
  our jobs are exactly the interruptible-friendly kind: short,
  per-character, gated, and resumable — a reclaimed box loses one
  segment, not a night. But every new instance re-downloads the
  weights (bandwidth is metered, and setup time is billed), and a
  forgotten stopped instance keeps billing storage until destroyed.
  `setup.sh` is written for this: one command, loud stops, and the
  runbook ends with a shutdown check.
- **Interruption risk in practice:** the locked proof pattern runs
  in phases with a report written per phase, and scene jobs are
  per-segment — the stack checkpoints naturally. Neither provider's
  spot tier threatens anything but minutes.
- **Host variance (Vast) / Community tier (RunPod):** the cheap end
  of both is third-party hardware. For a generation seat this is
  acceptable — the gates, not the host, decide what counts as a
  result — but pick verified/high-reliability listings when the
  price gap is small.

## The package's assessment (not a decision)

**RunPod with a network volume** for the standing seat: predictable
billing, weights persist, official ComfyUI template, and the
per-hour premium over Vast's floor is smaller than one re-download
of the weights per session. **Vast.ai interruptible** as the burst
option later, once the pipeline is proven and a long batch queue
exists to absorb interruptions. The owner's call, at checkout, with
the day's real prices in front of him.
