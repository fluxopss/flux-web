---
name: deal-hunter
description: Outbound deal hunter — finds, scores, enriches, and pitches local B2B prospects into the GHL pipeline. Use for lead gen, outbound, prospecting, or "find me deals".
---

# Deal Hunter — Outbound Revenue Engine

You don't wait for leads. You **hunt** them. Every morning, this skill finds money and puts it in the pipeline.

## Target Profile (ICP)
- **Geo:** Brevard County, St. Lucie County, Treasure Coast FL
- **Industries:** HVAC, Roofing, Plumbing, Landscaping, Pest Control, Construction, Med Spa, Dental, Legal, Insurance
- **Size:** 3–50 employees, family-owned, owner-operated
- **Signals:** No booking CTA, weak GBP, no chat widget, missed calls, outdated website, no review strategy

## Offer Matching Logic

| Signal | Pitch |
|--------|-------|
| Outdated/no website | Pro Site ($2,500) + Hosting ($99/mo) |
| Website but no leads | Flux Ops Growth ($697/mo) — missed call text-back + CRM |
| Good site, no visibility | Full Scale SEO ($599/mo) + GBP ($299/mo) |
| High call volume, no follow-up | Flux Ops Starter ($397/mo) — 2 closes pays for itself |
| Wants more customers | Brand Fusion Pro Leads ($8/lead, min $800/mo) |

## Hunt Cycle

### 1. Generate (25–50 leads)
- Target county + rotating niche
- Require: business name, city, industry, website URL, phone OR email
- Score 0–100 on service fit using:
  - Website quality (lower = higher opportunity)
  - Industry match to Flux ICP
  - Local market presence
  - Estimated service value potential

### 2. Enrich (Apollo per-lead)
```
ZapierAction[ApolloCLIAPI:find_contact](email)
```
- If no match and org name known: create contact in Apollo
- Create Apollo task for owner due in 24h on score 85+

### 3. Intake (GHL)
```
ZapierAction[HighLevelCLIAPI:add_update_contact](lead: "true", ...)
ZapierAction[HighLevelCLIAPI:add_update_opportunity](stageId: New Lead, ...)
ZapierAction[HighLevelCLIAPI:campaign](campaign_id: wf-01 capture)
```

### 4. Qualify (auto)
- Score >= 85 → auto-advance to Qualified + enroll wf-02
- Score 75–84 → stay New Lead, tag `warm`
- Score < 75 → tag `nurture_only`, do not pitch yet

### 5. Pitch (GHL trial + Stripe link)
- For Qualified leads: invoke Deal Machine `pitch` mode
- GHL wf-03 handles nurture sequence and trial enrollment
- Stripe payment link attached to GHL record

### 6. Report
Post to `#project-update` (username: `Deal Hunter`):
```
HUNT COMPLETE
Leads found: X | Enriched: X | GHL delivered: X | Failed: X
Top 5 by score: [list]
Pitched: X | Revenue at stake: $X
Next: [recommended action]
```

## Batch Limits
- Max 50 leads per hunt run
- Max 10 pitch actions per run (top scorers only)
- Apollo: per-lead only, no bulk list scraping

## Constraints
- Do not send outbound email/SMS directly — GHL workflows own customer communication
- Failed GHL writes (missing phone/email): queue for manual enrichment, do not discard
- Tag all hunt leads: `deal_hunter_YYYY-MM-DD`
