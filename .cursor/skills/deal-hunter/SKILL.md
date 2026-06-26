---
name: deal-hunter
description: Automated B2B lead generation for Flux Labs. Cursor discovers, enriches, intakes to GHL, qualifies, and pitches top scorers. Posts to #war-room. B2B — no outreach restrictions via GHL workflows.
---

# Deal Hunter — Automated B2B Lead Gen (Cursor Owned)

You **hunt** leads. Every run finds money and puts it in the pipeline.

**Config:** `config/lead-gen-config.json` + `config/flux-ops-canonical.json`

---

## Target Profile (ICP)

- **Geo:** Brevard, St. Lucie, Treasure Coast FL
- **Industries:** HVAC, roofing, plumbing, landscaping, pest, construction, electrical, cleaning, med spa, dental, legal, insurance
- **Size:** 3–50 employees, family-owned, owner-operated
- **Signals:** weak GBP, no chat, outdated site, no booking CTA, missed-call risk

---

## Hunt Cycle (Every Run)

### 1. Discover (25 leads target)
- Rotate niche daily from `config/lead-gen-config.json` → `icp.industries`
- Methods: web search, directory scrape, domain-derived email, Apollo `find_contact`
- Require: companyName, city, industry, website OR phone/email
- Score 0–100 on ICP fit + opportunity signals

### 2. Dedupe
- Skip if email exists in `client-record-schema.json` pitched batch
- Skip if tag `cursor_stage_set` + stage >= proposal_sent
- Skip if tag `deal_hunter_*` same day and already in GHL

### 3. Enrich (Apollo per-lead)
```
execute_zapier_read_action[ApolloCLIAPI:find_contact](email)
```
- Try `info@domain`, `admin@domain`, `contact@domain` if no email found
- Flag `enrichment_pending` if no phone AND no email — queue for next run

### 4. Intake GHL (New Lead)
```
execute_zapier_write_action[HighLevelCLIAPI:add_update_contact](
  lead: "true",
  email, firstName, lastName, phone, companyName,
  city, state, industry, service_type, brand_origin: "flux_labs",
  lead_source: "deal_hunter", ai_qualification_score,
  apollo_enriched: "true|false",
  tags: "cursor_intake,deal_hunter_YYYY-MM-DD"
)
execute_zapier_write_action[HighLevelCLIAPI:add_update_opportunity](
  lead: "true",
  pipelineId: "RbSKp5WldAzJFgDOwoMO",
  stageId: "249f57f7-d296-451c-ace0-a0a04eecbc13",
  email, firstName, lastName, companyName, service_type, brand_origin,
  ai_qualification_score, tags: "cursor_intake,deal_hunter_YYYY-MM-DD"
)
```
**Stage change triggers wf_01 — NEVER call `campaign` for customer workflows.**

### 5. Qualify (auto)
- Score >= 85 → `sync_stage` to **Qualified** (`a03eac73-3758-4108-9dfb-15de55cf5509`) — wf_02 fires
- Score 75–84 → stay New Lead, tag `warm`
- Score < 75 → tag `nurture_only`, no pitch

### 6. Pitch top scorers (max 5/run)
For score >= 88 not yet pitched:
1. Assign `fla_contract_ref` from `flux-ops-canonical.json` → `next_contract_ref`
2. `sync_stage` to **Proposal Sent** — wf_03 fires
3. Verify Stripe checkout link exists (website automation) or flag gap
4. Tags: `cursor_stage_set`, `pitch_ready`, `deal_hunter_YYYY-MM-DD`
5. **Do NOT re-pitch** FLA-2026-102 through 106

Use `deal-orchestrator` mode `sync_stage` or inline GHL opportunity upsert.

### 7. Report + War Room
Post to `#war-room` (C0BDLF5JUQ4) via `war-room-alert`:
```
HUNT COMPLETE — {niche} | {geo}
Found: X | Intaked: X | Qualified: X | Pitched: X | Failed: X
Top 5: [company | score | offer]
Revenue at stake: $X
Next contract ref: FLA-YYYY-###
```

---

## Offer Matching

| Signal | Pitch |
|--------|-------|
| Outdated/no website | Pro Site ($2,500) + GBP ($299/mo) |
| Website but no leads | Flux Ops Growth ($697/mo + $997) |
| Good site, no visibility | Full Scale SEO ($599/mo) + GBP |
| High call volume | Flux Ops Starter ($397/mo) |
| Wants more customers | Brand Fusion Pro Leads ($8/lead, min $800/mo) |

---

## Batch Limits

- Max 50 leads per run (default 25)
- Max 5 pitches per run (top scorers only)
- Apollo: per-lead only, no bulk list scraping

---

## Constraints

- **GHL owns customer SMS/email** — never send outbound directly from Cursor
- **No `campaign` enrollment** for customer workflows — stage triggers only
- Failed writes (missing phone/email): queue in enrichment, do not discard
- Tag all hunt leads: `deal_hunter_YYYY-MM-DD`
- Post to `#war-room` only — never `#project-update` for deal ops

---

## Schedule

See `automation/deal-machine-schedule.json` → `deal-hunter-daily`

---

## Modes

| Mode | Action |
|------|--------|
| `hunt` | Full cycle: discover → enrich → intake → qualify → pitch top → report |
| `discover_only` | Find + score, no GHL writes |
| `intake_batch` | GHL upsert from provided lead list |

---

## Execution Report

```json
{
  "mode": "hunt",
  "niche": "HVAC",
  "geo": "Brevard County FL",
  "status": "success|partial|failed",
  "leads_found": 0,
  "leads_intaked": 0,
  "qualified": 0,
  "pitched": 0,
  "failed": 0,
  "revenue_at_stake": 0,
  "next_contract_ref": "FLA-2026-107",
  "errors": [],
  "recommended_next_mode": "verify_close|hunt"
}
```
