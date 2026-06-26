# Pipeline Confirmed — No Overlap

**Confirmed:** 2026-06-26  
**Policy:** Comet = physical labor. GHL = comms + workflows. Zapier/Cursor = War Room orchestration only.

---

## GHL Pipeline (LOCKED — Accurate)

| Stage | Stage ID | Workflow Trigger |
|-------|----------|------------------|
| New Lead | `249f57f7-d296-451c-ace0-a0a04eecbc13` | wf_01_capture |
| Qualified | `a03eac73-3758-4108-9dfb-15de55cf5509` | wf_02_qualify |
| Proposal Sent | `87a280ab-a8ea-4069-9a6e-8280dd342299` | wf_03_proposal |
| Contract Signed | `0d285ceb-b13f-4edd-a5e0-9f042ae14bdb` | wf_04_onboard |
| In Delivery | `81106b0e-4bd4-4f7d-b0cf-c746a77f6091` | delivery ops |
| Delivered | `501f07ad-3abb-4ad7-aa92-4159bc97b0ae` | upsell track |
| Active Recurring | `7542dc89-76b1-4538-8431-1ec8801cf312` | Stripe sub sync |

- **Pipeline ID:** `RbSKp5WldAzJFgDOwoMO`
- **GHL UI name:** Flux Labs Sales Pipeline

---

## Current Pipeline State (DO NOT RE-ADVANCE)

### Pitched — wf_03 RUNNING (hands off)

| Ref | Company | Stage | Offer | Stripe |
|-----|---------|-------|-------|--------|
| FLA-2026-102 | Jacquin & Sons | Proposal Sent | Flux Ops Growth | Pending |
| FLA-2026-103 | Rooftop Roofing | Proposal Sent | Pro Site + GBP | Pending |
| FLA-2026-104 | Complete Air & Heat | Proposal Sent | Flux Ops Growth | Pending |
| FLA-2026-105 | Fitzpatrick Plumbing | Proposal Sent | Flux Ops Growth | Pending |
| FLA-2026-106 | Packard Roofing | Proposal Sent | Pro Site + GBP | Pending |

**Tags locked:** `cursor_stage_set`, `pitch_ready`, `deal_hunter_2026-06-26`  
**Revenue at stake:** $5,000 one-time + $3,288/mo MRR  
**Stripe:** 0/5 payments confirmed on FLA metadata

### Closed Reference

| Ref | Company | Stage |
|-----|---------|-------|
| FLA-2026-101 | Perfect Client (template) | Contract Signed |

### Enrichment Queue

**6/6 cleared** — wf_01 fires on New Lead entries. Comet not needed for queue.

---

## Overlap Matrix (ENFORCED)

| Action | Owner | Zapier/Cursor? |
|--------|-------|----------------|
| Lead gen / browser / GHL UI clicks | **Comet** | ❌ Never |
| Customer SMS / email / nurture | **GHL workflows** | ❌ Never |
| Workflow enrollment (`campaign`) | **GHL stage triggers** | ❌ Never via Zapier |
| Trial sequences | **GHL** | ❌ Never |
| Stripe checkout / billing | **Website** | ❌ Don't duplicate links |
| Stage sync (idempotent) | **Cursor** | ✅ Only if tags allow |
| Stripe payment verify | **Cursor** | ✅ Read-only Stripe MCP |
| War Room Slack + SMS | **Zapier/Cursor** | ✅ `#war-room` only |
| Record audit / digest | **Cursor** | ✅ `#war-room` only |
| Delivery scaffold | **Cursor → flux-web** | ✅ After Contract Signed |

---

## Zapier War Room Focus

All Zapier MCP deal operations post to **`#war-room` (`C0BDLF5JUQ4`)** first.

See `config/zapier-war-room.json`.

**Zapier does NOT post to:** `#project-update`, `#company-data`, `#ai-master`

**Exception:** `#sold-clients` receives deal-close summaries AFTER war-room alert.

---

## Idempotency — Check Before Every GHL Write

```
cursor_stage_set     → SKIP stage advance if already at target
pitch_ready          → SKIP re-pitch
deal_hunter_2026-06-26 → SKIP batch re-processing
ghl_wf_active        → SKIP workflow enrollment
comet_intake         → SKIP lead creation
fulfillment_complete → SKIP unless audit finds gaps
```

---

## Payment Rail

- **Primary:** Stripe (`acct_1TQFfvHr9kmD1svX`)
- **Legacy:** Square (Melbourne FL location — do not use for new deals)
- **Products live:** Total Growth Package, Web Development & SEO, Custom Lead Gen & BUILD UP

---

## Confirmed Accurate ✅

1. Pipeline IDs match GHL live (`RbSKp5WldAzJFgDOwoMO`)
2. 5 pitched deals at Proposal Sent — wf_03 active, no Cursor re-touch
3. No Stripe payments yet on pitched batch
4. Comet scoped to physical labor only
5. Zapier scoped to War Room channel
6. GHL owns all customer communication
7. Workflow enrollment via Zapier `campaign` — **removed / forbidden**
