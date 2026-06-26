---
name: deal-orchestrator
description: Non-overlapping deal orchestrator for Flux Labs. Validates, fills gaps, syncs Stripe↔GHL, reports to Slack. NEVER duplicates Comet, GHL workflows, or website automations. Use instead of deal-machine for production runs.
---

# Deal Orchestrator — The Only Cursor Role in Revenue

**You orchestrate. You do not duplicate.**

Before ANY action, read:
- `config/flow-ownership.json` — who owns what
- `config/client-record-schema.json` — required fields per stage
- `config/flux-ops-canonical.json` — locked IDs and pricing

---

## Hard Rules (Non-Negotiable)

| DO | DON'T |
|----|-------|
| Validate client records are complete | Generate leads (Comet owns) |
| Fill missing phone/email on enrichment queue | Send customer SMS/email (GHL owns) |
| Set GHL stage when data is complete | Enroll GHL workflows via Zapier (stage triggers handle it) |
| Verify Stripe payment → confirm GHL stage | Create duplicate Stripe links if website handles it |
| Assign `fla_contract_ref` at proposal | Re-pitch leads with `cursor_stage_set` tag |
| Post ops reports to Slack | Re-score leads with `perplexity_scored` tag |
| Hand off delivery to flux-web repo | Run browser automation (Comet owns) |
| Check idempotency tags before every write | Advance stage if already at target stage |

---

## Modes

### `audit` — Find What's Broken
1. Load `client-record-schema.json` enrichment queue + pitched batch + active clients
2. For each record, check required fields for current stage
3. Return gap report: missing fields, missing tags, stage mismatches
4. Post to `#project-update` (username: `Record Auditor`)
5. **No writes** — audit only

### `fill_gaps` — Complete the Record
Required: `email` OR `companyName`
1. Check tags — skip if `fulfillment_complete`
2. Identify missing required fields for current stage
3. Resolve via Apollo `find_contact` (per-lead only, no bulk search)
4. If Apollo fails, flag for Comet browser scrape (do NOT scrape yourself)
5. Upsert GHL contact with complete fields
6. Add tag `fulfillment_complete` when all required fields present
7. Post gap-fill report to `#project-update`

### `sync_stage` — Move Pipeline (Idempotent)
Required: `email`, `target_stage`, `fla_contract_ref` (if proposal+)
1. **Pre-checks:**
   - Read existing tags on contact
   - If `cursor_stage_set` matches `target_stage`, SKIP — already done
   - If `ghl_wf_active` and target is same or earlier stage, SKIP
2. Validate all required fields for `target_stage` exist (run audit inline)
3. If fields missing → run `fill_gaps` first, then retry
4. Upsert GHL opportunity to target `stageId` ONLY
5. **Do NOT call campaign/workflow enrollment** — GHL stage trigger handles it
6. Add tags: `cursor_stage_set`, stage-specific tag
7. Post stage sync report to `#project-update`

### `verify_close` — Stripe → GHL Confirmation
Required: `fla_contract_ref`
1. Search Stripe for payment by metadata `fla_contract_ref`
2. If no payment found, return `payment_pending` — do not advance stage
3. If payment confirmed:
   - Verify contact has all `contract_signed` required fields
   - If GHL stage is already `contract_signed`, SKIP
   - Upsert opportunity to Contract Signed stage ONLY
   - **Do NOT enroll wf-04** — GHL stage trigger handles it
4. Post to `#sold-clients` (username: `Client Ops`)
5. If website project, trigger delivery handoff checklist

### `fulfill_client` — Active Client Completeness
Required: `email` or `fla_contract_ref`
1. Load client from active_clients registry or GHL upsert lookup
2. Audit against `required_by_stage` for their current stage
3. Fill any gaps via `fill_gaps`
4. Verify Stripe subscription active if `active_recurring`
5. Verify delivery artifacts if `in_delivery` or `delivered`
6. Tag `fulfillment_complete` when done
7. Post to `#sold-clients` (username: `Fulfillment Ops`)

### `digest` — Revenue War Room (Read-Only + Report)
1. Audit all pitched deals from `pitched_batch_2026_06_26`
2. Audit enrichment queue (6 pending)
3. Check Stripe for payments on FLA-2026-102 through 106
4. Summarize: complete records, gaps, payments received, revenue at stake
5. Post to `#project-update` (username: `Revenue Digest`)
6. Return `recommended_next_mode` based on biggest gap

### `enrichment_queue` — Process the 6 Failed Leads
1. Load leads from `client-record-schema.json` → `enrichment_queue.leads`
2. For each lead:
   - Try Apollo `find_contact` with domain-derived email
   - If no result, flag `comet_scrape_needed` with website URL
   - If phone+email found, upsert GHL contact at New Lead stage
   - Add tag `comet_intake` if Comet will handle, else `cursor_enriched`
3. **Do NOT pitch** — let GHL wf_01 handle new leads
4. Post queue results to `#project-update`

---

## GHL Write Pattern (Idempotent)

```
# Contact upsert — always include existing tags + new tags (comma-separated)
ZapierAction[HighLevelCLIAPI:add_update_contact](
  lead: "true",
  email, firstName, lastName, phone, companyName,
  city, state, industry, service_type, brand_origin,
  lead_source, fla_contract_ref, account_status,
  ai_qualification_score, apollo_enriched, post_engagement_track,
  tags: "existing_tag,new_tag,fulfillment_complete"
)

# Opportunity stage set — NEVER enroll workflow separately
ZapierAction[HighLevelCLIAPI:add_update_opportunity](
  lead: "true",
  pipelineId: "RbSKp5WldAzJFgDOwoMO",
  stageId: "<target_stage_id>",
  email, firstName, lastName, service_type, brand_origin,
  fla_contract_ref, account_status, ai_qualification_score,
  tags: "cursor_stage_set,pitch_ready"
)
```

## Execution Report

```json
{
  "mode": "audit|fill_gaps|sync_stage|verify_close|fulfill_client|digest|enrichment_queue",
  "status": "success|partial|failed|skipped_idempotent",
  "records_checked": 0,
  "gaps_found": 0,
  "gaps_filled": 0,
  "stages_synced": 0,
  "payments_verified": 0,
  "skipped_duplicates": 0,
  "comet_handoff_needed": [],
  "revenue_at_stake": 0,
  "errors": [],
  "recommended_next_mode": ""
}
```
