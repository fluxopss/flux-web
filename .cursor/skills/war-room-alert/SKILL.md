---
name: war-room-alert
description: Send War Room alerts to Slack #war-room AND SMS to Jonathan + Heaven via GHL. RingCentral is not used for texting.
---

# War Room Alert — Slack + GHL SMS

Every important event hits **two channels**: `#war-room` on Slack AND SMS to leadership via **GHL**.

## Config
- `config/war-room-alerts.json` — recipients, templates, triggers
- `automation/war-room-delivery.json` — delivery paths and GHL contact IDs
- `docs/deal-machine/SMS-SETUP.md` — one-time GHL workflow setup

## SMS Recipients (Always Both)
- **Jonathan:** +17728674562 (`jonathan@fluxlab.agency`)
- **Heaven:** +17727754860 (`heaven@fluxlab.agency`)

**SMS provider:** GHL only. RingCentral texting is not enabled.

---

## Alert Function

For every war room event with `event_type` from `alert_triggers`:

### 1. Post to Slack `#war-room` (C0BDLF5JUQ4)

Use native Slack MCP:
```
slack_send_message(
  channel_id: "C0BDLF5JUQ4",
  message: <full detailed markdown message>
)
```

### 2. SMS via GHL (if trigger requires it)

Requires published GHL workflow **War Room SMS Alert** (trigger: tag `war_room_alert_ping`).

For EACH internal contact (Jonathan + Heaven):
```
execute_zapier_write_action[HighLevelCLIAPI:add_update_contact](
  lead: "true",
  email: "<jonathan@fluxlab.agency | heaven@fluxlab.agency>",
  firstName, lastName, phone,
  tags: "internal_team,war_room_sms,<role>,war_room_alert_ping"
)
```

GHL workflow fires → SMS to that contact → workflow removes `war_room_alert_ping` tag.

---

## SMS Message Rules
- Max 1000 characters in GHL workflow template
- Lead with event type: `DEAL CLOSED` | `PAYMENT IN` | `PITCHED` | `DIGEST` | `ALERT`
- Include: company, FLA ref, dollar amount when relevant
- End with: `-Flux War Room`

## When to SMS (Mandatory)

| Event | SMS |
|-------|-----|
| Deal closed / Contract Signed | ✅ |
| Stripe payment received | ✅ |
| New proposal pitched | ✅ |
| Daily digest (6 AM ET) | ✅ |
| Pitched deal unpaid 48h | ✅ |
| Client fulfillment gap on active client | ✅ |
| System launch / critical ops | ✅ |
| Record audit gaps | ❌ Slack only |
| Enrichment batch complete | ❌ Slack only |

## When to Also Post `#sold-clients` (C0AU0M839RD)
- Deal closed
- Payment received
- Client fulfillment complete
- Onboarding handoff

## Integration Points
- `deal-orchestrator` verify_close → `deal_closed`
- `deal-orchestrator` sync_stage proposal_sent → `proposal_sent`
- `deal-orchestrator` digest → `daily_digest`
- `client-fulfillment` gap on active → `client_fulfillment_gap`

## Constraints
- **GHL owns all SMS** — internal and customer
- **Never use RingCentral** for War Room alerts
- Internal team only via `war_room_alert_ping` tag on internal contacts
- Always post Slack even if GHL SMS fails
- Do not duplicate SMS for same event within 60 minutes
