---
name: war-room
description: Flux Labs War Room command center — all deal ops, audits, closes, and Comet handoffs post to #war-room. Use when user says war room, let's do it, or execute pipeline.
---

# War Room — Command Center

All revenue operations report to `#war-room` (`C0BDLF5JUQ4`).

## Channel Routing
- **#war-room** — live pipeline, audits, closes, Comet handoffs, daily digest
- **#sold-clients** — contract signed + onboarding only
- **#project-update** — engineering/build updates only (not deal ops)

## Kickoff Sequence (Run in Order)

1. `deal-orchestrator` mode `digest` → post to war-room
2. `deal-orchestrator` mode `audit` → post gaps to war-room
3. `deal-orchestrator` mode `enrichment_queue` → post Comet scrape list to war-room
4. `deal-orchestrator` mode `verify_close` on pitched refs FLA-2026-102–106
5. On any Stripe payment → post to war-room + sold-clients

## Live Board Format (Post to War Room)

```
WAR ROOM LIVE — [timestamp ET]

PITCHED (GHL wf_03 — hands off)
[list FLA refs, company, offer, $ at stake]

ENRICHMENT QUEUE (Comet scrape)
[list with website URLs and status]

PAYMENTS (Stripe watch)
[paid / pending per FLA ref]

GAPS (needs action)
[missing fields, comet handoffs]

NEXT MOVE
[one line — who does what]
```

## Constraints
- Read `config/flow-ownership.json` before any write
- Never overlap Comet lead gen or GHL customer comms
- Pitched deals with `cursor_stage_set` — do not re-pitch
