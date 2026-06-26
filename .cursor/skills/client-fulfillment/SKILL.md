---
name: client-fulfillment
description: Ensures every Flux Labs client has complete data for their lifecycle stage. Audits, fills gaps, verifies Stripe and delivery status. Use for "fulfill clients", "complete records", "client audit".
---

# Client Fulfillment — Nobody Gets Left Behind

Every client. Every field. Every stage. Complete.

## Load Config
- `config/client-record-schema.json` — required fields per stage
- `config/flow-ownership.json` — do not overlap with GHL/Comet
- `config/flux-ops-canonical.json` — pricing and IDs

## Fulfillment Lifecycle

```
New Lead → Qualified → Proposal Sent → Contract Signed → In Delivery → Delivered → Active Recurring
   ↓          ↓            ↓               ↓              ↓            ↓              ↓
 wf_01      wf_02          wf_03           wf_04       flux-web     upsell         Stripe sub
(GHL auto) (GHL auto)   (GHL auto)      (GHL auto)   (Cursor)    (GHL auto)    (website)
```

Cursor's job: **make sure the data exists** for each stage transition. GHL and Comet do the rest.

---

## Audit Checklist (Per Client)

### Contact Record
- [ ] firstName, lastName
- [ ] email (valid format)
- [ ] phone (E.164 format: +1XXXXXXXXXX)
- [ ] companyName
- [ ] city, state
- [ ] industry
- [ ] brand_origin (Flux Labs | Flux Ops | Brand Fusion)
- [ ] lead_source
- [ ] service_type
- [ ] ai_qualification_score (if prospect)
- [ ] fla_contract_ref (if proposal+)
- [ ] account_status (if proposal+)
- [ ] post_engagement_track (if contract signed+)
- [ ] apollo_enriched (true/false)

### Opportunity Record
- [ ] pipelineId: RbSKp5WldAzJFgDOwoMO
- [ ] stageId matches actual client status
- [ ] service_type matches offer
- [ ] fla_contract_ref (if proposal+)
- [ ] assignedTo (Jonathan or Heaven)

### Payment Record (Stripe)
- [ ] stripe_customer_id
- [ ] Payment or subscription confirmed for fla_contract_ref
- [ ] Amount matches offer_catalog pricing
- [ ] Metadata includes: fla_contract_ref, ghl_contact_email, service_type, brand_origin

### Delivery Record (if In Delivery+)
- [ ] delivery_sla_start_date (payment date + 0 days)
- [ ] project_repo_url (flux-web branch)
- [ ] hostinger_deploy_target
- [ ] live_site_url (when delivered)
- [ ] delivery_completion_date (when delivered)

### Tags
- [ ] Source tag: comet_intake | perplexity_scored | deal_hunter
- [ ] Stage tag: cursor_stage_set
- [ ] Completion tag: fulfillment_complete

---

## Gap Resolution Order

1. **Phone/email missing** → Apollo find_contact → if fail, flag `comet_scrape_needed`
2. **fla_contract_ref missing at proposal+** → assign next FLA-YYYY-### from tracker
3. **service_type missing** → infer from industry using offer matching in deal-orchestrator
4. **Stripe unlinked** → verify website automation created payment; if not, flag for manual Stripe link
5. **Delivery artifacts missing** → launch Cursor agent on flux-web repo

---

## Active Client Fulfillment Run

For each client in `active_clients.known` + any at Contract Signed or beyond:

1. Run audit checklist
2. Fill gaps via GHL upsert (idempotent)
3. Verify Stripe payment/subscription
4. If In Delivery: confirm flux-web project exists
5. Tag `fulfillment_complete`
6. Post per-client summary to `#sold-clients`

---

## Enrichment Queue (6 Pending Leads)

Process in order of score (highest first):

| # | Company | Score | Blocker | Resolution |
|---|---------|-------|---------|------------|
| 1 | ECOR Industries | 89 | no phone/email | Comet scrape ecorpestcontrol.com |
| 2 | Arnold Air Conditioning | 86 | no phone/email | Comet scrape arnoldair.com |
| 3 | Central Brevard Air & Heat | 83 | no phone/email | Comet scrape centralbrevardair.com |
| 4 | K & Y Carpet One | 84 | no phone/email | Comet scrape kandycarpetonemelbourne.com |
| 5 | Bluecat Carpet Cleaning | 80 | no phone/email | Comet scrape tileandcarpetcleaningpros.com |
| 6 | Outdoor Kitchens PSL | 79 | no phone/email | Comet scrape outdoorkitchensportstlucie.com |

After Comet fills contact info, Cursor upserts to GHL at New Lead. GHL wf_01 handles the rest.

---

## Constraints
- Never mark `fulfillment_complete` with missing required fields
- Never duplicate outreach — check GHL custom fields for existing copy
- Never re-enroll GHL workflows
- Always preserve existing tags when adding new ones
