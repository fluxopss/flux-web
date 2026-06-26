# Flow Boundaries — Zero Overlap Architecture

**Principle:** One system owns each action. Cursor fills gaps and validates — never duplicates live automation.

---

## System Ownership Matrix

| Action | Owner | Cursor Role |
|--------|-------|-------------|
| Lead discovery & browser scraping | **Comet Browser** | None — flag `comet_scrape_needed` only |
| Lead research & scoring | **Perplexity / Master-Ninja** | None — read scores from GHL |
| GHL contact/opportunity creation | **Comet → GHL** or **Perplexity → GHL** | Fill gaps only on enrichment queue |
| Customer SMS & email | **GHL Workflows** | Never |
| Trial & nurture sequences | **GHL Workflows** (wf-01 to wf-04) | Never enroll via Zapier |
| Stage-triggered automations | **GHL** (on stage change) | Set stage only when data complete |
| Stripe checkout & subscriptions | **Website Automations** | Verify payment, don't duplicate links |
| Stripe → GHL stage sync | **Website webhook** (if configured) | `verify_close` only if webhook gap |
| Contract ref assignment | **Cursor** | Assign FLA-YYYY-### at proposal |
| Record completeness audit | **Cursor** | `audit` + `fill_gaps` modes |
| Delivery scaffolding | **Cursor** → flux-web repo | After Contract Signed |
| Ops reporting | **Cursor** → Slack | digest, audit reports |
| Missed call text-back | **GHL wf-missed-call** | None |
| RingCentral integration | **Comet + GHL** | None |

---

## What Went Wrong Before (Fixed)

| Previous Cursor Action | Problem | Fix |
|------------------------|---------|-----|
| `deal-hunter` generating 25 leads/week | Overlaps Comet lead gen | **Disabled** in schedule |
| `campaign` workflow enrollment via Zapier | Invalid IDs + duplicates GHL stage triggers | **Removed** — GHL handles on stage change |
| Advancing 5 deals to Proposal Sent in one batch | May duplicate if GHL already pitched | **Idempotency tags** + pre-check before stage set |
| Creating Stripe payment links | Overlaps website automations | **Verify first**, create only if gap |
| `warm-lead-closer` auto-pitching daily | Overlaps GHL wf-03 proposal | **Replaced** with `record-auditor` |

---

## GHL Stage → Workflow Trigger Map

GHL fires workflows automatically when stage changes. Cursor NEVER calls `campaign` separately.

```
New Lead      → wf_01_capture    (welcome, intake)
Qualified     → wf_02_qualify    (discovery, trial offer)
Proposal Sent → wf_03_proposal    (pitch sequence, payment link delivery)
Contract Signed → wf_04_onboard  (welcome, intake forms, delivery kickoff)
Missed Call   → wf_missed_call   (speed-to-lead text-back)
```

**Cursor sets the stage. GHL does the talking.**

---

## Idempotency Protocol

Before every GHL write, check tags:

```
comet_intake          → skip lead creation
perplexity_scored     → skip re-scoring
ghl_wf_active         → skip workflow enrollment
cursor_stage_set      → skip if target stage matches
stripe_payment_linked → skip Stripe link creation
fulfillment_complete  → skip unless audit finds new gaps
pitch_ready           → skip re-pitch
deal_hunter_2026-06-26 → batch already processed
```

---

## Current Pipeline State (2026-06-26)

### Pitched (GHL wf_03 should be running — DO NOT TOUCH)

| Ref | Company | Offer | Value |
|-----|---------|-------|-------|
| FLA-2026-102 | Jacquin & Sons Construction | Flux Ops Growth | $697/mo + $997 setup |
| FLA-2026-103 | Rooftop Roofing | Pro Site + GBP | $2,500 + $299/mo |
| FLA-2026-104 | Complete Air & Heat | Flux Ops Growth | $697/mo + $997 setup |
| FLA-2026-105 | Fitzpatrick Plumbing | Flux Ops Growth | $697/mo + $997 setup |
| FLA-2026-106 | Packard Roofing | Pro Site + GBP | $2,500 + $299/mo |

**Revenue at stake: $5,000 one-time + $3,288/mo MRR potential**

### Enrichment Queue (Comet must scrape — 6 leads)

ECOR Industries (89), Arnold Air (86), Central Brevard Air (83), K&Y Carpet One (84), Bluecat Carpet (80), Outdoor Kitchens PSL (79)

### Active Clients (12 total — audit needed)

Template complete: FLA-2026-101 (Perfect Client). Remaining 11 need `fulfill_client` audit.

---

## Cursor Agent Schedule (Non-Overlapping)

| Agent | Schedule | Skill | Mode | Enabled |
|-------|----------|-------|------|---------|
| Revenue Digest | Daily 6 AM | deal-orchestrator | digest | ✅ |
| Record Auditor | Daily 7 AM | deal-orchestrator | audit | ✅ |
| Enrichment Queue | Mon/Wed 7 AM | deal-orchestrator | enrichment_queue | ✅ |
| Stripe Close Verify | Every 30 min | deal-orchestrator | verify_close | ✅ |
| Client Fulfillment | Friday 9 AM | client-fulfillment | fulfill all active | ✅ |
| ~~Deal Hunter~~ | ~~Mon 7 AM~~ | ~~deal-hunter~~ | ~~disabled~~ | ❌ Comet owns |
| ~~Warm Lead Closer~~ | ~~Daily 8 AM~~ | ~~deal-machine~~ | ~~disabled~~ | ❌ GHL owns |

---

## Strongest Approach: The Win Race Playbook

### Phase 1: Lock What's Live (Now)
1. **Do not touch** the 5 pitched deals — GHL wf_03 is running
2. **Audit** all 43 GHL-delivered leads for record completeness
3. **Comet scrapes** the 6 enrichment queue leads
4. **Verify** Stripe payments on FLA-2026-102 through 106

### Phase 2: Fulfill Every Client (This Week)
1. Run `fulfill_client` on all 12 active clients
2. Every client gets: complete GHL record + Stripe linked + delivery status
3. Tag `fulfillment_complete` on each

### Phase 3: Close the Pitched (Next 7 Days)
1. GHL wf_03 nurtures the 5 pitched deals
2. Cursor `verify_close` watches Stripe every 30 min
3. On payment → stage to Contract Signed → GHL wf_04 onboard fires
4. Cursor scaffolds flux-web delivery

### Phase 4: Feed the Machine (Ongoing)
1. Comet generates new leads → GHL intake
2. Perplexity scores → GHL custom fields
3. GHL wf_01/02 qualify and trial
4. Cursor assigns contract refs and verifies data
5. Website Stripe collects payment
6. Cursor verifies close and hands off delivery

**Detailed and effective wins the race. Sloppy overlap loses deals.**
