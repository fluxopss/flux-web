---
name: ghl-stripe-close
description: Close deals through Stripe payment confirmation and auto-advance GHL to Contract Signed. Stage trigger fires wf_04 — never enroll via Zapier. Posts to #war-room first.
---

# GHL + Stripe Close Pipeline

Payment confirmed in Stripe → GHL Contract Signed → wf_04 auto-fires → War Room alert.

**No workflow enrollment via Zapier. No overlap.**

## Validated Fixed Values
Load from `config/flux-ops-canonical.json` and `config/zapier-war-room.json`:
- GHL pipeline: `RbSKp5WldAzJFgDOwoMO`
- Contract Signed stage: `0d285ceb-b13f-4edd-a5e0-9f042ae14bdb`
- Stripe account: `acct_1TQFfvHr9kmD1svX`
- War Room: `C0BDLF5JUQ4`
- Sold clients: `C0AU0M839RD`

## Trigger Conditions
Run when ANY of these occur:
1. Stripe `checkout.session.completed` (via webhook or manual check)
2. Stripe `invoice.paid` for subscription or one-time
3. User says "payment received" with `email` + `fla_contract_ref`
4. `deal-orchestrator` `verify_close` mode

## Actions

```
Stripe MCP: search_stripe_resources (query by metadata fla_contract_ref)
Stripe MCP: fetch_stripe_resources (get payment/invoice details)
ZapierAction[HighLevelCLIAPI:add_update_opportunity](stageId: Contract Signed ONLY — skip if already signed)
war-room-alert(event: deal_closed) → #war-room + GHL SMS to Jonathan + Heaven
Optional: slack_send_message → #sold-clients (after war-room)
```

**NEVER call `HighLevelCLIAPI:campaign`** — wf_04 fires on stage change.

## Runtime Instructions

1. **Verify payment in Stripe** — no payment = stop, post `payment_pending` to `#war-room` only
2. **Pre-check idempotency** — if GHL already Contract Signed, SKIP
3. **Upsert opportunity to Contract Signed** — stage only, no workflow enroll
4. **war-room-alert** — Slack `#war-room` + GHL SMS (deal_closed)
5. **Post to `#sold-clients`** — secondary close summary for fulfillment team
6. **Hand off delivery** if website project

## Constraints
- Never advance without confirmed Stripe payment
- Never enroll wf-04 via Zapier
- Never duplicate if `cursor_stage_set` = contract_signed
- Zapier Slack → `#war-room` first, always
