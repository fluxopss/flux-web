---
name: ghl-stripe-close
description: Close deals through Stripe payment confirmation and auto-advance GHL to Contract Signed + onboarding. Use when Stripe payment is received or when closing a deal.
---

# GHL + Stripe Close Pipeline

Payment confirmed in Stripe → Deal locked in GHL → Onboarding fires → Team notified. No human required.

## Validated Fixed Values
Load from `config/flux-ops-canonical.json`:
- GHL pipeline: `RbSKp5WldAzJFgDOwoMO`
- Contract Signed stage: `0d285ceb-b13f-4edd-a5e0-9f042ae14bdb`
- Onboarding workflow: `workflow_dbf4fd0b-8339-42b0-a8e9-962335dbe041`
- Stripe account: `acct_1TQFfvHr9kmD1svX`
- Slack sold-clients: `C0AU0M839RD`

## Trigger Conditions
Run when ANY of these occur:
1. Stripe `checkout.session.completed` (via webhook or manual check)
2. Stripe `invoice.paid` for subscription or one-time
3. User says "payment received" with `email` + `fla_contract_ref`
4. Deal Machine `close` mode invoked

## Actions

```
Stripe MCP: search_stripe_resources (query by metadata fla_contract_ref or customer email)
Stripe MCP: fetch_stripe_resources (get payment/invoice details)
ZapierAction[HighLevelCLIAPI:add_update_contact](lead: "true", email, firstName, lastName, service_type, brand_origin, fla_contract_ref, account_status: "active")
ZapierAction[HighLevelCLIAPI:add_update_opportunity](lead: "true", pipelineId: "RbSKp5WldAzJFgDOwoMO", stageId: "0d285ceb-b13f-4edd-a5e0-9f042ae14bdb", email, firstName, lastName, service_type, brand_origin, fla_contract_ref, account_status: "active")
ZapierAction[HighLevelCLIAPI:campaign](campaign_id: "workflow_dbf4fd0b-8339-42b0-a8e9-962335dbe041", email, firstName, lastName, service_type, brand_origin, fla_contract_ref)
ZapierAction[SlackCLIAPI:channel_message](channel: "C0AU0M839RD", as_bot: "yes", username: "Client Ops", add_app_to_channel: "yes", add_edit_link: "no", unfurl: "no", link_names: "yes", text)
```

## Runtime Instructions

1. **Verify payment in Stripe**
   - Search by `fla_contract_ref` in metadata OR customer email
   - Confirm status: `succeeded` (payment_intent) or `paid` (invoice)
   - Extract: amount, currency, recurring vs one-time, customer email

2. **Match to GHL contact**
   - Upsert contact with `account_status: active`
   - Set `fla_contract_ref` on contact

3. **Advance pipeline**
   - Upsert opportunity to **Contract Signed** stage
   - Set `service_type`, `brand_origin`, `post_engagement_track` based on offer

4. **Fire onboarding**
   - Enroll **wf-04 onboard** workflow in GHL
   - GHL handles welcome sequence, intake forms, trial-to-paid transitions

5. **Notify team**
   - Post structured close summary to `#sold-clients`:
     ```
     DEAL CLOSED
     Ref: FLA-2026-###
     Client: [name] | [email]
     Service: [service_type]
     Value: $[amount] [one-time|monthly]
     Stripe: [payment_id]
     GHL: Contract Signed → Onboarding active
     Delivery: [next step]
     ```

6. **Hand off delivery** (if website project)
   - Launch Cursor agent on `flux-web` repo to scaffold client site
   - Target: Hostinger VPS deploy within 2-week SLA

## Stripe Metadata Standard
Every Stripe object MUST include:
```json
{
  "fla_contract_ref": "FLA-2026-###",
  "ghl_contact_email": "client@example.com",
  "service_type": "pro_site",
  "brand_origin": "Flux Labs"
}
```

## Constraints
- Never advance to Contract Signed without confirmed Stripe payment
- Never create duplicate onboarding enrollments — check GHL first
- Keep all GHL writes idempotent via upsert
- Monthly subscriptions: also advance to **Active Recurring** when subscription status is `active`
