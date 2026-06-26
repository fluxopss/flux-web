---
name: war-room-alert
description: Send War Room alerts to Slack #war-room AND SMS to Jonathan + Heaven. Primary SMS via GHL tag trigger; RingCentral backup when permissions fixed.
---

# War Room Alert — Slack + SMS Broadcast

Every important event hits **two channels**: `#war-room` on Slack AND SMS to leadership.

## Config
- `config/war-room-alerts.json` — recipients, templates, triggers
- `automation/war-room-delivery.json` — delivery paths and GHL contact IDs
- `docs/deal-machine/SMS-SETUP.md` — one-time GHL workflow setup

## SMS Recipients (Always Both)
- **Jonathan:** +17728674562 (`jonathan@fluxlab.agency`)
- **Heaven:** +17727754860 (`heaven@fluxlab.agency`)

---

## Alert Function

For every war room event with `event_type` from `alert_triggers`:

### 1. Post to Slack `#war-room` (C0BDLF5JUQ4) — ALWAYS WORKS

Use native Slack MCP:
```
slack_send_message(
  channel_id: "C0BDLF5JUQ4",
  message: <full detailed markdown message>
)
```

Or Zapier fallback:
```
execute_zapier_write_action[SlackCLIAPI:channel_message](
  channel: "C0BDLF5JUQ4", as_bot: "yes", username: "War Room", text: <message>
)
```

### 2. SMS if trigger requires it (check `alert_triggers[event_type].sms`)

**Primary path — GHL tag ping** (works once "War Room SMS Alert" workflow is published):

For EACH internal contact (Jonathan + Heaven):
```
execute_zapier_write_action[HighLevelCLIAPI:add_update_contact](
  lead: "true",
  email: "<jonathan@fluxlab.agency | heaven@fluxlab.agency>",
  firstName, lastName, phone,
  tags: "internal_team,war_room_sms,<role>,war_room_alert_ping"
)
```

The `war_room_alert_ping` tag triggers GHL workflow → SMS to that contact → tag removed.

**Backup path — RingCentral** (blocked until OutboundSMS granted):
```
execute_zapier_write_action[RingCentralCLIAPI:send_sms](
  message_type: "SMS",
  phoneNumberFrom: "+17727427052",
  phoneNumberTo: "<recipient>",
  text: <concise SMS + " -Flux War Room">
)
```

**Backup path — Twilio** (needs Zapier auth):
```
execute_zapier_write_action[TwilioCLIAPI:smsv2](
  to: "<recipient>",
  message: <text>
)
```

---

## SMS Message Rules
- Max 1000 characters
- Lead with event type: `DEAL CLOSED` | `PAYMENT IN` | `PITCHED` | `DIGEST` | `ALERT`
- Include: company, FLA ref, dollar amount when relevant
- End with: `-Flux War Room`

## Template Rendering

Load template from `alert_triggers[event_type].template` and replace:
- `{company}`, `{fla_ref}`, `{amount}`, `{offer}`, `{service_type}`
- `{pitched}`, `{pending_payments}`, `{revenue_at_stake}`, `{fields}`, `{message}`

---

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

---

## Integration Points

All other skills call this skill after their action:
- `deal-orchestrator` verify_close → `deal_closed`
- `deal-orchestrator` sync_stage proposal_sent → `proposal_sent`
- `deal-orchestrator` digest → `daily_digest`
- `client-fulfillment` gap on active → `client_fulfillment_gap`

## Idempotency
- Check GHL tags for `sms_sent_{event_id}` before re-sending
- Do not duplicate SMS for same event within 60 minutes
- `war_room_alert_ping` tag is removed by GHL workflow after send

## Constraints
- Internal team SMS only — never SMS prospects (GHL owns customer SMS)
- Prefer GHL tag ping over RingCentral until OutboundSMS permission fixed
- Always post Slack even if SMS path fails
